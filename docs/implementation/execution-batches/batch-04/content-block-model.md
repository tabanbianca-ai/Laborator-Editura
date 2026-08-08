# Content Block Model

Every editorial unit must have a stable `block_id` so translation, review, correction, comments, layout,
audio, and future media operations can reference exact content.

## Block Types

- `FRONT_MATTER`
- `CHAPTER`
- `SECTION`
- `PARAGRAPH`
- `QUOTE`
- `NOTE`
- `FOOTNOTE`
- `IMAGE`
- `TABLE`
- `BACK_MATTER`
- `REFERENCE`

## Canonical Fields

- `block_id`
- `block_type`
- `order`
- `parent_block_id`
- `text`
- `children`
- `references`
- `notes`
- `metadata`

## Rules

- `block_id` is stable across translations and revisions.
- Reordering is represented as versioned change history, not destructive mutation.
- Derived segments must preserve the source `block_id`.
- Comments, suggestions, correction findings, terminology findings, and media timing references use
  `block_id`.

## Current Implementation Mapping

- `document_segments.id` maps to source segment/block references.
- Author Studio sections and drafts provide manuscript source content.
- JSON Master segments already carry stable `id`, `order`, source text, translations, and metadata.
