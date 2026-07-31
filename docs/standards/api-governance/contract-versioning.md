# Contract Versioning Standard

## Purpose

This document defines how API, event, webhook, connector, and service
contracts are versioned, evolved, deprecated, and retired.

## Version Format

All governed contracts must use Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

- `MAJOR` changes for breaking contract changes.
- `MINOR` changes for backward-compatible additions.
- `PATCH` changes for clarifications, documentation fixes, or compatible
  corrections.

## Required Contract Metadata

Every governed contract must define:

- Contract ID.
- Contract name.
- Contract version.
- Contract owner.
- Contract family.
- Lifecycle status.
- Audience.
- Producer.
- Consumers.
- Change history.
- Compatibility matrix.
- Deprecation policy.
- Security requirements.
- Observability requirements.
- Audit requirements.

## Lifecycle States

Canonical contract lifecycle:

- `DRAFT`.
- `UNDER_REVIEW`.
- `APPROVED`.
- `ACTIVE`.
- `DEPRECATED`.
- `RETIRED`.

Only `ACTIVE` contracts may be treated as stable external integration
contracts.

## Breaking Changes

Breaking changes include:

- Removing a required field.
- Renaming a field.
- Changing a field type incompatibly.
- Changing authentication requirements.
- Changing authorization semantics.
- Changing idempotency behavior.
- Changing error codes incompatibly.
- Changing event meaning.
- Removing an endpoint, event, webhook, or provider capability.

Breaking changes require:

- New major version.
- Impact analysis.
- Compatibility matrix update.
- Migration guide.
- Deprecation notice where an old version remains temporarily available.
- Approval by the contract owner and authorized architecture governance.

## Non-Breaking Changes

Non-breaking changes include:

- Adding optional fields.
- Adding new endpoints.
- Adding new event types.
- Adding new response metadata.
- Adding optional filters.
- Clarifying documentation.
- Adding new provider metadata fields without changing existing behavior.

Non-breaking changes still require version, documentation, tests where
applicable, and audit.

## Deprecation Policy

Deprecation must define:

- Deprecated contract version.
- Replacement contract version.
- Deprecation date.
- Retirement date.
- Affected consumers.
- Migration instructions.
- Compatibility window.
- Owner approval.
- Exception process.

No deployed consumer may be silently broken.

## Compatibility Matrix

Compatibility records should include:

| Producer version | Consumer version | Status | Notes |
| --- | --- | --- | --- |
| `1.0.0` | `1.0.0` | Compatible | Baseline |
| `1.1.0` | `1.0.0` | Compatible | Optional fields only |
| `2.0.0` | `1.0.0` | Incompatible | Migration required |

## Audit Requirements

Audit must record:

- Contract created.
- Contract approved.
- Contract version changed.
- Compatibility changed.
- Deprecation announced.
- Contract retired.
- Exception approved.
- Consumer migration completed.

## Relationship to Data Model

Contract payloads must align with `docs/standards/data-model/overview.md`.
Schema evolution must remain traceable to affected APIs, events, webhooks,
backups, exports, AI context, and documentation.

