# RC1 Readiness Report

Status: RC1_CONDITIONAL_GO
Generated: 2026-08-12
Candidate commit: `30b39ec0034f335bdbda210f09c8ad66a26a25a2`
Branch: `main`

## Executive Decision

RC1 READINESS DECISION: CONDITIONAL_GO.

RC1 has no open P0 blockers after live Blocker 05 backup/restore validation
and live Blocker 06 rollback/redeploy rehearsal. It is not a full GO because
five P1 critical evidence gates remain open and must be closed or formally
accepted before production certification.

The repository-level implementation is in strong shape: typecheck, build, lint,
format, configuration validation, DB tests, shared tests, web tests, API tests,
and local runtime backup/restore validation passed.

Remaining critical evidence gaps:

- Live adversarial security testing.
- Browser-level accessibility review.
- Browser-level localization review.
- Staging performance baseline.
- Real clean/existing PostgreSQL migration execution.

Blocker 08 attempted to close these five P1 critical evidence gaps on
2026-08-12. It did not mark them PASS because live VPS access, browser-level
accessibility/localization tooling, staging metrics capture, and isolated
PostgreSQL execution were not available in the local Codex environment.

## Final Status Matrix

| Area                                         | Status          | Notes                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Automated tests                              | PASS            | DB 49, shared 62, web 128, API 505 passed                                                                                                                                                                                                                                                               |
| Typecheck                                    | PASS            | Workspace, API, and web typecheck passed                                                                                                                                                                                                                                                                |
| Build                                        | PASS            | Workspace, DB, API, and web production build passed                                                                                                                                                                                                                                                     |
| Immutable artifact, digest, SBOM, provenance | PASS            | Remediated artifact `laborator-editura-1.0.0-rc.1-30b39ec.tar.gz`, SHA-256 `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e`; previous `c1b6958` artifact preserved as historical                                                                                                      |
| Lint and format                              | PASS            | Lint and Prettier checks passed                                                                                                                                                                                                                                                                         |
| Configuration validation                     | PASS            | Configuration examples validated                                                                                                                                                                                                                                                                        |
| Critical E2E                                 | PASS            | Contract E2E passed and operator-provided live staging smoke passed                                                                                                                                                                                                                                     |
| Security                                     | PARTIAL_BLOCKED | Contract security and dependency audit passed; live adversarial evidence missing                                                                                                                                                                                                                        |
| Cross-org isolation                          | PARTIAL         | Contract tests passed; live staging adversarial run missing                                                                                                                                                                                                                                             |
| Data integrity                               | PASS            | Contract, Blocker 05 restore, and Blocker 06 rollback/redeploy data integrity evidence passed                                                                                                                                                                                                           |
| Accessibility                                | BLOCKED         | Browser-level accessibility evidence missing                                                                                                                                                                                                                                                            |
| Localization                                 | BLOCKED         | P1-03 runner is prepared; live baseline found English metadata leakage and no nine-locale switcher; post-deployment nine-locale crawl is still missing                                                                                                                                                  |
| Migration                                    | PARTIAL_BLOCKED | SQL contract tests passed; real clean/existing/upgrade run missing                                                                                                                                                                                                                                      |
| Backup/restore                               | PASS            | Blocker 05 live backup, checksum, archive verification, release identity, isolated restore, and restored data evidence operator-reported PASS                                                                                                                                                           |
| Deployment/rollback                          | PASS            | Artifact-based staging deployment, verified rollback baseline, forward rehearsal, rollback, redeploy, health, smoke, and final staging validation passed; repository tooling now uses portable artifact/source/migration labels instead of post-`docker save/load` image ID equality as the deploy gate |
| Staging health/smoke/monitoring              | PASS            | Operator-provided live staging validation passed: environment, health, bootstrap-admin-reviewer, smoke-test, monitoring-hook, validate-staging                                                                                                                                                          |
| Performance                                  | PARTIAL_BLOCKED | Local build/test baseline only; staging runtime baseline missing                                                                                                                                                                                                                                        |
| Dependency vulnerability                     | PASS            | `pnpm-lock.yaml` is present; frozen install passed; full and production `pnpm audit` report 0 findings                                                                                                                                                                                                  |

## Counts

| Severity    | Count              |
| ----------- | ------------------ |
| P0 BLOCKER  | 0 open, 5 resolved |
| P1 CRITICAL | 5 open, 1 resolved |
| P2 MAJOR    | 2                  |
| P3 MINOR    | 1                  |
| P4 TRIVIAL  | 0                  |

## Blocking Fix Order

1. Run live security adversarial tests.
2. Run browser-level localization and accessibility reviews.
3. Run clean/existing/upgrade migration execution against real database targets.
4. Capture staging performance baseline.

## Blocker 08 Attempt

BLOCKER 08 STATUS: NOT RESOLVED.

