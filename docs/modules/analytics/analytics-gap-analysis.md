# Analytics Gap Analysis

## 1. Executive Summary

Laborator Editura has multiple analytics-adjacent foundations, but it does not
yet have a centralized Analytics, Business Intelligence and Decision Support
runtime module.

Existing components provide operational metrics, workspace dashboard widgets,
static Reports Center UI, AI cost governance, QA scores, Semantic Fidelity
scores, workflow status, publishing readiness, distribution readiness, rights
warnings, and audit records. These are valuable source signals, but they are
not yet governed by one Analytics domain model, KPI catalog, dataset registry,
report engine, dashboard engine, forecast engine, or decision-support engine.

The main gap is centralization: reports, dashboards, KPI-like values, and
readiness summaries must be derived from canonical Data Governance sources and
managed through a single Analytics platform instead of remaining isolated
inside functional modules or static UI placeholders.

## 2. Current Reporting Capabilities

Current reporting-like capabilities include:

- Static frontend Reports Center for project quality, QA score, semantic
  fidelity, terminology compliance, workflow bottlenecks, audit summary, and
  closed beta health indicators.
- QA report and issue records.
- Semantic Fidelity report and issue records.
- Workflow state and transition audit.
- Publishing, Export, Distribution, and Preflight status panels.
- Rights and Provenance warning panels.
- Observability health, metrics, logs, traces, and agent executions.
- AI Governance usage, budgets, quotas, policies, provider status, and audit.
- Workspace dashboard widgets.

These capabilities are fragmented and not yet driven by a central Analytics
report engine.

## 3. Existing KPI Inventory

Existing KPI-like signals:

- Project quality.
- QA score.
- Semantic Fidelity score.
- Terminology compliance.
- Workflow status.
- Export readiness.
- Audit events today.
- Human approvals.
- Blocked actions.
- CI status.
- Backup dry-run status.
- Staging configuration status.
- Release state.
- API uptime.
- API request count.
- API error count.
- API latency.
- Runtime database status.
- Backup status.
- AI usage and estimated cost.
- Budget usage.
- Translation progress.
- Publishing status.

Gap: these are not versioned KPI definitions with formulas, owners,
thresholds, dataset lineage, and calculation audit.

## 4. Dashboard Assessment

Current dashboard surfaces:

- Workspace dashboard with role-filtered widgets.
- Frontend dashboard launch readiness panel.
- Static Reports Center dashboard-like panels.
- Observability APIs for operational dashboard data.
- Administration pages with status placeholders.

Strengths:

- Role-filtered workspace widgets already exist.
- Dashboard surfaces follow the unified workspace direction.
- Launch readiness and production status are visible.

Gaps:

- No Analytics dashboard engine.
- No dashboard dataset or query model.
- No dashboard versioning.
- No centralized dashboard export.
- No near real-time analytics refresh.
- Several frontend dashboard labels still represent static placeholder data.

## 5. Data Source Evaluation

Canonical source candidates:

- Data Governance and Master Data Management definitions.
- Runtime database tables owned by source modules.
- Module audit events.
- Observability metrics, logs, and traces.
- AI Governance usage and budget records.
- Workflow status and transitions.
- Publishing, Export, Preflight, Distribution, and Public Portal records.
- QA and Semantic Fidelity reports.
- Rights and Provenance records.
- Library, Translation, Author Studio, Research, Commerce, Collaboration, and
  Accessibility records.

Gaps:

- No Analytics dataset registry.
- No dataset refresh records.
- No dataset lineage runtime model.
- No source-to-KPI mapping.
- No cross-module aggregation contract.

## 6. Analytics Pipeline Review

Current pipeline foundations:

- Source modules persist records and audit events.
- Observability persists metrics and traces.
- Backup/restore includes many source tables.

Missing pipeline components:

- Analytics Collector.
- Event Aggregator.
- KPI Engine.
- Report Engine.
- Dashboard Engine.
- Forecast Engine.
- Data Warehouse Connector.
- Decision Support Engine.
- Dataset refresh scheduler.
- OLAP query model.

