import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type CollaborationAgreement,
  type ProvenanceRecord,
  type PublishingAuthorization,
  type RightsAuditEvent,
  type RightsProvenanceRepository,
  type TranslationAuthorization
} from "./rights-provenance.types";

@Injectable()
export class DatabaseRightsProvenanceRepository implements RightsProvenanceRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createCollaborationAgreement(agreement: CollaborationAgreement): Promise<CollaborationAgreement> {
    return this.database.insert("rights_collaboration_agreements", agreement);
  }

  async listCollaborationAgreements(organizationId: string): Promise<CollaborationAgreement[]> {
    return this.database.selectForTenant<CollaborationAgreement>(
      "rights_collaboration_agreements",
      organizationId
    );
  }

  async createTranslationAuthorization(authorization: TranslationAuthorization): Promise<TranslationAuthorization> {
    return this.database.insert("rights_translation_authorizations", authorization);
  }

  async listTranslationAuthorizations(organizationId: string): Promise<TranslationAuthorization[]> {
    return this.database.selectForTenant<TranslationAuthorization>(
      "rights_translation_authorizations",
      organizationId
    );
  }

  async createPublishingAuthorization(authorization: PublishingAuthorization): Promise<PublishingAuthorization> {
    return this.database.insert("rights_publishing_authorizations", authorization);
  }

  async listPublishingAuthorizations(organizationId: string): Promise<PublishingAuthorization[]> {
    return this.database.selectForTenant<PublishingAuthorization>(
      "rights_publishing_authorizations",
      organizationId
    );
  }

  async createProvenanceRecord(record: ProvenanceRecord): Promise<ProvenanceRecord> {
    return this.database.insert("rights_provenance_records", record);
  }

  async listProvenanceRecords(organizationId: string): Promise<ProvenanceRecord[]> {
    return this.database.selectForTenant<ProvenanceRecord>("rights_provenance_records", organizationId);
  }

  async appendAuditEvent(event: RightsAuditEvent): Promise<void> {
    this.database.insert("rights_audit_events", event);
  }

  async listAuditEvents(organizationId: string): Promise<RightsAuditEvent[]> {
    return this.database.selectForTenant<RightsAuditEvent>("rights_audit_events", organizationId);
  }
}
