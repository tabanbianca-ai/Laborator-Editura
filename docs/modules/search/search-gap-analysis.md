# Search Gap Analysis

## Purpose

This document compares the current repository baseline with the official
Search, Indexing and Knowledge Graph Module specification.

## Summary

The repository already has useful local search capabilities in Library,
Research, Translation Memory, Terminology, Lexicographic Intelligence, Public
Portal, and Marketplace. Research also has the strongest graph-like baseline
through entities and relationships.

The target architecture requires a central indexing pipeline, common search
documents, versioned search indexes, event-driven reindexing, semantic
retrieval, vector search, autocomplete, global faceting, platform-wide
Knowledge Graph, centralized search permissions, and search audit.

## Gap Table

| Area | Current baseline | Required target | Risk |
| --- | --- | --- | --- |
| Search ownership | Distributed per module | Central Search module | High |
| Indexing | Runtime filtering | Event-driven indexing pipeline | High |
| Search documents | Not implemented | Derived searchable documents | High |
| Full-text search | Module-specific metadata search | Central full-text search | Medium |
| Fuzzy search | Library and TM local logic | Common fuzzy ranking | Medium |
| Semantic search | Semantic Fidelity and lexicographic evidence only | Semantic retrieval index | High |
| Vector search | Not implemented | Embedding store and vector query | High |
| Autocomplete | Not centralized | Language-aware autocomplete | Medium |
| Knowledge Graph | Research-local entities/relationships | Platform-wide graph | High |
| Permissions | Module-specific filtering | Unified IAM/Need-to-Know filtering | High |
| Events | Distributed audit only | Search/index/graph events | Medium |
| Reindexing | Not implemented | Incremental and full rebuild | High |
| Performance | Runtime filtering | Distributed scalable search | High |

## Current Strengths

- Library search already supports normalized, accent-insensitive, fuzzy
  metadata search and rich filters.
- Research search includes sources, notes, entities, relationships, and
  collections with visibility controls.
- Translation Memory supports exact, fuzzy, and context matches over approved
  entries.
- Terminology supports searchable term metadata and source priority.
- Lexicographic Intelligence supports dictionary search, search modes,
  authority ranking, and source consultation audit.
- Public Portal restricts public reads to approved catalog items.
- Runtime backup includes research entities and relationships.
- IAM server-derived context is already the platform access baseline.

## Indexing Assessment

Indexing is not yet centralized. Current searches directly read runtime
repositories and filter in service code. This is useful for closed beta, but
it cannot provide scalable global search, reindexing, embeddings, or graph
updates.

## Search Evaluation

Module-level search is functional for local workflows. It does not yet provide
one global search surface, common result ranking, shared query grammar,
central facets, autocomplete, or cross-module relevance.

## Semantic Retrieval Review

Semantic capabilities exist in analysis modules, but semantic retrieval is not
implemented. There is no embedding generation, semantic index, vector store,
hybrid ranker, or semantic query endpoint.

## Knowledge Graph Analysis

Research has graph-like entities and relationships. Other modules contain
relationship data, but there is no unified graph builder or traversal API.

## Performance Assessment

Runtime filtering is acceptable for current validation data. Production-scale
use with millions of documents will require dedicated indexing, incremental
updates, caching, pagination, and query optimization.

## Risk Evaluation

### Fragmentation Risk

Separate module searches can produce inconsistent results and duplicate
ranking rules.

### Permission Leakage Risk

Global search can leak metadata if IAM and Need-to-Know filters are not
centralized server-side.

### Scalability Risk

Runtime filtering will not scale to large corpora, media transcripts, and
multilingual publication archives.

### Semantic Accuracy Risk

Semantic search may imply equivalence where only similarity exists. Results
must remain explainable and advisory.

### Licensing Risk

Full content indexing and embeddings can violate copyright or license rules if
resource ingestion permissions are not enforced.

## Acceptance Gaps

The module is incomplete until:

- A central Search module exists.
- Search documents and indexes are modeled.
- Indexing is event-driven and incremental.
- Search results enforce IAM and Need-to-Know centrally.
- Semantic and vector search are implemented.
- Knowledge Graph is platform-wide.
- Reindexing and schema versioning are implemented.
- Search audit events are implemented.
- Performance testing covers large corpora.
