# Data Governance Events

## Purpose

Data Governance events publish versioned, auditable changes to master data,
schemas, metadata, quality state, lineage, classification, retention, and
entity resolution decisions.

## Official Events

Required official events:

- `MasterDataCreated`.
- `MasterDataUpdated`.
- `MasterDataValidated`.
- `MasterDataSuperseded`.
- `GoldenRecordCreated`.
- `GoldenRecordUpdated`.
- `MetadataSchemaPublished`.
- `MetadataSchemaDeprecated`.
- `ReferenceDataUpdated`.
- `DataQualityValidationCompleted`.
- `DataQualityRuleFailed`.
- `DuplicateCandidateDetected`.
- `DuplicateResolved`.
- `DataClassificationChanged`.
- `DataLineageRecorded`.
- `DataRetentionPolicyApplied`.
- `DataStewardshipAssigned`.

## Event Envelope

Each event should include:

- `eventId`.
- `eventName`.
- `eventVersion`.
- `schemaVersion`.
- `actorId`.
- `organizationId`.
- `resourceType`.
- `resourceId`.
- `resourceVersion`.
- `correlationId`.
- `occurredAt`.
- `classification`.
- `provenanceReference`.
- `metadata`.

## Rules

- Events are versioned.
- Events do not contain secret values.
- Restricted event metadata must not be exposed to unauthorized consumers.
- Events must be idempotent for consumers.
- External event delivery must go through Integration Gateway.
- Audit remains immutable.
