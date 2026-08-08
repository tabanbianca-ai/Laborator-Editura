# Security Test Evidence

## Validation Commands

Final local validation for this batch must run:

- `git diff --check`
- `pnpm --filter @laborator/db build`
- `pnpm --filter @laborator/api build`
- `pnpm --filter @laborator/api test -- batch-02`
- full available workspace tests when dependencies are available

## Evidence

| Command | Result |
| --- | --- |
| `git diff --check` | PASS |
| `node --test apps/api/tests/batch-02-identity-authz-contract.test.mjs` | PASS, 6 tests |
| `pnpm --filter @laborator/db build` | PASS |
| `pnpm --filter @laborator/api build` | PASS |
| `pnpm --filter @laborator/db test` | PASS, 49 tests |
| `pnpm --filter @laborator/api test` | PASS, 432 tests |
| `pnpm test` | PASS, 5 workspace packages |
| `pnpm build` | PASS, 5 workspace packages |

## Non-Blocking Validation Warnings

- Turborepo reported that `pnpm-lock.yaml` could not be resolved. The test and
  build tasks still completed successfully.
- Next.js reported that the Next ESLint plugin was not detected. The production
  build completed successfully.
