# RC1 Staging Deployment

Status: VERIFIED_LIVE
Generated: 2026-08-09  
Scope: RC1 Blocker 03B / 04

## Deployment Decision

Blocker 03B implemented an artifact-based staging deployment mechanism. The
baseline deployment identity below was validated on the VPS, and the same
artifact path was later used for Blocker 06 rollback/redeploy rehearsal.

## Artifact Selected for Staging

| Field | Value |
| --- | --- |
| Release version | `1.0.0-rc.1` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| SBOM | `docs/releases/v1.0/rc1-sbom.json` |
| Build provenance | `docs/releases/v1.0/rc1-build-provenance.md` |
| Database migration version | `0008_security_hardening_phase_1.sql` |
| Configuration profile | Staging, `NODE_ENV=production`, `APP_ENV=staging` |

## Artifact-Based Deployment Mechanism

| Evidence | Value |
| --- | --- |
| Artifact compose file | `deploy/staging/docker-compose.artifact.yml` |
| Artifact deploy script | `infrastructure/deploy/deploy-staging-artifact.sh` |
| Runtime image build helper | `infrastructure/deploy/build-runtime-images-from-artifact.sh` |
| Artifact rollback script | `infrastructure/deploy/rollback-staging-artifact.sh` |
| Artifact validator | `infrastructure/validation/validate-artifact-deploy.sh` |
| Source rebuild in RC staging path | Disabled by `docker compose up -d --no-build` and compose scan |
| Checksum mismatch behavior | Blocks deployment |
| Release identity file | `release-identity.json` in the immutable staging release directory |

## Staging Deployment Evidence

| Field | Value |
| --- | --- |
| Staging deployment ID | `rc1-30b39ec-20260809` operator-provided |
| Deployment timestamp | Not independently recorded here |
| Deployed services | Not independently recorded here |
| Staging deployed artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` operator-provided |
| Digest match | PASS |
| API image ID | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` operator-provided |
| Web image ID | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` operator-provided |

## Operator-Provided Live Deployment Identity

| Field | Value |
| --- | --- |
| Deployment ID | `rc1-30b39ec-20260809` |
| Release | `1.0.0-rc.1` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| Migration version | `0008_security_hardening_phase_1.sql` |

## Local Environment Note

This local execution environment does not expose staging host, user, deployment
path, or environment configuration. `deploy/staging/.env.staging` is not present
locally. Live deployment identity was verified on the VPS and is recorded as
operator-provided live evidence.

The legacy staging Docker Compose configuration still builds API and web images
from source and remains available only for ordinary non-RC staging refreshes.
That path is not sufficient for Blocker 03 because it would rebuild in staging
instead of proving:

```text
BUILD ONCE
VERIFY
DEPLOY SAME ARTIFACT
```

## Blocker 06 Forward Rehearsal Link

The verified forward rehearsal candidate was also deployed through the
artifact-based path:

| Field | Value |
| --- | --- |
| Release | `1.0.0-rc.1-rehearsal.1` |
| Source commit | `add6e73221d70fbc07d0f724a8322d5aa3b503d9` |
| Artifact SHA-256 | `05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4` |
| API image ID | `sha256:fb41892734fde36fe635add135eedafc24efefd93536a00c0ee20faad2cc0f7f` |
| WEB image ID | `sha256:c5cbbfcdad5247eb3dd29576f5a350d96274b670a4fca62bead502c6ea70ba17` |
| Rehearsal sequence | `30b39ec -> add6e73 -> 30b39ec -> add6e73` |

## Rollback Reference

| Field | Value |
| --- | --- |
| Previous artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz` |
| Previous artifact SHA-256 | `41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285` |
| Previous schema compatibility | Same latest migration: `0008_security_hardening_phase_1.sql` |
| Rollback runbook | `infrastructure/docs/DEPLOYMENT_RUNBOOK.md` |
| Rollback script | `infrastructure/deploy/rollback-staging-artifact.sh` |
| Current artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |

## Status

ARTIFACT_BASED_DEPLOYMENT = MECHANISM_VERIFIED_LOCALLY  
NEW_RC1_ARTIFACT = VERIFIED  
SOURCE_COMMIT = VERIFIED  
SBOM = VERIFIED  
BUILD_PROVENANCE = VERIFIED  
STAGING_DEPLOYMENT = SUCCESS
DEPLOYED_DIGEST_MATCH = PASS
DATABASE_MIGRATION_STATE = RECORDED  
ROLLBACK_REFERENCE = RECORDED  
SOURCE_REBUILD_IN_STAGING = DISABLED_FOR_RC_RELEASE_PATH
