# Quality Gates

## Purpose

Quality Gates define the checks that must pass before code can merge, deploy,
or release.

## Required Gates

No release may proceed if:

- Build fails.
- Typecheck fails when dependencies are available.
- Tests fail.
- Migration/runtime database validation fails.
- Secret scan fails.
- Docker Compose validation fails.
- Security checks fail.
- Critical accessibility checks fail.
- Critical staging smoke checks fail.

## Current CI Gates

Current GitHub Actions gates include:

- Repository and infrastructure validation.
- Secret scan.
- Shell syntax validation.
- Docker Compose config validation.
- Systemd syntax validation where available.
- Nginx template validation.
- API contract and integration tests.
- DB migration/runtime/backup tests.
- Shared JSON Master tests.
- Fixture JSON validation.
- Dependency-aware typecheck, lint, test, build, and audit.
- Trivy filesystem vulnerability scan.

## Staging Gates

Staging deployment requires:

- Dependency installation.
- Typecheck.
- Tests.
- Build.
- Infrastructure validation.
- Remote deploy.
- Health checks.
- Backup and rollback support.

## Required Future Gates

- Automated accessibility checks.
- Performance budget checks.
- Coverage trend checks.
- Flaky test detection.
- Production release approval.
- Artifact provenance and signing once registry is enabled.

## Acceptance Criteria

- Pull Request failure blocks merge in controlled environments.
- Staging failure blocks production approval.
- Critical release blockers must be classified and resolved before release.
