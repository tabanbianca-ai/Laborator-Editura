# Publishing Migration Plan

## Purpose

This document defines the incremental path from the current implementation to
the official Publishing Module Architecture.

## Migration Principles

- Additive first.
- Preserve existing APIs until clients migrate.
- Preserve Library as the source of truth for publication identity and
  metadata.
- Preserve Export as the owner of generated artifacts.
- Preserve Rights & Provenance authority.
- Preserve Workflow gates.
- Preserve immutable published editions.
- Preserve Phase 7 Step 16 behavior.
- Preserve backup/restore compatibility.
- Do not create separate Preflight, Distribution, or Archive modules.

## Phase 1 - Baseline Mapping

Objectives:

- Map Library publication records, editions, versions, files, layout
  publishing records, export artifacts, public portal catalog items, commerce
  editions, rights records, and workflow states into the Publishing model.

Deliverables:

- Mapping table.
- Ownership boundary review.
- Contract test inventory.

## Phase 2 - Canonical Publication Facade

Objectives:

- Introduce a canonical `Publication` facade without moving data ownership away
  from Library, Export, Rights, Workflow, Public Portal, or Commerce.
- Add canonical routes only as wrappers or orchestration contracts.

Deliverables:

- `POST /publications`.
- `GET /publications/{id}`.
- `POST /publications/search`.

## Phase 3 - Publication Build Aggregate

Objectives:

- Create a reproducible `PublicationBuild` record.
- Capture source version, assets, metadata snapshot, profile version, generator
  versions, requested formats, outputs, validation result, and audit.

Deliverables:

- Publication build model.
- Build audit events.
- Rebuild reproducibility tests.

## Phase 4 - Publication Profiles

Objectives:

- Add canonical reusable and versioned publication profiles.
- Map existing layout profiles and commerce print profiles into the target
  model.

Deliverables:

- Publication profile model.
- Profile versioning.
- Profile selection audit.

## Phase 5 - Format Generator Contracts

Objectives:

- Define generator contracts for PDF, EPUB, HTML, DOCX, MOBI, ODT,
  print-ready PDF, audiobook package, and video package.
- Keep actual generator implementation phased by format.

Deliverables:

- Generator interface.
- Format validation schema.
- Artifact metadata contract.

## Phase 6 - Distribution Adapter Contract

Objectives:

- Formalize adapter metadata for Public Website, Public Library, Mobile App,
  Download Portal, Print Export, and External API.
- Preserve current distribution records and history.

Deliverables:

- Adapter contract.
- Delivery status contract.
- Retry and withdrawal metadata.

## Phase 7 - Workflow and State Alignment

Objectives:

- Map `DRAFT`, `READY`, `PUBLISHED`, `SUSPENDED`, `WITHDRAWN`, and `ARCHIVED`
  to current Phase 7 Step 16 states.
- Preserve Romanian state names where already used by implementation and
  expose localized labels through UI localization.

Deliverables:

- State mapping document.
- Workflow gate tests.
- Archive behavior plan.

## Phase 8 - Performance and Asynchronous Build Planning

Objectives:

- Add planning for parallel format generation, incremental builds, large-batch
  publishing, asynchronous distribution, and retries.

Deliverables:

- Job orchestration plan.
- Performance baseline.
- Operational metrics.

## Codex Governance Reference

The canonical module sequence, dependency closure, and future-extension rule are
maintained in `docs/codex/module-catalog.md`,
`docs/codex/dependency-registry.md`, and `docs/codex/meta-architecture.md`.

This migration plan owns only the local migration strategy for this module. It
does not redefine the platform module sequence, fundamental architecture
closure, or future-extension approval rule.
