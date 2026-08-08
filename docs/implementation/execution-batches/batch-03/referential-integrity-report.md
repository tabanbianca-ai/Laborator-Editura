# Referential Integrity Report

Referential integrity rules are represented by `ReferentialIntegrityRule` in
`packages/shared/src/canonical-data.ts`.

| relationship | implementation evidence | policy | status |
| --- | --- | --- | --- |
| organization -> project | `projects.organizationId` | reject cross-organization access | protected by tenant repository |
| project -> manuscript | `author_manuscripts.projectId` optional | report orphaned optional references | needs future data scan |
| work -> edition | `library_publication_editions.publicationId`, `commerce_editions.publicCatalogItemId` | restrict parent removal | documented |
| work -> translation | `documents`, `segment_translations`, JSON Master links | preserve source alignment | documented |
| edition -> publication | `library_publication_editions`, `public_catalog_items` | restrict or archive | documented |
| derived asset -> source | `export_artifacts`, `multimedia_assets`, `media_localization_assets` | report missing source references | documented |
| rights -> resource | rights records with project/document references | block publication when invalid | implemented in rights/publishing surfaces |
| workflow -> resource | `workflow_states`, `workflow_transitions` | reject invalid scoped transition | implemented in workflow services |
| user -> assignment | `user_roles`, `auth_role_assignments`, `admin_memberships` | tenant-scoped assignment | Batch 02 foundation |
| publication -> distribution channel | `public_distribution_records`, `commerce_distribution_channels` | restrict orphan distribution | documented |

## Orphan Detection

Runtime backup validation already checks many reference/tenant boundaries.
Known remaining gap: no generic runtime orphan scanner command exists yet.

## Cross-Organization Violations

No cross-organization violation was found in static repository inspection.
Public read paths intentionally use public projections and must expose only
approved public records.

