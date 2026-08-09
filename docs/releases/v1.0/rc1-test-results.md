# RC1 Test Results

Status: RC1_BLOCKED  
Generated: 2026-08-09  
Candidate commit: `1611b86daad18637c0ed9692846e06af23a67031`  
Branch: `main`

## Candidate Identity

| Item | Result |
| --- | --- |
| Source commit | `1611b86daad18637c0ed9692846e06af23a67031` |
| Branch | `main` |
| Root package | `laboratorul-editurii@0.1.0` |
| Package manager | `pnpm@10.12.1` |
| Workspace package versions | `@laborator/api@0.1.0`, `@laborator/web@0.1.0`, `@laborator/ai@0.1.0`, `@laborator/db@0.1.0`, `@laborator/shared@0.1.0` |
| Database migrations | `0000_mvp_foundation_v1.sql` through `0008_security_hardening_phase_1.sql` |
| Staging runtime command | `node apps/api/dist/apps/api/src/main.js` from `deploy/staging/docker-compose.staging.yml` |
| Immutable RC1 artifact digest | Missing |
| SBOM tied to artifact digest | Missing |
| Final build provenance | Missing |
| Runtime feature flags | No separate active runtime feature flag inventory found |

## Enabled API Modules

The application module registers the following runtime areas:

- AI Governance.
- Auth.
- Author Studio.
- Backup Governance.
- Commerce.
- Collaboration and Community.
- Enterprise Administration.
- Projects, Documents, Segments, and Translations.
- Lexicographic Intelligence.
- Translation Memory.
- Terminology.
- QA.
- Semantic Fidelity.
- Editorial Decision.
- Gateway and Integrations.
- Layout Publishing.
- Launch Essentials.
- Library.
- Media Localization.
- Marketplace.
- Multimedia Creation.
- Observability.
- Platform Engineering.
- Policy Engine.
- Public Portal.
- Research.
- Rights and Provenance.
- Security Governance.
- Scheduling.
- Workspace.
- Workflow.
- Export.
- Health.

## Automated Validation Results

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm typecheck` | PASS | 5 workspace packages succeeded |
| `pnpm test` | PASS | Workspace tests succeeded, including API contract suite |
| `pnpm build` | PASS | Workspace build succeeded |
| `pnpm lint` | PASS | Workspace lint succeeded |
| `pnpm format:check` | PASS | Prettier check passed |
| `pnpm validate:config` | PASS | Configuration examples validated |
| `pnpm --filter @laborator/db test` | PASS | 49 tests passed |
| `pnpm --filter @laborator/shared test` | PASS | 62 tests passed |
| `pnpm --filter @laborator/web test` | PASS | 128 tests passed |
| `pnpm --filter @laborator/api test` | PASS | 505 tests passed |
| `pnpm --filter @laborator/db build` | PASS | `tsc -p tsconfig.json` passed |
| `pnpm --filter @laborator/api typecheck` | PASS | `tsc --noEmit -p tsconfig.json` passed |
| `pnpm --filter @laborator/api build` | PASS | `tsc -p tsconfig.build.json` passed |
| `pnpm --filter @laborator/web typecheck` | PASS | `tsc --noEmit` passed |
| `pnpm --filter @laborator/web build` | PASS | Next production build generated 36 routes |
| `bash infrastructure/validation/scan-secrets.sh` | PASS | Secret scan completed |
| `bash infrastructure/validation/validate-infrastructure.sh` with bundled Node on PATH | PASS_WITH_WARNINGS | Docker, nginx, systemd, shellcheck, and yamllint unavailable locally |
| `bash infrastructure/validation/validate-nginx-template.sh infrastructure/nginx/laborator-staging.conf.template` | PASS_WITH_WARNINGS | Rendered template only because nginx and docker are unavailable locally |
| `pnpm infra:backup:dry-run` | PASS_WITH_WARNING | Dry-run succeeded but Docker volume access was not validated |
| `pnpm audit --audit-level high` | FAIL | `ERR_PNPM_AUDIT_NO_LOCKFILE`: no root `pnpm-lock.yaml` |

## Staging Validation Results

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm staging:health` | FAIL | API and web checks failed because no local staging services were listening |
| `pnpm staging:validate-env` | FAIL | Required staging environment variables were not loaded in this local shell |
| `pnpm staging:validate` | FAIL | Failed at environment validation |
| `pnpm staging:restore:dry-run` | FAIL | `STAGING_BACKUP_FILE is required` |

## Local API Runtime Probe

The built API binary was launched with a temporary runtime DB and production-like
environment variables. Nest module initialization and route mapping completed,
but the local sandbox denied binding to `0.0.0.0:3101` with `EPERM`.

Result: APPLICATION_BOOTSTRAP_PARTIAL, HEALTH_NOT_PROBED_LOCALLY.

This is recorded as missing local runtime evidence, not as an application defect.

## Isolated Runtime Restore Probe

An isolated runtime DB file was created in `/tmp`, backed up, restored to a
separate file, and inspected.

| Step | Result |
| --- | --- |
| Create isolated source runtime DB | PASS |
| `backup-runtime-db.mjs` | PASS, schema version `1.0`, 291 tables |
| `restore-runtime-db.mjs` | PASS, schema version `1.0`, 291 tables |
| Restored record check | PASS, organization and project relationship preserved |
| Invalid backup rejection | PASS, invalid metadata/data rejected |

This validates the runtime backup format locally. It does not replace a live
staging Docker-volume restore rehearsal.

## Critical E2E Coverage

Repository-level contract coverage passed for:

- MVP end-to-end workflow.
- Translated book workflow.
- Original manuscript workflow.
- Children's book workflow.
- Magazine workflow.
- Audiobook workflow.
- Video workflow.
- Pipeline route coverage.
- Distribution Center route coverage.
- Rights, language policy, publication, multimedia, AI governance, and audit
  safeguards.

Live staging E2E execution did not pass because staging services were not
available in this local validation context.

## Final Result

RC1 is not ready for pilot or certification.

Reason: automated repository tests passed, but mandatory release evidence is
missing or failed for immutable artifact provenance, dependency vulnerability
audit, live staging deployment, live health checks, live staging smoke tests,
live isolated restore, rollback rehearsal, browser accessibility review,
browser localization review, and staging performance baseline.

