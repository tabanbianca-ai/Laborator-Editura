# Canonical Security, Identity and Access Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 05:
Canonical Security, Identity and Access.

It is a documentation and governance audit. It does not change authentication
runtime, authorization runtime, API contracts, database schema, secrets,
cryptographic assets, Docker, infrastructure, or UI behavior.

## Audit Date

2026-07-31.

## Baseline Inventory

| Area | Current count or evidence |
| --- | --- |
| IAM module documents | 12 documents under `docs/modules/iam` |
| Security architecture documents | 10 documents under `docs/security` |
| Security Engineering framework documents | 9 documents under `docs/frameworks/security-engineering` |
| Security/auth/admin/gateway runtime files | 26 files across Auth, Security, Security Governance, Enterprise Admin, and Gateway modules |
| Infrastructure security and validation files | 10 files under `infrastructure/security` and `infrastructure/validation` |
| Canonical standards before Standard 05 | Standard 01, Standard 02, Standard 03, and Standard 04 |
| Canonical standards after Standard 05 | Standard 01, Standard 02, Standard 03, Standard 04, and Standard 05 |

## Identity Inventory Summary

Current identity-related foundations include:

- Users.
- Organizations.
- Roles.
- Permissions.
- User roles.
- Sessions.
- Founder Protection.
- Founder Ownership Transfer.
- Platform Creator protection.
- Enterprise Admin users, roles, permissions, memberships, invitations, and
  audit metadata.
- Workspace Need-to-Know grants and temporary access metadata.
- Gateway API key metadata.
- AI agent metadata.
- Security policy and access review metadata.

## Role and Permission Assessment

Current strengths:

- Server-derived request context includes roles and permissions.
- MVP role-to-permission mapping exists.
- Enterprise Admin models role and permission metadata.
- Workspace models Need-to-Know grants and role filtering.
- Founder and Platform Creator protections exist.
- AI cannot grant privileged roles automatically in documented governance.

Current gaps:

- Atomic permission catalog remains incomplete.
- Authorization is not yet a single centralized runtime decision service for
  every module action.
- ABAC and PBAC are documented but not uniformly enforced.
- Some module-specific role checks still exist.
- Workspace-scoped and document-scoped role assignment remains a future
  expansion area.

## Authentication Compliance Report

Current strengths:

- Local authentication exists.
- Login, logout, session check, session refresh, password reset, password
  change, email verification, active sessions, and session revocation are
  documented and implemented as foundations.
- Account lockout exists.
- Session expiration and idle timeout behavior are documented.
- Request context is derived from validated server-side session or token.
- Spoofed client identity headers are not trusted.
- Rate limiting and safe authentication errors exist as foundations.

Current gaps:

- MFA is metadata-only and not yet enforced as a real authentication factor.
- OAuth 2.1 runtime login is not implemented.
- OpenID Connect runtime login is not implemented.
- SAML runtime login is not implemented.
- Passkeys or WebAuthn runtime is not implemented.
- Device verification runtime is not implemented.
- External identity provider federation is not implemented.

## Authorization Analysis

Current strengths:

- RBAC is implemented as the current baseline.
- Protected endpoints require authenticated context except approved public
  surfaces.
- Workflow approval gates require authorized human roles.
- Need-to-Know foundations exist.
- Security Governance and Policy Engine metadata exist.

Current gaps:

- ABAC and PBAC are not fully implemented as runtime engines.
- Fine-grained resource authorization coverage must be audited per module.
- Authorization decision records are not uniformly persisted for every
  sensitive decision.
- Temporary access revocation and active session invalidation need future
  centralized enforcement hardening.

## Secrets Management Review

Current strengths:

- Environment secret validation exists for staging and production.
- Gateway models API keys and webhook secrets as metadata.
- Launch Essentials models Secret Vault metadata.
- Security policies state that secrets must never be logged.
- Infrastructure includes secret scanning validation scripts.

Current gaps:

- External secret vault integration is not implemented.
- Secret rotation runtime is mostly metadata-oriented.
- Secret access audit is not yet centralized across every secret family.
- Provider credential runtime storage remains future work.

## Cryptographic Asset Inventory

Current strengths:

- Standard platform cryptographic utilities are used where needed.
- Password and token handling requirements are documented.
- Webhook secret hashing metadata exists.
- Backup encryption is recommended in infrastructure documentation.

Current gaps:

- No central cryptographic asset registry exists.
- Managed key service integration is not implemented.
- Certificate inventory and renewal workflow are not implemented.
- Field-level encryption is not standardized.
- Backup encryption is recommended but not fully managed.

## Security Event and Audit Review

Current strengths:

- Auth, session, provider, gateway, security governance, admin, workspace, and
  many module mutations have audit foundations.
- Security event documentation exists.
- Observability foundations exist.

Current gaps:

- Not every authorization decision has a persisted decision record.
- Security incident workflow and SIEM integration are not implemented.
- Cryptographic asset usage audit is not centralized.
- Secret access audit is not complete across all future secret families.

## Duplicate Definition Risks

Potential duplicate or overlapping definitions exist across:

- `docs/security`.
- `docs/modules/iam`.
- `docs/frameworks/security-engineering`.
- `docs/modules/devsecops`.
- `docs/frameworks/platform-engineering/secrets-management.md`.
- Gateway API key and webhook metadata.
- Launch Essentials MFA, GDPR, and Secret Vault metadata.
- Enterprise Admin roles and permissions.
- Workspace Need-to-Know metadata.

Standard 05 becomes the canonical owner for security, identity, access,
secrets, and cryptographic asset structure. Existing documents remain local
architecture, module, implementation, or operational guidance and must
reference Standard 05 instead of creating conflicting models.

## Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| Canonical identity model | Partially compliant | Strong IAM foundations exist; canonical model now added |
| Authentication | Partially compliant | Local auth strong; MFA and SSO runtime gaps remain |
| Authorization | Partially compliant | RBAC baseline exists; ABAC/PBAC and centralized decision records future |
| Need-to-Know | Partially compliant | Workspace foundations exist; platform-wide enforcement needs audit |
| Secrets management | Partially compliant | Metadata and validation exist; external vault future |
| Cryptographic assets | Early foundation | Requirements documented; central registry future |
| Security events | Partially compliant | Audit foundations exist; SIEM and centralized security event model future |
| Zero Trust principles | Partially compliant | Server-derived identity and least privilege exist; continuous verification future |

## Immediate Standardization Priorities

1. Treat Standard 05 as canonical owner for security, identity, access,
   secrets, and cryptographic asset rules.
2. Preserve existing Auth, IAM, Founder Protection, Platform Creator, Gateway,
   Enterprise Admin, Workspace, Security Governance, Policy Engine, and
   Launch Essentials behavior.
3. Inventory identities, roles, permissions, sessions, API clients, service
   accounts, AI agents, secrets, and cryptographic assets.
4. Map current RBAC, Need-to-Know, security policy, and admin metadata to the
   canonical identity and authorization models.
5. Plan MFA enforcement, SSO runtime, external vault integration, managed key
   service integration, and security event centralization as future approved
   phases.

