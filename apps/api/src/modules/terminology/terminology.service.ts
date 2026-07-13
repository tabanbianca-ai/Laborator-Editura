import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { LexicographicService } from "../lexicographic/lexicographic.service";
import { type LexicographicEntryEvidence } from "../lexicographic/lexicographic.types";
import { InMemoryTerminologyRepository } from "./terminology.repository";
import {
  type CheckSegmentTerminologyInput,
  type CreateTerminologyTermInput,
  type GlossaryConflict,
  type GlossaryScope,
  type LinguisticProposalExplanation,
  type LinguisticSourcePriorityItem,
  type ProjectLinguisticSourcePriority,
  type RejectTerminologyTermInput,
  type SearchTerminologyInput,
  type TerminologyActor,
  type TerminologyAuditAction,
  type TerminologyCheckResult,
  type TerminologyDictionaryEvidence,
  type TerminologyTerm,
  type TerminologyViolation,
  type UpdateProjectSourcePriorityInput,
  type UpdateTerminologyTermInput
} from "./terminology.types";
import {
  buildGovernanceEvaluation,
  containsNonDiacriticVariant
} from "./terminology-governance.utils";
import { includesNormalized, uniqueStrings } from "./terminology.utils";

const HUMAN_TERMINOLOGY_GOVERNANCE_ROLES = new Set(["PLATFORM_CREATOR", "ADMIN", "REVIEWER"]);
const GLOSSARY_PRIORITY: GlossaryScope[] = ["PROJECT", "PLATFORM", "PERSONAL"];
const DEFAULT_SOURCE_PRIORITY: LinguisticSourcePriorityItem[] = [
  { id: "official-normative-source", sourceType: "OFFICIAL_NORMATIVE_SOURCE", label: "Official normative source", order: 1, enabled: true },
  { id: "project-glossary", sourceType: "PROJECT_GLOSSARY", label: "Project glossary", order: 2, enabled: true },
  { id: "specialized-glossary", sourceType: "SPECIALIZED_GLOSSARY", label: "Specialized glossary", order: 3, enabled: true },
  { id: "translation-memory", sourceType: "TRANSLATION_MEMORY", label: "Translation Memory", order: 4, enabled: true },
  { id: "bilingual-dictionary", sourceType: "BILINGUAL_DICTIONARY", label: "Bilingual dictionary", order: 5, enabled: true },
  { id: "explanatory-dictionary", sourceType: "EXPLANATORY_DICTIONARY", label: "Explanatory dictionary", order: 6, enabled: true },
  { id: "corpus-examples", sourceType: "CORPUS_EXAMPLES", label: "Corpus/examples", order: 7, enabled: true }
];

@Injectable()
export class TerminologyService {
  constructor(
    private readonly repository: InMemoryTerminologyRepository,
    private readonly lexicographicService: LexicographicService
  ) {}

  async proposeTerm(
    actor: TerminologyActor,
    input: CreateTerminologyTermInput
  ): Promise<TerminologyTerm> {
    return this.createTerm(actor, {
      ...input,
      status: "PROPOSED"
    });
  }

  async createTerm(
    actor: TerminologyActor,
    input: CreateTerminologyTermInput
  ): Promise<TerminologyTerm> {
    this.validateActor(actor);
    if (input.status && input.status !== "PROPOSED") {
      throw new BadRequestException("New terminology entries must start as PROPOSED.");
    }
    this.validateCreateInput(input);

    const now = new Date().toISOString();
    const baseTerm: TerminologyTerm = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      language: input.language,
      domain: input.domain,
      projectId: input.projectId,
      ownerUserId: input.ownerUserId,
      glossaryScope: input.glossaryScope ?? "PLATFORM",
      source: input.source ?? "GLOSSARY",
      term: input.term,
      definition: input.definition,
      approvedTranslation: input.approvedTranslation,
      forbiddenVariants: uniqueStrings(input.forbiddenVariants),
      preferredVariants: uniqueStrings(input.preferredVariants),
      referenceSources: uniqueStrings(input.referenceSources),
      glossaryPresent: input.glossaryPresent,
      editorialApproval: input.editorialApproval,
      historicalUsageCount: input.historicalUsageCount ?? 0,
      qualityScore: 0,
      qualityLevel: "REVIEW_REQUIRED",
      orthographicValidationStatus: "NOT_APPLICABLE",
      diacriticsValidationStatus: "NOT_APPLICABLE",
      sourceValidationStatus: "MISSING_APPROVED_SOURCE",
      governanceDecisionStatus: "PENDING",
      notes: input.notes,
      status: "PROPOSED",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };
    const term: TerminologyTerm = {
      ...baseTerm,
      ...buildGovernanceEvaluation(baseTerm)
    };

