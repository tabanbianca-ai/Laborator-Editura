# Backup Domain Model

## Purpose

This document defines the canonical domain model for the Backup, Disaster
Recovery and Business Continuity Module.

## Aggregate Ownership

Backup owns operational protection metadata. It does not own the editorial or
business records being protected.

| Entity | Owner | Purpose |
| --- | --- | --- |
| `BackupJob` | Backup | Represents a planned or executed backup operation. |
| `BackupRepository` | Backup | Represents a storage location and its protection policy. |
| `RestoreJob` | Backup | Represents an authorized restore request or execution. |
| `RecoveryPlan` | Backup | Represents a disaster recovery plan with RPO/RTO and service order. |
| `BackupPolicy` | Backup | Defines schedule, source scope, target repository, and validation behavior. |
| `RetentionPolicy` | Backup | Defines how long backup and preservation records are retained. |
| `SnapshotRecord` | Backup | Records snapshot metadata for quick rollback or test restore. |
| `ReplicationRecord` | Backup | Records backup copy or replication metadata. |
| `IntegrityCheck` | Backup | Records checksum, restore validation, and consistency verification. |
| `ContinuityPlan` | Backup | Defines operational continuity procedures and degraded modes. |
| `BackupAuditEvent` | Backup | Immutable record of every backup, restore, policy, test, and failure action. |

## BackupJob

Required fields:

- `id`.
- `organizationId`.
- `type`.
- `source`.
- `destination`.
- `frequency`.
- `status`.
- `executionDate`.
- `duration`.
- `sizeBytes`.
- `checksum`.
- `initiatedBy`.
- `createdAt`.
- `updatedAt`.

Current runtime mapping:

- `backup_jobs`.

Current implemented types:

- `FULL`.
- `INCREMENTAL`.
- `SNAPSHOT`.
- `METADATA_ONLY`.

Target types also include:

- `DIFFERENTIAL`.
- `DATABASE`.
- `FILE`.
- `CONFIGURATION`.
- `AI_CONFIGURATION`.
- `OBJECT_STORAGE`.

## BackupRepository

Required fields:

- `id`.
- `organizationId`.
- `location`.
- `storageType`.
- `encryptionEnabled`.
- `immutabilityEnabled`.
- `retentionPolicyId`.
- `capacity`.
- `region`.
- `status`.

Current status:

- Not implemented as a dedicated runtime entity.
- Repository metadata is partially represented by infrastructure
  configuration and backup job metadata.

## RestoreJob

Required fields:

- `id`.
- `organizationId`.
- `backupId`.
- `destination`.
- `initiator`.
- `status`.
- `requestedAt`.
- `startedAt`.
- `completedAt`.
- `duration`.
- `result`.
- `integrityValidationResult`.

Current runtime mapping:

- `backup_restore_events`.

Current behavior:

- Restore requests are metadata-only.
- Real restore execution remains infrastructure-script controlled.
- AI-initiated restore is rejected.
- Human approval remains required.

## RecoveryPlan

Required fields:

- `id`.
- `organizationId`.
- `name`.
- `includedServices`.
- `restoreOrder`.
- `recoveryPointObjective`.
- `recoveryTimeObjective`.
- `procedures`.
- `testsPerformed`.
- `priority`.
- `failoverNotes`.
- `postRecoveryChecks`.

Current runtime mapping:

- `disaster_recovery_plans`.

## RetentionPolicy

Required fields:

- `id`.
- `organizationId`.
- `name`.
- `retentionMode`.
- `appliesToScopes`.
- `retainYears`.
- `archiveMetadataForever`.
- `immutableBackups`.
- `auditRetention`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Current runtime mapping:

- `backup_retention_policies`.

## PreservationRecord

Required fields:

- `id`.
- `organizationId`.
- `recordType`.
- `entityType`.
- `entityId`.
- `preservationScope`.
- `historicalEditions`.
- `originalSourcePreservation`.
- `allManuscriptVersions`.
- `glossaryVersions`.
- `auditPermanence`.
- `createdBy`.
- `createdAt`.

Current runtime mapping:

- `preservation_records`.

## BackupAuditEvent

Required fields:

- `id`.
- `organizationId`.
- `action`.
- `actorId`.
- `backupJobId`.
- `restoreEventId`.
- `retentionPolicyId`.
- `disasterRecoveryPlanId`.
- `preservationRecordId`.
- `beforeState`.
- `afterState`.
- `humanFinalAuthority`.
- `createdAt`.

Current runtime mapping:

- `backup_audit_events`.

Current audit actions:

- `BACKUP_JOB_CREATED`.
- `BACKUP_RETENTION_POLICY_CREATED`.
- `DISASTER_RECOVERY_PLAN_CREATED`.
- `PRESERVATION_RECORD_CREATED`.
- `BACKUP_RESTORE_EVENT_RECORDED`.

## Invariants

- Backup metadata must be tenant-scoped.
- Restore actions require authorized human approval.
- AI must not execute restore operations automatically.
- Audit events must not be deleted or rewritten.
- Backup records must preserve source scope, destination, checksum, and
  validation state.
- Retention must never authorize permanent deletion of audit history.
- Recovery plans must define RPO and RTO before production launch.
