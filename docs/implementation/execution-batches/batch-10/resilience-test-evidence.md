# Resilience Test Evidence

Status: Local validation passed with live staging evidence pending  
Owner: Platform Operations

## Required Resilience Tests

- backup dry-run;
- restore dry-run;
- corrupted backup rejection;
- API health validation;
- web health validation;
- dependency failure behavior;
- rollback validation;
- critical journey smoke test;
- RPO/RTO measurement.

## Current Repository Evidence

- Runtime backup and restore contract tests exist in `packages/db/tests/runtime-backup-restore.test.mjs`.
- Infrastructure backup, verify, restore dry-run, rollback, and monitoring scripts exist.

## Latest Batch 10 Validation

- `bash infrastructure/validation/validate-infrastructure.sh`: PASS.
- `bash infrastructure/validation/validate-nginx-template.sh infrastructure/nginx/laborator-staging.conf.template`: PASS.
- `bash infrastructure/validation/scan-secrets.sh`: PASS.
- `bash infrastructure/backup/backup-laborator.sh --config infrastructure/backup/laborator-backup.env.example --dry-run`: PASS.
- `pnpm --filter @laborator/db test`: PASS, runtime backup/restore coverage passed.
- `pnpm --filter @laborator/api test`: PASS, API contract coverage passed.
- `pnpm --filter @laborator/web test`: PASS, 128 frontend tests passed.
- `pnpm test`: PASS across all workspace packages.

## Live Evidence Still Required

- Clean staging deployment proof.
- Docker container health proof.
- Real staging backup archive proof.
- Isolated restore dry-run against the real staging backup.
- Rollback exercise proof.
- Complete editorial production critical journey smoke test proof.
