# Logical Aggregate Map

Status: Aggregate ownership map for Chapter 5 - Logical Data Model.

This document maps logical aggregates to current repository entities and
runtime tables. It is not a physical schema.

## Aggregate Ownership Matrix

| Aggregate | Aggregate root | Owned logical entities | Current implementation references | External references allowed |
| --- | --- | --- | --- | --- |
| Identity | `User` | `UserProfile`, `Credential`, `Session`, `RoleAssignment`, `AuthenticationEvent`, `FounderProtection`, `FounderOwnershipTransfer` | `AuthUser`, `AuthCredential`, `AuthSession`, `AuthActivityEvent`, `FounderProtection`; tables `users`, `auth_credentials`, `auth_sessions`, `user_roles` | Organization, Workspace, Project, Audit |
| Organization | `Organization` | `Workspace`, `Membership`, `Team`, `Invitation`, `AccessGrant`, `WorkspacePreference`, `SubscriptionEntitlement` | `AuthOrganization`, `AdminOrganization`, `AdminTeam`, `AdminMembership`, `WorkspaceNeedToKnowGrant`; tables `organizations`, `admin_organizations`, `admin_teams`, `workspace_*` | Identity, Projects, Configuration, Audit |
| Projects | `Project` | `ProjectIdentity`, `ProjectDossier`, `ProjectDossierItem`, `ProjectCapability`, `ProjectClassification`, `EditorialProcessConfiguration` | `Project`, `ProjectIdentity`, `ProjectDossier`; tables `projects`, `project_dossiers`, `project_dossier_items` | Organization, Rights, Library, Workflow, Audit |
| Library | `LibraryPublicationRecord` | `PublicationEdition`, `PublicationVersion`, `PublicationFile`, lifecycle and visibility metadata | `LibraryPublicationRecord`, `LibraryPublicationEdition`, `LibraryPublicationVersion`, `LibraryPublicationFile`; tables `library_publications`, `library_publication_*` | Projects, Publishing, Rights, Export, Public Portal, Commerce |
| Library | `LibraryItem` | `ReadingProgress`, `Bookmark`, `Highlight`, `ReaderNote`, `AccessEvent`, `ViewPreference` | `LibraryItem`, `LibraryReadingProgress`, `LibraryBookmark`, `LibraryHighlight`, `LibraryNote`, `LibraryAccessEvent`; tables `library_items`, `library_reading_progress`, `library_bookmarks`, `library_highlights`, `library_notes` | Identity, Public Portal, Commerce |
| Editorial | `Manuscript` | `ManuscriptSection`, `Draft`, `AuthorNote`, `SubmissionEvent` | `AuthorManuscript`, `AuthorManuscriptSection`, `AuthorDraft`, `AuthorNote`; tables `author_manuscripts`, `author_manuscript_sections`, `author_drafts`, `author_notes` | Projects, Documents, Workflow, Library |
| Editorial | `Document` | `DocumentAttribution`, document metadata | `Document`, `DocumentTranslatorAttribution`; table `documents` | Projects, Segments, Translation, Export, Rights |
| Translation | `TranslationProject` | `TranslationSegment`, `Translation`, `TranslationMemoryEntry`, `TranslationProposal`, linguistic evidence | `Segment`, `SegmentTranslation`, `TranslationMemoryEntry`; tables `document_segments`, `segment_translations`, `translation_memory_entries` | Projects, Documents, Terminology, QA, Semantic Fidelity |
| Translation | `TerminologyEntry` | `GlossaryEntry`, variants, status, quality metadata | `TerminologyTerm`; table `terminology_terms` | Translation, Lexicographic, QA, Semantic Fidelity |
| Translation | `DictionarySource` | `DictionaryEntry`, `LexicalSense`, `LexicographicCitation`, `LexicographicDecision` | `DictionarySource`, `DictionaryEntry`, `LexicographicDecision`; tables `lexicographic_sources`, `lexicographic_entries`, `lexicographic_decisions` | Terminology, Semantic Fidelity, Research |
| Correction | `Review` | `ReviewFinding`, `CorrectionProposal`, `EditorialDecision` | `AiReviewProposal`, `EditorialDecisionRecommendation`, workflow review states; table `editorial_decisions` | Translation, QA, Semantic Fidelity, Workflow, AI |
| Correction | `QaReport` | `QaIssue` | `QaReport`, `QaIssue`; tables `qa_reports`, `qa_issues` | Translation, Terminology, Workflow |
| Correction | `SemanticFidelityReport` | `SemanticFidelityIssue` | `SemanticFidelityReport`, `SemanticFidelityIssue`; tables `semantic_fidelity_reports`, `semantic_fidelity_issues` | Translation, Terminology, Lexicographic, Workflow |
| Publishing | `Publication` | `PublicationRelease`, `PublicationSnapshot`, `PreflightResult`, `DistributionRecord`, channel selection | `PublishingRecord`, `PublishingPreflightResult`, `LayoutPublishingDistributionRecord`; tables `layout_publishing_records`, `layout_publishing_preflight_results`, `layout_publishing_distribution_records` | Library, Export, Rights, Workflow, Public Portal, Commerce |
| Rights | `OriginalWork` | `SourceEdition`, `ProvenanceRecord`, `TranslationAuthorization`, `PublishingAuthorization`, `CollaborationAgreement` | `ProvenanceRecord`, `TranslationAuthorization`, `PublishingAuthorization`, `CollaborationAgreement`; tables `rights_*` | Projects, Library, Publishing, Research |
| Media | `Asset` | `AssetVersion`, `MultimediaProject`, `MediaLocalizationProject`, `LocalizedAsset`, media tracks | `MultimediaAsset`, `MediaLocalizationAsset`, `LibraryPublicationFile`, `ExportArtifact`; tables `multimedia_assets`, `media_localization_assets`, `library_publication_files`, `export_artifacts` | Library, Publishing, Translation, Rights |
| AI | `AITask` | `AIExecution`, `AIResult`, `AIUsageRecord`, `AIProviderStatus`, `AIBudget`, `AIQuota`, `AICostPolicy` | `AiUsageRecord`, `AiProviderStatus`, `ObservabilityAgentExecution`, `AgentCoordinationRun`; tables `ai_*`, `observability_agent_executions`, `agent_coordination_runs` | Functional modules, Audit, Observability |
| Workflow | `WorkflowState` | `WorkflowTransition`, `WorkflowGate`, `ApprovalRecord`, `BlockingReason` | `WorkflowState`, `WorkflowTransition`; tables `workflow_states`, `workflow_transitions` | Projects, Documents, Translation, Publishing, Rights |
| Calendar | `CalendarEvent` | `SchedulingTask`, `Reminder`, `SchedulingAgentRun` | `SchedulingTask`, `SchedulingEvent`, `SchedulingReminder`, `SchedulingAgentRun`; tables `scheduling_*` | Workflow, Projects, AI |
| Notifications | `Notification` | `NotificationDelivery`, `NotificationPreference` | Not yet a dedicated runtime aggregate; partly represented by reminders and workspace preferences | Calendar, Workspace, Observability |
| Audit | `AuditRecord` | `AuditTrail`, `ChangeSet`, `ActorReference`, `ResourceReference` | Module-specific audit event tables | All aggregates |
| Configuration | `ConfigurationRecord` | `PolicyDefinition`, `SecurityPolicy`, `IntegrationProvider`, `WebhookDefinition`, `BackupPolicy`, `LanguageManagement`, `MarketplaceInstall`, `GatewayRouteRegistration` | `SecurityPolicy`, `PolicyDefinition`, `IntegrationProvider`, `Webhook`, `BackupRetentionPolicy`, `WorkspaceLanguageManagement`, `MarketplaceInstall` | All aggregates |

