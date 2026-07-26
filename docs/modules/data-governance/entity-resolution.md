# Entity Resolution

## Purpose

Entity Resolution detects, evaluates, and resolves duplicate or related records
across modules while preserving source records, provenance, conflicts, and
history.

## Target Entities

Entity Resolution should support:

- People.
- Authors.
- Works.
- Editions.
- Publications.
- Organizations.
- Terms.
- Files.
- Bibliographic resources.

## Methods

Supported methods:

- Exact matching.
- Normalized matching.
- Fuzzy matching.
- Identifier matching.
- Semantic matching.
- Human review.

## Workflow

```text
Candidate Records
  -> Normalization
  -> Similarity Evaluation
  -> Match Candidate
     -> Automatic Merge
     -> Human Review
     -> Rejected Match
```

## Rules

- Source records are never deleted during reconciliation.
- Low-risk automatic merge requires pre-approved rules.
- Editorial, legal, identity, rights, and publication-impacting matches require
  human review.
- AI may suggest candidates but cannot approve merges.
- Rejected candidates remain auditable.

## Current Repository Baseline

The repository has fuzzy matching in Translation Memory and Terminology, and
lexicographic term-in-text matching. There is no platform-wide Entity
Resolution service yet.
