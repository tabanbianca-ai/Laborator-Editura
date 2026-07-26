# Identity, Access Management and Security Module Overview

## Purpose

Identity, Access Management and Security is the twelfth Phase II module
specification for Laborator Editura.

IAM is the shared security infrastructure used by every platform module. It
owns identity, authentication, authorization, users, roles, permissions,
sessions, MFA policy, future SSO providers, security policies, and security
audit.

No module may implement its own authentication or authorization mechanism.
Modules receive a server-derived authenticated context and ask IAM or the
approved authorization layer for access decisions.

## Scope

The module owns:

- Users.
- Organizations and identity scope.
- Groups and teams as access subjects.
- Roles.
- Permissions.
- Authentication methods.
- Authorization decisions.
- Session management.
- MFA metadata and future enforcement.
- Future SSO providers.
- Security policies.
- Security events.
- Security audit.

The module does not own:

- Domain validation owned by business modules.
- Workflow orchestration owned by Workflow Engine.
- Communication delivery owned by Notification and Communication.
- Provider credentials stored through Secret Vault governance.
- Observability storage, which records diagnostics and metrics.
- Legal rights decisions owned by Rights and Provenance.

## Principles

The module follows:

- Zero Trust.
- Least Privilege.
- Defense in Depth.
- Identity First.
- Role-Based Access Control.
- Policy Driven Authorization.
- Security by Default.
- Audit by Default.
- Server-Derived Identity.
- Most Restrictive Rule Wins.

## Current Repository Baseline

The repository already contains a strong IAM foundation:

- `apps/api/src/modules/auth` implements local login, users, organizations,
  credentials, sessions, refresh, logout, password reset, password change,
  email verification, profile management, active sessions, session revocation,
  account lockout, activity events, security events, Founder Protection, and
  Founder Ownership Transfer.
- `RequestContextMiddleware` derives authenticated context from validated
  tokens or sessions and rejects protected unauthenticated requests.
- Spoofed client identity headers are not trusted.
- `permissionsForRoles` maps MVP roles to MVP permissions.
- `apps/api/src/modules/security` implements rate limiting, security headers,
  and staging/production secret validation.
- `apps/api/src/modules/security-governance` models security policies, access
  reviews, session events, API key events, policy violations, and audit.
- `apps/api/src/modules/policy-engine` models compliance policies,
  evaluations, exceptions, and audit.
- `apps/api/src/modules/enterprise-admin` models organization, team, user,
  role, permission, invitation, membership, and admin audit metadata.
- `apps/api/src/modules/workspace` models Need-to-Know grants, temporary
  access, role filtering, subscription entitlements, and workspace audit.
- `apps/api/src/modules/gateway` models API keys, route registry metadata,
  integration providers, webhooks, and audit.
- `apps/api/src/modules/launch-essentials` models MFA metadata, GDPR records,
  Secret Vault metadata, and launch audit.
- `docs/security` already documents Chapter 9 security architecture, IAM,
  RBAC, policies, audit, compliance, API security, data classification, gap
  analysis, and migration direction.

## Target Architecture

```text
Identity Provider
  -> IAM Service
  -> Authentication
  -> MFA Service
  -> Session Manager
  -> Authorization Policy Engine
  -> Role and Permission Manager
  -> Security Policy Engine
  -> Security Audit
```

## Dependency Map

IAM integrates with:

- Library.
- Translation.
- Editorial Review.
- Rights and Provenance.
- Magazine.
- AI Orchestration.
- Audio.
- Video.
- Workflow Engine.
- Notification and Communication.
- Publishing.
- Gateway.
- Workspace.
- Administration.
- Policy Engine.
- Observability.
- Backup and Recovery.
- Audit.

## Public Endpoint Rule

All endpoints require authentication and authorization except explicitly
approved public surfaces:

- Health checks.
- Login.
- Password reset request.
- Email verification.
- Approved public catalog reads.
- Approved public store reads.
- Approved public community reads.

Public endpoints must expose minimal data and safe errors.

## Acceptance Criteria

The module is aligned when:

- Authentication is centralized.
- Authorization decisions are centralized.
- Every protected request uses server-derived identity.
- RBAC is implemented consistently across all modules.
- MFA and SSO are configurable through IAM.
- Sessions can expire, refresh, revoke, and be audited.
- Security policies are administrable without application code changes.
- Every permission-sensitive action is auditable.
- No module implements independent authentication or authorization logic.

## Related Documents

- `docs/security/iam-architecture.md`.
- `docs/security/security-architecture.md`.
- `docs/security/rbac-model.md`.
- `docs/security/security-policies.md`.
- `docs/security/security-gap-analysis.md`.
- `docs/modules/iam/domain-model.md`.
- `docs/modules/iam/authentication.md`.
- `docs/modules/iam/authorization.md`.
- `docs/modules/iam/rbac.md`.
- `docs/modules/iam/mfa-sso.md`.
- `docs/modules/iam/session-management.md`.
- `docs/modules/iam/security-policies.md`.
- `docs/modules/iam/api-contracts.md`.
- `docs/modules/iam/events.md`.
- `docs/modules/iam/iam-gap-analysis.md`.
- `docs/modules/iam/iam-migration-plan.md`.
