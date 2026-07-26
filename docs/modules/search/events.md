# Search Events

## Purpose

This document defines official events for the Search, Indexing and Knowledge
Graph Module.

Events coordinate indexing, reindexing, embeddings, autocomplete, search
auditing, graph construction, and relationship updates. They do not replace
source module events or audit records.

## Event Envelope

Each event should include:

- `eventId`.
- `eventName`.
- `eventVersion`.
- `organizationId`.
- `workspaceId` when available.
- `sourceModule`.
- `resourceType`.
- `resourceId`.
- `resourceVersion`.
- `correlationId`.
- `traceId`.
- `idempotencyKey`.
- `occurredAt`.
- `payload`.

## Official Events

Indexing events:

- `DocumentIndexRequested`.
- `DocumentIndexed`.
- `DocumentReindexed`.
- `DocumentRemovedFromIndex`.
- `IndexRebuildRequested`.
- `IndexRebuilt`.
- `IndexSchemaChanged`.
- `IndexingFailed`.

Semantic and vector events:

- `EmbeddingGenerationRequested`.
- `EmbeddingGenerated`.
- `EmbeddingGenerationFailed`.
- `SemanticSearchCompleted`.
- `VectorSearchCompleted`.
- `HybridSearchCompleted`.

Autocomplete events:

- `AutocompleteGenerated`.
- `AutocompleteRefreshed`.

Knowledge graph events:

- `KnowledgeEntityCreated`.
- `KnowledgeEntityUpdated`.
- `RelationshipCreated`.
- `RelationshipUpdated`.
- `RelationshipConflictDetected`.
- `KnowledgeGraphUpdated`.
- `KnowledgeGraphRebuilt`.

Search events:

- `SearchCompleted`.
- `AdministrativeSearchPerformed`.
- `SearchResultAccessDenied`.

## Current Repository Baseline

Current related audit/events are distributed:

- Lexicographic Intelligence audits search entry consultation and source
  consultation.
- Translation Memory audits reuse proposals.
- Research audits source, note, entity, relationship, and collection changes.
- Library audits publication and access events.
- Observability defines general event envelope and operational telemetry
  events.

No central Search event catalog is implemented yet.

## Event Rules

- Events must be versioned.
- Events must be tenant-scoped.
- Events must include source module and source resource references.
- Events must not contain secrets or unrestricted raw content.
- Index events must be idempotent.
- Rebuild events must be auditable.
- Search access-denied events must not leak hidden resource details.
- Notification delivery must route through Notification and Communication.
- Observability must collect indexing failures and latency.
