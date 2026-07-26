# Magazine Domain Model

## Purpose

This document defines the target Magazine domain model and maps it to the
current implementation baseline.

## Main Entities

### Magazine

Represents the periodical publication.

Canonical fields:

- `id`.
- `organizationId`.
- `libraryPublicationId`.
- `title`.
- `description`.
- `issn`.
- `languages`.
- `editorId`.
- `status`.
- `createdAt`.
- `updatedAt`.

### MagazineVolume

Represents annual or periodic grouping.

Example:

- Revista Spiritista - Volume 2027.
- Revista Spiritista - Volume 2028.

Canonical fields:

- `id`.
- `magazineId`.
- `year`.
- `title`.
- `status`.
- `createdAt`.
- `updatedAt`.

### MagazineIssue

Represents an individual issue.

Example:

- 2027 / No. 1.
- 2027 / No. 2.

Canonical fields:

- `id`.
- `magazineId`.
- `volumeId`.
- `libraryPublicationId`.
- `issueNumber`.
- `title`.
- `publicationDate`.
- `status`.
- `version`.
- `createdAt`.
- `updatedAt`.

### MagazineSection

Represents a configurable rubric/section.

Examples:

- Editorial.
- Studies.
- History.
- Spiritism.
- Conferences.
- Reviews.
- Events.
- News.

### MagazineArticleAssignment

Links a Library article item to a section and issue without duplicating
article content.

Fields:

- `id`.
- `issueId`.
- `sectionId`.
- `libraryItemId`.
- `documentId`.
- `translationRefs`.
- `reviewRefs`.
- `layoutPlacement`.
- `order`.
- `status`.

## Current Baseline Mapping

| Target concept | Current baseline | Notes |
| --- | --- | --- |
| `Magazine` | Project with `publicationType: "MAGAZINE"` | Needs dedicated periodical aggregate |
| `MagazineVolume` | Editorial classification volume metadata | Needs first-class volume model |
| `MagazineIssue` | Project/document group and `/magazine/[issueId]` read model | Needs first-class issue model |
| `MagazineSection` | Not first-class | Needs configurable rubric model |
| Article | Library item/document types `ARTICLE`, `MAGAZINE_ARTICLE` | Good baseline; needs explicit issue assignment |
| Issue layout | `LayoutPublicationPlan` with `publicationKind: "MAGAZINE"` | Needs issue-specific layout relationship |
| Publication | Publishing records and Public Portal records | Correct downstream owner |

## Dependency Map

Magazine depends on:

- Library for article, asset, file, issue publication, and metadata identity.
- Translation for article translations.
- Editorial Review for article approval.
- Rights and Provenance for article and issue rights validation.
- Layout Publishing for issue layout plans.
- Publishing for official issue publication.
- Public Portal for public reading visibility.
- Audio and Video for article media readiness.
- Workflow Engine for issue and article process states.
- Audit for complete traceability.

## Data Ownership

Magazine owns:

- Periodical structure.
- Volume structure.
- Issue structure.
- Section/rubric configuration.
- Article-to-issue assignment.
- Issue-specific ordering and layout coordination metadata.

Magazine does not own:

- Article body content.
- Source documents.
- Translation content.
- Review decisions.
- Publication records.
- Rights records.
- Generated files.
