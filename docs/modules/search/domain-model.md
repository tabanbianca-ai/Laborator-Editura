# Search Domain Model

## Purpose

This document defines the canonical domain model for the Search, Indexing and
Knowledge Graph Module.

## Aggregate Ownership

Search owns derived discovery and relationship metadata. It does not own the
canonical domain resources being indexed.

| Entity | Owner | Purpose |
| --- | --- | --- |
| `SearchDocument` | Search | Derived searchable representation of a source resource. |
| `SearchIndex` | Search | Index metadata, schema version, language, status, and count. |
| `IndexingJob` | Search | Asynchronous or scheduled indexing/reindexing operation. |
| `EmbeddingRecord` | Search | Vector metadata generated from permitted content. |
| `SearchQuery` | Search | Auditable administrative or user search request metadata. |
| `AutocompleteSuggestion` | Search | Derived suggestion based on text, frequency, language, and permissions. |
| `KnowledgeEntity` | Search | Graph node representing a person, work, concept, document, media, or resource. |
| `EntityRelationship` | Search | Graph edge between two knowledge entities. |
| `EntityProvenance` | Search | Evidence and source references for a node or relationship. |
| `SearchAuditEvent` | Search | Immutable audit record for indexing, search, graph, and schema actions. |

## SearchDocument

Required fields:

- `id`.
- `organizationId`.
- `resourceType`.
- `resourceId`.
- `language`.
- `locale`.
- `title`.
- `content`.
- `metadata`.
- `permissions`.
- `version`.
- `indexedAt`.
- `sourceUpdatedAt`.
- `visibility`.
- `workflowStatus`.
- `rightsStatus`.

Rules:

- `SearchDocument` is a derived read model.
- Restricted raw content must not be indexed unless permitted by IAM,
  copyright, license, and Need-to-Know policy.
- Permissions must be denormalized only as a search filter aid; IAM remains
  authoritative.
- Each indexed resource version must be traceable to its source.

## SearchIndex

Required fields:

- `id`.
- `organizationId`.
- `indexName`.
- `schemaVersion`.
- `language`.
- `status`.
- `documentCount`.
- `createdAt`.
- `updatedAt`.
- `lastRebuiltAt`.

Statuses:

- `DRAFT`.
- `BUILDING`.
- `READY`.
- `DEGRADED`.
- `FAILED`.
- `REBUILDING`.

## IndexingJob

Required fields:

- `id`.
- `organizationId`.
- `jobType`.
- `resourceType`.
- `resourceId`.
- `status`.
- `triggerEvent`.
- `startedAt`.
- `completedAt`.
- `errorSummary`.
- `correlationId`.

Job types:

- `INDEX`.
- `REINDEX`.
- `DELETE_FROM_INDEX`.
- `REBUILD_INDEX`.
- `GRAPH_UPDATE`.
- `EMBEDDING_GENERATION`.

## EmbeddingRecord

Required fields:

- `id`.
- `organizationId`.
- `searchDocumentId`.
- `resourceType`.
- `resourceId`.
- `language`.
- `modelProvider`.
- `modelName`.
- `vectorDimension`.
- `vectorRef`.
- `contentHash`.
- `createdAt`.

Rules:

- Embeddings are derived metadata.
- Sensitive content must not be embedded without explicit policy allowance.
- AI cost governance must record embedding generation when provider usage
  incurs cost.

## KnowledgeEntity

Knowledge entities may represent:

- Author.
- Translator.
- Editor.
- Work.
- Book.
- Magazine.
- Article.
- Chapter.
- Paragraph.
- Doctrinal term.
- Person.
- Organization.
- Event.
- Concept.
- Image.
- Audio file.
- Video file.
- Publication artifact.

Required fields:

- `id`.
- `organizationId`.
- `entityType`.
- `name`.
- `language`.
- `aliases`.
- `sourceResourceRefs`.
- `provenance`.
- `confidence`.
- `createdAt`.
- `updatedAt`.

## EntityRelationship

Required fields:

- `id`.
- `organizationId`.
- `sourceEntityId`.
- `targetEntityId`.
- `relationshipType`.
- `confidence`.
- `provenance`.
- `createdAt`.
- `updatedAt`.

Supported examples:

- `wrote`.
- `translated`.
- `reviewed`.
- `published`.
- `references`.
- `cites`.
- `derived_from`.
- `related_to`.
- `version_of`.
- `replaces`.
- `contains`.
- `translated_to`.

## Current Runtime Baseline

Research currently implements local graph-like records:

- `research_entities`.
- `research_relationships`.
- `research_collection_items`.

Library currently implements publication metadata and relationships between
publications, editions, versions, files, projects, manuscripts, and rights
metadata.

These records are source-module data. Future Search entities and
relationships must be derived or referenced from them rather than replacing
their ownership.

## Invariants

- Search data is derived, not authoritative editorial content.
- IAM and Need-to-Know rules are enforced server-side.
- Original resource version references must be preserved.
- Search indexes can be rebuilt from source modules.
- Relationship provenance is mandatory.
- AI-generated entity links require confidence metadata and human review when
  they affect editorial decisions.
