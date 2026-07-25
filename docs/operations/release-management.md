# Operations Release Management

## Purpose

This document defines the operational release management baseline required by
Chapter 15.

It complements `docs/devops/release-management.md` and does not replace
existing release or deployment runbooks.

## Release Inputs

Every release must reference:

- Semantic version.
- Git commit or tag.
- Release owner.
- Release date.
- Change summary.
- Migration notes.
- Compatibility notes.
- Known issues.
- Quality Gate result.
- Backup reference when deployed.
- Rollback reference.

## Release Gates

Release requires:

- CI success.
- Typecheck success when dependencies are available.
- Test success.
- Build success.
- Infrastructure validation.
- Secret scan.
- Backup dry-run.
- Staging deployment success.
- Staging smoke test.
- Human release approval.

## Current Repository Baseline

The repository currently includes:

- CI workflow.
- Staging deployment workflow.
- Staging operations workflow.
- Staging smoke scripts.
- Release checklist.
- Deployment checklist.
- v1.0 release checklist.
- Infrastructure runbooks.

## Release Record

Each deployed release must preserve:

- Version.
- Commit.
- Environment.
- Deployment time.
- Operator.
- Validation result.
- Backup file or reference.
- Rollback ref.
- Incident reference if deployment fails.

## Production Rule

Production deployment must not proceed unless staging validation passes and an
authorized human approves release.

## Current Gaps

- Semantic release automation is not implemented.
- Artifact registry references are not available.
- Production deployment workflow is not yet configured.
- Release notes and changelog are manual.
