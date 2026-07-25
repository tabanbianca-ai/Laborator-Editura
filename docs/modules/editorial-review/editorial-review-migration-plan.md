# Editorial Review Migration Plan

## Purpose

This document defines the incremental path from the current baseline to the
official Proofreading and Editorial Review Module Architecture.

## Migration Principles

- Additive first.
- Preserve existing APIs until clients migrate.
- Preserve Translation and Library ownership of editorial content.
- Preserve Workflow Engine authority over transitions.
- Preserve validated terminology priority.
- Preserve Human Final Authority.
- Preserve Phase 7 Step 16 publishing, preflight, and distribution behavior.
- Preserve backup/restore compatibility.

## Phase 1 - Baseline Mapping

Objectives:

- Map QA issues, semantic issues, terminology violations, editorial decisions,
  collaboration comments, and workflow states into the Editorial Review model.
- Define field-level relationships to Library, Translation, and document
  versions.

Deliverables:

- Mapping table.
- Contract test inventory.
- Audit coverage inventory.

## Phase 2 - Editorial Review Aggregate

Objectives:

- Introduce a first-class `EditorialReview` aggregate.
- Link review to organization, Library Item, project, document, document
  version, reviewer, status, observations, approvals, and audit.

Deliverables:

- Backend type and repository design.
- Runtime persistence plan.
- Backup/restore table plan.

## Phase 3 - Observations and Comments

Objectives:

- Add unified `ReviewObservation` lifecycle.
- Connect existing collaboration threads and comments to review observations.
- Preserve private editorial comments and Need-to-Know access.

Deliverables:

- Observation status model.
- Comment mapping.
- Audit events.

## Phase 4 - Correction Proposals

Objectives:

- Persist correction proposals.
- Support `PENDING`, `ACCEPTED`, and `REJECTED` states.
- Ensure target text is not modified until authorized human acceptance.

Deliverables:

- Proposal model.
- Accept/reject routes.
- Version creation rule.

## Phase 5 - Linguistic and Style Rule Expansion

Objectives:

- Add configurable language and locale rule packs.
- Add project style profiles.
- Add doctrinal review configuration where project domain requires it.

Deliverables:

- Rule configuration contracts.
- Style validation result contracts.
- Doctrinal review result contracts.

## Phase 6 - Canonical API Completion

Objectives:

- Add versioned canonical Editorial Review routes.
- Preserve current editorial decision, collaboration, QA, semantic,
  terminology, and workflow routes.

Deliverables:

- `POST /editorial-reviews`.
- `GET /editorial-reviews/{id}`.
- `POST /editorial-reviews/{id}/comments`.
- `POST /editorial-reviews/{id}/approve`.
- `POST /editorial-reviews/{id}/reject`.
- `POST /editorial-reviews/search`.

## Phase 7 - Version Comparison

Objectives:

- Compare document versions, segment versions, review states, additions,
  removals, modifications, and comments.
- Preserve comparison results for audit where needed.

Deliverables:

- Version comparison service.
- Review comparison API.
- Contract tests.

## Phase 8 - Performance and Collaboration Hardening

Objectives:

- Add indexing strategy for observations, terms, comments, and review search.
- Plan incremental loading for large documents.
- Add real-time comment strategy when approved.

Deliverables:

- Performance plan.
- Indexing plan.
- Real-time collaboration plan.

## Next Recommended Module

Module 4 - Publishing Module Architecture is now documented as the next Phase
II specification after Proofreading and Editorial Review.

The next recommended module specification after Publishing is Module 5 -
Rights and Provenance Module Architecture.
