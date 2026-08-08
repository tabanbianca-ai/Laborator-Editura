# Metadata and Audit Model

The shared metadata contract is `CanonicalMetadata` in
`packages/shared/src/canonical-data.ts`.

## Canonical Fields

| field | applicability | rule |
| --- | --- | --- |
| `id` | all persisted entities | stable identifier |
| `version` | versioned entities | monotonically increased when supported |
| `status` | lifecycle-managed entities | controlled values only |
| `organization_id` | tenant-scoped entities | must be server-derived |
| `project_id` | project-scoped entities | required where project ownership exists |
| `created_at` | all persisted entities | UTC, immutable |
| `created_by` | actor-created entities | server-derived actor |
| `updated_at` | mutable entities | UTC, controlled update |
| `updated_by` | actor-mutated entities | server-derived actor |
| `deleted_at` | soft-deletable entities | UTC, logical deletion only |
| `deleted_by` | soft-deletable entities | required when `deleted_at` exists |
| `correlation_id` | API/event/log boundaries | stable request correlation |
| `metadata` | extensible entities | validated and never arbitrary sensitive data |

## Audit Requirements

- Audit records must preserve the real actor from server-derived context.
- Audit records are not physically deleted during this batch.
- Sensitive values, tokens, passwords, and secrets must not be placed into
  generic metadata.
- Historical data can be mapped through aliases and migration plans.

## Tests

`validateCanonicalMetadata` validates the minimum deterministic metadata
requirements in shared code.

