import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { InMemoryTerminologyRepository } from "./terminology.repository";
import {
  type CheckSegmentTerminologyInput,
  type CreateTerminologyTermInput,
  type RejectTerminologyTermInput,
  type SearchTerminologyInput,
  type TerminologyActor,
  type TerminologyAuditAction,
  type TerminologyCheckResult,
  type TerminologyTerm,
  type TerminologyViolation,
  type UpdateTerminologyTermInput
} from "./terminology.types";
import {
  buildGovernanceEvaluation,
  containsNonDiacriticVariant
} from "./terminology-governance.utils";
import { includesNormalized, uniqueStrings } from "./terminology.utils";

const HUMAN_TERMINOLOGY_GOVERNANCE_ROLES = new Set(["ADMIN", "REVIEWER"]);

@Injectable()
export class TerminologyService {
  constructor(private readonly repository: InMemoryTerminologyRepository) {}

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
      domain: input.domain
    });

    const violations: TerminologyViolation[] = [];

    for (const term of terms) {
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

    return {
      valid: violations.length === 0,
      violations
    };
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
