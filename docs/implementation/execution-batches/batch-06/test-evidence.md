# Test Evidence

Validation executed locally with the bundled Node runtime path:

`PATH=/Users/elenabianca/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`

| Check | Result | Notes |
| --- | --- | --- |
| `git diff --check` | PASS | No whitespace errors. |
| shared build | PASS | `tsc -p packages/shared/tsconfig.json` |
| shared typecheck | PASS | `tsc --noEmit -p packages/shared/tsconfig.json` |
| DB build | PASS | `tsc -p packages/db/tsconfig.json` |
| DB typecheck | PASS | `tsc --noEmit -p packages/db/tsconfig.json` |
| API build | PASS | `tsc -p apps/api/tsconfig.build.json` |
| API typecheck | PASS | `tsc --noEmit -p apps/api/tsconfig.json` |
| Web typecheck | PASS | `tsc --noEmit -p apps/web/tsconfig.json` |
| shared tests | PASS | 29 tests passed. |
| DB tests | PASS | 49 tests passed. |
| API tests | PASS | 457 tests passed. |
| Web tests | PASS | 128 tests passed. |
| Batch 06 API contract test | PASS | 7 tests passed. |
| Next production build | PASS | Build completed; existing warning: Next ESLint plugin not configured. |
| AI compile check | PASS | `PYTHONPYCACHEPREFIX=/tmp/laborator-pycache python3 -m compileall app` |
| Shared ESM runtime smoke | PASS | `import("./packages/shared/dist/index.js")` exposes `PUBLISHING_ENGINE_SCHEMA_VERSION`. |

Workspace Turbo commands were attempted:

- `turbo run typecheck`
- `turbo run test`
- `turbo run build`

They did not complete in this local sandbox because Turbo launched a fallback
`pnpm run ...` inside packages and pnpm attempted to fetch registry metadata
without a `pnpm-lock.yaml`. The equivalent package-level commands above passed.
