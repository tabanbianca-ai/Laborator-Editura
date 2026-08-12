# RC1 Forward Rehearsal Candidate

Status: VERIFIED_LIVE_REHEARSAL_COMPLETED
Generated: 2026-08-11
Scope: RC1 Blocker 06

## Purpose

This forward rehearsal candidate exists only to support the remaining live
rollback rehearsal:

forward deployment -> health/data verification -> rollback to `30b39ec` ->
health/data verification -> canonical redeploy verification.

It does not introduce product functionality and must not be used as a v1.1
starting point.

## Verified Rollback Baseline

| Field | Value |
| --- | --- |
| Release | `1.0.0-rc.1` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| Artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| API image | `laborator-rc1-api:30b39ec` |
| API image ID | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` |
| WEB image | `laborator-rc1-web:30b39ec` |
| WEB image ID | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` |
| Migration | `0008_security_hardening_phase_1.sql` |
| Blocker 05 backup | `/opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz` |

The historical `c1b6958` artifact remains preserved as historical evidence
only. It is not an executable rollback target because frozen dependency
resolution cannot be proven without `pnpm-lock.yaml`. Legacy `staging-api` and
`staging-web` images remain rejected because they lack independently
verifiable artifact, source, release, deployment, and provenance labels.

## Forward Candidate Identity

| Field | Value |
| --- | --- |
| Release version | `1.0.0-rc.1-rehearsal.1` |
| Source commit | `add6e73221d70fbc07d0f724a8322d5aa3b503d9` |
| Source newer than `30b39ec` | PASS |
| Branch | `main` |
| Source repository state at packaging | `clean` |
| Scope | RC1 remediation scripts, validation, rollback baseline evidence, deployment tooling, smoke-test contract correction, canonical path hardening |
| Artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.tar.gz` |
| Artifact metadata | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.artifact.json` |
| Artifact SHA-256 | `05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4` |
| Artifact size | `1914579` bytes |
| Created at | `2026-08-11T20:02:04.420Z` |
| Build command | `pnpm build` |
| Local builder | `darwin arm64` |
| Node version | `v24.14.0` |
| pnpm version used locally | `11.16.0` |
| Declared package manager | `pnpm@10.12.1` |

## Migration Compatibility

| Requirement | Status | Evidence |
| --- | --- | --- |
| Latest migration is not newer than `0008_security_hardening_phase_1.sql` | PASS | `packages/db/migrations` ends at `0008_security_hardening_phase_1.sql` |
| Artifact manifest records latest migration | PASS | `database.latestMigration = 0008_security_hardening_phase_1.sql` |
| Rollback compatibility with `30b39ec` | PASS_LOCAL | Forward candidate requires no newer DB migration |
| Irreversible DB state introduced | NO | No migration files were added |

## Smoke Contract

The staging smoke-test project creation payload includes:

```js
projectIdentity: {
  projectOrigin: "ORIGINAL_CREATION",
  rightsStatus: "ORIGINAL_CREATION"
}

publicationType: "BOOK"
```

The forward artifact validator extracts
`deploy/staging/scripts/staging-smoke-test.mjs` from the tarball and verifies
these fields.

## Artifact Content Validation

| Required entry | Status |
| --- | --- |
| `RELEASE_ARTIFACT_MANIFEST.json` | PASS |
| `pnpm-lock.yaml` | PASS |
| `package.json` | PASS |
| `pnpm-workspace.yaml` | PASS |
| `apps/api/dist/apps/api/src/main.js` | PASS |
| `apps/web/.next/BUILD_ID` | PASS |
| `deploy/staging/docker-compose.artifact.yml` | PASS |
| `infrastructure/deploy/deploy-staging-artifact.sh` | PASS |
| `infrastructure/deploy/rollback-staging-artifact.sh` | PASS |
| `infrastructure/deploy/build-runtime-images-from-artifact.sh` | PASS |
| `infrastructure/validation/validate-artifact-deploy.sh` | PASS |
| `infrastructure/validation/validate-rollback-baseline.sh` | PASS |

## Forward Runtime Images

