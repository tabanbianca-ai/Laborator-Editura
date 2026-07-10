import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type DictionaryEntry,
  type DictionarySource,
  type LexicographicAuditEvent,
  type LexicographicDecision,
  type LexicographicRepository,
  type SearchDictionaryEntriesInput
} from "./lexicographic.types";

@Injectable()
export class DatabaseLexicographicRepository implements LexicographicRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createSource(source: DictionarySource): Promise<DictionarySource> {
    return this.database.insert("lexicographic_sources", source);
  }

  async updateSource(source: DictionarySource): Promise<DictionarySource> {
    return this.database.upsert("lexicographic_sources", source);
  }

  async listSources(organizationId: string): Promise<DictionarySource[]> {
    return this.database.selectForTenant<DictionarySource>("lexicographic_sources", organizationId);
  }

  async findSourceById(id: string, organizationId: string): Promise<DictionarySource | null> {
    return this.database.findByIdForTenant<DictionarySource>(
      "lexicographic_sources",
      id,
      organizationId
    );
  }

  async createEntry(entry: DictionaryEntry): Promise<DictionaryEntry> {
    return this.database.insert("lexicographic_entries", entry);
  }

  async searchEntries(
    input: SearchDictionaryEntriesInput & { organizationId: string }
  ): Promise<DictionaryEntry[]> {
    const normalizedQuery = normalizeLexicalText(input.term);

    return this.database
      .selectForTenant<DictionaryEntry>("lexicographic_entries", input.organizationId)
      .filter((entry) => {
        return (
          (input.projectId === undefined || entry.projectId === input.projectId) &&
          (input.sourceId === undefined || entry.sourceId === input.sourceId) &&
          entry.sourceLanguage === input.sourceLanguage &&
          (
            input.targetLanguage === undefined ||
            entry.targetLanguage === undefined ||
            entry.targetLanguage === input.targetLanguage
          ) &&
          (input.domain === undefined || entry.domain === input.domain) &&
          (
            input.grammaticalCategory === undefined ||
            entry.grammaticalCategory === input.grammaticalCategory ||
            entry.senses.some((sense) => sense.grammaticalCategory === input.grammaticalCategory)
          ) &&
          (input.edition === undefined || entry.sourceEdition === input.edition) &&
          matchesLexicalTerm(entry, normalizedQuery, input.searchMode)
        );
      })
      .slice(0, input.limit ?? 50);
  }

  async findEntriesByIds(ids: string[], organizationId: string): Promise<DictionaryEntry[]> {
    const requestedIds = new Set(ids);

    return this.database.selectForTenant<DictionaryEntry>(
      "lexicographic_entries",
      organizationId,
      (entry) => requestedIds.has(entry.id)
    );
  }

  async createDecision(decision: LexicographicDecision): Promise<LexicographicDecision> {
    return this.database.insert("lexicographic_decisions", decision);
  }

  async appendAuditEvent(event: LexicographicAuditEvent): Promise<void> {
    this.database.insert("lexicographic_audit_events", event);
  }

  getAuditEvents(organizationId?: string): LexicographicAuditEvent[] {
    if (organizationId) {
      return this.database.selectForTenant<LexicographicAuditEvent>(
        "lexicographic_audit_events",
        organizationId
      );
    }

    return this.database.select<LexicographicAuditEvent>("lexicographic_audit_events");
  }
}

export function normalizeLexicalText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .toLocaleLowerCase()
    .trim();
}

export function matchesLexicalTerm(
  entry: Pick<DictionaryEntry, "antonyms" | "bilingualEquivalents" | "headword" | "idioms" | "normalizedTerm" | "senses" | "synonyms" | "term">,
  queryText: string,
  searchMode: SearchDictionaryEntriesInput["searchMode"] = "NORMALIZED"
): boolean {
  const normalizedTerm = normalizeLexicalText(entry.normalizedTerm);
  const normalizedQuery = normalizeLexicalText(queryText);

  if (!normalizedTerm || !normalizedQuery) {
    return false;
  }

  const candidates = [
    entry.term,
    entry.headword,
    entry.normalizedTerm,
    ...(entry.idioms ?? []),
    ...(entry.synonyms ?? []),
    ...(entry.antonyms ?? []),
    ...(entry.bilingualEquivalents ?? []),
    ...entry.senses.flatMap((sense) => [
      sense.definition,
      ...sense.examples,
      ...(sense.idioms ?? []),
      ...(sense.synonyms ?? []),
      ...(sense.antonyms ?? []),
      ...sense.translationEquivalents
    ])
  ].filter((value): value is string => Boolean(value));

  return candidates.some((candidate) => {
    const normalizedCandidate = normalizeLexicalText(candidate);

    if (!normalizedCandidate) {
      return false;
    }

    if (normalizedCandidate === normalizedQuery) {
      return true;
    }

    if (searchMode === "EXACT") {
      return false;
    }

    if (
      hasTokenSafeOccurrence(normalizedQuery, normalizedCandidate) ||
      hasTokenSafeOccurrence(normalizedCandidate, normalizedQuery)
    ) {
      return true;
    }

    if (searchMode === "FUZZY" || searchMode === "MORPHOLOGICAL") {
      return isFuzzyLexicalMatch(normalizedCandidate, normalizedQuery);
    }

    return false;
  });
}

function hasTokenSafeOccurrence(text: string, term: string): boolean {
  const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s)${escapedTerm}(?:\\s|$)`, "u").test(text);
}

function isFuzzyLexicalMatch(left: string, right: string): boolean {
  if (left.length < 4 || right.length < 4) {
    return false;
  }

  return left.startsWith(right.slice(0, Math.min(5, right.length))) ||
    right.startsWith(left.slice(0, Math.min(5, left.length))) ||
    singularLike(left) === singularLike(right);
}

function singularLike(value: string): string {
  return value.replace(/(ilor|elor|ului|ului|uri|ele|ile|ii|ul|le|s)$/u, "");
}
