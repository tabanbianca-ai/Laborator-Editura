# Staging Deployment Configuration

This directory contains staging-only deployment infrastructure.

Scope:

- Environment configuration.
- Docker staging runtime.
- Health checks.
- Monitoring hooks.
- Backup and restore wrappers.
- No business logic.
- No database schema changes.
- No API contract changes.

## First-Time Setup

```bash
cp deploy/staging/.env.staging.example deploy/staging/.env.staging
```

Edit `deploy/staging/.env.staging` with real staging values. Do not commit the
real `.env.staging` file.

## Validate Environment

```bash
pnpm staging:validate-env
```

## Deploy With Docker Compose

```bash
pnpm staging:deploy
```

Or run only Docker Compose:

```bash
pnpm staging:docker:up
```

## Health Check

```bash
pnpm staging:health
```

## Admin/Reviewer Bootstrap

Run after the API is deployed and before approval/export smoke tests:

```bash
pnpm staging:bootstrap
```

This creates a staging user session, grants the server-side `ADMIN` or
`REVIEWER` role in the runtime database, creates a fresh session, and verifies
that spoofed identity headers do not alter the authenticated context.

## Monitoring Hook

Use this from cron, platform scheduler, or an external monitor:

```bash
pnpm staging:monitor
```

The command prints deterministic JSON and exits with a non-zero status when a
critical check fails.

## Logs

```bash
pnpm staging:logs
pnpm staging:logs:api
pnpm staging:logs:web
```

## Backup

```bash
pnpm staging:backup
```

By default the staging example uses `STAGING_BACKUP_MODE=docker`, so the backup
wrapper runs inside the API container and can access the Docker runtime volume.

## Restore Dry-Run

```bash
STAGING_BACKUP_FILE=/var/backups/laborator/staging/runtime-db-YYYY-MM-DDTHH-mm-ss.json \
pnpm staging:restore:dry-run
```

Restore dry-run writes to `STAGING_RESTORE_DB_PATH`, not the live staging
runtime database.

## End-To-End Staging Validation

```bash
pnpm staging:smoke
```

To run the full operator validation sequence:

```bash
pnpm staging:validate
```

The full sequence validates environment configuration, health, server-side role
bootstrap, MVP smoke flow, and monitoring hook output.
