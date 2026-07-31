# Data Migration

## Purpose

Data Migration governs how platform data, schemas, runtime persistence,
canonical models, integrations, and generated artifacts evolve safely.

## Migration Principles

- Versioned.
- Reversible where safe.
- Audited.
- Tested.
- Approved before controlled execution.
- Compatible with backup and restore.
- Compatible with tenant isolation.
- Compatible with Human Final Authority.
- No silent data loss.

## Current Migration Baseline

PostgreSQL migration scripts exist in:

- `packages/db/migrations`.

Runtime backup and restore scripts exist in:

- `packages/db/scripts/backup-runtime-db.mjs`.
- `packages/db/scripts/restore-runtime-db.mjs`.
- `packages/db/scripts/runtime-backup-lib.mjs`.

Migration strategy documentation exists in:

- `docs/database/migration-strategy.md`.
- `docs/database/database-migration-plan.md`.
- `docs/data/logical-migration-plan.md`.
- `docs/modules/data-governance/data-governance-migration-plan.md`.

## Migration Categories

### Additive Migration

Adds tables, columns, indexes, references, policies, or metadata without
breaking existing behavior.

### Compatibility Migration

Introduces new structures while preserving old reads and writes.

### Data Backfill Migration

Populates new structures from existing data.

### Constraint Tightening Migration

Adds or validates constraints after data is clean.

### Runtime-to-PostgreSQL Migration

Moves runtime persistence into physical PostgreSQL tables through a dedicated
approved implementation phase.

### Forward-Only Migration

Allowed only when rollback is unsafe and operational recovery is documented.

## Required Migration Lifecycle

1. Confirm canonical model owner.
2. Confirm logical aggregate.
3. Confirm physical database standard.
4. Define migration type.
5. Define data quality impact.
6. Define lineage impact.
7. Define tenant isolation impact.
8. Define audit impact.
9. Define backup and restore impact.
10. Write migration.
11. Add tests.
12. Run validation.
13. Review and approve.
14. Deploy to staging.
15. Run smoke tests.
16. Promote only after validation.

## Approval Requirements

Approval is required before:

- Destructive changes.
- Table or column renames.
- Runtime-to-PostgreSQL conversion.
- Canonical model ownership changes.
- Schema breaking changes.
- Data deletion or anonymization.
- Retention policy changes.
- Migration of audit, rights, publication, or security data.

## Migration Audit

Migration audit must preserve:

- Migration id.
- Migration version.
- Requested by.
- Approved by.
- Executed by.
- Started at.
- Completed at.
- Environment.
- Affected models.
- Affected tables.
- Affected consumers.
- Validation results.
- Rollback strategy.

## Current Gaps

- Migration metadata is not yet centrally cataloged.
- Runtime-to-PostgreSQL migration is planned but not implemented.
- Backfill audit strategy is not yet standardized across all module families.
- Schema compatibility checks are not yet automated platform-wide.

## Standardization Plan

1. Create migration metadata catalog.
2. Map every migration to canonical models and runtime tables.
3. Add migration impact analysis template.
4. Add schema compatibility validation.
5. Add runtime persistence convergence plan.
6. Add migration readiness gates to release checklists.
