# Search Migration Plan

## Purpose

This document defines the incremental path from the current repository
baseline to the official Search, Indexing and Knowledge Graph Module.

Migration must be additive and must preserve validated Phase 7 Step 16
publishing, final preflight, distribution, Library, Rights, Workflow, IAM,
Observability, Backup, Notification, AI Orchestration, Research, Translation
Memory, Terminology, Lexicographic Intelligence, audit, and infrastructure
behavior.

## Constraints

- Do not create isolated search engines inside functional modules.
- Do not remove existing module search APIs until replacement contracts are
  approved and compatible.
- Do not expose restricted metadata through search.
- Do not index copyrighted or private content unless policy permits it.
- Do not let AI-generated similarity override validated terminology,
  editorial decisions, rights, workflow, or human approval.
- Do not make vector storage or external search providers the canonical source
  of editorial truth.
- Do not break current Library, Research, Translation Memory, Terminology,
  Lexicographic, Public Portal, or Marketplace search behavior.

## Phase 1 - Baseline Mapping

Status: current documentation phase.

Deliverables:

- Inventory search endpoints, local query logic, graph-like entities,
  relationships, filters, indexes, events, and performance risks.
- Document gaps and migration dependencies.

## Phase 2 - Canonical Search Contracts

Define canonical contracts:

- `SearchDocument`.
- `SearchIndex`.
- `IndexingJob`.
- `SearchQuery`.
- `SearchResult`.
- `AutocompleteSuggestion`.
- `EmbeddingRecord`.
- `KnowledgeEntity`.
- `EntityRelationship`.
- `SearchAuditEvent`.

No runtime migration occurs in this phase.

## Phase 3 - Central Search Module Foundation

Implement a minimal central Search module:

- Authenticated search API.
- Search document metadata.
- Search audit.
- Server-side IAM and Need-to-Know filtering.
- Derived index records.

Existing module search APIs remain compatible.

## Phase 4 - Index Event Contracts

Add event contracts for:

- Resource created.
- Resource updated.
- Translation approved.
- Publication approved.
- Rights changed.
- Workflow changed.
- Resource restored.
- Logical deletion.

Index event handlers must be idempotent.

## Phase 5 - Library and Research Indexing

Index:

- Library publications.
- Library items.
- Research sources.
- Research notes.
- Research entities.
- Research relationships.
- Collections.

Preserve existing module APIs.

## Phase 6 - Linguistic Indexing

Index:

- Translation Memory entries.
- Terminology terms.
- Lexicographic entries.
- Semantic Fidelity reports.
- Editorial decision evidence.

Validated terminology remains authoritative over search results and AI
suggestions.

## Phase 7 - Full-Text Search and Facets

Implement:

- Common query contract.
- Field weighting.
- Facets.
- Filtering.
- Sorting.
- Pagination.
- Highlight/snippet generation when permitted.

## Phase 8 - Autocomplete

Implement:

- Language-aware suggestions.
- Frequency/popularity ranking.
- Permission filtering.
- Context-aware suggestions.

## Phase 9 - Knowledge Graph Builder

Build graph nodes and edges from:

- Research.
- Library.
- Rights and Provenance.
- Translation alignment.
- Publication artifacts.
- Lexicographic and terminology evidence.
- Media relationships.

## Phase 10 - Semantic and Vector Search

After explicit provider and storage approval, implement:

- Embedding generation.
- Vector storage.
- Semantic query endpoint.
- Hybrid ranking.
- AI cost governance integration.
- Embedding retention and rebuild policy.

## Phase 11 - Reindexing and Schema Versioning

Add:

- Full index rebuild.
- Selective reindex.
- Schema version migration.
- Index health checks.
- Drift detection.
- Backfill jobs.

## Phase 12 - Scale and Performance

Add:

- Large corpus tests.
- Distributed indexing strategy.
- Cache strategy.
- Query latency targets.
- Backpressure handling.
- Parallel embedding generation.
- Observability dashboards.

## Testing Requirements

Each phase requires:

- Contract tests.
- Tenant isolation tests.
- Need-to-Know tests.
- Search permission tests.
- Indexing idempotency tests.
- Reindexing tests.
- Search ranking tests.
- Facet tests.
- Autocomplete tests.
- Knowledge Graph traversal tests.
- Semantic/vector tests when implemented.
- Audit tests.
- Backup/restore tests when persistence changes.
- Regression tests for Library, Research, Translation Memory, Terminology,
  Lexicographic Intelligence, IAM, Workflow, Publishing, Distribution,
  Backup, Observability, and Phase 7 Step 16 behavior.

## Next Recommended Module

Module 15 - Search, Indexing and Knowledge Graph Module Architecture is now
documented after Backup, Disaster Recovery and Business Continuity.

Module 16 - Integration, API Gateway and External Connectors Module
Architecture is now documented after Search, Indexing and Knowledge Graph.

Module 17 - Configuration, Feature Flags and Platform Administration Module
Architecture is now documented after Integration, API Gateway and External
Connectors.

The next recommended module specification after Configuration, Feature Flags
and Platform Administration is Module 18 - Data Governance, Metadata and Master
Data Management Module Architecture.
