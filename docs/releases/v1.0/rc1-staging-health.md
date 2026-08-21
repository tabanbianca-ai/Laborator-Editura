# RC1 Staging Health Validation

Status: VERIFIED_LIVE  
Generated: 2026-08-09  
Scope: RC1 Blocker 04

## Expected Live Deployment Identity

| Field | Value |
| --- | --- |
| Deployment ID | `rc1-30b39ec-20260809` |
| Release | `1.0.0-rc.1` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| API image ID | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` |
| Web image ID | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` |
| Migration | `0008_security_hardening_phase_1.sql` |

## Required Live Checks

| Check | Status | Evidence |
| --- | --- | --- |
| API container running | PASS | Operator-reported live VPS validation |
| Web container running | PASS | Operator-reported live VPS validation |
| API container healthy | PASS | Operator-reported live VPS validation |
| Web container healthy | PASS | Operator-reported live VPS validation |
| API image ID matches expected | PASS | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` |
| Web image ID matches expected | PASS | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` |
| Artifact digest labels match expected | PASS | Operator-reported live VPS validation |
| Deployment identity matches expected | PASS | `rc1-30b39ec-20260809` |
| Web endpoint responds | PASS | Operator-reported live VPS validation |
| API `/health` responds | PASS | Operator-reported live VPS validation |

## Runtime Identity Portability Note

The image IDs above are preserved as operator-reported live evidence. For
future artifact-based staging verification, repository tooling verifies the
approved release identity through the artifact SHA-256 and release labels on
loaded images and running containers. Build-time image ID equality is no longer
treated as the portable gate after `docker save` and `docker load`.

## Repository-Supported Command

```bash
pnpm staging:health
```

Expected on VPS: PASS with `API_BASE`, `STAGING_WEB_ORIGIN`, and
`deploy/staging/.env.staging` loaded from the real staging configuration.

## Local Execution Limitation

This Codex environment exposes no `VPS_*`, `DEPLOY_*`, or `STAGING_*` target
variables and does not contain `deploy/staging/.env.staging`. Live container
state, health, and deployment identity were validated on the VPS and recorded
as operator-provided evidence.

## Completion Signals

STAGING_CONTAINERS = HEALTHY  
WEB_HEALTH = PASS  
API_HEALTH = PASS  
RELEASE_IDENTITY_MATCH = PASS  
RUNTIME_ERRORS_BLOCKING = 0  
UNEXPECTED_RESTARTS = 0
