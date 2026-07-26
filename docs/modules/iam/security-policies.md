# IAM Security Policies

## Purpose

Security policies define configurable security rules for identity,
authentication, authorization, sessions, API keys, MFA, and organizational
access.

Policies should be administrable without application code changes.

## Policy Types

The platform must support:

- Password and login policy.
- Session duration policy.
- Account lockout policy.
- MFA requirement policy.
- API key policy.
- Webhook security policy.
- Allowed domain policy.
- IP allowlist/blocklist policy.
- Organization access policy.
- Role permission policy.
- Suspicious activity policy.

## Current Repository Baseline

Implemented foundations:

- `security-governance` models security policies with policy type, status,
  password/login metadata, session duration metadata, API key metadata,
  webhook metadata, allowed domains, IP allowlist/blocklist, MFA placeholder,
  role permission matrix, organization access policy, tenant isolation checks,
  and audit.
- Rate limiting exists for login/auth and sensitive endpoints.
- Account lockout exists after repeated failed login attempts.
- Security headers exist.
- Environment secret validation exists for staging and production.
- Policy Engine models broader compliance policies and exceptions.

## Policy Lifecycle

```text
DRAFT
  -> ACTIVE
  -> DISABLED
```

Future versions should preserve immutable policy history.

## Policy Decision Rules

- Policies must be tenant-scoped unless platform-global.
- Security-critical policies require authorized human approval.
- AI may detect risks and suggest policies.
- AI may not change security policy automatically.
- Policy changes must be audited.
- The most restrictive valid policy wins.

## Enforcement Targets

Policies may affect:

- Login attempts.
- Password requirements.
- Account lockout.
- MFA requirement.
- Session duration.
- API key lifetime.
- Webhook security.
- Organization access.
- Role permission matrix.
- Suspicious session flags.

## Current Gaps

- Several policies are metadata-only and not fully enforced in runtime paths.
- Policy versioning is not yet fully immutable.
- Central policy decision evaluation is not yet used uniformly by every
  module.
- MFA requirement policy is not yet connected to real MFA challenge
  enforcement.

## Audit Requirements

Audit must record:

- Security policy created.
- Security policy updated.
- Security policy activated.
- Security policy disabled.
- Policy violation recorded.
- Suspicious activity recorded.
- Access review created.
- Security human override.
