# Library Gap Analysis

## Purpose

This document compares the current Library implementation with the Phase II
Library Module Architecture specification.

## Current Strengths

- Backend Library module exists.
- Frontend Library workspace exists.
- Runtime persistence exists.
- Backup/restore includes Library data.
- Reader experience is implemented.
- Intelligent Editorial Library records are implemented.
- Publication lifecycle, editions, versions, files, visibility, preview,
  search, filtering, duplicate detection, and bulk action foundations exist.
- Audit coverage exists for core Library actions.
- Restricted metadata is protected from unauthorized roles.
- Contract tests cover Library reader and editorial behavior.

## Gap Table

| Area | Current State | Gap | Risk |
| --- | --- | --- | --- |
| Universal Library Item | User library items and publication records coexist | Not every editorial object is a canonical Library Item | High |
| General assets | Publication files exist | General `Asset` model for all files/media is not universal | High |
| Item status | Publication lifecycle exists | Canonical item workflow status is not implemented | Medium |
| Collections | Collection/series fields exist | Dedicated collection records are not modeled | Medium |
| Categories | Tags and domain exist | Dedicated categories taxonomy is not modeled | Medium |
| Relationships | Reference arrays exist | Typed relationship records are not modeled | High |
| Metadata enforcement | Broad fields exist | Required minimum metadata is not universally enforced | Medium |
| Versioning | Publication versions exist | Universal item/asset/metadata versioning is not complete | High |
| Search | Runtime normalized/fuzzy metadata search exists | Full-text, semantic, AI search, and incremental indexing are not implemented | High |
| API | Many Library endpoints exist | Canonical item detail/update/search/asset routes are incomplete | Medium |
| Events | Audit events exist | Domain event contracts are not emitted separately | Medium |
| Performance | Runtime search works for MVP | Production-scale million-resource search requires dedicated indexing | High |

## Risk Evaluation

High-risk gaps:

- Non-universal Library Item identity can allow duplicate editorial object
  repositories.
- Missing generalized Asset model can fragment media and file management.
- Missing typed relationships can weaken traceability between original,
  translation, edition, audio, video, and publication.
- Search/indexing must evolve before million-resource scale.

Medium-risk gaps:

- Metadata completeness is flexible but not enforced.
- Dedicated collections/categories are not yet governed.
- Canonical Library Item status must be mapped to existing lifecycle.

## Implementation Constraint

All remediation must be additive and preserve:

- Current reader experience.
- Intelligent Editorial Library behavior.
- Phase 7 Step 16 publishing, preflight, and distribution behavior.
- Existing API clients until migration.
- Backup/restore compatibility.
- Audit history.
