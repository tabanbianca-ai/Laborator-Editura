# Integration API Contracts

## Purpose

This document defines current and target API contracts for the Integration,
API Gateway and External Connectors Module.

All APIs must be versioned before stable public exposure and must enforce
server-derived authentication and authorization unless explicitly approved as
public.

## Current APIs

Gateway:

```http
GET  /gateway/health
GET  /gateway/routes
GET  /gateway/modules

POST /gateway/api-keys
POST /gateway/api-keys/:id/revoke
GET  /gateway/api-keys
```

Integrations:

```http
POST /integrations
GET  /integrations
GET  /integrations/:id
POST /integrations/:id/enable
POST /integrations/:id/disable
```

Webhooks:

```http
POST /webhooks
GET  /webhooks
POST /webhooks/:id/enable
POST /webhooks/:id/disable
```

## Target APIs From Official Specification

```http
GET  /api/v1/connectors
POST /api/v1/connectors
GET  /api/v1/apis
POST /api/v1/webhooks
GET  /api/v1/webhooks
POST /api/v1/events
GET  /api/v1/rate-limits
POST /api/v1/test-connection
```

## Recommended Versioned Module Contracts

```http
GET  /integration/v1/gateway/health
GET  /integration/v1/gateway/routes
GET  /integration/v1/gateway/modules

GET  /integration/v1/apis
POST /integration/v1/apis
GET  /integration/v1/apis/:id

GET  /integration/v1/consumers
POST /integration/v1/consumers

GET  /integration/v1/api-keys
POST /integration/v1/api-keys
POST /integration/v1/api-keys/:id/revoke

GET  /integration/v1/connectors
POST /integration/v1/connectors
GET  /integration/v1/connectors/:id
POST /integration/v1/connectors/:id/test-connection
POST /integration/v1/connectors/:id/enable
POST /integration/v1/connectors/:id/disable

GET  /integration/v1/webhooks
POST /integration/v1/webhooks
POST /integration/v1/webhooks/:id/enable
POST /integration/v1/webhooks/:id/disable
GET  /integration/v1/webhooks/:id/deliveries

GET  /integration/v1/rate-limits
POST /integration/v1/rate-limits

POST /integration/v1/events
GET  /integration/v1/audit
```

Existing `/gateway`, `/integrations`, and `/webhooks` endpoints must remain
compatible until a versioned migration is explicitly approved.

## Contract Rules

- Contracts must define request schema, response schema, error schema,
  authentication, authorization, scopes, tenant scope, idempotency, rate
  limits, audit, and observability.
- State-changing integration APIs must be auditable.
- API key and webhook secret values must be one-time or never returned.
- Public APIs must have compatibility and deprecation policy.
- Connector execution APIs must be added only after adapter and secret
  management baselines are approved.

## Current Contract Gaps

- No central `ApiDefinition` runtime exists.
- No stable `/api/v1/*` public gateway namespace exists.
- No connector test-connection API exists.
- No event gateway runtime API exists.
- No configurable rate-limit policy API exists.
- No generated API documentation pipeline exists.
