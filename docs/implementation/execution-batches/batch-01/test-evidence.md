# Batch 01 Test Evidence

Status: Validation completed

| Command | Result | Notes |
| --- | --- | --- |
| `node scripts/validate-configuration.mjs` | Passed | Configuration examples validated. |
| `bash infrastructure/validation/scan-secrets.sh` | Passed | Secret scan completed without printing matched values. |
| `pnpm --filter @laborator/shared typecheck` | Passed | Required bundled Node in local PATH. |
| `pnpm --filter @laborator/shared build` | Passed | ESM post-build export rewrite completed. |
| `node --test packages/shared/tests/*.test.mjs` | Passed | 14 tests passed. |
| `pnpm --filter @laborator/api typecheck` | Passed | Required bundled Node in local PATH. |
| `pnpm --filter @laborator/api build` | Passed | API TypeScript build passed. |
| `pnpm --filter @laborator/api test` | Passed | 426 tests passed. |
| `pnpm --filter @laborator/db typecheck` | Passed | DB TypeScript typecheck passed. |
| `pnpm --filter @laborator/db build` | Passed | DB TypeScript build passed. |
| `pnpm --filter @laborator/db test` | Passed | 49 tests passed. |
| `pnpm --filter @laborator/web typecheck` | Passed | Web TypeScript typecheck passed. |
| `pnpm --filter @laborator/web test` | Passed | 128 tests passed. |
| `pnpm --filter @laborator/web build` | Passed | Next production build passed with existing ESLint plugin warning. |
| `pnpm format:check` | Passed | Scoped Batch 01 formatting gate passed. |
| `pnpm lint` | Passed | Full workspace lint passed with bundled Node/Python in PATH. |
| `pnpm typecheck` | Passed | Full workspace typecheck passed with bundled Node/Python in PATH. |
| `pnpm test` | Passed | Full workspace tests passed; Turbo warned that `pnpm-lock.yaml` is absent. |
| `pnpm build` | Passed | Full workspace build passed; Turbo warned that `pnpm-lock.yaml` is absent and AI build has no output files configured. |
| `bash infrastructure/validation/validate-infrastructure.sh` | Passed with environment warnings | Node ESM validation included after adding bundled Node to PATH; local Docker, nginx, shellcheck, yamllint, and systemd-analyze were unavailable. |
| `bash infrastructure/validation/validate-nginx-template.sh infrastructure/nginx/laborator-staging.conf.template` | Passed with environment warning | Local nginx/docker unavailable; validator rendered full temporary nginx config. |
| `bash infrastructure/backup/backup-laborator.sh --config infrastructure/backup/laborator-backup.env.example --dry-run` | Passed with environment warning | Docker unavailable locally; dry-run produced expected actions without touching live volumes. |
| `git diff --check` | Passed | No whitespace errors. |

## Local Environment Notes

- The interactive shell did not expose `node` or `python` in PATH. Validation used the
  bundled Codex runtime paths for Node.js and Python.
- Direct `pnpm` invocation without the bundled Node path failed because package bin
  shims could not find `node`; rerunning with bundled Node in PATH passed.
- Full workspace build/typecheck initially failed because `apps/ai` invokes `python`;
  rerunning with bundled Python in PATH passed.
- Turbo reported that `pnpm-lock.yaml` is absent. This is a repository baseline warning,
  not introduced by Batch 01.
- Next.js production build reported the existing warning that the Next.js ESLint plugin
  was not detected. This is not introduced by Batch 01.
