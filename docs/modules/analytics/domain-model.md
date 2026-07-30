# Analytics Domain Model

## Purpose

This document defines the conceptual domain model for the Analytics, Business
Intelligence and Decision Support Module.

The model is technology-independent and describes the entities required for
centralized analytics, KPI management, reporting, dashboards, forecasting, and
decision support.

## Aggregate Ownership

Analytics owns:

- Analytics Report.
- Report Version.
- Dashboard.
- Dashboard Widget.
- KPI Definition.
- KPI Version.
- KPI Calculation.
- Analytics Dataset.
- Dataset Refresh.
- Analytics Query.
- Forecast.
- Decision Recommendation.
- Analytics Export.
- Analytics Audit Event.

Analytics does not own source domain records. It owns derived analytical
models, read models, calculations, explanations, exports, and their lineage.

## Analytics Report

Represents a reproducible report definition and generated output.

Fields:

- `reportId`.
- `organizationId`.
- `title`.
- `description`.
- `reportType`.
- `ownerId`.
- `schedule`.
- `filters`.
- `visualization`.
- `exportFormats`.
- `datasetRefs`.
- `kpiRefs`.
- `permissions`.
- `version`.
- `status`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Report types:

- `ON_DEMAND`.
- `SCHEDULED`.
- `COMPARATIVE`.
- `EXECUTIVE`.
- `OPERATIONAL`.
- `FINANCIAL`.
- `AI`.
- `AUDIT`.
- `COMPLIANCE`.

## Report Version

Represents an immutable version of a report definition.

Fields:

- `reportVersionId`.
- `reportId`.
- `version`.
- `definitionSnapshot`.
- `sourceDatasetVersions`.
- `createdBy`.
- `createdAt`.
- `changeReason`.

Reports must be reproducible from their versioned definition, filters, source
dataset versions, and KPI versions.

## Dashboard

Represents a saved analytics surface.

Fields:

- `dashboardId`.
- `organizationId`.
- `name`.
- `description`.
- `dashboardType`.
- `widgets`.
- `permissions`.
- `refreshPolicy`.
- `filters`.
- `ownerId`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Dashboard types:

- `EXECUTIVE`.
- `EDITORIAL`.
- `AI`.
- `WORKFLOW`.
- `PUBLISHING`.
- `INFRASTRUCTURE`.
- `CUSTOM`.

## Dashboard Widget

Represents one visualization inside a dashboard.

Fields:

- `widgetId`.
- `dashboardId`.
- `title`.
- `visualizationType`.
- `queryRef`.
- `kpiRef`.
- `datasetRef`.
- `dimensions`.
- `thresholds`.
- `order`.
- `refreshPolicy`.
- `permissions`.

Visualization types:

- `NUMBER`.
- `TABLE`.
- `LINE_CHART`.
- `BAR_CHART`.
- `PIE_CHART`.
- `FUNNEL`.
- `TIMELINE`.
- `STATUS`.
- `HEATMAP`.

## KPI Definition

Represents a managed metric definition.

Fields:

- `kpiId`.
- `organizationId`.
- `name`.
- `description`.
- `formula`.
- `ownerId`.
- `refreshInterval`.
- `targetValue`.
- `thresholds`.
- `aggregationMethod`.
- `visualizationType`.
- `status`.
- `version`.
- `sourceDatasetRefs`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Statuses:

- `DRAFT`.
- `ACTIVE`.
- `SUSPENDED`.
- `ARCHIVED`.

## KPI Calculation

Represents one calculated KPI result.

Fields:

- `calculationId`.
- `kpiId`.
- `kpiVersion`.
- `organizationId`.
- `scope`.
- `value`.
- `unit`.
- `status`.
- `thresholdState`.
- `inputDatasetVersions`.
- `calculatedAt`.
- `calculatedBy`.
- `explanation`.

## Analytics Dataset

Represents a governed analytical dataset derived from canonical sources.

Fields:

- `datasetId`.
- `organizationId`.
- `name`.
- `description`.
- `source`.
- `schema`.
- `refreshPolicy`.
- `retentionPolicyRef`.
- `lineage`.
- `classification`.
- `version`.
- `status`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Dataset sources must reference canonical Data Governance sources, not ad hoc
module-specific extracts.

## Dataset Refresh

Represents one dataset refresh operation.

Fields:

- `refreshId`.
- `datasetId`.
- `status`.
- `startedAt`.
- `completedAt`.
- `recordCount`.
- `checksum`.
- `lineageSnapshot`.
- `errors`.

## Analytics Query

Represents a saved analytical query or OLAP definition.

Fields:

- `queryId`.
- `organizationId`.
- `name`.
- `queryType`.
- `datasetRefs`.
- `dimensions`.
- `measures`.
- `filters`.
- `grouping`.
- `ordering`.
- `permissions`.
- `createdBy`.
- `createdAt`.

Query types:

- `AGGREGATION`.
- `OLAP`.
- `TREND`.
- `COMPARISON`.
- `FORECAST_INPUT`.

## Forecast

Represents a predictive analytics output.

Fields:

- `forecastId`.
- `organizationId`.
- `forecastType`.
- `inputDatasetRefs`.
- `method`.
- `result`.
- `confidenceScore`.
- `assumptions`.
- `limitations`.
- `generatedAt`.
- `generatedBy`.

Forecasts are advisory and must expose assumptions and limitations.

## Decision Recommendation

Represents a decision-support recommendation.

Fields:

- `recommendationId`.
- `organizationId`.
- `scope`.
- `recommendation`.
- `rationale`.
- `evidenceSources`.
- `confidenceScore`.
- `alternatives`.
- `riskLevel`.
- `humanApprovalRequired`.
- `createdBy`.
- `createdAt`.

Recommendations never mutate source records automatically.

## Analytics Export

Represents an exported analytics artifact.

Fields:

- `exportId`.
- `organizationId`.
- `reportId`.
- `dashboardId`.
- `format`.
- `filtersSnapshot`.
- `sourceVersionSnapshot`.
- `requestedBy`.
- `createdAt`.
- `artifactRef`.

Export formats:

- `PDF`.
- `XLSX`.
- `CSV`.
- `JSON`.

## Analytics Audit Event

Represents an immutable analytics governance event.

Fields:

- `auditEventId`.
- `organizationId`.
- `actorId`.
- `action`.
- `resourceType`.
- `resourceId`.
- `beforeState`.
- `afterState`.
- `sourceLineage`.
- `createdAt`.

## Security Rules

- IAM and Need-to-Know rules determine dashboard, report, dataset, KPI, and
  export visibility.
- Aggregated data must not reveal restricted source records.
- Restricted and personal data must be minimized, masked, or aggregated.
- Sensitive analytics access must be audited.
- Analytics must not bypass source module permissions.
