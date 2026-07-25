# API Security

## Purpose

This document defines API security requirements for Laborator Editura.

All API security controls must use shared infrastructure and must not be
implemented separately by functional modules.

## Current API Security Baseline

Current implementation includes:

- Request context middleware for protected routes.
- Bearer token and session token handling.
- Explicit public route handling.
- Safe unauthorized error response.
- Rate limiting for authentication, sensitive, and default routes.
- Security headers.
- Environment secret validation for protected environments.
- Gateway metadata for route registry, API keys, scopes, webhooks, correlation
  IDs, tracing, and rate limit metadata.
- Contract tests for auth context security and security hardening.

## Authentication

Protected API requests must include a valid access token or server-side session
token.

Unauthenticated protected requests must be rejected.

Client-provided user ID, organization ID, role, or tenant headers must not be
trusted.

## Authorization

After authentication, API handlers must evaluate:

- Role.
- Permission.
- Workspace or organization policy.
- Need-to-Know scope.
- Resource ownership.
- Resource state.
- Data classification.

## Public Routes

Public routes must be explicit.

Currently approved categories:

- `GET /health`.
- `POST /auth/login`.
- `POST /auth/password/reset`.
- `POST /auth/email/verify`.
- Approved public catalog endpoints.
- Approved public store endpoint.
- Approved public community read endpoints.

Public endpoints must not expose private or restricted data.

## Rate Limiting

Rate limiting policies:

- Auth endpoints.
- Sensitive endpoints.
- Default endpoints.

Sensitive endpoint examples:

- Non-GET requests.
- Export routes.
- Workflow routes.
- Approval routes.
- Validation routes.
- Recovery or transfer routes.

## Security Headers

Required standard headers:

- Content-Security-Policy.
- X-Frame-Options.
- X-Content-Type-Options.
- Referrer-Policy.
- Permissions-Policy.

## Input Validation

All inputs must be validated server-side.

Validation must reject:

- Missing required fields.
- Invalid enum values.
- Unsupported state transitions.
- Unauthorized scope references.
- Tenant or workspace mismatch.
- Unsupported file or export metadata where applicable.

## API Keys and Webhooks

API keys and webhooks are managed through Gateway.

Rules:

- Secrets must be hashed or encrypted.
- Scopes must be explicit.
- Expiration must be supported.
- Revocation must be supported.
- Audit is mandatory.
- AI may not create active secrets automatically.

## Gaps

Current API security is strong for MVP but needs future alignment for:

- Central policy decision service across all modules.
- Full atomic permission catalog.
- Documented CORS policy.
- CSRF policy for browser flows where applicable.
- Workspace-level authorization on every applicable resource.