| Field | Value |
| --- | --- |
| Forward API image | `laborator-rehearsal-api:add6e73` |
| Forward API image ID | `sha256:fb41892734fde36fe635add135eedafc24efefd93536a00c0ee20faad2cc0f7f` |
| Forward WEB image | `laborator-rehearsal-web:add6e73` |
| Forward WEB image ID | `sha256:c5cbbfcdad5247eb3dd29576f5a350d96274b670a4fca62bead502c6ea70ba17` |
| Local image build path | PASS_DRY_RUN |
| Live image build | PASS_OPERATOR_REPORTED |

Docker was not installed in the local Codex environment, so image IDs could not
be produced locally. The runtime images were later built and verified on the
VPS from this artifact through:

```bash
infrastructure/deploy/build-runtime-images-from-artifact.sh \
  --artifact artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.tar.gz \
  --sha256 05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4 \
  --source-commit add6e73221d70fbc07d0f724a8322d5aa3b503d9 \
  --api-image laborator-rehearsal-api:add6e73 \
  --web-image laborator-rehearsal-web:add6e73 \
  --output-metadata artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.runtime-images.json
```

## Local Validation

| Validation | Result |
| --- | --- |
| `git diff --check` | PASS |
| `pnpm install --frozen-lockfile` | PASS_WITH_WARNING: metadata fetch warning only |
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS |
| `pnpm test` | PASS |
| `pnpm build` | PASS_WITH_WARNING: existing Next.js ESLint plugin warning |
| Shell syntax validation | PASS |
| Deprecated mixed-case VPS path scan | PASS: no hits |
| Forward artifact validation | PASS |
| Rollback baseline validation | PASS |
| Runtime image build from artifact | PASS_DRY_RUN |
| Forward deploy preparation | PASS_DRY_RUN_WITH_PLACEHOLDER_IMAGE_IDS |

## Live VPS Command Plan

These commands were prepared for the live rehearsal and executed from the
connected VPS environment, not from the local Codex environment.

### A. Verify Blocker 05 Backup

```bash
cd /opt/laborator-editura

EXPECTED_DEPLOYMENT_ID=rc1-30b39ec-20260809 \
EXPECTED_SOURCE_COMMIT=30b39ec0034f335bdbda210f09c8ad66a26a25a2 \
EXPECTED_ARTIFACT_SHA256=9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e \
EXPECTED_MIGRATION_VERSION=0008_security_hardening_phase_1.sql \
sudo infrastructure/backup/verify-backup.sh \
  /opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz
```

### B. Capture Pre-Forward State

```bash
cd /opt/laborator-editura
cat .releases/staging/current/release-identity.json
docker compose --env-file deploy/staging/.env.staging -f deploy/staging/docker-compose.artifact.yml ps
docker image inspect laborator-rc1-api:30b39ec --format '{{.Id}}'
docker image inspect laborator-rc1-web:30b39ec --format '{{.Id}}'
```

### C. Transfer and Verify Forward Artifact

```bash
mkdir -p /opt/laborator-editura/artifacts/releases/v1.0/rc1
sha256sum /opt/laborator-editura/artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.tar.gz
test "$(sha256sum /opt/laborator-editura/artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.tar.gz | awk '{print $1}')" = "05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4"
```

### D. Build Verified Forward Runtime Images

```bash
cd /opt/laborator-editura

infrastructure/deploy/build-runtime-images-from-artifact.sh \
  --artifact /opt/laborator-editura/artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.tar.gz \
  --sha256 05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4 \
  --source-commit add6e73221d70fbc07d0f724a8322d5aa3b503d9 \
  --api-image laborator-rehearsal-api:add6e73 \
  --web-image laborator-rehearsal-web:add6e73 \
  --output-metadata /opt/laborator-editura/artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.runtime-images.json
```

### E. Deploy Forward Candidate With No Build

