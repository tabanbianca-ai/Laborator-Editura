# Deployment Strategy

## Purpose

Deployment strategy defines how validated builds move between environments and
how releases can be rolled back safely.

## Target Deployment Model

The official deployment model is:

- Commit-addressed.
- Artifact-based.
- Environment-configured.
- Human-approved for production.
- Health-checked.
- Rollback-capable.
- Compatible with future blue/green and rolling updates.

## Current Baseline

Current staging deployment includes:

- `deploy/staging/docker-compose.staging.yml`.
- `deploy/staging/Dockerfile.api`.
- `deploy/staging/Dockerfile.web`.
- `infrastructure/deploy/deploy-staging.sh`.
- `infrastructure/deploy/rollback-staging.sh`.
- GitHub Actions staging deployment and operations workflows.
- Container health checks for API and Web.
- Public API health endpoint at `/health`.
- Backup before staging deployment through deployment scripts.

## Deployment Rules

- Do not deploy unvalidated commits.
- Do not use environment-specific application code branches.
- Do not embed secrets into images.
- Do not publish without backup and rollback procedure.
- Do not bypass post-deployment health checks.

## Rollback Rules

Rollback must preserve:

- Runtime data.
- Audit data.
- Backup records.
- Generated artifacts.
- Deployment history.

Rollback must identify:

- Previous commit or artifact.
- Backup point.
- Operator.
- Approval.
- Verification result.

## Future Zero-Downtime Path

Staging may continue using Docker Compose. Production must be prepared for:

- Blue/green deployment.
- Rolling updates.
- Load balancer health checks.
- Graceful shutdown.
- Database migration compatibility windows.
- Background job draining.

## Acceptance Criteria

- Deployment is repeatable from a Git ref or immutable artifact.
- Health checks confirm service availability.
- Rollback command is documented and tested.
- Production release requires explicit approval.
