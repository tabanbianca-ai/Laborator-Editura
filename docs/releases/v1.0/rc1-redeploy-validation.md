# RC1 Redeploy Validation

Status: VERIFIED_LIVE
Generated: 2026-08-11
Scope: RC1 Blocker 06

## Forward Rehearsal Candidate

| Field | Value |
| --- | --- |
| Evidence | `docs/releases/v1.0/rc1-forward-rehearsal-candidate.md` |
| Release version | `1.0.0-rc.1-rehearsal.1` |
| Source commit | `add6e73221d70fbc07d0f724a8322d5aa3b503d9` |
| Artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.tar.gz` |
| Artifact SHA-256 | `05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4` |
| Migration | `0008_security_hardening_phase_1.sql` |
| API image | `laborator-rehearsal-api:add6e73` |
| API image ID | `sha256:fb41892734fde36fe635add135eedafc24efefd93536a00c0ee20faad2cc0f7f` |
| WEB image | `laborator-rehearsal-web:add6e73` |
| WEB image ID | `sha256:c5cbbfcdad5247eb3dd29576f5a350d96274b670a4fca62bead502c6ea70ba17` |
| Live forward deployment | PASS |

The forward candidate was deployed, rolled back to the verified `30b39ec`
baseline, and redeployed live on staging to complete Blocker 06.

## Expected Final RC1 State

| Field | Value |
| --- | --- |
| Release | `1.0.0-rc.1` |
| Deployment ID | `rc1-30b39ec-20260809` or new recorded redeploy ID |
| Artifact | `/opt/laborator-editura/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| Artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| API image | `laborator-rc1-api:30b39ec` |
| API image ID | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` |
| WEB image | `laborator-rc1-web:30b39ec` |
| WEB image ID | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` |
| Migration | `0008_security_hardening_phase_1.sql` |

This expected final state is also the recommended verified rollback baseline
after the historical `c1b6958` target was rejected. See
`docs/releases/v1.0/rc1-rollback-baseline.md`.

## Local Redeploy Mechanism Validation

| Command / Check | Result | Notes |
| --- | --- | --- |
| `bash infrastructure/deploy/deploy-staging-artifact.sh ... --dry-run --skip-compose` | PASS | Current RC1 artifact checksum, source commit, migration, and release identity preparation validated locally |
| `bash infrastructure/validation/validate-artifact-deploy.sh` | PASS | No source rebuild path, checksum success path, and checksum mismatch failure gate validated |

Local validation did not start containers and did not verify live image IDs,
health, staging validation, or data integrity.

## Live Redeploy Status

| Gate | Status |
| --- | --- |
| RC1_REDEPLOY | PASS |
| RC1_ARTIFACT_DIGEST_MATCH | PASS |
| RC1_SOURCE_COMMIT_MATCH | PASS |
| RC1_API_IMAGE_ID_MATCH | PASS |
| RC1_WEB_IMAGE_ID_MATCH | PASS |
| POST_REDEPLOY_HEALTH | PASS |
| POST_REDEPLOY_DATA_INTEGRITY | PASS |
| STAGING_VALIDATION | PASS |
| DATA_LOSS | 0 |
| BLOCKING_ERRORS | 0 |

## Required Live VPS Redeploy Command

After rollback has been verified, redeploy the current RC1 through the artifact
path only:

```bash
cd /opt/laborator-editura

infrastructure/deploy/deploy-staging-artifact.sh \
  --artifact /opt/laborator-editura/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz \
  --sha256 9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e \
  --source-commit 30b39ec0034f335bdbda210f09c8ad66a26a25a2 \
  --migration-version 0008_security_hardening_phase_1.sql \
  --api-image laborator-rc1-api:30b39ec \
  --web-image laborator-rc1-web:30b39ec \
  --api-image-id sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451 \
  --web-image-id sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e
```

The deploy script must use `docker compose up -d --no-build` through
`deploy/staging/docker-compose.artifact.yml`.

## Required Final Validation

Run the canonical staging validation path after redeploy:

```bash
pnpm staging:health
pnpm staging:validate
```

The final expected validation sequence is:

| Step | Expected Result |
| --- | --- |
| environment | PASS |
| health | PASS |
| bootstrap-admin-reviewer | PASS |
| smoke-test | PASS |
| monitoring-hook | PASS |

The smoke test must remain aligned with the current Project API contract:
`projectIdentity.projectOrigin`, `projectIdentity.rightsStatus`, and
`publicationType`.
