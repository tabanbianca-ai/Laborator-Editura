# Security Architecture

## Purpose

Security Architecture defines the target security boundaries, shared
services, trust assumptions, controls, and protected paths for the entire
platform.

## Zero Trust Architecture

Zero Trust rules:

- Never trust client-provided identity.
- Verify every request.
- Enforce authorization server-side.
- Use Least Privilege.
- Use contextual access decisions.
- Apply continuous verification.
- Segment access by tenant, project, document, role, task, and data
  classification.
- Audit sensitive actions.

## Target Security Flow

```text
Client
  -> Transport Security
  -> Authentication
  -> Session Validation
  -> Authorization
  -> Need-to-Know Evaluation
  -> Policy Evaluation
  -> Business Module
  -> Audit
  -> Observability
```

## Shared Security Services

Shared security services include:

- IAM.
- Request Context Middleware.
- RBAC and permission mapping.
- Need-to-Know access.
- Policy Engine.
- Security Governance.
- Rate Limiting.
- Security Headers.
- Secret Validation.
- Secret Vault metadata.
- Audit.
- Observability.

Modules may reuse these services. Modules must not duplicate authentication,
authorization, security policy, or audit mechanisms.

## Application Security

Application security must cover:

- Input validation.
- Safe error messages.
- Authentication and authorization.
- CSRF and cross-site protection where applicable.
- Security headers.
- Rate limiting.
- Sensitive data filtering.
- Secure session handling.
- Audit for sensitive mutations.

## API Security

API security must cover:

- Server-derived identity.
- Token and session validation.
- Authorization.
- Tenant isolation.
- Rate limiting.
- Safe errors.
- Request correlation.
- Audit of state changes.
- API key and scope governance where used.

## Infrastructure Security

Infrastructure security must cover:

- Firewall rules.
- SSH hardening.
- Docker daemon hardening.
- Nginx and TLS configuration.
- Secret handling.
- Backup protection.
- Monitoring.
- Patch and update process.
- Infrastructure validation.

## AI Security

AI security must cover:

- Need-to-Know context minimization.
- Prompt governance.
- Model approval.
- RAG source governance.
- Output classification.
- Human approval for critical decisions.
- Cost and quota controls.
- Audit of AI executions.

## Current Baseline Assessment

Strengths:

- Security architecture baseline exists in `docs/security/security-architecture.md`.
- IAM module overview defines centralized authentication and authorization.
- Request context derives identity server-side.
- Public endpoint rule is documented.
- Infrastructure Pack includes security hardening assets.

Gaps:

- Central policy-based authorization is not yet the single runtime decision
  point for every action.
- MFA, SSO, WAF, SIEM, managed vault, and Kubernetes security are not yet
  implemented.
- Formal threat model artifacts are not yet complete for every module.

## Standardization Plan

1. Keep centralized auth and request context as current enforcement baseline.
2. Map all sensitive actions to permission and policy checks.
3. Add formal threat models for critical domains.
4. Centralize data classification enforcement.
5. Add managed vault, SIEM, WAF, and MFA enforcement only through approved
   phases.
