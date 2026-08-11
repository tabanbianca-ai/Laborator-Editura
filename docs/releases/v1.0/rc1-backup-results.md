# RC1 Backup Results

Status: VERIFIED
Generated: 2026-08-11
Scope: RC1 Blocker 05

## Current Verified RC1

| Field | Value |
| --- | --- |
| Deployment ID | `rc1-30b39ec-20260809` |
| Release | `1.0.0-rc.1` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| Migration | `0008_security_hardening_phase_1.sql` |

## Canonical Backup Implementation

| Area | Evidence |
| --- | --- |
| Backup script | `infrastructure/backup/backup-laborator.sh` |
| Verification script | `infrastructure/backup/verify-backup.sh` |
| Restore dry-run script | `infrastructure/backup/restore-dry-run.sh` |
| Live restore script | `infrastructure/backup/restore-laborator.sh` |
| Runtime DB package backup | `packages/db/scripts/backup-runtime-db.mjs` |
| Runtime DB package restore | `packages/db/scripts/restore-runtime-db.mjs` |

## Configuration Validation

| Item | Status | Evidence |
| --- | --- | --- |
| Canonical project path | PASS | `/opt/laborator-editura` in infrastructure defaults |
| Deprecated project path | PASS | No deprecated mixed-case path references in deploy/infrastructure/docs |
| Backup directory | CONFIGURED | `BACKUP_DIR=/opt/laborator-backups` |
| Runtime DB volume | CONFIGURED | `RUNTIME_DB_VOLUME=laborator-staging_runtime-db` |
| Runtime backups volume | CONFIGURED | `RUNTIME_BACKUPS_VOLUME=laborator-staging_runtime-backups` |
| Staging environment file | CONFIGURED | `ENV_FILE=/opt/laborator-editura/deploy/staging/.env.staging` |
| Compose configuration | CONFIGURED | `COMPOSE_FILE=/opt/laborator-editura/deploy/staging/docker-compose.staging.yml` |
| Retention | CONFIGURED | `BACKUP_RETENTION_DAYS=30` |
| Checksum mechanism | PASS | `sha256sum` or `shasum -a 256` |
| Release identity metadata | PASS | `metadata/release-identity.json` is included when available |
| Secrets in backup | PROTECTED | `.env.staging` excluded unless `BACKUP_INCLUDE_ENV=true` |

## Local Validation Performed

| Command / Check | Result | Notes |
| --- | --- | --- |
| `bash -n infrastructure/backup/*.sh` | PASS | Backup and restore script syntax valid |
| `bash infrastructure/backup/backup-laborator.sh --config infrastructure/backup/laborator-backup.env.example --dry-run` | PASS_WITH_WARNING | Dry-run completed; Docker volume access skipped because Docker is unavailable locally |
| Fixture `verify-backup.sh` with expected RC identity | PASS | Checksum, structure, and release identity validation passed |
| Fixture `verify-backup.sh` with wrong artifact digest | PASS | Verification failed closed on artifact SHA mismatch |
| `git diff --check` | PASS | No whitespace errors after evidence updates |
| `pnpm install --frozen-lockfile` | PASS_WITH_WARNING | Install was reproducible; pnpm version metadata fetch warned because network is restricted |
| `pnpm typecheck` | PASS | Workspace typecheck passed |
| `pnpm lint` | PASS | Workspace lint passed |
| `pnpm test` | PASS | Workspace tests passed: shared 62, db 49, web 128, API 505 |
| `pnpm build` | PASS_WITH_WARNING | Workspace build passed; existing Next.js ESLint plugin warning remains |

## Earlier Local Environment Limitations

| Requirement | Status |
| --- | --- |
| Live VPS access from Codex environment | UNAVAILABLE |
| Local Docker volume access | UNAVAILABLE |
| Local live backup execution | NOT_ATTEMPTED_BY_DESIGN |

## Live Staging Backup Evidence

| Requirement | Status | Evidence |
| --- | --- | --- |
| Backup created from live RC1 staging | PASS | Operator-reported backup created on VPS |
| Backup artifact path | PASS | `/opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz` |
| Backup checksum | PASS | Operator-reported checksum verification passed |
| Backup archive verification | PASS | Operator-reported archive verification passed |
| Release identity metadata | PASS | Operator-reported release identity metadata verification passed |
| Runtime database payload | PASS | Operator-reported restored runtime DB passed isolated restore |
| Backup isolation | PASS | Operator-reported temporary restore volumes were isolated from live staging |

## Required VPS Command

```bash
cd /opt/laborator-editura
sudo infrastructure/backup/backup-laborator.sh \
  --config /etc/laborator/infrastructure.env
```

Then verify against the deployed RC1 identity:

```bash
EXPECTED_DEPLOYMENT_ID=rc1-30b39ec-20260809 \
EXPECTED_SOURCE_COMMIT=30b39ec0034f335bdbda210f09c8ad66a26a25a2 \
EXPECTED_ARTIFACT_SHA256=9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e \
EXPECTED_MIGRATION_VERSION=0008_security_hardening_phase_1.sql \
sudo infrastructure/backup/verify-backup.sh \
  /opt/laborator-backups/laborator-staging-YYYYMMDDTHHMMSSZ.tar.gz
```

## Completion Signals

STAGING_BACKUP = PASS
BACKUP_CHECKSUM = PASS
BACKUP_INTEGRITY = PASS
BACKUP_METADATA = PASS
