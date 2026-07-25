# Physical Database Migration Plan

Status: Incremental alignment plan for Chapter 6 - Physical Data Model and
Database Standards.

Scope: Documentation only. This plan does not authorize schema changes by
itself.

## Goal

Align the current repository persistence model with the approved conceptual,
logical, and physical database standards while preserving validated
functionality.

Validated Phase 7 Step 16 publishing, final preflight, distribution tracking,
Library, Rights, Export, Workflow, Quality, Backup, and audit behavior must be
preserved.

## Migration Principles

- No destructive schema changes without explicit approval.
- No table renames without compatibility mapping.
- No loss of audit history.
- No loss of version history.
- No loss of rights/provenance history.
- No loss of published snapshots.
- No runtime-to-PostgreSQL conversion without a dedicated implementation
  phase.
- Every change must be delivered through versioned migrations.

## Phase 0 - Baseline Documentation

Status: current phase.

Tasks:

- Create Chapter 6 physical database standard.
- Inventory current migrations.
- Document database conventions.
- Document index strategy.
- Document migration strategy.
- Document gap analysis.
- Document incremental migration plan.

Exit criteria:

- Documentation is complete.
- No schema changes are introduced.
- `git diff --check` passes.

## Phase 1 - Migration Governance Hardening

Tasks:

- Define a standard migration review checklist.
- Ensure every migration test checks table existence, primary keys,
  constraints, indexes, and RLS where applicable.
- Add a database object inventory report format.
- Add a migration-to-aggregate mapping document.

No runtime schema change is required unless separately approved.

## Phase 2 - Existing Migration Documentation

Tasks:

- Add table-level documentation for current PostgreSQL tables.
- Document deletion strategy per current table.
- Document owner aggregate per current table.
- Document index purpose per current index.
- Document RLS policy purpose per current policy.

Priority current tables:

1. `organizations`.
2. `users`.
3. `projects`.
4. `documents`.
5. `document_segments`.
6. `segment_translations`.
7. `translation_memory_entries`.
8. `terminology_terms`.
9. `qa_reports` and `qa_issues`.
10. `semantic_fidelity_reports` and `semantic_fidelity_issues`.
11. `workflow_states` and `workflow_transitions`.
12. `export_artifacts`.
13. `organization_founder_protection`.
14. `auth_sessions` and security tables.

## Phase 3 - Additive Physical Alignment

Tasks:

- Add missing common metadata fields only where justified and backward
  compatible.
- Prefer nullable columns with backfill plans before enforcing `NOT NULL`.
- Add `version` only when optimistic locking or versioning behavior is ready.
- Add `updated_by` only with application support.
- Add deletion strategy fields only after table-level policy is documented.

Rules:

- Do not enforce constraints before existing data is validated.
- Do not change public API contracts unless separately approved.

## Phase 4 - Runtime Persistence PostgreSQL Roadmap

Tasks:

- Group runtime tables by Chapter 5 aggregate.
- Prioritize aggregate migration based on launch risk and operational value.
- Define one PostgreSQL migration family per bounded aggregate.
- Preserve runtime backup compatibility during transition.

Recommended order:

1. Library publication records and publication files.
2. Rights & Provenance.
3. Publishing preflight and distribution records.
4. Workspace Need-to-Know and Administration.
5. Author Studio.
6. Research.
7. AI governance and provider/cost records.
8. Media and asset records.
9. Collaboration and community.
10. Public Portal and Commerce.
11. Scheduling and notifications.
12. Observability, policy, backup governance, integrations, and marketplace.

## Phase 5 - Shared Asset Physical Strategy

Tasks:

- Decide whether `Asset` becomes:
  - A single `asset` table with specialized profile tables.
  - A shared asset registry plus module-owned profile tables.
  - A strict reference contract over module-owned asset tables.
- Define storage reference format.
- Define asset rights metadata.
- Define language/locale metadata.
- Define checksum/versioning strategy.
- Define publication/export relationships.

No media table consolidation is allowed before this strategy is approved.

## Phase 6 - Publication and Rights Physical Strategy

Tasks:

- Map `LibraryPublicationRecord` to physical publication identity.
- Map `PublishingRecord` to release state.
- Map `PublicCatalogItem` to public exposure.
- Map `CommerceEdition` to commercial metadata.
- Map `OriginalWork` and `SourceEdition` to rights/provenance authority.
- Define snapshot rules for published editions.
- Define immutable publication version constraints.

Goal:

- Avoid duplicated publication identity while preserving release, public, and
  commerce responsibilities.

## Phase 7 - Review, Correction, and AI Physical Strategy

Tasks:

- Define physical tables or mappings for `Review`, `ReviewFinding`,
  `CorrectionProposal`, and `EditorialDecision`.
- Define physical tables or mappings for `AITask`, `AIExecution`, and
  `AIResult`.
- Link AI results to review evidence without direct domain mutation.
- Preserve human approval and audit trail.

## Phase 8 - Compatibility and Backfill

Tasks:

- Create compatibility views or read models where necessary.
- Backfill new tables from existing tables only after validation.
- Validate record counts and checksums where practical.
- Preserve old reads until new reads are proven.
- Preserve backup/restore coverage throughout transition.

## Phase 9 - Physical Validation

Validation must include:

- Migration syntax tests.
- Migration contract tests.
- RLS tests.
- Tenant isolation tests.
- Foreign key and constraint tests.
- Index existence tests.
- Backup/restore dry-run.
- JSON Master validation.
- End-to-end editorial pipeline smoke test.
- Publishing/preflight/distribution smoke test.

## Blockers Before Broad Physical Redesign

- Runtime-to-PostgreSQL migration phases are not yet approved.
- `Asset` physical strategy is not finalized.
- `OriginalWork` and `SourceEdition` physical strategy is not finalized.
- Shared audit/read model strategy is not finalized.
- Table renaming compatibility strategy is not justified or approved.
- Full Phase 2-7 migration testing plan is not yet implemented.

## Current Recommendation

Do not implement schema changes from this documentation phase.

Keep existing PostgreSQL migrations intact.

Use Chapter 6 as the required standard for all future database work.

Chapter 7 - Integrations and AI Agent Architecture is now documented in
`docs/ARCHITECTURE_CHAPTER_7.md`.

Chapter 8 - Workflow Engine and Editorial Process Architecture is now
documented in `docs/ARCHITECTURE_CHAPTER_8.md`.

Chapter 9 - Security, Identity, and Governance Architecture is now documented
in `docs/ARCHITECTURE_CHAPTER_9.md`.

Chapter 10 - Integration and Interoperability Architecture is now documented
in `docs/ARCHITECTURE_CHAPTER_10.md`.

Proceed next with Chapter 11 - Frontend and Design System Architecture.
