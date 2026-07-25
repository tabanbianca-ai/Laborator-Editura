# Security Testing

## Purpose

Security testing verifies that platform security controls remain effective
throughout development and release.

## Required Security Test Areas

- Authentication.
- Session expiration and revocation.
- Account lockout.
- RBAC.
- Need-to-Know access.
- Workspace and tenant isolation.
- API rate limiting.
- Safe errors.
- Security headers.
- Secret validation.
- Founder Protection.
- Platform Creator restrictions.
- Rights and publication gates.
- Public endpoint exposure.

## Current Baseline

Current security tests include:

- `auth-context-security-contract.test.mjs`.
- `security-hardening-contract.test.mjs`.
- `security-governance-contract.test.mjs`.
- `security-hardening-migration.test.mjs`.
- `platform-need-to-know-access-contract.test.mjs`.
- `roles-subscription-entitlements-contract.test.mjs`.
- `founder-protection-contract.test.mjs`.
- Infrastructure secret scanning in CI.
- Trivy filesystem vulnerability scan in CI.

## Required Future Coverage

- Automated SQL injection regression checks for persistence boundaries.
- XSS checks for user-generated frontend rendering.
- CSRF posture checks where browser cookie flows are introduced.
- Dependency vulnerability policy with enforced failure thresholds.
- Public route allowlist tests.
- Secret leak checks for build artifacts.

## Acceptance Criteria

- Security-sensitive regressions fail CI.
- Public endpoints expose only documented public data.
- Sensitive operations require server-derived authenticated context.
- Secrets never appear in logs, fixtures, or client bundles.
