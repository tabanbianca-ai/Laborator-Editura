# Integration Events

## Purpose

This document defines official events for the Integration, API Gateway and
External Connectors Module.

Events coordinate gateway changes, connector lifecycle, webhook delivery,
rate-limit outcomes, API version lifecycle, contract changes, and integration
observability. They do not replace audit records.

## Event Envelope

Each event should include:

- `eventId`.
- `eventName`.
- `eventVersion`.
- `organizationId`.
- `sourceModule`.
- `consumerId` when applicable.
- `connectorId` when applicable.
- `webhookId` when applicable.
- `apiDefinitionId` when applicable.
- `correlationId`.
- `traceId`.
- `idempotencyKey`.
- `occurredAt`.
- `payload`.

## Official Events

Connector events:

- `ConnectorCreated`.
- `ConnectorUpdated`.
- `ConnectorDeleted`.
- `ConnectionTestRequested`.
- `ConnectionSucceeded`.
- `ConnectionFailed`.
- `ConnectorEnabled`.
- `ConnectorDisabled`.

Webhook events:

- `WebhookCreated`.
- `WebhookEnabled`.
- `WebhookDisabled`.
- `WebhookDeliveryStarted`.
- `WebhookDelivered`.
- `WebhookFailed`.
- `WebhookDeadLettered`.

API and gateway events:

- `APIDefinitionCreated`.
- `APIVersionPublished`.
- `APIVersionDeprecated`.
- `APIContractUpdated`.
- `GatewayRouteRegistered`.
- `GatewayRouteChanged`.

Rate limit events:

- `RateLimitExceeded`.
- `RateLimitPolicyCreated`.
- `RateLimitPolicyUpdated`.

Security events:

- `APIKeyCreated`.
- `APIKeyRevoked`.
- `IntegrationAuthenticationFailed`.
- `WebhookSignatureInvalid`.

## Current Repository Baseline

Current runtime audit actions include:

- `API_KEY_CREATED`.
- `API_KEY_REVOKED`.
- `WEBHOOK_CREATED`.
- `WEBHOOK_ENABLED`.
- `WEBHOOK_DISABLED`.
- `WEBHOOK_DELIVERY_LOG_RECORDED`.
- `INTEGRATION_CREATED`.
- `INTEGRATION_ENABLED`.
- `INTEGRATION_DISABLED`.

No central Integration event bus runtime exists yet.

## Event Rules

- Events must be versioned.
- Events must be tenant-scoped.
- Events must preserve correlation ID and trace ID where available.
- Events must not contain secrets or raw provider credentials.
- Webhook events must support idempotency and replay-safe delivery.
- Notification delivery must route through Notification and Communication.
- Observability must track latency, error count, retries, and rate-limit
  events.
- Audit remains immutable and authoritative for state-changing actions.
