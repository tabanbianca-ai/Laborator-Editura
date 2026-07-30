# Data Governance Migration Plan

## Purpose

This document defines the incremental path from the current repository baseline
to the official Data Governance, Metadata and Master Data Management Module.

Migration must be additive and must preserve validated Phase 7 Step 16
publishing, final preflight, distribution, Library, Rights, Workflow, IAM,
Observability, Backup, Search, Integration, Configuration, Notification, AI
Orchestration, Security Governance, Policy Engine, audit, frontend
localization, staging deployment, infrastructure behavior, and JSON Master
v1.0 compatibility.

No massive migration begins before approval of:

- Canonical identifiers.
- Baseline schemas.
- Versioning rules.
- Legacy data preservation policy.

## Phase 1 - Discovery and Inventory

Objective: Create a complete inventory of database models, runtime tables,
schemas, DTOs, API contracts, event payloads, metadata structures, reference
data sets, identifiers, validation rules, transformations, imports, and
source-of-truth declarations.

Dependencies: Existing architecture documents, module docs, TypeScript types,
runtime database registry, migrations, JSON Master, and API/event docs.

Activities: Build inventory tables, map source modules, classify entity
ownership, identify duplicates, and record unknown owners.

Risks: Incomplete inventory; confusing runtime tables with canonical ownership.

Completion criteria: Every module has at least one documented data ownership
entry and every shared entity has a provisional owner.

Rollback strategy: Documentation-only rollback by reverting inventory files.

Data that must not be lost: Existing identifiers, source module ownership,
audit records, JSON Master compatibility, and runtime backup table names.

## Phase 2 - Canonical Identifier Strategy

Objective: Define stable canonical identifiers and mapping records for legacy,
module-specific, external, and generated identifiers.

Dependencies: Phase 1 inventory and source-of-truth mapping.

Activities: Define identifier format, prefix policy, mapping record schema,
immutability rules, and no-reuse policy.

Risks: Breaking references if identifiers are replaced instead of mapped.

Completion criteria: Identifier strategy approved for Work, Person,
Organization, Publication, Edition, Manuscript, Segment, Term, Asset, Rights
Record, and Export Artifact.

Rollback strategy: Preserve existing identifiers and disable new canonical ID
assignment before runtime migration.

Data that must not be lost: All existing IDs, external references, source file
references, audit IDs, and publication artifact references.

## Phase 3 - Schema Registry Baseline

Objective: Establish versioned schema governance for JSON Master, API
contracts, events, runtime backup, imports, exports, and generated artifacts.

Dependencies: Canonical identifier strategy and existing contract inventory.

Activities: Define schema record model, namespace policy, compatibility rules,
deprecation policy, and contract test expectations.

Risks: Over-constraining schemas before module ownership is clear.

Completion criteria: Baseline registry covers JSON Master, runtime backup,
public API contracts, and module event contracts.

Rollback strategy: Keep existing schemas authoritative until registry
enforcement is explicitly enabled.

Data that must not be lost: Existing JSON Master fixtures, runtime backup
format, migration history, and API/event contract references.

## Phase 4 - Reference Data Consolidation

Objective: Consolidate controlled values that require localization,
governance, ordering, activation, approval, or source authority.

Dependencies: Schema Registry baseline and current enum/union inventory.

Activities: Identify candidate reference data, define datasets, map current
constants, document authority, and propose migration order.

Risks: Changing stable runtime constants too early.

Completion criteria: Reference Data Registry baseline covers languages,
countries, currencies, timezones, publication types, workflow statuses, rights
types, classification levels, and quality severities.

Rollback strategy: Keep application constants in place until each dataset is
backed by tests and compatibility mappings.

Data that must not be lost: Existing status values, localized labels, workflow
states, publication types, and language/locale metadata.

## Phase 5 - Canonical Model Introduction

Objective: Introduce canonical data models for shared entities without
disrupting source module ownership.

Dependencies: Identifier strategy, Schema Registry, and Reference Data
Registry baseline.

Activities: Define canonical models, map module fields, mark extension fields,
and document source-of-truth boundaries.

Risks: Attempting to replace source module models instead of linking them.

Completion criteria: Canonical models exist for Identity, Editorial,
Translation, Rights, Publication, Media, and Reference Data domains.

Rollback strategy: Disable canonical projections and continue using module
source records.

Data that must not be lost: Module-owned source records, versions, approvals,
rights restrictions, and publication records.

## Phase 6 - Quality Rule Implementation

Objective: Define configurable master data quality rules and shared quality
results.

Dependencies: Canonical models and schema baseline.

Activities: Define rule model, severity levels, scoring, blocking behavior,
owner/steward review, and integration with domain quality engines.

Risks: Duplicating QA, Semantic Fidelity, Terminology, or Publishing Preflight
instead of coordinating them.

Completion criteria: Shared rule model covers completeness, validity,
consistency, uniqueness, referential integrity, timeliness, and provenance.

Rollback strategy: Keep domain validators authoritative and disable shared
quality enforcement.

Data that must not be lost: Existing QA issues, Semantic Fidelity reports,
Terminology decisions, Workflow gates, and Preflight results.

## Phase 7 - Provenance and Lineage Capture

Objective: Standardize lineage capture across imports, transformations,
translations, review, publishing, exports, audio, video, and distribution.

Dependencies: Canonical identifiers and quality rule baseline.

Activities: Define lineage record model, provenance fields, transformation
types, AI attribution, workflow links, and artifact generation references.

Risks: Missing generated artifacts or AI-derived metadata.

Completion criteria: Lineage contract covers source entity/version, target
entity/version, transformation, actor/AI agent, workflow, timestamp, and
validation result.

