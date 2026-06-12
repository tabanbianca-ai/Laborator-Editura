import { Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { type Segment, type SegmentAuditEvent } from "./segments.types";

@Injectable()
export class DatabaseSegmentsRepository {
  constructor(private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()) {}

  async createSegment(segment: Segment): Promise<Segment> {
    return this.database.insert("document_segments", segment);
  }

  async updateSegment(segment: Segment): Promise<Segment> {
    return this.database.upsert("document_segments", segment);
  }

  async findSegmentById(id: string, organizationId: string): Promise<Segment | null> {
    return this.database.findByIdForTenant<Segment>("document_segments", id, organizationId);
  }

  async listSegmentsByDocument(organizationId: string, documentId: string): Promise<Segment[]> {
    return this.database
      .selectForTenant<Segment>(
        "document_segments",
        organizationId,
        (segment) => segment.documentId === documentId
      )
      .sort((left, right) => left.order - right.order);
  }

  async appendAuditEvent(event: SegmentAuditEvent): Promise<void> {
    this.database.insert("foundation_audit_events", event);
  }

  getAuditEvents(organizationId: string): SegmentAuditEvent[] {
    return this.database.selectForTenant<SegmentAuditEvent>(
      "foundation_audit_events",
      organizationId,
      (event) => event.entityType === "SEGMENT"
    );
  }
}
