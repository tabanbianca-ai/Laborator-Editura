# Rollback Plan

Batch 05 is additive.

Rollback steps:

1. Stop using the `@laborator/shared/unified-library` export in consumers.
2. Remove optional JSON Master Batch 05 arrays from generated exports if needed.
3. Ignore canonical library runtime tables in restore consumers.
4. Keep existing `library_publications`, `library_publication_editions`, `library_publication_files`,
   Rights & Provenance, Public Portal, and Commerce data untouched.

No destructive data movement is performed in this batch.
