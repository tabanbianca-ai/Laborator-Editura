# Master Document Schema

The canonical master document contract is `StructuredMasterDocument` in
`packages/shared/src/editorial-core.ts`.

## Principle

Working documents are structured master content. DOCX, PDF, EPUB, audio, video, and print files are imports
or derived artifacts, not the source of truth.

## Model

- `master_document_id`
- `organization_id`
- `project_id`
- `work_id`
- `canonical_title`
- `source_language`
- `schema_version`
- `current_version_id`
- `status`
- `content`
- `metadata`
- `created_by`
- `created_at`
- `updated_at`

## Structured Content

`StructuredMasterContent` contains:

- `front_matter`
- `chapters`
- `back_matter`
- `references`
- `metadata`

## JSON Master Integration

JSON Master now supports optional Batch 04 arrays:

- `masterDocuments`
- `editorialVersions`
- `editorialComments`
- `editorialSuggestions`
- `correctionFindings`
- `editorialApprovals`
- `editorialAiExecutions`

These fields are additive and do not invalidate existing JSON Master fixtures.

## Validation

`validateStructuredMasterDocument` checks:

- schema version;
- required organization and project scope;
- canonical title;
- source language;
- stable block identifiers;
- duplicate block identifiers.
