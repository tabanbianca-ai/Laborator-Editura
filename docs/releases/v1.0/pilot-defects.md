# Pilot Defects

Status: RC1_P0_CLEARED_CRITICAL_EVIDENCE_GAPS_REMAIN  
Owner: Release Management

## Defect Model

Every defect must record:

- defect_id;
- module;
- severity;
- description;
- steps_to_reproduce;
- expected_result;
- actual_result;
- affected_version;
- owner;
- status;
- fix_version;
- evidence.

## Open Defects

| defect_id | module | severity | description | affected_version | owner | status | fix_version | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEF-V1-001 | Security | P1 CRITICAL | Live adversarial staging security suite has not been executed or formally accepted. | 1.0.0-rc.1 | Security | OPEN | 1.0.0-rc.1 | `docs/releases/v1.0/rc1-security-results.md` |
| DEF-V1-002 | Accessibility | P1 CRITICAL | Browser-level accessibility review has not been executed. | 1.0.0-rc.1 | Web/QA | OPEN | 1.0.0-rc.1 | `docs/releases/v1.0/rc1-accessibility-results.md` |
| DEF-V1-003 | Localization | P1 CRITICAL | Seven-language browser localization crawl and mixed-language scan have not been executed. | 1.0.0-rc.1 | Web/QA | OPEN | 1.0.0-rc.1 | `docs/releases/v1.0/rc1-localization-results.md` |
| DEF-V1-004 | Performance | P1 CRITICAL | Staging performance baseline has not been captured. | 1.0.0-rc.1 | SRE | OPEN | 1.0.0-rc.1 | `docs/releases/v1.0/rc1-performance-baseline.md` |
| DEF-V1-005 | Migration | P1 CRITICAL | Clean and representative existing PostgreSQL migration execution has not been proven. | 1.0.0-rc.1 | Data/Platform | OPEN | 1.0.0-rc.1 | `docs/releases/v1.0/rc1-migration-results.md` |

## Blocker 08 Update

Blocker 08 reviewed the five open P1 critical defects on 2026-08-12. No defect
was closed because the required live VPS, browser-level, staging performance,
and isolated PostgreSQL evidence was not available in the local Codex
environment.

## Remediation Rule

Defect -> Root Cause -> Minimal Fix -> Automated Test -> Regression -> Review.

No defect may be used as justification for broad refactoring before v1.0.

## P0 BLOCKER

This section is retained as the canonical marker for P0 blocker governance.
Current certification state remains `OPEN P0 = 0`; no active P0 blocker is being reported here.

## Zero P0 Rule

Final certification requires `OPEN P0 = 0` and all P1 critical defects either
closed or formally accepted by the project owner.
