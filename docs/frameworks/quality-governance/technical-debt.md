# Technical Debt Management

## Document Control

- Title: Technical Debt Management.
- Identifier: FRAMEWORK-09-TECHNICAL-DEBT.
- Version: 1.0.
- Status: Active specification.
- Owner: Quality Governance.
- Reviewers: Engineering Governance, Platform Architecture, Security
  Governance, Operations.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/frameworks/quality-governance/overview.md`,
  `docs/frameworks/quality-governance/quality-metrics.md`.
- References: `docs/codex/change-management.md`,
  `docs/frameworks/platform-engineering/operations.md`.
- Change history:
  - 1.0: Initial technical debt management baseline.

## Purpose

This document defines how technical debt is identified, classified, owned,
tracked, remediated, audited, and considered in release decisions.

## Technical Debt Record

Every technical debt item must record:

- UUID.
- Description.
- Impact.
- Priority.
- Severity.
- Affected modules.
- Affected frameworks.
- Owner.
- Remediation plan.
- Target version.
- Completion status.
- Date identified.
- Reviewer.
- Related quality metric.
- Related architecture review.

## Severity Levels

Allowed severity levels:

- Critical.
- High.
- Medium.
- Low.

Critical debt blocks production readiness unless an approved exception exists.
High debt must have an owner, target version, and remediation plan before
release.

## Priority Levels

Allowed priority levels:

- P0: Immediate remediation required.
- P1: Required before release or before the affected capability expands.
- P2: Required in the next planned stabilization cycle.
- P3: Improvement or cleanup.

## Debt Categories

Technical debt may include:

- Architecture debt.
- Code debt.
- Test debt.
- Documentation debt.
- Data model debt.
- Security debt.
- AI governance debt.
- Operational debt.
- Performance debt.
- UX accessibility debt.
- Integration debt.

## Lifecycle

Technical debt follows this lifecycle:

1. Identified.
2. Classified.
3. Assigned.
4. Planned.
5. In Remediation.
6. Validated.
7. Closed.
8. Archived.

Closed debt must remain auditable.

## Release Rules

Release decisions must consider:

- Open Critical debt.
- Open High debt.
- Approved exceptions.
- Remediation target dates.
- Security and data integrity impact.
- Operational impact.
- Customer or editorial impact.

No debt item may be hidden to achieve release approval.

## Current Baseline Assessment

The repository includes gap analyses and migration plans across many module
and framework documents. These are valuable debt inputs, but they are not yet
merged into one canonical technical debt inventory.

## AI Rules

AI may identify candidate debt, cluster related items, estimate impact, and
draft remediation plans. AI must not close debt, approve exceptions, or hide
debt from release review.
