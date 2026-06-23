import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "backup-governance");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
const runtimeDatabase = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "src", "runtime-database.ts"),
  "utf8"
);
const runtimeBackup = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "scripts", "runtime-backup-lib.mjs"),
  "utf8"
);
const backupRestoreTest = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "tests", "runtime-backup-restore.test.mjs"),
  "utf8"
);

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("backup governance module is registered with required authenticated endpoints", () => {
  const controller = readSource("backup-governance.controller.ts");
  const moduleSource = readSource("backup-governance.module.ts");
  const service = readSource("backup-governance.service.ts");

  assert.match(appModule, /BackupGovernanceModule/);
  assert.match(moduleSource, /DatabaseBackupGovernanceRepository/);
  assert.match(moduleSource, /BackupGovernanceService/);
  assert.match(controller, /@Controller\("backup"\)/);
  assert.match(controller, /@Get\("jobs"\)/);
  assert.match(controller, /@Post\("jobs"\)/);
  assert.match(controller, /@Get\("retention"\)/);
  assert.match(controller, /@Post\("retention"\)/);
  assert.match(controller, /@Get\("recovery-plans"\)/);
  assert.match(controller, /@Post\("recovery-plans"\)/);
  assert.match(controller, /@Get\("preservation"\)/);
  assert.match(controller, /@Post\("restore\/:id"\)/);
  assert.match(controller, /@Get\("audit"\)/);
  assert.match(controller, /CurrentActor/);
  assert.match(service, /Backup governance endpoints require an authorized admin/);
});

