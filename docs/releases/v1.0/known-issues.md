# v1.0 Known Issues

Status: RC1_P0_CLEARED_CRITICAL_EVIDENCE_GAPS_REMAIN  
Owner: Release Management

## Known Issues

| issue_id | severity | affected_module | description | workaround | risk | target_release | owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| KI-V1-001 | P1 | Security | Live adversarial security evidence is still missing. | Run live staging adversarial suite or record formal acceptance. | Security certification incomplete. | 1.0.0-rc.1 | Security |
| KI-V1-002 | P1 | Accessibility | Browser-level accessibility review is still missing. | Execute accessibility review for critical workflows. | Accessibility certification incomplete. | 1.0.0-rc.1 | Web/QA |
| KI-V1-003 | P1 | Localization | Browser-level seven-language localization crawl is still missing. | Execute locale crawl and mixed-language scan. | Localization certification incomplete. | 1.0.0-rc.1 | Web/QA |
| KI-V1-004 | P1 | Performance | Staging performance baseline is still missing. | Capture API/web/workflow latency and VPS metrics. | Performance readiness incomplete. | 1.0.0-rc.1 | SRE |
| KI-V1-005 | P1 | Migration | Clean/existing PostgreSQL migration execution is still missing. | Run clean and representative existing database migration validation. | Migration certification incomplete. | 1.0.0-rc.1 | Data/Platform |

## Blocker 08 Update

Blocker 08 attempted to close all five P1 critical evidence gaps on 2026-08-12.
The gaps remain open because live VPS, browser-level, staging performance, and
isolated PostgreSQL evidence could not be produced from the local Codex
environment without fabricating PASS results.

## BLOCKING_ISSUES_PRESENT

This marker is retained for release-governance contract compatibility.
The currently listed blocking items remain P1 evidence gaps; no active P0 blocker is implied by this marker.

## Rule

Blocking known issues cannot ship in final v1.0. RC1 P0 release-engineering,
backup/restore, supply-chain, staging deployment, and rollback/redeploy
blockers are resolved by the RC1 evidence set.
