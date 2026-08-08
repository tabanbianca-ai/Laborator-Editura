# Rollback Plan

Batch 07 is additive.

Rollback steps:

1. Remove distribution commerce shared contract exports.
2. Remove JSON Master additive Batch 07 arrays.
3. Remove Batch 07 runtime table names and backup validation references.
4. Remove Batch 07 tests.
5. Remove Batch 07 documentation.

Existing Public Portal, Commerce, Library, Gateway, Rights, Batch 06
Publishing Engine, Docker, API controllers, frontend routes, and migrations are
not replaced by this batch.

