# Physical Database Gap Analysis

Status: Baseline comparison between current repository database structures and
Chapter 6 standards.

Scope: Documentation only. No schema change is authorized by this analysis.

## Summary

The current PostgreSQL migrations provide a strong MVP/core physical
foundation for authentication, projects, documents, segments, translations,
Translation Memory, Terminology, QA, Semantic Fidelity, Workflow, Founder
Protection, and Security Hardening.

The main physical gap is coverage: many Phase 2-7 backend foundations are
implemented through the runtime database registry and are not yet represented
by PostgreSQL migrations.

The second gap is convention alignment: Chapter 6 establishes singular table
names for new canonical physical designs, while current validated migrations
use plural table names. Existing names must remain stable until a future
compatibility migration is explicitly approved.

## Standards Compliance Matrix

| Standard area | Current state | Assessment |
| --- | --- | --- |
| PostgreSQL engine | SQL migrations target PostgreSQL and use PostgreSQL extensions/features. | Compliant. |
| Versioned migrations | Migrations are numbered and descriptive from `0000` to `0008`. | Compliant baseline. |
| Primary keys | Current tables use UUID primary keys with `gen_random_uuid()`. | Compliant. |
| Foreign keys | Core foundation tables use explicit FKs; some later module tables use text IDs or soft references. | Partially compliant. |
| Naming | English and `snake_case`; existing tables are plural. | Partially compliant with legacy exception. |
| Constraints | Strong use of `CHECK`, `UNIQUE`, score ranges, scope checks, and status field checks. | Strong for current migrated modules. |
| Indexes | Lookup, unique, partial, and trigram indexes exist for MVP workflows. | Strong baseline. |
| RLS | RLS enabled and forced on migrated tenant-scoped tables. | Strong baseline. |
| Audit | Module-specific audit tables exist for migrated modules. | Strong baseline; shared audit conventions need future alignment. |
| Versioning | Library/versioning concepts exist in runtime, not core PostgreSQL migrations. | Partial physical coverage. |
| Deletion strategy | Some status/archive/revoked/expires fields exist; table-by-table deletion strategy is not consistently documented in SQL. | Partial. |
| Runtime persistence coverage | Runtime table registry includes many tables not covered by SQL migrations. | Major planned alignment gap. |
| Backup/restore | Runtime backup/restore exists; physical PostgreSQL backup standards need future operational mapping. | Partial. |

## Current Strengths

- MVP data model has explicit UUID primary keys.
- Core project/document/segment/translation relationships have explicit
  foreign keys.
- RLS policies are present for migrated tenant-scoped core tables.
- `has_role()` and per-request server-side settings support the existing
  security model.
- Translation Memory fuzzy matching uses `pg_trgm`.
- Terminology uses normalized terms and trigram search.
- QA and Semantic Fidelity reports enforce score ranges and valid target
  scopes.
- Workflow enforces unique document/segment workflow state and approval/export
  field requirements.
- Founder Protection enforces one pending transfer per organization.
- Security hardening adds login attempt and session expiration indexes.

## Physical Gaps

### 1. Plural Legacy Table Names

Current tables use names such as:

- `organizations`.
- `users`.
- `projects`.
- `documents`.

Chapter 6 establishes singular names for new canonical physical designs.

Resolution:

- Treat current plural names as legacy validated names.
- Do not rename now.
- Future canonical redesign may use compatibility views, aliases, or explicit
  migration mapping if a rename is justified.

### 2. Incomplete PostgreSQL Coverage for Phase 2-7 Modules

Runtime database registry includes tables for:

- Gateway.
- Integrations.
- Observability.
- Security governance.
- Backup governance.
- AI governance.
- Policy.
- Admin.
- Marketplace.
- Workspace.
- Rights.
- Lexicographic Intelligence.
- Publishing.
- Media.
- Commerce.
- Library.
- Author Studio.
- Research.
- Collaboration.
- Public Portal.
- Scheduling.

Most of these do not yet have PostgreSQL migrations.

Resolution:

- Migrate one bounded aggregate at a time after Chapter 6 is accepted and an
  implementation phase is approved.

### 3. Aggregate Root Mapping Not Yet Physical

Chapter 5 defines aggregate roots such as:

- `TranslationProject`.
- `Review`.
- `OriginalWork`.
- `Asset`.
- `AITask`.
- `Notification`.
- `AuditRecord`.
- `ConfigurationRecord`.

Current physical SQL does not yet define these as canonical physical table
families.

Resolution:

- Chapter 6 physical designs must propose table families for these aggregates
  before implementation.

### 4. Versioning Fields Not Consistent Across Physical Tables

Current migrated tables commonly include:

- `created_at`.
- `updated_at`.
- `metadata`.

They do not consistently include:

- `version`.
- `updated_by`.
- content version references.

Resolution:

- Future migrations should add versioning through compatibility-safe,
  aggregate-by-aggregate changes.

### 5. Deletion Strategy Not Explicit Per Table

Current schema uses:

- `status`.
- `archived_at`.
- `revoked_at`.
- `expires_at`.

Not every table documents whether it uses Soft Delete, Archive, or Permanent
Delete.

Resolution:

- Future table design must include a deletion strategy matrix.
- Existing tables should receive documentation before schema alteration.

### 6. Foreign Key Gaps in Some Specialized Tables

Some migrated module tables use `text` IDs for segment references or optional
soft references to external module records.

Examples:

- `qa_reports.segment_id text`.
- `semantic_fidelity_reports.segment_id text`.
- `workflow_states.segment_id text`.

Resolution:

- Preserve current behavior.
- Future physical alignment should decide whether these become UUID foreign
  keys, remain polymorphic references, or use a typed resource reference
  pattern.

### 7. Central Reference Data Strategy Not Finalized

PostgreSQL enum types exist for many stable values. The platform also has many
TypeScript union types and configuration-driven values.

Resolution:

- Future physical model must decide enum vs reference table per value family.
- Values requiring localization or governance should move to reference tables
  or centralized configuration.

### 8. Shared Audit Model Not Physical Yet

Current audit is module-specific.

Resolution:

- Preserve module-specific audit tables.
- Define shared audit metadata conventions or read model before consolidation.

## Risks If Physical Work Starts Too Early

- Duplicated publication identity across Library, Publishing, Public Portal,
  Commerce, and Export.
- Fragmented asset storage and file metadata.
- Repeated source authority/provenance fields.
- Unclear review/correction proposal ownership.
- Inconsistent role/membership/subscription/Need-to-Know enforcement.
- Hard-to-reverse table renames if legacy names are changed prematurely.

## Physical Migration Readiness

Ready now:

- Standards for future PostgreSQL implementation.
- Current MVP migration audit.
- Initial index strategy.
- Migration strategy.

Not ready without a dedicated implementation phase:

- Full Phase 2-7 PostgreSQL schema.
- Runtime-to-PostgreSQL data migration.
- Table renames.
- Shared asset registry.
- Shared audit table consolidation.
- Physical `OriginalWork`, `SourceEdition`, `AITask`, and `Review` roots.

## Recommendation

Accept Chapter 6 as the physical database standard first.

Then implement future PostgreSQL alignment in small, additive migration phases.
Do not perform broad database redesign or table renames during launch
stabilization.
