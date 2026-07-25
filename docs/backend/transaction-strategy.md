# Transaction Strategy

## Purpose

Transaction boundaries protect coherent business operations and prevent
partial state changes.

## Target Rules

- Every state-changing use case declares its transaction boundary.
- A transaction covers one business operation.
- Long external calls must not run inside open transactions.
- External events should be published after commit.
- Cross-module state changes should use contracts and, when needed, a saga or
  Outbox pattern.
- Idempotent operations should use scoped idempotency keys.

## Current Baseline

The current runtime database abstraction provides typed table operations,
tenant-scoped helpers, deterministic backup/restore, and validation helpers.

It does not yet expose a formal transaction manager or unit-of-work boundary.
Most application services perform sequential repository operations and audit
appends.

## Risk Areas

- Multi-step operations that write multiple records may partially complete if
  a later write fails.
- Audit event append failure handling is not uniformly documented.
- Future external event publication requires Outbox support.
- Publication, export, backup, webhook, and AI job operations require
  idempotency before external side effects are introduced.

## Required Alignment

Future migration should introduce:

- Transaction port.
- Unit-of-work API.
- Idempotency key storage.
- Outbox storage.
- Explicit consistency tests for critical workflows.

## Acceptance Criteria

- Critical use cases have documented transaction boundaries.
- Audit and state changes remain consistent.
- External operations are not executed before durable state is safe.
- Repeated requests do not create duplicate destructive effects.
