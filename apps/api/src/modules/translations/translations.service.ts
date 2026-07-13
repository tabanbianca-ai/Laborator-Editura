import { BadRequestException, Injectable } from "@nestjs/common";
import { validateTranslationTargetV1 } from "@laborator/shared";
import { randomUUID } from "node:crypto";
import { LexicographicService } from "../lexicographic/lexicographic.service";
import { type LexicographicEntryEvidence } from "../lexicographic/lexicographic.types";
import { QaService } from "../qa/qa.service";
import { SemanticFidelityService } from "../semantic-fidelity/semantic-fidelity.service";
import { SegmentsService } from "../segments/segments.service";
import { TerminologyService } from "../terminology/terminology.service";
import { TranslationMemoryService } from "../translation-memory/translation-memory.service";
import { DatabaseTranslationsRepository } from "./translations.repository";
import {
  type SegmentTranslation,
  type SubmitTranslationInput,
  type TranslationActor,
  type TranslationAuditAction,
  type TranslationAuditEvent,
  type TranslationLexicographicSupport
} from "./translations.types";

@Injectable()
export class TranslationsService {
  constructor(
    private readonly repository: DatabaseTranslationsRepository,
    private readonly segmentsService: SegmentsService,
    private readonly lexicographicService: LexicographicService,
    private readonly translationMemoryService: TranslationMemoryService,
    private readonly terminologyService: TerminologyService,
    private readonly qaService: QaService,
    private readonly semanticFidelityService: SemanticFidelityService
  ) {}

  async submitTranslation(
    actor: TranslationActor,
    input: SubmitTranslationInput
  ): Promise<SegmentTranslation> {
    this.validateActor(actor);

    if (!input.segmentId || !input.targetText) {
      throw new BadRequestException("segmentId and targetText are required.");
    }

    const segment = await this.segmentsService.getSegment(actor, input.segmentId);
    this.assertTranslationTargetSupported(segment.targetLanguage, segment.targetLocale);
    const now = new Date().toISOString();
    const translationId = randomUUID();
    const lexicographicEntries = await this.lexicographicService.searchEntries(actor, {
      term: segment.sourceText,
      sourceLanguage: segment.sourceLanguage,
      targetLanguage: segment.targetLanguage,
      limit: 5
    });
    const lexicographicSupport = await this.lexicographicService.describeEntries(
      actor,
      lexicographicEntries
    );
    const translationMemoryProposals = await this.translationMemoryService.buildProposals(actor, {
      sourceText: segment.sourceText,
      sourceLanguage: segment.sourceLanguage,
      targetLanguage: segment.targetLanguage,
      domain: input.domain,
      context: `${segment.documentId}:${segment.id}`,
      limit: 3,
      similarityThreshold: 0.2
    });
    const terminology = await this.terminologyService.checkSegmentText(actor, {
      sourceLanguage: segment.sourceLanguage,
      language: segment.targetLanguage,
      domain: input.domain,
      projectId: segment.projectId,
      ownerUserId: actor.userId,
      sourceText: segment.sourceText,
      targetText: input.targetText
    });
    const qaReport = await this.qaService.runQaOnSegment(actor, {
      projectId: segment.projectId,
      documentId: segment.documentId,
      segmentId: segment.id,
      sourceText: segment.sourceText,
      targetText: input.targetText,
      sourceLanguage: segment.sourceLanguage,
      targetLanguage: segment.targetLanguage,
      domain: input.domain
    });
    const semanticReport = await this.semanticFidelityService.runCheckOnSegment(actor, {
      projectId: segment.projectId,
      documentId: segment.documentId,
      segmentId: segment.id,
      sourceText: segment.sourceText,
      targetText: input.targetText,
      sourceLanguage: segment.sourceLanguage,
      targetLanguage: segment.targetLanguage,
      domain: input.domain
    });
    const translationStatus =
      terminology.valid &&
      qaReport.issueCount === 0 &&
      semanticReport.issueCount === 0
        ? "VALIDATED"
        : "SUBMITTED";
    const tmEntry = translationStatus === "VALIDATED"
      ? await this.translationMemoryService.createEntry(actor, {
        projectId: segment.projectId,
        documentId: segment.documentId,
        sourceSegmentId: segment.id,
        sourceText: segment.sourceText,
        targetText: input.targetText,
        sourceLanguage: segment.sourceLanguage,
        targetLanguage: segment.targetLanguage,
        domain: input.domain,
        context: `${segment.documentId}:${segment.id}`,
        author: this.readStringMetadata(input.metadata, "originalAuthorName"),
        reviewer: actor.userId,
        approvalDate: now,
        confidenceScore: 1,
        approvalStatus: "APPROVED",
        origin: "HUMAN",
        version: 1,
        metadata: {
          translationId,
          validatedTranslationOnly: true,
          proposalOnlyReuse: true
        }
      })
      : null;
    const translation = await this.repository.createTranslation({
      id: translationId,
      organizationId: actor.organizationId,
      projectId: segment.projectId,
      documentId: segment.documentId,
      segmentId: segment.id,
      sourceText: segment.sourceText,
      targetText: input.targetText,
      sourceLanguage: segment.sourceLanguage,
      sourceLocale: segment.sourceLocale,
      targetLanguage: segment.targetLanguage,
      targetLocale: segment.targetLocale,
      status: translationStatus,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      translatorId: actor.userId,
      translatorName: input.translatorName ?? this.readStringMetadata(input.metadata, "translatorName"),
      originalAuthorId: this.readStringMetadata(input.metadata, "originalAuthorId"),
      originalAuthorName: this.readStringMetadata(input.metadata, "originalAuthorName"),
      tmEntryId: tmEntry?.id,
      qaReportId: qaReport.id,
      semanticReportId: semanticReport.id,
      metadata: {
        terminologyValid: terminology.valid,
        terminologyProposalExplanation: terminology.proposalExplanation,
        translationMemoryProposals,
        lexicographicSupport: this.mapLexicographicSupport(lexicographicSupport),
        languagePolicyVersion: "v1.0",
        originalLanguage: segment.sourceLanguage,
        originalLocale: segment.sourceLocale,
        targetLanguage: segment.targetLanguage,
        targetLocale: segment.targetLocale,
        qaScore: qaReport.score,
        semanticScore: semanticReport.score,
        ...input.metadata
      }
    });

    await this.audit("CREATE", actor, translation.id, undefined, translation);
    await this.segmentsService.markTranslated(actor, segment.id, translation.id, input.targetText);

    return translation;
  }

