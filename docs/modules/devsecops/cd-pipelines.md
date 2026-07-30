# DevSecOps CD Pipelines

## Purpose

CD Pipelines promote validated artifacts through controlled environments,
perform deployment validation, and preserve rollback capability.

## Required CD Flow

```text
Validated Build
  -> Artifact Publication
  -> Development
  -> Testing
  -> Staging
  -> Smoke Test
  -> Backup and Restore Dry-Run
  -> Human Approval
  -> Production
  -> Post-Deployment Verification
  -> Monitoring
```

## Current Repository Baseline

Current staging CD foundations:

- `.github/workflows/staging-deploy.yml` provides manual staging deployment.
- The workflow checks out a selected ref, installs dependencies, runs
  validation, typecheck, tests, and build before deploy.
- Staging deployment uses SSH with GitHub environment secrets.
- Remote deployment calls `infrastructure/deploy/deploy-staging.sh`.
- The staging deploy script performs backup and health checks.
- `.github/workflows/staging-operations.yml` supports health, backup,
  backup dry-run, restore dry-run, and rollback operations.
- Rollback requires explicit `ROLLBACK` confirmation and target ref.

## Environment Promotion

The official promotion order is:

- Development.
- Testing.
- Staging.
- Production.

The repository currently has staging automation. Production automation remains
future work.

## Deployment Requirements

Deployments must preserve:

- Source commit.
- Artifact references.
- Environment target.
- Config references.
- Secret references.
- Approval history.
- Health verification.
- Rollback target.
- Audit event.

## Current Gaps

- Production deployment workflow is not implemented.
- Artifact registry promotion is not implemented.
- Development and Testing environment workflows are not formalized.
- Blue/green and rolling deployment are not implemented.
- Kubernetes operations are not implemented.

## Rollback Requirements

Rollback must:

- Identify target commit or release.
- Require authorization.
- Preserve reason and actor.
- Run deployment verification after rollback.
- Preserve audit evidence.

## Human Approval

Production deployment requires explicit authorized human approval. Automated
systems may validate and deploy only after approval gates are satisfied.
