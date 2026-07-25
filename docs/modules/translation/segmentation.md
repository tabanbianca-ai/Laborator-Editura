# Segmentation

## Purpose

Segmentation defines how source documents become translation units.

## Segment Requirements

Each segment must preserve:

- UUID.
- Source text.
- Target text reference when translated.
- Status.
- Context.
- Position.
- Version.
- Source language and locale.
- Target language and locale.
- Project and document references.

## Current Implementation Baseline

Current implementation includes:

- `CreateSegmentInput`.
- `Segment`.
- `SegmentsController`.
- `SegmentsService`.
- Runtime table `document_segments`.
- Audit events for create/update.

Implemented API:

- `POST /segments`.
- `GET /segments?documentId=...`.
- `GET /segments/:id`.

Current segment fields include:

- `projectId`.
- `documentId`.
- `sourceText`.
- `sourceLanguage`.
- `sourceLocale`.
- `targetLanguage`.
- `targetLocale`.
- `order`.
- `status`.
- `latestTranslationId`.
- `latestTargetText`.
- `metadata`.

## Context Model

Segment context should include:

- Chapter.
- Paragraph.
- Document.
- Author.
- Edition.
- Neighboring segments.
- Library Item reference.
- Project domain.
- Rights and provenance references when relevant.

Current implementation supports flexible metadata for context but does not yet
enforce a complete context schema.

## Segmentation Rules

- Segments are independent translation units.
- Segment order must be stable.
- Re-segmentation must preserve historical segment versions and alignment.
- Source text must not be modified by translation operations.
- Segment changes must be audited.

## Current Gaps

- Automatic document segmentation is not yet formalized.
- Neighbor segment relationships are not explicit.
- Segment version lineage is not fully modeled.
- Chapter/paragraph context is metadata-based, not standardized.
- Library Item linkage is indirect through document/project.
