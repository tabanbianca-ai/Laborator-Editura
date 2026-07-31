# Canonical Data Model and Metadata Migration Plan

## Document Control

- Title: Canonical Data Model and Metadata Migration Plan.
- Identifier: STANDARD-02-MIGRATION-PLAN.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Data Governance.
- Reviewers: Platform Architecture, Engineering Governance, Documentation
  Governance, Quality Governance, Release Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/data-model/overview.md`,
  `docs/standards/data-model/compliance-audit.md`.
- References: `docs/frameworks/data-engineering/migration-plan.md`,
  `docs/frameworks/quality-governance/improvement-roadmap.md`,
  `docs/standards/naming-versioning/migration-plan.md`.
- Change history:
  - 1.0.0: Initial migration plan.

## Purpose

This document defines the incremental migration plan for applying Standard 02
across all Laborator Editura data objects and metadata records.

## Migration Principles

The migration must:

- Preserve validated functionality.
- Avoid breaking API contracts.
- Avoid destructive schema changes.
- Avoid database renames without approved migrations.
- Preserve JSON Master compatibility.
- Preserve backup and restore compatibility.
- Preserve tenant isolation.
- Preserve Need-to-Know.
- Preserve audit and lineage.
- Normalize metadata incrementally.
- Require human approval for canonical ownership changes.

## Phase 1 - Standard Activation

Status: Complete.

Actions:

- Create Standard 02 documentation set.
- Register Standard 02 in root governance documents.
- Define canonical model, metadata, classification, relationship, schema
  evolution, audit, and compliance rules.
- Record baseline audit.

## Phase 2 - Canonical Data Model Registry Design

Actions:

- Define registry structure.
- Define model families and domains.
- Define object type taxonomy.
- Define owner and steward fields.
- Define schema reference and schema version fields.
- Define classification and lifecycle fields.
- Define exception records.

No runtime registry is authorized until a later implementation phase.

## Phase 3 - Metadata Normalization

Actions:

- Normalize metadata for root domain models.
- Normalize module domain model metadata.
- Normalize API contract and event model metadata.
- Normalize JSON Master metadata.
- Add missing owners, classifications, provenance, lifecycle states, and
  schema references.

## Phase 4 - Relationship Registry

Actions:

- Map parent, child, reference, dependency, ownership, composition,
  association, and derived-from relationships.
- Link relationships to dependency registry and domain relationship docs.
- Identify duplicate ownership claims.
- Identify missing lineage for derived data.

## Phase 5 - Classification Mapping

Actions:

- Map existing sensitivity classifications to Standard 02 levels.
- Map `Highly Restricted` to `Restricted` with enhanced controls unless a
  specialized extension is approved.
- Add criticality and provenance metadata.
- Link classifications to IAM, Need-to-Know, retention, and audit rules.

## Phase 6 - Schema Evolution Mapping

Actions:

- Map JSON Master schema versions.
- Map API DTO and event payload versions.
- Map runtime database table schema versions.
- Map migration scripts to schema evolution records.
- Define backward compatibility rules for each high-impact model family.

## Phase 7 - AI Readiness and Metadata

Actions:

- Identify AI-consumable data objects.
- Add AI provenance metadata.
- Add policy, cost, consent, rights, and Need-to-Know references.
- Ensure AI-generated objects cannot become canonical without human approval.

## Phase 8 - Continuous Compliance

Actions:

- Add Standard 02 checks to documentation governance and quality governance.
- Track missing metadata, duplicate models, missing classification, missing
  relationships, missing schema versions, and lineage gaps.
- Include data model compliance in release readiness.

## Prioritized Roadmap

1. Preserve existing runtime behavior and activate the standard.
2. Design the canonical data model registry.
3. Normalize metadata for root and module domain models.
4. Map model ownership and relationships.
5. Normalize classification.
6. Map schema evolution and compatibility.
7. Add AI readiness metadata.
8. Add continuous compliance reporting after approval.

## Non-Goals

This migration plan does not authorize:

- Runtime code changes.
- API changes.
- Database schema changes.
- UI changes.
- Docker or staging changes.
- Automatic metadata backfill.
- Destructive schema migration.
- Automatic model ownership changes.
