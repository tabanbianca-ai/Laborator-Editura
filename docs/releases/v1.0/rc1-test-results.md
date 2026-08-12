# RC1 Test Results

Status: RC1_CONDITIONAL_GO
Generated: 2026-08-12
Candidate baseline commit: `30b39ec0034f335bdbda210f09c8ad66a26a25a2`
Forward rehearsal commit: `add6e73221d70fbc07d0f724a8322d5aa3b503d9`
Branch: `main`

## Candidate Identity

| Item | Result |
| --- | --- |
| Baseline release | `1.0.0-rc.1` |
| Baseline artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| Baseline artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| Baseline source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Forward rehearsal release | `1.0.0-rc.1-rehearsal.1` |
| Forward rehearsal artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-rehearsal.1-add6e73.tar.gz` |
| Forward rehearsal artifact SHA-256 | `05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4` |
| Forward rehearsal source commit | `add6e73221d70fbc07d0f724a8322d5aa3b503d9` |
| Root package | `laboratorul-editurii@0.1.0` |
| Package manager | `pnpm@10.12.1` |
| Workspace package versions | `@laborator/api@0.1.0`, `@laborator/web@0.1.0`, `@laborator/ai@0.1.0`, `@laborator/db@0.1.0`, `@laborator/shared@0.1.0` |
| Database migrations | `0000_mvp_foundation_v1.sql` through `0008_security_hardening_phase_1.sql` |
| SBOM tied to artifact digest | PASS |
| Build provenance | PASS |

## Automated Validation Results

| Command | Result | Evidence |
| --- | --- | --- |
| `git diff --check` | PASS | Whitespace check passed during Blocker 07 |
| `pnpm install --frozen-lockfile` | PASS | Frozen install passed with lockfile present |
| `pnpm typecheck` | PASS | 5 workspace packages succeeded |
| `pnpm lint` | PASS | 5 workspace packages succeeded |
| `pnpm test` | PASS | Shared 62, DB 49, Web 128, API 505 tests passed |
| `pnpm build` | PASS_WITH_WARNING | Workspace build passed; existing Next.js ESLint plugin warning remains |
| `pnpm audit --audit-level high` | PASS | 0 Critical/High findings |
| `node scripts/validate-rc1-release-evidence.mjs` | PASS | Release identity, SBOM, provenance, Blocker 05/06 evidence, and final readiness consistency validated |

## Live Staging Validation Results

| Gate | Result | Evidence |
| --- | --- | --- |
| Blocker 04 health/smoke/monitoring/pipeline | PASS | Operator-confirmed live `validate-staging` |
| Blocker 05 backup/isolated restore | PASS | `/opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz` |
| Blocker 06 rollback/redeploy rehearsal | PASS | Sequence `30b39ec -> add6e73 -> 30b39ec -> add6e73` |
| Runtime image identity | PASS | Baseline and forward image IDs recorded in RC1 evidence docs |
| Migration version | PASS | `0008_security_hardening_phase_1.sql` throughout rehearsal |

Final live validation:

```json
{
  "status": "ok",
  "action": "validate-staging",
  "results": [
    {"name": "environment", "status": "ok"},
    {"name": "health", "status": "ok"},
    {"name": "bootstrap-admin-reviewer", "status": "ok"},
    {"name": "smoke-test", "status": "ok"},
    {"name": "monitoring-hook", "status": "ok"}
  ]
}
```

## Historical Failures Preserved

The initial RC1 validation run identified missing artifact provenance, missing
lockfile, failed local staging checks, missing live restore, and missing
rollback rehearsal. Those defects were handled through Blockers 01-06. The
historical `c1b6958` artifact remains preserved as evidence only because it
lacks `pnpm-lock.yaml` and cannot be used as a reproducible rollback baseline.

## Remaining Open Critical Evidence

| Gate | Result |
| --- | --- |
| Live adversarial security testing | OPEN |
| Browser-level accessibility review | OPEN |
| Browser-level localization crawl | OPEN |
| Staging performance baseline | OPEN |
| Clean/existing PostgreSQL migration execution | OPEN |

## Final Result

RC1 is CONDITIONAL_GO for the next controlled validation stage. RC1 is not full
GO for production certification until the five P1 critical evidence gaps are
closed or formally accepted by the project owner.
