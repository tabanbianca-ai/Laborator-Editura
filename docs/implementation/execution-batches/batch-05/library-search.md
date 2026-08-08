# Library Search

Library search uses the canonical database as source of truth and a rebuildable search projection.

Search fields:

- `title`
- `author`
- `translator`
- `language`
- `original_language`
- `year`
- `work_type`
- `edition_type`
- `status`
- `rights_status`
- `publication_status`
- `keyword`
- `project`

Sorting and cataloging fields:

- title
- author
- language
- type
- edition
- status
- year
- availability

Rules:

- Sorting must be locale-aware.
- Diacritic normalization must be controlled and must not alter canonical titles.
- Filters respect organization, role, project, visibility, and access rights.
- Search index is derived and can be rebuilt.
- Deleting the search index must never delete canonical data.
