# DevSecOps Hardening

Status: Current controls inventoried; RC1 evidence pending  
Owner: DevSecOps

## Current Controls

- GitHub Actions CI runs repository validation, contract tests, typecheck when dependencies are available, tests, build, audit, and Trivy filesystem scan.
- Staging deploy workflow runs validation, typecheck, tests, build, and remote deploy.
- Staging operations workflow runs health, backup, backup dry-run, restore dry-run, and rollback operations.
- Infrastructure validators check scripts, configuration examples, Docker Compose, systemd units, nginx templates, and secrets.

## Required RC1 Controls

- Immutable deployment artifact or digest evidence.
- Dependency locking evidence.
- Vulnerability scan evidence.
- Secret scan evidence.
- Security headers and rate limit validation.
- Rollback validation.
- Least privilege production access.
- Break-glass procedure.

## Current Gaps

- Root package lockfile is not present in the current workspace snapshot.
- Trivy scan is non-blocking in CI and must be reviewed before RC1.
- DAST/runtime security validation must be recorded against staging.

## Batch 10 Local Validation

- Shared, DB, API, web, and full workspace builds passed.
- Full workspace typecheck passed.
- Full workspace tests passed.
- Secret scan passed.
- Infrastructure validation passed with local host tool warnings documented in `security-test-evidence.md`.
