# Analytics Events

## Purpose

Analytics events define the official event vocabulary for report generation,
dashboard updates, KPI calculations, dataset refreshes, exports, forecasts,
decision recommendations, and configuration changes.

Events must be typed, auditable, tenant-scoped, and traceable to canonical
source data.

## Official Events

### ReportGenerated

Emitted when a report output is generated.

Payload:

- `reportId`.
- `reportVersion`.
- `organizationId`.
- `generatedBy`.
- `format`.
- `filtersSnapshot`.
- `datasetVersionRefs`.
- `kpiVersionRefs`.
- `artifactRef`.
- `generatedAt`.

### DashboardUpdated

Emitted when a dashboard definition changes.

Payload:

- `dashboardId`.
- `organizationId`.
- `updatedBy`.
- `beforeVersion`.
- `afterVersion`.
- `changedWidgets`.
- `updatedAt`.

### KPICalculated

Emitted when a KPI value is calculated or recalculated.

Payload:

- `kpiId`.
- `kpiVersion`.
- `calculationId`.
- `organizationId`.
- `scope`.
- `value`.
- `thresholdState`.
- `datasetVersionRefs`.
- `calculatedAt`.

### DatasetRefreshed

Emitted when an analytics dataset refresh completes.

Payload:

- `datasetId`.
- `datasetVersion`.
- `organizationId`.
- `refreshId`.
- `status`.
- `recordCount`.
- `checksum`.
- `lineageSnapshot`.
- `completedAt`.

### AnalyticsExported

Emitted when an analytics report or dashboard is exported.

Payload:

- `exportId`.
- `organizationId`.
- `resourceType`.
- `resourceId`.
- `format`.
- `requestedBy`.
- `artifactRef`.
- `createdAt`.

### ForecastGenerated

Emitted when a forecast is generated.

Payload:

- `forecastId`.
- `organizationId`.
- `forecastType`.
- `inputDatasetRefs`.
- `method`.
- `confidenceScore`.
- `generatedBy`.
- `generatedAt`.

### DecisionRecommendationCreated

Emitted when an advisory recommendation is created.

Payload:

- `recommendationId`.
- `organizationId`.
- `scope`.
- `evidenceSources`.
- `confidenceScore`.
- `riskLevel`.
- `humanApprovalRequired`.
- `createdBy`.
- `createdAt`.

### AnalyticsConfigurationUpdated

Emitted when analytics configuration changes.

Payload:

- `configurationId`.
- `organizationId`.
- `configurationType`.
- `updatedBy`.
- `beforeState`.
- `afterState`.
- `updatedAt`.

## Event Rules

- Events must include organization scope.
- Events must preserve actor identity.
- Events must include source lineage where relevant.
- Events must not include secrets.
- Events must not include unauthorized source content.
- Events must be auditable.
- Events must be compatible with Observability tracing and audit correlation.

## Current Repository Baseline

No dedicated Analytics event runtime exists yet. Existing modules already emit
or store domain audit events and runtime records that will become Analytics
event sources during implementation.
