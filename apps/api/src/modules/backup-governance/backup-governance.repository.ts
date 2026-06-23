import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type BackupAuditEvent,
  type BackupGovernanceRepository,
  type BackupJob,
  type BackupRestoreEvent,
  type BackupRetentionPolicy,
  type DisasterRecoveryPlan,
  type PreservationRecord
} from "./backup-governance.types";

@Injectable()
export class DatabaseBackupGovernanceRepository implements BackupGovernanceRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createBackupJob(job: BackupJob): Promise<BackupJob> {
    return this.database.insert("backup_jobs", job);
  }

  async findBackupJobById(id: string, organizationId: string): Promise<BackupJob | null> {
    return this.database.findByIdForTenant<BackupJob>("backup_jobs", id, organizationId);
  }

  async listBackupJobs(organizationId: string): Promise<BackupJob[]> {
    return this.database.selectForTenant<BackupJob>("backup_jobs", organizationId);
  }

  async createRestoreEvent(event: BackupRestoreEvent): Promise<BackupRestoreEvent> {
    return this.database.insert("backup_restore_events", event);
  }

  async createRetentionPolicy(policy: BackupRetentionPolicy): Promise<BackupRetentionPolicy> {
    return this.database.insert("backup_retention_policies", policy);
  }

  async listRetentionPolicies(organizationId: string): Promise<BackupRetentionPolicy[]> {
    return this.database.selectForTenant<BackupRetentionPolicy>(
      "backup_retention_policies",
      organizationId
    );
  }

  async createDisasterRecoveryPlan(plan: DisasterRecoveryPlan): Promise<DisasterRecoveryPlan> {
    return this.database.insert("disaster_recovery_plans", plan);
  }

  async listDisasterRecoveryPlans(organizationId: string): Promise<DisasterRecoveryPlan[]> {
    return this.database.selectForTenant<DisasterRecoveryPlan>(
      "disaster_recovery_plans",
      organizationId
    );
  }

  async createPreservationRecord(record: PreservationRecord): Promise<PreservationRecord> {
    return this.database.insert("preservation_records", record);
  }

  async listPreservationRecords(organizationId: string): Promise<PreservationRecord[]> {
    return this.database.selectForTenant<PreservationRecord>("preservation_records", organizationId);
  }

  async appendAuditEvent(event: BackupAuditEvent): Promise<void> {
    this.database.insert("backup_audit_events", event);
  }

  async listAuditEvents(organizationId: string): Promise<BackupAuditEvent[]> {
    return this.database.selectForTenant<BackupAuditEvent>("backup_audit_events", organizationId);
  }
}
