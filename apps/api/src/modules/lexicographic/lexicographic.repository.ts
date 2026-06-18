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
          entry.sourceLanguage === input.sourceLanguage &&
          (
            input.targetLanguage === undefined ||
            entry.targetLanguage === undefined ||
            entry.targetLanguage === input.targetLanguage
          ) &&
          matchesLexicalTerm(entry.normalizedTerm, normalizedQuery)
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

export function matchesLexicalTerm(entryTerm: string, queryText: string): boolean {
  const normalizedTerm = normalizeLexicalText(entryTerm);
  const normalizedQuery = normalizeLexicalText(queryText);

  if (!normalizedTerm || !normalizedQuery) {
    return false;
  }

  return normalizedTerm === normalizedQuery ||
    hasTokenSafeOccurrence(normalizedQuery, normalizedTerm) ||
    hasTokenSafeOccurrence(normalizedTerm, normalizedQuery);
}

function hasTokenSafeOccurrence(text: string, term: string): boolean {
  const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s)${escapedTerm}(?:\\s|$)`, "u").test(text);
}
