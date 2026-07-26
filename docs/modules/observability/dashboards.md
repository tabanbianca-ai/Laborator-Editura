# Observability Dashboards

## Purpose

Dashboards provide real-time and historical operational visibility for
administrators, DevOps users, security auditors, system auditors, and support
engineers.

Dashboard access is controlled through IAM and Need-to-Know rules.

## Standard Dashboards

The module must support standard dashboards for:

- Platform health.
- API performance.
- Database status.
- Backup and restore status.
- AI activity.
- Workflow activity.
- Notification delivery.
- Publishing and distribution.
- Resource usage.
- Security audit.
- Infrastructure health.

## Current Repository Baseline

Implemented foundations:

- Observability API returns health, metrics, logs, traces, and agent
  executions.
- Administration UI has platform support/security/backup status placeholders.
- Reports and launch readiness pages show operational status placeholders.
- Infrastructure documentation includes monitoring runbooks.

Current gaps:

- Custom dashboard definitions are not runtime modeled.
- Dashboard panels are not connected to a central query model.
- Alert state is not displayed through a centralized alert dashboard.
- Real-time updates are not implemented.

## Dashboard Model

Each dashboard should include:

- `dashboardId`.
- `organizationId`.
- `name`.
- `description`.
- `visibility`.
- `panels`.
- `filters`.
- `refreshInterval`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Each panel should include:

- `panelId`.
- `title`.
- `signalType`.
- `query`.
- `visualizationType`.
- `thresholds`.
- `order`.

## Access Rules

- Administrators may view full operational dashboards.
- Security auditors may view security and audit dashboards.
- Support engineers may view safe diagnostic dashboards.
- Editors and production users should see only relevant production status.
- Restricted logs and audit details require explicit permission.

## AI Rules

AI may:

- Summarize dashboard signals.
- Detect anomalies.
- Suggest panels.

AI may not:

- Hide dashboard data.
- Delete dashboard records.
- Suppress alerts automatically.
- Grant dashboard access.
