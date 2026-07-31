# Cryptography Standard

## Purpose

This document defines the canonical rules for cryptographic assets, keys,
certificates, algorithms, validity, rotation, storage, usage, and audit.

## Cryptographic Asset Fields

Every cryptographic asset must define:

- `uuid`.
- `keyType`.
- `algorithm`.
- `keyLength`.
- `validityPeriod`.
- `rotationSchedule`.
- `storagePolicy`.
- `usagePolicy`.
- `owner`.
- `status`.
- `classification`.
- `createdAt`.
- `expiresAt`.
- `lastRotatedAt`.
- `auditInformation`.

## Asset Types

Canonical cryptographic asset types:

- `ENCRYPTION_KEY`.
- `SIGNING_KEY`.
- `TOKEN_SIGNING_KEY`.
- `CERTIFICATE`.
- `TLS_CERTIFICATE`.
- `WEBHOOK_SIGNING_SECRET`.
- `BACKUP_ENCRYPTION_KEY`.
- `DATABASE_ENCRYPTION_KEY`.
- `API_KEY_HASHING_SECRET`.
- `PASSWORD_HASHING_POLICY`.

## Algorithm Requirements

Approved algorithms and parameters must be documented before production use.

The platform should prefer:

- Modern TLS for transport encryption.
- Strong password hashing algorithms.
- Authenticated encryption where data encryption is implemented.
- Strong signing algorithms for tokens and webhooks.
- Managed key services where approved.

Weak, deprecated, or custom cryptographic algorithms are not allowed without a
formal security exception.

## Key Storage

Key storage policy must define:

- Storage location.
- Access control.
- Rotation owner.
- Backup handling.
- Recovery procedure.
- Expiration.
- Revocation.
- Audit.

Target architecture should use managed key services or approved vault
integration. Placeholder metadata must not be treated as a complete managed
key service.

## Certificate Management

Certificate records must define:

- Subject.
- Issuer.
- Valid from.
- Valid until.
- Domain or service scope.
- Renewal owner.
- Renewal schedule.
- Revocation procedure.
- Monitoring requirement.

Expired certificates must be detected before service impact where monitoring
is implemented.

## Usage Policy

Cryptographic assets may be used only for approved purposes:

- Transport encryption.
- Token signing.
- Webhook signature verification.
- Backup encryption.
- Database encryption where implemented.
- Secret encryption where implemented.
- Artifact signing where implemented.

Cross-use of keys between unrelated purposes is not allowed without approved
security review.

## Rotation

Rotation must define:

- Trigger.
- Frequency.
- Procedure.
- Dependent services.
- Compatibility window.
- Rollback plan.
- Verification.
- Audit.

## Audit

Audit must record:

- Cryptographic asset created.
- Cryptographic asset activated.
- Cryptographic asset used for governance-relevant action.
- Cryptographic asset rotated.
- Cryptographic asset expired.
- Cryptographic asset revoked.
- Cryptographic asset archived.
- Certificate renewed.
- Approved exception.

Audit records must not expose private key material or sensitive raw values.

## Current Baseline

Current runtime code uses standard cryptographic utilities for identifiers and
security-sensitive flows, and infrastructure documentation references secret
and backup protection. A complete managed key service, certificate inventory,
and cryptographic asset registry are not yet implemented.

