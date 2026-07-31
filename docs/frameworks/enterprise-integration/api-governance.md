# API Governance

## Purpose

API Governance defines how internal, public, partner, admin, webhook, and
integration APIs are designed, versioned, secured, monitored, audited, and
retired.

## Contract-First Rule

Every stable API must have a documented contract before it is exposed as a
stable public or integration API.

## Required API Contract Fields

Each API contract must define:

- UUID.
- API name.
- API version.
- Owner.
- Purpose.
- Audience.
- OpenAPI specification.
- Authentication.
- Authorization.
- Required permissions.
- Tenant and workspace scope.
- Data classification.
- Request schema.
- Response schema.
- Error schema.
- Rate limits.
- Idempotency policy.
- SLA or SLO where applicable.
- Audit requirements.
- Observability requirements.
- Lifecycle state.
- Deprecation policy.

## API Lifecycle

Lifecycle states:

- `DRAFT`.
- `UNDER_REVIEW`.
- `APPROVED`.
- `ACTIVE`.
- `DEPRECATED`.
- `RETIRED`.

Only approved active APIs may be treated as stable integration contracts.

## Versioning

Public and partner APIs must be versioned.

Recommended path pattern:

```text
/api/v1/{resource}
/api/v2/{resource}
```

Internal controller namespaces may exist, but public integration exposure must
align route paths, registry metadata, documentation, and tests.

## Authentication and Authorization

APIs must:

- Use server-derived identity.
- Reject unauthenticated access unless intentionally public.
- Enforce authorization server-side.
- Respect tenant isolation.
- Respect Need-to-Know access.
- Validate API keys and scopes where API keys are used.

## Rate Limits

Rate limits should define:

- Scope.
- Window.
- Allowed requests.
- Burst policy.
- Retry-after behavior.
- Exemption policy.
- Audit and monitoring requirements.

## Idempotency

Idempotency keys should be required for retry-prone state-changing
integration APIs.

Examples:

- Webhook ingestion.
- Export artifact generation.
- Payment callbacks.
- Publication delivery callbacks.
- External storage upload callbacks.
- Batch import finalization.

## Error Model

Integration-facing APIs must return safe standardized errors:

- `code`.
- `message`.
- `correlationId`.
- `details` only when safe.
- `retryable`.
- `documentationRef` where available.

Errors must not leak secrets, stack traces, provider payloads, tenant data, or
restricted content.

## Current Baseline Assessment

Strengths:

- API contract standards exist in `docs/integration/api-contracts.md`.
- API standards exist in `docs/backend/api-standards.md`.
- Gateway route registry metadata exists.
- API keys, scopes, expiration, revocation, secret hashing, and audit exist
  as metadata foundations.

Gaps:

- OpenAPI specifications are not complete for every stable endpoint.
- Public URL versioning is not uniformly implemented.
- API contract registry is not fully machine-readable.
- API lifecycle state is not uniformly tracked per route.

## Standardization Plan

1. Inventory all controller namespaces.
2. Classify APIs as internal, public, partner, admin, webhook, or health.
3. Map each stable API to an owner and contract.
4. Add OpenAPI definitions incrementally.
5. Align route registry metadata with contract registry.
6. Add compatibility and deprecation policy for public APIs.
