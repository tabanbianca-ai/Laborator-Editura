# Physical Database Baseline

Status: Baseline audit for Chapter 6 - Physical Data Model and Database
Standards.

Scope: Documentation only. This file does not create, modify, rename, or drop
database objects.

## Current Database Implementation

The repository currently contains two persistence layers:

1. PostgreSQL migrations for the validated MVP/core database foundation.
2. Runtime database table registry and deterministic backup/restore support
   for broader Phase 2-7 backend foundations.

The official physical database engine for future implementation is PostgreSQL.
Runtime persistence remains an implementation foundation that must be migrated
incrementally only through approved physical schema work.

## PostgreSQL Migration Inventory

Current migration directory:

- `packages/db/migrations`.

Current migration files:

| Migration | Purpose |
| --- | --- |
| `0000_mvp_foundation_v1.sql` | Organizations, users, roles, sessions, projects, documents, segments, translations, export artifacts, shared audit, RLS, and `has_role()`. |
| `0001_translation_memory_v1.sql` | Translation Memory entries, fuzzy matching support, audit, RLS, and trigram index. |
| `0002_terminology_glossary_v1.sql` | Terminology terms, glossary rules, term search, audit, RLS, and trigram index. |
| `0003_qa_engine_v1.sql` | QA reports, QA issues, score constraints, audit, and RLS. |
| `0004_semantic_fidelity_v1.sql` | Semantic Fidelity reports, issues, risk levels, audit, and RLS. |
| `0005_workflow_engine_v1.sql` | Workflow states, workflow transitions, approval/export constraints, audit, and RLS. |
| `0006_terminology_governance_v2.sql` | Terminology governance fields, quality constraints, rejected terminology support, and terminology blocker indexes. |
| `0007_founder_protection_v1.sql` | Founder protection, founder ownership transfers, expiration, unique pending transfer constraint, and RLS. |
| `0008_security_hardening_phase_1.sql` | Login attempts, security events, session expiration metadata, and security indexes. |

## Current PostgreSQL Tables

The SQL migrations currently define or extend the following tables:

- `organizations`.
- `users`.
- `user_roles`.
- `auth_sessions`.
- `auth_login_attempts`.
- `auth_security_events`.
- `projects`.
- `documents`.
- `document_segments`.
- `segment_translations`.
- `export_artifacts`.
- `foundation_audit_events`.
- `translation_memory_entries`.
- `translation_memory_audit_events`.
- `terminology_terms`.
- `terminology_audit_events`.
- `qa_reports`.
- `qa_issues`.
- `qa_audit_events`.
- `semantic_fidelity_reports`.
- `semantic_fidelity_issues`.
- `semantic_fidelity_audit_events`.
- `workflow_states`.
- `workflow_transitions`.
- `workflow_audit_events`.
- `organization_founder_protection`.
- `founder_ownership_transfers`.

## Current Runtime Database Table Registry

The runtime database table registry in `packages/db/src/runtime-database.ts`
contains many additional tables used by Phase 2-7 backend foundations.

These include, among others:

- Gateway and integrations.
- Observability.
- Security governance.
- Backup governance.
- AI governance.
- Policy engine.
- Enterprise administration.
- Marketplace.
- Workspace.
- Launch essentials.
- Rights & Provenance.
- Project dossiers.
- Lexicographic Intelligence.
- Editorial decisions.
- Layout and publishing.
- Media localization.
- Multimedia.
- Platform engineering.
- Commerce.
- Library.
- Author Studio.
- Research.
- Collaboration and community.
- Public Portal.
- Scheduling.

Physical PostgreSQL migrations do not yet cover all of these runtime table
names. This is a documented baseline gap, not a request to implement migrations
in this phase.

## PostgreSQL Capabilities Currently Used

Current migrations use:

- `pgcrypto` for UUID generation.
- `pg_trgm` for fuzzy matching in Translation Memory and Terminology.
- PostgreSQL enum types.
- `uuid` primary keys.
- `timestamptz` timestamps.
- `jsonb` metadata and snapshots.
- Generated columns for normalized text.
- `CHECK` constraints.
- `UNIQUE` constraints and partial unique indexes.
- Explicit foreign keys in core MVP tables.
- Row Level Security.
- Security-definer helper functions such as `has_role()`.

## Current Security Model in Database

Current physical migrations include:

- Tenant context through `app.current_user_id`.
- Tenant context through `app.current_organization_id`.
- `has_role(role_name text)` role checks.
- RLS enabled and forced on core migrated tables.
- Separate select/insert/update policies for foundation, Translation Memory,
  Terminology, QA, Semantic Fidelity, Workflow, and Founder Protection.

This aligns with the server-derived identity model, but future physical
migrations must continue to avoid trust in client-provided identity.

## Current Index Patterns

Current migrations define lookup indexes for:

- Tenant and status lookup.
- Project/document/segment lookup.
- Time-ordered audit lookup.
- Fuzzy normalized source text lookup with `gin_trgm_ops`.
- Terminology normalized text lookup.
- Workflow unique state by document or segment.
- Founder ownership one pending transfer.
- Session expiration.
- Terminology blocker detection.

These are consistent with the current operational MVP but require a broader
Chapter 6 index strategy before expanding PostgreSQL coverage to all modules.

## Current Constraint Patterns

Current migrations include constraints for:

- Primary keys.
- Unique email.
- Unique user role per organization.
- Unique segment order per document.
- Confidence score range.
- QA and Semantic Fidelity score ranges.
- Report scope target validity.
- Approval field requirements.
- Resolution field requirements.
- Workflow scope target validity.
- Workflow blocked reason requirement.
- Founder transfer status and one active pending transfer.
- Terminology quality level and validation status values.

Gaps remain for consistent `version`, `updated_by`, deletion strategy fields,
and logical aggregate ownership across all future physical tables.

## Baseline Assessment

Current physical PostgreSQL implementation is strong for the MVP/core workflow:

```text
Auth -> Project -> Document -> Segment -> Translation
  -> Translation Memory -> Terminology -> QA
  -> Semantic Fidelity -> Workflow -> Export
```

The broader platform now has a logical model that exceeds the current
PostgreSQL migration coverage.

Chapter 6 therefore establishes the rules for gradually moving runtime-backed
or metadata-only foundations into PostgreSQL without breaking validated
behavior.

## Non-Goals

- Do not rename existing tables now.
- Do not create missing module migrations now.
- Do not convert runtime database tables to PostgreSQL now.
- Do not introduce destructive schema changes.
- Do not change APIs or application logic.
- Do not modify Docker or staging configuration.
