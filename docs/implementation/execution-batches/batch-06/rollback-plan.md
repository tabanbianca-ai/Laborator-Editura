# Rollback Plan

Rollback is non-destructive because Batch 06 is additive.

Steps:

1. Remove `publishing-engine.ts` and its package exports.
2. Remove JSON Master additive publishing fields.
3. Remove publishing runtime table names from runtime DB and backup library.
4. Remove Batch 06 tests.
5. Remove Batch 06 documentation.

Existing Library, Rights, Export, Workflow, Layout Publishing, Docker, API
controllers, frontend, and database migrations are not modified by this batch.

