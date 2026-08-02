# Canonical Backup Execution Model

## Purpose

Backup execution records prove that a policy ran, produced a protected copy,
validated integrity, and retained enough evidence for restore readiness.

## Required Backup Execution Fields

Each backup execution must record:

- `id`.
- `policyId`.
- `resourceId`.
- `resourceVersion`.
- `backupType`.
- `startedAt`.
- `completedAt`.
- `status`.
- `storageLocation`.
- `size`.
- `checksum`.
- `encryptionStatus`.
- `immutabilityStatus`.
- `replicationStatus`.
- `retentionUntil`.
- `correlationId`.
- `errorInformation`.

## Execution Statuses

Allowed backup execution statuses are:

- `SCHEDULED`.
- `RUNNING`.
- `VERIFYING`.
- `COMPLETED`.
- `COMPLETED_WITH_WARNINGS`.
- `FAILED`.
- `EXPIRED`.
- `DELETED_BY_POLICY`.
- `QUARANTINED`.

`COMPLETED_WITH_WARNINGS` is not acceptable for critical resources without
review.

## Execution Rules

- Successful backup execution is not proof of recoverability.
- Completion must be followed by integrity verification.
- Replication status must be recorded when replication is required.
- Storage location must not expose secrets or credentials.
- Execution errors must be observable and auditable.
- Execution metadata must include enough evidence to select and validate a
  restore.

