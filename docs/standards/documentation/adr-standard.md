# Architecture Decision Record Standard

## Purpose

This document defines the canonical model for Architecture Decision Records in
Laborator Editura.

## ADR Record

Every ADR must include:

- ADR ID.
- Title.
- Status.
- Date.
- Owner.
- Approver.
- Context.
- Problem statement.
- Options analyzed.
- Decision.
- Consequences.
- Rejected alternatives.
- Related modules.
- Related standards.
- Related requirements.
- Related risks.
- Related tests.
- Review date.
- Audit information.

## ADR Status

Canonical ADR statuses are:

- `PROPOSED`.
- `ACCEPTED`.
- `SUPERSEDED`.
- `DEPRECATED`.
- `REJECTED`.

## ADR Rules

- Architecture-impacting decisions require an ADR before implementation.
- Approved ADRs must not be overwritten.
- Superseded ADRs must preserve the previous decision and point to the new
  decision.
- Rejected alternatives must remain visible because they explain why a path was
  not chosen.
- ADRs must link to all affected standards, modules, APIs, events, data
  ownership rules, workflows, risks, and tests.
- AI may summarize options and consequences, but it must not approve ADRs or
  change architectural decisions.

## Current Baseline

The repository currently contains an Architecture Decision Records overview at:

- `docs/modules/enterprise-architecture/architecture-decision-records.md`.

Future ADR work should use this standard as the canonical structure while
preserving existing identifiers, versions, approvals, and history.

