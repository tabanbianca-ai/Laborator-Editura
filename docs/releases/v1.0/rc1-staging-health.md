# RC1 Staging Health Validation

Status: NOT_VERIFIED_LIVE  
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
| API container running | NOT_VERIFIED | Requires live VPS Docker access |
| Web container running | NOT_VERIFIED | Requires live VPS Docker access |
| API container healthy | NOT_VERIFIED | Requires live VPS Docker access |
| Web container healthy | NOT_VERIFIED | Requires live VPS Docker access |
| API image ID matches expected | NOT_VERIFIED | Requires `docker inspect` on VPS |
| Web image ID matches expected | NOT_VERIFIED | Requires `docker inspect` on VPS |
| Artifact digest labels match expected | NOT_VERIFIED | Requires `docker inspect` on VPS |
| Deployment identity matches expected | NOT_VERIFIED | Requires live `RELEASE_IDENTITY.json` or labels |
| Web endpoint responds | NOT_VERIFIED | Requires live staging endpoint |
| API `/health` responds | NOT_VERIFIED | Requires live staging endpoint |

## Repository-Supported Command

```bash
pnpm staging:health
```

Expected on VPS: PASS with `API_BASE`, `STAGING_WEB_ORIGIN`, and
`deploy/staging/.env.staging` loaded from the real staging configuration.

## Local Execution Limitation

This Codex environment exposes no `VPS_*`, `DEPLOY_*`, or `STAGING_*` target
variables and does not contain `deploy/staging/.env.staging`. Live container
state, health, and deployment identity were not independently verified here.

## Completion Signals

STAGING_CONTAINERS = NOT_VERIFIED  
WEB_HEALTH = NOT_VERIFIED  
API_HEALTH = NOT_VERIFIED  
RELEASE_IDENTITY_MATCH = NOT_VERIFIED  
RUNTIME_ERRORS_BLOCKING = NOT_VERIFIED  
UNEXPECTED_RESTARTS = NOT_VERIFIED
