import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CALCIU_SAMHARADZE_DICTIONARY_REFERENCE,
  LEXICOGRAPHIC_PRIORITY_RULE,
  type CompareLexicalSensesInput,
  type CreateDictionaryEntryInput,
  type CreateDictionarySourceInput,
  type DictionaryEntry,
  type DictionarySource,
  type DictionarySourceType,
  type LexicalSense,
  type LexicographicActor,
  type LexicographicAuditAction,
  type LexicographicAuthority,
  type LexicographicAuthorityEvidence,
  type LexicographicCitation,
  type LexicographicCompareResult,
  type LexicographicDecision,
  type LexicographicSenseComparison,
  type SearchDictionaryEntriesInput,
  type ValidateLexicographicTermInput
} from "./lexicographic.types";
import {
  InMemoryLexicographicRepository,
  normalizeLexicalText
} from "./lexicographic.repository";

@Injectable()
export class LexicographicService {
  constructor(private readonly repository: InMemoryLexicographicRepository) {}

  async createSource(
    actor: LexicographicActor,
    input: CreateDictionarySourceInput
  ): Promise<DictionarySource> {
    this.validateActor(actor);

    const normalizedInput = this.applyKnownSourceDefaults(input);
    this.validateSourceInput(normalizedInput);

    const now = new Date().toISOString();
    const source: DictionarySource = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      type: normalizedInput.type,
      catalogKey: normalizedInput.catalogKey,
      title: normalizedInput.title,
      authors: uniqueStrings(normalizedInput.authors),
      sourceLanguages: uniqueStrings(normalizedInput.sourceLanguages),
      targetLanguages: uniqueStrings(normalizedInput.targetLanguages),
      authority: normalizedInput.authority ?? this.defaultAuthorityForSourceType(normalizedInput.type),
      publisher: normalizedInput.publisher,
      publicationYear: normalizedInput.publicationYear,
      sourceReference: normalizedInput.sourceReference,
      citationFormat: normalizedInput.citationFormat,
      notes: normalizedInput.notes,
      createdBy: actor.userId,
      createdAt: now,
      metadata: normalizedInput.metadata
    };

    const created = await this.repository.createSource(source);
    await this.audit("CREATE_SOURCE", actor, "dictionary_source", created.id, undefined, created);

