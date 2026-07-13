# Phase 7 Step 15 - Intelligent Editorial Library & UX Finalization Report

Status: Implemented.

## Scope

- Additive extension of the existing Library module.
- No new enterprise module.
- No separate Archive module.
- No Docker or staging configuration changes.
- No breaking API changes.

## Existing Functions Reused

- Library and reader workspace.
- Projects.
- Manuscripts.
- Project Dossiers.
- Translation.
- Review.
- Layout and Publishing.
- Distribution.
- Rights & Provenance.
- Unified Language Management.
- Audit.
- Runtime backup/restore.
- Need-to-Know access model.

## New Functions Implemented

- Unified editorial publication records.
- Lifecycle statuses:
  - `STOC_REAL`.
  - `IN_LUCRU`.
  - `PUBLICAT`.
- Lifecycle transitions:
  - Stoc real to În lucru.
  - În lucru to Publicat.
  - Publicat to În lucru for new edition or revision.
- Search across title, subtitle, author, ISBN, language, series, collection,
  original title, original author, and metadata.
- Exact, normalized, fuzzy, partial title, author, multilingual metadata, ISBN,
  series, and collection search support.
- Filters by author, language, editorial domain, publication type, lifecycle
  status, publication year, original publication year, rights status, format,
  series, and collection.
- Alphabetical sorting with ascending/descending direction.
- Grid/list view preference metadata.
- Persistent filters, recent searches, and saved searches.
- Publication preview without restricted content.
- Editions, versions, and files connected to publication records.
- Bulk action foundation for status, collection, series, tags, metadata,
  project assignment, visibility, rights validation, and reporting.
- Duplicate detection without automatic merge.
- Runtime persistence and backup/restore support for:
  - `library_publications`.
  - `library_publication_editions`.
  - `library_publication_versions`.
  - `library_publication_files`.
  - `library_view_preferences`.

## UX Decisions

- The Library remains one unified workspace.
- The intelligent editorial Library panel is placed above the existing reader
  experience, preserving reader progress, bookmarks, highlights, notes, and
  favorites.
- One primary search field is used.
- Active filters are visible as chips.
- Advanced filters are collapsible.
- Grid and list views are visible and switchable.
- Lifecycle status and visibility labels are always visible.
- Quick preview, contextual actions, and bulk actions are kept in the same
  workspace without opening an administration surface.
- Common actions are designed for the 2-3 click target.
- Restricted metadata is not returned to unauthorized users.

## Lifecycle Model

Statuses are not separate libraries:

- `STOC_REAL`: stored source or publication, not active in production.
- `IN_LUCRU`: connected to active editorial production.
- `PUBLICAT`: approved and published publication.

Status changes preserve versions, editions, audit, and backup history.

## Status and Visibility Model

Visibility is independent from lifecycle status:

- `PUBLIC`.
- `PRIVATE`.
- `INTERNAL_WORKING_PUBLICATION`.

A publication may be `PUBLICAT` and still `PRIVATE`.

## Agent Behavior

Library Agent may:

- Classify publications.
- Validate metadata completeness.
- Detect duplicates.
- Connect editions and versions.
- Maintain project and manuscript relationships.
- Suggest missing metadata.
- Preserve status consistency.

Library Agent may not:

- Delete historical versions automatically.
- Merge duplicates automatically.

Quality Agent checks:

- Publication completeness.
- Required formats.
- Metadata.
- Rights.
- Accessibility.
- Publication readiness.

Rights & Provenance Agent validates source and rights information before
publication.

## Tests

Added:

- `apps/api/tests/intelligent-editorial-library-contract.test.mjs`.
- `apps/web/tests/intelligent-editorial-library-ui-contract.test.mjs`.

Updated:

- Runtime backup/restore fixtures include intelligent Library data.

Coverage includes:

- Alphabetical organization and sorting.
- Search and filters.
- Grid/list preferences.
- Lifecycle statuses and transitions.
- Visibility independence.
- Publication record completeness.
- Manuscript and project relationships.
- Editions and versions.
- Rights metadata and formats.
- Preview authorization.
- Bulk actions.
- Duplicate detection without automatic merge.
- Restricted metadata protection.
- Audit.
- Backup/restore.

## Remaining Gaps

- Real saved-search management UI is represented as metadata only.
- Bulk action UI remains non-destructive and placeholder-style until role,
  subscription, and Need-to-Know enforcement are connected end to end in the
  frontend.
- Duplicate comparison UI is represented by backend evidence and contract
  tests; a richer visual comparison can be added later without changing the
  model.
