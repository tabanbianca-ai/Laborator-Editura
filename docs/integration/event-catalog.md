# Event Catalog

## Purpose

This document defines the baseline event catalog for integration and
interoperability.

Events coordinate system reactions and external integrations. They do not
replace audit records.

## Event Naming

Events use lowercase dot notation:

```text
domain.action
domain.entity.action
```

Examples:

- `publication.created`.
- `publication.updated`.
- `translation.completed`.
- `workflow.completed`.
- `audio.generated`.
- `video.generated`.

## Event Contract

Every event must define:

- `eventId`.
- `eventName`.
- `eventVersion`.
- `organizationId`.
- `workspaceId` when applicable.
- `projectId` when applicable.
- `documentId` when applicable.
- `actorId` when applicable.
- `correlationId`.
- `idempotencyKey` when applicable.
- `occurredAt`.
- `payload`.
- `payloadSchema`.
- `dataClassification`.
- `auditRef` when state changes.

## Core Event Families

Project and document events:

- `project.created`.
- `project.updated`.
- `document.created`.
- `document.updated`.
- `document.approved`.

Translation events:

- `translation.submitted`.
- `translation.completed`.
- `translation.memory.proposal_created`.
- `terminology.violation.detected`.
- `semantic_fidelity.issue.detected`.

Workflow events:

- `workflow.started`.
- `workflow.completed`.
- `workflow.blocked`.
- `workflow.unblocked`.
- `approval.requested`.
- `approval.granted`.
- `approval.rejected`.

Publishing events:

- `publication.created`.
- `publication.updated`.
- `publication.ready`.
- `publication.published`.
- `publication.withdrawn`.
- `distribution.initiated`.
- `distribution.delivered`.
- `distribution.failed`.

Media events:

- `audio.generated`.
- `video.generated`.
- `subtitle.generated`.
- `media.localization.completed`.

Integration events:

- `integration.created`.
- `integration.enabled`.
- `integration.disabled`.
- `webhook.created`.
- `webhook.delivery.completed`.
- `webhook.delivery.failed`.

Security and governance events:

- `api_key.created`.
- `api_key.revoked`.
- `policy.evaluated`.
- `restricted_access.attempted`.

AI events:

- `ai.execution.requested`.
- `ai.execution.completed`.
- `ai.execution.failed`.
- `ai.execution.blocked_by_policy`.
- `ai.provider.fallback_activated`.
- `ai.provider.fallback_recovered`.

## Versioning

Event payload changes require explicit event versioning.

Consumers must not depend on undocumented fields.

## Current Baseline

Workflow event documentation already exists in `docs/workflow/workflow-events.md`.
Gateway audit and webhook delivery logs exist in runtime metadata. A unified
event bus is not yet implemented.

## Event Governance

Every event family must have:

- Owner.
- Contract.
- Payload schema.
- Compatibility policy.
- Retention policy.
- Audit relationship.
- Observability relationship.
