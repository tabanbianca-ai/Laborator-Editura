# RC1 Readiness Report

Status: RC1_BLOCKED
Generated: 2026-08-11
Candidate commit: `30b39ec0034f335bdbda210f09c8ad66a26a25a2`
Branch: `main`

## Executive Decision

RC1 is not ready for pilot or certification.

The repository-level implementation is in strong shape: typecheck, build, lint,
format, configuration validation, DB tests, shared tests, web tests, API tests,
and local runtime backup/restore validation passed.

The release is blocked by missing mandatory release evidence:

- Live isolated restore from a staging backup.
- Rollback rehearsal.
- Browser-level accessibility review.
- Browser-level localization review.
- Staging performance baseline.
- Real clean/existing/upgrade migration execution.

## Final Status Matrix

| Area | Status | Notes |
| --- | --- | --- |
| Automated tests | PASS | DB 49, shared 62, web 128, API 505 passed |
| Typecheck | PASS | Workspace, API, and web typecheck passed |
| Build | PASS | Workspace, DB, API, and web production build passed |
| Immutable artifact, digest, SBOM, provenance | PASS | Remediated artifact `laborator-editura-1.0.0-rc.1-30b39ec.tar.gz`, SHA-256 `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e`; previous `c1b6958` artifact preserved as historical |
| Lint and format | PASS | Lint and Prettier checks passed |
| Configuration validation | PASS | Configuration examples validated |
| Critical E2E | PASS | Contract E2E passed and operator-provided live staging smoke passed |
| Security | PARTIAL_BLOCKED | Contract security and dependency audit passed; live adversarial evidence missing |
| Cross-org isolation | PARTIAL | Contract tests passed; live staging adversarial run missing |
| Data integrity | PARTIAL_BLOCKED | Contract and local runtime restore passed; live staging backup/isolated restore evidence missing |
| Accessibility | BLOCKED | Browser-level accessibility evidence missing |
| Localization | BLOCKED | Browser-level seven-language and mixed-language evidence missing |
| Migration | PARTIAL_BLOCKED | SQL contract tests passed; real clean/existing/upgrade run missing |
| Backup/restore | PARTIAL_BLOCKED | Local runtime restore passed; live staging backup and isolated restore not executed from this environment |
| Deployment/rollback | PARTIAL_BLOCKED | Artifact-based staging deployment is resolved; rollback rehearsal remains missing |
| Staging health/smoke/monitoring | PASS | Operator-provided live staging validation passed: environment, health, bootstrap-admin-reviewer, smoke-test, monitoring-hook, validate-staging |
| Performance | PARTIAL_BLOCKED | Local build/test baseline only; staging runtime baseline missing |
| Dependency vulnerability | PASS | `pnpm-lock.yaml` is present; frozen install passed; full and production `pnpm audit` report 0 findings |

## Counts

| Severity | Count |
| --- | --- |
| P0 BLOCKER | 2 open, 3 resolved |
| P1 CRITICAL | 5 open, 1 resolved |
| P2 MAJOR | 2 |
| P3 MINOR | 1 |
| P4 TRIVIAL | 0 |

## Blocking Fix Order

1. Generate a live staging backup from deployment `rc1-30b39ec-20260809`.
2. Verify backup checksum, archive structure, runtime database payload, and RC1
   release identity metadata.
3. Run isolated restore into separate volumes and validate restored data without
   changing live staging.
4. Verify live API and WEB remain healthy after the isolated restore.
5. Execute rollback and redeploy rehearsal.
6. Run live security adversarial tests.
7. Run browser-level localization and accessibility reviews.
8. Run clean/existing/upgrade migration execution against real database targets.
9. Capture staging performance baseline.

## Blocker 01 Resolution

BLOCKER 01 STATUS: RESOLVED.

