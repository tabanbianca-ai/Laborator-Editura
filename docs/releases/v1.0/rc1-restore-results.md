# RC1 Restore Results

Status: PARTIAL_BLOCKED  
Generated: 2026-08-09

## Local Runtime Backup/Restore

| Step | Result | Evidence |
| --- | --- | --- |
| Runtime backup script | PASS | `backup-runtime-db.mjs` produced schema version `1.0` backup with 291 tables |
| Runtime restore script | PASS | `restore-runtime-db.mjs` restored schema version `1.0` backup with 291 tables |
| Data check | PASS | Restored organization and project record preserved tenant relationship |
| Invalid backup rejection | PASS | Invalid backup failed with missing metadata/data validation errors |
| DB test suite | PASS | 49 DB tests passed, including backup/restore, invalid backup rejection, and tenant boundaries |

## Infrastructure Backup Dry-Run

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm infra:backup:dry-run` | PASS_WITH_WARNING | Dry-run completed, but Docker was not available and live Docker volume access was not validated |

## Staging Restore Dry-Run

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm staging:restore:dry-run` | FAIL | `STAGING_BACKUP_FILE is required` |

## Decision

Runtime backup/restore mechanics are validated locally. RC1 restore readiness is
blocked because no backup from the deployed staging candidate was restored into
isolated Docker volumes.

## Required Before Pilot

1. Deploy the exact RC1 candidate to staging.
2. Generate a staging backup.
3. Run restore dry-run into isolated volumes.
4. Verify restored health, tenant isolation, projects, documents, translations,
   publishing records, rights records, assets, audit events, and exported
   artifacts.
5. Record backup file, checksum, restore target, restore command, and result.

