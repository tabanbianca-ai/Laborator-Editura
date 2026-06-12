import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  type ListTranslationMemoryInput,
  type SearchTranslationMemoryInput,
  type TranslationMemoryAuditEvent,
  type TranslationMemoryEntry,
  type TranslationMemoryRepository
} from "./translation-memory.types";

@Injectable()
export class InMemoryTranslationMemoryRepository implements TranslationMemoryRepository {
  private readonly entries = new Map<string, TranslationMemoryEntry>();
  private readonly auditEvents: TranslationMemoryAuditEvent[] = [];

  async createEntry(entry: TranslationMemoryEntry): Promise<TranslationMemoryEntry> {
    this.entries.set(entry.id, entry);
    return entry;
  }

  async updateEntry(entry: TranslationMemoryEntry): Promise<TranslationMemoryEntry> {
    this.entries.set(entry.id, entry);
    return entry;
  }

  async findEntryById(
    id: string,
    organizationId: string
  ): Promise<TranslationMemoryEntry | null> {
    const entry = this.entries.get(id);

    if (!entry || entry.organizationId !== organizationId) {
      return null;
    }

    return entry;
  }

  async searchEntries(
    input: SearchTranslationMemoryInput & { organizationId: string }
  ): Promise<TranslationMemoryEntry[]> {
    return [...this.entries.values()].filter((entry) => {
      return (
        entry.organizationId === input.organizationId &&
        entry.sourceLanguage === input.sourceLanguage &&
        entry.targetLanguage === input.targetLanguage &&
        (input.domain === undefined || entry.domain === input.domain)
      );
    });
  }

  async listEntries(
    input: ListTranslationMemoryInput & { organizationId: string }
  ): Promise<TranslationMemoryEntry[]> {
    return [...this.entries.values()].filter((entry) => {
      const approvalAllowed = input.includePending || entry.approvalStatus === "APPROVED";

      return (
        approvalAllowed &&
        entry.organizationId === input.organizationId &&
        entry.sourceLanguage === input.sourceLanguage &&
        entry.targetLanguage === input.targetLanguage &&
        (input.domain === undefined || entry.domain === input.domain)
      );
    });
  }

  async appendAuditEvent(event: TranslationMemoryAuditEvent): Promise<void> {
    this.auditEvents.push(event);
  }

  createId(): string {
    return randomUUID();
  }

  getAuditEvents(): TranslationMemoryAuditEvent[] {
    return [...this.auditEvents];
  }
}
