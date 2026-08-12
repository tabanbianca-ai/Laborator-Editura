# RC1 Final Readiness Gate

Status: VERIFIED_CONDITIONAL_GO
Generated: 2026-08-12
Scope: RC1 Blocker 07

## Decision

BLOCKER 07 STATUS: RESOLVED

RC1 READINESS DECISION: CONDITIONAL_GO

The RC1 release evidence is internally consistent after reconciling live
Blocker 05 and Blocker 06 results. RC1 has no open P0 blockers, but it is not a
full GO because five P1 critical evidence gaps remain open.

## Verified P0 Evidence

| Gate | Result |
| --- | --- |
| Blocker 01 immutable artifact, SHA-256, SBOM, provenance | PASS |
| Blocker 02 lockfile and supply-chain audit | PASS |
| Blocker 03 artifact-based staging deployment | PASS |
| Blocker 04 staging health, smoke, monitoring, pipeline validation | PASS |
| Blocker 05 live backup and isolated restore | PASS |
| Blocker 06 rollback and redeploy rehearsal | PASS |

## Release Identity

| Field | Value |
| --- | --- |
| Baseline release | `1.0.0-rc.1` |
| Baseline source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Baseline artifact | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| Baseline artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| Baseline API image ID | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` |
| Baseline WEB image ID | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` |
| Forward rehearsal release | `1.0.0-rc.1-rehearsal.1` |
| Forward rehearsal source commit | `add6e73221d70fbc07d0f724a8322d5aa3b503d9` |
| Forward rehearsal artifact SHA-256 | `05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4` |
| Forward rehearsal API image ID | `sha256:fb41892734fde36fe635add135eedafc24efefd93536a00c0ee20faad2cc0f7f` |
| Forward rehearsal WEB image ID | `sha256:c5cbbfcdad5247eb3dd29576f5a350d96274b670a4fca62bead502c6ea70ba17` |
| Migration version | `0008_security_hardening_phase_1.sql` |
| Backup artifact | `/opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz` |

## Live Rehearsal Evidence

| Check | Result |
| --- | --- |
| Forward deploy | PASS |
| Forward artifact digest | PASS |
| Runtime image IDs | PASS |
| Health | PASS |
| Real rollback | PASS |
| Rollback health | PASS |
| Rollback data integrity | PASS |
| Rollback smoke | PASS |
| Redeploy | PASS |
| Final data integrity | PASS |
| Final `validate-staging` | PASS |

Live sequence:

`30b39ec -> add6e73 -> 30b39ec -> add6e73`

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

## Remaining Critical Gates

| Gate | Status |
| --- | --- |
| Live adversarial security testing | OPEN |
| Browser accessibility review | OPEN |
| Browser localization crawl | OPEN |
| Staging performance baseline | OPEN |
| Clean/existing PostgreSQL migration execution | OPEN |

Critical open defects: 5

High open defects: 0

## Operator Context Warning

The live validation found an operational context issue with relative paths in
`.env.staging` when validation is run from a release directory. The correct
operator order is:

1. Source `.env.staging`.
2. Export absolute `STAGING_ENV_FILE`.
3. Export absolute `STAGING_COMPOSE_FILE`.

This is not classified as a runtime defect because the validated services,
health, smoke, monitoring hook, rollback, redeploy, and final data-integrity
checks passed.

## Final Gate

Blocker 07 is resolved as an evidence/readiness reconciliation gate.

RC1 remains CONDITIONAL_GO, not GO, until the five P1 critical evidence gaps
are closed or formally accepted by the project owner.
