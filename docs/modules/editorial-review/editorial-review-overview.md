# Proofreading and Editorial Review Module Overview

## Purpose

The Proofreading and Editorial Review Module validates the linguistic,
terminological, stylistic, doctrinal, and editorial quality of a document
before approval, publication, or distribution.

No publication should enter Publishing without passing controlled editorial
review.

## Status

Phase II - Module 3.

Official implementation specification.

Version: 1.0.

## Scope

The module coordinates:

- Orthographic proofreading.
- Grammar and punctuation review.
- Diacritics validation.
- Agreement, inflection, and conjugation checks.
- Terminology consistency.
- Editorial style validation.
- Doctrinal review when a project requires it.
- Segment and document comments.
- Editorial observations.
- Correction proposals.
- Human review decisions.
- Editorial approval.
- Review history and audit.

## Current Repository Baseline

Current implementation already contains supporting foundations:

- `qa` backend module for automated validation issues and scores.
- `semantic-fidelity` backend module for meaning-drift and semantic-risk
  review.
- `terminology` backend module for validated terms, forbidden variants,
  Romanian diacritics governance, source priority, and audit.
- `editorial-decisions` backend module for recommendations, alternatives,
  evidence sources, approval state, and audit.
- `collaboration` backend module for internal threads, comments, reviewer
  notes, private editorial visibility, resolution, and audit.
- `workflow` backend module for document and segment workflow states and
  approval gates.
- Review workspace frontend at `/review`.
- Runtime database and backup/restore support for QA, semantic fidelity,
  terminology, editorial decisions, collaboration, and workflow tables.
- Contract tests for review workspace, parallel review interface, editorial
  decisions, collaboration, QA, terminology, semantic fidelity, and workflow.

The current baseline is a strong foundation, but it does not yet expose a
single canonical `EditorialReview` aggregate or the complete observation and
correction-proposal lifecycle required by this specification.

## Principles

- Editorial Quality First.
- Human Authority.
- AI Assisted Review.
- Non-Destructive Editing.
- Traceable Decisions.
- Terminology Consistency.
- Style Consistency.
- Full Auditability.
- Library First.
- Workflow Controlled.

## Canonical Editorial Review Flow

```text
Translated Document
  -> Automatic Validation
  -> Terminology Check
  -> Style Validation
  -> Editorial Review
  -> Corrections
  -> Approval
  -> Publishing
```

## Boundaries

The module must not duplicate:

- Translation content ownership.
- Workflow Engine state orchestration.
- Publishing release authority.
- Library source-of-truth responsibilities.
- Terminology or Glossary authority.
- QA or Semantic Fidelity engines.

It coordinates these services through public contracts and stores the review
decision trail.

## AI Rule

AI may propose corrections, explain issues, identify inconsistencies, suggest
reformulations, and signal editorial risk.

AI must not:

- Approve documents.
- Modify accepted text automatically.
- Override validated terminology.
- Replace human editorial judgment.
- Bypass Workflow.
- Publish or mark a document ready for publication.

## Acceptance Criteria

The module is compliant when:

- All review changes are tracked, versioned, and auditable.
- Linguistic and terminology checks are automatic and configurable.
- Review observations can be attached to documents or segments.
- Corrections are non-destructive until accepted by an authorized human.
- Final approval is granted only by an authorized user.
- AI assistance remains advisory.
- Approved documents are ready for downstream Publishing checks.
- Existing Phase 7 Step 16 publishing, preflight, and distribution behavior is
  preserved.
