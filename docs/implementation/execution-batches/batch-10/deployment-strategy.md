# Deployment Strategy

Status: Staging strategy present; RC1 hardening evidence pending  
Owner: Platform Operations

## Current Strategy

- Manual staging deployment through `.github/workflows/staging-deploy.yml`.
- Remote deploy through `infrastructure/deploy/deploy-staging.sh`.
- Pre-deploy validation runs typecheck, tests, build, and infrastructure checks.
- Deployment includes backup and health checks according to the staging deploy workflow summary.

## Required RC1 Strategy

- deploy from approved commit or tag;
- run CI before deploy;
- create pre-deploy backup;
- deploy immutable artifact or record build digest;
- run health checks;
- run critical journey smoke tests;
- verify rollback path;
- capture evidence.

## Canary/Staged Deployment

For v1.0, staged deployment means staging first, smoke test, then production approval. No automatic production deployment is authorized by this batch.

