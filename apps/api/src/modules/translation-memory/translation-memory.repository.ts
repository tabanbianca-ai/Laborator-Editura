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
import { buildTranslationMemoryIdentityKey } from "./translation-memory.utils";

export const TRANSLATION_MEMORY_DUPLICATE_MESSAGE =
  "Translation Memory entry already exists.";

export class TranslationMemoryDuplicateError extends Error {
  constructor() {
    super(TRANSLATION_MEMORY_DUPLICATE_MESSAGE);
    this.name = "TranslationMemoryDuplicateError";
  }
}

@Injectable()
export class InMemoryTranslationMemoryRepository implements TranslationMemoryRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createEntry(entry: TranslationMemoryEntry): Promise<TranslationMemoryEntry> {
    this.assertIdentityAvailable(entry);
    return this.database.insert("translation_memory_entries", entry);
  }

  async updateEntry(entry: TranslationMemoryEntry): Promise<TranslationMemoryEntry> {
    return this.database.upsert("translation_memory_entries", entry);
  }

  async updateEntryIfUnique(
    entry: TranslationMemoryEntry
  ): Promise<TranslationMemoryEntry> {
    this.assertIdentityAvailable(entry, entry.id);
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
        const approvalAllowed =
          input.includePending || entry.approvalStatus === "APPROVED";

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
    return this.database.select<TranslationMemoryAuditEvent>(
      "translation_memory_audit_events"
    );
  }

  private assertIdentityAvailable(
    entry: TranslationMemoryEntry,
    excludedId?: string
  ): void {
    const identityKey = buildTranslationMemoryIdentityKey(entry);
    const duplicate = this.database
      .selectForTenant<TranslationMemoryEntry>(
        "translation_memory_entries",
        entry.organizationId
      )
      .some(
        (existing) =>
          existing.id !== excludedId &&
          buildTranslationMemoryIdentityKey(existing) === identityKey
      );

    if (duplicate) {
      throw new TranslationMemoryDuplicateError();
    }
  }
}
