import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type GdprConsentRecord,
  type GdprRequestRecord,
  type LaunchEssentialsAuditEvent,
  type LaunchEssentialsRepository,
  type LaunchMfaRecord,
  type SecretVaultRecord
} from "./launch-essentials.types";

@Injectable()
export class DatabaseLaunchEssentialsRepository implements LaunchEssentialsRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createMfaRecord(record: LaunchMfaRecord): Promise<LaunchMfaRecord> {
    return this.database.insert("launch_mfa_records", record);
  }

  async updateMfaRecord(record: LaunchMfaRecord): Promise<LaunchMfaRecord> {
    return this.database.upsert("launch_mfa_records", record);
  }

  async findMfaRecordById(id: string, organizationId: string): Promise<LaunchMfaRecord | null> {
    return this.database.findByIdForTenant<LaunchMfaRecord>("launch_mfa_records", id, organizationId);
  }

  async listMfaRecords(organizationId: string): Promise<LaunchMfaRecord[]> {
    return this.database.selectForTenant<LaunchMfaRecord>("launch_mfa_records", organizationId);
  }

  async createConsent(record: GdprConsentRecord): Promise<GdprConsentRecord> {
    return this.database.insert("launch_gdpr_consents", record);
  }

  async updateConsent(record: GdprConsentRecord): Promise<GdprConsentRecord> {
    return this.database.upsert("launch_gdpr_consents", record);
  }

  async findConsentById(id: string, organizationId: string): Promise<GdprConsentRecord | null> {
    return this.database.findByIdForTenant<GdprConsentRecord>("launch_gdpr_consents", id, organizationId);
  }

  async listConsents(organizationId: string, userId?: string): Promise<GdprConsentRecord[]> {
    return this.database.selectForTenant<GdprConsentRecord>(
      "launch_gdpr_consents",
      organizationId,
      (record) => !userId || record.userId === userId
    );
  }

  async createGdprRequest(record: GdprRequestRecord): Promise<GdprRequestRecord> {
    return this.database.insert("launch_gdpr_requests", record);
  }

  async createSecret(record: SecretVaultRecord): Promise<SecretVaultRecord> {
    return this.database.insert("launch_secret_vault_entries", record);
  }

  async updateSecret(record: SecretVaultRecord): Promise<SecretVaultRecord> {
    return this.database.upsert("launch_secret_vault_entries", record);
  }

  async findSecretById(id: string, organizationId: string): Promise<SecretVaultRecord | null> {
    return this.database.findByIdForTenant<SecretVaultRecord>(
      "launch_secret_vault_entries",
      id,
      organizationId
    );
  }

  async listSecrets(organizationId: string): Promise<SecretVaultRecord[]> {
    return this.database.selectForTenant<SecretVaultRecord>(
      "launch_secret_vault_entries",
      organizationId
    );
  }

  async appendAuditEvent(event: LaunchEssentialsAuditEvent): Promise<void> {
    this.database.insert("launch_essentials_audit_events", event);
  }

  async listAuditEvents(organizationId: string): Promise<LaunchEssentialsAuditEvent[]> {
    return this.database.selectForTenant<LaunchEssentialsAuditEvent>(
      "launch_essentials_audit_events",
      organizationId
    );
  }
}
