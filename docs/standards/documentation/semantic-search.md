# Semantic Search and AI Readiness Standard

## Purpose

This document defines the documentation requirements for semantic search, RAG
readiness, and AI agent use.

## Search Requirements

Documentation must be:

- Indexable.
- Classified.
- Tagged.
- Traceable.
- Version-aware.
- Permission-aware.
- Ready for semantic retrieval.
- Ready for AI agent consultation.

## Required Index Metadata

Every searchable documentation artifact should expose:

- Canonical identifier.
- Title.
- Document type.
- Owner.
- Status.
- Version.
- Source path.
- Related modules.
- Related standards.
- Related requirements.
- Related tests.
- Related ADRs.
- Tags.
- Summary.
- Access classification.
- Last indexed date when indexing exists.

## AI Readiness Rules

- AI agents may use documentation as evidence only when source, version, and
  status are preserved.
- AI agents must prefer active approved documents over draft, superseded, or
  archived documents.
- AI-generated answers must not invent documentation authority.
- AI-generated summaries must link back to source documents.
- Restricted documentation must not be exposed to AI agents outside their
  Need-to-Know context.

## Semantic Search Baseline

This standard prepares the documentation model for future semantic search and
RAG, but does not implement indexing, embeddings, vector storage, or runtime
search infrastructure by itself.

