# Backend Security

## Purpose

Backend security implements Chapter 9 and Chapter 12 requirements at service,
API, module, persistence, and operational boundaries.

## Required Controls

- Central IAM.
- Server-derived authenticated request context.
- RBAC plus Need-to-Know scope.
- Tenant and workspace isolation.
- Safe public endpoint allowlist.
- Input validation.
- Rate limiting.
- Account lockout for sensitive auth flows.
- Session expiration and revocation.
- Security headers.
- Environment secret validation.
- Safe error messages.
- Audit for critical actions.

## Current Baseline

Current backend security includes:

- `RequestContextMiddleware` for server-derived authenticated context.
- `CurrentActor` decorator for controller access to context.
- `AuthService` session validation, refresh, logout, password reset, password
  change, email verification, active sessions, account lockout, founder
  protection, and audit/security events.
- `RateLimitMiddleware` for login/auth and sensitive endpoint classes.
- `SecurityHeadersMiddleware`.
- `environment-security.ts` startup secret validation.
- Public health and approved public catalog/community read routes.
- Tenant-scoped runtime database helpers.
- Contract tests for auth context security, security hardening, founder
  protection, roles, subscriptions, Need-to-Know, and security governance.

## Authorization Rules

Authorization must be enforced in application services, not only in
controllers or UI visibility.

Every protected use case must evaluate:

- Authenticated identity.
- Organization/workspace context.
- Role permissions.
- Resource ownership or assignment.
- Need-to-Know scope.
- Subscription entitlement where applicable.
- Resource state and workflow status.
- Policy constraints.

## Security Gaps

- Permission checks are not yet represented as one atomic permission catalog
  across all services.
- Some service methods rely on actor presence and role checks rather than a
  centralized authorization policy engine call.
- API versioned permission documentation is incomplete.
- Background job security context propagation is not yet implemented because a
  central job runner is not yet implemented.

## Acceptance Criteria

- No protected endpoint trusts client-provided identity.
- Unauthorized users cannot load restricted data.
- Sensitive operations are rate limited and audited.
- Public endpoints expose only approved minimal data.
- Future background jobs preserve security context.
