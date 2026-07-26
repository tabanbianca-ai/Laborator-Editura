# Data Governance API Contracts

## Purpose

This document defines the target API contract surface for the Data Governance,
Metadata and Master Data Management Module.

The current repository does not yet expose these endpoints as a dedicated Data
Governance module. These contracts are implementation targets for a future
additive phase.

## Contract Rules

- All endpoints require authenticated server-derived request context.
- Authorization is enforced through IAM, RBAC, Need-to-Know, data
  classification, and stewardship assignments.
- APIs are versioned.
- Mutations are auditable.
- AI suggestions cannot validate master data or approve Golden Records.

## Master Data

```http
GET /api/v1/master-data/{entityType}
POST /api/v1/master-data/{entityType}
GET /api/v1/master-data/{entityType}/{id}
PATCH /api/v1/master-data/{entityType}/{id}
```

## Metadata and Schema

```http
GET /api/v1/metadata-schemas
POST /api/v1/metadata-schemas
GET /api/v1/metadata-schemas/{id}
GET /api/v1/data-dictionary
GET /api/v1/schema-registry
```

## Data Catalog

```http
GET /api/v1/data-catalog
GET /api/v1/data-catalog/{id}
```

## Data Quality

```http
POST /api/v1/data-quality/validate
GET /api/v1/data-quality/results/{resourceType}/{resourceId}
```

## Data Lineage

```http
GET /api/v1/data-lineage/{resourceType}/{resourceId}
POST /api/v1/data-lineage
```

## Entity Resolution

```http
POST /api/v1/entity-resolution/candidates
GET /api/v1/entity-resolution/candidates
POST /api/v1/entity-resolution/{candidateId}/resolve
POST /api/v1/entity-resolution/{candidateId}/reject
```

## Reference Data

```http
GET /api/v1/reference-data/{dataset}
POST /api/v1/reference-data/{dataset}
```

## Retention and Classification

```http
GET /api/v1/data-classification
POST /api/v1/data-classification
GET /api/v1/data-retention
POST /api/v1/data-retention
```

## Current Related APIs

Existing related APIs are distributed across modules such as IAM,
Administration, Workspace, Projects, Documents, Translation, Rights,
Publishing, Library, Research, Search, Backup, Observability, Configuration,
and Integration.
