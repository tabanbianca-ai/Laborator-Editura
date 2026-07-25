# KPI and SLA

## Purpose

This document defines the initial operational KPI, SLA, and SLO framework for
Laborator Editura.

## SLA Scope

Service Level Agreements may apply to:

- API.
- Web.
- Authentication.
- Workflow.
- Publishing.
- Public Portal.
- Backup.
- Restore validation.
- AI assistance.

## Initial SLO Categories

| Area | Initial Objective |
| --- | --- |
| API availability | Measured through `/health` and staging operations |
| Web availability | Measured through web health or root response |
| Backup success | Backup jobs complete and verify |
| Restore validation | Restore dry-run succeeds |
| Deployment success | Deployment completes and smoke tests pass |
| Workflow availability | Critical workflow operations remain available |
| AI availability | AI failures degrade safely without bypassing humans |

## Operational KPIs

Minimum KPIs:

- Availability.
- Mean response time.
- Mean time to restore.
- Mean time between incidents.
- Deployment success rate.
- Backup success rate.
- Restore dry-run success rate.
- Smoke test success rate.
- AI execution duration.
- Workflow duration.

## Current Baseline

Current measurement is script-based:

- `infrastructure/monitoring/monitor-laborator.sh`.
- `deploy/staging/scripts/health-check.mjs`.
- `deploy/staging/scripts/staging-smoke-test.mjs`.
- GitHub Actions workflow results.
- Backup and restore command results.

## Current Gaps

- Centralized metrics storage is not configured.
- Alert routing and notification policy are not implemented.
- Production SLA values are not finalized.
- Historical KPI dashboards are not connected.
