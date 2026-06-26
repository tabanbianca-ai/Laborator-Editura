# Phase 7 Step 4 Staging Launch Validation Report

Date: 2026-06-26

Scope: validation only. No new features, modules, business logic changes, or UI
redesign were performed.

## Executive Result

Final recommendation: **NO-GO for public launch today**.

The codebase passes local validation and production build, but the real staging
launch could not be validated because the local validation environment does not
have Docker available and does not contain a real `deploy/staging/.env.staging`
file with required staging variables and secrets.

Code release-candidate status: **GO**.

Staging launch status: **FAIL** until clean deployment, health checks,
backup/restore, smoke test, monitoring, and browser reviews pass against a real
staging environment.

## Validation Commands Executed

| Command | Result | Notes |
| --- | --- | --- |
| `git diff --check` | PASS | No whitespace or patch formatting issues. |
| `pnpm test` | PASS | Full available suite passed across 5 packages. |
| `pnpm build` | PASS | Production build passed after using the bundled Python runtime in `PATH`. |
| `docker --version` | FAIL | `docker` command is not available in this environment. |
| `docker compose -f deploy/staging/docker-compose.staging.yml up -d --build` | FAIL | Cannot run because `docker` is not available. |
| `node deploy/staging/scripts/validate-env.mjs` | FAIL | Required staging variables and secrets are missing. |
| `node deploy/staging/scripts/health-check.mjs` | FAIL | No running API/Web services at localhost staging ports. |
| `node deploy/staging/scripts/staging-smoke-test.mjs` | FAIL | `API_BASE` is missing and staging is not running. |
| `node deploy/staging/scripts/restore-dry-run.mjs` | FAIL | `STAGING_BACKUP_FILE` is missing because no staging backup was produced. |
| `node deploy/staging/scripts/monitoring-hook.mjs` | FAIL | API/Web/runtime DB/backup checks failed because staging is not running and env is missing. |

## PASS / FAIL Matrix

| # | Item | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Clean staging deployment | FAIL | Docker is unavailable, so staging deployment could not be built or started. |
| 2 | Docker containers healthy | FAIL | Containers could not be created or inspected because Docker is unavailable. |
| 3 | API health | FAIL | Health script could not reach `http://localhost:3001/health`. |
| 4 | Web health | FAIL | Health script could not reach `http://localhost:3000`. |
| 5 | Database connectivity | FAIL | Monitoring script reports `LABORATOR_RUNTIME_DB_PATH` is not set and no runtime DB is running. |
| 6 | Backup & Restore dry-run | FAIL | Restore dry-run requires `STAGING_BACKUP_FILE`; no staging backup exists. |
| 7 | Environment variables & secrets | FAIL | Missing `WEB_ORIGIN`, `LABORATOR_RUNTIME_DB_PATH`, `LABORATOR_SESSION_SECRET`, `LABORATOR_AUTH_LOGIN_SECRET`, `STAGING_BACKUP_DIR`, `STAGING_RESTORE_DB_PATH`, `API_BASE` or `API_BASE_URL`, and staging web origin. |
| 8 | Rollback procedure | PASS | Rollback criteria and steps are documented in `docs/STAGING_VALIDATION_PLAN.md` and `docs/PHASE_10_STAGING_DEPLOYMENT_PLAN.md`. Runtime rollback was not executed because deployment did not run. |
| 9 | Smoke test of the complete Editorial Production Pipeline | FAIL | Staging smoke test could not run because `API_BASE` is missing and API is not running. |
| 10 | Rights & Provenance | PASS | Contract and frontend tests cover rights/provenance warnings, attribution, and human final authority. Live staging validation remains blocked by deployment failure. |
| 11 | Language Policy | PASS | Contract and frontend tests cover `platformLanguage`, `originalLanguage`, `authoringLanguage`, `targetLanguage`, and locale separation. |
| 12 | Pipeline | PASS | Frontend tests cover the production pipeline, locked steps, optional branches, and no dead-end navigation. Live staging validation remains blocked. |
| 13 | Distribution Center | PASS | Frontend tests cover Preflight and Distribution Center readiness, blockers, channels, and human authority. Live staging validation remains blocked. |
| 14 | Audiobook Preview/Official flow | PASS | Pipeline tests cover preview availability and official audiobook gating after final approval and rights. |
| 15 | Video Preview/Official flow | PASS | Pipeline tests cover draft preview video and official video gating after final approval and rights. |
| 16 | Magazine Digital Experience | PASS | Frontend tests cover magazine routes, issue detail, flipbook placeholder, audio/video article states, and rights warnings. |
| 17 | Accessibility quick review | FAIL | A live browser review could not be performed because staging did not start. Static tests confirm semantic route/page coverage only. |
| 18 | Mobile responsive review | FAIL | A live mobile viewport review could not be performed because staging did not start. Responsive implementation remains covered only by static/frontend tests. |
| 19 | Performance sanity check | PASS | Production build passed and generated 29 app routes; first-load shared JS is approximately 102 kB. Live latency checks failed because staging is not running. |
| 20 | Monitoring/logging verification | FAIL | Monitoring hook failed because API/Web are unreachable and runtime DB/backup env values are missing. |

