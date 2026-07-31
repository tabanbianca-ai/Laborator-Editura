# Authentication Standard

## Purpose

This document defines the canonical authentication requirements for Laborator
Editura.

Authentication verifies identity and produces a server-derived authenticated
context before authorization decisions are evaluated.

## Core Rule

Authentication must happen before authorization.

Protected requests must derive the authenticated context from a validated
server-side session, access token, API key, or approved service credential.
Client-provided user, organization, role, permission, tenant, or workspace
headers must not be trusted.

## Canonical Authenticated Context

Authenticated context must provide:

- `userId` or equivalent subject identifier.
- `organizationId`.
- `roles`.
- `permissions`.
- `identityType`.
- `sessionId` or credential reference where applicable.
- `authenticationMethod`.
- `issuedAt`.
- `expiresAt`.
- `riskMetadata` where available.

## Target Authentication Capabilities

The target authentication architecture supports:

- Password authentication.
- Multi-Factor Authentication.
- Single Sign-On.
- OAuth 2.1.
- OpenID Connect.
- SAML.
- Passkeys or WebAuthn.
- API keys for service access.
- Session management.
- Token rotation.
- Device verification.

Runtime support may be introduced incrementally. Architecture support does not
mean every method is currently implemented.

## Password Authentication

Password authentication must provide:

- Salted and hashed password storage.
- Strong password policy metadata.
- Safe login errors.
- Login rate limiting.
- Account lockout after repeated failed login attempts.
- Password reset flow.
- Password change flow.
- Authentication audit.

## MFA

MFA target requirements:

- MFA enrollment.
- MFA enable and disable audit.
- TOTP or equivalent factor support.
- Recovery code metadata.
- Sensitive role enforcement.
- Risk-based challenge support where implemented.
- Break-glass exception policy.

Current MFA may remain metadata-only until runtime challenge enforcement is
approved.

## SSO and Federation

SSO and federation target requirements:

- OAuth 2.1.
- OpenID Connect.
- SAML where needed.
- Tenant-scoped provider configuration.
- Provider secrets governed by Secret Vault rules.
- Role mapping.
- MFA compatibility.
- Session revocation.
- Audit.

Functional modules must not implement independent SSO or provider login
flows.

## Session Management

Sessions must support:

- Expiration.
- Idle timeout where implemented.
- Refresh.
- Revocation.
- Active session listing.
- Session invalidation after role or permission changes as implementation
  allows.
- Security event logging.

Expired or revoked sessions must not be accepted.

## Device Verification

Device verification target metadata may include:

- Device identifier.
- Device name.
- Browser or client metadata.
- First seen timestamp.
- Last seen timestamp.
- Trust status.
- Risk level.
- Revocation status.

Device verification runtime requires a separately approved implementation
phase.

## Public Authentication Endpoints

Approved public authentication surfaces may include:

- Login.
- Password reset request.
- Email verification.
- Health checks where explicitly approved.

They must return safe errors and must not disclose secrets, tokens, password
hashes, MFA secrets, recovery codes, tenant data, or restricted user data.

## Audit

Audit must record:

- Login succeeded.
- Login failed.
- Account locked.
- Account unlocked.
- Session created.
- Session refreshed.
- Session revoked.
- Session expired.
- Password reset requested.
- Password changed.
- Email verified.
- MFA enabled.
- MFA disabled.
- MFA challenge succeeded when implemented.
- MFA challenge failed when implemented.
- SSO login succeeded when implemented.
- SSO login failed when implemented.

