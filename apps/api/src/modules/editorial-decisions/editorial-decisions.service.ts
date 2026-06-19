import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { LexicographicService } from "../lexicographic/lexicographic.service";
import { type LexicographicAuthority } from "../lexicographic/lexicographic.types";
import { SemanticFidelityService } from "../semantic-fidelity/semantic-fidelity.service";
import { TerminologyService } from "../terminology/terminology.service";
import { TranslationMemoryService } from "../translation-memory/translation-memory.service";
import { DatabaseEditorialDecisionRepository } from "./editorial-decisions.repository";
import {
  EDITORIAL_DECISION_PRIORITY_RULE,
  type CreateEditorialDecisionRecommendationInput,
  type EditorialDecisionActor,
  type EditorialDecisionAuditAction,
  type EditorialDecisionAuditTrailItem,
  type EditorialDecisionEvidenceSource,
  type EditorialDecisionEvidenceSourceType,
  type EditorialDecisionRecommendation
} from "./editorial-decisions.types";

@Injectable()
export class EditorialDecisionService {
  constructor(
    private readonly repository: DatabaseEditorialDecisionRepository,
    private readonly lexicographicService: LexicographicService,
    private readonly terminologyService: TerminologyService,
    private readonly translationMemoryService: TranslationMemoryService,
    private readonly semanticFidelityService: SemanticFidelityService
  ) {}

  async createRecommendation(
    actor: EditorialDecisionActor,
    input: CreateEditorialDecisionRecommendationInput
  ): Promise<EditorialDecisionRecommendation> {
    this.validateActor(actor);
    this.validateRecommendationInput(input);

    const now = new Date().toISOString();
    const editorialDecisionId = randomUUID();
    const semanticReport = await this.semanticFidelityService.runCheckOnSegment(actor, {
      projectId: input.projectId,
      documentId: input.documentId,
      segmentId: input.segmentId ?? editorialDecisionId,
      sourceText: input.sourceText,
      targetText: input.targetText,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      domain: input.domain
    });
    const terminology = await this.terminologyService.checkSegmentText(actor, {
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      language: input.targetLanguage,
      domain: input.domain,
      sourceText: input.sourceText,
      targetText: input.targetText
    });
    const lexicographicEntries = await this.lexicographicService.searchEntries(actor, {
      term: input.sourceText,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      limit: 5
    });
    const lexicographicEvidence = await this.lexicographicService.describeEntries(
      actor,
      lexicographicEntries
    );
    const tmMatches = await this.translationMemoryService.searchMatches(actor, {
      sourceText: input.sourceText,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      domain: input.domain,
      limit: 3,
      similarityThreshold: 0.2
    });
    const editorialHistory = await this.repository.listApprovedDecisions({
      organizationId: actor.organizationId,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      domain: input.domain
    });
    const evidenceSources = this.sortEvidenceSources([
      ...this.evidenceFromTerminology(terminology),
      ...this.evidenceFromEditorialHistory(editorialHistory),
      ...lexicographicEvidence.map((evidence) => this.evidenceFromLexicographic(evidence)),
      ...tmMatches.map((match) => this.evidenceFromTranslationMemory(match)),
      this.evidenceFromSemanticFidelity(semanticReport),
      this.aiReasoningEvidence()
    ]);
    const alternatives = this.buildAlternatives(
      input.targetText,
      lexicographicEvidence.flatMap((evidence) => evidence.translationEquivalents),
      tmMatches.map((match) => match.entry.targetText)
    );
    const recommendation: EditorialDecisionRecommendation = {
      id: editorialDecisionId,
      organizationId: actor.organizationId,
      editorialDecisionId,
      projectId: input.projectId,
      documentId: input.documentId,
      segmentId: input.segmentId,
      sourceText: input.sourceText,
      targetText: input.targetText,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      domain: input.domain,
      recommendation: this.buildRecommendation(terminology.valid, semanticReport.riskLevel, evidenceSources),
      alternatives,
      rationale: this.buildRationale(evidenceSources),
      confidenceScore: this.calculateConfidenceScore(evidenceSources, semanticReport.score),
      evidenceSources,
      humanApprovalRequired: true,
      approvalStatus: "PENDING_HUMAN_APPROVAL",
      auditTrail: [
        this.auditTrailItem("RECOMMENDATION_CREATED", actor, now, 1, {
          evidenceSourceCount: evidenceSources.length,
          priorityRule: EDITORIAL_DECISION_PRIORITY_RULE
        })
      ],
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createRecommendation(recommendation);
    await this.audit("RECOMMENDATION_CREATED", actor, created.id, undefined, created);

    return created;
  }

  async getRecommendation(
    actor: EditorialDecisionActor,
    editorialDecisionId: string
  ): Promise<EditorialDecisionRecommendation> {
    this.validateActor(actor);

    const recommendation = await this.repository.findRecommendationById(
      editorialDecisionId,
      actor.organizationId
    );

    if (!recommendation) {
      throw new NotFoundException("Editorial decision recommendation not found.");
    }

    return recommendation;
  }

  async approveRecommendation(
    actor: EditorialDecisionActor,
    editorialDecisionId: string
  ): Promise<EditorialDecisionRecommendation> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getRecommendation(actor, editorialDecisionId);
    const now = new Date().toISOString();
    const approved: EditorialDecisionRecommendation = {
      ...existing,
      approvalStatus: "APPROVED",
      approvedBy: actor.userId,
      approvedAt: now,
      version: existing.version + 1,
      updatedAt: now,
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("APPROVED", actor, now, existing.version + 1)
      ]
    };

