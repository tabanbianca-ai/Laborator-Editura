# Data Governance Domain Model

## Purpose

This document defines the canonical domain model for the Data Governance,
Metadata and Master Data Management Module.

## Aggregate Ownership

Data Governance owns canonical metadata, data definitions, quality policy,
lineage policy, reference data governance, stewardship assignments, and master
data reconciliation metadata.

It does not replace source module ownership. IAM remains authoritative for
identity and access. Rights remains authoritative for legal rights behavior.
Workflow remains authoritative for transitions. Publishing remains
authoritative for release gates.

| Entity | Owner | Purpose |
| --- | --- | --- |
| `MasterDataRecord` | Data Governance | Canonical representation of a shared entity. |
| `CanonicalIdentifier` | Data Governance | Stable platform identifier and external identifier mapping. |
| `MetadataSchema` | Data Governance | Versioned schema definition for metadata records. |
| `MetadataRecord` | Data Governance | Governed metadata values attached to resources. |
| `ReferenceDataSet` | Data Governance | Versioned controlled values and enumerations. |
| `DataCatalogEntry` | Data Governance | Searchable inventory record for a dataset or resource class. |
| `DataDictionaryTerm` | Data Governance | Official definition of a data field or business term. |
| `DataQualityRule` | Data Governance | Configurable quality validation rule. |
| `DataQualityResult` | Data Governance | Validation outcome for an entity or dataset. |
| `DataLineageRecord` | Data Governance | Trace from source entity/version to target entity/version. |
| `DataStewardshipAssignment` | Data Governance | Owner, steward, responsibilities, and approval scope. |
| `DuplicateCandidate` | Data Governance | Entity resolution candidate with evidence and status. |
| `GoldenRecord` | Data Governance | Approved canonical record for an entity. |
| `DataRetentionPolicy` | Data Governance | Retention, archive, deletion, anonymization, and legal hold metadata. |
| `DataGovernanceAuditEvent` | Data Governance | Immutable audit for governance actions. |

## MasterDataRecord

Required fields:

- `id`.
- `entityType`.
- `canonicalIdentifier`.
- `canonicalData`.
- `schemaId`.
- `schemaVersion`.
- `status`.
- `sourceSystem`.
- `ownerId`.
- `stewardId`.
- `createdAt`.
- `updatedAt`.
- `effectiveFrom`.
- `effectiveUntil`.
- `version`.
- `provenanceRecordId`.
- `qualityStatus`.
- `classification`.

## MetadataSchema

Required fields:

- `id`.
- `name`.
- `namespace`.
- `version`.
- `entityType`.
- `schemaDefinition`.
- `requiredFields`.
- `validationRules`.
- `compatibilityPolicy`.
- `status`.
- `publishedAt`.
- `deprecatedAt`.

## MetadataRecord

Required fields:

- `id`.
- `resourceType`.
- `resourceId`.
- `schemaId`.
- `schemaVersion`.
- `language`.
- `values`.
- `source`.
- `confidence`.
- `status`.
- `createdAt`.
- `updatedAt`.

## ReferenceDataSet

Required fields:

- `id`.
- `name`.
- `version`.
- `scope`.
- `values`.
- `effectiveFrom`.
- `effectiveUntil`.
- `status`.
- `ownerId`.

## DataQualityRule

Required fields:

- `id`.
- `name`.
- `description`.
- `entityType`.
- `fieldPath`.
- `ruleType`.
- `expression`.
- `severity`.
- `automaticResolution`.
- `status`.
- `version`.

Severities:

- `INFO`.
- `WARNING`.
- `ERROR`.
- `BLOCKING`.

## DataLineageRecord

Required fields:

- `id`.
- `sourceEntity`.
- `sourceVersion`.
- `targetEntity`.
- `targetVersion`.
- `transformationType`.
- `transformationId`.
- `workflowInstanceId`.
- `actorId`.
- `occurredAt`.

## DataStewardshipAssignment

Required fields:

- `id`.
- `dataDomain`.
- `ownerId`.
- `stewardId`.
- `responsibilities`.
- `approvalScope`.
- `effectiveFrom`.
- `effectiveUntil`.
- `status`.

## Lifecycle States

Recommended states:

- `DRAFT`.
- `UNDER_REVIEW`.
- `VALIDATED`.
- `ACTIVE`.
- `SUPERSEDED`.
- `ARCHIVED`.
- `SUSPENDED`.
- `DEPRECATED`.
- `REJECTED`.
- `DELETED_LOGICALLY`.
- `UNDER_LEGAL_HOLD`.

## Invariants

- Published schemas are not modified retroactively.
- Source records are never deleted during reconciliation.
- AI-extracted or AI-generated data is not automatically validated.
- Golden Record changes require provenance, quality validation, and
  authorized approval.
- Data classification informs IAM and Need-to-Know enforcement.
- Every important transformation records lineage.
