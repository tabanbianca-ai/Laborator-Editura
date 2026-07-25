# Eventing and Messaging

## Purpose

Eventing and messaging allow modules to communicate facts, trigger asynchronous
work, and integrate with external systems while preserving module boundaries.

## Domain Events

Domain events describe facts that occurred inside a domain aggregate.

Examples:

- `ManuscriptCreated`.
- `TranslationSubmitted`.
- `ReviewApproved`.
- `PublicationReleased`.
- `RightsExpired`.

Rules:

- Use past tense.
- Be immutable.
- Include stable identifiers.
- Avoid unnecessary sensitive data.
- Remain independent from transport technology.

## Integration Events

Integration events communicate with other modules or systems.

Examples:

- `publication.released.v1`.
- `translation.completed.v1`.
- `workflow.task.assigned.v1`.

Rules:

- Version every event contract.
- Document payloads.
- Preserve backward compatibility when practical.
- Include organization or workspace context where applicable.
- Include correlation ID.

## Current Baseline

The current backend has extensive audit event persistence and integration
metadata foundations:

- Module-specific audit event tables exist in runtime database state.
- Gateway and webhook metadata foundations exist.
- Observability stores metrics, logs, traces, and agent execution metadata.
- Publishing, Library, Rights, Workflow, AI Governance, and related modules
  create auditable records.

The backend does not yet have a central event bus, queue adapter, outbox table,
or Dead Letter Queue.

## Messaging Requirements

Messaging must support:

- Synchronous handlers.
- Asynchronous queues.
- Retries.
- Dead Letter Queue.
- Idempotent consumers.
- Correlation ID propagation.
- Tenant/workspace context propagation.

Messaging must not hide unclear module dependencies.

## Outbox Requirement

When a use case writes state and must publish an external event, it should use
an Outbox pattern so that the state change and event publication are reliable.

## Acceptance Criteria

- Events are documented and versioned.
- Critical state changes remain auditable.
- Event publication is reliable when external consumers are involved.
- Failed event delivery is observable and retryable.
