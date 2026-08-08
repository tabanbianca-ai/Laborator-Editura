# Rollback Plan

Batch 04 changes are additive.

## Rollback Steps

1. Revert `packages/shared/src/editorial-core.ts`.
2. Revert the `editorial-core` export from `packages/shared/src/index.ts`.
3. Revert the package export and ESM rewrite entries.
4. Revert optional JSON Master editorial-core fields from types, schema, and validation.
5. Remove Batch 04 tests.
6. Remove Batch 04 documentation folder.

## Data Safety

No destructive data migration, table rename, Docker change, staging change, or API route replacement was
introduced. Existing runtime data remains compatible.
