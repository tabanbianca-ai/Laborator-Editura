# RC1 Defect Register

Status: OPEN_CRITICALS_NO_P0_BLOCKERS
Generated: 2026-08-12
Candidate commit: `30b39ec0034f335bdbda210f09c8ad66a26a25a2`

## Severity Scale

| Severity | Meaning |
| --- | --- |
| P0 BLOCKER | Blocks RC1 pilot and certification. |
| P1 CRITICAL | Must be fixed or formally accepted before RC1 pilot. |
| P2 MAJOR | Important, but not necessarily pilot-blocking if risk is accepted. |
| P3 MINOR | Non-blocking cleanup or evidence improvement. |
| P4 TRIVIAL | Cosmetic or housekeeping item. |

## Confirmed Defects and Missing Evidence

| ID | Severity | Category | Type | Finding | Evidence | Required Action | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RC1-P0-001 | P0 BLOCKER | Release Engineering | Confirmed resolved | Immutable RC1 artifact digest, artifact-bound SBOM, and build provenance exist for the remediated RC1 candidate. | Artifact: `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz`; SHA-256: `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e`; SBOM: `docs/releases/v1.0/rc1-sbom.json`; provenance: `docs/releases/v1.0/rc1-build-provenance.md`; previous `c1b6958` artifact preserved as historical evidence. | Keep artifact immutable and promote by digest only. | RESOLVED |
| RC1-P0-002 | P0 BLOCKER | Deployment | Confirmed resolved | The remediated RC1 artifact was deployed to live staging through the artifact-based release path. | Deployment ID: `rc1-30b39ec-20260809`; source commit: `30b39ec0034f335bdbda210f09c8ad66a26a25a2`; artifact SHA-256: `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e`; API image ID: `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451`; WEB image ID: `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e`. | Preserve artifact-based deployment and do not rebuild RC release artifacts in staging. | RESOLVED |
| RC1-P0-003 | P0 BLOCKER | Restore | Confirmed resolved | Live staging backup and isolated restore from the deployed RC1 staging candidate passed. | Backup: `/opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz`; checksum, archive verification, release identity metadata, isolated restore, restored runtime DB, reviewer data, organization data, project data, and document data all operator-reported PASS. Temporary restore volumes were isolated and live staging remained healthy. | Preserve backup artifact and restore evidence. Do not delete the backup. | RESOLVED |
| RC1-P0-004 | P0 BLOCKER | Rollback | Confirmed resolved | The historical `c1b6958` artifact is preserved evidence, but it is not an executable RC rollback target because reproducible runtime image construction fails with `ERR_PNPM_NO_LOCKFILE`. Legacy `staging-api:latest` and `staging-web:latest` images are also rejected because they lack verifiable artifact SHA, source commit, release version, deployment ID, and provenance labels. | Live Blocker 06 rehearsal used verified baseline `30b39ec`, forward source `add6e73221d70fbc07d0f724a8322d5aa3b503d9`, forward artifact SHA-256 `05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4`, forward API image ID `sha256:fb41892734fde36fe635add135eedafc24efefd93536a00c0ee20faad2cc0f7f`, forward WEB image ID `sha256:c5cbbfcdad5247eb3dd29576f5a350d96274b670a4fca62bead502c6ea70ba17`, and migration `0008_security_hardening_phase_1.sql`. Sequence `30b39ec -> add6e73 -> 30b39ec -> add6e73` passed forward deploy, rollback, redeploy, health, smoke, data integrity, and final `validate-staging`. | Preserve historical failure evidence and use `30b39ec` as the verified executable rollback baseline. | RESOLVED |
| RC1-P0-005 | P0 BLOCKER | Staging Validation | Confirmed resolved | Live staging health, smoke, monitoring, and validation pipeline passed for the deployed RC1 candidate. | Operator-provided live validation evidence: environment `PASS`, health `PASS`, bootstrap-admin-reviewer `PASS`, smoke-test `PASS`, monitoring-hook `PASS`, validate-staging `PASS`. Deployment ID: `rc1-30b39ec-20260809`. | Preserve the recorded staging health, smoke, monitoring, and validation evidence. | RESOLVED |
| RC1-P1-001 | P1 CRITICAL | Supply Chain | Confirmed resolved | Dependency lockfile and supply-chain audit evidence now exist. | `pnpm-lock.yaml` generated; frozen install passes; full and production audits report 0 Critical, 0 High, 0 Moderate, 0 Low; SBOM records lockfile SHA-256 `569b71350933f1f2e6028bbc6480b9b385dfe267929b136ca3bdc353f3d1b075`. | Preserve the lockfile and use frozen installs for CI, staging, and Docker builds. Produce a new final RC1 artifact from the remediated source state before pilot/certification. | RESOLVED |
| RC1-P1-002 | P1 CRITICAL | Security | Live action required | Live cross-organization and adversarial authorization suite was not executed against staging. | Contract tests and staging smoke coverage exist; Blocker 08 local attempt found no live VPS execution context and no dedicated repository adversarial command. | Run staging security suite covering cross-org isolation, RBAC, privilege escalation, IDOR, sessions, malformed requests, secret exposure, and unauthorized AI/tool/document access. | OPEN |
| RC1-P1-003 | P1 CRITICAL | Accessibility | Live action required | Browser-level accessibility review is missing. | Web contract tests passed; Blocker 08 local attempt found no repository Playwright, axe, Lighthouse, or browser accessibility runner. | Execute browser accessibility pass on critical workflows and record keyboard, focus, labels, names, contrast, ARIA, landmarks, no traps, and mobile findings. | OPEN |
| RC1-P1-004 | P1 CRITICAL | Localization | Live action required | Browser-level localization review for all repository-defined platform locales is missing. | Shared and web localization tests passed; Blocker 08 identified seven language families and nine installed locales but did not execute a browser crawl. | Execute UI localization crawl for `ro-RO`, `en-US`, `en-GB`, `es-ES`, `fr-FR`, `pt-PT`, `pt-BR`, `it-IT`, and `de-DE`. | OPEN |
| RC1-P1-005 | P1 CRITICAL | Performance | Live action required | Staging performance baseline is missing. | Local build and route-size evidence exists; Blocker 08 local attempt found no live VPS metrics or repository load-test runner. | Capture non-destructive staging latency/resource baseline and record p50/p95/p99 where available. | OPEN |
| RC1-P1-006 | P1 CRITICAL | Migration | Live action required | Real clean/existing/upgrade PostgreSQL migration execution was not proven. | DB migration contract tests passed; Blocker 08 local attempt found no local `psql` or Docker, so real PostgreSQL execution still requires an isolated database target. | Run migrations on clean and representative existing PostgreSQL databases, validate schema, repeatability, application startup, and data preservation. | OPEN |
| RC1-P2-001 | P2 MAJOR | Runtime Configuration | Configuration risk | `apps/api/package.json` still has `start: node dist/main.js`, while Docker staging uses the correct explicit runtime command. | `deploy/staging/docker-compose.staging.yml` overrides the API command with `node apps/api/dist/apps/api/src/main.js`; package script remains inconsistent if used outside Docker. | Decide whether package `start` is unsupported outside Docker or align it in a scoped fix. | OPEN |
| RC1-P2-002 | P2 MAJOR | Operational Tooling | Missing local tooling | Infrastructure validation skipped Docker Compose, nginx, systemd, shellcheck, and yamllint checks locally. | `validate-infrastructure.sh` passed with warnings because local tools were unavailable. | Rerun the same validators on the VPS or CI runner with Docker, nginx, systemd-analyze, shellcheck, and yamllint installed. | OPEN |
| RC1-P3-001 | P3 MINOR | Frontend Tooling | Warning | Next production build warns that the Next.js ESLint plugin is not detected. | `pnpm --filter @laborator/web build` completed with the ESLint plugin warning. | Consider aligning ESLint configuration before final certification. | OPEN |

