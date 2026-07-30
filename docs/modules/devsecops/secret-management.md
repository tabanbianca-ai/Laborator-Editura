# DevSecOps Secret Management

## Purpose

Secret Management defines how platform secrets, credentials, certificates,
keys, and sensitive operational values are configured, rotated, audited, and
kept out of source code.

## Governed Secret Types

The module governs:

- API keys.
- OAuth credentials.
- Certificates.
- Database passwords.
- Encryption keys.
- AI provider keys.
- SMTP credentials.
- Webhook secrets.
- SSH deployment keys.
- Backup encryption keys.

## Secret Rules

- Secrets must not be committed to source.
- Secrets must not be logged.
- Secrets must not be embedded in container images.
- Secrets must not be exposed in client bundles.
- Secrets must not be exported through project data.
- Secrets must be rotated through approved procedures.
- Secret access must be auditable.

## Current Repository Baseline

Current foundations:

- GitHub Actions uses environment secrets for VPS SSH deployment.
- Staging `.env` examples exclude real secrets.
- Infrastructure Pack can create `/etc/laborator/infrastructure.env` from an
  example file when needed.
- Secret scanning is available through
  `infrastructure/validation/scan-secrets.sh`.
- Secret Vault minimal backend metadata exists as part of the public launch
  essentials.
- Chapter 13 and security documentation prohibit secrets in source.

Current gaps:

- No external central secret manager is connected.
- Secret rotation workflow is metadata/documentation only.
- Backup encryption key management is not finalized.
- Certificate automation is not fully governed by a module-level registry.

## Secret Reference Model

Secret metadata may include:

- `secretRefId`.
- `name`.
- `secretType`.
- `provider`.
- `environmentScope`.
- `rotationPolicy`.
- `lastRotatedAt`.
- `owner`.
- `auditRefs`.

Secret values are stored only in approved secret stores and must not be
returned by APIs.

## Rotation

Rotation records must include:

- Secret reference.
- Rotation reason.
- Rotated by.
- Rotated at.
- Affected environments.
- Validation status.

## Audit Events

Audit:

- Secret reference created.
- Secret rotated.
- Secret access recorded.
- Secret scan completed.
- Secret leak suspected.
- Secret revoked.
