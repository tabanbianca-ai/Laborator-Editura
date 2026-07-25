# IAM Architecture

## Purpose

This document defines the target Identity and Access Management architecture
for Laborator Editura.

IAM is the only official source of user identity, session context, roles,
permissions, workspaces, organizations, and access policies.

## IAM Responsibilities

IAM owns:

- Users.
- Organizations.
- Workspaces.
- Roles.
- Permissions.
- Groups or teams.
- Authentication methods.
- Sessions.
- Tokens.
- Account status.
- MFA metadata and future MFA enforcement.
- Password reset.
- Email verification.
- Activity log.
- Identity security events.

## Current IAM Baseline

Current implementation includes:

- Password-based login.
- Session creation.
- Session refresh.
- Session verification.
- Session revocation.
- Password reset.
- Password change.
- Email verification.
- Account status.
- Activity events.
- Security events.
- Founder Protection and ownership transfer metadata.
- Server-derived request context.

## Request Context

Every protected request must produce an authenticated context containing:

- `userId`.
- `organizationId`.
- `roles`.
- `permissions`.

The context must be derived only from a validated token or server-side session.

Client-provided identity headers must not be trusted.

## Identity Provider Strategy

The architecture supports:

- Local username and password.
- OAuth.
- OpenID Connect.
- Single Sign-On.
- MFA.

Current implementation is local auth first. Future providers must integrate
through IAM and must not be added directly inside functional modules.

## Session Model

Sessions must support:

- Creation.
- Expiration.
- Idle timeout.
- Refresh.
- Revocation.
- Active session listing.
- Last seen metadata.
- Security event audit.

Tokens must fail after expiration or revocation.

## Workspace Identity Scope

Workspace access must be part of identity evaluation.

IAM must be able to answer:

- Which workspaces a user can access.
- Which roles apply per workspace.
- Which permissions apply per workspace.
- Which Need-to-Know grants apply per project, document, chapter, section, or
  segment.

## IAM Audit

IAM audit must cover:

- Login.
- Logout.
- Failed login.
- Account lockout.
- Password reset.
- Password change.
- Email verification.
- Session refresh.
- Session expiration.
- Session revocation.
- Role assignment.
- Role removal.
- Permission changes.
- Founder/Creator role access.

## Future Alignment

Next IAM alignment steps:

1. Expand the permission catalog.
2. Add workspace-scoped role assignment as a first-class IAM decision input.
3. Convert MFA metadata into enforceable MFA policy when scheduled.
4. Add OAuth/OIDC/SSO providers through IAM.
5. Centralize policy-based authorization decisions.
