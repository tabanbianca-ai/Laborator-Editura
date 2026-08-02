# Canonical Restore Model

## Purpose

Restore records define how data, services, assets, configurations, or complete
environments are recovered from protected backup copies.

## Required Restore Fields

Each restore must preserve:

- `id`.
- `sourceBackupId`.
- `requestedResource`.
- `requestedVersion`.
- `restoreType`.
- `targetEnvironment`.
- `requestedBy`.
- `approvedBy`.
- `startedAt`.
- `completedAt`.
- `status`.
- `validationResult`.
- `dataLossDetected`.
- `integrityResult`.
- `rollbackPlan`.
- `evidence`.
- `auditInformation`.

## Restore Types

The platform must support restore planning for:

- Full restore.
- Partial restore.
- Database-level restore.
- Table-level restore where safe.
- Project-level restore.
- Document-level restore.
- Version-level restore.
- Asset restore.
- Point-in-time recovery.
- Restore into an isolated environment.

Selective restore must not violate referential integrity.

## Restore Flow

```text
Restore request
  -> Identity and permission verification
  -> Impact assessment
  -> Backup selection
  -> Integrity verification
  -> Approval
  -> Restore into isolated environment
  -> Data and application validation
  -> Controlled promotion
  -> Audit and closure
```

Direct production restore is allowed only in justified and approved
situations.

