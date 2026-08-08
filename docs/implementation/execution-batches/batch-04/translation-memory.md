# Translation Memory

Translation Memory is implemented by the existing Translation Memory module and normalized by
`EditorialTranslationMemoryMatch`.

## Canonical Entry Fields

- `tm_entry_id`
- `source_language`
- `target_language`
- `source_text`
- `target_text`
- `domain`
- `project_id`
- `quality_status`
- `approved_by`
- `origin`
- `created_at`
- `updated_at`

## Match Types

- `EXACT`
- `HIGH_FUZZY`
- `FUZZY`
- `NO_MATCH`

## Rules

- Only validated translations may become authoritative reuse candidates.
- TM suggestions are proposal-only.
- TM must never silently replace editorial text.
- Reuse must be auditable.

## Current Implementation Evidence

- `apps/api/src/modules/translation-memory` persists entries.
- `TranslationMemoryMatch` exposes `automaticReplacement: false` and `proposalOnly: true`.
- Translation service attaches proposal-only reuse metadata.
