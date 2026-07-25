# Database Migration Strategy

Status: Official migration strategy baseline for Chapter 6.

Scope: PostgreSQL migration governance. This document does not execute
migrations.

## Migration Authority

All database schema evolution must occur through documented, versioned
migrations.

Manual direct schema changes are not allowed in controlled environments.

## Current Migration System

Current migrations live in:

- `packages/db/migrations`.

Current migration format:

```text
0000_mvp_foundation_v1.sql
0001_translation_memory_v1.sql
0002_terminology_glossary_v1.sql
```

This format remains accepted.

## Migration Requirements

Every migration must be:

- Chronologically ordered.
- Purpose-specific.
- Documented with comments.
- Idempotent where practical.
- Atomic where possible.
- Tested.
- Safe for existing data.
- Compatible with backup/restore.
- Reviewed for RLS and tenant isolation impact.

## Migration Categories

### Additive Migration

Adds new tables, columns, indexes, policies, or constraints without changing
existing behavior.

Preferred default for platform evolution.

### Compatibility Migration

Introduces new structures while preserving old reads and writes.

Use when:

- Renaming physical tables.
- Introducing canonical aggregate tables.
- Moving runtime-backed data into PostgreSQL.
- Creating shared asset or publication mappings.

### Data Backfill Migration

Populates new structures from existing data.

Rules:

- Must be repeat-safe or protected by explicit checks.
- Must log or audit data transformation where required.
- Must include validation queries.
- Must not remove old data until compatibility is proven.

### Constraint Tightening Migration

Adds `NOT NULL`, `UNIQUE`, `CHECK`, or foreign key constraints to existing
tables.

Rules:

- Add nullable or non-validating structures first when needed.
- Backfill and validate data.
- Add or validate constraints after data is clean.

### Forward-Only Migration

Allowed when rollback is unsafe or impossible.

Rules:

- Must be explicitly documented as forward-only.
- Must include backup prerequisite.
- Must include operational rollback plan.

## Migration Lifecycle

1. Define logical requirement from Chapters 4 and 5.
2. Confirm physical standard from Chapter 6.
3. Write migration.
4. Add migration contract test.
5. Validate backup/restore compatibility.
6. Validate RLS and tenant isolation.
7. Validate indexes and constraints.
8. Deploy to staging.
9. Run smoke test.
10. Promote only after review.

## Rollback Rules

Rollback must not:

- Delete audit history.
- Delete published versions.
- Delete provenance.
- Delete rights history.
- Delete official publication snapshots.
- Break backup restore.
- Break tenant isolation.

Rollback approaches:

- Reversible SQL where safe.
- Disable new path while preserving data.
- Compatibility read fallback.
- Restore from backup for severe failures.

## RLS Migration Rules

Every tenant-scoped table migration must include:

- `organization_id` where applicable.
- `ENABLE ROW LEVEL SECURITY`.
- `FORCE ROW LEVEL SECURITY` where applicable.
- Select policy.
- Insert policy.
- Update policy when mutation is allowed.
- Delete policy only if deletion is explicitly allowed.

RLS must use server-derived context, not client-supplied identity.

## Audit Migration Rules

Every new aggregate or mutating table family must include audit coverage or
map to an existing audit aggregate.

Audit migration must define:

- Action enum or reference action.
- Actor reference.
- Resource reference.
- Before-state and after-state strategy.
- Retention strategy.

## Versioning Migration Rules

Editorial or publication content migrations must define:

- Current version storage.
- Historical version storage.
- Restoration strategy.
- Immutable publication version rules.

## Runtime Persistence to PostgreSQL Migration

Many Phase 2-7 foundations currently exist in runtime persistence.

Migration to PostgreSQL must be incremental:

1. Define physical table family.
2. Add additive PostgreSQL tables.
3. Write compatibility repository path if needed.
4. Backfill from runtime data only in an approved migration phase.
5. Validate backup/restore.
6. Switch reads after test coverage is green.
7. Switch writes after compatibility is proven.
8. Preserve old data until retirement is approved.

## Naming Cleanup Migration

Existing plural table names are legacy validated names.

Renaming to singular canonical names is not required for launch and must not be
performed unless:

- There is a clear benefit.
- Compatibility views or aliases are defined.
- APIs remain stable.
- Backup/restore is validated.
- Rollback is documented.

## Required Migration Tests

Every migration should include tests for:

- Syntax validity.
- Table creation.
- Primary key existence.
- Required foreign keys.
- Required indexes.
- Constraints.
- RLS enabled where required.
- Backup/restore inclusion where relevant.
- Tenant isolation.

## Deployment Safety

Before applying migrations in staging or production:

- Confirm backup availability.
- Confirm rollback plan.
- Run migration tests.
- Run typecheck/build where schema-generated code is affected.
- Run end-to-end smoke test after migration.

## Non-Goals

- Do not create physical migrations from Chapter 6 alone.
- Do not convert runtime persistence without a dedicated implementation phase.
- Do not rename validated tables for cosmetic reasons.
- Do not perform destructive changes without explicit project owner approval.
