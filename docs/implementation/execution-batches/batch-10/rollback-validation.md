# Rollback Validation

Status: Rollback procedure present; latest validation evidence pending  
Owner: Platform Operations

## Current Assets

- `infrastructure/deploy/rollback-staging.sh`.
- `.github/workflows/staging-operations.yml` supports rollback.
- `infrastructure/docs/DEPLOYMENT_RUNBOOK.md` documents deployment operations.

## Required Evidence

- previous known-good commit;
- rollback command;
- confirmation token;
- container health after rollback;
- API health after rollback;
- web health after rollback;
- data compatibility check;
- incident or validation record.

## RC1 Gate

Rollback must be validated before RC1. Untested rollback is a blocking release risk.

## Batch 10 Status

Rollback scripts and workflow entry points exist. A live staging rollback exercise was not executed locally and remains an RC1 blocker.
