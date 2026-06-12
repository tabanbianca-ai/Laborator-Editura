import { Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { type Document, type DocumentAuditEvent } from "./documents.types";

@Injectable()
export class DatabaseDocumentsRepository {
  constructor(private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()) {}

  async createDocument(document: Document): Promise<Document> {
    return this.database.insert("documents", document);
  }

  async updateDocument(document: Document): Promise<Document> {
    return this.database.upsert("documents", document);
  }

  async findDocumentById(id: string, organizationId: string): Promise<Document | null> {
    return this.database.findByIdForTenant<Document>("documents", id, organizationId);
  }

  async listDocuments(organizationId: string, projectId?: string): Promise<Document[]> {
    return this.database.selectForTenant<Document>(
      "documents",
      organizationId,
      (document) => projectId === undefined || document.projectId === projectId
    );
  }

  async appendAuditEvent(event: DocumentAuditEvent): Promise<void> {
    this.database.insert("foundation_audit_events", event);
  }

  getAuditEvents(organizationId: string): DocumentAuditEvent[] {
    return this.database.selectForTenant<DocumentAuditEvent>(
      "foundation_audit_events",
      organizationId,
      (event) => event.entityType === "DOCUMENT"
    );
  }
}
