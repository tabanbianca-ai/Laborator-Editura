# Editorial Versioning Model

The canonical version contract is `EditorialDocumentVersion` in
`packages/shared/src/editorial-core.ts`.

## Version Fields

- `version_id`
- `master_document_id`
- `version_number`
- `parent_version_id`
- `created_by`
- `created_at`
- `change_type`
- `snapshot_kind`
- `change_summary`
- `content_hash`
- `content_snapshot`
- `status`

## Change Types

- `AUTO_SAVE`
- `MANUAL_SAVE`
- `EDITORIAL_REVISION`
- `TRANSLATION_REVISION`
- `CORRECTION_REVISION`
- `APPROVED_VERSION`
- `RESTORED_VERSION`

## No-Loss Rule

Approved or historical content must never be overwritten. Restoring a historical version creates a new
version using `RESTORED_VERSION`.

Example:

```text
v12 current
restore v7
v13 restored from v7
```

`v7` and `v12` remain intact.

## Autosave Rule

Autosave records are `WORKING_SNAPSHOT` records. Canonical editorial milestones are
`CANONICAL_VERSION` records.

## Version Comparison

`EditorialVersionComparison` supports:

- `ADDED`
- `REMOVED`
- `MODIFIED`
- `MOVED`

Comparison is read-only and must not modify content.
