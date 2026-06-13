# Deployment Checklist

Date: 2026-06-11

Last Release Preparation update: 2026-06-12

Purpose: define the required operational steps for deploying the MVP.

For closed beta staging validation, follow `docs/STAGING_VALIDATION_PLAN.md`.
For the exact staging environment configuration, role bootstrap procedure,
smoke script, and backup/restore commands, follow
`docs/STAGING_DEPLOYMENT_PREPARATION.md`.

## Pre-Deployment

Complete these items before deploying:

- Select the deployment environment.
- Confirm Node.js runtime compatibility.
- Confirm package installation is available.
- Confirm persistent storage for the runtime database.
- Configure runtime database path.
- Configure required environment variables.
- Configure secrets outside source control.
- Confirm network access policy.
- Confirm backup storage location.
- Confirm rollback owner.
- Confirm deployment owner.
- Confirm monitoring owner.

Required environment items:

- API runtime port.
- Web origin or allowed client origin.
- Runtime database path.
- Backup output path.
- Authentication/session secret if required by the deployment target.
- Any production-only service credentials.

## Staging Readiness For Closed Beta

Before a closed beta deployment, staging must provide:

- Package manager access for `pnpm`.
- Network/package registry access needed to install dependencies.
- A persistent runtime database location.
- A backup output location.
- Runtime secrets configured outside source control.
- Hosted CI run against the beta branch or tag.
- A designated deployment owner.
- A designated monitoring and incident response owner.

Closed beta staging is not approved until dependency installation, `pnpm typecheck`, backup/restore dry-run, and MVP smoke test pass in that environment.

## Pre-Deployment Validation

Run before deployment:

- API contract and integration tests.
- DB migration, runtime, and backup tests.
- Shared JSON Master tests.
- Fixture JSON validation.
- TypeScript typecheck when dependencies are available.
- Backup generation from the current runtime database.
- Restore dry-run into a temporary database.

Deployment must not proceed if any Critical or High finding reappears.

## Deployment Steps

1. Check out the approved release branch or tag.
2. Install dependencies in the deployment environment.
3. Run typecheck if dependencies are available.
4. Run the required test suite.
5. Configure runtime environment variables.
6. Configure persistent storage for runtime database state.
7. Create a pre-deployment backup.
8. Start the API service.
9. Start the web service if included in the deployment target.
10. Verify service health.
11. Run the MVP smoke test.
12. Record deployment time, release identifier, and operator.

## MVP Smoke Test

After deployment, verify:

- User can authenticate.
- Server-derived request context is present.
- Spoofed identity headers do not grant access.
- Project can be created.
- Document can be created.
- Segments can be created or loaded.
- Segment translation can be saved.
- Translation Memory entry can be created, searched, and approved.
- Terminology entry can be created and validated.
- QA check can run on a segment and document.
- Semantic Fidelity check can run on a segment and document.
- Workflow can advance through the approved path.
- Workflow blocks invalid transitions.
- Authorized human approval works.
- Ready for Export status can be set only after approval.
- Export artifact is generated.
- Audit events are written.
- Tenant isolation is preserved.

## Backup and Restore Verification

Verify during deployment:

- Backup file is generated.
- Backup JSON includes schema and version metadata.
- Backup JSON validates before restore.
- Restore into a temporary runtime database succeeds.
- Restored projects, documents, segments, translations, export artifacts, audit events, Translation Memory entries, terminology entries, QA data, semantic data, and workflow state are present.
- Tenant boundaries are preserved after restore.

## Rollback Plan

If deployment fails:

1. Stop the new service version.
2. Preserve current logs and audit files.
3. Restore the pre-deployment runtime database backup if data corruption occurred.
4. Redeploy the previous approved release.
5. Run the MVP smoke test.
6. Document the incident and cause.

## Security Controls

Confirm before release:

- No request trusts `x-user-id`.
- No request trusts `x-organization-id`.
- No request trusts `x-user-roles`.
- Role and organization context come from authenticated server-side context.
- Privileged actions require authorized human roles.
- Tenant-scoped data access is preserved.
- Audit events record security-relevant mutations.

## Deployment Approval

Production deployment is approved only after:

- All Critical findings are closed.
- All High findings are closed.
- Remaining Medium and Low findings are resolved or accepted.
- Hosted CI passes.
- Typecheck passes or M-01 is formally accepted.
- Backup and restore dry-run succeeds.
- MVP smoke test succeeds.