    const created = await this.repository.createTerm(term);
    await this.audit("CREATE", actor, created.id, undefined, created);
    await this.audit("GLOSSARY_CREATED", actor, created.id, undefined, created);

    return created;
  }

  async updateTerm(
    actor: TerminologyActor,
    termId: string,
    input: UpdateTerminologyTermInput
  ): Promise<TerminologyTerm> {
    this.validateActor(actor);

    const existing = await this.getTermOrThrow(actor, termId);
    const updated: TerminologyTerm = {
      ...existing,
      domain: input.domain ?? existing.domain,
      projectId: input.projectId ?? existing.projectId,
      ownerUserId: input.ownerUserId ?? existing.ownerUserId,
      glossaryScope: input.glossaryScope ?? existing.glossaryScope,
      source: input.source ?? existing.source,
      term: input.term ?? existing.term,
      definition: input.definition ?? existing.definition,
      approvedTranslation: input.approvedTranslation ?? existing.approvedTranslation,
      forbiddenVariants: input.forbiddenVariants
        ? uniqueStrings(input.forbiddenVariants)
        : existing.forbiddenVariants,
      preferredVariants: input.preferredVariants
        ? uniqueStrings(input.preferredVariants)
        : existing.preferredVariants,
      referenceSources: input.referenceSources
        ? uniqueStrings(input.referenceSources)
        : existing.referenceSources,
      glossaryPresent: input.glossaryPresent ?? existing.glossaryPresent,
      editorialApproval: input.editorialApproval ?? existing.editorialApproval,
      historicalUsageCount: input.historicalUsageCount ?? existing.historicalUsageCount,
      notes: input.notes ?? existing.notes,
      metadata: input.metadata ?? existing.metadata,
      updatedBy: actor.userId,
      updatedAt: new Date().toISOString()
    };
    const evaluated: TerminologyTerm = {
      ...updated,
      ...buildGovernanceEvaluation(updated)
    };

    if (evaluated.status === "VALIDATED") {
      this.assertGovernanceCanBeValidated(evaluated);
    }

    this.validateTermAuthority(evaluated);

    const saved = await this.repository.updateTerm(evaluated);
    await this.audit("UPDATE", actor, saved.id, existing, saved);
    await this.audit("GLOSSARY_UPDATED", actor, saved.id, existing, saved);

    return saved;
  }

  async evaluateTerm(actor: TerminologyActor, termId: string): Promise<TerminologyTerm> {
    this.validateActor(actor);

    const existing = await this.getTermOrThrow(actor, termId);
    const evaluated: TerminologyTerm = {
      ...existing,
      ...buildGovernanceEvaluation(existing),
      evaluatedBy: actor.userId,
      evaluatedAt: new Date().toISOString(),
      updatedBy: actor.userId,
      updatedAt: new Date().toISOString()
    };
    const shouldReview =
      evaluated.sourceValidationStatus === "MISSING_APPROVED_SOURCE" ||
      evaluated.orthographicValidationStatus === "FAILED" ||
      evaluated.diacriticsValidationStatus === "FAILED";
    const status: TerminologyTerm["status"] = shouldReview
      ? "UNDER_REVIEW"
      : evaluated.status;
    const governanceDecisionStatus: TerminologyTerm["governanceDecisionStatus"] =
      shouldReview ? "UNDER_REVIEW" : evaluated.governanceDecisionStatus;
    const governanceEvaluated: TerminologyTerm = {
      ...evaluated,
      status,
      governanceDecisionStatus
    };
    const saved = await this.repository.updateTerm(governanceEvaluated);

    await this.audit("EVALUATE", actor, saved.id, existing, saved);

    return saved;
  }

  async markUnderReview(actor: TerminologyActor, termId: string): Promise<TerminologyTerm> {
    return this.transitionTerm(actor, termId, "UNDER_REVIEW", "MARK_UNDER_REVIEW");
  }

  async validateTerm(actor: TerminologyActor, termId: string): Promise<TerminologyTerm> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getTermOrThrow(actor, termId);
    const now = new Date().toISOString();
    const evaluated: TerminologyTerm = {
      ...existing,
      ...buildGovernanceEvaluation(existing)
    };
    const validated: TerminologyTerm = {
      ...evaluated,
      status: "VALIDATED",
      governanceDecisionStatus: "VALIDATED",
      editorialApproval: true,
      validatedBy: actor.userId,
      validatedAt: now,
      updatedBy: actor.userId,
      updatedAt: now
    };
    const scored: TerminologyTerm = {
      ...validated,
      ...buildGovernanceEvaluation(validated),
      governanceDecisionStatus: "VALIDATED"
    };

    this.assertGovernanceCanBeValidated(scored);
    this.validateTermAuthority(scored);

    const saved = await this.repository.updateTerm(scored);
    await this.audit("VALIDATE", actor, saved.id, existing, saved);

    return saved;
  }

  async rejectTerm(
    actor: TerminologyActor,
    termId: string,
    input: RejectTerminologyTermInput = {}
  ): Promise<TerminologyTerm> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getTermOrThrow(actor, termId);
    const now = new Date().toISOString();
    const rejected: TerminologyTerm = {
      ...existing,
      status: "REJECTED",
      governanceDecisionStatus: "REJECTED",
      rejectedBy: actor.userId,
      rejectedAt: now,
      rejectionReason: input.reason,
      updatedBy: actor.userId,
      updatedAt: now
    };
    const evaluated = buildGovernanceEvaluation(rejected);
    const governanceRejected: TerminologyTerm = {
      ...rejected,
      ...evaluated,
      governanceDecisionStatus: "REJECTED",
      qualityScore: Math.min(evaluated.qualityScore, 49),
      qualityLevel: "REJECTED"
    };
    const saved = await this.repository.updateTerm(governanceRejected);

    await this.audit("REJECT", actor, saved.id, existing, saved);

    return saved;
  }

  async suspendTerm(actor: TerminologyActor, termId: string): Promise<TerminologyTerm> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    return this.transitionTerm(actor, termId, "SUSPENDED", "SUSPEND");
  }

  async archiveTerm(actor: TerminologyActor, termId: string): Promise<TerminologyTerm> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    return this.transitionTerm(actor, termId, "ARCHIVED", "ARCHIVE");
  }

  async searchTerms(
    actor: TerminologyActor,
    input: SearchTerminologyInput
  ): Promise<TerminologyTerm[]> {
    this.validateActor(actor);

    if (!input.language) {
      throw new BadRequestException("language is required.");
    }

    if (input.limit !== undefined && (input.limit < 1 || input.limit > 100)) {
      throw new BadRequestException("limit must be between 1 and 100.");
    }

    return this.repository.searchTerms({
      ...input,
      organizationId: actor.organizationId
    });
  }

  async getProjectSourcePriority(
    actor: TerminologyActor,
    projectId: string
  ): Promise<ProjectLinguisticSourcePriority> {
    this.validateActor(actor);

    if (!projectId) {
      throw new BadRequestException("projectId is required.");
    }

    const existing = await this.repository.getSourcePriority(projectId, actor.organizationId);

    if (existing) {
      return {
        ...existing,
        items: this.normalizeSourcePriorityItems(existing.items)
      };
    }

    return {
      id: `source-priority:${actor.organizationId}:${projectId}`,
      organizationId: actor.organizationId,
      projectId,
      items: this.normalizeSourcePriorityItems(DEFAULT_SOURCE_PRIORITY),
      dragDropOrderingSupported: true,
      updatedBy: actor.userId,
      updatedAt: new Date().toISOString()
    };
  }

  async updateProjectSourcePriority(
    actor: TerminologyActor,
    input: UpdateProjectSourcePriorityInput
  ): Promise<ProjectLinguisticSourcePriority> {
    this.validateActor(actor);

    if (!input.projectId || !Array.isArray(input.items) || input.items.length === 0) {
      throw new BadRequestException("projectId and ordered source priority items are required.");
    }

    const beforeState = await this.repository.getSourcePriority(
      input.projectId,
      actor.organizationId
    );
    const saved = await this.repository.upsertSourcePriority({
      id: beforeState?.id ?? `source-priority:${actor.organizationId}:${input.projectId}`,
      organizationId: actor.organizationId,
      projectId: input.projectId,
      items: this.normalizeSourcePriorityItems(input.items),
      dragDropOrderingSupported: true,
      updatedBy: actor.userId,
      updatedAt: new Date().toISOString()
    });

    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      termId: saved.id,
      action: "SOURCE_PRIORITY_CHANGED",
      actorId: actor.userId,
      beforeState: beforeState ?? undefined,
      afterState: saved,
      createdAt: new Date().toISOString()
    });

    return saved;
  }

  async listTermsRequiringReview(actor: TerminologyActor): Promise<TerminologyTerm[]> {
    this.validateActor(actor);

    return this.repository.listTermsRequiringReview(actor.organizationId);
  }

  async checkSegmentText(
    actor: TerminologyActor,
    input: CheckSegmentTerminologyInput
  ): Promise<TerminologyCheckResult> {
    this.validateActor(actor);

    if (!input.language || !input.sourceText || !input.targetText) {
      throw new BadRequestException("language, sourceText and targetText are required.");
    }

    const terms = await this.repository.listTermsForGovernanceCheck({
      organizationId: actor.organizationId,
      language: input.language,
      domain: input.domain,
      projectId: input.projectId,
      ownerUserId: input.ownerUserId
    });
    const dictionaryEvidence = await this.collectDictionaryEvidence(actor, input, terms);
    const glossaryConflicts = this.detectGlossaryConflicts(terms);
    const sourcePriority = input.projectId
      ? (await this.getProjectSourcePriority(actor, input.projectId)).items
      : this.normalizeSourcePriorityItems(DEFAULT_SOURCE_PRIORITY);

    const violations: TerminologyViolation[] = [];

    for (const term of terms) {
      if (term.glossaryScope === "PERSONAL" && term.status === "VALIDATED") {
        continue;
      }

      if (term.status === "REJECTED" || term.governanceDecisionStatus === "REJECTED") {
        const rejectedValues = [
          term.term,
          term.approvedTranslation,
          ...term.preferredVariants,
          ...term.forbiddenVariants
        ].filter((value): value is string => Boolean(value));
        const targetUsesRejectedTerm = rejectedValues.some((value) =>
          includesNormalized(input.targetText, value)
        );

        if (targetUsesRejectedTerm) {
          violations.push({
            termId: term.id,
            term: term.term,
            type: "REJECTED_TERM",
            message: `Rejected terminology "${term.term}" was used.`,
            authoritative: true,
            severity: "CRITICAL",
            priority: "TERMINOLOGY_GOVERNANCE"
          });
        }

        continue;
      }

      const sourceMentionsTerm = includesNormalized(input.sourceText, term.term);

      if (!sourceMentionsTerm) {
        continue;
      }

      if (
        term.approvedTranslation &&
        !includesNormalized(input.targetText, term.approvedTranslation)
      ) {
        if (containsNonDiacriticVariant(input.targetText, term.approvedTranslation)) {
          violations.push({
            termId: term.id,
            term: term.term,
            type: "MISSING_OR_INCORRECT_DIACRITICS",
            message: `Romanian terminology "${term.approvedTranslation}" is missing or has incorrect diacritics.`,
            authoritative: true,
            severity: "HIGH",
            priority: "TERMINOLOGY_GOVERNANCE"
          });
          continue;
        }

        violations.push({
          termId: term.id,
          term: term.term,
          type: "MISSING_APPROVED_TRANSLATION",
          message: `Validated term "${term.term}" requires approved translation "${term.approvedTranslation}".`,
          authoritative: true,
          severity: "CRITICAL",
          priority: "TERMINOLOGY_VALIDATED"
        });
      }

      for (const forbidden of term.forbiddenVariants) {
        if (includesNormalized(input.targetText, forbidden)) {
          violations.push({
            termId: term.id,
            term: term.term,
            type: "FORBIDDEN_VARIANT",
            message: `Forbidden terminology variant "${forbidden}" was used.`,
            authoritative: true,
            severity: "CRITICAL",
            priority: "TERMINOLOGY_VALIDATED"
          });
        }
      }

      if (
        term.preferredVariants.length > 0 &&
        !term.preferredVariants.some((variant) => includesNormalized(input.targetText, variant))
      ) {
        violations.push({
          termId: term.id,
          term: term.term,
          type: "PREFERRED_VARIANT_AVAILABLE",
          message: `Validated terminology has preferred variants: ${term.preferredVariants.join(", ")}.`,
          authoritative: true,
          severity: "HIGH",
          priority: "TERMINOLOGY_VALIDATED"
        });
      }
    }

    for (const conflict of glossaryConflicts) {
      await this.repository.appendAuditEvent({
        id: randomUUID(),
        organizationId: actor.organizationId,
        termId: conflict.termIds[0] ?? "glossary-conflict",
        action: "GLOSSARY_CONFLICT",
        actorId: actor.userId,
        afterState: conflict,
        createdAt: new Date().toISOString()
      });
    }

    const proposalExplanation = this.buildProposalExplanation(
      terms,
      dictionaryEvidence,
      glossaryConflicts
    );
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      termId: "linguistic-proposal-confidence",
      action: "CONFIDENCE_RECALCULATED",
      actorId: actor.userId,
      afterState: proposalExplanation,
      createdAt: new Date().toISOString()
    });

    return {
      valid: violations.length === 0 && glossaryConflicts.length === 0,
      violations,
      dictionaryEvidence,
      glossaryConflicts,
      glossaryPriority: GLOSSARY_PRIORITY,
      sourcePriority,
      proposalExplanation
    };
  }

  private async collectDictionaryEvidence(
    actor: TerminologyActor,
    input: CheckSegmentTerminologyInput,
    terms: TerminologyTerm[]
  ): Promise<TerminologyDictionaryEvidence[]> {
    const targetLanguage = input.targetLanguage ?? input.language;
    const sourceLanguages = await this.resolveLexicographicSourceLanguages(
      actor,
      input.sourceLanguage,
      targetLanguage
    );
    const queryTexts = uniqueStrings([
      input.sourceText,
      ...terms
        .filter((term) => {
          return (
            includesNormalized(input.sourceText, term.term) ||
            includesNormalized(input.targetText, term.term) ||
            (term.approvedTranslation !== undefined &&
              includesNormalized(input.targetText, term.approvedTranslation))
          );
        })
        .map((term) => term.term)
    ]).slice(0, 6);
    const evidenceByEntryId = new Map<string, TerminologyDictionaryEvidence>();

    for (const queryText of queryTexts) {
      for (const sourceLanguage of sourceLanguages) {
        const entries = await this.lexicographicService.searchEntries(actor, {
          term: queryText,
          sourceLanguage,
          targetLanguage,
          limit: 3
        });
        const describedEntries = await this.lexicographicService.describeEntries(actor, entries);

        for (const evidence of describedEntries.map((entry) => this.mapDictionaryEvidence(entry))) {
          evidenceByEntryId.set(evidence.entryId, evidence);
        }
      }
    }

    return [...evidenceByEntryId.values()];
  }

  private async resolveLexicographicSourceLanguages(
    actor: TerminologyActor,
    sourceLanguage: string | undefined,
    targetLanguage: string
  ): Promise<string[]> {
    if (sourceLanguage) {
      return [sourceLanguage];
    }

    const sources = await this.lexicographicService.listSources(actor);
    const inferredLanguages = sources.flatMap((source) => {
      if (!source.targetLanguages.includes(targetLanguage)) {
        return [];
      }

      return source.sourceLanguages;
    });

    return uniqueStrings([...inferredLanguages, targetLanguage]);
  }

  private mapDictionaryEvidence(entry: LexicographicEntryEvidence): TerminologyDictionaryEvidence {
    return {
      entryId: entry.entryId,
      sourceId: entry.sourceId,
      term: entry.term,
      sourceLanguage: entry.sourceLanguage,
      targetLanguage: entry.targetLanguage,
      senseIds: entry.senseIds,
      translationEquivalents: entry.translationEquivalents,
      sourceReferences: entry.sourceReferences,
      citations: entry.citations,
      authority: entry.authority,
      authorityLevel: entry.authorityLevel,
      sourceTitle: entry.sourceTitle,
      sourceEdition: entry.sourceEdition,
      publicationYear: entry.publicationYear,
      licenseStatus: entry.licenseStatus,
      accessMode: entry.accessMode,
      lastVerificationDate: entry.lastVerificationDate,
      priorityRank: entry.priorityRank,
      priority: "DICTIONARY_EVIDENCE_AFTER_VALIDATED_GLOSSARY",
      authoritative: false,
      humanFinalAuthority: true
    };
  }

  private detectGlossaryConflicts(terms: TerminologyTerm[]): GlossaryConflict[] {
    const validatedTerms = terms.filter((term) => term.status === "VALIDATED");
    const byTerm = new Map<string, TerminologyTerm[]>();

    for (const term of validatedTerms) {
      const key = term.term.trim().toLocaleLowerCase();
      const existing = byTerm.get(key) ?? [];
      existing.push(term);
      byTerm.set(key, existing);
    }

    return [...byTerm.entries()].flatMap(([term, groupedTerms]) => {
      const translations = new Set(
        groupedTerms
          .map((entry) => entry.approvedTranslation)
          .filter((value): value is string => Boolean(value))
          .map((value) => value.trim().toLocaleLowerCase())
      );
      const scopes = new Set(groupedTerms.map((entry) => entry.glossaryScope));

      if (translations.size <= 1 || scopes.size <= 1) {
        return [];
      }

      return [{
        term,
        termIds: groupedTerms.map((entry) => entry.id),
        glossaryScopes: [...scopes],
        message:
          "Glossary conflict requires review because Project, Platform, or Personal glossary entries disagree.",
        humanReviewRequired: true as const
      }];
    });
  }

  private buildProposalExplanation(
    terms: TerminologyTerm[],
    dictionaryEvidence: TerminologyDictionaryEvidence[],
    conflicts: GlossaryConflict[]
  ): LinguisticProposalExplanation {
    const authoritativeTerm = terms.find((term) =>
      term.status === "VALIDATED" && term.glossaryScope !== "PERSONAL"
    );
    const glossaryUsed = authoritativeTerm?.glossaryScope;
    const confidenceScore = this.calculateLinguisticConfidence(
      Boolean(authoritativeTerm),
      dictionaryEvidence.length,
      conflicts.length
    );
    const terminologyStatus = conflicts.length > 0
      ? "CONFLICT_REVIEW_REQUIRED"
      : authoritativeTerm
        ? "VALIDATED"
        : "NO_MATCH";

    return {
      confidenceScore,
      consultedSources: [
        ...(authoritativeTerm ? [`${authoritativeTerm.glossaryScope} glossary`] : []),
        ...(dictionaryEvidence.length > 0 ? ["Lexicographic dictionary evidence"] : [])
      ],
      glossaryUsed,
      terminologyStatus,
      semanticValidation: "NOT_RUN",
      explanation:
        "Linguistic proposal confidence is calculated from glossary hierarchy, consulted dictionary evidence, terminology status, and conflict review requirements.",
      humanFinalAuthority: true
    };
  }

  private calculateLinguisticConfidence(
    hasAuthoritativeGlossary: boolean,
    dictionaryEvidenceCount: number,
    conflictCount: number
  ): number {
    const base = hasAuthoritativeGlossary ? 0.82 : 0.45;
    const evidenceBonus = Math.min(dictionaryEvidenceCount * 0.04, 0.12);
    const conflictPenalty = Math.min(conflictCount * 0.25, 0.5);

    return Math.max(0, Math.min(1, Math.round((base + evidenceBonus - conflictPenalty) * 10000) / 10000));
  }

  private normalizeSourcePriorityItems(
    items: LinguisticSourcePriorityItem[]
  ): LinguisticSourcePriorityItem[] {
    return [...items]
      .map((item, index) => ({
        ...item,
        order: Number.isFinite(item.order) ? item.order : index + 1,
        enabled: item.enabled !== false
      }))
      .sort((left, right) => left.order - right.order)
      .map((item, index) => ({
        ...item,
        order: index + 1
      }));
  }

  private async transitionTerm(
    actor: TerminologyActor,
    termId: string,
    status: "ARCHIVED" | "SUSPENDED" | "UNDER_REVIEW",
    action: "ARCHIVE" | "MARK_UNDER_REVIEW" | "SUSPEND"
  ): Promise<TerminologyTerm> {
    this.validateActor(actor);

    const existing = await this.getTermOrThrow(actor, termId);
    const now = new Date().toISOString();
    const changed: TerminologyTerm = {
      ...existing,
      status,
      governanceDecisionStatus:
        status === "UNDER_REVIEW" ? "UNDER_REVIEW" : status,
      updatedBy: actor.userId,
      updatedAt: now,
      suspendedBy: status === "SUSPENDED" ? actor.userId : existing.suspendedBy,
      suspendedAt: status === "SUSPENDED" ? now : existing.suspendedAt,
      archivedBy: status === "ARCHIVED" ? actor.userId : existing.archivedBy,
      archivedAt: status === "ARCHIVED" ? now : existing.archivedAt
    };

    const saved = await this.repository.updateTerm(changed);
    await this.audit(action, actor, saved.id, existing, saved);

    return saved;
  }

  private async getTermOrThrow(
    actor: TerminologyActor,
    termId: string
  ): Promise<TerminologyTerm> {
    const existing = await this.repository.findTermById(termId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("Terminology term not found.");
    }

    return existing;
  }

  private async audit(
    action: TerminologyAuditAction,
    actor: TerminologyActor,
    termId: string,
    beforeState: TerminologyTerm | undefined,
    afterState: TerminologyTerm
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      termId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private validateActor(actor: TerminologyActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateCreateInput(input: CreateTerminologyTermInput): void {
    if (!input.language || !input.term) {
      throw new BadRequestException("language and term are required.");
    }

    this.validateTermAuthority({
      id: "validation-only",
      organizationId: "validation-only",
      language: input.language,
      domain: input.domain,
      projectId: input.projectId,
      ownerUserId: input.ownerUserId,
      glossaryScope: input.glossaryScope ?? "PLATFORM",
      source: input.source ?? "GLOSSARY",
      term: input.term,
      definition: input.definition,
      approvedTranslation: input.approvedTranslation,
      forbiddenVariants: uniqueStrings(input.forbiddenVariants),
      preferredVariants: uniqueStrings(input.preferredVariants),
      notes: input.notes,
      status: input.status ?? "PROPOSED",
      createdBy: "validation-only",
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      referenceSources: uniqueStrings(input.referenceSources),
      glossaryPresent: input.glossaryPresent,
      editorialApproval: input.editorialApproval,
      historicalUsageCount: input.historicalUsageCount ?? 0,
      qualityScore: 0,
      qualityLevel: "REVIEW_REQUIRED",
      orthographicValidationStatus: "NOT_APPLICABLE",
      diacriticsValidationStatus: "NOT_APPLICABLE",
      sourceValidationStatus: "MISSING_APPROVED_SOURCE",
      governanceDecisionStatus: "PENDING"
    });
  }

  private validateTermAuthority(term: TerminologyTerm): void {
    if (
      term.status === "VALIDATED" &&
      !term.approvedTranslation &&
      term.preferredVariants.length === 0
    ) {
      throw new BadRequestException(
        "VALIDATED terms require an approved translation or preferred variant."
      );
    }
  }

  private assertGovernanceCanBeValidated(term: TerminologyTerm): void {
    if (
      term.orthographicValidationStatus === "FAILED" ||
      term.diacriticsValidationStatus === "FAILED"
    ) {
      throw new BadRequestException(
        "Terminology cannot be validated while orthographic or diacritics validation fails."
      );
    }

    if (term.sourceValidationStatus === "MISSING_APPROVED_SOURCE") {
      throw new BadRequestException(
        "Terminology cannot be validated without an approved source or reference source."
      );
    }
  }

  private assertAuthorizedHuman(actor: TerminologyActor): void {
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (![...HUMAN_TERMINOLOGY_GOVERNANCE_ROLES].some((role) => roles.has(role))) {
      throw new ForbiddenException(
        "Only authorized human users may validate, suspend, archive, or reject terminology."
      );
    }
  }
}
