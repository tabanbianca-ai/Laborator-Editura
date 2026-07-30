# Analytics Report Engine

## Purpose

The Report Engine defines how analytics reports are created, versioned,
generated, scheduled, exported, and audited.

Reports must be reproducible from versioned report definitions, filters, KPI
versions, dataset versions, and source lineage.

## Supported Report Types

- `ON_DEMAND`.
- `SCHEDULED`.
- `COMPARATIVE`.
- `EXECUTIVE`.
- `OPERATIONAL`.
- `FINANCIAL`.
- `AI`.
- `AUDIT`.
- `COMPLIANCE`.

## Report Definition

Each report definition must include:

- `reportId`.
- `title`.
- `description`.
- `reportType`.
- `owner`.
- `schedule`.
- `filters`.
- `visualization`.
- `exportFormats`.
- `datasetRefs`.
- `kpiRefs`.
- `permissions`.
- `version`.
- `status`.

## Report Generation Workflow

```text
Report Request
  -> Permission Check
  -> Version Resolution
  -> Dataset Resolution
  -> KPI Calculation or Lookup
  -> Query Execution
  -> Visualization Rendering
  -> Export Generation
  -> Audit Event
```

## Reproducibility Rules

- The report definition version must be stored.
- All filters must be stored.
- Dataset versions must be stored.
- KPI versions must be stored.
- Export format and renderer version must be stored.
- Generated output must reference the exact source lineage.

## Export Formats

Reports should support:

- `PDF`.
- `XLSX`.
- `CSV`.
- `JSON`.

Exports must be permission-checked and auditable.

## Scheduling

Scheduled reports must include:

- Schedule expression.
- Time zone.
- Recipients or delivery target.
- Permission scope.
- Export formats.
- Last run status.
- Next run time.

Notification delivery is delegated to Notification and Communication. Report
generation status remains owned by Analytics.

## Current Repository Baseline

Current foundations:

- Static Reports Center UI exists for project quality and launch health.
- QA and Semantic Fidelity generate report records within their own modules.
- Observability exposes metrics and logs for operational diagnostics.
- Runtime backup/restore can preserve existing module report records.

Current gaps:

- No centralized report definition model.
- No report scheduler.
- No report export artifact model for analytics.
- No versioned report snapshots.
- No analytics report API.
- No centralized report permission model beyond source modules.

## Access Rules

- Reports inherit source data restrictions.
- Need-to-Know access applies before data aggregation and again before export.
- Restricted source records must not be leaked through summarized reports.
- Sensitive reports require audit on view and export.

## AI Rules

AI may:

- Suggest report layouts.
- Summarize report findings.
- Explain trends.
- Suggest filters.

AI may not:

- Generate unauthorized reports.
- Remove report evidence.
- Hide negative findings.
- Modify source module data.
