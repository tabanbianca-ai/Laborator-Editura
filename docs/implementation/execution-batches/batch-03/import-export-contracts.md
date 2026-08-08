# Import and Export Contracts

Import/export contracts are represented by `ImportExportContract` in
`packages/shared/src/canonical-data.ts`.

| contract_id | format | schema_version | source | target | organization_scope | partial_success_policy | audit_policy |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `json-master.export.v1` | JSON_MASTER | 1.0.0 | Export | artifact/publication consumers | ORGANIZATION_REQUIRED | NOT_ALLOWED | required |
| `runtime-db.backup.v1` | JSON | 1.0 | Runtime DB | backup file | ORGANIZATION_REQUIRED | NOT_ALLOWED | required |
| `runtime-db.restore.v1` | JSON | 1.0 | backup file | Runtime DB | ORGANIZATION_REQUIRED | NOT_ALLOWED | required |
| `document.import.future.v1` | DOCX/TXT/PDF | TBD | external file | Documents/Author Studio | ORGANIZATION_REQUIRED | EXPLICIT_RECORD_LEVEL | required |
| `media.asset.import.future.v1` | BINARY_ASSET | TBD | external file | Multimedia/Media Localization | ORGANIZATION_REQUIRED | EXPLICIT_RECORD_LEVEL | required |

## Rules

- JSON Master remains the canonical editorial interchange/export contract for
  publication data.
- Runtime database backup and restore contracts remain deterministic JSON with
  schema/version metadata.
- Idempotency is required for retryable imports, restores, and export artifact
  generation.
- Files are validated before processing.
- Imports do not bypass authorization.
- Organization context is server-derived.
- Export must respect classification and rights.
- Sensitive data remains protected.
- Invalid files are rejected with stable error codes.
