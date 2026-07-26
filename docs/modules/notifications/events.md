# Notification and Communication Events

## Purpose

This document defines official events for the Notification and Communication
Module.

Events are append-only process evidence. They must not replace audit events.

## Event Envelope

Each event should include:

- `eventId`.
- `eventName`.
- `eventVersion`.
- `organizationId`.
- `sourceModule`.
- `sourceEventId`.
- `notificationId`.
- `deliveryId`.
- `recipientUserId`.
- `correlationId`.
- `idempotencyKey`.
- `occurredAt`.
- `payload`.

## Official Events

Core events:

- `NotificationCreated`.
- `NotificationTemplateRendered`.
- `NotificationQueued`.
- `NotificationSent`.
- `NotificationDelivered`.
- `NotificationFailed`.
- `NotificationRetried`.
- `NotificationDeadLettered`.

Preference events:

- `NotificationPreferenceUpdated`.
- `NotificationChannelSkipped`.

Template events:

- `NotificationTemplateCreated`.
- `NotificationTemplateVersionCreated`.
- `NotificationTemplateActivated`.
- `NotificationTemplateSuspended`.

Webhook events:

- `WebhookDeliveryQueued`.
- `WebhookDelivered`.
- `WebhookFailed`.
- `WebhookRetried`.
- `WebhookDeadLettered`.

## Event Sources

Notification requests may originate from:

- Workflow Engine.
- Scheduling.
- Library.
- Translation.
- Editorial Review.
- Rights and Provenance.
- Magazine.
- AI Orchestration.
- Audio.
- Video.
- Publishing.
- Distribution.
- Security.
- Administration.
- Backup and recovery.
- Gateway integrations.

## Event Rules

- Events must be versioned.
- Events must be tenant-scoped.
- Events must not contain secrets.
- Events must not contain restricted content unless policy allows it.
- Events must preserve correlation ID.
- Events must preserve source event reference.
- Events must be idempotent where retryable.

## Current Repository Baseline

Existing related events/audit:

- Gateway audit events cover webhook creation, enablement, disablement, and
  delivery log creation.
- Scheduling audit events cover reminder creation.
- Workflow audit events cover transitions and approvals.
- Observability records can capture logs, metrics, and traces.

No Notification-specific event contract was identified.
