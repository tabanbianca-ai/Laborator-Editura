# Original Edition Model

The original edition identity records the edition or source manifestation actually used for editorial work
or translation. It is distinct from the first publication year of the intellectual Work.

Canonical fields:

- `original_edition_id`
- `work_id`
- `organization_id`
- `original_language`
- `first_publication_year`
- `edition_title`
- `publisher`
- `publication_place`
- `publication_year`
- `edition_number`
- `source_type`
- `source_reference`
- `purchase_or_download_reference`
- `verification_status`
- `metadata`

Rules:

- `first_publication_year` records when the Work first appeared.
- `publication_year` records the year of the exact edition used.
- These years must not be merged.
- Translations must reference the exact source edition and source master version.
- Purchase or download references are reused only when legally permitted.