| Evidence | Value |
| --- | --- |
| RC1 artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz` |
| Source commit | `c1b6958c0c8c92e3946addfcab48bc695962ca98` |
| SHA-256 | `41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285` |
| SBOM | `docs/releases/v1.0/rc1-sbom.json` |
| Build provenance | `docs/releases/v1.0/rc1-build-provenance.md` |
| Release validation | `node scripts/validate-rc1-release-evidence.mjs` |

## Blocker 02 Resolution

BLOCKER 02 STATUS: RESOLVED.

| Evidence | Value |
| --- | --- |
| Lockfile | `pnpm-lock.yaml` |
| Lockfile SHA-256 | `569b71350933f1f2e6028bbc6480b9b385dfe267929b136ca3bdc353f3d1b075` |
| Frozen install | PASS |
| Dependency audit | PASS |
| Critical | 0 |
| High | 0 |
| Moderate | 0 |
| Low | 0 |
| SBOM | `docs/releases/v1.0/rc1-sbom.json` updated with lockfile evidence |
| Previous artifact status | SUPERSEDED_FOR_CERTIFICATION |

## Blocker 03 Resolution

BLOCKER 03 STATUS: RESOLVED.

| Evidence | Value |
| --- | --- |
| New RC1 artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| SBOM | `docs/releases/v1.0/rc1-sbom.json` |
| Build provenance | `docs/releases/v1.0/rc1-build-provenance.md` |
| Staging deployment evidence | `docs/releases/v1.0/rc1-staging-deployment.md` |
| Artifact deployment mechanism | `deploy/staging/docker-compose.artifact.yml`, `infrastructure/deploy/deploy-staging-artifact.sh` |
| Artifact deployment validation | PASS: `bash infrastructure/validation/validate-artifact-deploy.sh` |
| Deployment status | LIVE_STAGING_DEPLOYMENT_SUCCESS |
| Deployed digest verification | PASS |
| Migration version | `0008_security_hardening_phase_1.sql` |
| Rollback reference | `infrastructure/docs/DEPLOYMENT_RUNBOOK.md`, `infrastructure/deploy/rollback-staging-artifact.sh` |

## Blocker 04 Resolution

BLOCKER 04 STATUS: RESOLVED.

| Evidence | Value |
| --- | --- |
| Expected deployment ID | `rc1-30b39ec-20260809` |
| Release | `1.0.0-rc.1` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| API image ID | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` |
| Web image ID | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` |
| Migration version | `0008_security_hardening_phase_1.sql` |
| Staging health evidence | `docs/releases/v1.0/rc1-staging-health.md` |
| Staging smoke evidence | `docs/releases/v1.0/rc1-staging-smoke.md` |
| Monitoring evidence | `docs/releases/v1.0/rc1-monitoring-validation.md` |
| Pipeline evidence | `docs/releases/v1.0/rc1-pipeline-validation.md` |
| Canonical deployment path | PASS: deprecated mixed-case deployment path references removed |
| Live command status | PASS: environment, health, bootstrap-admin-reviewer, smoke-test, monitoring-hook, validate-staging |

## Blocker 05 Attempt

BLOCKER 05 STATUS: NOT RESOLVED.

| Evidence | Value |
| --- | --- |
| Deployment ID | `rc1-30b39ec-20260809` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| Backup evidence | `docs/releases/v1.0/rc1-backup-results.md` |
| Restore evidence | `docs/releases/v1.0/rc1-restore-results.md` |
| Data integrity evidence | `docs/releases/v1.0/rc1-data-integrity-results.md` |
| Canonical backup scripts | `infrastructure/backup/backup-laborator.sh`, `infrastructure/backup/verify-backup.sh`, `infrastructure/backup/restore-dry-run.sh`, `infrastructure/backup/restore-laborator.sh` |
| Local backup dry-run | PASS_WITH_WARNING: Docker unavailable locally, live Docker volume access skipped |
| Local release identity verifier | PASS: matching identity accepted; mismatched artifact SHA-256 rejected |
| Live staging backup | NOT_EXECUTED_FROM_THIS_ENVIRONMENT |
| Isolated restore | NOT_EXECUTED_FROM_THIS_ENVIRONMENT |
| API/WEB after restore | NOT_VERIFIED_FROM_THIS_ENVIRONMENT |

## Pilot Decision

RC1 READY FOR PILOT: NO.

RC1 may be reconsidered only after all P0 blockers are closed and all P1
critical issues are either closed or formally accepted with documented owner
approval.
