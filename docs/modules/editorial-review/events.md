# Editorial Review Events

## Purpose

Editorial Review events provide a traceable record of proofreading, review,
commenting, correction, and approval actions.

## Required Domain Events

The target module emits or records:

- `EditorialReviewCreated`.
- `CommentAdded`.
- `CorrectionRequested`.
- `CorrectionApplied`.
- `ReviewApproved`.
- `ReviewRejected`.
- `ReviewCompleted`.

Additional recommended events:

- `ReviewObservationCreated`.
- `ReviewObservationResolved`.
- `ReviewObservationRejected`.
- `ReviewObservationClosed`.
- `CorrectionProposalCreated`.
- `CorrectionProposalAccepted`.
- `CorrectionProposalRejected`.
- `VersionComparisonCreated`.
- `AIEditorialSuggestionCreated`.

## Current Event and Audit Baseline

Existing supporting audit actions include:

- Editorial Decision: `RECOMMENDATION_CREATED`, `VERSION_CREATED`,
  `APPROVED`, `REJECTED`.
- Collaboration: thread created, comment created, comment resolved, community
  moderation actions.
- QA: QA run, issue created, issue resolved, score recalculated.
- Semantic Fidelity: semantic check, issue created, issue resolved, score
  recalculated.
- Terminology: term create, update, evaluate, under-review, validate, reject,
  suspend, archive, and governance actions.
- Workflow: transitions, blocking, unblocking, approval, export readiness, and
  export state changes.

## Event Payload Requirements

Every event should include:

- Event id.
- Organization id.
- Project id.
- Document id.
- Segment id when relevant.
- Editorial review id when available.
- Actor id.
- Actor role or permission context.
- Event type.
- Previous state.
- New state.
- Rationale.
- Timestamp.
- AI model/provider metadata when AI assistance is used.
- Document or segment version id.

## Integration

Events must integrate with:

- Audit.
- Workflow.
- Notifications when enabled.
- Quality Agent readiness checks.
- Publishing preflight aggregation.
- Backup/restore.

## Gaps

- There is no dedicated Editorial Review event stream yet.
- Current events are audit records inside supporting modules.
- Event naming should be normalized when the canonical `EditorialReview`
  aggregate is introduced.
