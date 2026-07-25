# Translation Module Overview

## Purpose

The Translation Module manages the complete editorial translation process for
Laborator Editura.

It enables professional translation of manuscripts and publications while
preserving semantic fidelity, terminology consistency, source preservation,
traceability, and human final authority.

Translation never modifies the original document. It creates new translated
versions linked to the original Library-managed resource.

## Status

Phase II - Module 2.

Official implementation specification.

Version: 1.0.

## Scope

The Translation Module owns or coordinates:

- Source document translation preparation.
- Text segmentation.
- Target translation persistence.
- Language metadata for source and target translation.
- Translation Memory lookup and proposal use.
- Glossary and terminology validation.
- Lexicographic evidence.
- AI-assisted translation through orchestration.
- Manual translation.
- QA and semantic fidelity checks.
- Version comparison and restoration planning.
- Translation audit.
- Translation export readiness.

## Current Repository Baseline

Current implementation already includes:

- `segments` backend module.
- `translations` backend module.
- `translation-memory` backend module.
- `terminology` backend module.
- `qa` backend module.
- `semantic-fidelity` backend module.
- `workflow` backend module.
- `lexicographic` backend module.
- Translation workspace frontend at `/translation`.
- Translation editor shell and right-panel support.
- Runtime database persistence and backup/restore tables for segments,
  translations, TM, terminology, QA, semantic fidelity, and workflow.
- Contract tests for Translation Memory, terminology, QA, semantic fidelity,
  workflow, lexicographic integration, and translation workspace UI.

## Principles

- Source Preservation.
- Translation Memory First.
- Terminology Consistency.
- Segment-Based Translation.
- Human-in-the-Loop.
- AI Assisted.
- Version Everything.
- Audit by Default.
- Library First.
- Human Final Authority.

## Canonical Translation Flow

```text
Original Library Item
  -> Segmentation
  -> Translation Memory Lookup
  -> Terminology Validation
  -> AI Translation Proposal
  -> Human Translation / Editing
  -> QA Validation
  -> Semantic Fidelity Validation
  -> Review Workflow
  -> Approved Translation
  -> Publication
```

## Library Dependency

Every translation must be linked to a Library Item or Library publication
record during migration.

Translations must not create duplicate editorial source repositories outside
Library.

## AI Rule

AI may suggest, explain, compare, validate, and generate alternatives.

AI must not:

- Modify the original source.
- Approve translations.
- Override validated terminology.
- Bypass Workflow.
- Bypass Human Final Authority.
- Write directly into Translation Memory as authoritative content.

## Acceptance Criteria

Translation Module is compliant when:

- Original documents remain immutable.
- Every translation is linked to Library.
- Every segment is persistent and versionable.
- Translation Memory is reusable and proposal-only.
- Validated terminology overrides Translation Memory and AI.
- AI uses complete context through orchestration.
- QA and Semantic Fidelity validations are connected.
- Workflow approval is human-controlled.
- All changes are audited.
- Translations can be compared, restored, and exported through controlled
  platform flows.
