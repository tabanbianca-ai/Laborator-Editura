# Database Index Strategy

Status: Official baseline index strategy for Chapter 6.

Scope: PostgreSQL index standards and current index audit. This document does
not create or remove indexes.

## Principles

Indexes must be added for documented query patterns, not by habit.

Every index must have:

- A target query pattern.
- Expected filter or sort usage.
- Tenant-scope awareness.
- Justification.
- Review for write overhead.
- Migration rollback plan where possible.

## Required Index Families

### Tenant Lookup Indexes

Tenant-scoped tables should support organization-scoped queries.

Pattern:

```sql
(organization_id, ...)
```

Use for:

- Projects.
- Documents.
- Segments.
- Translations.
- Workflow.
- Publishing.
- Library.
- Rights.
- Audit.
- AI records.

### Parent Relationship Indexes

Foreign keys used for frequent joins should be indexed.

Patterns:

```sql
(organization_id, project_id)
(organization_id, project_id, document_id)
(organization_id, publication_id)
```

### Time-Ordered History Indexes

Audit, workflow, events, logs, and history tables should support descending
time access.

Pattern:

```sql
(organization_id, resource_type, resource_id, created_at DESC)
```

or module-specific equivalent.

### Unique Integrity Indexes

Unique indexes or constraints must enforce logical uniqueness.

Current examples:

- One segment order per document.
- One workflow state per document.
- One workflow state per segment.
- One pending founder transfer per organization.

### Search Indexes

Use full-text, trigram, or normalized indexes only when search requirements
justify them.

Current approved examples:

- Translation Memory normalized source fuzzy matching with `pg_trgm`.
- Terminology normalized term fuzzy matching with `pg_trgm`.

### Partial Indexes

Partial indexes are allowed for high-value filtered states.

Current approved examples:

- One pending founder ownership transfer.
- Terminology blocker issue detection.

## Current Index Inventory

Current PostgreSQL migrations define indexes for:

| Area | Existing index patterns | Assessment |
| --- | --- | --- |
| Projects | `organization_id`, `status`, `created_at DESC` | Suitable for tenant project listing. |
| Documents | `organization_id`, `project_id`, `status`, `created_at DESC` | Suitable for project document listing. |
| Segments | `organization_id`, `project_id`, `document_id`, `segment_order` | Suitable for ordered segment retrieval. |
| Translations | `organization_id`, `project_id`, `document_id`, `segment_id`, `created_at DESC` | Suitable for segment translation lookup. |
| Exports | `organization_id`, `project_id`, `document_id`, `created_at DESC` | Suitable for export history. |
| Foundation audit | `organization_id`, `entity_type`, `entity_id`, `created_at DESC` | Suitable for resource audit lookup. |
| Translation Memory | language pair, domain, approval status, project/document, trigram source search | Suitable for exact and fuzzy TM lookup. |
| Terminology | language, domain, status, normalized term, trigram normalized term | Suitable for glossary lookup. |
| QA | report and issue lookup by organization/project/document/segment/status/severity | Suitable for QA issue listing. |
| Semantic Fidelity | report and issue lookup by organization/project/document/segment/status/risk | Suitable for semantic issue listing. |
| Workflow | unique document/segment state and lookup by status | Suitable for workflow gates. |
| Founder Protection | organization/founder/status and one pending transfer | Suitable for ownership protection. |
| Security | login attempts, security events, session expiration | Suitable for auth hardening. |

## Future Index Requirements

Future PostgreSQL migrations must define index strategies for runtime-backed
tables before implementation.

Priority future areas:

- Library publication search.
- Publication title/author normalized search.
- Project dossiers.
- Author manuscripts and drafts.
- Rights authorization lookup.
- Provenance source lookup.
- Asset lookup by project/publication/language/type.
- Publishing preflight and distribution status.
- Public catalog search.
- AI usage by organization/project/user/month/agent.
- Audit by resource and actor.
- Backup jobs by organization/status/time.
- Observability logs by severity/time/correlation ID.

## Anti-Patterns

Avoid:

- Indexing every column.
- Adding duplicate indexes with the same leading columns.
- Adding GIN/trigram indexes without search requirements.
- Indexing large `jsonb` metadata fields unless a specific query requires it.
- Relying on indexes to compensate for unclear aggregate boundaries.
- Optimizing before measurements exist.

## Documentation Template

Every new index should be documented with:

```text
Index name:
Table:
Columns:
Index type:
Query pattern:
Expected cardinality:
Reason:
Write overhead:
Rollback:
```

## Validation

Index validation for future implementation must include:

- Migration test.
- Query plan check where available.
- Tenant isolation check.
- Backup/restore compatibility.
- No duplicate-index check.
