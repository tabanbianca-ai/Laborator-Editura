# Test Evidence

## Required Commands

- `git diff --check`
- `pnpm --filter @laborator/shared build`
- `pnpm --filter @laborator/shared test`
- `pnpm --filter @laborator/db build`
- `pnpm --filter @laborator/db test`
- `pnpm --filter @laborator/api build`
- `pnpm --filter @laborator/api test`
- `pnpm --filter @laborator/web typecheck`
- `pnpm --filter @laborator/web test`
- `pnpm --filter @laborator/web build`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Evidence

Validated during this implementation turn.

| Command | Result | Notes |
| --- | --- | --- |
| `git diff --check` | PASS | No whitespace errors. |
| `tsc -p packages/shared/tsconfig.json` | PASS | Unified Library shared contract compiles. |
| `node --test packages/shared/tests/*.test.mjs` | PASS | 24 tests passed, including Unified Library contracts. |
| `tsc -p packages/db/tsconfig.json` | PASS | Runtime database table inventory compiles. |
| `node --test packages/db/tests/*.test.mjs` | PASS | 49 tests passed, including runtime backup/restore. |
| `tsc -p apps/api/tsconfig.build.json` | PASS | API production TypeScript build compiles. |
| `node --test apps/api/tests/*.test.mjs` | PASS | 450 tests passed, including Batch 05 contracts. |
| `tsc --noEmit -p apps/web/tsconfig.json` | PASS | Web typecheck passes. |
| `node --test apps/web/tests/*.test.mjs` | PASS | 128 tests passed. |
| `next build` | PASS | 36 routes generated. Non-blocking warning: Next.js ESLint plugin is not configured. |
| `pnpm typecheck` | PASS | 5 workspace packages passed. Non-blocking warning: `pnpm-lock.yaml` is absent, so Turborepo cannot parse a lockfile. |
| `pnpm test` | PASS | 5 workspace packages passed. |
| `pnpm build` | PASS | 5 workspace packages passed. Non-blocking warnings match the targeted build/typecheck notes above. |

## Validation Notes

- API tests initially detected that the Batch 03 runtime table inventory had not been updated for the new Batch 05 tables. The inventory was corrected and the full API suite then passed.
- Batch 05 does not add final publishing execution, Docker changes, or destructive migrations.