    const saved = await this.repository.updateRecommendation(approved);
    await this.audit("APPROVED", actor, saved.id, existing, saved);

    return saved;
  }

  async rejectRecommendation(
    actor: EditorialDecisionActor,
    editorialDecisionId: string
  ): Promise<EditorialDecisionRecommendation> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getRecommendation(actor, editorialDecisionId);
    const now = new Date().toISOString();
    const rejected: EditorialDecisionRecommendation = {
      ...existing,
      approvalStatus: "REJECTED",
      version: existing.version + 1,
      updatedAt: now,
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("REJECTED", actor, now, existing.version + 1)
      ]
    };

    const saved = await this.repository.updateRecommendation(rejected);
    await this.audit("REJECTED", actor, saved.id, existing, saved);

    return saved;
  }

  private evidenceFromTerminology(result: Awaited<ReturnType<TerminologyService["checkSegmentText"]>>): EditorialDecisionEvidenceSource[] {
    const glossaryEvidence = result.violations.map<EditorialDecisionEvidenceSource>((violation) => ({
      sourceType: "VALIDATED_GLOSSARY" as const,
      sourceId: violation.termId,
      label: violation.message,
      priorityRank: this.priorityRankForEvidence("VALIDATED_GLOSSARY"),
      authoritative: true,
      humanFinalAuthority: true,
      payload: violation
    }));
    const dictionaryEvidence = (result.dictionaryEvidence ?? []).map<EditorialDecisionEvidenceSource>((evidence) => ({
      sourceType: this.sourceTypeForLexicographicAuthority(evidence.authority),
      sourceId: evidence.entryId,
      label: evidence.term,
      priorityRank: this.priorityRankForEvidence(
        this.sourceTypeForLexicographicAuthority(evidence.authority)
      ),
      authoritative: false,
      humanFinalAuthority: true,
      payload: evidence
    }));

    return [...glossaryEvidence, ...dictionaryEvidence];
  }

  private evidenceFromEditorialHistory(
    decisions: EditorialDecisionRecommendation[]
  ): EditorialDecisionEvidenceSource[] {
    return decisions.map<EditorialDecisionEvidenceSource>((decision) => ({
      sourceType: "EDITORIAL_DECISION",
      sourceId: decision.editorialDecisionId,
      label: decision.recommendation,
      priorityRank: this.priorityRankForEvidence("EDITORIAL_DECISION"),
      authoritative: true,
      humanFinalAuthority: true,
      payload: {
        approvedBy: decision.approvedBy,
        approvedAt: decision.approvedAt,
        version: decision.version
      }
    }));
  }

  private evidenceFromLexicographic(
    evidence: Awaited<ReturnType<LexicographicService["describeEntries"]>>[number]
  ): EditorialDecisionEvidenceSource {
    const sourceType = this.sourceTypeForLexicographicAuthority(evidence.authority);

    return {
      sourceType,
      sourceId: evidence.entryId,
      label: evidence.term,
      priorityRank: this.priorityRankForEvidence(sourceType),
      authoritative: false,
      humanFinalAuthority: true,
      payload: evidence
    };
  }

  private evidenceFromTranslationMemory(
    match: Awaited<ReturnType<TranslationMemoryService["searchMatches"]>>[number]
  ): EditorialDecisionEvidenceSource {
    return {
      sourceType: "TRANSLATION_MEMORY",
      sourceId: match.entry.id,
      label: match.entry.targetText,
      priorityRank: this.priorityRankForEvidence("TRANSLATION_MEMORY"),
      authoritative: match.authoritative,
      humanFinalAuthority: true,
      payload: {
        similarityScore: match.similarityScore,
        confidenceScore: match.entry.confidenceScore
      }
    };
  }

  private evidenceFromSemanticFidelity(
    report: Awaited<ReturnType<SemanticFidelityService["runCheckOnSegment"]>>
  ): EditorialDecisionEvidenceSource {
    return {
      sourceType: "SEMANTIC_FIDELITY",
      sourceId: report.id,
      label: `${report.riskLevel} semantic risk`,
      priorityRank: 5,
      authoritative: false,
      humanFinalAuthority: true,
      payload: {
        score: report.score,
        riskLevel: report.riskLevel,
        issueCount: report.issueCount
      }
    };
  }

  private aiReasoningEvidence(): EditorialDecisionEvidenceSource {
    return {
      sourceType: "AI_REASONING",
      label: "AI reasoning is advisory and cannot approve editorial decisions.",
      priorityRank: this.priorityRankForEvidence("AI_REASONING"),
      authoritative: false,
      humanFinalAuthority: true
    };
  }

  private buildRecommendation(
    terminologyValid: boolean,
    semanticRiskLevel: string,
    evidenceSources: EditorialDecisionEvidenceSource[]
  ): string {
    if (evidenceSources.some((source) => source.sourceType === "VALIDATED_GLOSSARY")) {
      return "Revise according to validated glossary and terminology governance before approval.";
    }

    if (evidenceSources.some((source) => source.sourceType === "EDITORIAL_DECISION")) {
      return "Follow the documented editorial decision unless an authorized human reviewer changes it.";
    }

    if (!terminologyValid || ["HIGH", "CRITICAL"].includes(semanticRiskLevel)) {
      return "Require human semantic review before approval.";
    }

    return "Candidate translation may proceed to authorized human editorial review.";
  }

  private buildAlternatives(
    targetText: string,
    lexicographicAlternatives: string[],
    translationMemoryAlternatives: string[]
  ): string[] {
    return this.uniqueStrings([
      targetText,
      ...lexicographicAlternatives,
      ...translationMemoryAlternatives
    ]).slice(0, 5);
  }

  private buildRationale(evidenceSources: EditorialDecisionEvidenceSource[]): string {
    const strongestEvidence = evidenceSources[0];

    return [
      `Priority rule: ${EDITORIAL_DECISION_PRIORITY_RULE.join(" > ")}.`,
      strongestEvidence
        ? `Strongest evidence: ${strongestEvidence.sourceType}.`
        : "No external evidence was available.",
      "AI may recommend, explain, and validate, but only authorized humans may approve."
    ].join(" ");
  }

  private calculateConfidenceScore(
    evidenceSources: EditorialDecisionEvidenceSource[],
    semanticScore: number
  ): number {
    const evidenceWeight = Math.min(0.45, evidenceSources.length * 0.06);
    const authorityBonus = evidenceSources.some((source) =>
      ["VALIDATED_GLOSSARY", "EDITORIAL_DECISION"].includes(source.sourceType)
    )
      ? 0.2
      : 0;
    const semanticWeight = Math.max(0, Math.min(semanticScore, 100)) / 100 * 0.25;

    return Math.round(Math.min(0.98, 0.25 + evidenceWeight + authorityBonus + semanticWeight) * 100) / 100;
  }

  private sortEvidenceSources(
    evidenceSources: EditorialDecisionEvidenceSource[]
  ): EditorialDecisionEvidenceSource[] {
    return evidenceSources.sort((left, right) => left.priorityRank - right.priorityRank);
  }

  private sourceTypeForLexicographicAuthority(
    authority: LexicographicAuthority
  ): EditorialDecisionEvidenceSourceType {
    if (authority === "VALIDATED_PLATFORM_GLOSSARY") {
      return "VALIDATED_GLOSSARY";
    }

    if (authority === "DOCUMENTED_EDITORIAL_DECISION") {
      return "EDITORIAL_DECISION";
    }

    if (authority === "SPECIALIZED_DICTIONARY") {
      return "SPECIALIZED_DICTIONARY";
    }

    if (authority === "ACADEMIC_DICTIONARY") {
      return "ACADEMIC_DICTIONARY";
    }

    return "AI_REASONING";
  }

  private priorityRankForEvidence(sourceType: EditorialDecisionEvidenceSourceType): number {
    const ranks: Record<EditorialDecisionEvidenceSourceType, number> = {
      VALIDATED_GLOSSARY: 1,
      EDITORIAL_DECISION: 2,
      SPECIALIZED_DICTIONARY: 3,
      ACADEMIC_DICTIONARY: 4,
      TRANSLATION_MEMORY: 5,
      SEMANTIC_FIDELITY: 5,
      AI_REASONING: 6
    };

    return ranks[sourceType];
  }

  private async audit(
    action: EditorialDecisionAuditAction,
    actor: EditorialDecisionActor,
    editorialDecisionId: string,
    beforeState: EditorialDecisionRecommendation | undefined,
    afterState: EditorialDecisionRecommendation
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      editorialDecisionId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private auditTrailItem(
    action: EditorialDecisionAuditAction,
    actor: EditorialDecisionActor,
    at: string,
    version: number,
    details?: object
  ): EditorialDecisionAuditTrailItem {
    return {
      action,
      actorId: actor.userId,
      at,
      version,
      details
    };
  }

  private validateActor(actor: EditorialDecisionActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateRecommendationInput(input: CreateEditorialDecisionRecommendationInput): void {
    for (const key of ["sourceText", "targetText", "sourceLanguage", "targetLanguage"] as const) {
      if (!input[key]) {
        throw new BadRequestException(`${key} is required.`);
      }
    }
  }

  private assertAuthorizedHuman(actor: EditorialDecisionActor): void {
    const permissions = new Set(actor.permissions ?? []);
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (
      !permissions.has("review:approve") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException("Only authorized humans may approve editorial decisions.");
    }
  }

  private uniqueStrings(values: string[]): string[] {
    return [...new Set(values.filter((value) => value.length > 0))];
  }
}
