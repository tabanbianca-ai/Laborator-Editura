# Migration Plan

Batch 08 adds runtime table inventory and backup coverage only.

No physical database migration is introduced in this batch.

Legacy multimedia assets are preserved and classified as:

- `CANONICAL`.
- `LEGACY_MULTIMEDIA`.
- `SOURCE_VERSION_UNKNOWN`.
- `RIGHTS_UNKNOWN`.
- `VOICE_CONSENT_UNKNOWN`.
- `ACCESSIBILITY_UNKNOWN`.
- `ORPHANED`.

Unknown lineage, rights, consent, or accessibility status must be reviewed
instead of invented or deleted.

