# RC1 Defect Register

Status: OPEN_BLOCKERS
Generated: 2026-08-11
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
| RC1-P0-003 | P0 BLOCKER | Restore | Missing live evidence | Live staging backup and isolated restore from the deployed RC1 staging candidate have not been executed from this Codex environment. | Canonical backup scripts were inspected and hardened to preserve and verify safe RC release identity metadata. Local fixture validation passed for matching identity and failed closed for an artifact SHA-256 mismatch. Live backup artifact, checksum, restore target, and post-restore health evidence are not recorded. | On the VPS, generate the staging backup, verify it with expected RC1 identity, execute isolated restore dry-run into separate volumes, validate restored data, and verify live API/WEB remain healthy and unchanged. | OPEN |
| RC1-P0-004 | P0 BLOCKER | Rollback | Missing evidence | Rollback and redeploy rehearsal was not executed for the candidate. | No rollback execution evidence was found in this RC1 run. | Execute rollback and redeploy rehearsal against staging with the exact candidate. | OPEN |
| RC1-P0-005 | P0 BLOCKER | Staging Validation | Confirmed resolved | Live staging health, smoke, monitoring, and validation pipeline passed for the deployed RC1 candidate. | Operator-provided live validation evidence: environment `PASS`, health `PASS`, bootstrap-admin-reviewer `PASS`, smoke-test `PASS`, monitoring-hook `PASS`, validate-staging `PASS`. Deployment ID: `rc1-30b39ec-20260809`. | Preserve the recorded staging health, smoke, monitoring, and validation evidence. | RESOLVED |
| RC1-P1-001 | P1 CRITICAL | Supply Chain | Confirmed resolved | Dependency lockfile and supply-chain audit evidence now exist. | `pnpm-lock.yaml` generated; frozen install passes; full and production audits report 0 Critical, 0 High, 0 Moderate, 0 Low; SBOM records lockfile SHA-256 `569b71350933f1f2e6028bbc6480b9b385dfe267929b136ca3bdc353f3d1b075`. | Preserve the lockfile and use frozen installs for CI, staging, and Docker builds. Produce a new final RC1 artifact from the remediated source state before pilot/certification. | RESOLVED |
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
| Confirmed failures | Restore validation remains unexecuted against the live staging backup |
| Configuration issues | `RC1-P2-001`, staging environment not loaded locally |
| Missing coverage | `RC1-P1-002`, `RC1-P1-003`, `RC1-P1-004`, `RC1-P1-005`, `RC1-P1-006` |
| Missing evidence | `RC1-P0-003`, `RC1-P0-004` |
| Incomplete/deferred | Browser E2E accessibility/localization/performance, live staging adversarial suite |

## Blocker Summary

RC1-P0-001, RC1-P0-002, RC1-P0-005, and RC1-P1-001 are resolved. RC1-P0-003
remains open because the deployed RC1 staging data has not yet been backed up,
verified, restored into isolated volumes, and validated without changing live
staging. RC1-P0-004 remains open pending rollback rehearsal. RC1 still cannot
proceed to pilot with the remaining open P0 blockers.
