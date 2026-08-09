# Deployment Rehearsal

Status: Procedure defined; live rehearsal pending  
Owner: Platform Operations

## Required Flow

RC1 Artifact -> Staging Deployment -> Migration -> Smoke Tests -> E2E Critical Tests -> Health Validation -> Rollback -> Redeploy.

## Current Assets

- `.github/workflows/staging-deploy.yml`.
- `.github/workflows/staging-operations.yml`.
- `infrastructure/deploy/deploy-staging.sh`.
- `infrastructure/deploy/rollback-staging.sh`.
- `infrastructure/monitoring/monitor-laborator.sh`.

## RC1 Gap

The rehearsal must be executed with the exact immutable RC1 candidate artifact or a documented equivalent digest strategy.

