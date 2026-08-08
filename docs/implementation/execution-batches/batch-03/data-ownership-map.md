# Data Ownership Map

| data_domain | canonical_entity | owning_module | write_authority | read_interfaces | events_published | retention_owner | security_owner | backup_tier |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Identity and sessions | Identity | Auth | Auth repository/service only | request context, admin views | `IdentityCreated`, `IdentityUpdated` | Auth | Security Governance | TIER_0 |
| Organization metadata | Organization | Auth / Enterprise Admin | Auth and Enterprise Admin | workspace, admin | `OrganizationCreated` | Enterprise Admin | Auth | TIER_0 |
| Projects and dossiers | Project | Projects | Projects module | documents, workflow, publishing | `ProjectCreated` | Projects | Workspace/IAM | TIER_0 |
| Manuscripts and drafts | Manuscript | Author Studio | Author Studio | documents, workflow, publishing | `ManuscriptCreated` | Author Studio | Workspace/IAM | TIER_0 |
| Library works | Work | Library | Library | public portal, commerce, publishing | `WorkRegistered` | Library | Rights Provenance | TIER_1 |
| Editions | Edition | Library / Commerce | owning edition service by context | public portal, commerce | `EditionApproved` | Library/Commerce | Rights Provenance | TIER_1 |
| Segment translations | Translation | Translations | Translations | review, TM, QA, semantic | `TranslationStarted` | Translations | Workspace/IAM | TIER_0 |
| Review recommendations | Revision | Editorial Decisions / QA / Semantic Fidelity | originating validation module | review, quality, workflow | `RevisionCompleted` | Review | Workflow | TIER_1 |
| Publication records | Publication | Layout Publishing / Public Portal | Layout Publishing / Public Portal | public catalog, distribution | `PublicationCreated` | Publishing | Rights Provenance | TIER_0 |
| Magazine issue metadata | MagazineIssue | Library / Publishing | Library/Publishing | public portal | `MagazineIssuePrepared` | Publishing | Rights Provenance | TIER_1 |
| Articles and documents | Article | Documents | Documents | author, translation, review | `ArticleCreated` | Documents | Workspace/IAM | TIER_0 |
| Media and exports | DigitalAsset | Multimedia / Media Localization / Export | owning asset module | publishing, library | `DigitalAssetCreated` | owning asset module | Rights Provenance | TIER_1 |
| Rights and provenance | RightsRecord | Rights Provenance | Rights Provenance | publishing, distribution, quality | `RightsValidated` | Rights Provenance | Security Governance | TIER_0 |
| Collaboration contracts | Contract | Rights Provenance | Rights Provenance | admin, publishing | `ContractAccepted` | Rights Provenance | Security Governance | TIER_0 |
| Workflow states | Workflow | Workflow | Workflow | all production modules | `WorkflowAdvanced` | Workflow | Workspace/IAM | TIER_0 |
| Scheduling tasks | Task | Scheduling | Scheduling | workspace, platform engineering | `TaskScheduled` | Scheduling | Workspace/IAM | TIER_2 |
| Notifications/reminders | Notification | Scheduling / Workspace | Scheduling/Workspace | workspace | `NotificationQueued` | Scheduling | Workspace/IAM | TIER_2 |
| Audit records | AuditRecord | owning module | owning module only | audit/reporting | `AuditRecorded` | owning module | Security Governance | TIER_0 |
| Linguistic resources | LocalizationResource | Lexicographic / Terminology / Workspace | owning linguistic module | translation, review | `LocalizationResourceUpdated` | Linguistic owner | Rights Provenance | TIER_1 |
| AI assets and cost records | AIAsset | AI Governance / Marketplace | AI Governance/Marketplace | admin, observability | `AIAssetRegistered` | AI Governance | Security Governance | TIER_1 |

## Direct Cross-Module Database Access

Repositories use the shared runtime database abstraction. Direct writes are
module-local in repository files. Cross-module reads/writes discovered are
controlled service dependencies or public/runtime projections, except the
following items that need future review:

- Public read repositories use global `select` for approved public catalog and
  public store projections.
- Terminology and lexicographic audit listing contains global audit reads for
  administrative visibility and should receive explicit policy metadata in a
  later authorization-policy batch.

