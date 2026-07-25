# Logical Data Model Migration Plan

Status: Incremental migration plan for Chapter 5 - Logical Data Model.

Scope: Documentation only. This plan does not authorize physical database
changes, runtime rewrites, API changes, UI changes, Docker changes, or removal
of validated functionality.

## Goal

Move the platform from module-first runtime foundations to a unified logical
data model without disrupting validated Phase 7 Step 16 functionality.

The migration must preserve:

- Publishing Workflow.
- Final Preflight.
- Distribution Tracking.
- Library publication identity and lifecycle.
- Rights & Provenance.
- Export artifacts.
- Workflow gates.
- Quality and semantic validation.
- Audit.
- Backup and restore coverage.

## Principles

- Clarify logical ownership before changing implementation.
- Preserve working APIs.
- Preserve existing runtime tables until a physical migration is approved.
- Use compatibility layers before replacement.
- Add tests before any later physical migration.
- Avoid destructive changes.
- Keep audit and historical versions intact.
- Use Architecture Decision Records for approved exceptions.

## Phase 0 - Logical Baseline

Status: current phase.

Tasks:

- Create Chapter 5 - Logical Data Model.
- Create aggregate map.
- Create entity relationship baseline.
- Create integrity rules.
- Create logical gap analysis.
- Create logical migration plan.

Exit criteria:

- Documentation is complete.
- `git diff --check` passes.
- No code, database, API, UI, or infrastructure changes are introduced.

## Phase 1 - Ownership Confirmation

Tasks:

- Confirm one logical owner for every entity in `docs/data/aggregate-map.md`.
- Mark cross-aggregate fields as references, snapshots, or read-model data.
- Document intentional overlaps through ADRs.
- Update module documentation where ownership is ambiguous.

Priority confirmations:

1. `Organization` vs `AdminOrganization`.
2. `User`, `Role`, `Permission`, `Membership`, and `AccessGrant`.
3. `LibraryPublicationRecord` vs `PublishingRecord` vs `PublicCatalogItem`.
4. `Asset` vs module-specific asset records.
5. `Review`, `CorrectionProposal`, QA, Semantic Fidelity, and editorial
   decisions.
6. `OriginalWork`, `SourceEdition`, and provenance fields.
7. `AITask`, `AIExecution`, and `AIResult`.

No physical schema changes in this phase.

## Phase 2 - Logical Contract Definition

Tasks:

- Define logical DTOs and service contracts for cross-aggregate references.
- Define common entity metadata contract: `id`, `organizationId`, `version`,
  `status`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`.
- Define common reference contract: `resourceType`, `resourceId`,
  `organizationId`, optional `projectId`.
- Define common audit metadata contract.
- Define common version metadata contract.
- Define common asset reference contract.

Deliverables:

- Logical contract document.
- Compatibility matrix for existing APIs.
- Event and read-model reference strategy.

No physical database design in this phase.

## Phase 3 - Cardinality and Integrity Formalization

Tasks:

- Convert `docs/data/entity-relationships.md` into formal logical
  cardinalities.
- Define required, optional, and conditional relationships.
- Define lifecycle state transition rules per aggregate.
- Define deletion strategy per aggregate and entity group.
- Define versioning strategy per versioned entity group.
- Define concurrency strategy for collaborative editing and approval flows.

Deliverables:

- Logical cardinality matrix.
- Integrity rule test plan.
- Concurrency and conflict-resolution test plan.

No migrations in this phase.

## Phase 4 - Compatibility Read Models

Tasks:

- Identify views or read models needed by frontend workspaces, pipeline,
  publishing, distribution, rights, library, and review.
- Ensure read models do not become new sources of truth.
- Define mapping from current module records to logical read models.
- Define how snapshots preserve historical publication, rights, preflight, and
  distribution state.

Candidate read models:

- Project production overview.
- Editorial workspace overview.
- Publication readiness overview.
- Distribution readiness overview.
- Rights warning overview.
- Translation review overview.
- Library publication overview.
- AI execution overview.

Implementation requires a later approved phase.

## Phase 5 - Chapter 6 Physical Model Preparation

Depends on: Chapter 6 - Physical Data Model and Database Standards.

Tasks:

- Translate logical aggregates into physical table families.
- Define primary key and foreign key conventions.
- Define indexes and query patterns.
- Define tenant isolation strategy.
- Define retention and archival policies.
- Define migration sequence and rollback plan.
- Define backup/restore compatibility requirements.
- Define JSON Master export mapping.

Rules:

- No destructive migrations.
- No loss of audit history.
- No loss of version history.
- No publication identity duplication.
- No rights/provenance loss.
- No AI result mutation of domain data.

## Phase 6 - Incremental Implementation

Tasks:

- Add compatibility tests before changing persistence.
- Introduce new abstractions behind existing APIs.
- Migrate one bounded aggregate at a time.
- Preserve old read paths until new read paths are validated.
- Keep backup/restore compatible during every migration.
- Record migration actions where data is transformed.

Recommended implementation order:

1. Shared logical metadata and reference contracts.
2. Audit and versioning metadata alignment.
3. Organization/User/Role/Membership/Grant clarification.
4. Library/Publishing/Public Portal/Commerce publication mapping.
5. Asset reference mapping.
6. Original Work/Source Edition/Rights mapping.
7. Review/Correction/Decision mapping.
8. AI Task/Execution/Result mapping.
9. Notification aggregate decision.
10. Physical optimization and indexing.

## Phase 7 - Validation

Validation must include:

- Full available backend tests.
- Full available frontend tests.
- Workspace typecheck and build.
- JSON Master validation.
- Runtime backup/restore dry-run.
- Tenant isolation tests.
- Need-to-Know access tests.
- Audit continuity tests.
- Version restoration tests.
- End-to-end editorial pipeline smoke test.
- Publishing/preflight/distribution smoke test.

## Blockers Before Physical Migration

- Chapter 6 is not yet approved.
- `Asset` ownership and reference strategy require final logical decision.
- `OriginalWork` and `SourceEdition` need physical mapping decisions.
- `Review` and `CorrectionProposal` need unified mapping decisions.
- `Publication` identity vs release state vs public exposure vs commerce
  metadata must be mapped explicitly.
- Central enum ownership and module-local enum exceptions must be defined.
- Notification aggregate scope is not yet implemented.
- ChangeSet grouping is not yet implemented.

## Current Recommendation

Do not implement database changes yet.

Proceed next with Chapter 6 - Physical Data Model and Database Standards after
this logical model baseline is accepted.

Chapter 6 must use Chapter 4 and Chapter 5 together:

- Chapter 4 defines conceptual meaning.
- Chapter 5 defines logical aggregates, ownership, cardinalities, integrity,
  versioning, deletion, and concurrency.
- Chapter 6 will define the physical database implementation.
