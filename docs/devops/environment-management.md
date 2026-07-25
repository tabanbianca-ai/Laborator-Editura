# Environment Management

## Purpose

Environment management keeps local, development, test, staging, and production
behavior consistent while separating configuration from code.

## Supported Environments

- Local.
- Development.
- Test.
- Staging.
- Production.

## Configuration Rules

- Non-secret examples may be versioned.
- Real environment files must not be committed.
- Sensitive values must be stored in secret management systems.
- `NODE_ENV` must use standard values such as `development`, `test`, or
  `production`.
- Platform-specific environment labels should use `APP_ENV`.
- Startup configuration must be validated.

## Current Baseline

Current environment assets include:

- `deploy/staging/.env.staging.example`.
- `infrastructure/inventory/staging.example.env`.
- `infrastructure/backup/laborator-backup.env.example`.
- `infrastructure/monitoring/monitoring.env.example`.
- `/etc/laborator/infrastructure.env` as the target host configuration path.
- Docker Compose environment variables for API and Web.
- API environment security validation.

## Required Environment Variables

Staging and production must define, at minimum:

- Runtime environment: `NODE_ENV`, `APP_ENV`.
- API port and public URL.
- Web port and public URL.
- Allowed web origin.
- Runtime database path until PostgreSQL migration is approved.
- Backup directory.
- Secret keys.
- Provider credentials when providers are enabled.
- Monitoring configuration.

## Acceptance Criteria

- Environment differences come from configuration only.
- Missing or weak secrets fail startup in controlled environments.
- Configuration examples are safe and non-secret.
- Scripts can run dry-runs without manual first-run failure.
