# Edition Model

`Edition` represents a concrete editorial manifestation of a Work.

Canonical fields:

- `edition_id`
- `work_id`
- `organization_id`
- `language`
- `locale`
- `edition_type`
- `edition_number`
- `source_edition_id`
- `translation_id`
- `master_document_version_id`
- `publisher`
- `publication_year`
- `isbn`
- `issn`
- `status`
- `rights_record_id`
- `metadata_version`
- `created_at`
- `updated_at`
- `metadata`

Edition types:

- `ORIGINAL`
- `TRANSLATION`
- `REVISED`
- `CRITICAL`
- `ANNOTATED`
- `ACCESSIBLE`
- `DIGITAL`
- `PRINT`
- `AUDIO`
- `VIDEO`

Rules:

- One Work can have multiple Editions.
- A translated Edition must preserve `source_edition_id`, `translation_id`, and `master_document_version_id`.
- ISBN/ISSN belongs to the Edition or publication manifestation, not to the Work.
- Published edition metadata must never be overwritten without metadata history.
