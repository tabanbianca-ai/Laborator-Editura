# Environment Management

## Purpose

Environment Management defines how Development, Testing, Staging, Production,
and future environments remain isolated, configurable, auditable, and safe.

## Required Environments

Minimum environment types:

- `DEVELOPMENT`.
- `TESTING`.
- `STAGING`.
- `PRODUCTION`.

Each environment must have:

- Independent configuration.
- Separate databases.
- Separate secrets.
- Independent Feature Flags.
- Environment-specific policies.
- Monitoring profile.
- Backup profile.
- Deployment policy.

## Current Repository Baseline

The repository already contains staging-focused configuration:

- `deploy/staging/.env.staging.example`.
- `deploy/staging/docker-compose.staging.yml`.
- `deploy/staging/Dockerfile.api`.
- `deploy/staging/Dockerfile.web`.
- `deploy/staging/scripts/validate-env.mjs`.
- `deploy/staging/scripts/health-check.mjs`.
- `deploy/staging/scripts/staging-smoke-test.mjs`.
- Infrastructure deployment, backup, restore, monitoring, Nginx, systemd, and
  validation scripts under `infrastructure/`.

Current environment rules include:

- Standard `NODE_ENV=production` for staging containers.
- `APP_ENV=staging` to preserve staging semantics.
- Required staging secrets.
- Loopback-bound service ports behind Nginx.
- Runtime database path and backup directory configuration.
- Docker health checks for API and Web.

## Required Target Behavior

Future Environment Management must provide:

- Central environment registry.
- Environment-specific configuration sets.
- Isolated database references.
- Isolated secret references.
- Independent feature flag state.
- Deployment policy metadata.
- Monitoring and alerting profiles.
- Backup and restore policy mapping.
- Environment validation status.
- Environment audit events.

## Secret Isolation

Secrets must:

- Be unique per environment.
- Never be committed.
- Never be logged.
- Never be exposed to frontend bundles unless explicitly public and safe.
- Be represented in configuration only by approved secret references.

## Promotion Policy

Configuration promotion should support:

- Development to Testing.
- Testing to Staging.
- Staging to Production.

Promotion requires:

- Validation.
- Diff review.
- Human approval for production-impacting changes.
- Audit.
- Rollback plan.

## Operational Risk

Current environment configuration is effective for staging, but remains file
and script based. The future Configuration module should centralize metadata
without removing the validated deployment scripts until replacement is tested.
