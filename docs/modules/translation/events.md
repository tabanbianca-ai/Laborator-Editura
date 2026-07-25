# Translation Events

## Purpose

This document defines the official Translation Module event model.

## Required Events

Official events:

- `TranslationCreated`.
- `SegmentTranslated`.
- `SegmentUpdated`.
- `TranslationReviewed`.
- `TranslationApproved`.
- `GlossaryUpdated`.
- `TranslationPublished`.

## Current Audit/Event Baseline

Current modules record audit actions:

- Segment create/update.
- Translation create/update/delete/approve/export action types.
- Translation Memory create/update/approve/reuse/confidence recalculation.
- Terminology create/update/evaluate/under-review/validate/reject/suspend/
  archive/source-priority/confidence actions.
- QA run, issue created, issue resolved, score recalculated.
- Semantic check, issue created, issue resolved, score recalculated.
- Workflow started, advanced, blocked, unblocked, approved, ready for export,
  exported.

## Event Payload Requirements

Events should include:

- Event ID.
- Event type.
- Organization ID.
- Library Item ID when available.
- Project ID.
- Document ID.
- Segment ID.
- Translation ID when available.
- Actor ID.
- AI model and prompt version when AI is involved.
- Before/after state references where applicable.
- Timestamp.
- Correlation ID when available.
- Reason or justification when supplied.

## Event Rules

- Events must not expose restricted metadata to unauthorized consumers.
- Event payloads must be versioned when structure changes.
- Event consumers must not mutate Translation state directly.
- Workflow and publishing decisions must remain human-approved.

## Current Gaps

- Current implementation stores audit records but does not expose a dedicated
  domain event bus for Translation events.
- Canonical event names need mapping from current audit actions.
- AI prompt/model metadata is not yet persisted for every translation-related
  AI action.
