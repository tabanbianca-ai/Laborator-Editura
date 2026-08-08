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
| `tsc -p packages/shared/tsconfig.json` | PASS | Shared editorial core and JSON Master contracts compile. |
| `node --test packages/shared/tests/*.test.mjs` | PASS | 20 tests passed, including Batch 04 editorial core contract tests. |
| `tsc -p packages/db/tsconfig.json` | PASS | Runtime database package compiles. |
| `node --test packages/db/tests/*.test.mjs` | PASS | 49 tests passed, including runtime backup/restore coverage. |
| `tsc -p apps/api/tsconfig.build.json` | PASS | API production TypeScript build compiles. |
| `node --test apps/api/tests/*.test.mjs` | PASS | 443 tests passed, including Batch 04 editorial core contract tests. |
| `tsc --noEmit -p apps/web/tsconfig.json` | PASS | Web typecheck passes. |
| `node --test apps/web/tests/*.test.mjs` | PASS | 128 tests passed. |
| `next build` | PASS | 36 routes generated. Non-blocking warning: Next.js ESLint plugin is not configured. |
| `pnpm typecheck` | PASS | 5 workspace packages passed. Non-blocking warning: `pnpm-lock.yaml` is absent, so Turborepo cannot parse a lockfile. |
| `pnpm test` | PASS | 5 workspace packages passed. |
| `pnpm build` | PASS | 5 workspace packages passed. Non-blocking warnings match the targeted build/typecheck notes above. |

## Validation Notes

- `@laborator/shared` build includes the ESM post-build rewrite and emits explicit `.js` exports for runtime compatibility.
- Batch 04 adds contract and documentation coverage only; it does not introduce Docker, staging, database migration, final publishing, or distribution changes.