| P1 Gate                           | Blocker 08 result    | Reason                                                                                                                                          |
| --------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Live adversarial security suite   | LIVE_ACTION_REQUIRED | Local contracts and smoke tests exist, but no live staging adversarial run was executed                                                         |
| Browser accessibility review      | LIVE_ACTION_REQUIRED | No repository-supported Playwright, axe, Lighthouse, or browser accessibility runner is available locally                                       |
| Seven-language localization crawl | LIVE_ACTION_REQUIRED | Nine-locale Playwright and manual Actions coverage is prepared; current staging still lacks the change and no authenticated evidence run exists |
| Staging performance baseline      | LIVE_ACTION_REQUIRED | Local build/test timings exist; no live VPS latency/resource baseline was captured                                                              |
| PostgreSQL clean migration        | LIVE_ACTION_REQUIRED | Local environment has no `psql` or Docker for real PostgreSQL execution                                                                         |
| PostgreSQL existing DB migration  | LIVE_ACTION_REQUIRED | No isolated representative existing PostgreSQL target was available                                                                             |

RC1 remains CONDITIONAL_GO. Full GO requires these gates to become PASS, with
0 Critical and 0 High open defects.

## Blocker 01 Resolution

BLOCKER 01 STATUS: RESOLVED.

| Evidence           | Value                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| RC1 artifact       | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz` |
| Source commit      | `c1b6958c0c8c92e3946addfcab48bc695962ca98`                                |
| SHA-256            | `41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285`        |
| SBOM               | `docs/releases/v1.0/rc1-sbom.json`                                        |
| Build provenance   | `docs/releases/v1.0/rc1-build-provenance.md`                              |
| Release validation | `node scripts/validate-rc1-release-evidence.mjs`                          |

## Blocker 02 Resolution

BLOCKER 02 STATUS: RESOLVED.

| Evidence                 | Value                                                              |
| ------------------------ | ------------------------------------------------------------------ |
| Lockfile                 | `pnpm-lock.yaml`                                                   |
| Lockfile SHA-256         | `569b71350933f1f2e6028bbc6480b9b385dfe267929b136ca3bdc353f3d1b075` |
| Frozen install           | PASS                                                               |
| Dependency audit         | PASS                                                               |
| Critical                 | 0                                                                  |
| High                     | 0                                                                  |
| Moderate                 | 0                                                                  |
| Low                      | 0                                                                  |
| SBOM                     | `docs/releases/v1.0/rc1-sbom.json` updated with lockfile evidence  |
| Previous artifact status | SUPERSEDED_FOR_CERTIFICATION                                       |

## Blocker 03 Resolution

BLOCKER 03 STATUS: RESOLVED.

| Evidence                       | Value                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| New RC1 artifact               | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz`                         |
| Source commit                  | `30b39ec0034f335bdbda210f09c8ad66a26a25a2`                                                        |
| SHA-256                        | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e`                                |
| SBOM                           | `docs/releases/v1.0/rc1-sbom.json`                                                                |
| Build provenance               | `docs/releases/v1.0/rc1-build-provenance.md`                                                      |
| Staging deployment evidence    | `docs/releases/v1.0/rc1-staging-deployment.md`                                                    |
| Artifact deployment mechanism  | `deploy/staging/docker-compose.artifact.yml`, `infrastructure/deploy/deploy-staging-artifact.sh`  |
| Artifact deployment validation | PASS: `bash infrastructure/validation/validate-artifact-deploy.sh`                                |
| Deployment status              | LIVE_STAGING_DEPLOYMENT_SUCCESS                                                                   |
| Deployed digest verification   | PASS                                                                                              |
| Migration version              | `0008_security_hardening_phase_1.sql`                                                             |
| Rollback reference             | `infrastructure/docs/DEPLOYMENT_RUNBOOK.md`, `infrastructure/deploy/rollback-staging-artifact.sh` |

Repository update on 2026-08-21: build-time Docker image IDs remain recorded as
provenance evidence, but artifact staging deployment no longer treats those IDs
as the portable post-`docker save/load` acceptance gate. The fail-closed gate is
now the approved artifact SHA-256 plus release/source/migration labels on loaded
images and running containers.

## Blocker 04 Resolution

BLOCKER 04 STATUS: RESOLVED.

| Evidence                  | Value                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| Expected deployment ID    | `rc1-30b39ec-20260809`                                                                             |
| Release                   | `1.0.0-rc.1`                                                                                       |
| Source commit             | `30b39ec0034f335bdbda210f09c8ad66a26a25a2`                                                         |
| Artifact SHA-256          | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e`                                 |
| API image ID              | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451`                          |
| Web image ID              | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e`                          |
| Migration version         | `0008_security_hardening_phase_1.sql`                                                              |
| Staging health evidence   | `docs/releases/v1.0/rc1-staging-health.md`                                                         |
| Staging smoke evidence    | `docs/releases/v1.0/rc1-staging-smoke.md`                                                          |
| Monitoring evidence       | `docs/releases/v1.0/rc1-monitoring-validation.md`                                                  |
| Pipeline evidence         | `docs/releases/v1.0/rc1-pipeline-validation.md`                                                    |
| Canonical deployment path | PASS: deprecated mixed-case deployment path references removed                                     |
| Live command status       | PASS: environment, health, bootstrap-admin-reviewer, smoke-test, monitoring-hook, validate-staging |

