# Data Governance Gap Analysis

## 1. Executive Summary

The repository already contains mature architecture documentation for
conceptual, logical, and physical data modeling, JSON Master v1.0, runtime
database backup, module domain models, API contracts, events, and extensive
module-specific persistence foundations.

The target Data Governance, Metadata and Master Data Management architecture
requires these foundations to be connected through a central master data
governance layer: canonical identifiers, Schema Registry, Metadata Registry,
Data Catalog, Data Dictionary, Reference Data Registry, Data Quality Engine,
Entity Resolution, Golden Records, lineage, classification, retention, and
stewardship.

This phase is a baseline audit. It does not authorize destructive schema
changes, runtime table migrations, API changes, or irreversible data
reconciliation.

## 2. Current Data Landscape

Current data sources include:

- PostgreSQL migrations for MVP/core tables.
- Runtime database registry in `packages/db/src/runtime-database.ts`.
- JSON Master format types, schema, validation, documentation, and fixtures.
- Module TypeScript interfaces under `apps/api/src/modules/*`.
- Module domain model documents under `docs/modules/*/domain-model.md`.
- Module API contract documents under `docs/modules/*/api-contracts.md`.
- Module event catalogs under `docs/modules/*/events.md`.
- Conceptual, logical, and physical architecture documents.
- Frontend UI data models and workspace types.
- Deployment, backup, and infrastructure metadata.

## 3. Existing Sources of Truth

Current functional sources of truth are distributed:

| Domain | Current source of truth |
| --- | --- |
| Identity and access | IAM/Auth modules and core migration tables |
| Organization administration | Enterprise Administration and Workspace |
| Project identity | Projects module |
| Manuscripts and drafts | Author Studio |
| Documents and segments | Documents and Segments |
| Translations | Translations |
| Translation Memory | Translation Memory |
| Terminology | Terminology and Lexicographic Intelligence |
| QA and Semantic Fidelity | QA and Semantic Fidelity modules |
| Rights | Rights and Provenance |
| Publication lifecycle | Library and Publishing |
| Export artifacts | Export and Publishing |
| Public catalog | Public Portal |
| Commerce metadata | Commerce |
| Media | Multimedia Creation and Media Localization |
| Research | Research Hub |
| Observability | Observability |
| Backup and retention metadata | Backup Governance |
| Configuration | Configuration baseline and module-specific metadata |

These source-of-truth assignments are broadly documented but not yet enforced
through central MDM contracts.

## 4. Duplicate Data Models

Potential overlaps:

- Organization appears in Auth, Enterprise Administration, Workspace, Projects,
  and JSON Master.
- User/contributor/person metadata appears in Auth, Administration, Author
  Studio, Translation attribution, Rights, Library, Commerce, and Community.
- Publication and edition metadata appears in Library, Publishing, Public
  Portal, Commerce, Export, JSON Master, and Rights.
- Language and locale metadata appears in Shared Language Policy, Workspace,
  JSON Master, Projects, Documents, Translation, Rights, Publishing, Library,
  and Public Portal.
- Rights metadata appears in Rights, Publishing, Public Portal, Commerce,
  Library, JSON Master, and Export metadata.
- Media asset metadata appears in Multimedia, Media Localization, Publishing,
  Public Portal, Library, and JSON Master.
- Terminology and dictionary evidence appear in Terminology, Lexicographic,
  Translation, Semantic Fidelity, Review, and JSON Master.

These duplicates are acceptable as module-owned views when linked by stable
identifiers. They become risky when definitions diverge or source authority is
unclear.

## 5. Metadata Coverage

Strong coverage:

- JSON Master supports project, document, segment, translation, terminology,
  translation memory, QA, workflow, audit, version history, and future media.
- Rights and Provenance captures legal and source metadata.
- Publishing and Export capture artifact metadata.
- Library captures publication lifecycle metadata.
- Research captures source and citation metadata.

Gaps:

- No central metadata namespace registry.
- No central translation-completeness registry for metadata labels.
- No unified data dictionary for shared field meaning.
- No central compatibility policy for metadata schema changes.
- Optional `metadata` objects can hide fields that should become governed.

## 6. Schema Compatibility

Strengths:

- JSON Master has versioned shared TypeScript types and schema validation.
- Runtime database backup has format and schema version metadata.
- PostgreSQL migrations are versioned.
- API and event contracts are documented per module.

