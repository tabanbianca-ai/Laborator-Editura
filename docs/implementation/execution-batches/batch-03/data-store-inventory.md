# Data Store Inventory

## Persistent Stores

| data_store_id | technology | repository_path | environment | owning_module | entities | migration_mechanism | organization_isolation | backup_status | classification | implementation_status | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `postgres_migrations` | PostgreSQL SQL migrations | `packages/db/migrations` | Shared/controlled environments | Database package | MVP foundation, TM, Terminology, QA, Semantic Fidelity, Workflow, Founder Protection, Security Hardening | numbered SQL files | PostgreSQL RLS in migrations | external environment backup required | CONFIDENTIAL | Implemented migrations, not all runtime tables yet | 9 SQL migration files |
| `runtime_database` | File-backed deterministic JSON | `packages/db/src/runtime-database.ts` | Local/staging runtime fallback | Database package | all runtime-backed module records | TypeScript table registry | `organizationId`, `selectForTenant`, `findByIdForTenant` | `packages/db/scripts/runtime-backup-lib.mjs` | CONFIDENTIAL | Implemented | runtime DB tests |
| `runtime_database_backup` | Deterministic JSON backup | `packages/db/scripts/runtime-backup-lib.mjs` | Local/staging backup | Database package | runtime database snapshot | schema/version metadata | validates tenant boundaries | implemented | CONFIDENTIAL | Implemented | runtime backup tests |
| `json_master_files` | JSON Master artifacts | shared fixtures and export artifacts | Export/runtime | Export | JSON Master publication data | JSON schema validation | organization-scoped export artifacts | runtime backup includes artifact metadata | INTERNAL/CONFIDENTIAL | Implemented MVP | `packages/shared/fixtures`, `export_artifacts` |
| `workspace_generated_dist` | Generated build artifacts | `packages/*/dist`, `apps/*/.next` | Local build output | Build system | compiled code | build command | not data store | not backup target | INTERNAL | Generated artifact | build output |
| `object_storage` | Object/file storage | Not configured | Future | Platform Engineering | media/document binaries | TBD | TBD | TBD | OWNER_UNRESOLVED | Not configured | documented gap |
| `search_index` | Search index | Not configured | Future | Search/Library | derived search projections | TBD | derived organization scope | rebuildable | INTERNAL | Not configured | documented gap |
| `cache_store` | Cache | Not configured | Future | Platform Engineering | derived cache entries | TBD | derived organization scope | not authoritative | INTERNAL | Not configured | documented gap |
| `vector_store` | Vector database | Not configured | Future | AI Governance/Research | derived embeddings | TBD | derived organization scope | rebuildable from source | CONFIDENTIAL | Not configured | documented gap |
| `ai_registry` | Runtime metadata tables | `ai_*`, `marketplace_*`, `platform_engineering_*` | Runtime DB | AI Governance/Marketplace/Platform Engineering | AI usage, budget, registry, coordination | runtime table registry | tenant-scoped | runtime backup | CONFIDENTIAL | Implemented metadata | runtime DB tests |

## SQL Migrations

- `0000_mvp_foundation_v1.sql`
- `0001_translation_memory_v1.sql`
- `0002_terminology_glossary_v1.sql`
- `0003_qa_engine_v1.sql`
- `0004_semantic_fidelity_v1.sql`
- `0005_workflow_engine_v1.sql`
- `0006_terminology_governance_v2.sql`
- `0007_founder_protection_v1.sql`
- `0008_security_hardening_phase_1.sql`

## Runtime Table Inventory

The authoritative runtime table registry is `packages/db/src/runtime-database.ts`
and is mirrored by `packages/db/scripts/runtime-backup-lib.mjs`.

