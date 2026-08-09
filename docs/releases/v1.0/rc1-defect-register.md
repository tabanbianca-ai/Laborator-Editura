# RC1 Defect Register

Status: OPEN_BLOCKERS  
Generated: 2026-08-09  
Candidate commit: `c1b6958c0c8c92e3946addfcab48bc695962ca98`

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
| RC1-P0-001 | P0 BLOCKER | Release Engineering | Confirmed resolved | Immutable RC1 artifact digest, artifact-bound SBOM, and build provenance now exist for the current RC1 candidate. | Artifact: `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz`; SHA-256: `41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285`; SBOM: `docs/releases/v1.0/rc1-sbom.json`; provenance: `docs/releases/v1.0/rc1-build-provenance.md`. | Keep artifact immutable and promote by digest only. | RESOLVED |
| RC1-P0-002 | P0 BLOCKER | Deployment | Missing evidence | Clean staging deployment was not validated during this RC1 run. | `pnpm staging:health` failed because API and web were not listening. `pnpm staging:validate` failed at environment validation. | Deploy the exact RC1 artifact to staging and rerun health, smoke, monitoring, and validation scripts. | OPEN |
| RC1-P0-003 | P0 BLOCKER | Restore | Missing evidence | Live isolated restore from an RC1 staging backup was not executed. | `pnpm staging:restore:dry-run` failed because `STAGING_BACKUP_FILE` was not provided. Infrastructure backup dry-run skipped Docker volume access because Docker is unavailable locally. | Generate a staging backup and execute restore dry-run into isolated volumes. | OPEN |
| RC1-P0-004 | P0 BLOCKER | Rollback | Missing evidence | Rollback and redeploy rehearsal was not executed for the candidate. | No rollback execution evidence was found in this RC1 run. | Execute rollback and redeploy rehearsal against staging with the exact candidate. | OPEN |
| RC1-P1-001 | P1 CRITICAL | Supply Chain | Confirmed failure | Dependency vulnerability audit cannot run without a lockfile. | `pnpm audit --audit-level high` failed with `ERR_PNPM_AUDIT_NO_LOCKFILE`. | Commit a root lockfile or approve and document a formal dependency audit exception with replacement evidence. | OPEN |
| RC1-P1-002 | P1 CRITICAL | Security | Missing evidence | Live cross-organization and adversarial authorization suite was not executed against staging. | Contract tests passed, but no live staging adversarial run was available. | Run staging security suite covering cross-org isolation, RBAC, privilege escalation, IDOR, sessions, and unauthorized AI/tool/document access. | OPEN |
| RC1-P1-003 | P1 CRITICAL | Accessibility | Missing evidence | Browser-level accessibility review is missing. | Web contract tests passed; no axe, keyboard, focus, screen-reader, or contrast run was executed. | Execute accessibility pass on critical workflows and record results. | OPEN |
| RC1-P1-004 | P1 CRITICAL | Localization | Missing evidence | Browser-level localization review for all seven platform languages is missing. | Shared and web localization tests passed; no full UI crawl confirmed no mixed-language screens. | Execute UI localization crawl for ro, en, es, fr, pt, it, and de. | OPEN |
| RC1-P1-005 | P1 CRITICAL | Performance | Missing evidence | Staging performance baseline is missing. | Local build and route-size evidence exists, but no live API/web latency or workflow baseline was captured. | Run staging performance baseline and record observed values. | OPEN |
| RC1-P1-006 | P1 CRITICAL | Migration | Missing evidence | Real clean/existing/upgrade database migration execution was not proven. | DB migration contract tests passed, but no live PostgreSQL clean and upgrade run was executed in this validation. | Run migrations on clean and representative existing databases, then validate upgrade path. | OPEN |
| RC1-P2-001 | P2 MAJOR | Runtime Configuration | Configuration risk | `apps/api/package.json` still has `start: node dist/main.js`, while Docker staging uses the correct explicit runtime command. | `deploy/staging/docker-compose.staging.yml` overrides the API command with `node apps/api/dist/apps/api/src/main.js`; package script remains inconsistent if used outside Docker. | Decide whether package `start` is unsupported outside Docker or align it in a scoped fix. | OPEN |
| RC1-P2-002 | P2 MAJOR | Operational Tooling | Missing local tooling | Infrastructure validation skipped Docker Compose, nginx, systemd, shellcheck, and yamllint checks locally. | `validate-infrastructure.sh` passed with warnings because local tools were unavailable. | Rerun the same validators on the VPS or CI runner with Docker, nginx, systemd-analyze, shellcheck, and yamllint installed. | OPEN |
| RC1-P3-001 | P3 MINOR | Frontend Tooling | Warning | Next production build warns that the Next.js ESLint plugin is not detected. | `pnpm --filter @laborator/web build` completed with the ESLint plugin warning. | Consider aligning ESLint configuration before final certification. | OPEN |

## Categorization

| Category | Items |
| --- | --- |
| Confirmed failures | `RC1-P1-001`, staging health/validate/restore command failures |
| Configuration issues | `RC1-P2-001`, staging environment not loaded locally |
| Missing coverage | `RC1-P1-002`, `RC1-P1-003`, `RC1-P1-004`, `RC1-P1-005`, `RC1-P1-006` |
| Missing evidence | `RC1-P0-002`, `RC1-P0-003`, `RC1-P0-004` |
| Incomplete/deferred | Browser E2E accessibility/localization/performance, live staging adversarial suite |

## Blocker Summary

RC1-P0-001 is resolved. RC1 still cannot proceed to pilot with the remaining
open P0 blockers.
