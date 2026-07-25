# Contract Management

## Purpose

Contract Management links legal agreements to Library resources, rights
holders, formats, languages, territories, validity periods, and restrictions.

Contracts are not managed as a legal ERP. Contract files are Library assets;
Rights and Provenance stores legal metadata, references, validation state, and
history.

## Target Contract Fields

Each contract should include:

- Identifier.
- Contracting parties.
- Subject.
- Territory.
- Languages.
- Formats.
- Validity period.
- Restrictions.
- Attached document asset references.
- Version.
- Status.
- Approval and validation metadata.
- Audit trail.

## Current Baseline

Current implementation includes `CollaborationAgreement` with:

- Agreement type.
- Status: `DRAFT`, `SENT`, `ACCEPTED`, `EXPIRED`, `TERMINATED`.
- Collaborator id and name.
- Start and end dates.
- Attached document metadata.
- Notes.
- Project/document references.
- Audit on creation.

Library also includes:

- `contractRefs`.
- Publication restrictions.

## Target Contract Lifecycle

Contract lifecycle should support:

- Draft.
- Sent.
- Signed/Accepted.
- Active.
- Expired.
- Renewed.
- Amended.
- Terminated.
- Revoked.

## Contract Validation

Before publication or reuse, contract validation should check:

- Contract exists when required.
- Contract is accepted/active.
- Contract has not expired.
- Requested format is covered.
- Requested territory is covered.
- Requested language is covered.
- Restrictions do not block the action.
- Attached evidence is available as Library asset reference.

## Current Gaps

- Contract files are referenced by metadata, not first-class Library Asset
  links.
- Contract parties are not structured beyond collaborator metadata.
- Contract amendments and renewals are not modeled.
- Legal review/approval workflow is not complete.
- Contract expiration does not yet run through asynchronous checks.
- Rights transfer history is not modeled.

## Non-Repudiation Rule

Contract history must be immutable. Corrections, amendments, renewals, and
terminations must create new auditable records or versions.
