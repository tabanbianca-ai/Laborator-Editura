# Migration Standardization

Migration metadata is represented by `MigrationManifest` in
`packages/shared/src/canonical-data.ts`.

## Canonical Migration Command

- Validate migrations/tests: `pnpm --filter @laborator/db test`
- Build DB package: `pnpm --filter @laborator/db build`
- Runtime backup: `pnpm --filter @laborator/db runtime:backup`
- Runtime restore: `pnpm --filter @laborator/db runtime:restore`

## Migration Inventory

| migration_id | affected_entities | destructive | rollback_status | validation |
| --- | --- | --- | --- | --- |
| `0000_mvp_foundation_v1` | Organization, Project, Article, Translation, Publication, AuditRecord | no | rollback by backup/restore | tested |
| `0001_translation_memory_v1` | Translation | no | rollback by backup/restore | tested |
| `0002_terminology_glossary_v1` | LocalizationResource | no | rollback by backup/restore | tested |
| `0003_qa_engine_v1` | Revision | no | rollback by backup/restore | tested |
| `0004_semantic_fidelity_v1` | Revision | no | rollback by backup/restore | tested |
| `0005_workflow_engine_v1` | Workflow | no | rollback by backup/restore | tested |
| `0006_terminology_governance_v2` | LocalizationResource | no | rollback by backup/restore | tested |
| `0007_founder_protection_v1` | Identity, Organization | no | rollback by backup/restore | tested |
| `0008_security_hardening_phase_1` | Identity, AuditRecord | no | rollback by backup/restore | tested |
| `0009_workflow_definitions_versions_v1` | Workflow | no | rollback by backup/restore | tested |
| `0010_ai_agent_registry_versions_v1` | AI Governance | no | preserve registry history | static and isolated runtime tests |

## Rules

- New schema changes must use numbered migrations.
- Applied shared-environment migrations must not be edited.
- Incompatible changes must use Expand-Migrate-Contract.
- Destructive migration requires separate approval and rollback evidence.

