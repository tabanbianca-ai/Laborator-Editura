# Laboratorul Editurii

Monorepo foundation for an enterprise translation platform.

## Apps

- `apps/web`: Next.js App Router frontend.
- `apps/api`: NestJS backend API.
- `apps/ai`: FastAPI AI service.

## Packages

- `packages/shared`: shared TypeScript contracts and utilities.
- `packages/db`: database package placeholder for Prisma.

## Current Build Step

Phase 0, Task 0.1: monorepo structure and shared configuration.

The imported master task list is in `docs/MASTER_TASK_LIST.md`.

## Environment Limitation

The current Codex execution environment does not provide `pnpm`, `npm`,
`corepack`, or `tsc` in PATH, and package registry access is unavailable.
Because of that, TypeScript dependency installation and full TypeScript
typechecking cannot be executed in this environment yet.

Until package access is available, MVP validation is performed with existing
contract tests, fixtures, and static inspection only.

## Local Verification

Run the same required validation used by CI:

```bash
node --test apps/api/tests/*.test.mjs
node --test packages/db/tests/*.test.mjs
node --test packages/shared/tests/*.test.mjs
node -e "const fs = require('node:fs'); for (const file of ['apps/api/fixtures/mvp-e2e-validation.json', 'apps/api/fixtures/mvp-operational-workflow.json']) { JSON.parse(fs.readFileSync(file, 'utf8')); console.log('valid', file); }"
```

Typecheck requires package access and installed dependencies. When package
access is available, run:

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm install --no-frozen-lockfile
pnpm typecheck
```

CI always runs the contract, DB, shared, and fixture checks above. CI attempts
dependency installation and runs `pnpm typecheck` only when dependencies are
available; otherwise it records a clear typecheck-skipped notice.
