# Rights and Provenance Workflows

## Purpose

Rights workflows define how legal records move from draft metadata to active,
approved, expired, or revoked rights without duplicating the Workflow Engine.

## Target Workflow

```text
RIGHTS_DRAFT
  -> VERIFICATION
  -> LEGAL_REVIEW
  -> APPROVED
  -> ACTIVE
  -> EXPIRED / REVOKED
```

Workflow orchestration must be administered by the Workflow Engine.

## Current Workflow Baseline

Current implementation provides:

- Collaboration agreement statuses: `DRAFT`, `SENT`, `ACCEPTED`, `EXPIRED`,
  `TERMINATED`.
- Translation authorization boolean state.
- Publishing authorization boolean state.
- Rights warnings for missing, unauthorized, or expired rights.
- Publishing preflight rights validation.
- Human Final Authority flags in rights audit.

## Target Workflow Rules

- Draft records may be created by authorized users.
- Verification checks provenance, license, contract, language, format,
  territory, and expiration.
- Legal review requires authorized human review.
- Approved rights may become active.
- Expired rights must block new publication actions.
- Revoked rights must immediately block relevant reuse and publication.
- Historical legal states must remain immutable.

## Roles

Roles involved:

- Administrator.
- Legal Manager.
- Editor.
- Publisher.
- Reviewer.
- Auditor.

Only authorized roles may modify legal information.

## Integration With Publishing

Publishing must call Rights and Provenance validation before:

- Ready for publishing.
- Publication build.
- Publication approval.
- Public release.
- Distribution.
- Republication.

## Current Gaps

- Legal Manager and Auditor are not yet first-class role-specific workflow
  actors in the rights module.
- Rights Draft, Verification, Legal Review, Approved, Active, Expired, and
  Revoked states are not unified across all rights records.
- Workflow Engine integration is warning/preflight-based rather than a
  canonical rights workflow instance.
- Revocation workflow is not implemented.
