# Unified Library Model

The Unified Library is the official repository-facing catalog for editorial and public resources.
It is not a reader-only shelf and not a separate archive.

Canonical fields:

- `library_record_id`
- `organization_id`
- `resource_type`
- `resource_id`
- `library_scope`
- `visibility`
- `availability_status`
- `publication_status`
- `reserved_status`
- `indexed_at`
- `created_at`
- `updated_at`
- `metadata`

Library scopes:

- `PUBLIC`
- `EDITORIAL`
- `RESERVED`
- `WITHDRAWN`
- `ARCHIVED`

Visibility:

- `PRIVATE`
- `TEAM`
- `ORGANIZATION`
- `PUBLIC`

Reserved-for-work fields:

- `reservation_id`
- `library_record_id`
- `project_id`
- `reserved_by`
- `reserved_at`
- `expires_at`
- `status`

Rules:

- Public, editorial, reserved, withdrawn, and archived are states or views of one Library.
- No parallel Archive module, Magazine archive, or reserved repository is created.
- Reserved resources stay linked to project and reservation history.