Gaps:

- No central Schema Registry.
- No automated compatibility matrix across module API contracts, event
  contracts, JSON Master, runtime backup, and physical schemas.
- No central deprecation workflow for schema fields.
- Runtime persistence tables outpace PostgreSQL migration coverage.

## 7. Reference Data Fragmentation

Current reference data appears in:

- TypeScript union types.
- PostgreSQL enums.
- Static arrays and constants.
- Frontend translation dictionaries.
- Documentation tables.
- Module status fields.

Fragmented sets include:

- Languages and locales.
- Publication types.
- Editorial domains.
- Workflow statuses.
- Role names.
- Classification levels.
- Rights types.
- Quality severities.
- Export formats.

Future Reference Data Registry should govern values requiring localization,
ordering, activation, approval, or source authority.

## 8. Data Quality Findings

Existing domain quality foundations:

- QA Engine.
- Semantic Fidelity Engine.
- Terminology Governance.
- Workflow gates.
- Publishing preflight.
- Rights warnings.
- Language policy tests.
- JSON Master validation.
- Security environment validation.

Gaps:

- No shared Data Quality Engine for master data.
- No central quality score for master records.
- No unified blocking rule registry.
- No shared data quality result model across modules.
- No central quality dashboard for data owners and stewards.

## 9. Provenance and Lineage Findings

Strengths:

- JSON Master includes provenance references.
- Audit events exist across many modules.
- Versioning exists for publications, manuscripts, workflow, export, and
  backup.
- Rights and Provenance captures source and legal provenance.

Gaps:

- No central Lineage Service.
- No standard transformation record across import, translation, review,
  export, publishing, audio, video, and distribution.
- Derived artifacts do not yet uniformly reference master record, master
  version, generator version, configuration profile, and generation timestamp.
- AI extraction/proposal lineage is module-specific.

## 10. Ownership and Stewardship Gaps

Strengths:

- Domain ownership is documented in Chapters 4 and 5.
- IAM, Administration, Workspace, Rights, Library, Publishing, and Translation
  boundaries are increasingly explicit.

Gaps:

- No runtime Data Stewardship assignments.
- No central owner/steward view by data domain.
- No separation-of-duties policy for Golden Record approvals.
- No unified escalation path for unresolved data conflicts.

## 11. Classification and Retention Gaps

Strengths:

- Security documentation defines data classification.
- Need-to-Know access restricts visibility.
- Backup Governance defines retention and preservation foundations.
- Library, Rights, and Publishing preserve history.

Gaps:

- Classification is not attached to every master record, field, dataset, or
  export.
- Retention policies are not centrally mapped to all data classes.
- Legal hold is not uniformly represented across modules.
- Search indexing and exports need stronger classification-aware contracts.

## 12. Security and Compliance Risks

Risks:

- Unclassified metadata may be indexed or exported too broadly.
- Duplicate person/contributor records can weaken consent, attribution, and
  access tracking.
- Lack of central reference data can produce inconsistent workflow or rights
  statuses.
- AI-proposed data could be mistaken for validated data if provenance and
  approval state are not explicit.
- Runtime table coverage without PostgreSQL migrations requires careful backup,
  restore, and future migration governance.

## 13. Integration Risks

Integration risks:

- External connector payloads may introduce unregistered schemas.
- Webhook events may drift without Schema Registry and data contracts.
- Public catalog, commerce, and distribution feeds may expose stale or
  unapproved metadata.
- Search and Knowledge Graph may join records without canonical identifier
  mappings.
- Derived publication artifacts may not be traceable to exact master versions.

## 14. Prioritized Remediation Backlog

1. Approve canonical identifier strategy.
2. Inventory all source-of-truth declarations by module.
3. Define Schema Registry baseline for JSON Master, API contracts, events, and
   runtime backup.
4. Define Data Dictionary for shared fields.
5. Consolidate Reference Data Registry priorities.
6. Define Metadata Registry namespaces.
7. Define Data Catalog seed from existing docs and runtime registry.
8. Define shared Data Quality Rule model.
9. Define Lineage Record contract for imports, transformations, exports, and
   generated artifacts.
10. Define Entity Resolution candidate model and review workflow.
11. Define Golden Record approval policy.
12. Map classification and retention policies to data classes.
13. Plan module-by-module migration with rollback and identifier preservation.