```bash
cd /opt/laborator-editura

FORWARD_API_IMAGE_ID="$(python3 -c 'import json;print(json.load(open("/opt/laborator-editura/artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.runtime-images.json"))["apiImageId"])')"
FORWARD_WEB_IMAGE_ID="$(python3 -c 'import json;print(json.load(open("/opt/laborator-editura/artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.runtime-images.json"))["webImageId"])')"

infrastructure/deploy/deploy-staging-artifact.sh \
  --artifact /opt/laborator-editura/artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.tar.gz \
  --sha256 05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4 \
  --source-commit add6e73221d70fbc07d0f724a8322d5aa3b503d9 \
  --migration-version 0008_security_hardening_phase_1.sql \
  --api-image laborator-rehearsal-api:add6e73 \
  --web-image laborator-rehearsal-web:add6e73 \
  --api-image-id "$FORWARD_API_IMAGE_ID" \
  --web-image-id "$FORWARD_WEB_IMAGE_ID"
```

### F through I. Verify Forward Runtime

```bash
cat /opt/laborator-editura/.releases/staging/current/release-identity.json
docker compose --env-file deploy/staging/.env.staging -f deploy/staging/docker-compose.artifact.yml ps
pnpm staging:health
pnpm staging:validate
pnpm staging:restore:dry-run
```

### J through N. Roll Back to Verified `30b39ec`

```bash
cd /opt/laborator-editura

infrastructure/deploy/rollback-staging-artifact.sh \
  --confirm ROLLBACK \
  --artifact /opt/laborator-editura/artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz \
  --sha256 9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e \
  --source-commit 30b39ec0034f335bdbda210f09c8ad66a26a25a2 \
  --migration-version 0008_security_hardening_phase_1.sql \
  --api-image laborator-rc1-api:30b39ec \
  --web-image laborator-rc1-web:30b39ec \
  --api-image-id sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451 \
  --web-image-id sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e

cat /opt/laborator-editura/.releases/staging/current/release-identity.json
pnpm staging:health
pnpm staging:validate
pnpm staging:restore:dry-run
```

### O through P. Canonical Redeploy and Final Verification

```bash
cd /opt/laborator-editura

infrastructure/deploy/deploy-staging-artifact.sh \
  --artifact /opt/laborator-editura/artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz \
  --sha256 9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e \
  --source-commit 30b39ec0034f335bdbda210f09c8ad66a26a25a2 \
  --migration-version 0008_security_hardening_phase_1.sql \
  --api-image laborator-rc1-api:30b39ec \
  --web-image laborator-rc1-web:30b39ec \
  --api-image-id sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451 \
  --web-image-id sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e

cat /opt/laborator-editura/.releases/staging/current/release-identity.json
pnpm staging:health
pnpm staging:validate
```

## Live Rehearsal Result

| Gate | Result |
| --- | --- |
| Sequence | `30b39ec -> add6e73 -> 30b39ec -> add6e73` |
| Forward deploy | PASS |
| Forward artifact digest | PASS |
| Forward runtime image IDs | PASS |
| Forward health | PASS |
| Real rollback to `30b39ec` | PASS |
| Rollback health | PASS |
| Rollback data integrity | PASS |
| Rollback smoke | PASS |
| Redeploy to `add6e73` | PASS |
| Final data integrity | PASS |
| Final `validate-staging` | PASS |

Final live staging validation:

```json
{
  "status": "ok",
  "action": "validate-staging",
  "results": [
    {"name": "environment", "status": "ok"},
    {"name": "health", "status": "ok"},
    {"name": "bootstrap-admin-reviewer", "status": "ok"},
    {"name": "smoke-test", "status": "ok"},
    {"name": "monitoring-hook", "status": "ok"}
  ]
}
```

Operational note: the live validation identified a context issue with relative
paths in `.env.staging`. The correct operator order is to source
`.env.staging` first, then export absolute `STAGING_ENV_FILE` and
`STAGING_COMPOSE_FILE` paths before running validation from a release
directory. This is recorded as an operator context issue, not a runtime defect.

## Decision

Blocker 06 is RESOLVED by operator-confirmed live VPS evidence. The historical
`c1b6958` artifact remains preserved evidence only; the executable rollback
baseline is `30b39ec`.
