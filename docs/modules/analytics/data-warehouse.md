# Analytics Data Warehouse and Pipeline

## Purpose

The Analytics Data Warehouse and Pipeline define how canonical platform data
is transformed into governed analytical datasets for KPI calculation, reports,
dashboards, forecasts, and decision support.

This document does not authorize a runtime warehouse implementation by itself.
It defines the required architecture for future implementation.

## Canonical Source Rule

Analytics data must come from canonical sources defined by Data Governance and
Master Data Management.

Analytics must not:

- Read undocumented private module internals.
- Create competing sources of truth.
- Duplicate source ownership.
- Use unapproved ad hoc extracts.
- Bypass source module IAM or Need-to-Know rules.

## Pipeline Architecture

```text
Canonical Source Events and Records
  -> Data Collector
  -> Validation and Classification
  -> Transformation
  -> Aggregation
  -> Dataset Versioning
  -> KPI Calculation
  -> Reports, Dashboards, Forecasts
```

## Dataset Registry

Each dataset must define:

- `datasetId`.
- `organizationId`.
- `name`.
- `description`.
- `source`.
- `schema`.
- `refreshPolicy`.
- `retention`.
- `lineage`.
- `classification`.
- `version`.
- `status`.

## Required Dataset Families

- Editorial production datasets.
- Translation and terminology datasets.
- QA and Semantic Fidelity datasets.
- Workflow and task datasets.
- Publishing, export, and distribution datasets.
- Rights and Provenance datasets.
- AI usage and cost datasets.
- Observability metrics datasets.
- User and usage datasets.
- Commerce and public portal datasets.
- Accessibility and localization datasets.

## Lineage

Every dataset refresh must record:

- Source module.
- Source table or API contract where applicable.
- Source version.
- Source record scope.
- Transformation version.
- Refresh time.
- Record count.
- Checksum.
- Error summary.

Lineage must support audit, reproducibility, and backup/restore validation.

## Refresh Policies

Supported policies:

- Manual refresh.
- Scheduled refresh.
- Event-triggered refresh.
- Incremental refresh.
- Near real-time refresh.

Near real-time does not mean bypassing validation, IAM, privacy, or audit.

## Performance Requirements

Future implementation should support:

- Incremental aggregation.
- Dashboard caching.
- Partitioned historical datasets.
- Query limits.
- Role-aware materialized views.
- Horizontal scaling for high-volume events.
- Millions of events per day.

## Privacy and Security

- Personal data must be minimized.
- Sensitive data must be masked or aggregated when possible.
- Tenant boundaries must be preserved.
- Restricted content must not leak through derived metrics.
- Dataset access must be logged for sensitive data.
- Retention must follow Backup, Data Governance, and compliance policies.

## Current Repository Baseline

Current foundations:

- Runtime database tables preserve source module records and audit events.
- Runtime backup/restore validates many module tables.
- Observability stores operational metrics and traces.
- Data Governance documentation defines canonical source rules.

Current gaps:

- No analytics dataset registry.
- No warehouse connector.
- No OLAP query definitions.
- No incremental analytics aggregation pipeline.
- No dataset refresh records.
- No dataset lineage runtime model.
