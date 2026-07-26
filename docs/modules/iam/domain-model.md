# IAM Domain Model

## Purpose

This document defines the conceptual domain model for the Identity, Access
Management and Security Module.

The model is technology-independent and describes the entities required for a
single identity and authorization system.

## Aggregate Ownership

IAM owns:

- User.
- Organization identity scope.
- Group.
- Team access subject.
- Role.
- Permission.
- Role Assignment.
- Permission Grant.
- Authentication Method.
- Session.
- MFA Factor.
- SSO Provider.
- API Principal.
- Security Policy.
- Security Event.
- IAM Audit Event.

Related modules may store administrative metadata, but IAM remains the
authority for authentication and authorization decisions.

## User

Represents a platform identity.

Fields:

- `userId`.
- `organizationId`.
- `displayName`.
- `email`.
- `status`.
- `preferredLanguage`.
- `createdAt`.
- `lastLoginAt`.
- `profileMetadata`.

Statuses:

- `ACTIVE`.
- `INACTIVE`.
- `SUSPENDED`.
- `INVITED`.
- `ARCHIVED`.

## Group

Represents a reusable access grouping.

Fields:

- `groupId`.
- `organizationId`.
- `name`.
- `description`.
- `memberUserIds`.
- `status`.
- `createdBy`.
- `createdAt`.

## Role

Represents a named responsibility with permissions.

Fields:

- `roleId`.
- `organizationId`.
- `name`.
- `description`.
- `permissions`.
- `version`.
- `builtIn`.
- `custom`.
- `status`.
- `createdAt`.

Official roles include:

- `ADMIN`.
- `EDITOR`.
- `TRANSLATOR`.
- `PROOFREADER`.
- `DESIGNER`.
- `NARRATOR`.
- `AUDIO_NARRATOR`.
- `AUTHOR`.
- `COLLABORATOR`.
- `READER`.
- `GUEST`.

Protected system role:

- `PLATFORM_CREATOR`.

## Permission

Represents an atomic access capability.

Fields:

- `permissionId`.
- `resource`.
- `action`.
- `conditions`.
- `effect`.
- `scope`.
- `createdAt`.

Effects:

- `ALLOW`.
- `DENY`.

## Role Assignment

Represents a role granted to a user or group.

Fields:

- `assignmentId`.
- `organizationId`.
- `subjectType`.
- `subjectId`.
- `roleId`.
- `scopeType`.
- `scopeId`.
- `startsAt`.
- `expiresAt`.
- `assignedBy`.
- `assignedAt`.
- `status`.

## Authentication Method

Represents a way a user or service can authenticate.

Supported target methods:

- Password.
- OAuth2.
- OpenID Connect.
- SAML 2.0.
- Passkeys/WebAuthn.
- API keys for services.
- Personal access tokens.

## Session

Represents authenticated runtime access.

Fields:

- `sessionId`.
- `organizationId`.
- `userId`.
- `roles`.
- `permissions`.
- `createdAt`.
- `expiresAt`.
- `lastSeenAt`.
- `revokedAt`.
- `securityMetadata`.

## MFA Factor

Represents a configured second factor.

Fields:

- `mfaFactorId`.
- `organizationId`.
- `userId`.
- `factorType`.
- `status`.
- `createdAt`.
- `lastUsedAt`.
- `recoveryMetadata`.

Factor types:

- `TOTP`.
- `FIDO2`.
- `RECOVERY_CODE`.

## SSO Provider

Represents an external identity provider.

Fields:

- `ssoProviderId`.
- `organizationId`.
- `providerType`.
- `displayName`.
- `protocol`.
- `status`.
- `configurationMetadata`.
- `createdBy`.
- `createdAt`.

Supported future providers:

- Microsoft Entra ID.
- Google Workspace.
- Okta.
- Keycloak.
- Custom OIDC/SAML provider.

## Security Policy

Represents configurable security governance.

Fields:

- `policyId`.
- `organizationId`.
- `policyType`.
- `name`.
- `version`.
- `status`.
- `rules`.
- `approvedBy`.
- `approvedAt`.
- `createdAt`.

## IAM Audit Event

Every IAM action must be auditable.

Fields:

- `auditEventId`.
- `organizationId`.
- `actorId`.
- `action`.
- `entityType`.
- `entityId`.
- `beforeState`.
- `afterState`.
- `createdAt`.

## Security Rules

- All IAM entities are tenant-scoped unless explicitly platform-global.
- Platform Creator is protected and cannot be downgraded or assigned to normal
  users.
- Client-provided identity, role, organization, or permission headers must not
  be trusted.
- Most restrictive valid access rule wins.
- AI may detect and suggest but may not grant, revoke, approve, or change
  access automatically.
