# API Contracts

## Purpose

This document defines the API contract rules for internal and public
interoperability.

## Contract-First Rule

Every API must have a documented contract before it is exposed as a stable
public or integration API.

Required contract fields:

- API name.
- API version.
- Owner module.
- Purpose.
- Audience: internal, public, partner, webhook, or admin.
- Authentication model.
- Authorization model.
- Required permissions.
- Tenant and workspace scope.
- Data classification.
- Request schema.
- Response schema.
- Error schema.
- Rate limit policy.
- Idempotency policy.
- Audit requirements.
- Observability requirements.
- Deprecation policy.

## Versioning

All public APIs must be versioned.

Recommended URL pattern:

```text
/api/v1/{resource}
/api/v2/{resource}
```

The current Gateway route registry marks routes with `apiVersion: "v1"`.
Future public API routing must align path structure, registry metadata,
documentation, and tests.

## Current API Namespace Inventory

The current API exposes controller namespaces for:

- `auth`.
- `projects`.
- `documents`.
- `segments`.
- `translations`.
- `translation-memory`.
- `terminology`.
- `qa`.
- `semantic-fidelity`.
- `workflow`.
- `export`.
- `author-studio`.
- `rights`.
- `library`.
- `research`.
- `collaboration`.
- `community`.
- `public`.
- `public-portal`.
- `commerce`.
- `layout-publishing`.
- `multimedia`.
- `media-localization`.
- `scheduling`.
- `platform-engineering`.
- `ai-governance`.
- `gateway`.
- `integrations`.
- `webhooks`.
- `observability`.
- `security`.
- `policies`.
- `admin`.
- `marketplace`.
- `launch-essentials`.
- `health`.

## Internal API Rules

Internal APIs must:

- Preserve module ownership boundaries.
- Avoid direct access to another module's persistence.
- Use typed service contracts or documented events.
- Include correlation IDs when crossing module boundaries.
- Preserve actor and organization context.
- Avoid provider-specific data leaking into domain contracts.

## Public API Rules

Public APIs must:

- Use explicit versioning.
- Require authentication unless intentionally public.
- Use server-derived identity only.
- Enforce authorization through central policy and IAM as it matures.
- Apply rate limits.
- Validate input.
- Return safe errors.
- Log operational metadata.
- Audit state changes.

## Error Model

Integration-facing APIs must return standardized errors:

- `code`.
- `message`.
- `correlationId`.
- `details` only when safe.
- `retryable`.
- `documentationRef` when available.

User-facing messages must remain safe and must not leak secrets, stack traces,
tenant data, provider payloads, or restricted content.

## Idempotency

State-changing integration APIs should support idempotency keys where retries
are expected.

Examples:

- Webhook ingestion.
- Export artifact generation.
- Payment provider callbacks.
- Publication delivery status updates.
- External storage upload callbacks.

## Contract Test Requirement

Every stable integration API must have contract tests covering:

- Authentication.
- Authorization.
- Tenant or workspace isolation.
- Validation.
- Success response.
- Error response.
- Audit for state changes.
- Version compatibility.
