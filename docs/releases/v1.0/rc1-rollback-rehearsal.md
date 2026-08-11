# RC1 Rollback Rehearsal

Status: BLOCKED_BY_INVALID_HISTORICAL_RUNTIME_TARGET
Generated: 2026-08-11
Scope: RC1 Blocker 06

## Current Verified RC1

| Field | Value |
| --- | --- |
| Release | `1.0.0-rc.1` |
| Deployment ID | `rc1-30b39ec-20260809` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| API image | `laborator-rc1-api:30b39ec` |
| API image ID | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` |
| WEB image | `laborator-rc1-web:30b39ec` |
| WEB image ID | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` |
| Migration | `0008_security_hardening_phase_1.sql` |

## Blocker 05 Backup Protection

| Field | Value |
| --- | --- |
| Backup artifact | `/opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz` |
| Checksum verification | OPERATOR_REPORTED_PASS |
| Archive verification | OPERATOR_REPORTED_PASS |
| Release identity verification | OPERATOR_REPORTED_PASS |
| Isolated restore | OPERATOR_REPORTED_PASS |
| Live staging after restore | OPERATOR_REPORTED_HEALTHY |

This backup must not be deleted, overwritten, or restored over the live database
during the rollback rehearsal.

## Canonical Rollback Mechanism

| Item | Evidence |
| --- | --- |
| Rollback script | `infrastructure/deploy/rollback-staging-artifact.sh` |
| Artifact deploy script reused by rollback | `infrastructure/deploy/deploy-staging-artifact.sh` |
| Artifact compose file | `deploy/staging/docker-compose.artifact.yml` |
| Runbook | `infrastructure/docs/DEPLOYMENT_RUNBOOK.md` |
| Source rebuild protection | PASS: artifact compose contains no `build`, `docker build`, `pnpm install`, `pnpm build`, or `--build` directives |

The rollback script is intentionally a confirmation wrapper around the same
artifact deployment path. This preserves a single canonical mechanism for
artifact rollback and redeploy.

## Rollback Target Verification

| Requirement | Status | Evidence |
| --- | --- | --- |
| Historical artifact exists locally | PASS | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz` |
| Historical artifact SHA-256 | PASS | `41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285` |
| Historical source commit | PASS | `c1b6958c0c8c92e3946addfcab48bc695962ca98` |
| Historical migration version | PASS | `0008_security_hardening_phase_1.sql` |
| Historical artifact manifest parses | PASS | `RELEASE_ARTIFACT_MANIFEST.json` extracted successfully |
| Historical artifact SHA verification on VPS | PASS | Operator-reported VPS verification passed |
| Historical runtime image construction | FAIL | `ERR_PNPM_NO_LOCKFILE`; `pnpm-lock.yaml` is absent from the historical artifact |
| Historical runtime images present on VPS | FAIL | No verified runtime image set can be constructed from the historical artifact |
| Historical runtime image IDs | NOT_RECORDED | No verified rollback API/WEB image IDs exist for `c1b6958` |
| Historical rollback executable on VPS | FAIL | The artifact is historical evidence only, not a reproducible rollback target |

## Legacy Image Rejection

| Image | Image ID | Created | Decision |
| --- | --- | --- | --- |
| `staging-api:latest` | `sha256:890aeea9b31b8d1e2c31a3572d40ec38598ed4046de07e3f89fe9a51dc0bd0c1` | `2026-07-25T08:37:03Z` | REJECTED |
| `staging-web:latest` | `sha256:a8cc4868fd0c1ca0232da9d9a722355906e1b3f5d5716ab553c81dc9b0f156af` | `2026-07-25T08:38:09Z` | REJECTED |

The legacy images contain no independently verifiable artifact SHA-256, source
commit, release version, deployment ID, or build provenance. They must not be
used as RC rollback targets.

## New Rollback Baseline

| Field | Value |
| --- | --- |
| Baseline evidence | `docs/releases/v1.0/rc1-rollback-baseline.md` |
| Baseline artifact | `laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| Baseline SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| Baseline source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Baseline API image | `laborator-rc1-api:30b39ec` / `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` |
| Baseline WEB image | `laborator-rc1-web:30b39ec` / `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` |
| Baseline eligibility | PASS_LOCAL_VALIDATION |

The current verified RC1 becomes the first valid rollback baseline because it
is lockfile-backed, artifact-based, source-identified, image-identified, and
compatible with frozen dependency resolution.

## Local Mechanism Validation

| Command / Check | Result | Notes |
| --- | --- | --- |
| `bash infrastructure/deploy/rollback-staging-artifact.sh --confirm ROLLBACK ... --dry-run --skip-compose` | PASS | Historical artifact checksum, source commit, migration, and release identity preparation validated locally |
| `bash infrastructure/validation/validate-artifact-deploy.sh` | PASS | Shell syntax, current artifact dry-run, no source rebuild, and digest mismatch failure gate passed |
| `bash infrastructure/validation/validate-rollback-baseline.sh` | PASS | Current `30b39ec` artifact is eligible as a rollback baseline |
| Historical `c1b6958` missing-lockfile validation | PASS | Validator rejects the historical artifact because `pnpm-lock.yaml` is absent |

Local validation did not start containers and did not touch live staging data.

## Live Rehearsal Status

| Gate | Status |
| --- | --- |
| PRE_ROLLBACK_STATE | NOT_CAPTURED_FROM_THIS_ENVIRONMENT |
| ROLLBACK_TARGET | HISTORICAL_TARGET_REJECTED_NEW_BASELINE_REQUIRED |
| BACKUP_BEFORE_ROLLBACK | OPERATOR_REPORTED_VERIFIED_NOT_RECHECKED_FROM_THIS_ENVIRONMENT |
| ROLLBACK_EXECUTION | NOT_EXECUTED_LIVE |
| ROLLBACK_HEALTH | NOT_VERIFIED_LIVE |
| ROLLBACK_DATA_INTEGRITY | NOT_VERIFIED_LIVE |
| DATA_LOSS | NOT_VERIFIED_LIVE |
| BLOCKING_ERRORS | NOT_VERIFIED_LIVE |

## Required Live VPS Evidence

Before rollback:

```bash
cd /opt/laborator-editura

EXPECTED_DEPLOYMENT_ID=rc1-30b39ec-20260809 \
EXPECTED_SOURCE_COMMIT=30b39ec0034f335bdbda210f09c8ad66a26a25a2 \
EXPECTED_ARTIFACT_SHA256=9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e \
EXPECTED_MIGRATION_VERSION=0008_security_hardening_phase_1.sql \
sudo infrastructure/backup/verify-backup.sh \
  /opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz
```

Do not use the historical `c1b6958` artifact as the rollback target unless a
separate reproducible, lockfile-backed runtime image set is produced with
independent provenance. The current canonical baseline is `30b39ec`.

When a later verified forward deployment exists, rehearse rollback to the
verified baseline:

```bash
infrastructure/deploy/rollback-staging-artifact.sh \
  --confirm ROLLBACK \
  --artifact /opt/laborator-editura/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz \
  --sha256 9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e \
  --source-commit 30b39ec0034f335bdbda210f09c8ad66a26a25a2 \
  --migration-version 0008_security_hardening_phase_1.sql \
  --api-image laborator-rc1-api:30b39ec \
  --web-image laborator-rc1-web:30b39ec \
  --api-image-id sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451 \
  --web-image-id sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e
```

The rollback rehearsal must fail rather than pass if the target artifact,
runtime image IDs, release identity, health, or data integrity cannot be
independently verified.
