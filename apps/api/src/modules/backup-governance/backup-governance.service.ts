import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseBackupGovernanceRepository } from "./backup-governance.repository";
import {
  type BackupAuditAction,
  type BackupAuditEvent,
  type BackupGovernanceActor,
  type BackupJob,
  type BackupRestoreEvent,
  type BackupRetentionPolicy,
  type CreateBackupJobInput,
  type CreateDisasterRecoveryPlanInput,
  type CreatePreservationRecordInput,
  type CreateRetentionPolicyInput,
  type DisasterRecoveryPlan,
  type PreservationRecord,
  type RestoreBackupInput
} from "./backup-governance.types";

@Injectable()
export class BackupGovernanceService {
  constructor(private readonly repository: DatabaseBackupGovernanceRepository) {}

  async listBackupJobs(actor: BackupGovernanceActor): Promise<BackupJob[]> {
    this.assertAdminActor(actor);
    return this.repository.listBackupJobs(actor.organizationId);
  }

  async createBackupJob(
    actor: BackupGovernanceActor,
    input: CreateBackupJobInput
  ): Promise<BackupJob> {
    this.assertAdminActor(actor);

    const now = new Date().toISOString();
    const startedAt = input.startedAt ?? now;
    const backupJob: BackupJob = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      jobType: input.jobType,
      status: input.status ?? "PENDING",
      startedAt,
      completedAt: input.completedAt,
      durationMs: input.durationMs,
      sizeBytes: input.sizeBytes,
      checksum: input.checksum,
      initiatedBy: actor.userId,
      backupScope: input.backupScope ?? ["entire_organization"],
      storageProvider: "RUNTIME_METADATA_ONLY",
      cloudProviderIntegration: "NOT_CONFIGURED",
      immutable: input.immutable ?? false,
      noPermanentDeletion: true,
      humanApprovalRequired: true,
      aiSuggested: input.aiSuggested ?? false,
      createdAt: now,
      updatedAt: now,
      metadata: {
        ...(input.metadata ?? {}),
        realCloudBackupProviderConnected: false
      }
    };

    const created = await this.repository.createBackupJob(backupJob);
    await this.audit("BACKUP_JOB_CREATED", actor, { backupJobId: created.id }, created);