## Categorization

| Category | Items |
| --- | --- |
| Confirmed failures | None at P0 after Blocker 06 live rehearsal; historical `c1b6958` target remains rejected by design |
| Configuration issues | `RC1-P2-001`, staging environment not loaded locally |
| Missing coverage | `RC1-P1-002`, `RC1-P1-003`, `RC1-P1-004`, `RC1-P1-005`, `RC1-P1-006` |
| Missing evidence | `RC1-P1-002`, `RC1-P1-003`, `RC1-P1-004`, `RC1-P1-005`, `RC1-P1-006` |
| Incomplete/deferred | Browser E2E accessibility/localization/performance, live staging adversarial suite |

## Blocker Summary

RC1-P0-001, RC1-P0-002, RC1-P0-003, RC1-P0-004, RC1-P0-005, and RC1-P1-001 are
resolved. There are 0 open P0 blockers. RC1 still has 5 open P1 critical
evidence gaps: live adversarial security, browser accessibility, browser
localization, staging performance baseline, and clean/existing PostgreSQL
migration execution.

## Blocker 08 Attempt

BLOCKER 08 STATUS: NOT RESOLVED.

The five remaining P1 critical items were reviewed on 2026-08-12. No false PASS
was recorded because the local Codex environment does not provide live VPS
access, a repository-supported browser accessibility/localization runner,
Docker, or `psql`. RC1 therefore remains CONDITIONAL_GO.
