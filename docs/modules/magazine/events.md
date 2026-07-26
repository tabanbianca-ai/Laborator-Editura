# Magazine Events

## Purpose

Magazine events preserve issue planning, article assignment, layout changes,
approval, publication handoff, archive, and audit history.

## Required Domain Events

The target module records:

- `MagazineCreated`.
- `IssueCreated`.
- `ArticleAdded`.
- `ArticleRemoved`.
- `IssueApproved`.
- `IssuePublished`.
- `IssueArchived`.

Additional recommended events:

- `VolumeCreated`.
- `SectionCreated`.
- `SectionUpdated`.
- `ArticleReordered`.
- `IssueLayoutChanged`.
- `IssueVersionCreated`.
- `IssueSentToTranslation`.
- `IssueSentToReview`.
- `IssueSentToPublishing`.
- `IssuePublicationWithdrawn`.

## Current Event and Audit Baseline

Current magazine-related history is distributed across:

- Project audit events.
- Library publication, edition, version, file, and status audit.
- Translation audit events.
- Editorial Review and collaboration audit events.
- Rights audit events.
- Layout Publishing audit events.
- Publishing distribution events.

There is no dedicated Magazine event stream yet.

## Event Payload Requirements

Every event should include:

- Event id.
- Organization id.
- Magazine id.
- Volume id when relevant.
- Issue id when relevant.
- Section id when relevant.
- Library Item id for article events.
- Document/version id when relevant.
- Actor id.
- Previous state.
- New state.
- Timestamp.
- Reason.
- Audit reference.

## Gaps

- Magazine events are not first-class.
- Article assignment, removal, ordering, and issue layout events are not
  captured as magazine-specific events.
- Issue publication handoff events are not distinct from Publishing events.
