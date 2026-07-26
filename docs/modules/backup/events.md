# Backup Events

## Purpose

This document defines official events for the Backup, Disaster Recovery and
Business Continuity Module.

Events coordinate backup execution, restore validation, replication,
continuity, observability, notifications, and audit. They do not replace
immutable audit records.

## Event Envelope

Each event should include:

- `eventId`.
- `eventName`.
- `eventVersion`.
- `organizationId`.
- `workspaceId` when available.
- `sourceModule`.
- `correlationId`.
- `traceId`.
- `idempotencyKey`.
- `occurredAt`.
- `actorId` when human initiated.
- `payload`.

## Official Events

Backup events:

- `BackupScheduled`.
- `BackupStarted`.
- `BackupCompleted`.
- `BackupFailed`.
- `BackupIntegrityCheckStarted`.
- `BackupIntegrityCheckCompleted`.
- `BackupIntegrityCheckFailed`.

Restore events:

- `RestoreRequested`.
- `RestoreApproved`.
- `RestoreStarted`.
- `RestoreCompleted`.
- `RestoreFailed`.
- `RestoreValidationStarted`.
- `RestoreValidationCompleted`.
- `RestoreValidationFailed`.

Replication events:

- `ReplicationStarted`.
- `ReplicationCompleted`.
- `ReplicationFailed`.

Disaster recovery events:

- `RecoveryPlanCreated`.
- `RecoveryPlanUpdated`.
- `RecoveryPlanExecuted`.
- `RecoveryPlanTested`.
- `RecoveryPlanFailed`.

Continuity events:

- `ContinuityModeActivated`.
- `ContinuityModeResolved`.
- `ServicePriorityChanged`.
- `FailoverStarted`.
- `FailoverCompleted`.
- `FailbackStarted`.
- `FailbackCompleted`.

Policy events:

- `BackupPolicyCreated`.
- `BackupPolicyUpdated`.
- `RetentionPolicyCreated`.
- `RetentionPolicyUpdated`.
- `PreservationRecordCreated`.

## Current Repository Baseline

Current runtime backup governance uses audit actions rather than a centralized
event bus:

- `BACKUP_JOB_CREATED`.
- `BACKUP_RETENTION_POLICY_CREATED`.
- `DISASTER_RECOVERY_PLAN_CREATED`.
- `PRESERVATION_RECORD_CREATED`.
- `BACKUP_RESTORE_EVENT_RECORDED`.

Infrastructure scripts emit timestamped log lines and operational validation
output, but do not yet emit typed application events.

## Event Rules

- Events must be versioned.
- Events must be tenant-scoped.
- Events must preserve correlation ID and trace ID where available.
- Events must not expose secrets or raw backup archive contents.
- Notification delivery must use Notification and Communication.
- Observability must record operational visibility.
- Audit remains immutable and authoritative for who approved or executed
  sensitive actions.
- AI-generated recommendations may emit advisory events only and must not
  execute restore, retention, deletion, failover, or publication actions.
