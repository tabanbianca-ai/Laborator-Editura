# Canonical Relationships

## Document Control

- Title: Canonical Relationships.
- Identifier: STANDARD-02-RELATIONSHIPS.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Data Governance.
- Reviewers: Domain Architecture, Engineering Governance, Integration
  Governance, AI Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/data-model/overview.md`,
  `docs/data/entity-relationships.md`.
- References: `docs/domain/domain-relationships.md`,
  `docs/codex/dependency-registry.md`.
- Change history:
  - 1.0.0: Initial relationship standard baseline.

## Purpose

This document defines canonical relationship types and rules for connecting
data objects without creating duplicate ownership or uncontrolled dependencies.

## Relationship Types

All relationships must use one or more canonical relationship types:

- Parent.
- Child.
- Reference.
- Dependency.
- Ownership.
- Composition.
- Association.
- Derived From.

## Relationship Metadata

Every relationship should define:

- Relationship ID.
- Source object.
- Target object.
- Relationship type.
- Direction.
- Cardinality.
- Owner.
- Created date.
- Updated date.
- Version.
- Status.
- Validation rule.
- Audit reference.

## Ownership Relationships

Ownership identifies the authoritative source of truth. A data object must have
one canonical owner. Other modules may reference it, but they must not claim
alternate ownership.

## Composition Relationships

Composition indicates that child lifecycle depends on parent lifecycle.

Examples:

- Project contains project dossiers.
- Document contains segments.
- Manuscript contains sections.

Composition does not automatically grant public visibility or bypass
Need-to-Know.

## Association Relationships

Association links independent objects that keep separate lifecycle and
ownership.

Examples:

- Project associated with rights records.
- Publication associated with export artifacts.
- Translation associated with Translation Memory evidence.

## Dependency Relationships

Dependency records that one object requires another object for operation,
validation, governance, or publication.

Dependencies must be explicit and must not create uncontrolled cycles.

## Derived From Relationships

Derived data must reference the canonical source and preserve lineage.

Examples:

- Export artifact derived from JSON Master.
- Search index derived from documents and metadata.
- AI summary derived from a source manuscript.

Derived data must not become the source of truth.

## Relationship Validation

Relationships must be validated for:

- Required references.
- Referential integrity.
- Ownership compatibility.
- Tenant isolation.
- Need-to-Know restrictions.
- Lifecycle compatibility.
- Circular dependency risk.
- Schema version compatibility.

## Relationship Audit

Audit must cover:

- Relationship created.
- Relationship changed.
- Relationship removed.
- Ownership changed.
- Dependency added.
- Dependency removed.
- Derived relationship created.
- Validation failure.

## AI Rules

AI may suggest relationships, detect duplicates, and identify dependency risk.
AI must not create authoritative ownership relationships or remove lineage
without authorized review.
