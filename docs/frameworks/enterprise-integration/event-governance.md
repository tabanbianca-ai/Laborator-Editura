# Event Governance

## Purpose

Event Governance defines how platform events are named, versioned, produced,
consumed, retained, monitored, and audited.

Events coordinate system reactions and integrations. They do not replace
audit records.

## Event-First Rule

Important cross-module state changes should emit documented events when other
modules, integrations, workflows, search, analytics, or AI processes need to
react asynchronously.

## Required Event Fields

Each event must contain:

- UUID.
- Event name.
- Event version.
- Producer.
- Consumers.
- Schema version.
- Organization id where applicable.
- Workspace id where applicable.
- Project id where applicable.
- Document id where applicable.
- Actor id where applicable.
- Timestamp.
- Correlation id.
- Causation id.
- Idempotency key where applicable.
- Payload.
- Payload schema.
- Data classification.
- Retry policy.
- Retention policy.
- Audit reference when state changes.

## Event Naming

Events should use lowercase dot notation:

```text
domain.action
domain.entity.action
```

Examples:

- `project.created`.
- `translation.submitted`.
- `workflow.blocked`.
- `publication.published`.
- `webhook.delivery.failed`.
- `ai.execution.completed`.

## Event Lifecycle

Lifecycle states:

- `DRAFT`.
- `ACTIVE`.
- `DEPRECATED`.
- `RETIRED`.

Event payload changes require explicit event versioning.

## Producer Rules

Producers must:

- Emit documented event names.
- Include schema version.
- Include correlation id.
- Include causation id when triggered by another event.
- Avoid restricted payload leakage.
- Preserve audit relationship.

## Consumer Rules

Consumers must:

- Be idempotent.
- Declare consumed event versions.
- Validate payload schema.
- Handle duplicates safely.
- Handle out-of-order delivery where possible.
- Report processing failures.

## Current Baseline Assessment

Strengths:

- Event catalog exists in `docs/integration/event-catalog.md`.
- Codex event governance exists in `docs/codex/events.md`.
- Workflow and module event documentation exists.
- Gateway audit and webhook delivery logs exist.

Gaps:

- Unified event bus runtime is not implemented.
- Event schema registry is not implemented.
- Event consumer registry is not implemented.
- Dead-letter handling is not implemented.
- Event retention policy is not centrally enforced.

## Standardization Plan

1. Treat documented event catalog as current baseline.
2. Map domain events to owner modules.
3. Define event schema registry.
4. Define producer and consumer registry.
5. Define retry and dead-letter policies.
6. Implement event bus only in a future approved phase.
