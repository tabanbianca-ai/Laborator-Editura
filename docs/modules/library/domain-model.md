# Library Domain Model

## Purpose

This document defines the official domain model for the Library module.

## Aggregate Structure

```text
Library
  -> Collection
  -> LibraryItem
       -> Asset
       -> Metadata
       -> Version
       -> RightsReference
       -> ProvenanceRecord
       -> Relationship
       -> Tags
       -> Categories
```

## Core Entities

### LibraryItem

Canonical representation of an editorial resource.

Examples:

- Manuscript.
- Book.
- Magazine.
- Article.
- Image.
- Audio.
- Video.
- Illustration.
- Translation.
- PDF.
- EPUB.
- Presentation.

Current implementation baseline:

- `LibraryItem` exists for saved user library items.
- `LibraryPublicationRecord` exists for editorial publication lifecycle
  records.

Target model:

- `LibraryItem` becomes the universal editorial resource identity.
- Publication records, reader records, assets, editions, and versions must
  reference the canonical Library Item identity.

### Asset

Physical file or external artifact reference connected to a Library Item.

Examples:

- `book.pdf`.
- `cover.png`.
- `audio.mp3`.
- `translation.docx`.
- `video.mp4`.

Current implementation baseline:

- `LibraryPublicationFile` represents publication files with file type,
  artifact reference, checksum, visibility, restricted flag, and metadata.

Target model:

- Introduce generalized Asset semantics while preserving existing publication
  file behavior.

### Version

Immutable historical state of a Library Item, Asset, metadata record, or
publication edition.

Current implementation baseline:

- `LibraryPublicationVersion` exists and is marked
  `immutableHistoricalVersion: true`.

Target model:

- Versioning applies to Library Items, Assets, metadata, and relationship
  changes.

### Collection

Named grouping of Library resources.

Examples:

- Allan Kardec.
- Leon Denis.
- Spiritism.
- Children.
- Magazine.
- Conferences.
- Audio.
- Video.

Current implementation baseline:

- Publication records include `collection`, `series`, and `volume`.

Target model:

- Dedicated collection records may be added when collection governance,
  permissions, hierarchy, or ordering require it.

### Relationship

Explicit connection between Library Items.

Examples:

```text
Original Book
  -> Translation
  -> Corrected Translation
  -> Published Edition
  -> Audio
  -> Video
```

Current implementation baseline:

- Publication records include `translationRefs`, `reviewRefs`, `layoutRefs`,
  `publishingRecordRefs`, `manuscriptId`, `projectId`, and related references.

Target model:

- Relationship records should be explicit, typed, auditable, and searchable.

## Official Status Model

Library Item workflow status:

- `DRAFT`.
- `IN_REVIEW`.
- `APPROVED`.
- `PUBLISHED`.
- `ARCHIVED`.
- `DEPRECATED`.

Current implementation note:

- Current editorial publication lifecycle uses `STOC_REAL`, `IN_LUCRU`, and
  `PUBLICAT`.
- These lifecycle statuses are preserved for the Intelligent Editorial Library
  and must be mapped to the canonical Library Item workflow status instead of
  removed abruptly.

## Domain Rules

- Library Item identity is stable.
- Versions are immutable.
- Assets belong to Library Items.
- Metadata changes are auditable.
- Relationships are explicit.
- Restricted metadata is hidden unless Need-to-Know permits access.
- No duplicate editorial repository may be introduced outside Library.
