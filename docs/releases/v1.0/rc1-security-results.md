# RC1 Security Results

Status: LIVE_ACTION_REQUIRED
Generated: 2026-08-12

## Automated Security Evidence Passed

| Area | Result | Evidence |
| --- | --- | --- |
| Secret scan | PASS | `bash infrastructure/validation/scan-secrets.sh` completed successfully |
| Security headers | PASS | API tests cover standard security headers middleware |
| Rate limiting | PASS | API tests cover auth and sensitive endpoint rate limiting |
| Session expiration and idle timeout | PASS | API tests cover expiration and idle validation |
| Public health endpoint | PASS | API tests confirm health endpoints are public and safe |
| Request context | PASS | API tests confirm identity is derived server-side |
| Spoofed headers | PASS | API tests confirm spoofed user, role, and organization headers are not trusted |
| RBAC and permissions | PASS | API tests cover role and permission enforcement |
| Tenant isolation | PASS | API tests cover tenant-scoped access paths |
| Need-to-Know | PASS | API tests cover scoped visibility, temporary access, and revocation metadata |
| Human Final Authority | PASS | API tests cover AI cannot approve, publish, grant rights, or bypass workflow |
| Invalid backup rejection | PASS | Runtime restore rejected invalid backup metadata/data |
| Dependency vulnerability audit | PASS | `pnpm-lock.yaml` exists and `pnpm audit --audit-level high` passes with 0 Critical/High findings |
| Production/staging secret validation | PASS | Live `validate-staging` environment check returned `ok`; no secrets are recorded in this evidence |

## Mandatory Security Evidence Missing

| Area | Result | Evidence Gap |
| --- | --- | --- |
| Live cross-organization attack test | MISSING | No staging adversarial run was available |
| Live IDOR test | MISSING | Contract tests exist, but no live staging adversarial probe was executed |
| Live unauthorized AI/tool/document access | MISSING | Contract tests exist, but no live staging run was executed |
| SAST | MISSING | No dedicated SAST tool output was produced in this run |
| Container/runtime security scan | MISSING | Docker is unavailable in the local validation environment |

## Blocker 08 Closure Attempt

Blocker 08 was evaluated against the repository-supported security evidence.
The repository contains API contract tests, staging health checks, staging smoke
tests, secret scanning, and release evidence validation. It does not currently
contain a dedicated live adversarial security command that exercises all RC1 P1
attack cases against the deployed VPS.

Local evidence that remains valid:

| Check | Result | Evidence |
| --- | --- | --- |
| Secret scan command available | PASS | `infrastructure/validation/scan-secrets.sh` |
| Staging smoke checks spoofed headers | PASS | `deploy/staging/scripts/staging-smoke-test.mjs` compares server-derived `/auth/me` with spoofed `x-user-id`, `x-organization-id`, and `x-user-roles` headers |
| Contract security coverage exists | PASS | `apps/api/tests/auth-context-security-contract.test.mjs`, `apps/api/tests/security-hardening-contract.test.mjs`, `apps/api/tests/security-governance-contract.test.mjs` |
| Live adversarial execution | LIVE_ACTION_REQUIRED | No VPS credentials or live staging execution context are available to Codex in this local environment |

The following minimum adversarial cases still require a live staging evidence
run before RC1 can become full GO:

- unauthenticated module/API requests rejected;
- invalid tokens rejected;
- invalid login rejected;
- spoofed user, role, and organization headers ignored;
- reviewer cannot grant or obtain unauthorized roles;
- cross-organization resource access rejected;
- insecure direct object reference probes rejected;
- malformed requests return safe errors;
- security events are recorded;
- API/web logs do not expose secrets.

## Required Live Commands

Run from the live VPS using the canonical lowercase deployment path:

```bash
cd /opt/laborator-editura
set -a
. deploy/staging/.env.staging
set +a
export STAGING_ENV_FILE=/opt/laborator-editura/deploy/staging/.env.staging
export STAGING_COMPOSE_FILE=/opt/laborator-editura/deploy/staging/docker-compose.artifact.yml
pnpm install --frozen-lockfile
pnpm staging:health
pnpm staging:smoke
pnpm staging:validate
bash infrastructure/validation/scan-secrets.sh
```

Then run and record a live adversarial API probe suite covering unauthorized
requests, invalid tokens, invalid login, role escalation, cross-organization
resource access, IDOR, malformed payloads, and secret exposure. The suite must
use staging credentials from environment variables and must not print secrets.

## Security Decision

No confirmed authorization bypass or cross-organization data leak was found in
automated contract tests.

RC1 security remains LIVE_ACTION_REQUIRED because mandatory live adversarial
evidence, SAST, and container/runtime scan evidence are missing.

## Required Before Pilot

1. Run live staging adversarial tests for cross-organization isolation, RBAC,
   privilege escalation, IDOR, session behavior, and unauthorized AI/tool/data
   access.
2. Run SAST or record the approved replacement static security check.
3. Run container/runtime security scan for the exact deployed artifact.
