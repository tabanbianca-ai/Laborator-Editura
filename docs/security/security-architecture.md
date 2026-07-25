# Security Architecture Baseline

## Purpose

This document records the baseline security architecture and target security
model for Laborator Editura.

It supports `docs/ARCHITECTURE_CHAPTER_9.md` and must be used before any
structural security, identity, or governance refactoring.

## Current Repository Baseline

Observed security foundations:

- `auth` provides users, organizations, credentials, sessions, password reset,
  email verification, login attempts, account lockout, activity events,
  security events, Founder Protection, Founder Recovery, and ownership
  transfer metadata.
- `RequestContextMiddleware` derives identity from server-side session or
  access token and rejects unauthenticated protected requests.
- `request-context.types.ts` maps roles to MVP permissions.
- `security` provides security headers, rate limiting, and staging/production
  secret strength validation.
- `security-governance` models security policies, access reviews, session
  events, API key events, policy violations, and audit.
- `policy-engine` models compliance policies, evaluations, exceptions,
  compliance records, and audit.
- `workspace` models Need-to-Know access, scoped invitations, temporary grants,
  confidential classifications, role filtering, subscription entitlements, and
  workspace audit.
- `gateway` models API keys, hashed secrets, integration provider metadata,
  webhooks, route registry metadata, and audit.
- `launch-essentials` models MFA metadata, GDPR consent and requests, Secret
  Vault metadata, and audit.
- `observability` models metrics, logs, traces, agent executions, and audit.
- Runtime backup includes auth, gateway, security, policy, workspace, MFA,
  GDPR, secret vault, and audit tables.

## Target Security Model

Target flow:

```text
Client
  -> IAM
  -> Authentication
  -> Authorization Policy Evaluation
  -> Business Module
  -> Audit
  -> Observability
  -> Response
```

Every module receives a server-derived authenticated context. No module may
trust client-provided user IDs, organization IDs, roles, or permissions.

## Security Boundary

The security boundary includes:

- IAM.
- Request context middleware.
- RBAC and permission evaluation.
- Need-to-Know access.
- Policy Engine.
- Security Governance.
- Secret Management.
- Audit.
- Observability.

Modules may call these shared services but may not duplicate them.

## Public Endpoint Rule

Public endpoints must be explicitly listed and intentionally limited.

Current public endpoint categories include:

- Health endpoint.
- Login.
- Password reset request.
- Email verification.
- Approved public catalog reads.
- Approved public store reads.
- Approved public community reads.

All other endpoints require authenticated context.

## Current Strengths

- Identity is derived server-side from tokens.
- Spoofed identity headers are not part of the authenticated request context.
- Sessions support expiration, idle timeout, refresh, revocation, and audit.
- Account lockout and safe login failure handling exist.
- Security headers exist.
- Rate limiting exists for auth and sensitive endpoints.
- Environment secret validation exists for staging and production.
- Need-to-Know and workspace access foundations exist.
- Policy and security governance metadata exist.
- Audit is broad across modules.
- Backup/restore includes security-related runtime tables.

## Current Gaps

- Permission model is still MVP-sized and not yet a complete atomic
  permission catalog.
- Policy-based authorization is not yet the single central runtime decision
  point for every module action.
- MFA is metadata-only and not yet enforced as a real authentication factor.
- OAuth, OIDC, and SSO are architecture-supported but not fully implemented.
- Secret Vault is metadata/placeholder based and not yet connected to an
  external vault or encryption provider.
- Data classification is present in Workspace Need-to-Know but not yet a
  platform-wide classification service.
- Workspace is modeled, but the current runtime primary isolation key is often
  `organizationId`; workspace-level isolation needs full alignment.
- Audit exists broadly, but immutability guarantees require a durable storage
  strategy and retention policy.

## Non-Goals for This Baseline

This document does not implement:

- New authentication providers.
- SSO.
- Real MFA enforcement.
- Database migrations.
- API changes.
- UI changes.
- Docker changes.
- External vault integration.
