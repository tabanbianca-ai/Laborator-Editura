# Provenance Model

Every imported, created, generated, or derived resource must preserve origin.

Canonical fields:

- `provenance_record_id`
- `organization_id`
- `resource_id`
- `source_type`
- `source_resource_id`
- `source_location`
- `source_owner`
- `acquisition_method`
- `acquired_by`
- `acquired_at`
- `source_version`
- `transformation_history`
- `validation_status`
- `evidence`

Source types:

- `ORIGINAL_CREATION`
- `AUTHOR_SUBMISSION`
- `AUTHORIZED_IMPORT`
- `PUBLIC_DOMAIN_SOURCE`
- `LICENSED_SOURCE`
- `EXTERNAL_PROVIDER`
- `OCR_EXTRACTION`
- `AI_GENERATION`
- `AI_TRANSFORMATION`
- `LEGACY_MIGRATION`
- `DERIVED_RESOURCE`

Rules:

- Provenance must not be lost during migration, import, transformation, merge, or export.
- Unknown provenance is retained as `NEEDS_REVIEW` or `MISSING`, never deleted.
