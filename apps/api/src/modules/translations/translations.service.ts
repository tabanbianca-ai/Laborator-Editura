import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
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
  type TranslationAuditEvent
} from "./translations.types";

@Injectable()
export class TranslationsService {
  constructor(
    private readonly repository: DatabaseTranslationsRepository,
    private readonly segmentsService: SegmentsService,
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
    const now = new Date().toISOString();
    const translationId = randomUUID();
    const tmEntry = await this.translationMemoryService.createEntry(actor, {
      projectId: segment.projectId,
      documentId: segment.documentId,
      sourceSegmentId: segment.id,
      sourceText: segment.sourceText,
      targetText: input.targetText,
      sourceLanguage: segment.sourceLanguage,
      targetLanguage: segment.targetLanguage,
      domain: input.domain,
      confidenceScore: 1,
      approvalStatus: "PENDING",
      origin: "HUMAN",
      metadata: {
        translationId
      }
    });
    const terminology = await this.terminologyService.checkSegmentText(actor, {
      language: segment.targetLanguage,
      domain: input.domain,
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
    const translation = await this.repository.createTranslation({
      id: translationId,
      organizationId: actor.organizationId,
      projectId: segment.projectId,
      documentId: segment.documentId,
      segmentId: segment.id,
      sourceText: segment.sourceText,
      targetText: input.targetText,
      sourceLanguage: segment.sourceLanguage,
      targetLanguage: segment.targetLanguage,
      status:
        terminology.valid &&
        qaReport.issueCount === 0 &&
        semanticReport.issueCount === 0
          ? "VALIDATED"
          : "SUBMITTED",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      tmEntryId: tmEntry.id,
      qaReportId: qaReport.id,
      semanticReportId: semanticReport.id,
      metadata: {
        terminologyValid: terminology.valid,
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

  private validateActor(actor: TranslationActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }
}
