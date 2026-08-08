# Batch 04 Overview

Batch 04 defines the first operational editorial core:

Project -> Document Master -> Version -> Translation -> Correction -> Review -> Editorial Approval.

Final publishing, distribution, print generation, and multimedia production are out of scope for this
batch except for forward-compatible references.

## Repository Baseline

- Batch 01 repository stabilization is present under `docs/implementation/execution-batches/batch-01`.
- Batch 02 identity, authorization, and isolation foundation is present under `docs/implementation/execution-batches/batch-02`.
- Batch 03 canonical data, API, event, import/export, migration, and retention contracts are present under
  `docs/implementation/execution-batches/batch-03`.

## Implementation Scope

- Added shared canonical editorial contracts in `packages/shared/src/editorial-core.ts`.
- Extended JSON Master with optional editorial-core fields for master documents, editorial versions,
  comments, suggestions, correction findings, approvals, and AI execution records.
- Preserved existing Projects, Author Studio, Documents, Segments, Translations, Translation Memory,
  Terminology, QA, Workflow, Collaboration, Editorial Decisions, and web editor surfaces.
- Added contract tests for the canonical editorial core and Batch 04 documentation.

## Non-Scope

- No final publication execution.
- No print/PDF/EPUB generation changes.
- No Docker or staging configuration changes.
- No destructive migration.
- No replacement of existing module APIs.

## Closure Position

Batch 04 is implemented as a canonical contract and consolidation layer over existing modules.
Runtime gaps are documented where the current implementation remains distributed across existing modules
instead of a single physical master-document table.