## 7. Performance Assessment

Current runtime persistence is adequate for foundation tests and module
contracts, but not a full analytics workload.

Risks:

- Cross-module ad hoc queries could become slow without a warehouse or
  materialized analytical views.
- Near real-time dashboards need incremental aggregation.
- Millions of events per day require partitioning, retention, and scalable
  collectors.
- Report exports need asynchronous execution for large datasets.

Future implementation should introduce dataset partitioning, cached KPI
snapshots, incremental refresh, query limits, and background report execution.

## 8. Security and IAM Review

Current strengths:

- Server-derived authenticated context is the security baseline.
- Workspace navigation and widgets are role-filtered.
- IAM, RBAC, Need-to-Know, and audit are established architecture principles.
- Observability and source modules are tenant-scoped.

Gaps:

- No analytics-specific permission model exists.
- No report/dashboard/dataset export permission matrix exists.
- No analytics-specific sensitive data masking rules exist.
- No audit model for analytics views and exports exists.

Required security rule: Analytics must not return hidden source records or
restricted metadata through aggregated reports, dashboards, or exports.

## 9. Integration Assessment

Required integrations:

- Library.
- Translation.
- Editorial Review.
- Publishing.
- Magazine.
- Workflow Engine.
- AI Orchestration.
- Search.
- Configuration.
- Data Governance.
- IAM.
- Observability.
- Backup.
- Notifications.
- Integration Gateway.
- Audio.
- Video.
- Rights and Provenance.
- Public Portal.
- Commerce.
- Workspace.

Current integration is indirect through source module data, audit events, and
frontend status summaries. A central Analytics service contract is not yet
implemented.

## 10. Identified Gaps

Critical design gaps:

- No central Analytics module runtime.
- No versioned KPI catalog.
- No Analytics dataset registry.
- No centralized report engine.
- No centralized dashboard engine.
- No data warehouse connector.
- No forecast or decision-support runtime model.

High-priority governance gaps:

- No analytics source lineage runtime.
- No analytics export audit.
- No analytics IAM model.
- No analytics privacy/masking policy.
- No report reproducibility mechanism.

Medium-priority UX and operations gaps:

- Reports Center uses static data.
- Dashboard widgets are not backed by Analytics KPIs.
- No scheduled reports.
- No dashboard refresh policy.
- No OLAP query model.

## 11. Prioritized Remediation Backlog

P0 - Architecture and contracts:

- Approve Analytics as the single analytics platform.
- Define dataset, KPI, report, dashboard, export, forecast, and recommendation
  contracts.
- Define IAM rules for analytics resources.

P1 - Dataset and KPI foundations:

- Add Analytics dataset registry.
- Add KPI catalog with versioning.
- Add KPI calculation audit.
- Map existing source signals to canonical KPI definitions.

P2 - Reports and dashboards:

- Add report definitions and generation workflow.
- Connect Reports Center to Analytics APIs.
- Add Analytics dashboard definitions and widgets.
- Add role-filtered dashboard queries.

P3 - Data warehouse and performance:

- Add warehouse connector abstraction.
- Add incremental refresh.
- Add cached KPI snapshots.
- Add large report background execution.

P4 - Decision support:

- Add forecasts.
- Add explainable recommendations.
- Add simulation metadata.
- Integrate Quality Agent and AI Governance evidence.

## 12. Migration Strategy

1. Preserve all existing module data, reports, dashboards, audit events, and
   frontend surfaces.
2. Introduce Analytics contracts without changing source module ownership.
3. Map current KPI-like signals into a versioned KPI inventory.
4. Introduce a dataset registry that references canonical Data Governance
   sources.
5. Add report and dashboard read models incrementally.
6. Connect existing Reports Center and Workspace widgets to Analytics only
   after contracts are stable.
7. Add report export and scheduling after report reproducibility is validated.
8. Add forecasting and decision support after KPI and dataset lineage are
   reliable.

No destructive migration, schema replacement, or removal of validated Phase 7
Step 16 functionality is authorized by this baseline audit.
