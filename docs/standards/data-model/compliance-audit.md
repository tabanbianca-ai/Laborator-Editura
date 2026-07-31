# Canonical Data Model and Metadata Compliance Audit

## Document Control

- Title: Canonical Data Model and Metadata Compliance Audit.
- Identifier: STANDARD-02-COMPLIANCE-AUDIT.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Data Governance.
- Reviewers: Platform Architecture, Engineering Governance, Documentation
  Governance, Quality Governance, Security Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/data-model/overview.md`.
- References: `docs/standards/data-model/migration-plan.md`,
  `docs/frameworks/data-engineering/compliance-audit.md`,
  `docs/frameworks/quality-governance/compliance-audit.md`.
- Change history:
  - 1.0.0: Initial baseline audit.

## Purpose

This document records the Canonical Data Model and Metadata Baseline Audit
required by Standard 02.

## Audit Objectives

The baseline audit evaluates:

1. Canonical data model inventory.
2. Metadata compliance.
3. Relationship analysis.
4. Data classification.
5. Validation rules.
6. Duplicate models.
7. Missing metadata.
8. Standardization roadmap.

## Inventory Summary

Inventory method:

- Runtime module inventory was produced from `find apps/api/src/modules
  -mindepth 1 -maxdepth 1 -type d`.
- Module domain model inventory was produced from `find docs/modules -name
  'domain-model.md'`.
- Module API contract inventory was produced from `find docs/modules -name
  'api-contracts.md'`.
- Module event inventory was produced from `find docs/modules -name
  'events.md'`.
- Core domain/data/database documentation inventory was produced from
  `find docs/domain docs/data docs/database -type f`.
- Shared schema inventory was produced from `find packages/shared/src -type f`.
- Database implementation inventory was produced from `find packages/db/src
  packages/db/migrations -type f`.

Baseline counts after Standard 02 registration:

| Data Artifact Area | Count |
| --- | ---: |
| Runtime API module folders | 36 |
| Module domain model documents | 25 |
| Module API contract documents | 25 |
| Module event documents | 25 |
| Core domain/data/database documents | 17 |
| Shared schema and policy source files | 6 |
| Database source and migration files | 11 |
| Canonical standard areas under `docs/standards` | 2 |
| Documentation files under `docs` | 556 |

## Canonical Model Assessment

Current strengths:

- Conceptual, logical, and physical data model documentation exists.
- Module-level domain models exist for all 25 documented module areas.
- API contract and event documents exist for all 25 documented module areas.
- Framework 03 defines data engineering governance.
- JSON Master defines a canonical editorial export and interchange format.
- Runtime database table names are centrally enumerated.

Current gaps:

- No single machine-readable canonical data model registry exists yet.
- Not every runtime table or DTO is mapped to a canonical model owner.
- Metadata completeness varies across older documents and runtime models.
- Data classification is distributed across security, data governance,
  compliance, and module documents.
- Relationship validation is documented but not centrally enforced across all
  model families.

## Metadata Compliance Assessment

Current rating: Partial to Managed.

Findings:

- Newer standards and frameworks include strong document control metadata.
- Module data objects do not consistently expose all required Standard 02
  metadata fields.
- Runtime records often contain identifiers, timestamps, status, and metadata,
  but ownership, classification, provenance, and lifecycle metadata are not
  uniformly represented.

## Relationship Analysis

Current strengths:

- Conceptual relationships exist in `docs/domain/domain-relationships.md`.
- Logical relationships exist in `docs/data/entity-relationships.md`.
- Module documents define domain-specific relationships.
- Dependency registry defines cross-module dependency governance.

Current gaps:

- Parent, child, reference, dependency, ownership, composition, association,
  and derived-from relationship types are not yet normalized into one registry.
- Derived data relationships for exports, search indexes, AI summaries, and
  analytics need complete lineage mapping.

## Classification Review

Current strengths:

- Security, compliance, and data governance documents define classification
  concepts.
- Need-to-Know and tenant isolation are consistently represented.

Current gaps:

- Sensitivity levels are not uniformly applied to every model.
- Existing `Highly Restricted` terminology must be mapped to Standard 02
  `Restricted` with enhanced controls or approved as a specialized extension.
- Provenance types are not uniformly recorded for AI-generated, imported,
  external, and archived data.

## Validation Review

Standard 02 requires validation for:

- Required fields.
- Unique constraints.
- Referential integrity.
- Schema validation.
- Metadata validation.
- Lifecycle validation.
- Ownership validation.
- Classification validation.

Current rating: Managed for core MVP data; partial for broader Phase 2-7
runtime foundations.

## Duplicate Model Risks

Known duplication risk areas:

- Project, document, manuscript, publication, and library metadata appear
  across multiple modules.
- Language metadata appears across UI, configuration, projects, translation,
  JSON Master, and AI governance.
- Rights and provenance metadata appears in projects, publishing, export,
  public portal, commerce, and library.
- AI asset metadata appears across AI Governance, AI Engineering,
  Marketplace, Platform Engineering, and Observability.

Required action:

- Assign canonical owners.
- Add cross-references.
- Preserve local module implications.
- Avoid creating alternate sources of truth.

## Compliance Rating

Current baseline rating: Partially compliant.

Rationale:

- Foundational documentation is strong.
- Canonical model and data governance concepts already exist.
- Complete compliance requires a canonical model registry, metadata
  normalization, classification mapping, relationship registry, and schema
  evolution controls.