```text
organizations
users
user_roles
auth_sessions
auth_credentials
auth_login_attempts
auth_password_reset_requests
auth_email_verification_requests
auth_activity_events
auth_security_events
auth_identities
auth_role_assignments
auth_permissions
auth_service_accounts
auth_delegation_sessions
auth_privileged_operation_policies
auth_security_audit_events
gateway_api_keys
gateway_route_registry
integration_providers
integration_audit_events
webhooks
webhook_delivery_logs
gateway_audit_events
observability_metrics
observability_logs
observability_traces
observability_agent_executions
observability_audit_events
security_policies
security_access_reviews
security_session_events
security_api_key_events
security_policy_violations
security_audit_events
backup_jobs
backup_restore_events
backup_retention_policies
disaster_recovery_plans
preservation_records
backup_audit_events
ai_provider_statuses
ai_usage_records
ai_budgets
ai_quotas
ai_cost_policies
ai_budget_override_requests
ai_cost_audit_events
policy_definitions
policy_evaluations
policy_exception_requests
policy_audit_events
compliance_records
admin_organizations
admin_teams
admin_users
admin_roles
admin_permissions
admin_memberships
admin_invitations
admin_audit_events
marketplace_agents
marketplace_extensions
marketplace_installs
marketplace_audit_events
workspace_layouts
workspace_navigation_items
workspace_widgets
workspace_preferences
workspace_collaborator_invitations
workspace_need_to_know_grants
workspace_audit_events
launch_mfa_records
launch_gdpr_consents
launch_gdpr_requests
launch_secret_vault_entries
launch_essentials_audit_events
rights_collaboration_agreements
rights_translation_authorizations
rights_publishing_authorizations
rights_provenance_records
rights_audit_events
organization_founder_protection
founder_ownership_transfers
projects
project_dossiers
project_dossier_items
documents
document_segments
segment_translations
export_artifacts
foundation_audit_events
translation_memory_entries
translation_memory_audit_events
linguistic_source_priorities
terminology_terms
terminology_audit_events
qa_reports
qa_issues
qa_audit_events
semantic_fidelity_reports
semantic_fidelity_issues
semantic_fidelity_audit_events
workflow_states
workflow_transitions
workflow_audit_events
lexicographic_sources
lexicographic_entries
lexicographic_decisions
lexicographic_audit_events
editorial_decisions
editorial_decision_audit_events
layout_publication_plans
layout_publishing_preflight_results
layout_publishing_records
layout_publishing_distribution_records
layout_publication_audit_events
publishing_publications
publishing_builds
publishing_publication_profiles
publishing_layout_profiles
publishing_typography_profiles
publishing_font_registry
publishing_style_mappings
publishing_generated_assets
publishing_image_derivatives
publishing_covers
publishing_validation_reports
publishing_publication_packages
publishing_approvals
publishing_build_jobs
publishing_observability_metrics
publishing_audit_events
media_localization_projects
media_localization_assets
media_localization_audit_events
multimedia_projects
multimedia_assets
multimedia_audit_events
platform_engineering_plans
platform_engineering_audit_events
agent_coordination_runs
commerce_editions
commerce_distribution_channels
commerce_print_profiles
commerce_audit_events
library_works
library_original_editions
library_canonical_editions
library_resource_relationships
library_contributors
library_edition_contributors
library_rights_records
library_provenance_records
library_digital_assets
library_records
library_reservations
library_metadata_history
library_search_index
library_duplicate_reviews
library_items
library_publications
library_publication_editions
library_publication_versions
library_publication_files
library_view_preferences
library_reading_progress
library_bookmarks
library_highlights
library_notes
library_access_events
library_audit_events
author_manuscripts
author_manuscript_sections
author_drafts
author_notes
author_submission_events
author_studio_audit_events
research_sources
research_notes
research_entities
research_relationships
research_collections
research_collection_items
research_audit_events
collaboration_threads
collaboration_comments
community_reviews
community_comments
community_flags
community_moderation_events
collaboration_audit_events
public_catalog_items
public_distribution_records
public_access_records
public_portal_audit_events
scheduling_tasks
scheduling_events
scheduling_reminders
scheduling_agent_runs
scheduling_audit_events
```

## Owner Gaps

- `object_storage`, `search_index`, `cache_store`, and `vector_store` are
  planned but not configured. They are marked `OWNER_UNRESOLVED` until an
  implementation batch approves them.
