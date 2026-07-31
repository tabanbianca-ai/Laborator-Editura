# Canonical Naming and Versioning Migration Plan

## Document Control

- Title: Canonical Naming and Versioning Migration Plan.
- Identifier: STANDARD-01-MIGRATION-PLAN.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Platform Architecture.
- Reviewers: Engineering Governance, Documentation Governance, Data
  Governance, Quality Governance, Release Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/naming-versioning/overview.md`,
  `docs/standards/naming-versioning/compliance-audit.md`.
- References: `docs/frameworks/quality-governance/improvement-roadmap.md`,
  `docs/frameworks/documentation-governance/migration-plan.md`.
- Change history:
  - 1.0.0: Initial migration plan.

## Purpose

This document defines the incremental migration plan for applying Standard 01
across all Laborator Editura artifacts.

## Migration Principles

The migration must:

- Preserve validated functionality.
- Avoid breaking API contracts.
- Avoid renaming deployed database tables without approved migrations.
- Avoid destructive file or path changes.
- Preserve audit history.
- Preserve references and dependencies.
- Normalize metadata incrementally.
- Use aliases and mappings before disruptive renames.
- Require human approval for canonical identity changes.

## Phase 1 - Standard Activation

Status: Complete.

Actions:

- Create Standard 01 documentation set.
- Register Standard 01 in root governance documents.
- Define naming, identity, versioning, metadata, lifecycle, audit, and
  compliance rules.
- Record baseline audit.

## Phase 2 - Canonical Artifact Registry Design

Actions:

- Define the registry structure for artifacts.
- Define artifact families and scopes.
- Define UUID assignment rules.
- Define canonical name uniqueness rules.
- Define alias and supersession records.
- Define exception records.

No runtime registry is authorized until a later implementation phase.

## Phase 3 - Documentation Metadata Normalization

Actions:

- Apply Standard 01 and Framework 08 metadata to root governance documents.
- Normalize framework and standard document versions.
- Add identifiers and owners to high-priority module documents.
- Record deprecated names and aliases where needed.

## Phase 4 - Runtime Artifact Mapping

Actions:

- Inventory applications, packages, modules, services, controllers,
  repositories, API endpoints, events, database tables, migrations, UI
  components, configuration files, scripts, and infrastructure assets.
- Assign canonical artifact names without changing runtime paths.
- Identify duplicate names and ambiguous names.
- Identify artifacts missing explicit versions or metadata.

## Phase 5 - API and Event Compatibility Mapping

Actions:

- Map existing API endpoints to canonical API names.
- Identify public, private, internal, and compatibility-stable APIs.
- Define future versioning approach for public APIs.
- Create event naming and versioning registry.
- Preserve existing API behavior until versioned migration is approved.

## Phase 6 - Data and Database Alignment

Actions:

- Map existing runtime database tables to canonical data artifact names.
- Record plural table names preserved for compatibility.
- Identify future singular canonical designs where applicable.
- Link migrations to schema versions.

## Phase 7 - AI Asset Versioning

Actions:

- Inventory AI agents, prompts, model profiles, evaluation sets, RAG sources,
  tool permissions, and AI policies.
- Assign canonical names and versions.
- Link AI assets to cost, policy, audit, and evaluation records.

## Phase 8 - Continuous Compliance

Actions:

- Add Standard 01 checks to documentation and quality audits.
- Track missing identifiers, missing versions, missing metadata, duplicate
  names, lifecycle gaps, and audit gaps.
- Include naming and versioning compliance in release readiness.

## Prioritized Roadmap

1. Preserve existing behavior and activate the standard.
2. Design the canonical artifact registry.
3. Normalize root and framework documentation metadata.
4. Inventory runtime artifacts.
5. Map APIs and events.
6. Map database artifacts.
7. Map AI assets.
8. Add continuous compliance reporting after approval.

## Non-Goals

This migration plan does not authorize:

- Runtime code changes.
- API changes.
- Database schema changes.
- UI changes.
- Docker or staging changes.
- Automatic renaming.
- Destructive migrations.
- Automatic certification.
