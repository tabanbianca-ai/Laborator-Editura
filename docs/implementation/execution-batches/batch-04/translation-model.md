# Translation Model

The canonical translation contracts are `EditorialTranslation` and `EditorialTranslationSegment`.

## Translation Fields

- `translation_id`
- `project_id`
- `master_document_id`
- `source_version_id`
- `source_language`
- `target_language`
- `translator_id`
- `status`
- `current_version`
- `terminology_profile`
- `translation_memory_profile`
- `created_at`
- `updated_at`

## Segment Fields

- `translation_segment_id`
- `source_block_id`
- `source_text`
- `target_text`
- `source_language`
- `target_language`
- `status`
- `translator_id`
- `reviewer_id`
- `translation_memory_matches`
- `terminology_findings`
- `updated_at`

## Statuses

- `UNTRANSLATED`
- `DRAFT`
- `TRANSLATED`
- `UNDER_REVIEW`
- `REVISED`
- `VALIDATED`
- `LOCKED`

## Source Version Binding

Each translation is linked to the exact source master version through `source_version_id`.
If the source version changes later, the translation becomes `SOURCE_OUTDATED` until reviewed.

## Current Implementation Mapping

- `segment_translations` persists target text and translator attribution.
- `document_segments` preserve segment/source association.
- Translation workspace and editor already show source/target panels and supporting evidence.
