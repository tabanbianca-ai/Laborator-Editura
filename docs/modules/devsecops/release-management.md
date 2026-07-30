# DevSecOps Release Management

## Purpose

Release Management defines how Laborator Editura creates release candidates,
approves releases, publishes artifacts, deploys versions, and rolls back
failed deployments.

## Release Record

Each release must contain:

- `releaseId`.
- `semanticVersion`.
- `releaseNotes`.
- `deploymentPlan`.
- `rollbackPlan`.
- `approvalHistory`.
- `deploymentStatus`.
- `sourceCommit`.
- `artifactRefs`.
- `createdBy`.
- `createdAt`.

## Release Lifecycle

Statuses:

- `DRAFT`.
- `CANDIDATE`.
- `VALIDATED`.
- `APPROVED`.
- `DEPLOYING`.
- `DEPLOYED`.
- `FAILED`.
- `ROLLED_BACK`.
- `ARCHIVED`.

Lifecycle:

1. Release candidate created from a commit.
2. CI validation completed.
3. Security validation completed.
4. Artifacts generated and checksummed.
5. Release notes generated or reviewed.
6. Deployment plan and rollback plan attached.
7. Human approval recorded where required.
8. Deployment executed.
9. Verification completed.
10. Monitoring and rollback readiness confirmed.

## Current Repository Baseline

Current foundations:

- `docs/RELEASE_CHECKLIST.md`.
- `docs/V1_0_RELEASE_CHECKLIST.md`.
- `docs/DEPLOYMENT_CHECKLIST.md`.
- `docs/STAGING_VALIDATION_PLAN.md`.
- `docs/STAGING_LAUNCH_VALIDATION_REPORT.md`.
- `docs/devops/release-management.md`.
- Manual staging deployment and operations workflows.
- Rollback runbooks and scripts.

Current gaps:

- No runtime release registry exists.
- No semantic release automation exists.
- No artifact registry references exist.
- No release signing exists.
- No production release workflow exists.

## Release Notes

Release notes must identify:

- Version.
- Source commit.
- Scope.
- Changes.
- Migration notes.
- Known risks.
- Rollback reference.
- Validation status.

## Rollback First

Every release must define rollback before deployment.

Rollback documentation must include:

- Previous stable release.
- Target commit or artifact.
- Command or workflow.
- Validation steps.
- Communication procedure.

## Audit Events

Audit:

- Release created.
- Release approved.
- Release rejected.
- Release deployed.
- Release failed.
- Rollback executed.
- Release archived.
