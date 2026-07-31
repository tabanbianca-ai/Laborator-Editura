# RAG and Knowledge Base Standard

## Purpose

This document defines the canonical rules for Retrieval-Augmented Generation
collections, knowledge bases, source documents, chunking, embeddings,
metadata, access policy, refresh, retention, evaluation, and audit.

RAG results are supporting evidence. They do not override validated glossary
terms, approved source authority, workflow approvals, rights requirements, or
Human Final Authority.

## Required RAG Collection Fields

Every RAG collection must define:

- `uuid`.
- `collectionName`.
- `canonicalName`.
- `sourceDocuments`.
- `chunkingStrategy`.
- `embeddingModel`.
- `metadataSchema`.
- `accessPolicy`.
- `refreshPolicy`.
- `retentionPolicy`.
- `owner`.
- `classification`.
- `licenseStatus`.
- `sourceAuthority`.
- `evaluationMetrics`.
- `auditInformation`.

## Knowledge Base Fields

Every knowledge base must define:

- `uuid`.
- `canonicalName`.
- `displayName`.
- `domain`.
- `language`.
- `languagePair` when applicable.
- `sourceType`.
- `sourceReferences`.
- `licenseStatus`.
- `copyrightHolder`.
- `redistributionPermission`.
- `authorityLevel`.
- `enabledStatus`.
- `owner`.
- `accessPolicy`.
- `auditInformation`.

## Source Rules

RAG and knowledge base sources must preserve:

- Provenance.
- Citation data.
- License status.
- Copyright holder.
- Redistribution permission.
- Authority level.
- Last verification date.
- Source version or edition.

Copyrighted content must not be ingested unless documented authorization
permits internal ingestion. External controlled access records may store
metadata, official links, permitted excerpts, access restrictions, and license
notes.

## Chunking and Embeddings

Chunking strategy must define:

- Chunk size.
- Chunk overlap.
- Structural boundaries.
- Citation preservation.
- Language handling.
- Metadata fields.
- Rebuild trigger.

Embedding metadata must define:

- Embedding model.
- Embedding model version.
- Vector dimensions.
- Refresh policy.
- Compatibility with retrieval engine.
- Evaluation dataset where applicable.

## Access Policy

RAG access must respect:

- Tenant isolation.
- Need-to-Know.
- Role permissions.
- Project scope.
- Document scope.
- Data classification.
- Source license restrictions.
- Rights and provenance restrictions.

AI agents may not expand their own RAG access.

## Evaluation

RAG evaluation should include:

- Retrieval precision.
- Retrieval recall.
- Citation accuracy.
- Source authority fit.
- Hallucination reduction.
- Answer groundedness.
- Latency.
- Cost.
- Human review score.

## Audit

Audit must record:

- Collection created.
- Collection updated.
- Source added.
- Source removed.
- License changed.
- Chunking strategy changed.
- Embedding model changed.
- Collection refreshed.
- Source consulted.
- RAG result used.
- Access denied.
- Exception approved.

## Current Baseline

RAG governance is documented in `docs/frameworks/ai-engineering/rag-architecture.md`
and related AI Orchestration and Linguistic Knowledge Base documentation. A
runtime RAG engine, RAG indexing pipeline, embedding store, and RAG evaluation
dataset are not yet implemented.

