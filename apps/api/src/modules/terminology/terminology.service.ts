import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { InMemoryTerminologyRepository } from "./terminology.repository";
import {
  type CheckSegmentTerminologyInput,
  type CreateTerminologyTermInput,
  type SearchTerminologyInput,
  type TerminologyActor,
  type TerminologyAuditAction,
  type TerminologyCheckResult,
  type TerminologyTerm,
  type TerminologyViolation,
  type UpdateTerminologyTermInput
} from "./terminology.types";
import { includesNormalized, uniqueStrings } from "./terminology.utils";

@Injectable()
export class TerminologyService {
  constructor(private readonly repository: InMemoryTerminologyRepository) {}

  async createTerm(
    actor: TerminologyActor,
    input: CreateTerminologyTermInput
  ): Promise<TerminologyTerm> {
    this.validateActor(actor);
    this.validateCreateInput(input);

    const now = new Date().toISOString();
    const status = input.status ?? "PROPOSED";
    const term: TerminologyTerm = {
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
      notes: input.notes,
      status,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    if (status === "VALIDATED") {
      throw new BadRequestException("Terms must be validated through validateTerm.");
    }

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
      notes: input.notes ?? existing.notes,
      metadata: input.metadata ?? existing.metadata,
      updatedBy: actor.userId,
      updatedAt: new Date().toISOString()
    };

    this.validateTermAuthority(updated);

    const saved = await this.repository.updateTerm(updated);
    await this.audit("UPDATE", actor, saved.id, existing, saved);

    return saved;
  }

  async validateTerm(actor: TerminologyActor, termId: string): Promise<TerminologyTerm> {
    this.validateActor(actor);

    const existing = await this.getTermOrThrow(actor, termId);
    const now = new Date().toISOString();
    const validated: TerminologyTerm = {
      ...existing,
      status: "VALIDATED",
      validatedBy: actor.userId,
      validatedAt: now,
      updatedBy: actor.userId,
      updatedAt: now
    };

    this.validateTermAuthority(validated);

    const saved = await this.repository.updateTerm(validated);
    await this.audit("VALIDATE", actor, saved.id, existing, saved);

    return saved;
  }

  async suspendTerm(actor: TerminologyActor, termId: string): Promise<TerminologyTerm> {
    return this.transitionTerm(actor, termId, "SUSPENDED", "SUSPEND");
  }

  async archiveTerm(actor: TerminologyActor, termId: string): Promise<TerminologyTerm> {
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

  async checkSegmentText(
    actor: TerminologyActor,
    input: CheckSegmentTerminologyInput
  ): Promise<TerminologyCheckResult> {
    this.validateActor(actor);

    if (!input.language || !input.sourceText || !input.targetText) {
      throw new BadRequestException("language, sourceText and targetText are required.");
    }

    const terms = await this.repository.listValidatedTerms({
      organizationId: actor.organizationId,
      language: input.language,
      domain: input.domain
    });

    const violations: TerminologyViolation[] = [];

    for (const term of terms) {
      const sourceMentionsTerm = includesNormalized(input.sourceText, term.term);

      if (!sourceMentionsTerm) {
        continue;
      }

      if (
        term.approvedTranslation &&
        !includesNormalized(input.targetText, term.approvedTranslation)
      ) {
        violations.push({
          termId: term.id,
          term: term.term,
          type: "MISSING_APPROVED_TRANSLATION",
          message: `Validated term "${term.term}" requires approved translation "${term.approvedTranslation}".`,
          authoritative: true,
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
    status: "SUSPENDED" | "ARCHIVED",
    action: "SUSPEND" | "ARCHIVE"
  ): Promise<TerminologyTerm> {
    this.validateActor(actor);

    const existing = await this.getTermOrThrow(actor, termId);
    const now = new Date().toISOString();
    const changed: TerminologyTerm = {
      ...existing,
      status,
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
      updatedAt: new Date(0).toISOString()
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
}
