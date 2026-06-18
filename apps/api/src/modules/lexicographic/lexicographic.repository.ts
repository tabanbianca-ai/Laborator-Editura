import { Injectable } from "@nestjs/common";
import {
  type DictionaryEntry,
  type DictionarySource,
  type LexicographicAuditEvent,
  type LexicographicDecision,
  type LexicographicRepository,
  type SearchDictionaryEntriesInput
} from "./lexicographic.types";

@Injectable()
export class InMemoryLexicographicRepository implements LexicographicRepository {
  private readonly sources = new Map<string, DictionarySource>();
  private readonly entries = new Map<string, DictionaryEntry>();
  private readonly decisions = new Map<string, LexicographicDecision>();
  private readonly auditEvents: LexicographicAuditEvent[] = [];

  async createSource(source: DictionarySource): Promise<DictionarySource> {
    this.sources.set(source.id, source);
    return source;
  }

  async listSources(organizationId: string): Promise<DictionarySource[]> {
    return [...this.sources.values()].filter((source) => source.organizationId === organizationId);
  }

  async findSourceById(id: string, organizationId: string): Promise<DictionarySource | null> {
    const source = this.sources.get(id);

    if (!source || source.organizationId !== organizationId) {
      return null;
    }

    return source;
  }

  async createEntry(entry: DictionaryEntry): Promise<DictionaryEntry> {
    this.entries.set(entry.id, entry);
    return entry;
  }

  async searchEntries(
    input: SearchDictionaryEntriesInput & { organizationId: string }
  ): Promise<DictionaryEntry[]> {
    const normalizedQuery = normalizeLexicalText(input.term);

    return [...this.entries.values()]
      .filter((entry) => {
        return (
          entry.organizationId === input.organizationId &&
          entry.sourceLanguage === input.sourceLanguage &&
          (input.targetLanguage === undefined || entry.targetLanguage === input.targetLanguage) &&
          includesLexicalText(entry.normalizedTerm, normalizedQuery)
        );
      })
      .slice(0, input.limit ?? 50);
  }

  async findEntriesByIds(ids: string[], organizationId: string): Promise<DictionaryEntry[]> {
    const requestedIds = new Set(ids);

    return [...this.entries.values()].filter((entry) => {
      return entry.organizationId === organizationId && requestedIds.has(entry.id);
    });
  }

  async createDecision(decision: LexicographicDecision): Promise<LexicographicDecision> {
    this.decisions.set(decision.id, decision);
    return decision;
  }

  async appendAuditEvent(event: LexicographicAuditEvent): Promise<void> {
    this.auditEvents.push(event);
  }

  getAuditEvents(): LexicographicAuditEvent[] {
    return [...this.auditEvents];
  }
}

export function normalizeLexicalText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .trim();
}

function includesLexicalText(value: string, query: string): boolean {
  return value.includes(query) || query.includes(value);
}