## Aggregate Invariants

### Identity

- A session must belong to an existing user.
- A credential must never be exposed outside Identity.
- Founder protection state cannot be modified by normal administrator actions.

### Organization

- Every tenant-scoped entity must reference exactly one organization.
- Temporary access grants must expire or be revoked according to Need-to-Know
  rules.
- Subscription limits may block new restricted actions but must not delete
  existing data.

### Projects

- Every project has exactly one publication type.
- Every project has one original language and one authoring language.
- Project capabilities activate workflow stages but do not create new modules.
- Project dossiers contain references only and do not own referenced content.

### Library

- Library publication records are the source of publication identity and
  lifecycle.
- Published versions are immutable.
- Reader data is private by default.
- Visibility is independent from lifecycle status.

### Editorial

- Manuscript drafts preserve version history.
- Author text must not be overwritten automatically by AI.
- Submitted manuscripts remain attributable to the author.

### Translation

- Translation Memory stores only validated translations as reusable evidence.
- Validated terminology has priority over Translation Memory and AI
  suggestions.
- Translation proposals must not replace text automatically.

### Correction

- Review proposals remain pending until accepted or rejected by authorized
  humans.
- QA and Semantic Fidelity reports provide evidence but do not approve content.
- Human final authority is mandatory.

### Publishing

- Critical preflight errors block publication.
- Warnings may be accepted only by authorized humans and must be audited.
- Publishing records reference Library publication identity instead of
  duplicating it.

### Rights

- Publication cannot proceed without valid rights or an explicitly allowed
  public domain/classical/open-license rule.
- Original source and provenance metadata must remain auditable.

### Media

- File-like resources are referenced as assets.
- Localized media must remain linked to original media.
- Rights metadata travels with asset references where applicable.

### AI

- AI results belong to AI tasks.
- AI cannot approve, publish, grant rights, bypass workflow, or mutate domain
  entities directly.
- Provider fallback, budget warnings, and blocked AI actions are auditable.

### Workflow

- Workflow gates evaluate evidence owned by other aggregates.
- Workflow must not own the underlying document, translation, rights, or
  quality records.

### Audit

- Audit records are immutable.
- Audit records do not replace entity version history.

### Configuration

- Configuration changes must be auditable.
- Critical configuration changes require explicit confirmation where specified
  by governance.
