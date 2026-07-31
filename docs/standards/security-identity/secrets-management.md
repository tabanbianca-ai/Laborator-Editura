# Secrets Management Standard

## Purpose

This document defines the canonical rules for secrets, credentials, API keys,
tokens, webhook secrets, provider credentials, and sensitive configuration.

## Secret Fields

Every governed secret record must define:

- `secretIdentifier`.
- `secretType`.
- `owner`.
- `rotationPolicy`.
- `expirationDate`.
- `storageLocation`.
- `encryptionMethod`.
- `auditPolicy`.
- `status`.
- `classification`.
- `lastRotatedAt`.
- `nextRotationDueAt`.

## Secret Types

Canonical secret types:

- `JWT`.
- `API_KEY`.
- `SMTP`.
- `OAUTH`.
- `WEBHOOK`.
- `DATABASE`.
- `STORAGE`.
- `AI_PROVIDER`.
- `SERVICE_TOKEN`.
- `ENCRYPTION_KEY_REFERENCE`.
- `CERTIFICATE_REFERENCE`.

## Secret Handling Rules

Secrets must:

- Never be hardcoded in source code.
- Never be committed to the repository.
- Never be logged.
- Never be returned in API responses.
- Be stored only through approved secret handling.
- Use least-privilege scopes.
- Have an owner.
- Have a rotation policy.
- Have an expiration policy where applicable.
- Be auditable through metadata.

## Storage

The target architecture uses an approved vault or managed secret store.

Until external vault integration is approved, runtime placeholder metadata
must not be treated as secure external secret storage. Environment variables
must be validated for staging and production strength and must not use weak,
default, demo, or placeholder values.

## Rotation

Rotation policy must define:

- Rotation frequency.
- Rotation owner.
- Rotation trigger.
- Rotation procedure.
- Dependent services.
- Rollback procedure.
- Verification procedure.
- Audit requirements.

## Access

Secret access must require:

- Authenticated identity.
- Authorized role or service account.
- Need-to-Know.
- Approved scope.
- Audit metadata.

AI agents may suggest secret configuration or rotation reminders, but they may
not create active secrets, expose secrets, rotate secrets, or approve secret
exceptions automatically.

## API Keys and Webhook Secrets

API keys and webhook secrets must support:

- Secure generation.
- Hashing or encryption.
- Scope assignment.
- Expiration.
- Revocation.
- Rotation.
- Usage metadata.
- Audit.

Raw secret values should be shown only at creation time when a runtime secret
creation flow is implemented.

## Audit

Audit must record:

- Secret metadata created.
- Secret value generated where applicable.
- Secret accessed.
- Secret rotated.
- Secret expired.
- Secret revoked.
- Secret deleted from active use where allowed.
- Secret policy changed.
- Secret scan finding.
- Approved exception.

Audit logs must never include raw secret values.

