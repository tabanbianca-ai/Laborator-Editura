# Magazine Migration Plan

## Purpose

This document defines the incremental path from the current implementation to
the official Magazine Module Architecture.

## Migration Principles

- Additive first.
- Preserve current `/magazine` and `/magazine/[issueId]` frontend behavior.
- Preserve Library as the source of truth for articles and assets.
- Preserve Translation, Editorial Review, Rights, Publishing, and Workflow
  ownership.
- Preserve Phase 7 Step 16 behavior.
- Preserve backup/restore compatibility.
- Do not duplicate article content across issues.

## Phase 1 - Baseline Mapping

Objectives:

- Map Project `MAGAZINE`, document article types, Library publication records,
  Layout Publishing magazine plans, Rights warnings, Public Portal metadata,
  and Magazine Digital Experience read models into the target Magazine model.

Deliverables:

- Mapping table.
- Ownership boundary review.
- Contract test inventory.

## Phase 2 - Magazine Aggregate

Objectives:

- Add canonical `Magazine` records.
- Link to Library publication identity and existing Project records when
  applicable.

Deliverables:

- Magazine model.
- Status model.
- Audit events.

## Phase 3 - Volumes and Issues

Objectives:

- Add `MagazineVolume` and `MagazineIssue`.
- Preserve annual/periodic organization.
- Add issue versioning and archive state.

Deliverables:

- Volume model.
- Issue model.
- Issue version model.
- Archive state.

## Phase 4 - Sections and Article Assignments

Objectives:

- Add configurable sections/rubrics.
- Add article assignment records that reference Library Items.
- Support ordering and reuse without content duplication.

Deliverables:

- Section model.
- Article assignment model.
- Reuse tests.

## Phase 5 - Translation and Review Integration

Objectives:

- Link issue/article assignments to Translation and Editorial Review states.
- Require article approval before issue publication.

Deliverables:

- Translation status mapping.
- Review status mapping.
- Workflow gate tests.

## Phase 6 - Layout Integration

Objectives:

- Link issues to Layout Publishing plans.
- Store issue-specific section/article placement metadata.

Deliverables:

- Layout relationship model.
- Placement metadata.
- Layout audit events.

## Phase 7 - Publishing Handoff

Objectives:

- Create canonical issue-to-Publishing handoff.
- Preserve Publishing as the official release mechanism.
- Preserve Phase 7 Step 16 preflight/distribution behavior.

Deliverables:

- Publishing handoff contract.
- Issue publication readiness tests.
- Archive/withdrawal mapping.

## Phase 8 - APIs and Events

Objectives:

- Add canonical Magazine APIs and domain events.
- Preserve existing frontend read paths until migration.

Deliverables:

- `POST /magazines`.
- `POST /issues`.
- `POST /articles`.
- `POST /issues/{id}/publish`.
- `GET /issues`.
- `GET /articles`.
- `POST /issues/search`.
- Magazine event catalog.

## Phase 9 - Search and Performance

Objectives:

- Support hundreds of magazines, thousands of issues, and hundreds of
  thousands of articles.
- Add full-text search and indexing plans.
- Plan parallel publication generation.

Deliverables:

- Indexing plan.
- Search API.
- Performance baseline.

## Codex Governance Reference

The canonical module sequence, dependency closure, and future-extension rule are
maintained in `docs/codex/module-catalog.md`,
`docs/codex/dependency-registry.md`, and `docs/codex/meta-architecture.md`.

This migration plan owns only the local migration strategy for this module. It
does not redefine the platform module sequence, fundamental architecture
closure, or future-extension approval rule.
