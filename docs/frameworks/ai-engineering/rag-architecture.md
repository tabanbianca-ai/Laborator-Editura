# RAG Architecture

## Purpose

Retrieval-Augmented Generation provides governed context to AI workflows from
approved knowledge bases while preserving rights, provenance, classification,
Need-to-Know access, and citation integrity.

## RAG Governance Rule

AI may retrieve context only from approved, classified, and scoped knowledge
sources.

RAG results are supporting evidence. They do not override validated
terminology, human-approved editorial decisions, rights restrictions, or Human
Final Authority.

## Governed Knowledge Bases

Knowledge bases include:

- Editorial Knowledge.
- Translation Memory.
- Terminology Database.
- Lexicographic Intelligence.
- Integrated Linguistic Knowledge Base.
- Style Guides.
- Research and Knowledge Hub.
- Technical Documentation.
- Legal Documentation.
- AI Policies.
- Codex Repository.
- JSON Master data where approved.

## RAG Flow

```text
AI Request
  -> Permission and Need-to-Know check
  -> Query planning
  -> Source selection
  -> Retrieval
  -> Ranking
  -> Context filtering
  -> Citation packaging
  -> Prompt assembly
  -> AI execution
  -> Output validation
  -> Audit and lineage
```

## Source Selection Rules

RAG source selection must consider:

- User role.
- Assigned task.
- Organization and tenant scope.
- Project scope.
- Document scope.
- Confidentiality classification.
- Rights and license permissions.
- Source authority.
- Language pair.
- Domain.
- Workflow stage.
- Prompt input contract.

## Citation Requirements

Retrieved context must preserve:

- Source id.
- Source type.
- Source title.
- Source version.
- Source language.
- Source publication year where relevant.
- Page, section, or segment reference where available.
- License status.
- Authority level.
- Retrieval timestamp.
- Ranking score.

## Retrieval Quality

RAG must evaluate:

- Relevance.
- Source authority.
- Citation completeness.
- Recency where relevant.
- Language match.
- Domain match.
- Rights compatibility.
- Redundancy.
- Conflict detection.

## Current Baseline Assessment

Strengths:

- Lexicographic evidence integrates with Translation, Terminology, and
  Semantic Fidelity.
- Translation Memory and Terminology foundations exist.
- Integrated Linguistic Knowledge Base rules exist.
- Research and Knowledge Hub exists as a backend foundation.
- Data Governance and Rights rules protect source authority and licensing.

Gaps:

- No central RAG Engine exists.
- No embeddings or vector index runtime is implemented.
- No retrieval ranking service is implemented.
- No unified citation packaging for AI prompts is implemented.
- No RAG evaluation dataset exists.

## RAG Safety Rules

- Copyrighted content must not be ingested without documented authorization.
- External controlled access sources must preserve metadata and links rather
  than unauthorized full content.
- Restricted sources must not be retrieved for unauthorized users or agents.
- AI must not fabricate citations.
- Source conflicts must be flagged for human review.

## Standardization Plan

1. Inventory approved knowledge bases.
2. Define RAG source metadata contract.
3. Define retrieval result schema.
4. Define citation packaging.
5. Define rights and license filters.
6. Define evaluation metrics.
7. Implement runtime RAG only in a future approved phase.
