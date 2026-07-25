# CI/CD

## Purpose

CI/CD ensures that every change is validated, built, and delivered through a
reproducible pipeline.

## Current CI Baseline

GitHub Actions currently provides:

- Repository and infrastructure validation.
- Secret scanning through `infrastructure/validation/scan-secrets.sh`.
- Shell syntax validation.
- Docker Compose configuration validation.
- Systemd unit syntax validation where available.
- Nginx template validation.
- API contract and integration tests.
- Runtime database and backup tests.
- Shared JSON Master tests.
- Fixture JSON validation.
- Dependency-aware typecheck, lint, test, build, and audit.
- Trivy filesystem vulnerability scan.

## Current CD Baseline

GitHub Actions currently provides:

- Manual staging deployment from a selected ref.
- Pre-deploy validation with install, typecheck, test, build, and
  infrastructure checks.
- SSH-based deploy to staging VPS.
- Manual staging operations for health, backup, backup dry-run, restore
  dry-run, and rollback.

## Required CI Stages

Pull Requests must validate:

- Documentation syntax and required files.
- Infrastructure scripts.
- Secret scanning.
- TypeScript typecheck.
- Tests.
- Build.
- Docker Compose configuration.
- Migration/runtime database validation.
- Security scan.

## Required CD Stages

Delivery must support:

1. Build immutable artifacts.
2. Publish artifacts.
3. Deploy to Development.
4. Run automated validation.
5. Deploy to Staging.
6. Run smoke tests and restore dry-run.
7. Require authorized approval.
8. Deploy to Production.
9. Run post-deployment checks.
10. Monitor and rollback if needed.

## Current Gaps

- Artifact registry publication is not yet configured.
- Production deployment workflow is not yet configured.
- Changelog and semantic release automation are not yet configured.
- Required branch protection is a repository setting and cannot be fully
  enforced from code alone.

## Acceptance Criteria

- Failed CI blocks merge.
- Staging deployment runs only after validation.
- Production deployment requires human approval.
- CI/CD secrets are stored in platform-approved secret stores or GitHub
  environment secrets, never in source.
