# Release Management

## Purpose

Release management defines how validated changes become stable platform
versions.

## Versioning

Every release must define:

- Semantic version.
- Git commit.
- Release date.
- Changelog.
- Artifact references.
- Database migration version when applicable.
- Backup point.
- Rollback reference.

## Branching Model

Official branches:

- `main`.
- `develop`.
- `release/*`.
- `feature/*`.
- `hotfix/*`.

Controlled environments must protect `main` and require Pull Request review
and CI success before merge.

## Release Gates

Release requires:

- CI success.
- Typecheck success when dependencies are available.
- Test success.
- Build success.
- Infrastructure validation.
- Backup dry-run.
- Staging deployment success.
- Staging smoke test.
- Release checklist approval.
- Production deployment approval.

## Current Baseline

Current release documentation includes:

- `docs/RELEASE_CHECKLIST.md`.
- `docs/DEPLOYMENT_CHECKLIST.md`.
- `docs/V1_0_RELEASE_CHECKLIST.md`.
- `docs/STAGING_LAUNCH_VALIDATION_REPORT.md`.
- `infrastructure/docs/DEPLOYMENT_RUNBOOK.md`.
- `infrastructure/docs/MAINTENANCE_RUNBOOK.md`.
- GitHub Actions CI and staging deployment workflows.

## Rollback Requirements

Every release must preserve:

- Previous deployable ref or artifact.
- Backup reference.
- Rollback command.
- Health check verification.
- Audit trail.

## Current Gaps

- Semantic release automation is not implemented.
- Changelog generation is manual.
- Artifact registry references are not yet available.
- Production approval workflow is not yet configured.

## Acceptance Criteria

- A release can be traced from version to commit to artifact to deployment.
- Rollback can be executed from a documented previous reference.
- Release approval is explicit and auditable.