Rollback strategy: Preserve existing audit/version records and disable central
lineage projection.

Data that must not be lost: Audit events, version history, source manuscript
links, rights provenance, export artifacts, and generated media references.

## Phase 8 - Golden Record and Entity Resolution

Objective: Introduce controlled duplicate detection, entity resolution, and
Golden Record creation.

Dependencies: Canonical identifiers, reference data, quality rules, lineage,
and stewardship assignments.

Activities: Define duplicate candidate model, similarity methods, automatic
merge limits, human review workflow, Golden Record versioning, and conflict
preservation.

Risks: Incorrect merges; loss of source conflict history.

Completion criteria: Entity Resolution supports candidate, review, resolve,
reject, and Golden Record update states.

Rollback strategy: Revert Golden Record projection to previous version and
preserve all source records.

Data that must not be lost: Source records, conflicting values, approvals,
legacy identifiers, and audit trail.

## Phase 9 - Module-by-Module Migration

Objective: Move modules incrementally to canonical identifiers, metadata
schemas, data contracts, quality rules, and lineage references.

Dependencies: Approved governance foundations from Phases 1-8.

Activities: Migrate by domain priority: IAM references, Projects, Library,
Rights, Publishing, Translation, Terminology, Research, Media, Search,
Integration, Configuration, Backup, and Observability.

Risks: Cross-module reference breakage and hidden duplicate ownership.

Completion criteria: Each migrated module has compatibility tests, backup
coverage, data contract references, and rollback documentation.

Rollback strategy: Module-level rollback to previous source-module read/write
path through preserved identifiers and compatibility mappings.

Data that must not be lost: Module-owned records, tenant scope, RLS policy,
audit, versions, publication outputs, and rights restrictions.

## Phase 10 - Legacy Data Reconciliation

Objective: Reconcile existing duplicated data and historical records using
approved entity resolution and Golden Record workflows.

Dependencies: Module migration coverage and steward review workflows.

Activities: Identify legacy duplicates, create candidate batches, validate
source history, resolve conflicts, and update mappings.

Risks: Reconciliation fatigue; accidental data suppression.

Completion criteria: High-priority duplicate domains have reviewed resolution
records and no source records are deleted.

Rollback strategy: Revert Golden Record selection to previous version while
preserving candidate and source records.

Data that must not be lost: Legacy identifiers, conflicting metadata,
citations, rights history, publication versions, and contributor attribution.

## Phase 11 - Governance Enforcement

Objective: Enforce Schema Registry, Reference Data, Data Quality,
Classification, Retention, and Lineage requirements in active workflows.

Dependencies: Stable module migration and reconciliation baseline.

Activities: Enable blocking rules, schema compatibility checks, classification
checks, retention policy checks, and lineage requirements per workflow gate.

Risks: Blocking production workflows due to incomplete legacy metadata.

Completion criteria: Enforcement is enabled for approved data domains with
clear remediation paths and no unresolved critical blockers.

Rollback strategy: Downgrade enforcement to warnings for a specific rule set
through approved configuration while preserving audit.

Data that must not be lost: Failed validation records, remediation history,
workflow decisions, and human override justifications.

## Phase 12 - Continuous Quality Monitoring

Objective: Maintain ongoing data quality, schema compatibility, lineage
coverage, classification compliance, retention compliance, and MDM health.

Dependencies: Enforcement baseline and observability integration.

Activities: Build dashboards, scheduled validations, drift detection,
stewardship reports, quality trends, and remediation queues.

Risks: Alert fatigue and overbroad visibility of sensitive metadata.

Completion criteria: Data owners and stewards can monitor quality, lineage,
classification, retention, and unresolved conflicts within authorized scope.

Rollback strategy: Disable scheduled checks or reduce alert severity while
retaining records.

Data that must not be lost: Quality history, lineage history, audit history,
classification changes, retention actions, and stewardship assignments.

## Implementation Order

Recommended order:

1. Repository data inventory.
2. Canonical identifier specification.
3. Schema Registry.
4. Data Dictionary.
5. Reference Data Registry.
6. Metadata Registry.
7. Data Catalog.
8. Data Quality Engine.
9. Provenance and Lineage.
10. Entity Resolution.
11. Golden Record.
12. Retention and Classification enforcement.
13. Module migration.
14. Continuous governance.

## Testing Requirements

Each implementation phase requires:

- Schema compatibility tests.
- Identifier mapping tests.
- Tenant isolation tests.
- Need-to-Know tests.
- Classification tests.
- Retention and legal hold tests.
- Quality rule tests.
- Entity resolution tests.
- Golden Record versioning tests.
- Lineage tests.
- Audit tests.
- Backup/restore tests when persistence changes.
- Regression tests for JSON Master, IAM, Rights, Library, Publishing, Export,
  Search, Integration, Configuration, and Phase 7 Step 16 behavior.

## Next Recommended Module

Module 18 - Data Governance, Metadata and Master Data Management Module
Architecture is now documented after Configuration, Feature Flags and Platform
Administration.

Module 19 - Accessibility, Localization and Inclusive Experience Module
Architecture is now documented after Data Governance, Metadata and Master Data
Management.

Module 20 - Analytics, Business Intelligence and Decision Support Module
Architecture is now documented after Accessibility, Localization and Inclusive
Experience.

Module 21 - AI Governance, Model Management and Responsible AI Module
Architecture is now documented after Analytics, Business Intelligence and
Decision Support.

Module 22 - DevSecOps, CI/CD, Release and Platform Operations Module
Architecture is now documented after AI Governance, Model Management and
Responsible AI.

The next recommended module specification after DevSecOps, CI/CD, Release
and Platform Operations is Module 23 - Quality Assurance, Testing and
Validation Module Architecture.
