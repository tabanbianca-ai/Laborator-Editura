# Domain Model Migration Plan

Status: Incremental conceptual migration plan.

Scope: Documentation only. This plan does not authorize physical database
changes or breaking API changes.

## Goal

Move the repository from an implementation-first entity set to a unified
conceptual domain model without disrupting validated functionality.

Validated Phase 7 Step 16 publishing, preflight, distribution, Library,
Rights, Export, Quality, Workflow, Backup, and audit functionality must be
preserved.

## Principles

- Preserve working behavior.
- Do not redesign the database during the conceptual phase.
- Do not rename runtime tables without a later approved logical and physical
  migration.
- Clarify ownership before changing persistence.
- Add compatibility layers before replacing old concepts.
- Keep public APIs stable unless an approved migration phase says otherwise.
- Use ADRs for deviations from architecture chapters.

## Phase 0 - Baseline Documentation

Status: current phase.

Tasks:

- Create Chapter 4 conceptual model.
- Create domain model baseline.
- Create domain glossary.
- Create relationship map.
- Create gap analysis.
- Create incremental migration plan.

Exit criteria:

- Documents are reviewed and accepted.
- No code or schema changes are introduced.

## Phase 1 - Conceptual Ownership Alignment

Tasks:

- Assign one functional owner to every conceptual entity.
- Mark referenced entities as references, not owned copies.
- Update module documentation to point to owner modules.
- Add ADRs for intentional overlaps.

Priority clarifications:

- Organization: Identity owns tenant identity; Administration owns admin
  metadata.
- User/Role/Permission: Identity owns canonical identity and access concepts;
  Workspace computes scoped effective access; Administration manages records.
- Publication: Library owns identity; Publishing owns release state; Export
  owns artifacts; Public Portal owns public exposure; Commerce owns commercial
  metadata.
- Asset: Storage/Asset concept must be defined before physical consolidation.

No schema changes in this phase.

## Phase 2 - Logical Domain Model

Depends on: Chapter 5 - Logical Data Model.

Tasks:

- Define aggregates.
- Define relationships and cardinalities.
- Define lifecycle state machines.
- Define integrity rules.
- Define ownership boundaries and reference semantics.
- Define conceptual-to-logical mapping.

Required aggregate candidates:

- Organization.
- User.
- Project.
- Manuscript.
- Document.
- Segment.
- Translation.
- Publication.
- Asset.
- Rights Record.
- Workflow.
- AI Execution.
- Audit Record.

No physical database design until this phase is approved.

## Phase 3 - Compatibility Mapping

Tasks:

- Map current runtime tables and TypeScript entities to logical aggregates.
- Identify backward-compatible API shapes.
- Define read models where multiple modules need joined views.
- Define migration-safe aliases for overlapping concepts.

Deliverables:

- Conceptual-to-logical mapping.
- Logical-to-runtime mapping.
- API compatibility matrix.
- Event compatibility matrix.

## Phase 4 - Physical Data Design Proposal

Tasks:

- Propose physical tables and migrations.
- Define indexes and constraints.
- Define tenant isolation rules.
- Define backup/restore changes.
- Define JSON Master export mapping.
- Define rollback plan.

Rules:

- No destructive migration.
- No loss of audit or historical versions.
- No removal of existing functionality until compatibility is proven.

## Phase 5 - Incremental Implementation

Tasks:

- Introduce new abstractions behind existing APIs.
- Add tests for compatibility.
- Migrate one bounded context at a time.
- Preserve old reads until new reads are validated.
- Audit migration actions where they affect data.

Recommended order:

1. Documentation and ownership metadata.
2. Asset conceptual mapping.
3. Publication conceptual mapping.
4. User/Role/Membership/Grant clarification.
5. Review/Correction/Decision clarification.
6. AI Task/Result clarification.
7. Original Work/Source Edition clarification.

## Phase 6 - Validation

Validation must include:

- Full test suite.
- JSON Master validation.
- Backup/restore dry-run.
- Tenant isolation tests.
- Audit continuity tests.
- End-to-end editorial pipeline smoke test.
- Publishing/preflight/distribution smoke test.

## Blockers Before Physical Migration

- Asset physical strategy is not yet approved.
- Publication identity vs publishing release vs public catalog vs commerce
  edition needs physical mapping.
- Original Work and Source Edition need physical mapping decisions.
- User/Role/Permission/Membership/Grant need physical mapping decisions.
- Chapter 6 implementation phases for physical migration are not yet
  explicitly scheduled.

## Current Recommendation

Do not implement database changes yet.

Chapter 5 - Logical Data Model and Chapter 6 - Physical Data Model and
Database Standards are now documented.

Chapter 7 - Integrations and AI Agent Architecture is now documented in
`docs/ARCHITECTURE_CHAPTER_7.md`.

Proceed next with Chapter 8 - Editorial Workflow and Process Engine
Architecture.
