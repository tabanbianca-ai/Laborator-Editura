# Publishing Events

## Purpose

Publishing events preserve the release history of official publications,
format builds, validation, distribution, withdrawal, and archival state.

## Required Domain Events

The target module records:

- `PublicationCreated`.
- `PublicationBuilt`.
- `PublicationValidated`.
- `PublicationPublished`.
- `PublicationDistributed`.
- `PublicationWithdrawn`.
- `PublicationArchived`.

Additional recommended events:

- `PublicationBuildStarted`.
- `PublicationBuildCompleted`.
- `PublicationBuildFailed`.
- `FormatGenerated`.
- `FormatValidationFailed`.
- `PublicationProfileSelected`.
- `OfficialEditionSelected`.
- `DistributionFailed`.
- `DistributionWithdrawn`.
- `PublicationRepublished`.

## Current Event and Audit Baseline

Existing publishing-related audit actions include:

- `LAYOUT_PLAN_CREATED`.
- `STYLE_REVISION_CREATED`.
- `PUBLICATION_APPROVED`.
- `PUBLICATION_REJECTED`.
- `EXPORT_RECORDED`.
- `PUBLISHING_STATE_CHANGED`.
- `PREFLIGHT_GENERATED`.
- `PREFLIGHT_REFRESHED`.
- `WARNING_ACCEPTED`.
- `OVERRIDE_APPLIED`.
- `PUBLICATION_CREATED`.
- `EDITION_PUBLISHED`.
- `PUBLICATION_WITHDRAWN`.
- `PUBLICATION_REPUBLISHED`.
- `DISTRIBUTION_INITIATED`.
- `DISTRIBUTION_DELIVERED`.
- `DISTRIBUTION_FAILED`.
- `CHANNEL_WITHDRAWN`.
- `OFFICIAL_EDITION_SELECTED`.
- `FORMAT_REFERENCES_SELECTED`.

Related module events include:

- Library publication, edition, version, file, status, visibility, and rights
  status changes.
- Export artifact creation.
- Public Portal catalog item creation, distribution record creation, release
  approval, and rejection.
- Commerce edition creation, distribution creation, approval, and rejection.
- Rights and Provenance publication authorization actions.
- Workflow approval and export readiness transitions.

## Event Payload Requirements

Every event should include:

- Event id.
- Organization id.
- Publication id.
- Library item/publication id.
- Edition id.
- Version id.
- Build id when available.
- Format.
- Distribution channel.
- Actor id.
- Previous state.
- New state.
- Timestamp.
- Reason or validation result.
- Artifact references.
- Rights snapshot reference.
- Preflight snapshot reference.

## Gaps

- Publishing events exist as audit actions in supporting modules, not as a
  dedicated canonical event stream.
- `PublicationBuilt` is not first-class because `PublicationBuild` is not yet
  modeled.
- Distribution adapter event normalization is pending.