  async listTranslationsByDocument(
    actor: TranslationActor,
    documentId: string
  ): Promise<SegmentTranslation[]> {
    this.validateActor(actor);

    if (!documentId) {
      throw new BadRequestException("documentId is required.");
    }

    return this.repository.listTranslationsByDocument(actor.organizationId, documentId);
  }

  async latestTranslationForSegment(
    actor: TranslationActor,
    segmentId: string
  ): Promise<SegmentTranslation | null> {
    this.validateActor(actor);
    return this.repository.latestTranslationForSegment(actor.organizationId, segmentId);
  }

  getAuditEvents(actor: TranslationActor): TranslationAuditEvent[] {
    this.validateActor(actor);
    return this.repository.getAuditEvents(actor.organizationId);
  }

  private async audit(
    action: TranslationAuditAction,
    actor: TranslationActor,
    entityId: string,
    beforeState: SegmentTranslation | undefined,
    afterState: SegmentTranslation
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      entityType: "SEGMENT_TRANSLATION",
      entityId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private mapLexicographicSupport(
    entries: LexicographicEntryEvidence[]
  ): TranslationLexicographicSupport[] {
    return entries.map((evidence) => ({
      ...evidence,
      priorityRule:
        "validated platform glossary > documented editorial decision > specialized dictionary > academic dictionary > AI suggestion",
      authoritative: false,
      humanFinalAuthority: true
    }));
  }

  private validateActor(actor: TranslationActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private assertTranslationTargetSupported(targetLanguage: string, targetLocale?: string): void {
    const validation = validateTranslationTargetV1({
      targetLanguage,
      targetLocale
    });

    if (!validation.valid) {
      throw new BadRequestException(validation.reason ?? "Unsupported translation target.");
    }
  }

  private readStringMetadata(
    metadata: Record<string, unknown> | undefined,
    key: string
  ): string | undefined {
    const value = metadata?.[key];
    return typeof value === "string" ? value : undefined;
  }
}
