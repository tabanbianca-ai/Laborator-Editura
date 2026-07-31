# Lifecycle

## Document Control

- Title: Lifecycle.
- Identifier: STANDARD-01-LIFECYCLE.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Platform Architecture.
- Reviewers: Quality Governance, Documentation Governance, Release
  Governance, Security Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/naming-versioning/overview.md`.
- References: `docs/frameworks/quality-governance/final-certification.md`,
  `docs/frameworks/documentation-governance/publication-process.md`.
- Change history:
  - 1.0.0: Initial lifecycle standard baseline.

## Purpose

This document defines the canonical lifecycle states for platform artifacts.

## Standard Lifecycle

All governed objects use this lifecycle unless a specialized lifecycle is
explicitly approved:

```text
Draft
  -> Under Review
  -> Approved
  -> Released
  -> Deprecated
  -> Archived
```

## Lifecycle States

### Draft

The artifact is proposed, incomplete, or under active creation. It is not
canonical and must not be treated as production-ready.

### Under Review

The artifact is ready for structured review. Reviewers evaluate compliance,
quality, impact, security, documentation, and compatibility.

### Approved

The artifact has received authorized approval. Approval does not always mean
released or deployed.

### Released

The artifact is active, published, deployed, or available for official use.

### Deprecated

The artifact remains available for compatibility or historical use, but it
should not be used for new work.

### Archived

The artifact is no longer active. It must remain traceable and recoverable
where required by audit, legal, security, or historical preservation rules.

## Transition Rules

Lifecycle transitions require:

- Owner.
- Reason.
- Date.
- Version.
- Approval where required.
- Impact assessment where required.
- Audit event.

## Restricted Transitions

An artifact must not move to `Released` when:

- Required metadata is missing.
- Required review is missing.
- Critical quality, security, data, or architecture findings are unresolved.
- Human approval is required but absent.
- AI approval is used instead of human approval.

An artifact must not be permanently deleted when archival or audit is
required.

## Specialized Lifecycles

Some artifact families may define additional states, such as:

- API deprecation states.
- Database migration states.
- Workflow states.
- AI model evaluation states.
- Publication states.
- Security incident states.

Specialized lifecycles must map back to the standard lifecycle for governance
reporting.

## Lifecycle Audit

Audit must cover:

- State created.
- State changed.
- Approval granted.
- Release performed.
- Deprecation declared.
- Archive completed.
- Exception approved.

## AI Rules

AI may recommend lifecycle transitions and explain impact. AI must not approve
or execute lifecycle transitions requiring human authority.
