# Canonical Entity Registry

The canonical entity type source is `packages/shared/src/canonical-data.ts`.
Historical implementation names remain aliases and are not removed.

| entity_id | canonical_name | owning_module | primary_identifier | organization_scope | project_scope | classification | lifecycle | schema_version | aliases / implementation links |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `entity.identity` | Identity | Auth | `id` / `identityId` | ORGANIZATION_REQUIRED | NONE | RESTRICTED | invited, pending verification, active, suspended, locked, disabled, archived | 1.0.0 | `users`, `auth_identities`, `auth_sessions`, `user_roles` |
| `entity.organization` | Organization | Auth / Enterprise Admin | `id` | GLOBAL | NONE | CONFIDENTIAL | active, suspended, archived | 1.0.0 | `organizations`, `admin_organizations` |
| `entity.project` | Project | Projects | `id` | ORGANIZATION_REQUIRED | REQUIRED | CONFIDENTIAL | draft, active, archived | 1.0.0 | `projects`, `project_dossiers` |
| `entity.manuscript` | Manuscript | Author Studio | `id` | ORGANIZATION_REQUIRED | OPTIONAL | CONFIDENTIAL | draft, submitted, archived | 1.0.0 | `author_manuscripts`, `author_manuscript_sections`, `author_drafts` |
| `entity.work` | Work | Library | `id` | ORGANIZATION_REQUIRED | OPTIONAL | INTERNAL | draft, active, published, archived | 1.0.0 | `library_publications`, public catalog source references |
| `entity.edition` | Edition | Library / Commerce | `id` | ORGANIZATION_REQUIRED | OPTIONAL | INTERNAL | draft, approved, published, archived | 1.0.0 | `library_publication_editions`, `commerce_editions` |
| `entity.translation` | Translation | Translations | `id` | ORGANIZATION_REQUIRED | REQUIRED | CONFIDENTIAL | draft, reviewed, approved, archived | 1.0.0 | `segment_translations`, `translation_memory_entries` |
| `entity.revision` | Revision | Review / Editorial Decisions | `id` | ORGANIZATION_REQUIRED | REQUIRED | CONFIDENTIAL | proposed, accepted, rejected, archived | 1.0.0 | `editorial_decisions`, QA/Semantic issues |
| `entity.publication` | Publication | Layout Publishing / Public Portal | `id` | ORGANIZATION_REQUIRED | OPTIONAL | INTERNAL/PUBLIC | draft, ready, published, withdrawn, archived | 1.0.0 | `layout_publishing_records`, `public_catalog_items` |
| `entity.magazine_issue` | MagazineIssue | Library / Publishing | `id` | ORGANIZATION_REQUIRED | OPTIONAL | INTERNAL/PUBLIC | draft, approved, published, archived | 1.0.0 | magazine issue metadata in publication records |
| `entity.article` | Article | Documents / Library | `id` | ORGANIZATION_REQUIRED | REQUIRED | INTERNAL/PUBLIC | draft, approved, published, archived | 1.0.0 | `documents`, `document_segments` |
| `entity.digital_asset` | DigitalAsset | Multimedia / Media Localization | `id` | ORGANIZATION_REQUIRED | OPTIONAL | CONFIDENTIAL | draft, approved, published, archived | 1.0.0 | `multimedia_assets`, `media_localization_assets`, `export_artifacts` |
| `entity.rights_record` | RightsRecord | Rights Provenance | `id` | ORGANIZATION_REQUIRED | OPTIONAL | RESTRICTED | draft, active, expired, revoked, archived | 1.0.0 | `rights_translation_authorizations`, `rights_publishing_authorizations`, `rights_provenance_records` |
| `entity.contract` | Contract | Rights Provenance | `id` | ORGANIZATION_REQUIRED | OPTIONAL | RESTRICTED | draft, sent, accepted, expired, terminated | 1.0.0 | `rights_collaboration_agreements` |
| `entity.workflow` | Workflow | Workflow | `id` | ORGANIZATION_REQUIRED | REQUIRED | CONFIDENTIAL | draft, in progress, approved, blocked, exported | 1.0.0 | `workflow_states`, `workflow_transitions` |
| `entity.task` | Task | Scheduling / Workspace | `id` | ORGANIZATION_REQUIRED | OPTIONAL | CONFIDENTIAL | draft, pending, approved, rejected, archived | 1.0.0 | `scheduling_tasks`, workspace assignments |
| `entity.notification` | Notification | Workspace / Scheduling | `id` | ORGANIZATION_REQUIRED | OPTIONAL | INTERNAL | pending, sent, read, archived | 1.0.0 | reminders and future notifications |
| `entity.audit_record` | AuditRecord | Audit-owning module | `id` | ORGANIZATION_REQUIRED | OPTIONAL | RESTRICTED | recorded, retained, archived | 1.0.0 | `*_audit_events`, `foundation_audit_events` |
| `entity.localization_resource` | LocalizationResource | Workspace / Linguistic Resources | `id` | ORGANIZATION_REQUIRED | OPTIONAL | INTERNAL | enabled, disabled, archived | 1.0.0 | language management, lexicographic sources, terminology |
| `entity.ai_asset` | AIAsset | AI Governance / Marketplace | `id` | ORGANIZATION_REQUIRED | OPTIONAL | CONFIDENTIAL | draft, active, disabled, archived | 1.0.0 | `ai_*`, `marketplace_agents`, `observability_agent_executions` |

## Human Decision Required

- The boundary between `Work`, `Publication`, and `Edition` is mapped but not
  merged. Current tables remain separate until a later data-model migration
  receives explicit approval.
- `Notification` currently exists through reminders and workspace metadata, not
  a dedicated notification table.