    return created;
  }

  async listRetentionPolicies(actor: BackupGovernanceActor): Promise<BackupRetentionPolicy[]> {
    this.assertAdminActor(actor);
    return this.repository.listRetentionPolicies(actor.organizationId);
  }

  async createRetentionPolicy(
    actor: BackupGovernanceActor,
    input: CreateRetentionPolicyInput
  ): Promise<BackupRetentionPolicy> {
    this.assertAdminActor(actor);
    this.validateRequired(input.name, "name");

    if (input.aiInitiatedPolicyChange) {
      throw new BadRequestException("AI cannot change retention policy automatically.");
    }

    const now = new Date().toISOString();
    const retentionPolicy: BackupRetentionPolicy = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      retentionMode: input.retentionMode,
      retainYears: input.retainYears,
      archiveMetadataForever: input.archiveMetadataForever ?? true,
      immutableBackups: input.immutableBackups ?? input.retentionMode === "IMMUTABLE_BACKUPS",
      auditRetention: "PERMANENT",
      noPermanentDeletion: true,
      appliesToScopes: input.appliesToScopes ?? ["entire_organization"],
      humanApprovalRequired: true,
      aiSuggested: input.aiSuggested ?? false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createRetentionPolicy(retentionPolicy);
    await this.audit(
      "BACKUP_RETENTION_POLICY_CREATED",
      actor,
      { retentionPolicyId: created.id },
      created
    );

    return created;
  }

  async listDisasterRecoveryPlans(actor: BackupGovernanceActor): Promise<DisasterRecoveryPlan[]> {
    this.assertAdminActor(actor);
    return this.repository.listDisasterRecoveryPlans(actor.organizationId);
  }

  async createDisasterRecoveryPlan(
    actor: BackupGovernanceActor,
    input: CreateDisasterRecoveryPlanInput
  ): Promise<DisasterRecoveryPlan> {
    this.assertAdminActor(actor);
    this.validateRequired(input.name, "name");
    this.validateRequired(input.recoveryPointObjective, "recoveryPointObjective");
    this.validateRequired(input.recoveryTimeObjective, "recoveryTimeObjective");
    this.validateRequired(input.recoveryStrategy, "recoveryStrategy");

    if (input.aiInitiatedPlanChange) {
      throw new BadRequestException("AI cannot change disaster recovery plans automatically.");
    }

    const now = new Date().toISOString();
    const plan: DisasterRecoveryPlan = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      recoveryPointObjective: input.recoveryPointObjective,
      recoveryTimeObjective: input.recoveryTimeObjective,
      recoveryStrategy: input.recoveryStrategy,
      priority: input.priority ?? "HIGH",
      failoverNotes: input.failoverNotes ?? [],
      restorationProcedures: input.restorationProcedures ?? [],
      cloudProviderIntegration: "NOT_CONFIGURED",
      humanApprovalRequired: true,
      aiSuggested: input.aiSuggested ?? false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createDisasterRecoveryPlan(plan);
    await this.audit(
      "DISASTER_RECOVERY_PLAN_CREATED",
      actor,
      { disasterRecoveryPlanId: created.id },
      created
    );

    return created;
  }

  async listPreservationRecords(actor: BackupGovernanceActor): Promise<PreservationRecord[]> {
    this.assertAdminActor(actor);
    const existing = await this.repository.listPreservationRecords(actor.organizationId);

    if (existing.length > 0) {
      return existing;
    }

    await this.createPreservationRecord(actor, {
      recordType: "AUDIT_PERMANENCE",
      entityType: "organization",
      entityId: actor.organizationId,
      preservationScope: ["entire_organization"],
      historicalEditions: [],
      originalSourcePreservation: true,
      allManuscriptVersions: true,
      glossaryVersions: true,
      metadata: {
        generatedFrom: "GET /backup/preservation",
        preservationBaseline: true
      }
    });

    return this.repository.listPreservationRecords(actor.organizationId);
  }

  async restoreBackup(
    actor: BackupGovernanceActor,
    backupJobId: string,
    input: RestoreBackupInput = {}
  ): Promise<BackupRestoreEvent> {
    this.assertAdminActor(actor);
    this.validateRequired(backupJobId, "backupJobId");

    if (input.aiInitiatedRestore) {
      throw new BadRequestException("AI cannot restore backups automatically.");
    }

    const backupJob = await this.repository.findBackupJobById(backupJobId, actor.organizationId);

    if (!backupJob) {
      throw new NotFoundException("Backup job not found.");
    }

    const restoreEvent: BackupRestoreEvent = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      backupJobId: backupJob.id,
      restoreStatus: "REQUESTED",
      requestedBy: actor.userId,
      requestedAt: new Date().toISOString(),
      restorationProcedures: input.restorationProcedures ?? [],
      humanApprovalRequired: true,
      aiInitiated: false,
      realRestoreExecuted: false,
      metadata: {
        ...(input.metadata ?? {}),
        metadataOnly: true,
        noRuntimeRestoreExecuted: true
      }
    };

    const created = await this.repository.createRestoreEvent(restoreEvent);
    await this.audit(
      "BACKUP_RESTORE_EVENT_RECORDED",
      actor,
      { backupJobId: backupJob.id, restoreEventId: created.id },
      created
    );

    return created;
  }

  async listAudit(actor: BackupGovernanceActor): Promise<BackupAuditEvent[]> {
    this.assertAdminActor(actor);
    return this.repository.listAuditEvents(actor.organizationId);
  }

  private async createPreservationRecord(
    actor: BackupGovernanceActor,
    input: CreatePreservationRecordInput
  ): Promise<PreservationRecord> {
    const record: PreservationRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      recordType: input.recordType,
      entityType: input.entityType,
      entityId: input.entityId,
      preservationScope: input.preservationScope ?? ["entire_organization"],
      historicalEditions: input.historicalEditions ?? [],
      originalSourcePreservation: input.originalSourcePreservation ?? true,
      allManuscriptVersions: input.allManuscriptVersions ?? true,
      glossaryVersions: input.glossaryVersions ?? true,
      auditPermanence: true,
      noPermanentDeletion: true,
      createdBy: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: input.metadata
    };

    const created = await this.repository.createPreservationRecord(record);
    await this.audit(
      "PRESERVATION_RECORD_CREATED",
      actor,
      { preservationRecordId: created.id },
      created
    );

    return created;
  }

  private async audit(
    action: BackupAuditAction,
    actor: BackupGovernanceActor,
    target: {
      backupJobId?: string;
      restoreEventId?: string;
      retentionPolicyId?: string;
      disasterRecoveryPlanId?: string;
      preservationRecordId?: string;
    },
    afterState: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      ...target,
      action,
      actorId: actor.userId,
      afterState,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString()
    });
  }

  private assertAdminActor(actor: BackupGovernanceActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("Authenticated backup governance context is required.");
    }

    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (!roles.has("PLATFORM_CREATOR") && !roles.has("ADMIN")) {
      throw new ForbiddenException("Backup governance endpoints require an authorized admin.");
    }
  }

  private validateRequired(value: string | undefined, fieldName: string): void {
    if (!value) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }
}
