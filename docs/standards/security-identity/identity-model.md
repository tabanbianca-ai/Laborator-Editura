# Identity Model Standard

## Purpose

This document defines the canonical identity model for all human and
non-human identities in Laborator Editura.

## Canonical Identity Fields

Every governed identity must define:

- `uuid`.
- `canonicalIdentifier`.
- `identityType`.
- `displayName`.
- `owner`.
- `status`.
- `authenticationMethod`.
- `authorizationProfile`.
- `lifecycleState`.
- `securityClassification`.
- `metadata`.
- `auditInformation`.

## Identity Types

Canonical identity types:

- `HUMAN_USER`.
- `ADMINISTRATOR`.
- `EXTERNAL_COLLABORATOR`.
- `ORGANIZATION`.
- `GROUP`.
- `TEAM`.
- `SERVICE_ACCOUNT`.
- `API_CLIENT`.
- `AI_AGENT`.
- `SYSTEM_PROCESS`.
- `AUTOMATION_WORKFLOW`.

## Identity Status

Canonical identity statuses:

- `INVITED`.
- `ACTIVE`.
- `SUSPENDED`.
- `LOCKED`.
- `DISABLED`.
- `ARCHIVED`.

Protected system identities may define additional specialized states only if
they map to the canonical lifecycle and preserve auditability.

## Ownership and Scope

Every identity must have an owner or responsible authority:

- Human users are owned by the organization identity domain.
- External collaborators are owned by the inviting organization.
- Organizations are owned by platform governance.
- Service accounts are owned by a responsible team or integration owner.
- API clients are owned by the gateway or integration owner.
- AI agents are owned by AI Governance and the parent functional domain.
- System processes are owned by platform engineering.

## Lifecycle

Canonical lifecycle:

- `DRAFT`.
- `INVITED`.
- `ACTIVE`.
- `SUSPENDED`.
- `LOCKED`.
- `DISABLED`.
- `ARCHIVED`.

Identity records must not be silently deleted when audit, security, legal,
backup, or compliance retention requires historical traceability.

## Authentication Methods

Canonical authentication method categories:

- Password.
- MFA.
- OAuth 2.1.
- OpenID Connect.
- SAML.
- Passkeys or WebAuthn.
- API key.
- Service token.
- Session token.
- Automation credential.

The current runtime may support a subset. Unsupported methods remain target
capabilities until approved implementation phases.

## Authorization Profile

An authorization profile should include:

- Roles.
- Permissions.
- Groups.
- Teams.
- Organization scope.
- Workspace scope.
- Project scope.
- Document scope.
- Need-to-Know grants.
- Temporary access windows.
- Policy constraints.
- Subscription entitlements where applicable.

The most restrictive valid rule wins.

## Protected Identities

Protected identities include:

- Platform Creator.
- Founder.
- System processes.
- Break-glass identities when approved.
- Service accounts with privileged access.

Protected identities require additional audit, approval, and modification
constraints.

## Audit

Audit must record:

- Identity created.
- Identity invited.
- Identity activated.
- Identity suspended.
- Identity locked.
- Identity disabled.
- Identity archived.
- Authentication method changed.
- Authorization profile changed.
- Owner changed.
- Protected identity accessed.
- Approved exception.

## Current Baseline

Current foundations include users, organizations, roles, permissions, sessions,
Founder Protection, Founder Ownership Transfer, Platform Creator protection,
Enterprise Admin metadata, Workspace Need-to-Know metadata, API key metadata,
AI agent metadata, and security audit foundations.

