# Deprecation Policy

## Purpose

Deprecation policy ensures that functionality, APIs, operational procedures,
configuration keys, and contracts are retired safely.

## Lifecycle

```text
Supported
  -> Deprecated
  -> Removal Planned
  -> Removed
```

## Deprecation Record

Every deprecation must record:

- Item name.
- Item type.
- Version deprecated.
- Reason.
- Replacement.
- Migration path.
- Removal target version.
- Owner.
- Impacted modules.

## User and Operator Notice

Operators and affected users must be informed before removal through release
notes, migration guides, or operational documentation.

## Removal Rules

Removal is allowed only when:

- Migration path exists.
- Impact has been reviewed.
- Backup and rollback implications are understood.
- Contracts and tests are updated.
- Documentation is updated.

## Current Gaps

- No dedicated deprecation register exists yet.
- Removal target versions are not enforced by CI.
- Deprecation warnings are not standardized across API, UI, and operations.
