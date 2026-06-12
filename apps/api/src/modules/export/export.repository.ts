import { Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { type ExportArtifact, type ExportAuditEvent } from "./export.types";

@Injectable()
export class DatabaseExportRepository {
  constructor(private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()) {}

  async createArtifact(artifact: ExportArtifact): Promise<ExportArtifact> {
    return this.database.insert("export_artifacts", artifact);
  }

  async findArtifactById(id: string, organizationId: string): Promise<ExportArtifact | null> {
    return this.database.findByIdForTenant<ExportArtifact>("export_artifacts", id, organizationId);
  }

  async appendAuditEvent(event: ExportAuditEvent): Promise<void> {
    this.database.insert("foundation_audit_events", event);
  }

  getAuditEvents(organizationId: string): ExportAuditEvent[] {
    return this.database.selectForTenant<ExportAuditEvent>(
      "foundation_audit_events",
      organizationId,
      (event) => event.entityType === "EXPORT_ARTIFACT"
    );
  }
}
