# Canonical Security Testing Standard

## Purpose

This document defines mandatory security validation for code, dependencies,
configuration, infrastructure, identity, access control, secrets, APIs,
integrations, and release gates.

## Security Testing Scope

Security testing must cover:

- Authentication.
- Authorization.
- Server-derived identity context.
- RBAC.
- Need-to-Know.
- Tenant isolation.
- Session security.
- MFA metadata where applicable.
- API keys.
- Webhook secrets.
- Secret validation.
- Rate limiting.
- Account lockout.
- Security headers.
- Dependency vulnerabilities.
- Infrastructure hardening.
- Backup and restore security.
- Audit coverage.

## Required Security Checks

Required security checks include:

- Static validation.
- Dependency audit.
- Secret scanning.
- API authorization tests.
- Tenant isolation tests.
- Spoofed identity rejection tests.
- Role escalation prevention tests.
- Protected endpoint tests.
- Public endpoint safety tests.
- Infrastructure configuration checks.
- Backup/restore access checks.

## Vulnerability Severity

Security findings must use:

- `CRITICAL`.
- `HIGH`.
- `MEDIUM`.
- `LOW`.
- `INFORMATIONAL`.

Open critical vulnerabilities block release.

Open high vulnerabilities block release unless an authorized risk acceptance
exists.

## Test Data Security

Security tests must not expose:

- Real passwords.
- Real tokens.
- Real API keys.
- Real secrets.
- Private user data.
- Confidential manuscripts.

Secret-looking values in tests must be safe placeholders.

## Security Gate

The security gate must verify:

- Required security tests passed.
- Critical vulnerabilities are closed.
- High vulnerabilities are remediated or formally accepted.
- Secrets are not committed.
- Protected environment secret validation passes.
- Audit coverage exists for security-sensitive actions.

## Audit

Audit must record:

- Security test executed.
- Vulnerability detected.
- Vulnerability triaged.
- Vulnerability remediated.
- Risk acceptance requested.
- Risk acceptance approved or rejected.
- Security gate passed or failed.
