# Integration Domain Model

## Purpose

This document defines the canonical domain model for the Integration, API
Gateway and External Connectors Module.

## Aggregate Ownership

Integration owns interoperability metadata. It does not own domain data,
identity data, provider secrets, or external provider business records.

| Entity | Owner | Purpose |
| --- | --- | --- |
| `ApiDefinition` | Integration | Stable API contract metadata and lifecycle. |
| `GatewayRoute` | Integration | Registered route, version, rate limit, trace, and tenant metadata. |
| `ApiConsumer` | Integration | External or internal consumer metadata and access policy. |
| `ApiKey` | Integration | Scoped credential metadata and revocation state. |
| `Connector` | Integration | External provider connector metadata and health state. |
| `ConnectorHealthCheck` | Integration | Provider availability and diagnostic metadata. |
| `WebhookSubscription` | Integration | Webhook subscription, target, signing, retry, and state. |
| `WebhookDelivery` | Integration | Delivery attempt metadata. |
| `IntegrationEventRoute` | Integration | Event gateway routing contract. |
| `RateLimitPolicy` | Integration | Request quota, burst, concurrency, and tenant policy metadata. |
| `IntegrationAuditEvent` | Integration | Immutable audit record for integration actions. |

## ApiDefinition

Required fields:

- `id`.
- `organizationId`.
- `name`.
- `version`.
- `protocol`.
- `owner`.
- `status`.
- `documentation`.
- `lifecycle`.
- `createdAt`.
- `updatedAt`.

Protocols:

- `REST`.
- `GRAPHQL`.
- `WEBHOOK`.
- `WEBSOCKET`.
- `EVENT_STREAMING`.
- `GRPC`.

Statuses:

- `DRAFT`.
- `ACTIVE`.
- `DEPRECATED`.
- `RETIRED`.

## GatewayRoute

Current runtime mapping:

- `gateway_route_registry`.

Current fields include:

- `id`.
- `organizationId`.
- `moduleName`.
- `routePath`.
- `method`.
- `apiVersion`.
- `tenantAware`.
- `rateLimitPolicy`.
- `tracingEnabled`.
- `correlationIdRequired`.
- `createdAt`.

## ApiConsumer

Required fields:

- `id`.
- `organizationId`.
- `clientId`.
- `name`.
- `scopes`.
- `rateLimits`.
- `credentialsRef`.
- `status`.
- `createdAt`.
- `updatedAt`.

Current runtime baseline:

- API consumer behavior is represented partially through Gateway API keys.

## ApiKey

Current runtime mapping:

- `gateway_api_keys`.

Current fields include:

- `id`.
- `organizationId`.
- `name`.
- `keyPrefix`.
- `secretHash`.
- `scopes`.
- `expiresAt`.
- `status`.
- `usageMetadata`.
- `humanApprovalRequired`.
- `aiSuggested`.
- `createdBy`.
- `createdAt`.
- `revokedBy`.
- `revokedAt`.

Rules:

- API secrets must be hashed or stored through approved secret management.
- Secrets must never be returned after initial creation except the one-time
  generated value.
- Revocation must be auditable.

## Connector

Required fields:

- `id`.
- `organizationId`.
- `provider`.
- `connectorType`.
- `authenticationMethod`.
- `endpoint`.
- `configuration`.
- `healthStatus`.
- `version`.
- `status`.
- `createdAt`.
- `updatedAt`.

Current runtime mapping:

- `integration_providers`.

Current provider metadata supports:

- Google Drive.
- Dropbox.
- OneDrive.
- OpenAI.
- Anthropic.
- DeepL.
- ElevenLabs.
- Stripe.
- PayPal.
- Amazon S3.
- MinIO.
- Custom providers.

## WebhookSubscription

Current runtime mapping:

- `webhooks`.

Current fields include:

- `id`.
- `organizationId`.
- `eventName`.
- `targetUrl`.
- `secretHash`.
- `enabled`.
- `retryPolicy`.
- `humanApprovalRequired`.
- `aiSuggested`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

## WebhookDelivery

Current runtime mapping:

- `webhook_delivery_logs`.

Current fields include:

- `id`.
- `organizationId`.
- `webhookId`.
- `eventName`.
- `status`.
- `attempt`.
- `responseStatus`.
- `errorMessage`.
- `createdAt`.

## Audit

Current runtime mappings:

- `gateway_audit_events`.
- `integration_audit_events`.

Current actions include:

- `API_KEY_CREATED`.
- `API_KEY_REVOKED`.
- `WEBHOOK_CREATED`.
- `WEBHOOK_ENABLED`.
- `WEBHOOK_DISABLED`.
- `WEBHOOK_DELIVERY_LOG_RECORDED`.
- `INTEGRATION_CREATED`.
- `INTEGRATION_ENABLED`.
- `INTEGRATION_DISABLED`.

## Invariants

- IAM is authoritative for authentication and authorization.
- Connector metadata is tenant-scoped.
- AI cannot create active secrets or enable providers automatically.
- Business modules must not call external providers directly.
- Integration records must be backed up and auditable.
- Public APIs must be versioned before stable external exposure.
