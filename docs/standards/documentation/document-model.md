# Canonical Documentation Model

## Purpose

This document defines the required metadata and lifecycle model for every
governed documentation artifact in Laborator Editura.

## Canonical Document Record

Every governed document must preserve:

- UUID.
- Canonical identifier.
- Document title.
- Document type.
- Owner.
- Approver.
- Status.
- Version.
- Related modules.
- Related standards.
- Dependencies.
- Review cycle.
- Metadata.
- Audit information.

## Document Types

Canonical document types are:

- `FUNCTIONAL_SPECIFICATION`.
- `TECHNICAL_SPECIFICATION`.
- `ARCHITECTURE_DECISION_RECORD`.
- `API_SPECIFICATION`.
- `DATABASE_SPECIFICATION`.
- `AI_SPECIFICATION`.
- `WORKFLOW_SPECIFICATION`.
- `UI_SPECIFICATION`.
- `DEPLOYMENT_GUIDE`.
- `OPERATIONS_GUIDE`.
- `USER_GUIDE`.
- `ADMINISTRATOR_GUIDE`.
- `STANDARD`.
- `FRAMEWORK`.
- `POLICY`.

## Lifecycle Status

Documentation lifecycle statuses are:

- `DRAFT`.
- `UNDER_REVIEW`.
- `APPROVED`.
- `ACTIVE`.
- `SUPERSEDED`.
- `ARCHIVED`.

Approved versions must not be overwritten. New changes require a new version or
an auditable revision record.

## Ownership Rules

- Every document must have exactly one accountable owner.
- Every approved document must have an approver.
- Shared documents may list multiple related modules, but ownership remains
  singular.
- Cross-cutting standards and frameworks own canonical definitions for their
  domain.
- Local documents may describe local implications, but must not redefine
  canonical concepts differently.

## Metadata Rules

Every document should include or be mappable to:

- Creation date.
- Last update date.
- Review date.
- Next review date.
- Approval state.
- Source file path.
- Canonical owner.
- Related requirements.
- Related tests.
- Related risks.
- Related policies.
- Related ADRs.
- Search tags.
- AI indexing classification.

## Audit Rules

Audit must cover:

- Document created.
- Document modified.
- Document approved.
- Document rejected.
- Document versioned.
- Document relationship changed.
- Document archived.
- Document logically deleted.

