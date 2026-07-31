# Documentation Versioning

## Document Control

- Title: Documentation Versioning.
- Identifier: FRAMEWORK-08-DOCUMENTATION-VERSIONING.
- Version: 1.0.
- Status: Active specification.
- Owner: Documentation Governance.
- Reviewers: Platform Architecture, Engineering Governance, Release
  Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/frameworks/documentation-governance/overview.md`,
  `docs/codex/codex-versioning.md`,
  `docs/frameworks/data-engineering/data-versioning.md`.
- References: `docs/codex/change-management.md`.
- Change history:
  - 1.0: Initial documentation versioning baseline.

## Purpose

This document defines how official documentation is versioned, changed,
superseded, archived, and traced through the project lifecycle.

## Versioning Principles

Official documentation must be:

- Versioned before publication.
- Linked to the reason for change.
- Linked to affected modules or frameworks.
- Linked to ADRs or decisions where applicable.
- Preserved when superseded.
- Auditable through Git and documentation metadata.

## Version Record

Each official documentation change should record:

- Author.
- Date.
- Version.
- Reason.
- Impact.
- Approver.
- Links to ADRs.
- Links to modules.
- Links to frameworks.
- Links to validation reports where applicable.

## Version Numbering

Recommended version numbering:

- `0.x` for drafts and working baselines.
- `1.0` for the first approved active specification.
- Minor increments for compatible clarifications.
- Major increments for canonical restructures or changed governance rules.

## Immutable History

Approved documentation must not be silently overwritten. Changes may update the
current canonical document, but previous context must remain recoverable
through Git history, archived versions, change history, or superseded document
links.

## Supersession Rules

When a document supersedes another document, it must identify:

- Superseded document.
- Superseding document.
- Effective date.
- Reason.
- Migration instructions.
- Affected modules and references.

Superseded documents must not be deleted unless an approved archival process
preserves their contents and traceability.

## Change Impact

Documentation changes must identify whether they affect:

- Product behavior.
- Architecture.
- API contracts.
- Data models.
- Security controls.
- UI localization.
- Workflows.
- Tests.
- Deployment or operations.
- Release readiness.

If a documentation change implies runtime implementation, the implementation
must be explicitly scheduled and approved separately.

## AI Rules

AI may summarize diffs, detect inconsistent versions, propose impact analysis,
and draft changelog text. AI must not approve a documentation version or remove
historical records.

## Current Baseline Assessment

The repository is Git versioned, which provides a strong base. However, older
documents do not consistently include explicit version metadata, approver
metadata, or module impact sections. This framework requires incremental
normalization rather than disruptive rewriting.
