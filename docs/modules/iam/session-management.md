# IAM Session Management

## Purpose

Session Management controls authenticated runtime access after identity
verification.

Sessions must be revocable, expiring, auditable, and tenant-scoped.

## Current Repository Baseline

Implemented:

- Session creation on login.
- Session verification.
- Session refresh.
- Session logout.
- Active session listing.
- Session revocation.
- Session expiration.
- Idle timeout behavior.
- Last seen metadata.
- Security events for expiration, idle timeout, refresh, revocation, and
  logout.
- Request context middleware that resolves sessions before protected API
  access.

## Session Fields

Current and target session records should preserve:

- `sessionId`.
- `token` or token reference.
- `organizationId`.
- `userId`.
- `roles`.
- `createdAt`.
- `expiresAt`.
- `lastSeenAt`.
- `revokedAt`.
- `securityMetadata`.

## Session Lifecycle

```text
CREATED
  -> ACTIVE
  -> REFRESHED
  -> EXPIRED
```

Revocation lifecycle:

```text
ACTIVE
  -> REVOKED
```

Idle timeout lifecycle:

```text
ACTIVE
  -> IDLE_TIMEOUT
```

## Session Policies

Configurable policies:

- Maximum session duration.
- Idle timeout.
- Refresh token rotation.
- Maximum active sessions.
- Role-specific session length.
- Suspicious session detection.
- Immediate revocation on security event.

## Distributed Session Cache

Target performance architecture should support:

- Fast session validation.
- Distributed cache.
- Revocation propagation.
- Horizontal API scaling.
- Cache invalidation after role or permission changes.

The current runtime foundation is sufficient for MVP but not yet a complete
distributed session architecture.

## Security Rules

- Tokens must not be logged.
- Revoked sessions must fail.
- Expired sessions must fail.
- Session verification must use server-side state.
- Session context must include roles and permissions derived by IAM.
- Client-provided role or organization headers must be ignored.

## Audit Requirements

Audit must record:

- Session created.
- Session refreshed.
- Session verified where required by policy.
- Session expired.
- Session idle timeout.
- Session revoked.
- Suspicious session flagged.
- Concurrent session limit reached.
