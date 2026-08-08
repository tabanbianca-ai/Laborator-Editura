# Correction Engine

Correction findings are canonicalized through `CorrectionFinding`.

## Categories

- spelling
- diacritics
- punctuation
- grammar
- agreement
- word order
- prepositions
- plural forms
- pronouns
- repetitions
- pleonasm
- anacoluthon
- cacophony
- ambiguity
- terminology uniformity

## Fields

- `finding_id`
- `document_version_id`
- `block_id`
- `category`
- `severity`
- `source_range`
- `original_text`
- `suggested_text`
- `explanation`
- `rule_id`
- `created_by`
- `status`
- `resolved_by`
- `resolved_at`

## Rules

- Findings are separate from document changes.
- Accepted findings produce versioned suggestions/changes.
- Rejected findings remain recorded to avoid uncontrolled recurrence where policy allows.
- AI may suggest, but must not directly alter approved content.

## Current Mapping

Existing QA issues cover several correction categories. Batch 04 defines the broader canonical correction
finding model for future expansion.
