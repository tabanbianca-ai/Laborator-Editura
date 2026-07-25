# Editorial Review Domain Model

## Purpose

This document defines the target domain model for proofreading and editorial
review while mapping it to the current implementation baseline.

## Main Aggregate

### EditorialReview

Canonical fields:

- `id`.
- `organizationId`.
- `libraryItemId`.
- `projectId`.
- `documentId`.
- `documentVersionId`.
- `sourceLanguage`.
- `targetLanguage`.
- `reviewerId`.
- `status`.
- `observations`.
- `approvals`.
- `auditTrail`.
- `createdAt`.
- `updatedAt`.

The aggregate represents one controlled editorial review pass for a specific
document version.

## Supporting Entities

### ReviewObservation

Represents a proofreading, terminology, style, doctrinal, semantic, or
editorial issue.

Fields:

- `id`.
- `editorialReviewId`.
- `documentId`.
- `segmentId`.
- `observationType`.
- `severity`.
- `status`.
- `sourceExcerpt`.
- `currentText`.
- `message`.
- `suggestedAction`.
- `createdBy`.
- `createdAt`.
- `resolvedBy`.
- `resolvedAt`.

Statuses:

- `OPEN`.
- `IN_PROGRESS`.
- `RESOLVED`.
- `REJECTED`.
- `CLOSED`.

### ReviewComment

Represents a human or AI-assisted note attached to a document, segment, or
observation.

Fields:

- `id`.
- `editorialReviewId`.
- `observationId`.
- `threadId`.
- `authorUserId`.
- `body`.
- `commentType`.
- `privateEditorial`.
- `createdAt`.
- `updatedAt`.

### CorrectionProposal

Represents a non-destructive proposed correction.

Fields:

- `id`.
- `editorialReviewId`.
- `observationId`.
- `segmentId`.
- `originalText`.
- `currentText`.
- `proposedText`.
- `rationale`.
- `evidenceSources`.
- `status`.
- `createdBy`.
- `acceptedBy`.
- `rejectedBy`.
- `createdAt`.
- `resolvedAt`.

Statuses:

- `PENDING`.
- `ACCEPTED`.
- `REJECTED`.

The target text must remain unchanged until a proposal is accepted by an
authorized human.

### ReviewDecision

Represents a reviewer decision, including approval, rejection, or request for
corrections.

Fields:

- `id`.
- `editorialReviewId`.
- `decisionType`.
- `rationale`.
- `approvedBy`.
- `approvedAt`.
- `createdAt`.

### ReviewVersionComparison

Represents a comparison between document versions, segment versions, and
review outcomes.

Fields:

- `id`.
- `editorialReviewId`.
- `baseVersionId`.
- `compareVersionId`.
- `addedSegments`.
- `removedSegments`.
- `modifiedSegments`.
- `commentChanges`.
- `createdAt`.

## Current Baseline Mapping

| Target concept | Current baseline | Notes |
| --- | --- | --- |
| `EditorialReview` | Not a dedicated aggregate | Current behavior is spread across QA, semantic fidelity, workflow, editorial decisions, and review UI |
| `ReviewObservation` | QA issues, semantic issues, collaboration comments | Needs unified observation type and status |
| `ReviewComment` | `collaboration_threads`, `collaboration_comments` | Good baseline for comments and reviewer notes |
| `CorrectionProposal` | Review workspace generated proposals, editorial decisions alternatives | Needs persistent accept/reject proposal model |
| `ReviewDecision` | `editorial_decisions`, workflow approval | Needs canonical review-level decision |
| `ReviewVersionComparison` | Not implemented as a service | Needs additive diff/compare contract |

## Dependency Map

Editorial Review depends on:

- Library for document identity and source of truth.
- Translation for source/target segment state.
- Terminology and Glossary for term authority.
- QA for mechanical and formatting validation.
- Semantic Fidelity for meaning-risk validation.
- Editorial Decisions for recommendations and evidence.
- Collaboration for comments and threads.
- Workflow for approval gates.
- Audit for immutable traceability.
- Publishing for downstream readiness only.

## Data Ownership

Editorial Review owns:

- Review pass identity.
- Review observations.
- Correction proposal state.
- Review decisions.
- Review-specific audit trail.

Editorial Review does not own:

- Original manuscript content.
- Translation segment persistence.
- Generic workflow state.
- Publication release records.
- Terminology authority.
- Library item identity.