## Blocker 05 Resolution

BLOCKER 05 STATUS: RESOLVED.

| Evidence                                    | Value                                                                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deployment ID                               | `rc1-30b39ec-20260809`                                                                                                                                                          |
| Source commit                               | `30b39ec0034f335bdbda210f09c8ad66a26a25a2`                                                                                                                                      |
| Artifact SHA-256                            | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e`                                                                                                              |
| Backup evidence                             | `docs/releases/v1.0/rc1-backup-results.md`                                                                                                                                      |
| Restore evidence                            | `docs/releases/v1.0/rc1-restore-results.md`                                                                                                                                     |
| Data integrity evidence                     | `docs/releases/v1.0/rc1-data-integrity-results.md`                                                                                                                              |
| Canonical backup scripts                    | `infrastructure/backup/backup-laborator.sh`, `infrastructure/backup/verify-backup.sh`, `infrastructure/backup/restore-dry-run.sh`, `infrastructure/backup/restore-laborator.sh` |
| Live backup                                 | `/opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz`                                                                                                              |
| Backup checksum                             | PASS                                                                                                                                                                            |
| Backup archive verification                 | PASS                                                                                                                                                                            |
| Release identity metadata                   | PASS                                                                                                                                                                            |
| Isolated restore                            | PASS                                                                                                                                                                            |
| Restored runtime DB                         | PASS                                                                                                                                                                            |
| Reviewer/organization/project/document data | PASS                                                                                                                                                                            |
| Live staging after restore                  | HEALTHY                                                                                                                                                                         |

## Blocker 06 Resolution

BLOCKER 06 STATUS: RESOLVED.

| Evidence                             | Value                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| Rollback evidence                    | `docs/releases/v1.0/rc1-rollback-rehearsal.md`                                        |
| Redeploy evidence                    | `docs/releases/v1.0/rc1-redeploy-validation.md`                                       |
| Rollback baseline evidence           | `docs/releases/v1.0/rc1-rollback-baseline.md`                                         |
| Forward rehearsal candidate evidence | `docs/releases/v1.0/rc1-forward-rehearsal-candidate.md`                               |
| Historical rollback artifact         | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz`             |
| Historical rollback artifact SHA-256 | `41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285`                    |
| Historical rollback source commit    | `c1b6958c0c8c92e3946addfcab48bc695962ca98`                                            |
| Historical runtime build             | FAIL: `ERR_PNPM_NO_LOCKFILE`                                                          |
| Legacy rollback images               | REJECTED: missing artifact/source/release/deployment/provenance labels                |
| Recommended rollback baseline        | `30b39ec0034f335bdbda210f09c8ad66a26a25a2`                                            |
| Baseline artifact SHA-256            | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e`                    |
| Baseline API image ID                | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451`             |
| Baseline WEB image ID                | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e`             |
| Forward release version              | `1.0.0-rc.1-rehearsal.1`                                                              |
| Forward source commit                | `add6e73221d70fbc07d0f724a8322d5aa3b503d9`                                            |
| Forward artifact                     | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.tar.gz` |
| Forward artifact SHA-256             | `05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4`                    |
| Forward artifact validation          | PASS_LOCAL                                                                            |
| Forward API image ID                 | `sha256:fb41892734fde36fe635add135eedafc24efefd93536a00c0ee20faad2cc0f7f`             |
| Forward WEB image ID                 | `sha256:c5cbbfcdad5247eb3dd29576f5a350d96274b670a4fca62bead502c6ea70ba17`             |
| Forward runtime images               | PASS_OPERATOR_REPORTED                                                                |
| Rollback baseline validator          | PASS_LOCAL                                                                            |
| Current RC1 redeploy dry-run         | PASS: canonical deploy script validated current artifact metadata locally             |
| Artifact deployment validator        | PASS                                                                                  |
| Live rehearsal sequence              | `30b39ec -> add6e73 -> 30b39ec -> add6e73`                                            |
| Live forward deployment              | PASS                                                                                  |
| Live rollback execution              | PASS                                                                                  |
| Live rollback health                 | PASS                                                                                  |
| Live rollback data integrity         | PASS                                                                                  |
| Live rollback smoke                  | PASS                                                                                  |
| Live redeploy execution              | PASS                                                                                  |
| Final data integrity                 | PASS                                                                                  |
| Post-redeploy staging validation     | PASS                                                                                  |
| Migration version                    | `0008_security_hardening_phase_1.sql`                                                 |

## Pilot Decision

RC1 READY FOR PILOT: CONDITIONAL_GO.

RC1 may proceed only to the next controlled validation stage. Production
certification requires closure or formal owner acceptance of all five open P1
critical evidence gaps.
