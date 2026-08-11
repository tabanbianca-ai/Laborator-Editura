# RC1 Restore Results

Status: PARTIAL_BLOCKED
Generated: 2026-08-11

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

## Blocker 05 Restore Validation

| Requirement | Status | Evidence |
| --- | --- | --- |
| Isolated restore target | MECHANISM_READY | `infrastructure/backup/restore-dry-run.sh` restores into temporary Docker volumes |
| Live staging backup selected | NOT_RECORDED | Requires backup artifact generated on VPS |
| Isolated restore executed | NOT_EXECUTED_LIVE | Requires Docker/VPS backup artifact |
| Restored database opens/parses | NOT_VERIFIED_LIVE | Requires isolated restore output |
| Restored data independent from live DB | NOT_VERIFIED_LIVE | Requires temporary Docker volume evidence |
| Live staging untouched | NOT_VERIFIED_LIVE | Requires before/after live runtime evidence |
| API healthy after restore | NOT_VERIFIED_LIVE | Requires live staging health check |
| Web healthy after restore | NOT_VERIFIED_LIVE | Requires live staging health check |

## Local Blocker 05 Validation

The infrastructure backup verifier was updated to validate RC release identity
metadata inside a backup archive. A local fixture proved that:

- valid RC identity metadata passes verification;
- a mismatched artifact SHA-256 fails verification;
- backup archives with `./`-prefixed tar entries are accepted without weakening
  required structure checks.

## Decision

Runtime backup/restore mechanics are validated locally. RC1 restore readiness is
blocked because no backup from the deployed staging candidate was restored into
isolated Docker volumes.

## Required Before Pilot

1. Generate a staging backup from deployment `rc1-30b39ec-20260809`.
2. Verify the backup checksum, required payloads, and RC1 release identity
   metadata against the expected deployment ID, source commit, artifact SHA-256,
   and migration version.
3. Run restore dry-run into isolated Docker volumes.
4. Verify restored health, tenant isolation, projects, documents, translations,
   publishing records, rights records, assets, audit events, and exported
   artifacts.
5. Confirm live staging API and WEB remain healthy and the live runtime database
   was not changed by the isolated restore.
6. Record backup file, checksum, restore target, restore command, and result.
