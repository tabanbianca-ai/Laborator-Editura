# Laborator Editura Official Platform Architecture

Chapter 6 - Physical Data Model and Database Standards.

Official architecture document.

Version: 1.0.

## 1. Purpose

This document defines the official standards for the physical database
implementation of the Laborator Editura platform.

Objectives:

- Transform the logical model into a physical database structure.
- Define implementation conventions.
- Ensure consistency and predictable performance.
- Support maintenance and long-term platform evolution.
- Keep database evolution compatible with incremental migrations.

This document does not define the complete schema of every module. It defines
the mandatory standards that every physical schema implementation must follow.

## 2. General Principles

The database implementation must respect:

- Single Source of Truth.
- Referential integrity.
- Normalization to the level required by the domain.
- Predictable performance.
- Auditability.
- Versioning.
- Extensibility.
- Compatibility with incremental migrations.
- Tenant isolation.
- Backup and restore compatibility.

## 3. Database Engine

The primary relational database engine for the platform is:

- PostgreSQL.

PostgreSQL-specific functionality is allowed when it serves a clear platform
requirement, but it must be documented and isolated so that future migration or
replacement analysis remains possible.

Current approved PostgreSQL-specific capabilities include:

- `uuid` primary keys with `gen_random_uuid()`.
- `pgcrypto`.
- `pg_trgm` for fuzzy text matching where justified.
- Row Level Security.
- `jsonb` for metadata, snapshots, and flexible extension data.
- Generated columns where they preserve consistency.
- Enumerated types where fixed database-level values are required.

## 4. Naming Conventions

### Tables

Physical table names must be:

- English.
- Singular nouns for new canonical physical designs.
- `snake_case`.
- Clear and domain-specific.

Examples:

- `user`.
- `workspace`.
- `project`.
- `publication`.
- `translation_segment`.
- `library_item`.
- `ai_task`.

Existing validated tables that use plural names are treated as legacy physical
names and must not be renamed without an approved compatibility migration.

### Columns

Column names must be:

- English.
- `snake_case`.
- Descriptive.
- Free from ambiguous abbreviations.

Examples:

- `created_at`.
- `updated_at`.
- `created_by`.
- `status`.
- `original_language`.

### Constraints, Indexes, and Policies

Names must follow stable, descriptive patterns:

- Primary key: `{table_name}_pkey`.
- Foreign key: `{table_name}_{column_name}_fkey`.
- Unique constraint: `{table_name}_{column_name_or_purpose}_unique`.
- Check constraint: `{table_name}_{purpose}_check`.
- Lookup index: `{table_name}_{purpose}_idx`.
- Row Level Security policy: `{table_name}_{operation}_{purpose}_policy`.

Existing names may remain if they are already validated and deployed.

## 5. Primary Keys

Every table must have a primary key that is:

- Stable.
- Non-reusable.
- Independent from business logic.
- Unique across the table.

Default standard:

- `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`.

Business identifiers such as ISBN, email, source references, edition numbers,
or external provider IDs must not replace the technical primary key.

## 6. Foreign Keys

All physical relationships must use explicit foreign keys unless an approved
Architecture Decision Record documents an exception.

Foreign key rules:

- Cross-table ownership must be explicit.
- Required relationships must be `NOT NULL`.
- Optional relationships may be nullable, but the domain reason must be clear.
- `ON DELETE` behavior must match the logical deletion strategy.
- Cascading deletes are allowed only when the child cannot exist without the
  parent and no audit, rights, publication, version, or preservation obligation
  is violated.

Implicit relationships based only on naming conventions are not allowed in new
physical design.

## 7. Indexing

Every table must be reviewed for:

- Foreign key lookups.
- Common searches.
- Sorts.
- Filters.
- Tenant isolation filters.
- Uniqueness.
- Time-ordered history access.

Indexes must be documented and justified. Indexes must not be added by habit.

Baseline index patterns:

- Tenant lookups: `(organization_id, ...)`.
- Project lookups: `(organization_id, project_id, ...)`.
- Document lookups: `(organization_id, project_id, document_id, ...)`.
- Audit history: `(organization_id, resource_type, resource_id, created_at DESC)`.
- Workflow state lookup: `(organization_id, scope, status, target_id)`.
- Text similarity only where fuzzy search is required and measured.

## 8. Constraints

The physical schema must explicitly define:

- `NOT NULL`.
- `UNIQUE`.
- `CHECK`.
- `FOREIGN KEY`.

Critical domain rules must be reflected in the database when they can be
expressed safely at the physical level.

Examples:

- Score ranges.
- Allowed status values.
- Required approval fields when status is approved.
- Required resolution fields when status is resolved.
- One active workflow state per target.
- One active pending founder transfer per organization.
- Tenant-scoped uniqueness where needed.

## 9. Migrations

Database schema evolves only through versioned migrations.

Migration rules:

- Atomic.
- Chronologically ordered.
- Documented.
- Idempotent where practical.
- Reversible where possible.
- Safe for existing data.
- Compatible with backup and restore.
- Tested before deployment.

Manual direct schema changes are not allowed in controlled environments.

Migration filenames must be ordered and descriptive:

```text
0000_mvp_foundation_v1.sql
0001_translation_memory_v1.sql
0002_terminology_glossary_v1.sql
```

## 10. Audit and Versioning

Entities that require history must support:

- Audit.
- Versioning.
- Traceability.

Physical implementation must reuse the common infrastructure defined by the
previous architecture chapters.

Audit records must capture:

- Organization.
- Actor.
- Action.
- Resource type.
- Resource ID.
- Timestamp.
- Before-state reference or snapshot where appropriate.
- After-state reference or snapshot where appropriate.

