# Data Metadata Standard

## Document Control

- Title: Data Metadata Standard.
- Identifier: STANDARD-02-METADATA-STANDARD.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Data Governance.
- Reviewers: Documentation Governance, Security Governance, Quality
  Governance, AI Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/data-model/overview.md`,
  `docs/standards/naming-versioning/metadata-standard.md`.
- References: `docs/frameworks/data-engineering/data-catalog.md`,
  `docs/modules/data-governance/metadata-registry.md`.
- Change history:
  - 1.0.0: Initial data metadata standard baseline.

## Purpose

This document defines the mandatory metadata structure for canonical data
objects.

## Required Metadata

Every data object must define:

- UUID.
- Canonical Identifier.
- Title.
- Description.
- Domain.
- Category.
- Classification.
- Language.
- Keywords.
- Tags.
- Version.
- Status.
- Owner.
- Source.
- Provenance.

## Recommended Metadata

Where applicable, data objects should also define:

- Locale.
- Tenant or organization scope.
- Project scope.
- Document scope.
- Access policy.
- Need-to-Know scope.
- Retention policy.
- Security classification.
- Quality status.
- Lineage reference.
- Schema reference.
- Schema version.
- Producers.
- Consumers.
- Steward.
- Approval status.
- Validation status.
- Last review date.
- Expiration date.

## Metadata Record Template

```json
{
  "uuid": "00000000-0000-0000-0000-000000000000",
  "canonicalIdentifier": "project.identity",
  "title": "Project Identity",
  "description": "Canonical identity metadata for an editorial project.",
  "domain": "Editorial Production",
  "category": "Business Entity",
  "classification": {
    "sensitivity": "Internal",
    "criticality": "High",
    "provenance": "Native"
  },
  "language": "en",
  "keywords": ["project", "identity"],
  "tags": ["editorial", "metadata"],
  "version": "1.0.0",
  "status": "Released",
  "owner": "Projects",
  "source": "Laborator Editura",
  "provenance": "Native"
}
```

## Metadata Quality Rules

Metadata must be:

- Complete for the data object's lifecycle stage.
- Accurate.
- Searchable where used in catalogs.
- Versioned.
- Traceable to owner and source.
- Updated when classification, ownership, status, or provenance changes.
- Audited for governance-relevant changes.

## Language Metadata

Language metadata must follow the platform language model:

- Platform Language controls UI and AI/user conversation text.
- Original Language identifies the original work.
- Authoring Language identifies the current manuscript language.
- Target Language identifies each translation output.

Data objects must not merge these language meanings.

## Security Metadata

Sensitive data must define:

- Sensitivity classification.
- Access policy.
- Need-to-Know scope.
- Tenant or organization scope.
- Retention policy.
- Audit requirements.

Secrets must not be stored as metadata values. Only secret references, hashes,
or vault metadata may be recorded.

## AI Metadata

AI-related data must define:

- AI source or provider where applicable.
- AI-generated provenance when applicable.
- Human approval state.
- Evaluation status.
- Policy and cost governance references where applicable.

AI-generated data must never be represented as human-approved canonical data
without review.

## Relationship to Standard 01

Standard 01 defines artifact metadata broadly. Standard 02 specializes metadata
for data object governance and must be applied together with Standard 01.
