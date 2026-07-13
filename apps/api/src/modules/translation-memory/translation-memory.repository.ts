import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { randomUUID } from "node:crypto";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type ListTranslationMemoryInput,
  type SearchTranslationMemoryInput,
  type TranslationMemoryAuditEvent,
  type TranslationMemoryEntry,
  type TranslationMemoryRepository
} from "./translation-memory.types";

@Injectable()
export class InMemoryTranslationMemoryRepository implements TranslationMemoryRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createEntry(entry: TranslationMemoryEntry): Promise<TranslationMemoryEntry> {
    return this.database.insert("translation_memory_entries", entry);
  }

  async updateEntry(entry: TranslationMemoryEntry): Promise<TranslationMemoryEntry> {
    return this.database.upsert("translation_memory_entries", entry);
  }

  async findEntryById(
    id: string,
    organizationId: string
  ): Promise<TranslationMemoryEntry | null> {
    return this.database.findByIdForTenant<TranslationMemoryEntry>(
      "translation_memory_entries",
      id,
      organizationId
    );
  }

  async searchEntries(
    input: SearchTranslationMemoryInput & { organizationId: string }
  ): Promise<TranslationMemoryEntry[]> {
    return this.database
      .selectForTenant<TranslationMemoryEntry>(
        "translation_memory_entries",
        input.organizationId
      )
      .filter((entry) => {
      return (
        entry.sourceLanguage === input.sourceLanguage &&
        entry.targetLanguage === input.targetLanguage &&
        (input.domain === undefined || entry.domain === input.domain)
      );
    });
  }

  async listEntries(
    input: ListTranslationMemoryInput & { organizationId: string }
  ): Promise<TranslationMemoryEntry[]> {
    return this.database
      .selectForTenant<TranslationMemoryEntry>(
        "translation_memory_entries",
        input.organizationId
      )
      .filter((entry) => {
      const approvalAllowed = input.includePending || entry.approvalStatus === "APPROVED";

      return (
        approvalAllowed &&
        entry.sourceLanguage === input.sourceLanguage &&
        entry.targetLanguage === input.targetLanguage &&
        (input.domain === undefined || entry.domain === input.domain)
      );
    });
  }

  async appendAuditEvent(event: TranslationMemoryAuditEvent): Promise<void> {
    this.database.insert("translation_memory_audit_events", event);
  }

  createId(): string {
    return randomUUID();
  }

  getAuditEvents(): TranslationMemoryAuditEvent[] {
    return this.database.select<TranslationMemoryAuditEvent>("translation_memory_audit_events");
  }
}
