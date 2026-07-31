# Data Catalog

## Purpose

The Data Catalog is the official inventory of platform data assets,
ownership, classifications, schemas, consumers, quality state, lineage,
retention, and dependencies.

## Catalog Entry Standard

Every catalog entry must preserve:

- UUID.
- Name.
- Description.
- Canonical model.
- Domain.
- Owner.
- Steward.
- Source.
- Consumers.
- Sensitivity.
- Classification.
- Schema reference.
- Schema version.
- Quality status.
- Lineage reference.
- Retention policy.
- Backup policy.
- Access policy.
- Need-to-Know scope.
- Lifecycle state.
- Last review date.

## Current Catalog Sources

Current documentation and runtime sources that seed the catalog:

- `docs/domain/domain-model.md`.
- `docs/data/logical-data-model.md`.
- `docs/data/aggregate-map.md`.
- `docs/database/physical-data-model.md`.
- `docs/modules/*/domain-model.md`.
- `docs/modules/*/api-contracts.md`.
- `docs/modules/*/events.md`.
- `docs/JSON_MASTER_FORMAT.md`.
- `packages/db/src/runtime-database.ts`.
- `packages/db/migrations`.

## Current Data Asset Inventory

### Runtime Database Tables

Runtime table names are centrally enumerated in
`packages/db/src/runtime-database.ts`.

Major runtime table groups:

- Identity and authentication.
- Gateway and integrations.
- Observability.
- Security governance.
- Backup and preservation.
- AI governance.
- Policy and compliance.
- Administration and organization.
- Marketplace.
- Workspace and Need-to-Know access.
- Launch essentials.
- Rights and Provenance.
- Projects and dossiers.
- Documents, segments, and translations.
- Export artifacts.
- Translation Memory.
- Linguistic source priorities.
- Terminology.
- QA.
- Semantic Fidelity.
- Workflow.
- Lexicographic Intelligence.
- Editorial Decisions.
- Layout and Publishing.
- Media Localization.
- Multimedia.
- Platform Engineering.
- Agent Coordination.
- Commerce.
- Library.
- Author Studio.
- Research.
- Collaboration and Community.
- Public Portal.
- Scheduling.

### PostgreSQL Migrations

Current migration scripts:

- `0000_mvp_foundation_v1.sql`.
- `0001_translation_memory_v1.sql`.
- `0002_terminology_glossary_v1.sql`.
- `0003_qa_engine_v1.sql`.
- `0004_semantic_fidelity_v1.sql`.
- `0005_workflow_engine_v1.sql`.
- `0006_terminology_governance_v2.sql`.
- `0007_founder_protection_v1.sql`.
- `0008_security_hardening_phase_1.sql`.

### JSON Master Data

JSON Master is the canonical editorial transfer and export structure for
projects, documents, manuscripts, segments, translations, terminology, QA,
workflow, audit, version history, and future media localization metadata.

### Documentation Catalog

Data documentation already exists in:

- `docs/data`.
- `docs/database`.
- `docs/modules/data-governance`.

Framework 03 governs these documents and should be referenced by future data
work.

## Sensitivity Classification

Catalog entries must identify sensitivity:

- Public.
- Internal.
- Confidential.
- Restricted.
- Highly Restricted.

Examples:

- Public catalog metadata may be Public after publication approval.
- User sessions, credentials, secrets, and security events are Highly
  Restricted.
- Rights negotiations and private editorial notes are Restricted.
- Draft manuscripts are Confidential or Restricted depending on access scope.

## Ownership and Stewardship

Each data asset must identify:

- Business owner.
- Technical owner.
- Data steward.
- Security classification owner where relevant.
- Retention owner.

AI agents cannot be final data owners.

## Current Catalog Gap

No searchable runtime Data Catalog exists yet.

Current state is document-based and code-enumerated. The future catalog should
connect canonical models, runtime tables, schemas, events, retention, lineage,
quality rules, and access policies.

## Standardization Plan

1. Create a machine-readable catalog seed from `packages/db/src/runtime-database.ts`.
2. Map each runtime table to a canonical model and owner aggregate.
3. Link catalog entries to retention and sensitivity policies.
4. Link catalog entries to lineage and quality rules.
5. Add catalog review lifecycle.
6. Enforce Need-to-Know visibility in catalog search.
