# Work Model

`Work` represents the intellectual work, not a file, translation, ISBN, edition, publication, or format.

Canonical fields:

- `work_id`
- `organization_id`
- `canonical_title`
- `work_type`
- `original_language`
- `first_edition_year`
- `original_author_ids`
- `status`
- `canonical_master_id`
- `rights_status`
- `provenance_status`
- `created_at`
- `updated_at`
- `metadata`

Initial work types:

- `BOOK`
- `ARTICLE`
- `MAGAZINE_CONTENT`
- `POEM`
- `CHILDREN_WORK`
- `EDUCATIONAL_WORK`
- `MULTIMEDIA_WORK`
- `OTHER`

Rules:

- A Work may have many editions.
- A Work may have many translations.
- A Work keeps a link to the canonical master document when one exists.
- A Work must not be duplicated for PDF, EPUB, audio, video, print, or other derived formats.
- Files and digital assets reference the Work or Edition. They do not become the Work.
