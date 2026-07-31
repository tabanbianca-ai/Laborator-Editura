# Library Migration Plan

## Purpose

This document defines the incremental implementation path from the current
Library baseline to the Phase II Library Module Architecture target.

## Migration Principles

- Additive first.
- No destructive schema or API changes.
- Preserve validated Phase 7 Step 16 behavior.
- Preserve reader experience.
- Preserve existing Library API routes while adding canonical routes.
- Preserve backup/restore compatibility.
- Preserve audit history.
- Do not introduce duplicate editorial repositories.

## Phase 1 - Canonical Mapping

Objectives:

- Map current `LibraryItem` and `LibraryPublicationRecord` into the target
  canonical Library Item model.
- Document mapping from current lifecycle statuses to canonical item workflow
  statuses.
- Identify which existing module records must reference Library Items.

Deliverables:

- Field mapping.
- Status mapping.
- Relationship inventory.

## Phase 2 - General Asset Model

Objectives:

- Introduce generalized Library Asset records.
- Preserve existing `library_publication_files`.
- Link publication files to generalized assets when safe.

Deliverables:

- Asset persistence.
- Asset API contracts.
- Asset audit events.
- Backup/restore support.

## Phase 3 - Metadata Enforcement

Objectives:

- Define required metadata validation for canonical Library Items.
- Preserve flexible metadata for module-specific extension.
- Add completeness checks and warnings before publication.

Deliverables:

- Metadata validator.
- Metadata completeness report.
- Quality Agent integration.

## Phase 4 - Typed Relationships

Objectives:

- Add explicit Library relationship records.
- Represent original, translation, correction, edition, audio, video,
  illustration, export, and publication relationships.
- Keep current reference arrays during migration.

Deliverables:

- Relationship persistence.
- Relationship API.
- Relationship audit.
- Relationship search support.

## Phase 5 - Universal Versioning

Objectives:

- Extend versioning beyond publication versions.
- Version Library Items, Assets, metadata, and relationships.
- Add restore-as-new-current-state behavior.

Deliverables:

- Version snapshots.
- Restore contracts.
- Version comparison plan.

## Phase 6 - Search and Indexing

Objectives:

- Introduce dedicated indexing strategy.
- Add full-text search where content licensing permits.
- Add semantic search and embeddings where approved.
- Add incremental indexing.

Deliverables:

- Search index design.
- Index rebuild procedure.
- Search performance baseline.

## Phase 7 - Canonical API Completion

Objectives:

- Add canonical item detail, update, search, and asset routes.
- Preserve current routes.
- Publish contract tests.

Deliverables:

- `GET /library/items/{id}`.
- `PATCH /library/items/{id}`.
- Unified `POST /library/search`.
- Asset endpoints.
- Contract tests.

## Phase 8 - Operational Hardening

Objectives:

- Add performance tests for Library search.
- Add backup/restore fixtures for new Library tables.
- Add Need-to-Know contract tests for restricted assets and metadata.
- Add event contract tests.

Deliverables:

- Runtime tests.
- Backup/restore tests.
- Security tests.
- Quality Gate integration.

## Codex Governance Reference

The canonical module sequence, dependency closure, and future-extension rule are
maintained in `docs/codex/module-catalog.md`,
`docs/codex/dependency-registry.md`, and `docs/codex/meta-architecture.md`.

This migration plan owns only the local migration strategy for this module. It
does not redefine the platform module sequence, fundamental architecture
closure, or future-extension approval rule.