    return created;
  }

  async listSources(actor: LexicographicActor): Promise<DictionarySource[]> {
    this.validateActor(actor);

    const sources = await this.repository.listSources(actor.organizationId);
    await this.audit("LIST_SOURCES", actor, "lexicographic_query", "sources", undefined, {
      count: sources.length
    });

    return sources;
  }

  async createEntry(
    actor: LexicographicActor,
    input: CreateDictionaryEntryInput
  ): Promise<DictionaryEntry> {
    this.validateActor(actor);
    this.validateEntryInput(input);

    const source = await this.repository.findSourceById(input.sourceId, actor.organizationId);

    if (!source) {
      throw new NotFoundException("Dictionary source not found.");
    }

    const now = new Date().toISOString();
    const citations = this.buildCitations(input, now);
    const entry: DictionaryEntry = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      sourceId: source.id,
      term: input.term,
      normalizedTerm: normalizeLexicalText(input.term),
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      senses: this.buildSenses(input, citations),
      citations,
      createdBy: actor.userId,
      createdAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createEntry(entry);
    await this.audit("CREATE_ENTRY", actor, "dictionary_entry", created.id, undefined, created);

    return created;
  }

  async searchEntries(
    actor: LexicographicActor,
    input: SearchDictionaryEntriesInput
  ): Promise<DictionaryEntry[]> {
    this.validateActor(actor);
    this.validateSearchInput(input);

    const entries = await this.repository.searchEntries({
      ...input,
      organizationId: actor.organizationId
    });
    const sorted = await this.sortEntriesByAuthority(actor, entries);

    await this.audit("SEARCH_ENTRIES", actor, "lexicographic_query", input.term, undefined, {
      term: input.term,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      count: sorted.length
    });

    return sorted;
  }

  async compareSenses(
    actor: LexicographicActor,
    input: CompareLexicalSensesInput
  ): Promise<LexicographicCompareResult> {
    this.validateActor(actor);
    this.validateCompareInput(input);

    const entries = input.entryIds && input.entryIds.length > 0
      ? await this.repository.findEntriesByIds(input.entryIds, actor.organizationId)
      : await this.repository.searchEntries({
        term: input.term,
        sourceLanguage: input.sourceLanguage,
        targetLanguage: input.targetLanguage,
        organizationId: actor.organizationId
      });
    const sources = await this.sourceMap(actor.organizationId);
    const comparisons = this.buildSenseComparisons(entries, sources);
    const result: LexicographicCompareResult = {
      term: input.term,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      comparisons,
      priorityRule: LEXICOGRAPHIC_PRIORITY_RULE
    };

    await this.audit("COMPARE_SENSES", actor, "lexicographic_query", input.term, undefined, result);

    return result;
  }

  async validateTerm(
    actor: LexicographicActor,
    input: ValidateLexicographicTermInput
  ): Promise<LexicographicDecision> {
    this.validateActor(actor);
    this.validateTermInput(input);

    const selected = this.selectHighestPriorityEvidence(input.evidences);
    const now = new Date().toISOString();
    const validatedGlossaryPresent = input.evidences.some(
      (evidence) => evidence.authority === "VALIDATED_PLATFORM_GLOSSARY"
    );
    const aiGuard = validatedGlossaryPresent
      ? "AI suggestions must never override validated glossary entries."
      : undefined;
    const decision: LexicographicDecision = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      term: input.term,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      selectedAuthority: selected.authority,
      selectedEntryId: selected.entryId,
      selectedSenseId: selected.senseId,
      decision: input.decision ?? selected.decision ?? selected.authority,
      rationale: [input.rationale, selected.notes, aiGuard]
        .filter((value): value is string => Boolean(value))
        .join(" "),
      priorityRule: LEXICOGRAPHIC_PRIORITY_RULE,
      status: selected.humanApproved === true
        ? "APPROVED_BY_HUMAN"
        : "PENDING_HUMAN_APPROVAL",
      humanFinalAuthority: true,
      decidedBy: actor.userId,
      decidedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createDecision(decision);
    await this.audit(
      "VALIDATE_TERM",
      actor,
      "lexicographic_decision",
      created.id,
      undefined,
      created
    );

    return created;
  }

  private applyKnownSourceDefaults(input: CreateDictionarySourceInput): RequiredKnownSourceInput {
    if (input.catalogKey !== CALCIU_SAMHARADZE_DICTIONARY_REFERENCE.catalogKey) {
      return {
        ...input,
        type: input.type,
        title: input.title,
        authors: input.authors,
        sourceLanguages: input.sourceLanguages,
        targetLanguages: input.targetLanguages
      };
    }

    return {
      ...input,
      type: input.type ?? "BILINGUAL_DICTIONARY",
      title: input.title ?? CALCIU_SAMHARADZE_DICTIONARY_REFERENCE.title,
      authors: input.authors ?? CALCIU_SAMHARADZE_DICTIONARY_REFERENCE.authors,
      sourceLanguages: input.sourceLanguages ?? CALCIU_SAMHARADZE_DICTIONARY_REFERENCE.sourceLanguages,
      targetLanguages: input.targetLanguages ?? CALCIU_SAMHARADZE_DICTIONARY_REFERENCE.targetLanguages,
      authority: input.authority ?? "ACADEMIC_DICTIONARY"
    };
  }

  private validateActor(actor: LexicographicActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateSourceInput(input: RequiredKnownSourceInput): asserts input is ValidSourceInput {
    if (!input.type || !input.title || !input.authors || !input.sourceLanguages) {
      throw new BadRequestException("type, title, authors and sourceLanguages are required.");
    }

    if (input.sourceLanguages.length === 0) {
      throw new BadRequestException("At least one source language is required.");
    }
  }

  private validateEntryInput(input: CreateDictionaryEntryInput): void {
    if (!input.sourceId || !input.term || !input.sourceLanguage) {
      throw new BadRequestException("sourceId, term and sourceLanguage are required.");
    }
  }

  private validateSearchInput(input: SearchDictionaryEntriesInput): void {
    if (!input.term || !input.sourceLanguage) {
      throw new BadRequestException("term and sourceLanguage are required.");
    }

    if (input.limit !== undefined && (input.limit < 1 || input.limit > 100)) {
      throw new BadRequestException("limit must be between 1 and 100.");
    }
  }

  private validateCompareInput(input: CompareLexicalSensesInput): void {
    if (!input.term || !input.sourceLanguage) {
      throw new BadRequestException("term and sourceLanguage are required.");
    }
  }

  private validateTermInput(input: ValidateLexicographicTermInput): void {
    if (
      !input.term ||
      !input.sourceLanguage ||
      !Array.isArray(input.evidences) ||
      input.evidences.length === 0
    ) {
      throw new BadRequestException("term, sourceLanguage and evidences are required.");
    }
  }

  private buildCitations(
    input: CreateDictionaryEntryInput,
    createdAt: string
  ): LexicographicCitation[] {
    return (input.citations ?? []).map((citation) => ({
      id: citation.id ?? randomUUID(),
      sourceId: input.sourceId,
      sourceReference: citation.sourceReference,
      pageOrSection: citation.pageOrSection,
      quote: citation.quote,
      url: citation.url,
      createdAt
    }));
  }

  private buildSenses(
    input: CreateDictionaryEntryInput,
    citations: LexicographicCitation[]
  ): LexicalSense[] {
    const citationIds = citations.map((citation) => citation.id);

    return (input.senses ?? []).map((sense) => ({
      id: sense.id ?? randomUUID(),
      definition: sense.definition,
      sourceLanguage: sense.sourceLanguage ?? input.sourceLanguage,
      targetLanguage: sense.targetLanguage ?? input.targetLanguage,
      translationEquivalents: uniqueStrings(sense.translationEquivalents),
      examples: uniqueStrings(sense.examples),
      domain: sense.domain,
      register: sense.register,
      notes: sense.notes,
      citationIds: uniqueStrings(sense.citationIds ?? citationIds)
    }));
  }

  private async sortEntriesByAuthority(
    actor: LexicographicActor,
    entries: DictionaryEntry[]
  ): Promise<DictionaryEntry[]> {
    const sources = await this.sourceMap(actor.organizationId);

    return [...entries].sort((left, right) => {
      const leftSource = sources.get(left.sourceId);
      const rightSource = sources.get(right.sourceId);

      return this.priorityRank(this.authorityForEntrySource(leftSource)) -
        this.priorityRank(this.authorityForEntrySource(rightSource));
    });
  }

  private buildSenseComparisons(
    entries: DictionaryEntry[],
    sources: Map<string, DictionarySource>
  ): LexicographicSenseComparison[] {
    return entries
      .flatMap((entry) => {
        const source = sources.get(entry.sourceId);
        const authority = this.authorityForEntrySource(source);

        return entry.senses.map((sense) => ({
          entryId: entry.id,
          sourceId: entry.sourceId,
          senseId: sense.id,
          definition: sense.definition,
          translationEquivalents: sense.translationEquivalents,
          authority,
          priorityRank: this.priorityRank(authority),
          citations: entry.citations.filter((citation) => sense.citationIds.includes(citation.id))
        }));
      })
      .sort((left, right) => left.priorityRank - right.priorityRank);
  }

  private selectHighestPriorityEvidence(
    evidences: LexicographicAuthorityEvidence[]
  ): LexicographicAuthorityEvidence {
    const sorted = [...evidences].sort((left, right) => {
      return this.priorityRank(left.authority) - this.priorityRank(right.authority);
    });
    const selected = sorted[0];

    if (!selected) {
      throw new BadRequestException("At least one evidence item is required.");
    }

    return selected;
  }

  private async sourceMap(organizationId: string): Promise<Map<string, DictionarySource>> {
    const sources = await this.repository.listSources(organizationId);

    return new Map(sources.map((source) => [source.id, source]));
  }

  private authorityForEntrySource(source: DictionarySource | undefined): LexicographicAuthority {
    return source?.authority ?? "ACADEMIC_DICTIONARY";
  }

  private defaultAuthorityForSourceType(type: DictionarySourceType): LexicographicAuthority {
    if (type === "SPECIALIZED_SPIRITIST_DICTIONARY") {
      return "SPECIALIZED_DICTIONARY";
    }

    return "ACADEMIC_DICTIONARY";
  }

  private priorityRank(authority: LexicographicAuthority): number {
    const rank = LEXICOGRAPHIC_PRIORITY_RULE.indexOf(authority);

    return rank === -1 ? LEXICOGRAPHIC_PRIORITY_RULE.length : rank;
  }

  private async audit(
    action: LexicographicAuditAction,
    actor: LexicographicActor,
    entityType: "dictionary_entry" | "dictionary_source" | "lexicographic_decision" | "lexicographic_query",
    entityId: string,
    beforeState: object | undefined,
    afterState: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      action,
      actorId: actor.userId,
      entityType,
      entityId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }
}

type RequiredKnownSourceInput = CreateDictionarySourceInput & {
  type?: DictionarySourceType;
  title?: string;
  authors?: string[];
  sourceLanguages?: string[];
  targetLanguages?: string[];
};

type ValidSourceInput = RequiredKnownSourceInput & {
  type: DictionarySourceType;
  title: string;
  authors: string[];
  sourceLanguages: string[];
};

function uniqueStrings(values: string[] | undefined): string[] {
  return [...new Set(values ?? [])].filter((value) => value.length > 0);
}
