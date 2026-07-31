# Digital Asset Relationship Standard

## Purpose

This document defines canonical relationships between documents, editorial
content, media assets, derivatives, publication artifacts, rights records, and
archives.

## Canonical Relationships

Canonical relationship types:

- `ORIGINAL`.
- `TRANSLATION_OF`.
- `EDITION_OF`.
- `DERIVED_FROM`.
- `ADAPTATION_OF`.
- `ILLUSTRATION_FOR`.
- `AUDIO_VERSION_OF`.
- `VIDEO_VERSION_OF`.
- `PUBLISHED_IN`.
- `REFERENCED_BY`.

Additional relationships may be defined only if they map to the canonical data
relationship standard and are documented.

## Relationship Record Fields

Every governed relationship must define:

- `relationshipId`.
- `relationshipType`.
- `sourceAssetId`.
- `targetAssetId`.
- `sourceVersion`.
- `targetVersion`.
- `owner`.
- `createdBy`.
- `createdAt`.
- `status`.
- `metadata`.
- `auditInformation`.

## Alignment Relationships

Translation and multilingual publication relationships must preserve:

- Source manuscript.
- Target manuscript.
- Source language.
- Target language.
- Source segment.
- Target segment.
- Alignment confidence where applicable.
- Version references.
- Human approval status.

## Publication Relationships

Publication relationships must preserve:

- Canonical master.
- Edition.
- Export artifact.
- Publication channel.
- Distribution record.
- Public catalog item.
- Rights record.
- Accessibility record.

## Media Relationships

Media relationships must preserve:

- Source content.
- Media project.
- Asset version.
- Voice or narrator metadata where applicable.
- Subtitle or transcript metadata where applicable.
- Synchronization metadata.
- Rights metadata.

## Orphan and Duplicate Detection

The platform must be able to identify:

- Assets without a canonical master.
- Derivatives without source version.
- Publications without rights references.
- Exports without source master version.
- Media assets without source relationship.
- Duplicate assets with conflicting metadata.

## Audit

Audit must record:

- Relationship created.
- Relationship updated.
- Relationship deprecated.
- Relationship restored.
- Source version changed.
- Target version changed.
- Duplicate detected.
- Orphan detected.
- Approved exception.

