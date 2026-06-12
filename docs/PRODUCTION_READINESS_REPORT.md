# Production Readiness Report

Date: 2026-06-11

Scope: MVP backend/core readiness review for security, RLS, audit, error
handling, logging, backup, export validation, deployment, CI/CD, and
multi-tenant isolation.

Review constraint: no new features, no new modules, no scope expansion. Only
the explicitly approved readiness finding may be fixed during each remediation
pass.

## Executive Status

Status: Not production ready.

The MVP backend/core workflow is operational at contract-test level. Critical
authentication and request identity handling finding C-01 has been fixed and
validated by contract tests.

Production release is still not approved because Medium and Low readiness gaps
remain, and hosted CI has not yet been observed on GitHub after this
configuration change.

## Findings

### Critical

#### C-01: Client-controlled identity and role headers can spoof users, tenants, and approval roles

Status: Fixed.

Affected areas:

- `apps/api/src/modules/workflow/workflow.controller.ts`
- `apps/api/src/modules/export/export.controller.ts`
- Other MVP controllers that read `x-user-id` and `x-organization-id` directly.

Evidence:

- Controllers no longer read `x-user-id`, `x-organization-id`, or
  `x-user-roles`.
- Request identity is resolved centrally by authenticated session token or
  validated bearer token before controller handling.

Previous impact:

- A caller can claim another organization ID.
- A caller can claim `ADMIN` or `REVIEWER` role.
- Human final authority can be bypassed at the API boundary.
- Multi-tenant isolation depends on caller honesty instead of authenticated
  session state.

Fix applied:

- Added centralized request context middleware.
- Added `@CurrentActor()` request context access for controllers.
- Derived `userId`, `organizationId`, `roles`, and `permissions` only from the
  authenticated server-side context.
- Rejected requests without a valid authenticated context.
- Updated MVP controllers and services to use server-derived actor context only.

Validation:

- Spoofed `x-user-id` is ignored/rejected.
- Spoofed `x-user-roles` cannot grant admin or reviewer access.
- Spoofed `x-organization-id` cannot access another tenant.
- Valid authenticated context works.
- RBAC remains available from the server-derived context.
- Tenant isolation remains based on authenticated `organizationId`.

#### C-02: Auth login allowed role self-assignment and administrative defaults

Status: Fixed.

Affected file:

- `apps/api/src/modules/auth/auth.service.ts`

Previous behavior:

- `login()` accepted `input.roles`.
- Default login roles included `ADMIN` and `REVIEWER`.

Fix applied:

- Default login role is now `TRANSLATOR`.
- Client-provided roles are no longer assigned by `login()`.

Residual risk:

- None for C-02 within MVP contract scope.

### High

#### H-01: Foundation modules do not yet write audit events

Status: Fixed.

Affected modules:

- Auth
- Projects
- Documents
- Segments
- Translations
- Export

Previous impact:

- Production auditability is incomplete for entity creation, translation
  persistence, and export generation.

Fix applied:

- Auth, Projects, Documents, Segments, Translations, and Export now append
  audit events for their existing foundation mutations.
- Audit events use server-derived actor context only.
- Export embeds collected foundation audit events in JSON Master output.
- Foundation audit persistence contract is present in the MVP foundation
  migration with tenant-scoped, append-only RLS.

Validation:

- API audit contract tests verify audit calls for Auth, Projects, Documents,
  Segments, Translations, and Export.
- Export tests verify JSON Master audit embedding.
- DB migration tests verify foundation audit table, actions, RLS, and
  append-only policy.

#### H-02: Runtime persistence is in-memory while database migrations exist

Status: Fixed.

Previous impact:

- API services currently use in-memory repositories.
- Database RLS policies cannot protect runtime requests until services use the
  database layer.
- Data is lost on process restart.

Fix applied:

- Foundation repositories for Auth/session state, Projects, Documents,
  Segments, Translations, and Export artifacts now use the shared
  database-backed runtime persistence layer.
- API modules inject database-backed repositories while preserving existing
  service contracts and public API behavior.
- Runtime state is persisted through a file-backed database snapshot instead of
  process memory.
- Tenant-sensitive reads use tenant-scoped database access methods aligned with
  the existing server-derived request context and RLS model.

Validation:

- API contract tests verify foundation repositories use database-backed
  persistence and no longer use process-local maps.
- API contract tests verify repository data access is tenant-scoped.
- DB package contract tests verify file-backed persistence, foundation tables,
  and tenant-scoped access helpers.

#### H-03: Backup and restore procedure is specified but not runnable

Status: Fixed.

Previous evidence:

- `SPEC.md` defines backup/export/exit strategy.
- No executable backup or restore workflow exists yet.

Previous impact:

- Recovery point, restore validation, and exit strategy cannot be proven.

Fix applied:

