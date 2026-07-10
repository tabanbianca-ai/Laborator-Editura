import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CALCIU_SAMHARADZE_DICTIONARY_REFERENCE,
  LINGUISTIC_SOURCE_PRIORITY_RULE,
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
  type LexicographicEntryEvidence,
  type LexicographicSenseComparison,
  type LexicographicSourceConflict,
  type LinguisticAuthorityLevel,
  type LinguisticResourceReadinessReport,
  type SearchDictionaryEntriesInput,
  type ValidateLexicographicTermInput
} from "./lexicographic.types";
import {
  DatabaseLexicographicRepository,
  normalizeLexicalText
} from "./lexicographic.repository";

@Injectable()
export class LexicographicService {
  constructor(private readonly repository: DatabaseLexicographicRepository) {}

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
      projectId: normalizedInput.projectId,
      type: normalizedInput.type,
      catalogKey: normalizedInput.catalogKey,
      title: normalizedInput.title,
      authors: uniqueStrings(normalizedInput.authors),
      language: normalizedInput.language ?? normalizedInput.sourceLanguages[0],
      languagePair: this.languagePair(normalizedInput.sourceLanguages, normalizedInput.targetLanguages),
      sourceLanguages: uniqueStrings(normalizedInput.sourceLanguages),
      targetLanguages: uniqueStrings(normalizedInput.targetLanguages),
      authority: normalizedInput.authority ?? this.defaultAuthorityForSourceType(normalizedInput.type),
      publisher: normalizedInput.publisher,
      publisherOrInstitution: normalizedInput.publisherOrInstitution ?? normalizedInput.publisher,
      issuingInstitution: normalizedInput.issuingInstitution,
      edition: normalizedInput.edition,
      publicationYear: normalizedInput.publicationYear,
      version: normalizedInput.version,
      sourceUrl: normalizedInput.sourceUrl,
      importedDocumentRef: normalizedInput.importedDocumentRef,
      licenseStatus: normalizedInput.licenseStatus ?? "UNKNOWN",
      copyrightHolder: normalizedInput.copyrightHolder,
      redistributionPermission: normalizedInput.redistributionPermission ?? "UNKNOWN",
      authorityLevel: normalizedInput.authorityLevel ?? this.defaultAuthorityLevelForSourceType(normalizedInput.type),
      domain: normalizedInput.domain,
      effectiveDate: normalizedInput.effectiveDate,
      lastVerificationDate: normalizedInput.lastVerificationDate,
      enabled: normalizedInput.enabled ?? true,
      accessMode: normalizedInput.accessMode ?? "INTEGRATED_CONTENT",
      authorizedApiIntegration: normalizedInput.authorizedApiIntegration,
      officialLink: normalizedInput.officialLink ?? normalizedInput.sourceUrl,
      permittedExcerpts: uniqueStrings(normalizedInput.permittedExcerpts),
      accessRestrictions: uniqueStrings(normalizedInput.accessRestrictions),
      licenseNotes: normalizedInput.licenseNotes,
      sourceReference: normalizedInput.sourceReference,
      citationFormat: normalizedInput.citationFormat,
      notes: normalizedInput.notes,
      createdBy: actor.userId,
      createdAt: now,
      metadata: normalizedInput.metadata
    };

    const created = await this.repository.createSource(source);
    await this.audit("CREATE_SOURCE", actor, "dictionary_source", created.id, undefined, created);
    await this.audit("RESOURCE_ADDED", actor, "dictionary_source", created.id, undefined, created);

    return created;
  }

  async updateSource(
    actor: LexicographicActor,
    sourceId: string,
    input: CreateDictionarySourceInput
  ): Promise<DictionarySource> {
    this.validateActor(actor);

    const existing = await this.repository.findSourceById(sourceId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("Dictionary source not found.");
    }

    const updated: DictionarySource = {
      ...existing,
      projectId: input.projectId ?? existing.projectId,
      type: input.type ?? existing.type,
      catalogKey: input.catalogKey ?? existing.catalogKey,
      title: input.title ?? existing.title,
      authors: input.authors ? uniqueStrings(input.authors) : existing.authors,
      language: input.language ?? existing.language,
      sourceLanguages: input.sourceLanguages ? uniqueStrings(input.sourceLanguages) : existing.sourceLanguages,
      targetLanguages: input.targetLanguages ? uniqueStrings(input.targetLanguages) : existing.targetLanguages,
      authority: input.authority ?? existing.authority,
      publisher: input.publisher ?? existing.publisher,
      publisherOrInstitution: input.publisherOrInstitution ?? input.publisher ?? existing.publisherOrInstitution,
      issuingInstitution: input.issuingInstitution ?? existing.issuingInstitution,
      edition: input.edition ?? existing.edition,
      publicationYear: input.publicationYear ?? existing.publicationYear,
      version: input.version ?? existing.version,
      sourceUrl: input.sourceUrl ?? existing.sourceUrl,
      importedDocumentRef: input.importedDocumentRef ?? existing.importedDocumentRef,
      licenseStatus: input.licenseStatus ?? existing.licenseStatus,
      copyrightHolder: input.copyrightHolder ?? existing.copyrightHolder,
      redistributionPermission: input.redistributionPermission ?? existing.redistributionPermission,
      authorityLevel: input.authorityLevel ?? existing.authorityLevel,
      domain: input.domain ?? existing.domain,
      effectiveDate: input.effectiveDate ?? existing.effectiveDate,
      lastVerificationDate: input.lastVerificationDate ?? existing.lastVerificationDate,
      enabled: input.enabled ?? existing.enabled,
      accessMode: input.accessMode ?? existing.accessMode,
      authorizedApiIntegration: input.authorizedApiIntegration ?? existing.authorizedApiIntegration,
      officialLink: input.officialLink ?? input.sourceUrl ?? existing.officialLink,
      permittedExcerpts: input.permittedExcerpts
        ? uniqueStrings(input.permittedExcerpts)
        : existing.permittedExcerpts,
      accessRestrictions: input.accessRestrictions
        ? uniqueStrings(input.accessRestrictions)
        : existing.accessRestrictions,
      licenseNotes: input.licenseNotes ?? existing.licenseNotes,
      sourceReference: input.sourceReference ?? existing.sourceReference,
      citationFormat: input.citationFormat ?? existing.citationFormat,
      notes: input.notes ?? existing.notes,
      metadata: input.metadata ?? existing.metadata
    };
    const withLanguagePair: DictionarySource = {
      ...updated,
      languagePair: this.languagePair(updated.sourceLanguages, updated.targetLanguages)
    };

    const saved = await this.repository.updateSource(withLanguagePair);
    await this.audit("RESOURCE_UPDATED", actor, "dictionary_source", saved.id, existing, saved);

    if (
      existing.licenseStatus !== saved.licenseStatus ||
      existing.redistributionPermission !== saved.redistributionPermission ||
      existing.licenseNotes !== saved.licenseNotes
    ) {
      await this.audit("LICENSE_CHANGED", actor, "dictionary_source", saved.id, existing, saved);
    }

    return saved;
  }

  async disableSource(actor: LexicographicActor, sourceId: string): Promise<DictionarySource> {
    this.validateActor(actor);

    const existing = await this.repository.findSourceById(sourceId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("Dictionary source not found.");
    }

    const disabled: DictionarySource = {
      ...existing,
      enabled: false
    };
    const saved = await this.repository.updateSource(disabled);

    await this.audit("RESOURCE_DISABLED", actor, "dictionary_source", saved.id, existing, saved);

    return saved;
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

    this.assertSourceAllowsEntryImport(source);

    const now = new Date().toISOString();
    const citations = this.buildCitations(input, now);
    const entry: DictionaryEntry = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId ?? source.projectId,
      sourceId: source.id,
      term: input.term,
      headword: input.headword ?? input.term,
      normalizedTerm: normalizeLexicalText(input.term),
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      senses: this.buildSenses(input, citations),
      citations,
      grammaticalCategory: input.grammaticalCategory,
      inflection: input.inflection,
      pronunciation: input.pronunciation,
      usageLabels: uniqueStrings(input.usageLabels),
      idioms: uniqueStrings(input.idioms),
      synonyms: uniqueStrings(input.synonyms),
      antonyms: uniqueStrings(input.antonyms),
      etymology: input.etymology,
      bilingualEquivalents: uniqueStrings(input.bilingualEquivalents),
      sourceEdition: input.sourceEdition ?? source.edition,
      domain: input.domain ?? source.domain,
      createdBy: actor.userId,
      createdAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createEntry(entry);
    await this.audit("CREATE_ENTRY", actor, "dictionary_entry", created.id, undefined, created);
    await this.audit("ENTRY_IMPORTED", actor, "dictionary_entry", created.id, undefined, created);

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
    const sorted = await this.sortEntriesByAuthority(
      actor,
      await this.filterEntriesBySourceMetadata(actor, entries, input)
    );

    await this.audit("SEARCH_ENTRIES", actor, "lexicographic_query", input.term, undefined, {
      term: input.term,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      count: sorted.length
    });
    await this.audit("SOURCE_CONSULTED", actor, "lexicographic_query", input.term, undefined, {
      term: input.term,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      sourceIds: uniqueStrings(sorted.map((entry) => entry.sourceId))
    });

    return sorted;
  }

  async describeEntries(
    actor: LexicographicActor,
    entries: DictionaryEntry[]
  ): Promise<LexicographicEntryEvidence[]> {
    this.validateActor(actor);

    const sources = await this.sourceMap(actor.organizationId);

    return entries.map((entry) => {
      const source = sources.get(entry.sourceId);
      const authority = this.authorityForEntrySource(source);

      return {
        entryId: entry.id,
        sourceId: entry.sourceId,
        term: entry.term,
        sourceLanguage: entry.sourceLanguage,
        targetLanguage: entry.targetLanguage,
        senseIds: entry.senses.map((sense) => sense.id),
        translationEquivalents: uniqueStrings(
          entry.senses.flatMap((sense) => sense.translationEquivalents)
        ),
        sourceReferences: uniqueStrings(
          entry.citations.map((citation) => citation.sourceReference)
        ),
        citations: entry.citations,
        authority,
        authorityLevel: source?.authorityLevel,
        sourceTitle: source?.title,
        sourceEdition: source?.edition ?? entry.sourceEdition,
        publicationYear: source?.publicationYear,
        licenseStatus: source?.licenseStatus,
        accessMode: source?.accessMode,
        lastVerificationDate: source?.lastVerificationDate,
        priorityRank: this.priorityRank(authority),
        authoritative: false,
        humanFinalAuthority: true
      };
    });
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
    const conflicts = this.detectSourceConflicts(input.term, comparisons);
    const result: LexicographicCompareResult = {
      term: input.term,
      sourceLanguage: input.sourceLanguage,
      targetLanguage: input.targetLanguage,
      comparisons,
      priorityRule: LEXICOGRAPHIC_PRIORITY_RULE,
      sourcePriorityRule: LINGUISTIC_SOURCE_PRIORITY_RULE,
      conflicts
    };

    await this.audit("COMPARE_SENSES", actor, "lexicographic_query", input.term, undefined, result);
    if (conflicts.length > 0) {
      await this.audit("DICTIONARY_CONFLICT", actor, "lexicographic_query", input.term, undefined, {
        term: input.term,
        conflicts
      });
    }

    return result;
  }

  async evaluateResourceReadiness(
    actor: LexicographicActor,
    input: { projectId?: string; consultedSourceIds?: string[] } = {}
  ): Promise<LinguisticResourceReadinessReport> {
    this.validateActor(actor);

    const sources = await this.repository.listSources(actor.organizationId);
    const sourceFilter = new Set(input.consultedSourceIds ?? []);
    const relevantSources = sources.filter((source) => {
      return (
        (input.projectId === undefined || source.projectId === input.projectId) &&
        (sourceFilter.size === 0 || sourceFilter.has(source.id))
      );
    });
    const issues = relevantSources.flatMap((source) => {
      const detected = [];

      if (!source.enabled) {
        detected.push({
          sourceId: source.id,
          title: source.title,
          issue: "DISABLED_RESOURCE" as const,
          message: `Linguistic resource "${source.title}" is disabled.`
        });
      }

      if (source.licenseStatus === "UNKNOWN") {
        detected.push({
          sourceId: source.id,
          title: source.title,
          issue: "UNKNOWN_LICENSE" as const,
          message: `Linguistic resource "${source.title}" has unknown license status.`
        });
      }

      if (
        source.licenseStatus === "RESTRICTED" ||
        source.redistributionPermission === "NOT_ALLOWED"
      ) {
        detected.push({
          sourceId: source.id,
          title: source.title,
          issue: "UNAUTHORIZED_SOURCE" as const,
          message: `Linguistic resource "${source.title}" cannot be redistributed or ingested.`
        });
      }

      if (this.isOutdatedVerification(source.lastVerificationDate)) {
        detected.push({
          sourceId: source.id,
          title: source.title,
          issue: "OUTDATED_VERIFICATION" as const,
          message: `Linguistic resource "${source.title}" needs license/source verification.`
        });
      }

      return detected;
    });

    return {
      projectId: input.projectId,
      status: issues.some((issue) => issue.issue === "UNAUTHORIZED_SOURCE")
        ? "BLOCKED"
        : issues.length > 0
          ? "READY_WITH_WARNINGS"
          : "READY",
      consultedSourceIds: uniqueStrings(relevantSources.map((source) => source.id)),
      issues,
      qualityAgentReportsOnly: true,
      humanFinalAuthority: true
    };
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
    await this.audit(
      "TERMINOLOGY_DECISION",
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
      grammaticalCategory: sense.grammaticalCategory ?? input.grammaticalCategory,
      inflection: sense.inflection ?? input.inflection,
      pronunciation: sense.pronunciation ?? input.pronunciation,
      usageLabels: uniqueStrings(sense.usageLabels ?? input.usageLabels),
      idioms: uniqueStrings(sense.idioms ?? input.idioms),
      synonyms: uniqueStrings(sense.synonyms ?? input.synonyms),
      antonyms: uniqueStrings(sense.antonyms ?? input.antonyms),
      etymology: sense.etymology ?? input.etymology,
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

  private async filterEntriesBySourceMetadata(
    actor: LexicographicActor,
    entries: DictionaryEntry[],
    input: SearchDictionaryEntriesInput
  ): Promise<DictionaryEntry[]> {
    const sources = await this.sourceMap(actor.organizationId);

    return entries.filter((entry) => {
      const source = sources.get(entry.sourceId);

      if (!source?.enabled) {
        return false;
      }

      return (
        (input.authorityLevel === undefined || source.authorityLevel === input.authorityLevel) &&
        (input.domain === undefined || entry.domain === input.domain || source.domain === input.domain) &&
        (
          input.languagePair === undefined ||
          `${source.languagePair?.sourceLanguage ?? entry.sourceLanguage}-${source.languagePair?.targetLanguage ?? entry.targetLanguage ?? ""}` === input.languagePair
        )
      );
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

  private detectSourceConflicts(
    term: string,
    comparisons: LexicographicSenseComparison[]
  ): LexicographicSourceConflict[] {
    const definitions = new Set(
      comparisons.map((comparison) => normalizeLexicalText(comparison.definition))
    );
    const authorities = uniqueStrings(comparisons.map((comparison) => comparison.authority));

    if (comparisons.length < 2 || (definitions.size <= 1 && authorities.length <= 1)) {
      return [];
    }

    return [
      {
        term,
        entryIds: uniqueStrings(comparisons.map((comparison) => comparison.entryId)),
        sourceIds: uniqueStrings(comparisons.map((comparison) => comparison.sourceId)),
        authorityLevels: this.authorityLevelsForComparisons(comparisons),
        message:
          "Conflicting dictionary definitions or source authorities require human review; no silent replacement is allowed.",
        humanReviewRequired: true
      }
    ];
  }

  private authorityLevelsForComparisons(
    comparisons: LexicographicSenseComparison[]
  ): LinguisticAuthorityLevel[] {
    const authorityLevels = comparisons
      .map((comparison) => this.authorityLevelForLexicographicAuthority(comparison.authority));

    return LINGUISTIC_SOURCE_PRIORITY_RULE.filter((authorityLevel) =>
      authorityLevels.includes(authorityLevel)
    );
  }

  private authorityLevelForLexicographicAuthority(
    authority: LexicographicAuthority
  ): LinguisticAuthorityLevel {
    switch (authority) {
      case "VALIDATED_PLATFORM_GLOSSARY":
        return "OFFICIAL_NORMATIVE";
      case "DOCUMENTED_EDITORIAL_DECISION":
        return "EDITORIAL_GUIDE";
      case "SPECIALIZED_DICTIONARY":
        return "VALIDATED_SPECIALIZED";
      case "ACADEMIC_DICTIONARY":
        return "ACADEMIC";
      case "AI_SUGGESTION":
        return "INFORMATIVE";
    }
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

  private defaultAuthorityLevelForSourceType(type: DictionarySourceType): LinguisticAuthorityLevel {
    if (
      type === "GRAMMAR_RULES" ||
      type === "ORTHOEPIC_DICTIONARY" ||
      type === "ORTHOGRAPHIC_DICTIONARY" ||
      type === "PUNCTUATION_RULES"
    ) {
      return "OFFICIAL_NORMATIVE";
    }

    if (
      type === "SPECIALIZED_GLOSSARY" ||
      type === "SPECIALIZED_SPIRITIST_DICTIONARY" ||
      type === "TERMINOLOGY_DATABASE"
    ) {
      return "VALIDATED_SPECIALIZED";
    }

    if (type === "EDITORIAL_GUIDE") {
      return "EDITORIAL_GUIDE";
    }

    if (type === "CORPUS" || type === "PHRASEOLOGICAL_DICTIONARY") {
      return "DESCRIPTIVE";
    }

    return "ACADEMIC";
  }

  private assertSourceAllowsEntryImport(source: DictionarySource): void {
    if (!source.enabled) {
      throw new BadRequestException("Dictionary source is disabled.");
    }

    if (
      source.accessMode === "EXTERNAL_CONTROLLED_ACCESS" ||
      source.licenseStatus === "METADATA_ONLY" ||
      source.licenseStatus === "RESTRICTED" ||
      source.redistributionPermission === "NOT_ALLOWED"
    ) {
      throw new BadRequestException(
        "External controlled or restricted linguistic resources cannot ingest full copyrighted dictionary content; store metadata, official links, access restrictions and permitted excerpts only."
      );
    }
  }

  private languagePair(
    sourceLanguages: string[],
    targetLanguages: string[] | undefined
  ): DictionarySource["languagePair"] {
    const sourceLanguage = sourceLanguages[0];
    const targetLanguage = targetLanguages?.[0];

    if (!sourceLanguage || !targetLanguage) {
      return undefined;
    }

    return { sourceLanguage, targetLanguage };
  }

  private isOutdatedVerification(lastVerificationDate: string | undefined): boolean {
    if (!lastVerificationDate) {
      return true;
    }

    const verifiedAt = Date.parse(lastVerificationDate);

    if (Number.isNaN(verifiedAt)) {
      return true;
    }

    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    return Date.now() - verifiedAt > oneYearMs;
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
