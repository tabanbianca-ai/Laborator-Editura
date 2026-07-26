# Search API Contracts

## Purpose

This document defines current and target API contracts for the Search,
Indexing and Knowledge Graph Module.

All protected APIs must enforce authenticated, server-derived request context.
Public APIs may expose only explicitly approved public resources.

## Current APIs

Distributed current search endpoints:

```http
POST /library/publications/search
GET  /research/search
GET  /translation-memory/search
GET  /translation-memory/proposals
GET  /terminology/terms
GET  /lexicographic/search
GET  /public/catalog
GET  /marketplace/catalog
```

Current graph-like endpoints:

```http
POST /research/entities
POST /research/relationships
GET  /research/search
```

## Target APIs From Official Specification

```http
GET  /search
POST /search/semantic
POST /search/vector
GET  /autocomplete
POST /index/rebuild
GET  /knowledge/entities/{id}
GET  /knowledge/relationships/{id}
```

## Recommended Versioned Module Contracts

```http
GET  /search/v1
POST /search/v1/query
POST /search/v1/semantic
POST /search/v1/vector
POST /search/v1/hybrid
GET  /search/v1/autocomplete

GET  /search/v1/indexes
GET  /search/v1/indexes/:id
POST /search/v1/indexes/rebuild
POST /search/v1/indexes/:id/reindex

GET  /search/v1/documents/:id
GET  /search/v1/jobs
GET  /search/v1/jobs/:id

GET  /search/v1/knowledge/entities/:id
GET  /search/v1/knowledge/entities/:id/relationships
GET  /search/v1/knowledge/relationships/:id
POST /search/v1/knowledge/relationships

GET  /search/v1/audit
```

## Query Response Requirements

Search responses must include:

- Result ID.
- Resource type.
- Resource ID.
- Title.
- Language and locale.
- Snippet when allowed.
- Score.
- Score explanation when available.
- Matched fields.
- Version.
- Permissions applied.
- Source module.

## API Rules

- Search APIs must not trust client-provided identity, organization ID, roles,
  or permissions.
- Results must be filtered server-side by IAM and Need-to-Know.
- Administrative searches must be audited.
- Public search must return only approved public resources.
- Index rebuild requires authorized roles.
- Schema changes require audit.
- AI-generated semantic or vector output must remain advisory unless
  validated by authorized humans where editorial decisions are affected.

## Current Contract Gaps

- No central `/search` module API exists.
- No semantic search endpoint exists.
- No vector search endpoint exists.
- No autocomplete endpoint exists.
- No central knowledge graph endpoint exists.
- No index rebuild endpoint exists.
- No central search audit endpoint exists.