- Added runnable runtime database backup command:
  `node packages/db/scripts/backup-runtime-db.mjs --db .data/laborator-runtime-db.json --out backups/runtime-db-backup.json`
- Added runnable runtime database restore command:
  `node packages/db/scripts/restore-runtime-db.mjs --db .data/laborator-runtime-db.json --in backups/runtime-db-backup.json`
- Backup output is deterministic JSON with format and schema version metadata.
- Backup includes projects, documents, segments, translations, export artifacts,
  audit events, TM entries, terminology entries, QA reports/issues, Semantic
  Fidelity reports/issues, and workflow state.
- Restore validates format, schema version, required tables, row identity,
  tenant ownership, and cross-table tenant references before applying data.
- Restore fails before writing if the backup is invalid.

Validation:

- Backup file generation is tested with the runnable command.
- Restore recreation is tested against all approved MVP data tables.
- Invalid backup rejection is tested before write.
- Tenant boundary preservation is tested after restore.

#### H-04: CI/CD pipeline is missing

Status: Fixed.

Previous evidence:

- No project CI workflow exists in the root repository.

Previous impact:

- Tests, migrations, linting, typecheck, and build are not enforced before
  merge or deployment.

Fix applied:

- Added GitHub Actions CI workflow at `.github/workflows/ci.yml`.
- CI runs API contract/integration tests.
- CI runs DB migration/runtime/backup tests.
- CI runs Shared JSON Master tests.
- CI validates MVP fixture JSON files.
- CI attempts dependency installation and runs `pnpm typecheck` when
  dependencies are available.
- If dependencies are unavailable, CI records a clear typecheck-skipped notice
  while still requiring the contract, DB, shared, and fixture validations.
- README documents local verification commands and the typecheck dependency
  condition.

Validation:

- CI configuration presence and required commands are covered by contract tests.
- README CI/local verification documentation is covered by contract tests.

### Medium

#### M-01: TypeScript typecheck cannot run in the current environment

Status: Open.

Evidence:

- `README.md` documents missing `pnpm`, `npm`, `corepack`, and `tsc`.
- Package registry access is unavailable in this environment.

Impact:

- Type-level regressions cannot be ruled out here.

Required production fix:

- Run `pnpm install` and `pnpm typecheck` when package access is available.

#### M-02: Logging is not production-grade

Status: Open.

Impact:

- There is no structured request logging, security-event logging, or export
  audit logging at the API layer.

Required production fix:

- Add structured logging and define retention/redaction rules.

#### M-03: Error handling is functional but not standardized

Status: Open.

Impact:

- Services use Nest exceptions, but there is no standardized error response
  policy for client-facing codes, correlation IDs, or redaction.

Required production fix:

- Define a shared error response policy before production deployment.

### Low

#### L-01: Deployment readiness is incomplete

Status: Open.

Impact:

- No production Dockerfile, runtime config validation, secret policy, or
  deployment manifest is present.

Required production fix:

- Add deployment artifacts after the runtime and database strategy are approved.

#### L-02: Export validation is present but fixture coverage should expand later

Status: Open.

Current strength:

- Export generation validates JSON Master Format v1 before artifact creation.

Residual gap:

- Contract tests verify integration statically; runtime artifact validation
  should be expanded once TypeScript dependencies and the test runtime are
  available.

## Area Review Summary

Security: C-01 and C-02 fixed at contract-test level.

RLS policies: Present in migrations and tenant-scoped. Foundation API execution
now uses database-backed, tenant-scoped repository access aligned with the RLS
model.

Audit coverage: Strong for foundation modules, TM, Terminology, QA, Semantic
Fidelity, and Workflow at contract-test level.

Error handling: Basic Nest exceptions are present. Production policy missing.

Logging: Not production ready.

Backup strategy: Runnable runtime backup and restore are implemented and
validated at contract-test level.

Export validation: Implemented with JSON Master validator before artifact
creation.

Deployment readiness: Not production ready.

CI/CD readiness: GitHub Actions workflow is configured and documented. Hosted
CI execution still needs to run in GitHub after push/PR.

Multi-tenant isolation: API identity spoofing is fixed at the controller
boundary. Foundation runtime persistence now uses tenant-scoped database access.

## Validation Run

Available validation completed:

- API contract/integration tests: 62 passed, 0 failed.
- DB migration/runtime/backup tests: 39 passed, 0 failed.
- Shared JSON Master tests: 2 passed, 0 failed.
- MVP fixture JSON validation: passed.

TypeScript typecheck was not run due the documented environment limitation.

## Release Decision

Production release: Not approved.

MVP backend/core state: Operational for contract-level MVP workflow validation.

Critical findings remaining: none.

High findings remaining: none.

Required before production:

1. Run the GitHub Actions workflow in hosted CI after push or pull request.
2. Resolve or explicitly accept remaining Medium and Low readiness gaps.
