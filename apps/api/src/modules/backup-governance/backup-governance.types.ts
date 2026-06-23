export type BackupJobType = "FULL" | "INCREMENTAL" | "SNAPSHOT" | "METADATA_ONLY";

export type BackupJobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "RESTORED";

export type BackupScope =
  | "projects"
  | "books"
  | "magazines"
  | "author_studio"
  | "translations"
  | "terminology"
  | "lexicographic"
  | "semantic_fidelity"
  | "multimedia"
  | "media_localization"
  | "public_portal"
  | "commerce"
  | "library"
  | "collaboration"
  | "research"
  | "observability"
  | "security"
  | "integrations"
  | "entire_organization";

export type BackupRetentionMode =
  | "RETAIN_FOREVER"
  | "RETAIN_N_YEARS"
  | "ARCHIVE_METADATA_FOREVER"
  | "IMMUTABLE_BACKUPS"
  | "AUDIT_RETENTION";

export type BackupPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type BackupAuditAction =
  | "BACKUP_JOB_CREATED"
  | "BACKUP_RETENTION_POLICY_CREATED"
  | "DISASTER_RECOVERY_PLAN_CREATED"
  | "PRESERVATION_RECORD_CREATED"
  | "BACKUP_RESTORE_EVENT_RECORDED";

export interface BackupGovernanceActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface BackupJob {
  id: string;
  organizationId: string;
  jobType: BackupJobType;
  status: BackupJobStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  sizeBytes?: number;
  checksum?: string;
  initiatedBy: string;
  backupScope: BackupScope[];
  storageProvider: "RUNTIME_METADATA_ONLY";
  cloudProviderIntegration: "NOT_CONFIGURED";
  immutable: boolean;
  noPermanentDeletion: true;
  humanApprovalRequired: true;
  aiSuggested: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface BackupRestoreEvent {
  id: string;
  organizationId: string;
  backupJobId: string;
  restoreStatus: "REQUESTED" | "APPROVED_METADATA_ONLY" | "FAILED";
  requestedBy: string;
  requestedAt: string;
  restorationProcedures: string[];
  humanApprovalRequired: true;
  aiInitiated: false;
  realRestoreExecuted: false;
  metadata?: Record<string, unknown>;
}

export interface BackupRetentionPolicy {
  id: string;
  organizationId: string;
  name: string;
  retentionMode: BackupRetentionMode;
  retainYears?: number;
  archiveMetadataForever: boolean;
  immutableBackups: boolean;
  auditRetention: "PERMANENT";
  noPermanentDeletion: true;
  appliesToScopes: BackupScope[];
  humanApprovalRequired: true;
  aiSuggested: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface DisasterRecoveryPlan {
  id: string;
  organizationId: string;
  name: string;
  recoveryPointObjective: string;
  recoveryTimeObjective: string;
  recoveryStrategy: string;
  priority: BackupPriority;
  failoverNotes: string[];
  restorationProcedures: string[];
  cloudProviderIntegration: "NOT_CONFIGURED";
  humanApprovalRequired: true;
  aiSuggested: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PreservationRecord {
  id: string;
  organizationId: string;
  recordType:
    | "HISTORICAL_EDITION"
    | "ORIGINAL_SOURCE"
    | "MANUSCRIPT_VERSION"
    | "GLOSSARY_VERSION"
    | "AUDIT_PERMANENCE";
  entityType: string;
  entityId: string;
  preservationScope: BackupScope[];
  historicalEditions: string[];
  originalSourcePreservation: boolean;
  allManuscriptVersions: boolean;
  glossaryVersions: boolean;
  auditPermanence: true;
  noPermanentDeletion: true;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface BackupAuditEvent {
  id: string;
  organizationId: string;
  action: BackupAuditAction;
  actorId: string;
  backupJobId?: string;
  restoreEventId?: string;
  retentionPolicyId?: string;
  disasterRecoveryPlanId?: string;
  preservationRecordId?: string;
  beforeState?: object;
  afterState?: object;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface CreateBackupJobInput {
  jobType: BackupJobType;
  status?: BackupJobStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  sizeBytes?: number;
  checksum?: string;
  backupScope?: BackupScope[];
  immutable?: boolean;
  aiSuggested?: boolean;
  aiInitiatedRestore?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateRetentionPolicyInput {
  name: string;
  retentionMode: BackupRetentionMode;
  retainYears?: number;
  archiveMetadataForever?: boolean;
  immutableBackups?: boolean;
  appliesToScopes?: BackupScope[];
  aiSuggested?: boolean;
  aiInitiatedPolicyChange?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateDisasterRecoveryPlanInput {
  name: string;
  recoveryPointObjective: string;
  recoveryTimeObjective: string;
  recoveryStrategy: string;
  priority?: BackupPriority;
  failoverNotes?: string[];
  restorationProcedures?: string[];
  aiSuggested?: boolean;
  aiInitiatedPlanChange?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreatePreservationRecordInput {
  recordType: PreservationRecord["recordType"];
  entityType: string;
  entityId: string;
  preservationScope?: BackupScope[];
  historicalEditions?: string[];
  originalSourcePreservation?: boolean;
  allManuscriptVersions?: boolean;
  glossaryVersions?: boolean;
  metadata?: Record<string, unknown>;
}

export interface RestoreBackupInput {
  restorationProcedures?: string[];
  aiInitiatedRestore?: boolean;
  metadata?: Record<string, unknown>;
}

export interface BackupGovernanceRepository {
  createBackupJob(job: BackupJob): Promise<BackupJob>;
  findBackupJobById(id: string, organizationId: string): Promise<BackupJob | null>;
  listBackupJobs(organizationId: string): Promise<BackupJob[]>;
  createRestoreEvent(event: BackupRestoreEvent): Promise<BackupRestoreEvent>;
  createRetentionPolicy(policy: BackupRetentionPolicy): Promise<BackupRetentionPolicy>;
  listRetentionPolicies(organizationId: string): Promise<BackupRetentionPolicy[]>;
  createDisasterRecoveryPlan(plan: DisasterRecoveryPlan): Promise<DisasterRecoveryPlan>;
  listDisasterRecoveryPlans(organizationId: string): Promise<DisasterRecoveryPlan[]>;
  createPreservationRecord(record: PreservationRecord): Promise<PreservationRecord>;
  listPreservationRecords(organizationId: string): Promise<PreservationRecord[]>;
  appendAuditEvent(event: BackupAuditEvent): Promise<void>;
  listAuditEvents(organizationId: string): Promise<BackupAuditEvent[]>;
}