test("backup jobs support required types statuses metadata and scopes", () => {
  const types = readSource("backup-governance.types.ts");
  const service = readSource("backup-governance.service.ts");

  for (const jobType of ["FULL", "INCREMENTAL", "SNAPSHOT", "METADATA_ONLY"]) {
    assert.match(types, new RegExp(`"${jobType}"`));
  }

  for (const status of ["PENDING", "RUNNING", "COMPLETED", "FAILED", "RESTORED"]) {
    assert.match(types, new RegExp(`"${status}"`));
  }

  for (const field of [
    "startedAt",
    "completedAt",
    "durationMs",
    "sizeBytes",
    "checksum",
    "initiatedBy",
    "backupScope"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  for (const scope of [
    "projects",
    "books",
    "magazines",
    "author_studio",
    "translations",
    "terminology",
    "lexicographic",
    "semantic_fidelity",
    "multimedia",
    "media_localization",
    "public_portal",
    "commerce",
    "library",
    "collaboration",
    "research",
    "observability",
    "security",
    "integrations",
    "entire_organization"
  ]) {
    assert.match(types, new RegExp(`"${scope}"`));
  }

  assert.match(service, /createBackupJob/);
  assert.match(service, /BACKUP_JOB_CREATED/);
});

test("retention policies support long-term retention immutable backups and audit permanence", () => {
  const types = readSource("backup-governance.types.ts");
  const service = readSource("backup-governance.service.ts");

  for (const mode of [
    "RETAIN_FOREVER",
    "RETAIN_N_YEARS",
    "ARCHIVE_METADATA_FOREVER",
    "IMMUTABLE_BACKUPS",
    "AUDIT_RETENTION"
  ]) {
    assert.match(types, new RegExp(`"${mode}"`));
  }

  assert.match(types + service, /retainYears/);
  assert.match(types + service, /archiveMetadataForever/);
  assert.match(types + service, /immutableBackups/);
  assert.match(types + service, /auditRetention: "PERMANENT"/);
  assert.match(types + service, /noPermanentDeletion: true/);
  assert.match(service, /createRetentionPolicy/);
  assert.match(service, /BACKUP_RETENTION_POLICY_CREATED/);
});

test("disaster recovery plans store RPO RTO strategy priority failover and restoration procedures", () => {
  const types = readSource("backup-governance.types.ts");
  const service = readSource("backup-governance.service.ts");

  for (const field of [
    "recoveryPointObjective",
    "recoveryTimeObjective",
    "recoveryStrategy",
    "priority",
    "failoverNotes",
    "restorationProcedures"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /createDisasterRecoveryPlan/);
  assert.match(service, /DISASTER_RECOVERY_PLAN_CREATED/);
});

test("preservation records protect editions sources manuscript versions glossary versions and audit permanence", () => {
  const types = readSource("backup-governance.types.ts");
  const service = readSource("backup-governance.service.ts");
  const repository = readSource("backup-governance.repository.ts");

  for (const recordType of [
    "HISTORICAL_EDITION",
    "ORIGINAL_SOURCE",
    "MANUSCRIPT_VERSION",
    "GLOSSARY_VERSION",
    "AUDIT_PERMANENCE"
  ]) {
    assert.match(types, new RegExp(`"${recordType}"`));
  }

  assert.match(types + service, /historicalEditions/);
  assert.match(types + service, /originalSourcePreservation/);
  assert.match(types + service, /allManuscriptVersions/);
  assert.match(types + service, /glossaryVersions/);
  assert.match(types + service, /auditPermanence: true/);
  assert.match(service, /createPreservationRecord/);
  assert.match(repository, /preservation_records/);
  assert.match(service, /PRESERVATION_RECORD_CREATED/);
});

test("restore endpoint records metadata-only restore events without executing real restore", () => {
  const service = readSource("backup-governance.service.ts");
  const repository = readSource("backup-governance.repository.ts");
  const types = readSource("backup-governance.types.ts");

  assert.match(types + service, /BackupRestoreEvent/);
  assert.match(service, /restoreBackup/);
  assert.match(service, /AI cannot restore backups automatically/);
  assert.match(service, /realRestoreExecuted: false/);
  assert.match(service, /noRuntimeRestoreExecuted: true/);
  assert.match(service, /BACKUP_RESTORE_EVENT_RECORDED/);
  assert.match(repository, /backup_restore_events/);
  assert.doesNotMatch(service + repository, /restoreBackupFromFile|restoreBackupToRuntime|writeBackup|unlinkSync|rmSync|deleteBackup/i);
});

test("human final authority is preserved and AI cannot change backup governance automatically", () => {
  const types = readSource("backup-governance.types.ts");
  const service = readSource("backup-governance.service.ts");

  assert.match(types + service, /humanApprovalRequired: true/);
  assert.match(types + service, /humanFinalAuthority: true/);
  assert.match(types + service, /aiSuggested/);
  assert.match(service, /AI cannot change retention policy automatically/);
  assert.match(service, /AI cannot change disaster recovery plans automatically/);
  assert.match(service, /AI cannot restore backups automatically/);
  assert.doesNotMatch(service, /\b(deleteBackup|purgeBackup|permanentDelete|autoRestore|applyRetentionChange)\s*\(/i);
});

test("backup governance preserves tenant isolation through admin context and tenant-scoped repositories", () => {
  const controller = readSource("backup-governance.controller.ts");
  const repository = readSource("backup-governance.repository.ts");
  const service = readSource("backup-governance.service.ts");

  assert.match(controller, /AuthenticatedRequestContext/);
  assert.match(service, /roles\.has\("ADMIN"\)/);
  assert.match(service, /actor\.organizationId/);
  assert.match(repository, /selectForTenant<BackupJob>/);
  assert.match(repository, /findByIdForTenant<BackupJob>/);
  assert.match(repository, /selectForTenant<BackupRetentionPolicy>/);
  assert.match(repository, /selectForTenant<DisasterRecoveryPlan>/);
  assert.match(repository, /selectForTenant<PreservationRecord>/);
  assert.doesNotMatch(controller + service, /x-user-id|x-organization-id|x-user-roles/);
});

test("backup audit trail and runtime backup restore include all backup governance tables", () => {
  const repository = readSource("backup-governance.repository.ts");
  const service = readSource("backup-governance.service.ts");
  const types = readSource("backup-governance.types.ts");

  assert.match(repository, /backup_audit_events/);
  assert.match(types, /BackupAuditEvent/);

  for (const action of [
    "BACKUP_JOB_CREATED",
    "BACKUP_RETENTION_POLICY_CREATED",
    "DISASTER_RECOVERY_PLAN_CREATED",
    "PRESERVATION_RECORD_CREATED",
    "BACKUP_RESTORE_EVENT_RECORDED"
  ]) {
    assert.match(types + service, new RegExp(`${action}`));
  }

  for (const tableName of [
    "backup_jobs",
    "backup_restore_events",
    "backup_retention_policies",
    "disaster_recovery_plans",
    "preservation_records",
    "backup_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"backup_restore_events",\s*"backupJobId",\s*"backup_jobs"/);
  assert.match(runtimeBackup, /"backup_audit_events",\s*"preservationRecordId",\s*"preservation_records"/);
  assert.match(backupRestoreTest, /backup-job-a/);
  assert.match(backupRestoreTest, /disaster-recovery-a/);
});

test("backup governance remains provider-free and metadata-only", () => {
  const service = readSource("backup-governance.service.ts");
  const repository = readSource("backup-governance.repository.ts");

  assert.match(service, /cloudProviderIntegration: "NOT_CONFIGURED"/);
  assert.match(service, /RUNTIME_METADATA_ONLY/);
  assert.doesNotMatch(service + repository, /s3|gcs|azureBlob|dropbox|googleDrive|fetch\(|axios/i);
});
