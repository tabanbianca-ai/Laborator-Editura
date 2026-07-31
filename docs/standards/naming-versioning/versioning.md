# Versioning

## Document Control

- Title: Versioning.
- Identifier: STANDARD-01-VERSIONING.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Platform Architecture.
- Reviewers: Engineering Governance, Release Governance, Documentation
  Governance, API Governance, Data Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/naming-versioning/overview.md`.
- References: `docs/codex/codex-versioning.md`,
  `docs/frameworks/documentation-governance/versioning.md`.
- Change history:
  - 1.0.0: Initial versioning standard baseline.

## Purpose

This document defines the canonical versioning rules for platform artifacts.

## Semantic Versioning

All versioned artifacts use Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Examples:

- `1.0.0`.
- `1.4.3`.
- `2.0.0`.

## Version Meaning

`MAJOR` changes indicate incompatible or breaking changes.

`MINOR` changes indicate compatible additions or significant non-breaking
changes.

`PATCH` changes indicate compatible fixes, clarifications, or small
adjustments.

## Versioned Artifact Families

Versioning applies to:

- Product specifications.
- Standards.
- Frameworks.
- Modules.
- APIs.
- Events.
- Database schemas.
- JSON schemas.
- Prompts.
- AI model profiles.
- Documentation.
- Infrastructure configuration.
- Release artifacts.
- Export formats.

## Compatibility Rules

Breaking changes require:

- Explicit impact analysis.
- Migration plan.
- Version bump.
- Approval.
- Audit record.
- Compatibility strategy where relevant.

Existing API, database, and export contracts must not be broken silently.

## Document Versioning

Documentation versioning follows Framework 08 and must preserve:

- Author.
- Date.
- Version.
- Reason.
- Impact.
- Approver.
- Links to ADRs and modules.

## API Versioning

Public and external APIs should use explicit versioning such as `/api/v1`.

Internal APIs must document their compatibility expectations. Existing
validated APIs must not be renamed or reversioned without approved migration.

## Database Versioning

Database schemas evolve through migrations. Migration identifiers, schema
versions, and compatibility requirements must be traceable and auditable.

## AI Asset Versioning

AI prompts, models, evaluation sets, RAG sources, and agent configurations
must be versioned because behavior may change even when code does not.

AI output is not a version authority. Human approval is required for canonical
AI asset versions.

## Lifecycle Version Rules

Versions must be traceable through:

- Draft.
- Under Review.
- Approved.
- Released.
- Deprecated.
- Archived.

Released versions must remain recoverable.

## Existing Artifact Baseline

The repository already contains versioned packages, documentation, migrations,
and release records. Explicit Semantic Versioning metadata is not yet present
on every artifact family. The migration plan defines incremental
normalization.
