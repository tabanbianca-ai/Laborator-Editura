# IAM MFA and SSO

## Purpose

This document defines Multi-Factor Authentication and Single Sign-On
requirements for IAM.

MFA and SSO are security capabilities of IAM only. Functional modules must not
implement separate MFA or SSO flows.

## MFA Target Capabilities

Supported factors:

- TOTP applications.
- FIDO2 hardware keys.
- Passkeys/WebAuthn.
- Recovery codes.

Policy support:

- MFA required by role.
- MFA required by organization.
- MFA required by risk event.
- MFA required for sensitive actions.

Sensitive roles include:

- `PLATFORM_CREATOR`.
- `ADMIN`.
- `EDITOR`.
- `REVIEWER`.

## Current MFA Baseline

Current implementation includes:

- MFA metadata records for sensitive roles.
- Enable/disable MFA metadata.
- TOTP secret placeholder.
- Recovery code metadata.
- Audit events.

Current implementation does not yet enforce MFA as a runtime login challenge.

## MFA Flow

Target flow:

```text
Primary Authentication
  -> MFA Policy Evaluation
  -> MFA Challenge
  -> Factor Verification
  -> Session Creation
```

## SSO Target Providers

Future supported providers:

- Microsoft Entra ID.
- Google Workspace.
- Okta.
- Keycloak.
- Custom OpenID Connect provider.
- Custom SAML 2.0 provider.

## Current SSO Baseline

The architecture supports OAuth2, OIDC, and SAML conceptually, but runtime SSO
provider authentication is not yet implemented.

Gateway and Integration provider metadata provide adjacent configuration
foundations, but SSO provider login belongs to IAM.

## Provider Configuration

Each provider should include:

- `providerId`.
- `organizationId`.
- `providerType`.
- `protocol`.
- `issuer`.
- `clientId`.
- `metadataUrl`.
- `attributeMapping`.
- `roleMapping`.
- `status`.
- `createdBy`.
- `createdAt`.

Secrets must be stored through Secret Vault governance, not in provider
configuration records.

## Security Rules

- SSO must not bypass MFA policies.
- Provider role mapping must be auditable.
- Disabling a provider must prevent new login through that provider.
- Existing sessions may be revoked based on policy.
- AI may suggest provider configuration but may not enable SSO automatically.

## Audit Requirements

Audit must record:

- MFA enabled.
- MFA disabled.
- MFA challenge succeeded.
- MFA challenge failed.
- Recovery code used.
- SSO provider created.
- SSO provider enabled.
- SSO provider disabled.
- SSO login succeeded.
- SSO login failed.
