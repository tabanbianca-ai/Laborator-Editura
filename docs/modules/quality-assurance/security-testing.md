# Quality Assurance Security Testing

Security testing validates that platform behavior remains secure across
authentication, authorization, tenant isolation, API access, data handling,
integrations, and release operations.

## Scope

Security validation covers:

- Authentication.
- Authorization.
- RBAC.
- Need-to-Know access.
- Tenant isolation.
- Session security.
- API key governance.
- Secret handling.
- Input validation.
- OWASP risks.
- Injection.
- CSRF.
- XSS.
- SSRF.
- Dependency vulnerabilities.
- Container and filesystem vulnerabilities.
- Audit integrity.

## Current Baseline

The repository already includes security-focused validation:

- Auth context security contract tests.
- Founder protection tests.
- Security hardening tests.
- Security governance tests.
- Need-to-Know access tests.
- Tenant isolation checks in multiple contract suites.
- Committed secret scan in CI.
- Trivy filesystem vulnerability scan in CI.
- Dependency audit when package dependencies are available.

## Security Test Categories

Authentication:

- Login.
- Logout.
- Session validation.
- Session expiration.
- Password change and reset flows.
- MFA metadata where applicable.

Authorization:

- Role permissions.
- Tenant isolation.
- Project and document access.
- Need-to-Know visibility.
- Admin-only operations.

Input and API Security:

- DTO validation.
- Safe errors.
- Injection resistance.
- Rate limiting.
- API key scope validation.

Operational Security:

- Secret scan.
- Dependency vulnerability scan.
- Container image scan.
- Infrastructure configuration validation.
- Backup access checks.

## Quality Gate Inputs

Security gates must fail when:

- Critical vulnerabilities remain open.
- Authentication bypass is detected.
- Authorization bypass is detected.
- Tenant isolation fails.
- Secrets are committed or logged.
- Required security tests fail.
- Production secrets are weak, default, or missing.

## AI Security

AI-related security validation must verify:

- AI agents receive only authorized context.
- AI cannot grant access.
- AI cannot modify security policy.
- AI cannot approve releases or rights.
- AI cannot hide security findings.
- Prompt and model metadata remain auditable.

## Gaps

Future implementation should add:

- Central security test registry.
- Formal OWASP coverage mapping.
- API fuzzing profiles.
- Security waiver workflow.
- Security evidence retention.
- More complete SAST/DAST integration when tools are selected.
