# DevSecOps CI Pipelines

## Purpose

CI Pipelines validate repository changes before they can be promoted through
release and deployment workflows.

## Required CI Stages

The official CI pipeline must support:

- Repository validation.
- Infrastructure validation.
- Secret scanning.
- Static analysis.
- TypeScript typecheck.
- Linting.
- Unit tests.
- Integration tests.
- Contract tests.
- Runtime database and backup tests.
- Fixture validation.
- Build.
- Docker Compose validation.
- Security vulnerability scan.
- Artifact metadata generation.

## Current Repository Baseline

Current `.github/workflows/ci.yml` includes:

- Repository and infrastructure validation.
- Secret scanning through `infrastructure/validation/scan-secrets.sh`.
- Shell syntax validation for `.sh` scripts.
- Docker Compose configuration validation.
- Systemd unit syntax validation where available.
- Nginx template validation.
- API contract and integration tests.
- Runtime database and backup tests.
- Shared JSON Master tests.
- Fixture JSON validation.
- Dependency-aware typecheck, lint, tests, build, and audit.
- Trivy filesystem vulnerability scan when available.

## Pipeline Inputs

CI is triggered by:

- Push to `main`.
- Push to `master`.
- Pull request.

## Build Reproducibility

CI must preserve:

- Source commit.
- Node version.
- pnpm version.
- Dependency lock state.
- Build command.
- Test command.
- Security scan results.
- Artifact checksums when artifacts are published.

## Current Gaps

- Artifact registry publication is not yet implemented.
- Artifact signing is not yet implemented.
- Full dependency provenance is not yet generated.
- Some checks depend on package access availability.
- Branch protection enforcement must be configured outside the repository.

## Security Requirements

- Secrets must never be printed.
- CI permissions must follow least privilege.
- Security scans must not expose secret values.
- Failed security validation must block protected releases.

## Audit Events

Audit:

- Build started.
- Build succeeded.
- Build failed.
- Security scan completed.
- Artifact metadata generated.
- CI validation skipped because dependency access was unavailable.
