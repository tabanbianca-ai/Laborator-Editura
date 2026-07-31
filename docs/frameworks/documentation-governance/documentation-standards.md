# Documentation Standards

## Document Control

- Title: Documentation Standards.
- Identifier: FRAMEWORK-08-DOCUMENTATION-STANDARDS.
- Version: 1.0.
- Status: Active specification.
- Owner: Documentation Governance.
- Reviewers: Platform Architecture, Engineering, Product Architecture.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/frameworks/documentation-governance/overview.md`.
- References: `docs/DEVELOPMENT_CONVENTIONS.md`,
  `docs/codex/governance-framework.md`.
- Change history:
  - 1.0: Initial documentation standards baseline.

## Purpose

This document defines the official structure, metadata, naming, writing, and
classification standards for all Laborator Editura documentation.

## Official Documentation Categories

The documentation repository may contain:

- Enterprise Architecture.
- Business Documentation.
- Functional Specifications.
- Technical Specifications.
- Development Standards.
- API Documentation.
- Infrastructure Documentation.
- AI Documentation.
- Security Documentation.
- Operations Documentation.
- User Manuals.
- Administrator Manuals.
- Release Notes.
- Audit and Validation Reports.

## Standard Document Structure

Every official document should contain the following fields when applicable:

- Title.
- Identifier.
- Version.
- Status.
- Owner.
- Reviewers.
- Approval.
- Purpose.
- Scope.
- Dependencies.
- References.
- Change history.

Detailed documents should additionally include:

- Definitions.
- Functional rules.
- Technical rules.
- Security rules.
- Data governance rules.
- AI governance rules where applicable.
- Audit requirements.
- Validation requirements.
- Migration or adoption plan where applicable.

## Status Values

Allowed document statuses are:

- Draft.
- Under Review.
- Active Specification.
- Approved.
- Superseded.
- Archived.

Draft documents may guide discussion, but they are not canonical until
approved. Superseded and archived documents must remain accessible for audit
and historical traceability.

## Naming and Path Rules

Documentation paths must:

- Use English names.
- Use lowercase words separated by hyphens for Markdown files.
- Use module or framework folders that reflect canonical ownership.
- Avoid duplicate files for the same canonical concept.
- Prefer explicit names over vague labels.

Examples:

- `docs/modules/translation/api-contracts.md`.
- `docs/frameworks/data-engineering/data-lineage.md`.
- `docs/frameworks/documentation-governance/versioning.md`.

## Technical Writing Rules

Documentation must be:

- Clear.
- Precise.
- Structured.
- Searchable.
- Consistent with canonical terminology.
- Written in English for technical implementation content.
- Linked to related specifications, modules, decisions, and validation reports.

User-facing UI text examples may include localized labels when needed, but the
technical documentation itself remains English.

## Canonical Ownership

Each subject must have one canonical owner document.

Related documents may reference the owner, summarize it, or describe module
specific implications, but they must not redefine the same rule differently.

Examples:

- Development conventions are owned by `docs/DEVELOPMENT_CONVENTIONS.md`.
- Security architecture is owned by
  `docs/frameworks/security-engineering/overview.md` and supporting security
  documents.
- Documentation governance is owned by
  `docs/frameworks/documentation-governance/overview.md`.

## Cross-Reference Requirements

Documents must link to:

- Parent architecture chapters or frameworks.
- Related modules.
- Related data models.
- API contracts where applicable.
- Tests or validation reports where applicable.
- Release notes or migration plans where applicable.

Cross-references must be maintained when documents move, split, merge, or are
superseded.

## Review Requirements

Canonical documents require review before publication. The review process is
defined in `docs/frameworks/documentation-governance/review-process.md`.

## Compliance

Compliance is evaluated by
`docs/frameworks/documentation-governance/compliance-audit.md`.
