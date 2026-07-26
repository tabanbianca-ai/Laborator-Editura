# IAM API Contracts

## Purpose

This document defines current and target API contracts for the IAM Module.

All APIs are versioned and must use server-derived authenticated context for
protected operations.

## Current Auth APIs

Implemented:

```http
POST /auth/login
GET  /auth/me
GET  /auth/profile
POST /auth/profile
GET  /auth/session
POST /auth/session/refresh
POST /auth/logout
POST /auth/password/reset
POST /auth/password/change
POST /auth/email/verify
GET  /auth/sessions
POST /auth/sessions/:sessionId/revoke
GET  /auth/founder-protection
POST /auth/founder-protection/recover
POST /auth/founder-protection/transfer
POST /auth/founder-protection/transfer/:transferId/accept
POST /auth/founder-protection/transfer/:transferId/cancel
```

## Current Related APIs

Enterprise Admin:

- User, role, permission, invitation, organization, team, and audit metadata.

Security Governance:

- Security policies.
- Access reviews.
- Security events.
- Session revocation records.
- Security audit.

Gateway:

- API keys.
- Route registry.
- Integration providers.
- Webhooks.

Launch Essentials:

- MFA metadata.
- GDPR records.
- Secret Vault metadata.

Workspace:

- Need-to-Know access.
- Temporary grants.
- Preferences.
- Entitlements.

## Target IAM APIs

Examples from the official specification:

```http
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /users
POST /roles
POST /permissions
GET  /sessions
POST /mfa/enable
```

Additional target APIs:

```http
GET  /iam/users
POST /iam/users
GET  /iam/roles
POST /iam/roles
GET  /iam/permissions
POST /iam/permissions
POST /iam/roles/:id/assign
POST /iam/roles/:id/revoke
POST /iam/authorize
GET  /iam/security-events
GET  /iam/audit
```

MFA and SSO:

```http
GET  /iam/mfa
POST /iam/mfa/enable
POST /iam/mfa/disable
POST /iam/mfa/challenge
GET  /iam/sso/providers
POST /iam/sso/providers
POST /iam/sso/providers/:id/enable
POST /iam/sso/providers/:id/disable
```

## API Rules

- Login, password reset request, and email verification are public by explicit
  exception.
- All other IAM APIs require authenticated context.
- Administration-sensitive IAM APIs require authorized human roles.
- Mutations must be audited.
- API responses must not expose secrets, password hashes, raw tokens, MFA
  secrets, or recovery codes.
- Safe error messages are mandatory.
- AI may not grant roles, revoke users, approve access reviews, enable SSO, or
  change security policy automatically.

## Compatibility Rule

Existing Auth, Security Governance, Enterprise Admin, Gateway, Launch
Essentials, Workspace, Workflow, Publishing, Distribution, and Phase 7 Step 16
APIs must remain compatible during incremental migration.
