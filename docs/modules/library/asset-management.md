# Library Asset Management

## Purpose

This document defines how physical files and external artifacts are managed by
the Library module.

## Asset Definition

An Asset is a physical file, generated artifact, or externally stored media
reference connected to a Library Item.

Examples:

- PDF.
- EPUB.
- DOCX.
- Source manuscript.
- Cover image.
- Illustration.
- Audio file.
- Video file.
- Subtitle file.
- Print-ready file.

## Current Implementation Baseline

Current implementation uses `LibraryPublicationFile` with:

- `id`.
- `organizationId`.
- `publicationId`.
- `editionId`.
- `fileType`.
- `fileName`.
- `artifactRef`.
- `checksum`.
- `sourceFileFingerprint`.
- `visibility`.
- `restricted`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.
- `metadata`.

Runtime persistence and backup include `library_publication_files`.

## Target Asset Model

Library Asset records should support:

- Asset identity.
- Parent Library Item.
- Optional publication, edition, or version reference.
- File type.
- MIME type.
- File name.
- Storage provider or artifact reference.
- Checksum.
- Fingerprint.
- Size.
- Language and locale when content-bearing.
- Rights metadata.
- Provenance metadata.
- Visibility.
- Restricted flag.
- Version relationship.
- Created and updated timestamps.

## Asset Rules

- Assets must never be orphaned.
- Assets must reference a Library Item.
- Restricted assets must not be exposed through previews.
- Replacing an asset creates a new asset version or file record.
- Checksums or fingerprints should be used for duplicate detection.
- Export-generated artifacts remain owned by Export but must be registered in
  Library as assets or publication files.
- AI may receive asset metadata and approved extracted context, but it must
  not access uncontrolled raw files directly.

## Current Gaps

- A generalized `library_assets` table does not yet exist.
- Publication files cover export/publication files but not every possible
  source, illustration, image, audio, or video asset type.
- Asset versioning is partially represented through publication versions and
  file replacement audit, but not yet universal.
