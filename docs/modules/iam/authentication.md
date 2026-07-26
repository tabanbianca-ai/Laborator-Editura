# IAM Authentication

## Purpose

Authentication verifies identity and produces a server-derived authenticated
context for protected platform requests.

## Supported Target Methods

The target architecture supports:

- Username/email and password.
- OAuth2.
- OpenID Connect.
- SAML 2.0.
- Passkeys/WebAuthn.
- API keys for service access.
- Personal access tokens.

Current implementation is local password-based authentication plus API key
metadata through Gateway.

## Current Repository Baseline

Implemented:

- `POST /auth/login`.
- `POST /auth/logout`.
- `GET /auth/session`.
- `POST /auth/session/refresh`.
- `POST /auth/password/reset`.
- `POST /auth/password/change`.
- `POST /auth/email/verify`.
- `GET /auth/sessions`.
- `POST /auth/sessions/:sessionId/revoke`.
- Account lockout after repeated failed login attempts.
- Session expiration and idle timeout behavior.
- Safe login and password reset responses.
- Founder Protection and Founder Ownership Transfer flows.
- Server-derived request context.

Not fully implemented:

- OAuth2 runtime provider login.
- OIDC runtime provider login.
- SAML runtime provider login.
- WebAuthn/passkeys runtime.
- Personal access token runtime.
- Real external identity provider federation.

## Authentication Flow

```text
Login Request
  -> Credential Validation
  -> Account Status Check
  -> Lockout Check
  -> MFA Challenge when enforced
  -> Session Creation
  -> Authenticated Context
```

Current MFA is metadata-only and not yet an enforced challenge.

## Request Context Rule

Protected requests must derive:

- `userId`.
- `organizationId`.
- `roles`.
- `permissions`.

from a validated session or token only.

The platform must reject requests without valid authenticated context.

## Public Authentication Endpoints

Approved public authentication endpoints:

- `POST /auth/login`.
- `POST /auth/password/reset`.
- `POST /auth/email/verify`.

These endpoints must return safe messages and must not disclose account
existence except where policy explicitly allows.

## Security Requirements

- Passwords must be salted and hashed.
- Login failure messages must be safe.
- Sessions must expire.
- Revoked sessions must not be accepted.
- Tokens must not be logged.
- Authentication events must be audited.
- Rate limits must apply to login and sensitive authentication flows.

## Future Provider Strategy

External providers must integrate through IAM only.

Functional modules must never implement provider-specific authentication.

Provider integrations must be:

- Tenant-scoped.
- Auditable.
- Configurable.
- Revocable.
- Compatible with MFA policy.
