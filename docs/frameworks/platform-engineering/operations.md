# Operations

## Purpose

Operations standards define how Laborator Editura is deployed, monitored,
maintained, supported, scaled, and recovered.

## Operational Domains

Operations covers:

- Incidents.
- Problems.
- Changes.
- Maintenance.
- Capacity.
- Availability.
- SLA.
- SLO.
- Error budgets.
- Deployment operations.
- Backup operations.
- Restore operations.
- Certificate and secret rotation.
- Monitoring and alert review.

## Current Baseline

Current operational assets:

- `infrastructure/docs/DEPLOYMENT_RUNBOOK.md`.
- `infrastructure/docs/BACKUP_RESTORE_RUNBOOK.md`.
- `infrastructure/docs/DISASTER_RECOVERY_RUNBOOK.md`.
- `infrastructure/docs/DOMAIN_SSL_RUNBOOK.md`.
- `infrastructure/docs/MAINTENANCE_RUNBOOK.md`.
- `infrastructure/docs/MONITORING_RUNBOOK.md`.
- `infrastructure/docs/SECURITY_HARDENING_RUNBOOK.md`.
- `infrastructure/docs/TROUBLESHOOTING_RUNBOOK.md`.
- `infrastructure/monitoring/monitor-laborator.sh`.
- `infrastructure/validation`.
- `deploy/staging/scripts`.

## Incident Management

Incident records should preserve:

- Incident id.
- Environment.
- Severity.
- Impact.
- Start time.
- Detection source.
- Owner.
- Actions taken.
- Resolution.
- End time.
- Follow-up tasks.
- Audit reference.

## Change Management

Operational changes must preserve:

- Change request.
- Affected environment.
- Affected services.
- Risk.
- Planned time.
- Rollback path.
- Approval.
- Validation result.
- Audit reference.

## Capacity Management

Capacity management should track:

- CPU.
- Memory.
- Disk.
- Network.
- Database size.
- Backup size.
- Request volume.
- AI usage.
- Background job load.
- Error rates.

## SLO and Error Budgets

Production planning must define:

- Availability SLO.
- Latency SLO.
- Error rate SLO.
- Backup success SLO.
- Restore test frequency.
- Error budget policy.

Staging may track operational health without formal production SLOs.

## Monitoring

Monitoring must cover:

- API health.
- Web health.
- Container health.
- Disk usage.
- Backup status.
- Restore dry-run status.
- Nginx status.
- TLS expiration.
- Deployment status.
- Error logs.

## Current Gaps

- Formal production SLOs are not finalized.
- Incident registry runtime is not implemented.
- External alerting provider is not connected.
- Capacity reports are script/runbook based.
- Automated self-healing is limited to restart policies and operational
  scripts.

## Standardization Plan

1. Keep existing runbooks as operational baseline.
2. Define production incident severities.
3. Define production SLOs and error budgets.
4. Add centralized operational event records in a future phase.
5. Add alert routing after monitoring provider selection.
6. Add capacity reporting and review cadence.
