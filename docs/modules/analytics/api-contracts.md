# Analytics API Contracts

## Purpose

This document defines the target API contract surface for the Analytics,
Business Intelligence and Decision Support Module.

These contracts are documentation-only until an implementation phase is
explicitly scheduled.

## API Rules

- All analytics APIs are authenticated.
- All analytics APIs are versioned.
- IAM and Need-to-Know visibility apply server-side.
- Responses must include only data the actor may see.
- Sensitive analytics views and exports must be audited.
- Analytics APIs must use canonical datasets and KPI definitions.
- Public unauthenticated analytics APIs are not part of this module.

## Reports

### List Reports

`GET /analytics/reports`

Returns reports visible to the authenticated actor.

Query parameters:

- `reportType`.
- `status`.
- `ownerId`.
- `projectId`.
- `createdAfter`.
- `createdBefore`.

### Create Report

`POST /analytics/reports`

Creates a report definition.

Request fields:

- `title`.
- `description`.
- `reportType`.
- `schedule`.
- `filters`.
- `visualization`.
- `exportFormats`.
- `datasetRefs`.
- `kpiRefs`.
- `permissions`.

### Generate Report

`POST /analytics/reports/:id/generate`

Generates a report from a versioned definition.

## Dashboards

### List Dashboards

`GET /analytics/dashboards`

Returns dashboards visible to the authenticated actor.

### Create Dashboard

`POST /analytics/dashboards`

Creates a dashboard definition.

Request fields:

- `name`.
- `description`.
- `dashboardType`.
- `widgets`.
- `permissions`.
- `refreshPolicy`.
- `filters`.

### Get Dashboard

`GET /analytics/dashboards/:id`

Returns a role-filtered dashboard view.

## KPIs

### List KPIs

`GET /analytics/kpis`

Returns KPI definitions visible to the authenticated actor.

### Create KPI

`POST /analytics/kpis`

Creates a KPI definition.

Request fields:

- `name`.
- `description`.
- `formula`.
- `owner`.
- `refreshInterval`.
- `targetValue`.
- `thresholds`.
- `aggregationMethod`.
- `visualizationType`.
- `sourceDatasetRefs`.

### Calculate KPI

`POST /analytics/kpis/:id/calculate`

Calculates a KPI from its active version.

## Datasets

### List Datasets

`GET /analytics/datasets`

Returns dataset metadata visible to the authenticated actor.

### Refresh Dataset

`POST /analytics/datasets/:id/refresh`

Refreshes a dataset according to its lineage and source configuration.

## Decision Support

### Create Recommendation

`POST /analytics/decision-support/recommendations`

Creates an advisory recommendation from report, dashboard, KPI, or dataset
evidence.

### List Recommendations

`GET /analytics/decision-support/recommendations`

Returns recommendations visible to the authenticated actor.

## Exports

### Export Analytics

`POST /analytics/export`

Creates an analytics export.

Request fields:

- `resourceType`.
- `resourceId`.
- `format`.
- `filters`.
- `includeLineage`.

Supported formats:

- `PDF`.
- `XLSX`.
- `CSV`.
- `JSON`.

## Error Handling

Analytics APIs should return safe errors:

- `401` when authenticated context is missing.
- `403` when the actor lacks permission.
- `404` when a visible resource does not exist.
- `409` when a version or source conflict exists.
- `422` when KPI formulas, filters, or dataset references are invalid.

Errors must not expose secrets or restricted source content.

## Current Repository Baseline

No `/analytics/*` runtime API exists yet. Existing related APIs are provided by
Observability, Workspace, AI Governance, QA, Semantic Fidelity, Workflow,
Publishing, Export, Rights, and other source modules.
