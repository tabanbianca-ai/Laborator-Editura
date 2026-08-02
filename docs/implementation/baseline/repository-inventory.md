# Repository Inventory Baseline

Status: Batch 01 baseline  
Baseline branch: `main`  
Baseline commit: `ec394a67061fa54fc2610ba89f859f4911c57c7a`  
Generated for: P0/P1 repository stabilization

## Purpose

This inventory records the repository state before Batch 01 implementation work. It is
non-destructive and does not authorize removal, renaming, schema changes, API changes,
Docker changes, or module rewrites.

## Workspace Structure

| Path | Purpose | Notes |
| --- | --- | --- |
| `apps/api` | NestJS API application | Module-based backend with contract tests in `apps/api/tests`. |
| `apps/web` | Next.js web application | Existing frontend shell, workspace pages, and UI tests. |
| `apps/ai` | AI application placeholder/surface | Present in repository; not changed by Batch 01. |
| `packages/shared` | Shared TypeScript contracts and helpers | Owns product constants, JSON Master Format, language policy, and Batch 01 shared foundations. |
| `packages/db` | Runtime database and backup helpers | Runtime database abstraction and backup/restore test surface. |
| `deploy/staging` | Staging Docker and operational scripts | Not changed by Batch 01 unless required for validation; current scope avoids Docker changes. |
| `infrastructure` | VPS infrastructure pack | Validation, backup, monitoring, nginx, systemd, and security scripts. |
| `docs` | Canonical architecture, standards, implementation, and operations documentation | Documentation-heavy working tree already has pending owner changes. |

## Current Git State

- Current branch: `main`.
- Current baseline commit: `ec394a67061fa54fc2610ba89f859f4911c57c7a`.
- Remote tracking branch: `origin/main`.
- Working tree already contains uncommitted documentation changes from previous Codex
  architecture and standards work. Batch 01 must not revert or overwrite them.
- Existing untracked files before Batch 01 were CIEF implementation documents under
  `docs/implementation/`.

## Package Commands

| Command | Current meaning |
| --- | --- |
| `pnpm install` | Install workspace dependencies. |
| `pnpm typecheck` | Run workspace TypeScript checks through Turbo. |
| `pnpm lint` | Run workspace lint through Turbo. |
| `pnpm test` | Run workspace tests through Turbo. |
| `pnpm build` | Run workspace build through Turbo. |
| `pnpm infra:validate` | Run infrastructure validation. |
| `pnpm infra:scan-secrets` | Run infrastructure secret scan. |
| `pnpm staging:validate` | Validate staging configuration. |

## Known Generated or Heavy Artifacts

Tracked generated artifacts were identified before remediation. They are recorded here
for owner-approved cleanup in a later batch:

- `.pnpm-store/v11/index.db`
- `.swift-module-cache/**`

Ignored generated or local artifacts are present in the workspace but are already mostly
covered by ignore rules, including `.deps`, `work_audio`, media files, `.next`, `dist`,
and `node_modules`.

## Constraints

- No destructive cleanup is performed in Batch 01.
- Tracked generated artifacts are not removed in Batch 01.
- Runtime product behavior must remain unchanged except for additive health endpoints
  and shared foundation utilities.

