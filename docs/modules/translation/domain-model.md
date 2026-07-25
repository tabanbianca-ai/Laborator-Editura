# Translation Domain Model

## Purpose

This document defines the official domain model for the Translation Module.

## Aggregate Structure

```text
Translation Project
  -> Source Library Item
  -> Source Document
  -> Segment
       -> Segment Translation
       -> Translation Memory Evidence
       -> Terminology Evidence
       -> Lexicographic Evidence
       -> QA Report
       -> Semantic Fidelity Report
       -> Workflow State
       -> Audit Events
```

## Core Entities

### Segment

Canonical unit of translation work.

Current implementation:

- `Segment` in `apps/api/src/modules/segments/segments.types.ts`.
- Runtime table: `document_segments`.

Fields include:

- ID.
- Organization ID.
- Project ID.
- Document ID.
- Source text.
- Source language and locale.
- Target language and locale.
- Order.
- Status.
- Latest translation reference.
- Latest target text.
- Metadata.

### SegmentTranslation

Translated target text for a segment.

Current implementation:

- `SegmentTranslation` in `apps/api/src/modules/translations`.
- Runtime table: `segment_translations`.

Fields include:

- Source and target text.
- Source and target language metadata.
- Status.
- Translator attribution.
- Original author attribution.
- Translation Memory entry reference.
- QA report reference.
- Semantic report reference.
- Metadata containing terminology, TM, lexicographic, QA, and semantic
  support.

### TranslationMemoryEntry

Reusable translation evidence for future proposals.

Current implementation:

- `TranslationMemoryEntry` in `apps/api/src/modules/translation-memory`.
- Runtime table: `translation_memory_entries`.

### TerminologyTerm

Governed term and glossary record.

Current implementation:

- `TerminologyTerm` in `apps/api/src/modules/terminology`.
- Runtime table: `terminology_terms`.

### QaReport and SemanticFidelityReport

Validation records attached to segment or document translation checks.

Current implementation:

- Runtime tables: `qa_reports`, `qa_issues`,
  `semantic_fidelity_reports`, `semantic_fidelity_issues`.

### WorkflowState

Document-level or segment-level workflow state.

Current implementation:

- Runtime tables: `workflow_states`, `workflow_transitions`.

## Official Translation Statuses

Translation segment statuses:

- `DRAFT`.
- `SUBMITTED`.
- `VALIDATED`.
- `APPROVED`.

Segment workflow statuses:

- `NEW`.
- `IN_TRANSLATION`.
- `TRANSLATED`.
- `IN_REVIEW`.
- `APPROVED`.

Workflow module statuses:

- `DRAFT`.
- `IN_TRANSLATION`.
- `IN_QA`.
- `IN_SEMANTIC_REVIEW`.
- `IN_REVIEW`.
- `APPROVED`.
- `READY_FOR_EXPORT`.
- `EXPORTED`.
- `BLOCKED`.

## Domain Rules

- Original source text is immutable.
- Target translation is versioned independently.
- A segment may have multiple translation versions.
- The latest translation reference is a convenience pointer, not a historical
  replacement.
- Validated terminology has priority over Translation Memory and AI.
- Translation Memory is proposal-only and cannot overwrite target text.
- AI suggestions require human action before becoming translation state.
- Translation state changes must be auditable.

## Current Gaps

- A top-level `TranslationProject` aggregate is not yet explicit.
- Segment translation version history is represented through multiple
  translation records but not formalized as immutable version lineage.
- Library Item references are indirect through project/document today and need
  canonical Library linkage.
