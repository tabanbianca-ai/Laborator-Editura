# API Standards

## Purpose

This document defines the backend API standard required by Chapter 12.

## Target Route Versioning

Stable APIs must use versioned contracts.

Target route pattern:

```text
/api/v1/<resource>
```

Existing unversioned routes remain valid until a compatibility migration is
approved. New stable endpoints should document their intended v1 contract even
if the current NestJS route remains unversioned during migration.

## Endpoint Contract Requirements

Each endpoint must document:

- Method.
- Route.
- Authentication requirement.
- Permission requirement.
- Request DTO.
- Response DTO.
- Error categories.
- Idempotency behavior.
- Audit side effects.
- Event side effects.
- Rate limit class when sensitive.

## Current Route Families

Current route families include:

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
- `lexicographic`.
- `editorial-decisions`.
- `layout-publishing`.
- `multimedia`.
- `media-localization`.
- `library`.
- `rights`.
- `research`.
- `collaboration`.
- `community`.
- `public`.
- `public-portal`.
- `commerce`.
- `scheduling`.
- `platform-engineering`.
- `observability`.
- `security`.
- `backup`.
- `ai-governance`.
- `policies`.
- `admin`.
- `marketplace`.
- `workspace`.
- `gateway`.
- `integrations`.
- `webhooks`.
- `launch-essentials`.
- `health`.

## Authentication Rules

Protected endpoints must use server-derived authenticated context. Client
provided identity, organization, roles, permissions, tenant, or workspace
headers must not be trusted.

Approved unauthenticated surfaces are limited to explicitly public endpoints,
such as health checks and approved public catalog/community read endpoints.

## DTO Rules

- Request DTOs must validate shape and limits.
- Response DTOs must omit secrets and restricted internal metadata.
- Domain entities must not be returned directly as public API contracts.
- Public API contracts must be backward compatible when possible.

## Error Rules

API errors must map to the standard error taxonomy:

- `ValidationError`.
- `AuthenticationError`.
- `AuthorizationError`.
- `NotFoundError`.
- `ConflictError`.
- `BusinessRuleError`.
- `RateLimitError`.
- `IntegrationError`.
- `InfrastructureError`.

## Acceptance Criteria

- All state-changing endpoints require authenticated actor context unless
  explicitly documented as public.
- API contracts are documented before breaking changes.
- Sensitive data is never returned in API responses.
- Future public APIs use `/api/v1`.
