# Event Standard

## Purpose

This document defines the canonical event and message contract rules for
Laborator Editura.

Events coordinate asynchronous reactions and integrations. They do not replace
audit records.

## Event Naming

Canonical event names should use past-tense domain language and be stable
contracts.

Recommended external display form:

```text
BookPublished
TranslationCompleted
PublicationReleased
WorkflowApproved
PromptValidated
AudioGenerated
```

Current internal catalogs may use lowercase dot notation, such as
`translation.completed` or `workflow.blocked`. These names remain valid until
an approved event naming migration maps them to the canonical registry.

## Event Envelope

Every governed event must define:

```json
{
  "eventId": "evt_01H...",
  "eventName": "TranslationCompleted",
  "eventVersion": "1.0.0",
  "eventType": "domain",
  "source": "translation",
  "timestamp": "2026-07-31T00:00:00.000Z",
  "correlationId": "corr_01H...",
  "payload": {},
  "metadata": {}
}
```

Additional fields are required when applicable:

- `causationId`.
- `idempotencyKey`.
- `organizationId`.
- `workspaceId`.
- `projectId`.
- `documentId`.
- `actorId`.
- `auditRef`.
- `dataClassification`.
- `schemaRef`.

## Event Types

Canonical event types:

- `domain`.
- `workflow`.
- `audit`.
- `integration`.
- `security`.
- `ai`.
- `system`.
- `webhook`.

## Producer Rules

Event producers must:

- Emit only documented event contracts.
- Include event version.
- Include correlation ID.
- Include causation ID when the event was triggered by another event.
- Include tenant and resource scope when applicable.
- Exclude secrets and restricted payload fields.
- Preserve audit relationship when state changes.
- Preserve idempotency metadata when retries are possible.

## Consumer Rules

Event consumers must:

- Declare consumed event names and versions.
- Validate payload schema before processing.
- Process duplicate events safely.
- Handle missing optional fields safely.
- Handle out-of-order delivery when possible.
- Record failures with correlation ID.
- Avoid direct dependencies on producer implementation details.

## Payload Rules

Event payloads must:

- Use canonical data fields where available.
- Reference large content or files by identifier, not inline blobs.
- Preserve data classification.
- Preserve source object identifiers.
- Avoid exposing private editorial, rights, or security data unless required
  and authorized.

## Versioning

Event payload changes require explicit event versioning.

Non-breaking changes may add optional fields. Breaking changes require a new
major version, compatibility plan, and consumer migration plan.

## Retention and Replay

Every event family must define:

- Retention policy.
- Replay policy.
- Dead-letter handling plan where runtime queues exist.
- Consumer retry policy.
- Audit relationship.

## Current Baseline

Current event documentation exists in:

- `docs/integration/event-catalog.md`.
- `docs/codex/events.md`.
- `docs/modules/*/events.md`.
- `docs/backend/eventing-and-messaging.md`.

A unified runtime event bus is not yet implemented. Until approved, documented
events remain canonical design contracts and audit references.

