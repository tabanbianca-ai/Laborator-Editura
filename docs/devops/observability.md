# Operational Observability

## Purpose

Operational observability monitors infrastructure, containers, deployments,
backups, application health, and service reliability.

## Required Signals

Operations must monitor:

- Uptime.
- CPU.
- Memory.
- Disk.
- Container health.
- API response times.
- Web response times.
- HTTP errors.
- Database status.
- Cache status when introduced.
- Queue status when introduced.
- AI failures.
- Workflow failures.
- Backup failures.
- Deployment failures.
- TLS and certificate status.

## Current Baseline

Current observability assets include:

- `GET /health` API health endpoint.
- Docker health checks for API and Web containers.
- `deploy/staging/scripts/health-check.mjs`.
- `deploy/staging/scripts/monitoring-hook.mjs`.
- `deploy/staging/scripts/staging-smoke-test.mjs`.
- `infrastructure/monitoring/monitor-laborator.sh`.
- `infrastructure/systemd/laborator-monitor.service`.
- `infrastructure/systemd/laborator-monitor.timer`.
- `infrastructure/docs/MONITORING_RUNBOOK.md`.
- Backend `observability` module metadata endpoints.
- Backend `platform-engineering` diagnostics metadata endpoints.

## Logging Requirements

Operational logs must include:

- UTC timestamp.
- Level.
- Service.
- Module or script.
- Correlation ID where applicable.
- Workspace ID where applicable.
- Result.
- Duration.

Infrastructure scripts already use UTC timestamped `INFO`, `WARNING`,
`ERROR`, and `SUCCESS` log levels.

## Alert Requirements

Alerts must be defined for:

- Service unhealthy.
- Backup failed.
- Restore dry-run failed.
- Disk usage threshold exceeded.
- High error rate.
- High latency.
- Deployment failed.
- Rollback executed.
- Secret validation failed.

## Current Gaps

- External metrics backend is not connected.
- Central log aggregation is not connected.
- Alert delivery channel is not finalized.
- Synthetic monitoring is not implemented beyond local scripts.

## Acceptance Criteria

- Operators can verify API, Web, Docker, backup, and restore state.
- Monitoring output is timestamped and safe.
- Critical failures produce alerts.
- Observability does not expose sensitive data.
