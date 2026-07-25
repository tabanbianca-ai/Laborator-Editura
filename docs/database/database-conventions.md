# Database Conventions

Status: Official physical database convention baseline for Chapter 6.

Scope: PostgreSQL physical implementation standards. This document does not
change existing schema.

## Database Engine

The primary relational database engine is PostgreSQL.

PostgreSQL-specific features must be documented when used.

Approved PostgreSQL-specific features:

- `pgcrypto`.
- `pg_trgm`.
- Row Level Security.
- `jsonb`.
- Generated columns.
- Enum types.
- Partial indexes.

## Naming

### New Canonical Table Names

New canonical physical table names must use:

- English.
- Singular nouns.
- `snake_case`.

Examples:

- `user`.
- `workspace`.
- `project`.
- `publication`.
- `translation_segment`.
- `library_item`.
- `ai_task`.

### Existing Legacy Table Names

Existing validated tables currently use plural names such as:

- `organizations`.
- `users`.
- `projects`.
- `documents`.
- `translation_memory_entries`.

These names must remain unchanged until an approved compatibility migration is
defined. Existing validated production behavior takes priority over naming
cleanup.

### Column Names

Columns must use:

- English.
- `snake_case`.
- Descriptive names.
- No ambiguous abbreviations.

Required common columns for new mutable tenant-scoped tables:

- `id`.
- `organization_id`.
- `status`.
- `version`.
- `created_by`.
- `created_at`.
- `updated_by`.
- `updated_at`.
- `metadata`.

Documented exceptions are allowed for immutable audit tables and simple
associative tables.

## Primary Keys

Default primary key:

```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
```

Primary keys must not contain business meaning.

## Foreign Keys

Foreign keys must be explicit.

Required relationships use `NOT NULL`.

Optional relationships may be nullable only when the logical model allows an
optional relationship.

`ON DELETE` behavior must match the deletion strategy:

- `CASCADE` only for true composition where child records have no independent
  audit, rights, publication, or versioning obligation.
- `SET NULL` when the child record must survive but the parent reference may be
  removed.
- `RESTRICT` or no cascade when history, rights, audit, or published records
  must be preserved.

## Tenant Isolation

Tenant-scoped tables must include:

- `organization_id`.
- RLS enabled.
- RLS forced where applicable.
- Policies based on server-derived tenant and user context.

RLS must not depend on client-provided user ID, organization ID, or role
headers.

## Timestamps

Use:

- `timestamptz`.
- `created_at timestamptz NOT NULL DEFAULT now()`.
- `updated_at timestamptz NOT NULL DEFAULT now()` for mutable tables.

Mutable tables should update `updated_at` through application logic or a
documented database trigger.

## Metadata

Use `jsonb` for:

- Optional module-specific metadata.
- Audit before/after snapshots.
- External provider metadata.
- Future-compatible extension fields.

`jsonb` must not hide required domain fields that need constraints, indexes,
or ownership rules.

## Enumerations and Reference Data

Use PostgreSQL enums only for stable, low-change physical state values.

Use reference tables when values require:

- Localization.
- User-facing labels.
- Ordering.
- Activation/deactivation.
- Approval.
- Governance.
- Source authority.

Application constants must match database authority.

## Audit Tables

Audit tables must include:

- `id`.
- `organization_id`.
- `actor_id` or a documented actor reference.
- `action`.
- Resource reference fields.
- `before_state` where appropriate.
- `after_state` where appropriate.
- `created_at`.

Audit tables must not be permanently deleted.

## Versioning Tables

Versioning tables must include:

- `id`.
- `organization_id`.
- Parent resource reference.
- `version_number` or equivalent.
- `change_summary`.
- `created_by`.
- `created_at`.
- Immutable historical snapshot or references where required.

Versioning is separate from audit.

## Deletion and Retention

Every table must document a deletion strategy:

- Soft Delete.
- Archive.
- Permanent Delete.

Soft delete fields may include:

- `deleted_at`.
- `deleted_by`.

Archive fields may include:

- `archived_at`.
- `archived_by`.

Retention fields may include:

- `expires_at`.
- `retention_until`.

Permanent delete is not allowed for records with audit, rights, provenance,
publication, validated terminology, backup, or preservation obligations.

## Security Data

Sensitive values must be:

- Hashed.
- Encrypted.
- Tokenized.
- Or stored only as metadata references to external secret storage.

Secrets must never be stored or logged in clear text.

## Migration Files

Migration filenames must be chronologically ordered:

```text
0000_mvp_foundation_v1.sql
0001_translation_memory_v1.sql
```

Each migration must be:

- Purpose-specific.
- Documented.
- Idempotent where practical.
- Tested.
- Compatible with rollback or documented as forward-only.

## Compatibility Rule

When these standards conflict with already validated and deployed schema,
validated behavior remains intact until an explicit migration plan is approved.
