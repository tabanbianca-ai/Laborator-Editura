# Batch 01 Rollback Plan

## Rollback Scope

Batch 01 is additive and limited to shared foundations, validation scripts,
documentation, CI gates, ignore rules, and safe health endpoints.

## Rollback Steps

1. Revert Batch 01 files from `changed-files.md`.
2. Restore `.github/workflows/ci.yml`, `.gitignore`, `.prettierignore`, `package.json`,
   `infrastructure/validation/scan-secrets.sh`, API health files, and shared package
   files to the previous commit.
3. Remove newly added Batch 01 docs and shared locale files if rollback is approved.
4. Run `git diff --check`.
5. Run the previous CI/test command set.

## Data and Migration Impact

- No database migrations were added.
- No runtime data format changes were added.
- No Docker/staging runtime changes were added.
- Rollback does not require data restoration.

