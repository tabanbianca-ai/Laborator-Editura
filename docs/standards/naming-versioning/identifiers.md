# Identifiers

## Document Control

- Title: Identifiers.
- Identifier: STANDARD-01-IDENTIFIERS.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Platform Architecture.
- Reviewers: Data Governance, Security Governance, Engineering Governance,
  Documentation Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/naming-versioning/overview.md`.
- References: `docs/frameworks/data-engineering/canonical-models.md`,
  `docs/database/physical-data-model.md`.
- Change history:
  - 1.0.0: Initial identifier standard baseline.

## Purpose

This document defines the canonical identity model for platform artifacts.

## Identifier Principles

Identifiers must be:

- Globally unique where required.
- Stable.
- Immutable after creation.
- Machine readable.
- Traceable.
- Independent from localized display labels.
- Independent from mutable names.

## Required Identifier Fields

Every governed artifact should define:

- `uuid`.
- `canonicalName`.
- `displayName`.
- `shortName`.
- `version`.
- `status`.
- `domain`.
- `owner`.
- `classification`.
- `lifecycleState`.

Implementation-facing field names use English and should map to the platform's
serialization conventions for the relevant layer.

## UUID Rules

UUIDs:

- Must be unique within the artifact family.
- Should be globally unique across the platform for canonical records.
- Must not be reused after archival.
- Must not encode business meaning.
- Must not change when a display name changes.

## Canonical Name Rules

Canonical names:

- Identify the artifact in human-readable form.
- Are stable but may be changed through governance when necessary.
- Must remain unique within their scope.
- Must not depend on localized UI labels.
- Must be traceable through rename history.

## Display Name Rules

Display names:

- May be localized for user-facing surfaces.
- May change without changing UUID.
- Must not be used as security, database, or integration identifiers.

## Short Name Rules

Short names:

- Are optional unless needed for compact display.
- Must not introduce ambiguity.
- Must be documented when used in APIs, events, logs, dashboards, or reports.

## Scope Rules

Identifier uniqueness is evaluated by artifact scope:

- Global platform.
- Organization.
- Project.
- Module.
- Document.
- Workflow.
- AI asset.
- Infrastructure environment.

When scope is not explicit, the identifier must be globally unique.

## Identity Change Rules

Immutable identity must not change when:

- Name changes.
- Owner changes.
- Version changes.
- Status changes.
- Display label changes.
- Location changes.
- Implementation path changes.

When an artifact is replaced by a new artifact with different identity, the
relationship must be recorded as supersession, replacement, migration, or
fork.

## Traceability Links

Identifiers must support links to:

- Origin.
- Owner.
- Versions.
- Approvals.
- Dependencies.
- Consumers.
- Audit records.
- Archived state.

## Existing Artifact Baseline

Many existing repository artifacts are identifiable through paths, package
names, module names, or table names. Not all existing artifacts have explicit
UUID metadata. These must be normalized incrementally through the migration
plan rather than disruptive backfill.

## AI Rules

AI may suggest identifiers, detect duplicates, and propose mappings. AI must
not assign canonical identity to production artifacts without authorized human
approval.
