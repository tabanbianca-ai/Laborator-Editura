# Artifact Catalog Baseline

Status: Batch 01 baseline

## Purpose

This catalog identifies canonical artifact classes and current locations. It preserves
references without moving files.

## Source Artifacts

| Artifact | Location | Owner |
| --- | --- | --- |
| API source | `apps/api/src` | API application |
| Web source | `apps/web` | Web application |
| Shared contracts | `packages/shared/src` | Shared package |
| Runtime database | `packages/db/src` | Database package |
| Runtime backup scripts | `packages/db/scripts` | Database package |
| Infrastructure scripts | `infrastructure` | Platform operations |
| Staging scripts | `deploy/staging/scripts` | Platform operations |

## Test Artifacts

| Artifact | Location |
| --- | --- |
| API contract tests | `apps/api/tests/*.test.mjs` |
| Web tests | `apps/web/tests/*.test.mjs` |
| Shared tests | `packages/shared/tests/*.test.mjs` |
| DB tests | `packages/db/tests/*.test.mjs` |

## Documentation Artifacts

| Artifact family | Location |
| --- | --- |
| Architecture chapters | `docs/ARCHITECTURE_CHAPTER_*.md` |
| Domain model | `docs/domain` |
| Data model | `docs/data` and `docs/database` |
| Codex catalog and standards | `docs/codex`, `docs/standards` |
| Master index | `docs/master` |
| Implementation plans | `docs/implementation` |
| Operations runbooks | `infrastructure/docs` |

## Configuration Artifacts

| Artifact | Location | Notes |
| --- | --- | --- |
| Root package commands | `package.json` | Canonical workspace command entry point. |
| CI pipeline | `.github/workflows/ci.yml` | Existing CI expanded in Batch 01. |
| ESLint config | `eslint.config.mjs` | Shared lint configuration. |
| Prettier config | `.prettierrc.json`, `.prettierignore` | Formatting baseline. |
| Staging env example | `deploy/staging/.env.staging.example` | Example only; real env ignored. |
| Infrastructure backup env example | `infrastructure/backup/laborator-backup.env.example` | Bootstrap source for infrastructure env. |

## Risk Artifacts

| Artifact | Risk | Batch 01 action |
| --- | --- | --- |
| `.swift-module-cache/**` | Generated cache tracked in Git. | Document and prevent new ignore misses. |
| `.pnpm-store/v11/index.db` | Generated package store artifact tracked in Git. | Document and prevent new ignore misses. |

