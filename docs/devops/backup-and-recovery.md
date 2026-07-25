# Backup and Recovery

## Purpose

Backup and recovery protect runtime data, assets, configuration, and audit
history.

## Backup Scope

Backups must cover:

- Runtime database.
- Future PostgreSQL database.
- Files and Assets.
- Export artifacts.
- Configuration metadata.
- Audit records.
- Infrastructure configuration examples and runbooks.

## Current Baseline

Current backup assets include:

- `infrastructure/backup/backup-laborator.sh`.
- `infrastructure/backup/verify-backup.sh`.
- `infrastructure/backup/restore-laborator.sh`.
- `infrastructure/backup/restore-dry-run.sh`.
- `infrastructure/backup/list-backups.sh`.
- `deploy/staging/scripts/backup-staging.mjs`.
- `deploy/staging/scripts/restore-dry-run.mjs`.
- Runtime database deterministic backup/restore support in `packages/db`.
- Backup and restore runbook in
  `infrastructure/docs/BACKUP_RESTORE_RUNBOOK.md`.

## Backup Requirements

- Backups must be encrypted in controlled environments.
- Backups must include schema or format version metadata.
- Backups must be checksum-verified.
- Restore dry-run must be executed periodically.
- Retention must be documented.
- Backup failures must alert operators.

## First-Run Behavior

Infrastructure scripts must support first-run operation. If the target config
file is missing, scripts may bootstrap from safe example files or use dry-run
defaults without stopping unexpectedly.

## Recovery Requirements

Recovery must define:

- Backup selected.
- Restore target.
- Operator.
- Approval.
- Verification.
- Rollback path.

## Acceptance Criteria

- Backup dry-run works without manual host preparation.
- Real backup produces verifiable archive metadata.
- Invalid backups are rejected.
- Restore dry-run proves data can be recreated.
- Tenant boundaries remain preserved after restore.
