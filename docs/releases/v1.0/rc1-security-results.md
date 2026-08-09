# RC1 Security Results

Status: PARTIAL_BLOCKED  
Generated: 2026-08-09

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

## Mandatory Security Evidence Missing

| Area | Result | Evidence Gap |
| --- | --- | --- |
| Dependency vulnerability audit | FAIL | `pnpm audit --audit-level high` failed because no root `pnpm-lock.yaml` exists |
| Live cross-organization attack test | MISSING | No staging adversarial run was available |
| Live IDOR test | MISSING | Contract tests exist, but no live staging adversarial probe was executed |
| Live unauthorized AI/tool/document access | MISSING | Contract tests exist, but no live staging run was executed |
| SAST | MISSING | No dedicated SAST tool output was produced in this run |
| Container/runtime security scan | MISSING | Docker is unavailable in the local validation environment |
| Production/staging secret validation | MISSING | `.env.staging` is not present locally, as expected for secrets; live environment was not validated |

## Security Decision

No confirmed authorization bypass or cross-organization data leak was found in
automated contract tests.

RC1 security remains blocked because mandatory live adversarial evidence and
dependency vulnerability evidence are missing.

## Required Before Pilot

1. Generate or commit lockfile-based dependency evidence, or approve a formal
   replacement vulnerability scan process.
2. Run live staging adversarial tests for cross-organization isolation, RBAC,
   privilege escalation, IDOR, session behavior, and unauthorized AI/tool/data
   access.
3. Run SAST or record the approved replacement static security check.
4. Run container/runtime security scan for the exact deployed artifact.

