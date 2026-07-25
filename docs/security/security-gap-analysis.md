# Security and Governance Gap Analysis

## Purpose

This document compares the current repository baseline with Chapter 9 -
Security, Identity, and Governance Architecture.

## Summary

The repository already contains strong security foundations for the MVP and
Phase 2-7 scaffolding: server-derived request context, sessions, account
lockout, rate limiting, security headers, environment secret validation,
security governance metadata, policy engine metadata, Need-to-Know access,
Gateway secrets, Launch Essentials, audit, observability, and backup coverage.

The target architecture requires these foundations to converge into one
central IAM and policy-based authorization model with complete atomic
permissions, workspace-first isolation, platform-wide data classification,
enforced MFA where configured, durable immutable audit, and mature secret
management.

## Current Strengths

- Authentication is centralized in the Auth module.
- Protected requests use server-derived authenticated context.
- Client identity spoofing is not used for authorization context.
- Sessions support expiration, idle timeout, refresh, revocation, active
  session management, and audit.
- Login failure, lockout, and safe error handling exist.
- Security headers exist.
- Rate limiting exists for auth and sensitive endpoints.
- Strong secret validation exists for staging and production environments.
- Gateway hashes API key and webhook secrets.
- Secret Vault metadata exists.
- MFA metadata exists for sensitive roles.
- GDPR metadata exists.
- Security Governance models security policies, access reviews, session
  events, API key events, policy violations, and audit.
- Policy Engine models compliance rules, evaluations, exceptions, and audit.
- Workspace Need-to-Know model and confidential classifications exist.
- Runtime backup includes security, auth, workspace, policy, gateway, MFA,
  GDPR, secret, and audit tables.

## Gaps

### Atomic Permission Catalog

Gap:

- Current runtime permission mapping is MVP-sized.

Required alignment:

- Expand to a complete atomic permission catalog across all modules and
  resource scopes.

### Central Policy Authorization

Gap:

- Many modules still perform local role or permission checks.

Required alignment:

- Introduce a central policy decision service while preserving module-owned
  domain validation.

### Workspace Isolation

Gap:

- Workspace concepts exist, but many repositories and tables primarily isolate
  by `organizationId`.

Required alignment:

- Make workspace scope a first-class authorization and data isolation input
  where the domain requires it.

### MFA Enforcement

Gap:

- MFA currently exists as metadata, not as an enforced authentication factor.

Required alignment:

- Enforce MFA for configured sensitive roles when scheduled.

### OAuth, OIDC, and SSO

Gap:

- These are architecture-supported but not fully implemented.

Required alignment:

- Add them through IAM only, not module-specific flows.

### Secret Management

Gap:

- Secret Vault stores metadata and placeholders. External vault integration and
  real encrypted secret lifecycle are not yet implemented.

Required alignment:

- Introduce approved encrypted storage or external vault integration.

### Data Classification

Gap:

- Classification exists in Workspace Need-to-Know and module rules, but not as
  a platform-wide classification service.

Required alignment:

- Centralize classification and connect it to access, AI, export, and backup.

### Audit Immutability

Gap:

- Audit exists broadly, but durable immutability guarantees are not yet
  standardized.

Required alignment:

- Define immutable audit storage and retention strategy.

### API Security Policy

Gap:

- CORS and CSRF policies need explicit architecture-level documentation for
  browser deployment flows.

Required alignment:

- Document and enforce CORS/CSRF based on public, app, and API domain model.

## Risk Assessment

Current risk: Medium.

Reason:

- MVP security controls are meaningful and tested.
- The target enterprise governance model is broader than the current
  implementation.
- Immediate broad refactoring could destabilize validated Phase 7 Step 16
  behavior.

## Recommended Priority

Before structural security changes:

1. Define canonical IAM and policy decision contracts.
2. Expand atomic permission catalog.
3. Map current local authorization checks.
4. Define workspace-level enforcement requirements.
5. Centralize data classification.
6. Formalize audit immutability.
7. Implement MFA enforcement only after policy contracts are stable.
