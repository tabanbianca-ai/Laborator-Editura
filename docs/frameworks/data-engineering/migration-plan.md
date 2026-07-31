# Data Engineering Migration Plan

## Purpose

This plan defines how Laborator Editura should converge from the current
documented and runtime baseline toward full Framework 03 compliance.

## Migration Principles

- Preserve validated behavior.
- Avoid broad schema rewrites.
- Use additive implementation phases.
- Do not rename validated tables without compatibility planning.
- Preserve tenant isolation.
- Preserve audit and lineage.
- Preserve backup and restore compatibility.
- Preserve Human Final Authority.

## Phase 0 - Framework Baseline

Status: Complete when the Framework 03 documents are present.

Deliverables:

- `docs/frameworks/data-engineering/overview.md`.
- `docs/frameworks/data-engineering/canonical-models.md`.
- `docs/frameworks/data-engineering/data-modeling-standards.md`.
- `docs/frameworks/data-engineering/data-catalog.md`.
- `docs/frameworks/data-engineering/data-quality.md`.
- `docs/frameworks/data-engineering/data-lineage.md`.
- `docs/frameworks/data-engineering/data-versioning.md`.
- `docs/frameworks/data-engineering/data-migration.md`.
- `docs/frameworks/data-engineering/compliance-audit.md`.
- `docs/frameworks/data-engineering/migration-plan.md`.

## Phase 1 - Data Asset Inventory

Goal:

- Create a complete inventory of data assets.

Actions:

- Extract runtime table list from `packages/db/src/runtime-database.ts`.
- Inventory PostgreSQL migrations.
- Inventory JSON Master structures.
- Inventory module domain models.
- Inventory API contracts and events.
- Inventory AI data flows.

Validation:

- Every data asset has an owner candidate.
- Every data asset has a catalog entry draft.

## Phase 2 - Canonical Model Mapping

Goal:

- Map every data asset to a canonical model and aggregate owner.

Actions:

- Link runtime tables to canonical models.
- Link module types to canonical models.
- Identify duplicate or overlapping entities.
- Define mapping records for legacy or module-specific identifiers.

Validation:

- No unmapped critical data asset remains.
- Duplicate concepts are documented with migration strategy.

## Phase 3 - Data Catalog Foundation

Goal:

- Create a machine-readable Data Catalog foundation.

Actions:

- Define catalog entry schema.
- Seed catalog from runtime tables and documentation.
- Add sensitivity and classification metadata.
- Add owner and steward metadata.
- Link catalog entries to schemas, retention, quality rules, and lineage.

Validation:

- Catalog can answer owner, schema, sensitivity, retention, and consumer
  questions for core data assets.

## Phase 4 - Quality and Validation Alignment

Goal:

- Standardize quality reporting across domain engines.

Actions:

- Map QA, Semantic Fidelity, Terminology Governance, Rights warnings,
  Workflow gates, Publishing preflight, JSON Master validation, and backup
  validation to shared quality dimensions.
- Define severity mapping.
- Link quality rules to catalog entries.

Validation:

- Cross-domain quality report can be produced in a future implementation
  phase.

## Phase 5 - Lineage Foundation

Goal:

- Standardize lineage events and references.

Actions:

- Define lineage event schema.
- Map audit, workflow, version, export, rights, AI, and backup records to
  lineage concepts.
- Add lineage requirements to new data flows.

Validation:

- Critical editorial production path is reconstructable from source to
  publication artifact.

## Phase 6 - Schema and Version Registry

Goal:

- Make schema evolution visible and governed.

Actions:

- Define schema registry model.
- Register JSON Master schemas.
- Register runtime table families.
- Register event schemas.
- Register API data contracts.

Validation:

- Consumers can identify schema version and compatibility state.

## Phase 7 - Runtime Persistence Convergence

Goal:

- Prepare runtime persistence for future PostgreSQL convergence where needed.

Actions:

- Identify runtime-only data that must become relational.
- Define additive physical table plans.
- Add compatibility repository strategy.
- Define backfill and validation path.
- Preserve backup/restore compatibility.

Validation:

- No runtime-to-PostgreSQL migration proceeds without approved plan, tests,
  backup, rollback, and tenant isolation validation.

## Phase 8 - Governance Reporting

Goal:

- Add ongoing visibility into data governance health.

Actions:

- Report catalog completeness.
- Report lineage coverage.
- Report quality issues.
- Report migration readiness.
- Report schema version compliance.
- Report retention compliance.
- Report exceptions.

Validation:

- Release readiness includes Framework 03 status.

## Prioritized Roadmap

1. Complete machine-readable inventory.
2. Complete canonical model mapping.
3. Build Data Catalog foundation.
4. Standardize quality rule metadata.
5. Standardize lineage event schema.
6. Add schema registry foundation.
7. Plan runtime-to-PostgreSQL convergence.
8. Add governance reporting.

## Non-Goals

This migration plan does not authorize:

- Immediate schema changes.
- Immediate runtime repository changes.
- Immediate API changes.
- Immediate frontend changes.
- Table renaming.
- Data deletion.
- Docker or staging changes.

Implementation must be explicitly approved in future phases.
