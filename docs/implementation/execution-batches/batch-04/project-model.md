# Canonical Project Model

The canonical shared model is `CanonicalEditorialProject` in
`packages/shared/src/editorial-core.ts`.

## Required Fields

- `project_id`
- `organization_id`
- `canonical_name`
- `display_name`
- `project_type`
- `source_language`
- `target_languages`
- `owner_id`
- `editorial_manager_id`
- `status`
- `workflow_id`
- `created_at`
- `updated_at`
- `metadata`

## Initial Project Types

- `TRANSLATION`
- `CORRECTION`
- `LAYOUT`
- `BOOK`
- `MAGAZINE`
- `AUDIO`
- `VIDEO`
- `CHILDREN_BOOK`
- `MULTIMEDIA`

## Current Implementation Mapping

| Canonical field | Existing implementation |
| --- | --- |
| `project_id` | `Project.id` |
| `organization_id` | `Project.organizationId` |
| `display_name` | `Project.name` |
| `project_type` | `Project.publicationType`, `Project.capabilities`, `Project.projectIdentity` |
| `source_language` | `Project.sourceLanguage` / `Project.originalLanguage` |
| `target_languages` | `Project.targetLanguages` |
| `owner_id` | `Project.createdBy` |
| `status` | `Project.status` plus canonical lifecycle contract |
| `metadata` | `Project.metadata` |

## Lifecycle

Canonical states:

- `DRAFT`
- `PLANNED`
- `ACTIVE`
- `PAUSED`
- `UNDER_REVIEW`
- `APPROVED`
- `COMPLETED`
- `CANCELLED`
- `ARCHIVED`

Transitions are defined in `EDITORIAL_PROJECT_LIFECYCLE_TRANSITIONS`.
Direct database status mutation is forbidden; transitions must use service/API logic when adopted by runtime.

## Current Gap

Runtime Projects currently use `ACTIVE` and `ARCHIVED` plus process metadata. Full lifecycle transition
APIs are not forced in this batch to preserve existing API compatibility.
