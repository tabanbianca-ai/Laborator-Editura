# Canonical Model

## Document Control

- Title: Canonical Model.
- Identifier: STANDARD-02-CANONICAL-MODEL.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Data Governance.
- Reviewers: Platform Architecture, Domain Architecture, Engineering
  Governance, AI Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/data-model/overview.md`,
  `docs/frameworks/data-engineering/canonical-models.md`,
  `docs/data/logical-data-model.md`.
- References: `docs/domain/domain-model.md`,
  `docs/codex/reference-models.md`.
- Change history:
  - 1.0.0: Initial canonical model baseline.

## Purpose

This document defines the canonical shape for data objects used across modules,
APIs, events, storage, exports, backups, AI context, integrations, and
documentation.

## Required Canonical Fields

Every canonical entity must define:

- `uuid`.
- `canonicalName`.
- `displayName`.
- `objectType`.
- `version`.
- `status`.
- `owner`.
- `createdDate`.
- `updatedDate`.
- `lifecycleState`.
- `metadata`.
- `relationships`.
- `auditInformation`.

Layer-specific implementations may use equivalent casing conventions, such as
`created_at` in PostgreSQL or `createdAt` in TypeScript, but the semantic
meaning must remain traceable to the canonical field.

## Canonical Entity Template

```json
{
  "uuid": "00000000-0000-0000-0000-000000000000",
  "canonicalName": "project",
  "displayName": "Project",
  "objectType": "BusinessEntity",
  "version": "1.0.0",
  "status": "Released",
  "owner": "Projects",
  "createdDate": "2026-07-31T00:00:00Z",
  "updatedDate": "2026-07-31T00:00:00Z",
  "lifecycleState": "Released",
  "metadata": {},
  "relationships": [],
  "auditInformation": {}
}
```

## Canonical Object Types

Supported object type families:

- Business Entity.
- Domain Model.
- AI Asset.
- Editorial Asset.
- Digital Asset.
- Configuration Object.
- Security Object.
- Infrastructure Object.
- Workflow Object.
- Audit Object.
- Metadata Record.

## Canonical Data Domains

Canonical models must be assigned to one primary domain:

- Identity and Access.
- Organization and Workspace.
- Editorial Production.
- Library and Publication.
- Linguistic Knowledge.
- Rights and Provenance.
- Workflow and Quality.
- Media and Multimedia.
- Public Portal and Commerce.
- AI Governance and Orchestration.
- Security and Compliance.
- Observability and Operations.
- Integration and Gateway.
- Backup and Preservation.
- Configuration and Administration.

## Ownership Rules

Every canonical data object must have one owner. Other modules may reference,
read, enrich, or derive from the object, but they must not become competing
sources of truth.

Examples:

- IAM owns user credentials and session state.
- Projects owns project identity, classification, capabilities, and dossiers.
- Rights and Provenance owns authorization and provenance records.
- Translation Memory owns validated reusable translation evidence.
- JSON Master represents canonical export and interchange state but does not
  replace the owning modules.

## Derived Models

Derived models are allowed when they:

- Reference the canonical model.
- Record derivation source.
- Preserve schema version.
- Preserve lineage.
- Do not become alternate sources of truth.
- Are invalidated or refreshed when canonical data changes.

## AI Readiness

AI-ready data must preserve:

- Source.
- Provenance.
- Classification.
- Need-to-Know scope.
- Consent and rights status where applicable.
- Quality status.
- Schema version.
- Human approval state where applicable.

AI agents may consume canonical or derived data only within authorized scope.
They may not create canonical records without governed review and approval.

## Compatibility Rule

Existing runtime models, DTOs, tables, JSON Master structures, and backup
records must be mapped incrementally to the canonical model. This document does
not authorize disruptive schema changes.
