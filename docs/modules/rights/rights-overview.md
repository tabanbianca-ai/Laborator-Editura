# Rights and Provenance Module Overview

## Purpose

The Rights and Provenance Module centrally manages intellectual property,
copyright, translation rights, publishing rights, licenses, contracts,
provenance, and legal history for editorial resources.

No resource should be published without validation from this module.

## Status

Phase II - Module 5.

Official implementation specification.

Version: 1.0.

## Scope

The module manages:

- Authors.
- Rights holders.
- Contracts.
- Licenses.
- Public domain status.
- Usage restrictions.
- Rights expiration.
- Original source references.
- Rights transfer history.
- Legal and compliance checks.
- Provenance for Library resources.

## Current Repository Baseline

Current implementation already includes a lightweight Rights and Provenance
foundation:

- `rights-provenance` backend module.
- Collaboration agreements for authors, translators, editors, designers,
  illustrators, audio narrators, and collaborators.
- Translation authorization records.
- Publishing authorization records.
- Provenance records.
- Rights audit events.
- Rights workspace frontend at `/rights`.
- Rights warning integration with Publishing Workspace and Distribution
  Center.
- Runtime database tables for rights agreements, authorizations, provenance,
  and audit.
- Backup/restore support for rights tables.
- Contract tests for rights APIs, audit, AI limits, persistence, and frontend
  workspace behavior.

The current baseline is intentionally lightweight. It does not yet include a
single canonical `RightsRecord`, versioned license entities, full contract
lifecycle, rights holder registry, rights transfer history, or full legal
workflow state.

## Principles

- Rights by Design.
- Provenance First.
- Immutable Legal History.
- Traceable Ownership.
- Contract Driven.
- Compliance by Default.
- Audit by Default.
- Non-Repudiation.
- Human Final Authority.

## Canonical Rights Flow

```text
Library Item
  -> Provenance Verification
  -> Rights Validation
  -> License Validation
  -> Contract Verification
  -> Publishing Authorization
```

## Integration Boundary

All modules must consume rights and provenance decisions through public Rights
contracts.

Modules must not implement independent rights systems.

Rights and Provenance integrates with:

- Library.
- Publishing.
- Translation.
- Audio.
- Video.
- Workflow Engine.
- Audit.
- Notifications.

## AI Rule

AI may summarize agreements, detect missing permissions, detect expired
permissions, and identify missing provenance.

AI must not:

- Approve agreements.
- Authorize translations.
- Authorize publication.
- Modify validated provenance automatically.
- Revoke or transfer rights.
- Bypass Workflow or Human Final Authority.

## Acceptance Criteria

The module is compliant when:

- Every Library Item has verifiable provenance.
- Every legal right is explicitly represented.
- Contracts and licenses are linked to resources.
- Licenses and contracts are versioned and auditable.
- Missing or invalid rights automatically block publication.
- Legal history is complete and immutable.
- Validations are integrated with Workflow Engine.
- Existing Phase 7 Step 16 publishing/preflight/distribution behavior is
  preserved.
