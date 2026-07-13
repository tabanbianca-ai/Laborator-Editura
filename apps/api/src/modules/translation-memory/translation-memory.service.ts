import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { InMemoryTranslationMemoryRepository } from "./translation-memory.repository";
import {
  type CreateTranslationMemoryEntryInput,
  type ListTranslationMemoryInput,
  type SearchTranslationMemoryInput,
  type TranslationMemoryActor,
  type TranslationMemoryAuditAction,
  type TranslationMemoryEntry,
  type TranslationMemoryMatch,
  type TranslationMemoryMatchType,
  type TranslationMemoryProposal,
  type UpdateTranslationMemoryEntryInput
} from "./translation-memory.types";
import { normalizeTmText, sortTranslationMemoryMatches } from "./translation-memory.utils";

const DEFAULT_SEARCH_LIMIT = 10;
const DEFAULT_SIMILARITY_THRESHOLD = 0.2;

@Injectable()
export class TranslationMemoryService {
  constructor(private readonly repository: InMemoryTranslationMemoryRepository) {}

  async createEntry(
    actor: TranslationMemoryActor,
    input: CreateTranslationMemoryEntryInput
  ): Promise<TranslationMemoryEntry> {
    this.validateActor(actor);
    this.validateCreateInput(input);

    const origin = input.origin ?? "HUMAN";
    const approvalStatus = input.approvalStatus ?? "PENDING";

    if (origin === "AI" && approvalStatus === "APPROVED") {
      throw new BadRequestException("AI suggestions must enter Translation Memory as pending.");
    }

    const now = new Date().toISOString();
    const entry: TranslationMemoryEntry = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      sourceSegmentId: input.sourceSegmentId,
      sourceText: input.sourceText,
      targetText: input.targetText,
      sourceSegment: input.sourceText,
      translatedSegment: input.targetText,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      domain: input.domain,
      context: input.context,
      author: input.author,
      reviewer: input.reviewer,
      approvalDate: input.approvalDate,
      version: input.version ?? 1,
      confidenceScore: input.confidenceScore ?? 1,
      approvalStatus,
      origin,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createEntry(entry);
    await this.audit("CREATE", actor, created.id, undefined, created);
    if (created.approvalStatus === "APPROVED") {
      await this.audit("TRANSLATION_MEMORY_ENTRY_ADDED", actor, created.id, undefined, created);
    }

    return created;
  }

  async updateEntry(
    actor: TranslationMemoryActor,
    entryId: string,
    input: UpdateTranslationMemoryEntryInput
  ): Promise<TranslationMemoryEntry> {
    this.validateActor(actor);

    const existing = await this.repository.findEntryById(entryId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("Translation Memory entry not found.");
    }

    if (existing.origin === "AI" && input.approvalStatus === "APPROVED") {
      throw new BadRequestException("AI suggestions cannot be approved through update.");
    }

    const updated: TranslationMemoryEntry = {
      ...existing,
      targetText: input.targetText ?? existing.targetText,
      translatedSegment: input.targetText ?? existing.translatedSegment,
      domain: input.domain ?? existing.domain,
      confidenceScore: input.confidenceScore ?? existing.confidenceScore,
      approvalStatus: input.approvalStatus ?? existing.approvalStatus,
      metadata: input.metadata ?? existing.metadata,
      updatedAt: new Date().toISOString()
    };

    this.validateConfidenceScore(updated.confidenceScore);

    const saved = await this.repository.updateEntry(updated);
    await this.audit("UPDATE", actor, saved.id, existing, saved);
    if (
      existing.approvalStatus !== "APPROVED" &&
      saved.approvalStatus === "APPROVED"
    ) {
      await this.audit("TRANSLATION_MEMORY_ENTRY_ADDED", actor, saved.id, existing, saved);
    }

    return saved;
  }

  async searchMatches(
    actor: TranslationMemoryActor,
    input: SearchTranslationMemoryInput
  ): Promise<TranslationMemoryMatch[]> {
    this.validateActor(actor);
    this.validateSearchInput(input);

    const entries = await this.repository.searchEntries({
      ...input,
      organizationId: actor.organizationId
    });

    const approvedEntries = entries.filter((entry) => entry.approvalStatus === "APPROVED");
    const matches = sortTranslationMemoryMatches(
      approvedEntries,
      input.sourceText,
      input.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD,
      input.limit ?? DEFAULT_SEARCH_LIMIT
    );

    const typedMatches = matches.map((match) => ({
      ...match,
      matchType: this.resolveMatchType(match.entry, input),
      authoritative: true,
      automaticReplacement: false as const,
      proposalOnly: true as const
    }));

    for (const match of typedMatches) {
      await this.audit("TRANSLATION_MEMORY_REUSED", actor, match.entry.id, match.entry, {
        ...match.entry,
        metadata: {
          ...match.entry.metadata,
          lastConsultedAsProposalAt: new Date().toISOString(),
          lastMatchType: match.matchType,
          lastSimilarityScore: match.similarityScore,
          proposalOnly: true
        }
      });
    }

    return typedMatches;
  }