Versioning records must capture:

- Version number.
- Parent or previous version where applicable.
- Change summary.
- Created by.
- Created at.
- Immutable historical state where required.

Audit is not a substitute for versioning.

## 11. Data Deletion

The physical schema must document one deletion strategy per table:

- Soft Delete.
- Archive.
- Permanent Delete.

Permanent deletion is prohibited for:

- Audit records.
- Published versions.
- Provenance records.
- Rights history.
- Official publication snapshots.
- Validated terminology history.
- Backup and preservation records.

`deleted_at`, `archived_at`, `revoked_at`, `expires_at`, or status-based
archival must be used according to the logical data model.

## 12. Performance

Codex must avoid:

- Redundant queries.
- Unnecessary relationships.
- Premature denormalization.
- Excessive indexes.
- Unbounded queries on tenant-scoped tables.
- Business logic hidden inside database functions unless documented.

Optimization must be introduced based on measurements, not assumptions.

Performance-sensitive changes must include:

- Query pattern documentation.
- Index justification.
- Expected cardinality.
- Rollback plan.

## 13. Data Security

The physical data model must support:

- Encryption or hashing for sensitive data where applicable.
- Server-derived identity and tenant context.
- Row Level Security for tenant-scoped tables.
- Separation between environments.
- Backup and restore.
- Retention policies.
- Secret hygiene.
- Audit for sensitive operations.

Secrets must never be logged or stored in clear text.

## 14. Reference Data

Fixed values such as statuses, types, categories, and policy states must be
managed through centralized mechanisms.

Allowed mechanisms:

- PostgreSQL enum types for stable database-level states.
- Reference tables for values that require labels, localization, descriptions,
  ordering, activation, or governance.
- Shared TypeScript constants for compile-time API typing when backed by
  database or configuration authority.

Hardcoded divergent values in application code and database schema are not
allowed.

## 15. Compatibility with Modules

The physical schema must support all modules defined by the module
architecture without major restructuring.

The physical model must preserve compatibility with:

- Auth.
- Organization and Workspace.
- Projects.
- Author Studio.
- Documents.
- Segments.
- Translations.
- Translation Memory.
- Terminology.
- Lexicographic Intelligence.
- QA.
- Semantic Fidelity.
- Workflow.
- Library.
- Rights & Provenance.
- Publishing.
- Export.
- Public Portal.
- Commerce.
- Media and multimedia.
- AI Governance.
- Audit.
- Backup and restore.

Validated Phase 7 Step 16 behavior must be preserved.

## 16. Acceptance Criteria

The physical implementation is compliant when:

- It respects the logical data model.
- It respects naming conventions.
- It uses explicit keys and constraints.
- It is fully migration-driven.
- It is documented.
- It supports incremental evolution.
- It preserves tenant isolation.
- It preserves audit and version history.
- It supports backup and restore.
- It avoids destructive schema changes without explicit approval.

## Physical Database Baseline Audit

Codex must perform a Physical Database Baseline Audit.

Objectives:

1. Inventory the current database structure.
2. Compare it with the approved logical data model.
3. Identify deviations from the physical standards.
4. Verify keys, constraints, indexes, and Row Level Security policies.
5. Analyze existing migrations.
6. Propose an incremental alignment plan.

Required deliverables:

- `docs/database/physical-data-model.md`.
- `docs/database/database-conventions.md`.
- `docs/database/index-strategy.md`.
- `docs/database/migration-strategy.md`.
- `docs/database/database-gap-analysis.md`.
- `docs/database/database-migration-plan.md`.

## Mandatory Requirement for Codex

Treat this document as the official physical database implementation standard
for Laborator Editura.

Codex must inspect the current repository and database schema, compare the
implementation with the approved logical model, verify naming conventions,
primary keys, foreign keys, indexes, constraints, migrations, audit support,
versioning support, and data retention strategies, and produce a gap analysis
and incremental migration plan.

Validated functionality from Phase 7 - Step 16 must be preserved.

Destructive schema changes are not allowed unless explicitly approved.

All database evolution must occur through documented, versioned migrations.

## Recommended Next Architecture Document

Chapter 7 - Integrations and AI Agent Architecture is now documented in
`docs/ARCHITECTURE_CHAPTER_7.md`.

Chapter 8 - Workflow Engine and Editorial Process Architecture is now
documented in `docs/ARCHITECTURE_CHAPTER_8.md`.

Chapter 9 - Security, Identity, and Governance Architecture is now documented
in `docs/ARCHITECTURE_CHAPTER_9.md`.

Chapter 10 - Integration and Interoperability Architecture is now documented
in `docs/ARCHITECTURE_CHAPTER_10.md`.

Chapter 11 - Frontend and Design System Architecture is now documented in
`docs/ARCHITECTURE_CHAPTER_11.md`.

Chapter 12 - Backend and Application Services Architecture is now documented
in `docs/ARCHITECTURE_CHAPTER_12.md`.

Chapter 13 - DevOps, Infrastructure, Deployment, and Recovery Architecture is
now documented in `docs/ARCHITECTURE_CHAPTER_13.md`.

Chapter 14 - Quality Architecture and Testing Strategy is now documented in
`docs/ARCHITECTURE_CHAPTER_14.md`.

Chapter 15 - Operations, Maintenance, and Platform Evolution Architecture is
now documented in `docs/ARCHITECTURE_CHAPTER_15.md`.

The high-level architecture series is complete with Chapters 0-15. The next
recommended stage is Phase 2 - Detailed Module Specifications.
