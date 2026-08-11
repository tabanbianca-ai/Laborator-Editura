# RC1 Staging Pipeline Validation

Status: REPOSITORY_READY_LIVE_NOT_EXECUTED  
Generated: 2026-08-09  
Scope: RC1 Blocker 04

## Required Canonical Commands

| Command | Status | Notes |
| --- | --- | --- |
| `pnpm staging:health` | NOT_EXECUTED_LIVE | Requires real VPS staging configuration |
| `pnpm staging:validate` | NOT_EXECUTED_LIVE | Requires real VPS staging configuration |
| `pnpm staging:monitor` | NOT_EXECUTED_LIVE | Requires real VPS staging configuration |

## Repository Pipeline Scripts

| Script | Purpose |
| --- | --- |
| `deploy/staging/scripts/health-check.mjs` | API and web health probes |
| `deploy/staging/scripts/validate-staging.mjs` | Environment, health, bootstrap, smoke, and monitoring sequence |
| `deploy/staging/scripts/staging-smoke-test.mjs` | Non-destructive controlled staging smoke path |
| `deploy/staging/scripts/monitoring-hook.mjs` | Health and backup/runtime status monitor |
| `deploy/staging/scripts/logs-staging.sh` | Docker Compose log access |

## Canonical Path Validation

| Check | Status |
| --- | --- |
| Deprecated mixed-case deployment path references removed from deploy/infrastructure/docs | PASS |
| Canonical `/opt/laborator-editura` used in infrastructure defaults and runbooks | PASS |
| Paths remain configurable through environment/config files | PASS |

## Local Validation Performed

```bash
rg -n "deprecated-mixed-case-deployment-path-pattern" deploy infrastructure docs .github package.json
```

Result: PASS, no deprecated uppercase deployment path references remain.

## Completion Signals

STAGING_HEALTH_COMMAND = NOT_VERIFIED_LIVE  
STAGING_VALIDATE_COMMAND = NOT_VERIFIED_LIVE  
CANONICAL_DEPLOYMENT_PATH = PASS  
NO_SOURCE_REBUILD_OCCURRED = NOT_VERIFIED_LIVE