  async buildProposals(
    actor: TranslationMemoryActor,
    input: SearchTranslationMemoryInput
  ): Promise<TranslationMemoryProposal[]> {
    const matches = await this.searchMatches(actor, input);

    return matches.map((match) => ({
      id: `${match.entry.id}:${match.matchType}`,
      sourceText: input.sourceText,
      proposedTargetText: match.entry.targetText,
      confidenceScore: this.calculateProposalConfidence(match),
      consultedSources: [
        "Translation Memory",
        match.matchType === "CONTEXT" ? "Context match" : `${match.matchType.toLowerCase()} match`
      ],
      glossaryUsed: undefined,
      translationMemoryMatch: match,
      terminologyStatus: "NOT_CHECKED",
      semanticValidation: "SUPPORTING_EVIDENCE",
      explanation:
        `TM proposes this ${match.matchType.toLowerCase()} match because an approved entry exists for ${match.entry.sourceLanguage}->${match.entry.targetLanguage}. It must never replace text automatically.`,
      automaticReplacement: false,
      humanFinalAuthority: true
    }));
  }

  async approveEntry(
    actor: TranslationMemoryActor,
    entryId: string
  ): Promise<TranslationMemoryEntry> {
    this.validateActor(actor);

    const existing = await this.repository.findEntryById(entryId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("Translation Memory entry not found.");
    }

    if (existing.origin === "AI") {
      throw new BadRequestException("AI suggestions cannot be approved directly into TM.");
    }

    const now = new Date().toISOString();
    const approved: TranslationMemoryEntry = {
      ...existing,
      approvalStatus: "APPROVED",
      approvedBy: actor.userId,
      approvedAt: now,
      approvalDate: now,
      reviewer: actor.userId,
      version: existing.version ?? 1,
      updatedAt: now
    };

    const saved = await this.repository.updateEntry(approved);
    await this.audit("APPROVE", actor, saved.id, existing, saved);
    await this.audit("TRANSLATION_MEMORY_ENTRY_ADDED", actor, saved.id, existing, saved);

    return saved;
  }

  async listEntries(
    actor: TranslationMemoryActor,
    input: ListTranslationMemoryInput
  ): Promise<TranslationMemoryEntry[]> {
    this.validateActor(actor);

    if (!input.sourceLanguage || !input.targetLanguage) {
      throw new BadRequestException("sourceLanguage and targetLanguage are required.");
    }

    return this.repository.listEntries({
      ...input,
      organizationId: actor.organizationId
    });
  }

  private async audit(
    action: TranslationMemoryAuditAction,
    actor: TranslationMemoryActor,
    tmEntryId: string,
    beforeState: TranslationMemoryEntry | undefined,
    afterState: TranslationMemoryEntry
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      tmEntryId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private validateActor(actor: TranslationMemoryActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateCreateInput(input: CreateTranslationMemoryEntryInput): void {
    for (const key of ["sourceText", "targetText", "sourceLanguage", "targetLanguage"] as const) {
      if (!input[key]) {
        throw new BadRequestException(`${key} is required.`);
      }
    }

    this.validateConfidenceScore(input.confidenceScore ?? 1);
  }

  private validateSearchInput(input: SearchTranslationMemoryInput): void {
    for (const key of ["sourceText", "sourceLanguage", "targetLanguage"] as const) {
      if (!input[key]) {
        throw new BadRequestException(`${key} is required.`);
      }
    }

    if (input.limit !== undefined && (input.limit < 1 || input.limit > 50)) {
      throw new BadRequestException("limit must be between 1 and 50.");
    }

    if (
      input.similarityThreshold !== undefined &&
      (input.similarityThreshold < 0 || input.similarityThreshold > 1)
    ) {
      throw new BadRequestException("similarityThreshold must be between 0 and 1.");
    }
  }

  private validateConfidenceScore(value: number): void {
    if (value < 0 || value > 1) {
      throw new BadRequestException("confidenceScore must be between 0 and 1.");
    }
  }

  private resolveMatchType(
    entry: TranslationMemoryEntry,
    input: SearchTranslationMemoryInput
  ): TranslationMemoryMatchType {
    if (
      input.context &&
      entry.context &&
      normalizeTmText(input.context) === normalizeTmText(entry.context)
    ) {
      return "CONTEXT";
    }

    if (normalizeTmText(entry.sourceText) === normalizeTmText(input.sourceText)) {
      return "EXACT";
    }

    return "FUZZY";
  }

  private calculateProposalConfidence(match: TranslationMemoryMatch): number {
    const matchWeight = match.matchType === "CONTEXT" ? 1 : match.similarityScore;
    const confidence = match.entry.confidenceScore * 0.6 + matchWeight * 0.4;

    return Math.round(confidence * 10000) / 10000;
  }
}
