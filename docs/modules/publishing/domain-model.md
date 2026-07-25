# Publishing Domain Model

## Purpose

This document defines the target Publishing domain model and maps it to the
current implementation baseline.

## Main Aggregate

### Publication

Canonical fields:

- `id`.
- `organizationId`.
- `libraryItemId`.
- `libraryPublicationId`.
- `editionId`.
- `versionId`.
- `publicationDate`.
- `publisher`.
- `status`.
- `formats`.
- `distributionChannels`.
- `metadataSnapshotRef`.
- `rightsSnapshotRef`.
- `preflightSnapshotRef`.
- `auditTrail`.
- `createdAt`.
- `updatedAt`.

Publication represents the controlled release unit for an official edition.

## Supporting Entities

### PublicationEdition

Represents an edition of a publication.

Edition types:

- `ORIGINAL_EDITION`.
- `REVISED_EDITION`.
- `CORRECTED_EDITION`.
- `ANNIVERSARY_EDITION`.
- `DIGITAL_EDITION`.
- `PRINT_EDITION`.

Each edition must be independent, versioned, and auditable.

### PublicationVersion

Represents a concrete released or releasable version.

Rules:

- Published versions are immutable.
- Corrections require a new version, edition, or republication record.
- Version history must remain auditable.

### PublicationFormat

Represents a generated output format.

Target formats:

- `PDF`.
- `EPUB`.
- `HTML`.
- `DOCX`.
- `MOBI`.
- `ODT`.
- `PRINT_READY_PDF`.
- `AUDIOBOOK_PACKAGE`.
- `VIDEO_PACKAGE`.

### PublicationProfile

Defines page, layout, accessibility, and output expectations.

Examples:

- `A4_PRINT`.
- `A5_PRINT`.
- `EPUB_STANDARD`.
- `MOBILE_READER`.
- `FLIPBOOK`.

### PublicationBuild

Represents a reproducible build attempt.

Fields:

- Source Library item.
- Source document/version.
- Asset references.
- Metadata snapshot.
- Layout plan.
- Profile.
- Format generator versions.
- Build status.
- Generated artifacts.
- Validation result.

### DistributionAdapter

Represents a distribution channel implementation boundary.

Supported channels:

- Public Website.
- Public Library.
- Mobile App.
- Download Portal.
- Print Export.
- External API.

## Current Baseline Mapping

| Target concept | Current baseline | Notes |
| --- | --- | --- |
| `Publication` | `PublishingRecord` in `layout-publishing`; `LibraryPublicationRecord` in Library | Needs canonical `/publications` facade later |
| `PublicationEdition` | `LibraryPublicationEdition`; `CommerceEdition` | Library owns edition identity; Commerce owns commercial edition metadata |
| `PublicationVersion` | `LibraryPublicationVersion` | Immutable historical version flag exists |
| `PublicationFormat` | `LayoutExportFormat`, `ExportArtifact`, `LibraryPublicationFile` | Multi-format vocabulary exists; real generators are partial |
| `PublicationProfile` | `LayoutPublicationPlan`, `EditorialFinishingProfile`, Commerce print profile | Needs canonical publishing profile model |
| `PublicationBuild` | Publishing preflight and export history | Needs first-class reproducible build record |
| `DistributionAdapter` | `PublishingDistributionRecord`, `PublicDistributionRecord`, Commerce distribution channel | Adapter abstraction is not first-class yet |

## Dependency Map

Publishing depends on:

- Library for publication identity, metadata, editions, versions, files, and
  lifecycle.
- Editorial Review for approved reviewed content.
- Workflow for approval and export-readiness gates.
- Rights & Provenance for publication authorization.
- Export for generated artifacts.
- Layout Publishing for layout plans and publication snapshots.
- Public Portal for public catalog and reader visibility.
- Commerce for print, commercial, and POD metadata.
- Audit for traceability.
- Notifications for release status when enabled.
- Audio and Video modules for package references.

## Data Ownership

Publishing owns:

- Official release readiness state.
- Publication snapshots.
- Publication timestamps.
- Selected distribution channels.
- Publishing history.
- Withdrawal and republication records.

Publishing does not own:

- Canonical Library metadata.
- Source documents.
- Generated export artifacts.
- Rights records.
- Generic workflow transitions.
- Public reader catalog state.
- Commercial pricing.
