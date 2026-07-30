# Analytics Dashboard Engine

## Purpose

The Dashboard Engine defines the centralized analytics dashboard model for
executive, editorial, AI, workflow, publishing, and infrastructure visibility.

Dashboards must be role-based, permission-aware, auditable, configurable, and
backed by canonical analytics datasets.

## Standard Dashboards

Executive:

- Global indicators.
- Active projects.
- Cost overview.
- Performance summary.
- Publication readiness.

Editorial:

- Translation progress.
- Review workload.
- Quality scores.
- Bottlenecks.
- Publication state.

AI:

- Token usage.
- Estimated and actual cost.
- Model usage.
- Provider fallback.
- Human acceptance rate.
- Error rate.

Workflow:

- SLA status.
- Delays.
- Approvals.
- Blocked tasks.
- Stage duration.

Publishing:

- Publication outputs.
- Distribution state.
- Export readiness.
- Rights blockers.
- Accessibility readiness.

Infrastructure:

- Availability.
- Resource status.
- Runtime database status.
- Backup status.
- API latency.

## Dashboard Model

Each dashboard must include:

- `dashboardId`.
- `organizationId`.
- `name`.
- `description`.
- `dashboardType`.
- `widgets`.
- `permissions`.
- `refreshPolicy`.
- `filters`.
- `owner`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Each widget must include:

- `widgetId`.
- `title`.
- `visualizationType`.
- `queryRef`.
- `datasetRef`.
- `kpiRef`.
- `dimensions`.
- `thresholds`.
- `order`.
- `refreshPolicy`.
- `permissions`.

## Current Repository Baseline

Current foundations:

- Workspace dashboards and widgets are persisted through
  `workspace_layouts`, `workspace_navigation_items`, `workspace_widgets`,
  `workspace_preferences`, and `workspace_audit_events`.
- The frontend dashboard renders role-filtered Workspace widgets and a launch
  readiness panel.
- Reports Center contains static quality and health dashboard-style panels.
- Observability has module health, metrics, logs, traces, and agent execution
  endpoints.

Current gaps:

- Workspace dashboards are navigation and workspace surfaces, not the final
  Analytics dashboard engine.
- No centralized dashboard query model exists.
- Widgets are not connected to Analytics datasets or KPI versions.
- No dashboard versioning exists.
- No dashboard export exists.
- No near real-time dashboard refresh pipeline exists.

## Dashboard Visibility

- Administrators may view dashboards allowed by their permissions.
- Executives may view organization-level summaries without restricted content.
- Project managers may view assigned project dashboards.
- Editors may view editorial production dashboards for assigned scopes.
- Auditors may view audit and compliance dashboards where authorized.
- Unauthorized users must not receive hidden dashboard data from APIs.

## Refresh Policies

Dashboards should support:

- Manual refresh.
- Scheduled refresh.
- Event-triggered refresh.
- Near real-time refresh where available.
- Cached historical snapshots.

Refresh metadata must include source versions and calculation timestamps.

## AI Rules

AI may:

- Suggest dashboards.
- Recommend widgets.
- Summarize dashboard changes.
- Detect anomalies.

AI may not:

- Expose hidden modules.
- Alter permissions.
- Hide indicators.
- Approve decisions.
