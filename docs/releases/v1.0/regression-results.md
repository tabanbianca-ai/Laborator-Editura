# Regression Results

Status: LOCAL_REPOSITORY_PASS_FINAL_ACCEPTANCE_PENDING

## Required Regression Suites

- Unit.
- Integration.
- Contracts.
- E2E.
- Security.
- Accessibility.
- Localization.
- Migration.
- Restore.
- Publishing.
- AI.

## Current Local Evidence

- `node --test apps/api/tests/batch-10-operational-readiness-contract.test.mjs apps/api/tests/batch-11-rc1-stabilization-contract.test.mjs apps/api/tests/batch-12-final-acceptance-contract.test.mjs`: PASS, 21 tests passed.
- `pnpm --filter @laborator/api test`: PASS, 498 tests passed.
- `pnpm --filter @laborator/web build`: PASS, Next production build completed.
- `pnpm typecheck`: PASS.
- `pnpm test`: PASS.
- `pnpm build`: PASS.
- `git diff --check`: PASS.

## Pending Final Regression

After pilot defects are remediated, rerun the full relevant suite against the final candidate and record results here.
