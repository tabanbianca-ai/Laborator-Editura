# Analytics KPI Management

## Purpose

KPI Management defines how Laborator Editura creates, versions, calculates,
reviews, and audits platform indicators.

KPIs must be explainable, reproducible, role-visible, and based on canonical
data sources.

## KPI Definition Requirements

Every KPI must define:

- `kpiId`.
- `name`.
- `description`.
- `formula`.
- `owner`.
- `refreshInterval`.
- `targetValue`.
- `thresholds`.
- `aggregationMethod`.
- `visualizationType`.
- `status`.
- `version`.
- `sourceDatasets`.
- `lineage`.

The formula must identify:

- Source datasets.
- Dimensions.
- Measures.
- Filters.
- Aggregation method.
- Null-handling rules.
- Time window.
- Tenant scope.
- Version references.

## KPI Lifecycle

Statuses:

- `DRAFT`.
- `ACTIVE`.
- `SUSPENDED`.
- `ARCHIVED`.

Lifecycle:

1. KPI drafted.
2. Formula reviewed.
3. Source lineage validated.
4. IAM visibility reviewed.
5. KPI activated by authorized human.
6. KPI calculated.
7. KPI versioned when changed.
8. KPI suspended or archived when obsolete.

Existing KPI versions must not be overwritten. New formula changes create new
versions.

## Standard KPI Families

Editorial:

- Average Translation Time.
- Average Editorial Review Time.
- Translation Quality Score.
- Terminology Compliance Rate.
- Semantic Fidelity Score.
- Book Production Time.
- Editorial Approval Cycle Time.

Workflow:

- Workflow Completion Rate.
- Blocked Workflow Count.
- SLA Compliance Rate.
- Average Time in Stage.
- Human Approval Throughput.

Publishing:

- Publishing Success Rate.
- Export Success Rate.
- Distribution Readiness Rate.
- Publication Backlog.
- Accessibility Compliance Rate.

AI:

- AI Cost per Project.
- AI Token Usage.
- AI Acceptance Rate.
- AI Human Intervention Rate.
- AI Provider Failure Rate.
- AI Latency.

Usage:

- Monthly Active Users.
- Active Organizations.
- Module Usage Rate.
- API Usage Rate.
- Connector Usage Rate.

Performance:

- Average API Response Time.
- Error Rate.
- Backup Success Rate.
- Runtime Database Availability.

## Current KPI Inventory

The repository has KPI-like indicators but no centralized KPI catalog:

- Reports Center static project quality, QA, semantic fidelity, and
  terminology compliance metrics.
- QA reports and semantic fidelity reports with per-document and per-segment
  scores.
- Observability metrics for uptime, request count, errors, latency, runtime
  database status, and backup status.
- AI Governance usage, budgets, quotas, provider status, and cost records.
- Workspace widgets for translation progress, AI usage, budget usage, backup
  status, publishing status, and observability summary.
- Publishing, workflow, rights, distribution, and preflight status records that
  can become canonical KPI inputs.

These are foundations, not a complete KPI management implementation.

## Calculation Rules

- Calculate KPIs from canonical Data Governance sources.
- Record input dataset versions for every calculation.
- Preserve formula version, thresholds, and filters.
- Recalculate by schedule, source event, or authorized on-demand action.
- Store explanation metadata for every calculation.
- Never infer confidential source details into unauthorized aggregates.

## Thresholds

Thresholds should support:

- `TARGET`.
- `WARNING`.
- `CRITICAL`.
- `BLOCKED`.

Thresholds must be configurable per KPI and versioned with the KPI definition.

## Audit Events

Audit:

- KPI created.
- KPI updated.
- KPI activated.
- KPI suspended.
- KPI archived.
- KPI calculated.
- KPI recalculated.
- KPI threshold changed.
- KPI source changed.
- KPI visibility changed.

## AI Rules

AI may:

- Suggest KPI definitions.
- Explain KPI movements.
- Detect anomalies.
- Recommend thresholds.

AI may not:

- Activate KPIs automatically.
- Hide poor performance.
- Modify source records.
- Change access permissions.
- Override human approval.
