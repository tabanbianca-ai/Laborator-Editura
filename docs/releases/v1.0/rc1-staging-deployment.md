# RC1 Staging Deployment

Status: MECHANISM_READY_NOT_DEPLOYED  
Generated: 2026-08-09  
Scope: RC1 Blocker 03B

## Deployment Decision

Blocker 03B implemented an artifact-based staging deployment mechanism. Blocker
03 is still not resolved because the exact remediated RC1 artifact has not been
deployed to the live staging environment and no deployed digest evidence is
available.

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
| Staging deployment ID | Not assigned on live staging |
| Deployment timestamp | Not recorded |
| Deployed services | Not recorded |
| Staging deployed artifact SHA-256 | Not recorded |
| Digest match | NOT_VERIFIED |

## Blocker

This local execution environment does not expose staging host, user, deployment
path, or environment configuration. `deploy/staging/.env.staging` is not present
locally. Therefore the artifact could not be copied to staging, extracted,
started, or independently verified.

The legacy staging Docker Compose configuration still builds API and web images
from source and remains available only for ordinary non-RC staging refreshes.
That path is not sufficient for Blocker 03 because it would rebuild in staging
instead of proving:

BUILD ONCE  
VERIFY  
DEPLOY SAME ARTIFACT

## Minimum External Deployment Procedure Required

To close this blocker, deploy the selected artifact by digest using the new RC
artifact path:

1. Produce runtime API and web image references or a saved image bundle from the
   verified artifact in the approved build pipeline.
2. Copy `laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` and runtime image
   evidence to the staging host.
3. Verify and deploy:

```bash
infrastructure/deploy/deploy-staging-artifact.sh \
  --artifact .releases/incoming/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz \
  --sha256 9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e \
  --source-commit 30b39ec0034f335bdbda210f09c8ad66a26a25a2 \
  --migration-version 0008_security_hardening_phase_1.sql \
  --api-image <approved-api-runtime-image> \
  --web-image <approved-web-runtime-image>
```

4. Record the deployment ID, deployment timestamp, runtime image identity,
   deployed services, and release identity file.
5. Confirm the deployed SHA-256 equals
   `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e`.

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
STAGING_DEPLOYMENT = NOT_EXECUTED  
DEPLOYED_DIGEST_MATCH = NOT_VERIFIED  
DATABASE_MIGRATION_STATE = RECORDED  
ROLLBACK_REFERENCE = RECORDED  
SOURCE_REBUILD_IN_STAGING = DISABLED_FOR_RC_RELEASE_PATH