## Local Validation Evidence

| Validation | Result |
| --- | --- |
| Full test suite | PASS, 5 packages |
| API tests | PASS, 321 tests |
| Web tests | PASS, 81 tests |
| DB tests | PASS, 49 tests |
| Shared tests | PASS, 8 tests |
| Production build | PASS, 5 packages |
| Web production routes | PASS, 29 app routes generated |

## Blocking Issues

| ID | Severity | Issue | Required Action |
| --- | --- | --- | --- |
| B-01 | Critical | Docker is not available in the validation environment. | Run staging validation on the VPS or a machine with Docker and Docker Compose installed. |
| B-02 | Critical | Real staging environment file is missing. | Create `deploy/staging/.env.staging` from the example and replace all placeholders with strong real values. Do not commit it. |
| B-03 | Critical | Staging API and Web services are not running. | Start a clean staging deployment from the release commit and rerun health checks. |
| B-04 | Critical | Backup/restore dry-run cannot run without a generated staging backup. | Generate a staging backup after deployment, then run restore dry-run with `STAGING_BACKUP_FILE`. |
| B-05 | Critical | End-to-end staging smoke test did not run. | Rerun `node deploy/staging/scripts/staging-smoke-test.mjs` after API/Web are healthy and env is configured. |
| B-06 | High | Accessibility and mobile reviews were not performed in a live browser. | Run quick desktop/tablet/mobile browser checks after staging is live. |

## Non-Blocking Issues

| ID | Issue | Recommendation |
| --- | --- | --- |
| N-01 | Turborepo reports missing `pnpm-lock.yaml`, so some workspace/cache features are unavailable. | Generate and commit a lockfile when dependency policy is finalized. |
| N-02 | Next production build reports that the Next.js ESLint plugin is not detected. | Add or document the Next.js ESLint plugin configuration after v1.0 if desired. |
| N-03 | Full production build needs Python available as `python` for the AI package build. | Ensure CI/staging build environments include Python in `PATH` or adjust the AI package build command in a separate approved cleanup. |

## Required Re-Validation On Staging

Run these from the staging host after pulling the exact release commit:

```bash
cp deploy/staging/.env.staging.example deploy/staging/.env.staging
# Edit deploy/staging/.env.staging with real secrets and public staging URLs.

docker compose -f deploy/staging/docker-compose.staging.yml up -d --build
docker compose -f deploy/staging/docker-compose.staging.yml ps
node deploy/staging/scripts/validate-env.mjs
node deploy/staging/scripts/health-check.mjs
node deploy/staging/scripts/bootstrap-admin-reviewer.mjs
node deploy/staging/scripts/staging-smoke-test.mjs
node deploy/staging/scripts/backup-staging.mjs
node deploy/staging/scripts/restore-dry-run.mjs
node deploy/staging/scripts/monitoring-hook.mjs
```

Browser checks after staging is live:

- Open `/pipeline`.
- Open `/distribution`.
- Open `/rights`.
- Open `/magazine`.
- Test desktop, tablet, and mobile widths.
- Confirm warning banners, locked steps, and disabled publish/approve actions.
- Confirm no draft Audiobook or Video output is public.

## Final GO / NO-GO Recommendation

Current decision: **NO-GO for public launch**.

Reason: runtime staging validation did not pass because staging could not be
deployed or exercised in this environment.

Launch may change to **GO** only after:

1. Clean staging deployment succeeds.
2. API and Web containers are healthy.
3. Environment validation passes with real secrets.
4. Backup and restore dry-run passes.
5. Full staging smoke test passes.
6. Monitoring/logging hook passes.
7. Accessibility and mobile quick reviews are completed.

Until then, the platform remains a validated code release candidate, not a
public-launch-approved deployment.
