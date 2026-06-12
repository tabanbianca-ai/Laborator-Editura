# Release Checklist

Date: 2026-06-11

Last Release Preparation update: 2026-06-12

Purpose: define the required checks before approving the MVP for production release.

## Release Status

Current status: Release Preparation.

Production approval is blocked until all required checks pass and remaining Medium and Low findings are resolved or formally accepted.

Closed beta preparation is allowed. Closed beta launch is blocked until hosted CI, dependency installation, typecheck, staging deployment, backup/restore dry-run, and MVP smoke test pass in the target environment.

The detailed staging procedure is defined in `docs/STAGING_VALIDATION_PLAN.md`.

## Release Preparation Status

| Item | Status | Notes |
| --- | --- | --- |
| API contract and integration tests | Passed | 62 passed, 0 failed |
| DB migration, runtime, and backup tests | Passed | 39 passed, 0 failed |
| Shared JSON Master tests | Passed | 2 passed, 0 failed |
| Fixture JSON validation | Passed | MVP validation fixtures are valid JSON |
| Runtime backup and restore dry-run | Passed | Local dry-run generated and restored schema version 1.0 backup with 23 tables |
| MVP smoke fixture | Passed | Status `OPERATIONAL`, no blocking gaps |
| Dependency installation | Blocked locally | `pnpm` is unavailable in this environment |
| TypeScript typecheck | Blocked locally | `pnpm typecheck` cannot run until dependencies/tooling are available |
| Hosted CI | Pending | Must be observed on GitHub before release approval |
| Staging deployment | Pending | Requires target environment and runtime configuration |

## Required Validation

Run and record the result of each validation item:

- API contract and integration tests:
  `node --test apps/api/tests/*.test.mjs`
- DB migration, runtime, and backup tests:
  `node --test packages/db/tests/*.test.mjs`
- Shared JSON Master tests:
  `node --test packages/shared/tests/*.test.mjs`
- Fixture JSON validation:
  `python3 -m json.tool apps/api/fixtures/mvp-e2e-validation.json`
  `python3 -m json.tool apps/api/fixtures/mvp-operational-workflow.json`
- Hosted GitHub Actions CI:
  `.github/workflows/ci.yml` must pass on the release branch or tag.
- Dependency installation:
  `pnpm install --no-frozen-lockfile`
- TypeScript check:
  `pnpm typecheck`

If dependency installation or typecheck cannot run in the target environment, the release owner must explicitly accept the risk before any production deployment.

## MVP Workflow Acceptance

The release owner must confirm that the MVP workflow works end-to-end:

Authentication -> Project -> Document -> Segments -> Translation -> Translation Memory -> Terminology Validation -> QA Validation -> Semantic Fidelity Validation -> Workflow Review -> Approval -> Ready for Export -> Export.

Acceptance requirements:

- Authenticated requests use server-derived identity only.
- Tenant isolation is preserved.
- Projects can be created and read by authorized users.
- Documents can be created and segmented.
- Segment translations persist.
- Approved Translation Memory entries can be searched and reused.
- Validated terminology takes priority over Translation Memory and AI suggestions.
- QA can run on segments and documents.
- Semantic Fidelity can run on segments and documents.
- Workflow transition rules block invalid advancement.
- Authorized humans can approve.
- Export artifact generation works.
- Audit events exist for foundation mutations and workflow actions.

## Remaining Findings Acceptance

Before production approval, each open finding must be resolved or formally accepted.

| ID | Finding | Required Decision | Owner | Status | Date |
| --- | --- | --- | --- | --- | --- |
| M-01 | Full TypeScript typecheck pending in dependency-enabled environment | Fix or accept |  |  |  |
| M-02 | Logging not production-grade | Fix or accept for controlled beta |  |  |  |
| M-03 | Error handling not fully standardized | Fix or accept |  |  |  |
| L-01 | Deployment configuration and ownership incomplete | Fix before deploy |  |  |  |
| L-02 | Export validation coverage should expand after MVP | Accept with follow-up |  |  |  |

## Release Artifact Readiness

Complete before release:

- Release branch or tag selected.
- Release notes prepared.
- Known limitations documented.
- Backup created before deployment.
- Rollback plan confirmed.
- Smoke test plan confirmed.
- Production environment variables documented.
- Secrets configured outside source control.
- Audit log retention plan confirmed.
- Post-release monitoring owner assigned.

## Closed Beta Readiness

Complete before opening closed beta:

- Beta branch or tag selected.
- Hosted CI passes.
- Dependencies install in the beta/staging environment.
- `pnpm typecheck` passes.
- Staging deployment target configured.
- Persistent runtime database path configured.
- Secrets configured outside source control.
- Backup and restore dry-run passes in staging.
- MVP smoke test passes in staging.
- Beta organizations and users are explicitly selected.
- Beta access is limited to authorized users only.
- Support and incident owner assigned.
- Remaining Medium and Low findings accepted for closed beta or scheduled.

## Sign-Off

| Area | Owner | Required Status | Actual Status | Date |
| --- | --- | --- | --- | --- |
| Architecture | ChatGPT / System Architect | Approved |  |  |
| Implementation | Codex / Software Engineer | Approved |  |  |
| Security | Release owner | Approved |  |  |
| Data governance | Release owner | Approved |  |  |
| Backup and restore | Release owner | Approved |  |  |
| Deployment | Release owner | Approved |  |  |
| Monitoring | Release owner | Approved |  |  |

## Release Rule

No new major feature may be added before the MVP release. Only release blockers, validation fixes, and approved stabilization work are allowed.
