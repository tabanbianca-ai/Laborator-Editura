# IAM Gap Analysis

## Purpose

This document compares the current repository baseline with the official
Identity, Access Management and Security Module specification.

## Summary

The repository has a strong IAM and security foundation for the current
platform. Auth, request context, RBAC mapping, session management, account
lockout, security headers, rate limiting, security governance, policy engine,
enterprise administration, workspace Need-to-Know access, API keys, MFA
metadata, GDPR metadata, and Secret Vault metadata already exist.

The target architecture requires a broader centralized IAM decision layer with
complete atomic permissions, configurable policy-driven authorization, runtime
MFA enforcement, SSO provider runtime support, distributed session strategy,
event versioning, and platform-wide permission audit.

## Gap Table

| Area | Current baseline | Required target | Risk |
| --- | --- | --- | --- |
| Local auth | Implemented | Preserve and harden | Low |
| Request context | Server-derived | Preserve and expand | Low |
| RBAC | MVP permissions | Atomic permission catalog | Medium |
| Authorization | Module-local checks plus shared context | Central decision service | High |
| Need-to-Know | Workspace foundation | Enforced uniformly | Medium |
| MFA | Metadata-only | Runtime MFA challenge | High |
| SSO | Architecture-supported | OIDC/SAML runtime providers | High |
| Sessions | Expiration, refresh, revocation | Distributed cache and revocation propagation | Medium |
| Security policies | Metadata foundation | Runtime policy enforcement | Medium |
| API keys | Gateway metadata | Unified IAM service principals | Medium |
| Audit | Broad module audit | Unified IAM event contracts | Medium |
| Events | Dispersed | Versioned IAM events | Medium |

## Current Strengths

- Auth module covers core authentication lifecycle.
- RequestContextMiddleware blocks unauthenticated protected requests.
- Identity is derived from server-side token/session state.
- Public route exceptions are explicit.
- Spoofed identity headers are not used for authenticated context.
- Account lockout, rate limiting, security headers, and secret validation
  exist.
- Session expiration, idle timeout, refresh, revocation, and audit exist.
- Founder Protection and Platform Creator protection exist.
- Enterprise Admin and Workspace provide role, team, invitation, permission,
  Need-to-Know, entitlement, and audit foundations.
- Security Governance and Policy Engine provide policy metadata and access
  review foundations.
- Runtime backup covers current IAM/security-related tables.

## Authentication Assessment

Current authentication is suitable for local-auth MVP operation.

Remaining target gaps:

- Enforced MFA challenge.
- OAuth2/OIDC/SAML login provider runtime.
- Passkeys/WebAuthn runtime.
- Personal access token runtime.
- Central provider configuration lifecycle.

## Authorization Review

Current authorization uses server-derived roles and permissions plus
module-specific checks.

Target gap:

- All module actions should converge toward a central IAM authorization
  decision service.

This must be incremental because many validated module gates already work.

## RBAC Evaluation

Current role mapping is MVP-sized and effective for existing features.

Target gap:

- Complete atomic permission catalog and versioned role definitions.

## MFA and SSO Assessment

MFA metadata exists for launch readiness, but runtime MFA enforcement is not
implemented.

SSO is architecture-supported but not yet implemented as a runtime login
provider.

## Security Policy Analysis

Security Governance models policies and violations, but not every policy is
connected to runtime enforcement.

The platform should gradually connect policies to Auth, Gateway, Workspace,
and module authorization decisions.

## Performance Review

The target IAM architecture must support:

- Concurrent logins.
- Fast permission validation.
- Distributed session cache.
- Revocation propagation.
- Horizontal scaling.
- High availability.

Current runtime is suitable for MVP and staging foundations but does not yet
model a distributed IAM cache or policy decision cache.

## Risk Evaluation

### Fragmented Authorization Risk

Module-specific role checks can drift unless centralized through IAM.

### MFA Gap Risk

Sensitive roles currently have MFA metadata, not enforced MFA challenges.

### SSO Integration Risk

Future provider integrations could create duplicate identity paths unless all
providers route through IAM.

### Permission Catalog Risk

The MVP permission set is intentionally broad. Full production governance
requires atomic permissions.

### Session Scale Risk

Distributed deployments require fast session validation and revocation
propagation.

## Acceptance Gaps

IAM is incomplete until:

- Runtime MFA enforcement exists.
- SSO providers are configured and authenticated through IAM.
- Authorization decisions are centralized.
- Atomic permissions are complete.
- Security policies are enforced uniformly.
- IAM events are versioned.
- Distributed session strategy is available.
