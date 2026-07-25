# Translation Workflows

## Purpose

This document defines the official workflow expectations for Translation.

## Target Flow

```text
Imported
  -> Translated
  -> Reviewed
  -> Corrected
  -> Approved
  -> Published
```

Each transition is governed by Workflow Engine configuration and Human Final
Authority.

## Current Workflow Baseline

Current Workflow Engine statuses:

- `DRAFT`.
- `IN_TRANSLATION`.
- `IN_QA`.
- `IN_SEMANTIC_REVIEW`.
- `IN_REVIEW`.
- `APPROVED`.
- `READY_FOR_EXPORT`.
- `EXPORTED`.
- `BLOCKED`.

Blocking rules include:

- Cannot move to review with unresolved High/Critical QA issues.
- Cannot approve with unresolved High/Critical Semantic Fidelity issues.
- Cannot move to ready for export unless approved.
- Cannot export unless ready for export.

## Translation Integration

Translation currently integrates with:

- Segments.
- Translation persistence.
- Translation Memory.
- Terminology.
- QA.
- Semantic Fidelity.
- Workflow through document/segment workflow states.

## Human Final Authority

AI may:

- Suggest translations.
- Explain issues.
- Suggest terminology.
- Suggest alternatives.
- Run validation support.

Only authorized humans may:

- Accept final translation.
- Approve review.
- Approve publication readiness.
- Publish.

## Current Gaps

- Translation-specific review/correction proposal states are not fully
  formalized in backend translation contracts.
- Segment-level workflow integration exists but top-level translation project
  workflow aggregate is not explicit.
- Translation comparison and restoration workflow requires additional
  specification before implementation.
