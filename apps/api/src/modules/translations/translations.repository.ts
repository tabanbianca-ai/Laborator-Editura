import { Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { type SegmentTranslation, type TranslationAuditEvent } from "./translations.types";

@Injectable()
export class DatabaseTranslationsRepository {
  constructor(private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()) {}

  async createTranslation(translation: SegmentTranslation): Promise<SegmentTranslation> {
    return this.database.insert("segment_translations", translation);
  }

  async updateTranslation(translation: SegmentTranslation): Promise<SegmentTranslation> {
    return this.database.upsert("segment_translations", translation);
  }

  async listTranslationsByDocument(
    organizationId: string,
    documentId: string
  ): Promise<SegmentTranslation[]> {
    return this.database.selectForTenant<SegmentTranslation>(
      "segment_translations",
      organizationId,
      (translation) => translation.documentId === documentId
    );
  }

  async latestTranslationForSegment(
    organizationId: string,
    segmentId: string
  ): Promise<SegmentTranslation | null> {
    const translations = this.database
      .selectForTenant<SegmentTranslation>(
        "segment_translations",
        organizationId,
        (translation) => translation.segmentId === segmentId
      )
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

    return translations[0] ?? null;
  }

  async appendAuditEvent(event: TranslationAuditEvent): Promise<void> {
    this.database.insert("foundation_audit_events", event);
  }

  getAuditEvents(organizationId: string): TranslationAuditEvent[] {
    return this.database.selectForTenant<TranslationAuditEvent>(
      "foundation_audit_events",
      organizationId,
      (event) => event.entityType === "SEGMENT_TRANSLATION"
    );
  }
}
