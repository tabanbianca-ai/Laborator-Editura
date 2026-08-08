# Canonical Identity Model

## Identity Types

- `HUMAN_USER`
- `EXTERNAL_COLLABORATOR`
- `SERVICE_ACCOUNT`
- `API_CLIENT`
- `AI_AGENT`
- `SYSTEM_PROCESS`

## Identity Statuses

- `INVITED`
- `PENDING_VERIFICATION`
- `ACTIVE`
- `SUSPENDED`
- `LOCKED`
- `DISABLED`
- `ARCHIVED`

## Canonical Fields

Each canonical identity records:

- immutable `id`
- `organizationId`
- linked `userId`, `serviceAccountId`, or `apiClientId`
- `identityType`
- `status`
- `canonicalUsername`
- `displayName`
- `preferredLocale`
- `authenticationMethods`
- `securityVersion`
- lifecycle timestamps
- metadata

## Current Migration Strategy

Existing human users are mapped lazily during login:

- `AuthUser.id` remains the stable user identifier.
- `identityId` defaults to the existing `AuthUser.id`.
- `identityType` defaults to `HUMAN_USER`.
- `securityVersion` defaults to `1`.

This avoids destructive migration and preserves existing references.

