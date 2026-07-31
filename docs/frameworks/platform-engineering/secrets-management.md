# Secrets Management

## Purpose

Secrets Management defines how sensitive operational values are provisioned,
stored, rotated, accessed, audited, and protected.

## Governed Secret Types

Managed secrets include:

- API keys.
- Certificates.
- Passwords.
- Encryption keys.
- AI credentials.
- External integration credentials.
- Webhook secrets.
- Database credentials.
- SMTP credentials.
- OAuth credentials.
- Backup encryption keys.

## Current Baseline

Current secret-related foundations include:

- GitHub Actions secrets for CI and staging workflows.
- `.env` example files.
- `/etc/laborator` environment file conventions in Infrastructure Pack.
- Launch Secret Vault metadata in backend foundations.
- Infrastructure validation and secret scanning scripts.
- Documentation requiring secrets not be logged.

## Secret Rules

- Secrets must not be committed to source control.
- Secrets must not be logged.
- Secrets must not be embedded in container images.
- Secrets must not be exposed through frontend code.
- Production secrets must use a dedicated secret management service when
  available.
- Secret access must be least privilege.
- Secret rotation must be auditable.
- Emergency revocation must be documented.

## Certificate Rules

Certificate lifecycle must track:

- Certificate identifier.
- Domains.
- Issuer.
- Issued at.
- Expires at.
- Renewal owner.
- Rotation procedure.
- Last verification.
- Audit event.

## Rotation

Rotation events must preserve:

- Secret or certificate id.
- Environment.
- Rotated by.
- Rotation reason.
- Old version reference.
- New version reference.
- Effective time.
- Validation result.
- Audit event.

## Current Gaps

- No external managed secret vault is integrated.
- Secret rotation automation is not fully implemented.
- Certificate renewal monitoring is not centralized.
- Backup encryption key management is recommended but not integrated with a
  managed key system.

## Standardization Plan

1. Preserve current environment templates and secret scanning.
2. Define managed secret vault target.
3. Define secret reference pattern for containers and future Kubernetes.
4. Add rotation runbooks for critical secrets.
5. Add certificate expiration monitoring.
6. Integrate secret access audit in a future approved phase.
