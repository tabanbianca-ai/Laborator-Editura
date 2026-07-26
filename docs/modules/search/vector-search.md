# Vector Search

## Purpose

Vector search enables similarity retrieval over embeddings generated from
authorized text, metadata, and future media-derived captions or transcripts.

## Supported Uses

Vector search supports:

- Similar documents.
- Similar passages.
- Similar terminology.
- Similar translation segments.
- Similar research notes.
- Related concepts.
- Duplicate detection.
- Context retrieval for AI agents.

## Vector Data Model

Future vector metadata should include:

- `embeddingId`.
- `organizationId`.
- `searchDocumentId`.
- `resourceType`.
- `resourceId`.
- `language`.
- `locale`.
- `modelProvider`.
- `modelName`.
- `vectorDimension`.
- `vectorRef`.
- `contentHash`.
- `sourceVersion`.
- `createdAt`.
- `expiresAt` when policy requires refresh.

## Storage Strategy

The architecture must remain provider-extensible:

- PostgreSQL with vector extension when approved.
- Dedicated vector database when approved.
- External managed vector index when approved.

Provider choice must not become the canonical source of editorial truth.
Vectors are derived indexes and must be rebuildable.

## Current Repository Baseline

No vector database, embedding store, vector index, vector search endpoint, or
embedding generation job exists in the current implementation.

The current repository has related foundations:

- AI Governance for usage and cost tracking.
- AI Orchestration governance.
- Lexicographic evidence.
- Semantic Fidelity reports.
- Research entities and relationships.
- Runtime backup support for metadata tables.

## Security Rules

- Do not embed content unless the user, project, rights, license, and
  AI-eligibility policies allow it.
- Vector search results must be filtered through IAM and Need-to-Know.
- Embedding generation must be auditable when it uses AI providers.
- Embedding storage must not reveal raw restricted content through metadata.

## Current Gaps

- No vector provider has been selected.
- No embedding job contract exists.
- No vector query API exists.
- No vector retention policy exists.
- No vector backup/restore strategy exists.
