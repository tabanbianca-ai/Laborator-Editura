# Notification and Communication Domain Model

## Purpose

This document defines the conceptual domain model for the Notification and
Communication Module.

The model is technology-independent and describes the entities required for a
centralized communication engine.

## Aggregate Ownership

Notification and Communication owns:

- Notification.
- Notification Template.
- Notification Template Version.
- Notification Preference.
- Notification Delivery.
- Notification Delivery Attempt.
- Notification Channel.
- Notification Queue Item.
- Notification Retry Policy.
- Notification Dead Letter Item.
- Communication Audit Event.

Gateway currently owns:

- Webhook registration.
- Webhook secret metadata.
- Webhook delivery log records.

Future migration may move webhook dispatch orchestration behind Notification
Engine while preserving Gateway ownership for API access and integration
security.

## Notification

Represents one communication request created from an application event or
direct API request.

Fields:

- `notificationId`.
- `organizationId`.
- `sourceEventId`.
- `sourceModule`.
- `notificationType`.
- `priority`.
- `recipientUserId`.
- `recipientAddress`.
- `recipientRole`.
- `targetResourceType`.
- `targetResourceId`.
- `channelsRequested`.
- `channelsSelected`.
- `status`.
- `createdAt`.
- `queuedAt`.
- `deliveredAt`.
- `expiresAt`.

Statuses:

- `CREATED`.
- `TEMPLATE_RENDERED`.
- `QUEUED`.
- `SENT`.
- `DELIVERED`.
- `FAILED`.
- `RETRYING`.
- `DEAD_LETTERED`.
- `CANCELLED`.

## Notification Template

Represents a reusable message definition.

Fields:

- `templateId`.
- `organizationId`.
- `name`.
- `templateKey`.
- `channel`.
- `status`.
- `defaultLocale`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Statuses:

- `DRAFT`.
- `ACTIVE`.
- `SUSPENDED`.
- `ARCHIVED`.

## Notification Template Version

Represents an immutable template body used for rendering.

Fields:

- `templateVersionId`.
- `templateId`.
- `version`.
- `locale`.
- `subject`.
- `body`.
- `variables`.
- `conditions`.
- `brandingProfileId`.
- `approvedBy`.
- `approvedAt`.
- `createdAt`.

Activated template versions cannot be overwritten.

## Notification Preference

Represents user communication preferences.

Fields:

- `preferenceId`.
- `organizationId`.
- `userId`.
- `notificationType`.
- `channel`.
- `enabled`.
- `quietHours`.
- `preferredLocale`.
- `frequency`.
- `updatedAt`.

Preferences must not disable mandatory security, compliance, workflow, rights,
or Human Final Authority messages unless policy explicitly allows it.

## Notification Delivery

Represents selected channel delivery for one notification.

Fields:

- `deliveryId`.
- `notificationId`.
- `organizationId`.
- `channel`.
- `adapterName`.
- `status`.
- `attemptCount`.
- `lastAttemptAt`.
- `deliveredAt`.
- `providerMessageId`.
- `safeErrorMessage`.

## Notification Delivery Attempt

Represents each send attempt.

Fields:

- `attemptId`.
- `deliveryId`.
- `organizationId`.
- `attemptNumber`.
- `status`.
- `startedAt`.
- `completedAt`.
- `responseStatus`.
- `safeErrorMessage`.
- `correlationId`.

## Notification Queue Item

Represents queued asynchronous delivery work.

Fields:

- `queueItemId`.
- `notificationId`.
- `deliveryId`.
- `organizationId`.
- `priority`.
- `scheduledFor`.
- `idempotencyKey`.
- `status`.
- `lockedAt`.
- `processedAt`.

## Notification Retry Policy

Defines retry behavior.

Fields:

- `retryPolicyId`.
- `organizationId`.
- `channel`.
- `maxAttempts`.
- `backoffStrategy`.
- `backoffSeconds`.
- `retryableErrors`.
- `deadLetterAfterAttempts`.
- `status`.

## Communication Audit Event

Every communication action must be auditable.

Fields:

- `auditEventId`.
- `organizationId`.
- `notificationId`.
- `deliveryId`.
- `templateId`.
- `action`.
- `actorId`.
- `systemActor`.
- `beforeState`.
- `afterState`.
- `createdAt`.

## Security and Privacy Rules

- Notifications must be tenant-scoped.
- Recipient resolution must follow Need-to-Know access.
- Restricted content must not be leaked into email, push, webhook, or external
  channels.
- External messages should use safe summaries and links to authenticated
  platform views when content is restricted.
- Secrets must never be stored in templates or notification payloads.
- Delivery errors must be safe to log.
