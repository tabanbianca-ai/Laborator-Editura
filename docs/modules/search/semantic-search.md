# Semantic Search

## Purpose

Semantic search finds meaning-related resources, passages, terms, and
translations even when exact wording differs.

## Required Capabilities

Semantic search must support:

- Relevant passage retrieval.
- Similar document discovery.
- Translation suggestion context.
- Duplicate detection.
- Similar terminology identification.
- Concept-aware discovery.
- Multilingual semantic retrieval.
- Hybrid text plus semantic ranking.

## Current Repository Baseline

Semantic capabilities exist as domain services, not as a central search
engine:

- Semantic Fidelity evaluates source/target meaning risk.
- Translation integrates semantic fidelity reports and lexicographic support.
- Editorial Decisions combine terminology, semantic fidelity, lexicographic
  evidence, and Translation Memory.
- Lexicographic Intelligence compares lexical senses and authority evidence.
- Research stores concepts, entities, relationships, and notes.

No central semantic retrieval index, embeddings pipeline, semantic ranker, or
semantic search endpoint exists.

## Semantic Result Model

Semantic results should include:

- `resourceType`.
- `resourceId`.
- `title`.
- `language`.
- `locale`.
- `matchedPassage`.
- `semanticScore`.
- `textualScore`.
- `hybridScore`.
- `explanation`.
- `evidenceSources`.
- `version`.
- `permissionsApplied`.

## AI and Human Final Authority

AI may:

- Generate embeddings.
- Suggest related resources.
- Explain why a result is relevant.
- Recommend terms, passages, or references.

AI may not:

- Override validated terminology.
- Approve editorial decisions.
- Publish results.
- Expand its own access.
- Treat semantic similarity as proof of equivalence.

## Rights and Licensing Rules

Semantic indexing must respect:

- Copyright metadata.
- Licensed ingestion rules.
- Redistribution restrictions.
- Private note visibility.
- Need-to-Know access.
- AI eligibility restrictions.

## Current Gaps

- No embedding generation runtime.
- No semantic index.
- No semantic search endpoint.
- No hybrid scoring model.
- No semantic search audit event.
- No provider-agnostic embedding abstraction.
