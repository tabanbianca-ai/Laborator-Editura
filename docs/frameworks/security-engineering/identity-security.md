# Identity Security

## Purpose

Identity Security governs authentication, authorization, sessions, roles,
permissions, MFA, SSO readiness, federation readiness, access review, and
privileged access.

## Identity Rules

- One authentication system serves the complete platform.
- One user base serves public website, application, and API.
- One role and permission system governs access.
- Protected requests must use server-derived identity.
- Client-provided `userId`, `organizationId`, roles, or permissions must not
  be trusted.
- Default access is denied unless explicitly allowed.

## Required Identity Capabilities

The security target includes:

- Multi-Factor Authentication.
- Single Sign-On.
- Role-Based Access Control.
- Attribute-Based Access Control.
- Just-In-Time Access.
- Session Management.
- Identity Federation.
- Periodic Access Review.

Runtime availability varies by implementation phase.

## Current Baseline

Current identity implementation includes:

- Users.
- Organizations.
- Credentials.
- Sessions.
- Login.
- Logout.
- Session check.
- Session refresh.
- Session expiration.
- Idle timeout support.
- Session revocation.
- Password reset.
- Password change.
- Email verification metadata.
- Activity events.
- Security events.
- Account lockout.
- Founder Protection.
- Founder Ownership Transfer.
- MVP RBAC permissions.
- Need-to-Know grant foundations.
- MFA metadata.

## Session Security

Sessions must support:

- Expiration.
- Refresh.
- Revocation.
- Idle timeout where supported.
- Last seen metadata.
- Device/session metadata where available.
- Audit of sensitive session actions.

Expired or revoked sessions must not authenticate requests.

## Access Review

Access review must cover:

- Privileged users.
- Administrators.
- Reviewers.
- Editors.
- Project roles.
- Temporary access.
- API keys.
- Integration access.
- AI agent access.

## Privileged Access

Privileged actions include:

- Role assignment.
- Permission changes.
- Security policy changes.
- API key creation or revocation.
- Secret changes.
- Founder ownership transfer.
- Publication approval.
- Rights authorization.
- Restore operations.

Privileged actions must require authorization and audit.

## Current Gaps

- MFA is metadata-only and not enforced as a second factor.
- SSO and federation are not implemented.
- ABAC is not yet a full runtime decision layer.
- JIT access is partially represented through temporary grants but not fully
  centralized.
- Periodic access review is metadata-based.

## Standardization Plan

1. Preserve current centralized authentication.
2. Expand atomic permission catalog.
3. Implement MFA enforcement in an approved phase.
4. Implement SSO/OIDC/SAML only through approved provider integration.
5. Promote temporary grants into full JIT access.
6. Add periodic access review workflow and reporting.
