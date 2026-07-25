# Logical Data Model Baseline

Status: Baseline audit for Chapter 5 - Logical Data Model.

Scope: Documentation only. This document does not create physical schemas,
database migrations, indexes, API changes, or runtime persistence changes.

## Method

The baseline was prepared by inspecting:

- `docs/ARCHITECTURE_CHAPTER_4.md`.
- `docs/domain/*.md`.
- `apps/api/src/modules/*/*.types.ts`.
- `packages/shared/src/json-master-format/types.ts`.
- `packages/shared/src/language-policy.ts`.
- `packages/db/src/runtime-database.ts`.
- Phase 7 Step 16 publishing, preflight, distribution, Library, Rights,
  Workflow, Export, Quality, and audit documentation.

The goal is to transform the conceptual domain model into an implementation
ready logical model without choosing a physical database technology.

## Logical Aggregate Catalog

### Identity

Aggregate root: `User`.

Owned logical entities:

- `User`.
- `UserProfile`.
- `Credential`.
- `Session`.
- `RoleAssignment`.
- `AuthenticationEvent`.
- `FounderProtection`.
- `FounderOwnershipTransfer`.

Current implementation references:

- `AuthUser`.
- `AuthUserProfile`.
- `AuthCredential`.
- `AuthSession`.
- `AuthLoginAttempt`.
- `AuthPasswordResetRequest`.
- `AuthEmailVerificationRequest`.
- `AuthActivityEvent`.
- `AuthSecurityEvent`.
- `FounderProtection`.
- `FounderOwnershipTransfer`.
- Runtime tables: `users`, `auth_credentials`, `auth_sessions`,
  `auth_login_attempts`, `auth_password_reset_requests`,
  `auth_email_verification_requests`, `auth_activity_events`,
  `auth_security_events`, `organization_founder_protection`,
  `founder_ownership_transfers`.

Ownership rule:

- Identity owns authentication, user identity, credentials, sessions,
  authentication events, founder protection, and founder ownership transfer.
  Administration, Workspace, and other aggregates reference users but must not
  own credentials or session state.

### Organization

Aggregate root: `Organization`.

Owned logical entities:

- `Organization`.
- `Workspace`.
- `Membership`.
- `Team`.
- `Invitation`.
- `WorkspacePreference`.
- `WorkspaceNavigationItem`.
- `WorkspaceWidget`.
- `AccessGrant`.
- `SubscriptionEntitlement`.

Current implementation references:

- `AuthOrganization`.
- `AdminOrganization`.
- `AdminTeam`.
- `AdminMembership`.
- `AdminInvitation`.
- `WorkspaceLayout`.
- `WorkspaceNavigationItem`.
- `WorkspaceWidget`.
- `WorkspacePreferences`.
- `WorkspaceNeedToKnowGrant`.
- `WorkspaceCollaboratorInvitation`.
- `WorkspaceSubscriptionPlanDefinition`.
- `WorkspaceSubscriptionUsage`.
- Runtime tables: `organizations`, `admin_organizations`, `admin_teams`,
  `admin_memberships`, `admin_invitations`, `workspace_layouts`,
  `workspace_navigation_items`, `workspace_widgets`,
  `workspace_preferences`, `workspace_need_to_know_grants`,
  `workspace_collaborator_invitations`.

Ownership rule:

- Organization owns tenant boundaries, teams, memberships, workspace
  presentation, scoped grants, invitations, and subscription entitlement
  context. Identity owns user credentials and sessions.

### Projects

Aggregate root: `Project`.

Owned logical entities:

- `Project`.
- `ProjectIdentity`.
- `ProjectDossier`.
- `ProjectDossierItem`.
- `ProjectCapability`.
- `ProjectClassification`.
- `EditorialProcessConfiguration`.

Current implementation references:

- `Project`.
- `ProjectIdentity`.
- `ProjectDossier`.
- `ProjectDossierItem`.
- Runtime tables: `projects`, `project_dossiers`,
  `project_dossier_items`.

Ownership rule:

- Projects owns project identity, project publication type, editorial domain,
  classification, capabilities, dossiers, and default editorial process
  configuration. Rights owns legal authorization records referenced by project
  identity.

### Library

Aggregate roots:

- `LibraryPublicationRecord`.
- `LibraryItem`.

Owned logical entities:

- `LibraryPublicationRecord`.
- `PublicationEdition`.
- `PublicationVersion`.
- `PublicationFile`.
- `LibraryItem`.
- `ReadingProgress`.
- `Bookmark`.
- `Highlight`.
- `ReaderNote`.
- `AccessEvent`.
- `LibraryViewPreference`.

Current implementation references:

- `LibraryPublicationRecord`.
- `LibraryPublicationEdition`.
- `LibraryPublicationVersion`.
- `LibraryPublicationFile`.
- `LibraryItem`.
- `LibraryReadingProgress`.
- `LibraryBookmark`.
- `LibraryHighlight`.
- `LibraryNote`.
- `LibraryAccessEvent`.
- Runtime tables: `library_publications`,
  `library_publication_editions`, `library_publication_versions`,
  `library_publication_files`, `library_items`,
  `library_reading_progress`, `library_bookmarks`, `library_highlights`,
  `library_notes`, `library_access_events`, `library_view_preferences`.

Ownership rule:

- Library owns publication identity, lifecycle, editions, versions, files, and
  user reading state. Publishing owns release gates and distribution tracking,
  while Export owns generated artifacts.

### Editorial

Aggregate roots:

- `Manuscript`.
- `Document`.

Owned logical entities:

- `Manuscript`.
- `ManuscriptSection`.
- `Draft`.
- `AuthorNote`.
- `SubmissionEvent`.
- `Document`.
- `DocumentAttribution`.

Current implementation references:

- `AuthorManuscript`.
- `AuthorManuscriptSection`.
- `AuthorDraft`.
- `AuthorNote`.
- `AuthorSubmissionEvent`.
- `Document`.
- `DocumentTranslatorAttribution`.
- Runtime tables: `author_manuscripts`,
  `author_manuscript_sections`, `author_drafts`, `author_notes`,
  `author_submission_events`, `documents`.

Ownership rule:

- Editorial owns manuscripts, sections, drafts, author notes, submission
  events, and document metadata. Translation owns translated segment content.

### Translation

Aggregate root: `TranslationProject`.

Owned logical entities:

- `TranslationProject`.
- `TranslationSegment`.
- `Translation`.
- `TranslationMemoryEntry`.
- `TranslationProposal`.
- `TerminologyEntry`.
- `GlossaryEntry`.
- `DictionarySource`.
- `DictionaryEntry`.
- `LexicalSense`.
- `LexicographicCitation`.
- `LexicographicDecision`.

Current implementation references:

- `Segment`.
- `SegmentTranslation`.
- `TranslationMemoryEntry`.
- `TerminologyTerm`.
- `ProjectLinguisticSourcePriority`.
- `DictionarySource`.
- `DictionaryEntry`.
- `LexicalSense`.
- `LexicographicCitation`.
- `LexicographicDecision`.
- Runtime tables: `document_segments`, `segment_translations`,
  `translation_memory_entries`, `linguistic_source_priorities`,
  `terminology_terms`, `lexicographic_sources`, `lexicographic_entries`,
  `lexicographic_decisions`.

Ownership rule:

- Translation owns translation work state, translation segment translations,
  reusable validated Translation Memory evidence, terminology governance, and
  lexicographic evidence. It must not override validated glossary decisions or
  human approval.

### Correction

Aggregate root: `Review`.

Owned logical entities:

- `Review`.
- `ReviewFinding`.
- `CorrectionProposal`.
- `EditorialDecision`.
- `QaReport`.
- `QaIssue`.
- `SemanticFidelityReport`.
- `SemanticFidelityIssue`.

Current implementation references:

- `AiReviewProposal`.
- `EditorialDecisionRecommendation`.
- `QaReport`.
- `QaIssue`.
- `SemanticFidelityReport`.
- `SemanticFidelityIssue`.
- Workflow review states.
- Collaboration comments.
- Runtime tables: `editorial_decisions`,
  `qa_reports`, `qa_issues`, `semantic_fidelity_reports`,
  `semantic_fidelity_issues`.

Ownership rule:

- Correction owns review findings and correction proposals. QA and Semantic
  Fidelity own validation reports. Workflow owns formal state transitions.
  AI-generated proposals remain advisory until accepted by an authorized human.

### Publishing

Aggregate root: `Publication`.

Owned logical entities:

- `Publication`.
- `PublicationRelease`.
- `PublicationSnapshot`.
- `PreflightResult`.
- `PreflightCheck`.
- `DistributionRecord`.
- `PublicationChannelSelection`.

Current implementation references:

- `LayoutPublicationPlan`.
- `PublishingPreflightResult`.
- `PublishingRecord`.
- `LayoutPublishingDistributionRecord`.
- `ExportArtifact`.
- `PublicCatalogItem`.
- `PublicDistributionRecord`.
- `CommerceEdition`.
- `CommerceDistributionChannel`.
- Runtime tables: `layout_publication_plans`,
  `layout_publishing_preflight_results`, `layout_publishing_records`,
  `layout_publishing_distribution_records`, `export_artifacts`,
  `public_catalog_items`, `public_distribution_records`,
  `commerce_editions`, `commerce_distribution_channels`.

Ownership rule:

- Publishing owns release readiness, selected official edition, final
  preflight aggregation, human release gate, release timestamps, and channel
  delivery status. Library remains the source of publication identity.

### Rights

Aggregate root: `OriginalWork`.

Owned logical entities:

- `OriginalWork`.
- `SourceEdition`.
- `CollaborationAgreement`.
- `TranslationAuthorization`.
- `PublishingAuthorization`.
- `ProvenanceRecord`.
- `RightsWarning`.

Current implementation references:

- `CollaborationAgreement`.
- `TranslationAuthorization`.
- `PublishingAuthorization`.
- `ProvenanceRecord`.
- Project identity rights fields.
- Library source and rights metadata.
- Runtime tables: `rights_collaboration_agreements`,
  `rights_translation_authorizations`, `rights_publishing_authorizations`,
  `rights_provenance_records`.

Ownership rule:

- Rights owns source authority, provenance, collaboration agreement metadata,
  translation authorization, publishing authorization, and rights warnings.
  Publishing and Project Identity must surface rights blockers without
  becoming owners of rights data.

### Media

Aggregate root: `Asset`.

Owned logical entities:

- `Asset`.
- `AssetVersion`.
- `MultimediaProject`.
- `MediaLocalizationProject`.
- `SubtitleTrack`.
- `AudioTrack`.
- `VideoTrack`.
- `VoiceProfile`.
- `LocalizedAsset`.

Current implementation references:

- `MultimediaProject`.
- `MultimediaAsset`.
- `MediaLocalizationProject`.
- `MediaLocalizationAsset`.
- `LibraryPublicationFile`.
- `ExportArtifact`.
- JSON Master media asset types.
- Runtime tables: `multimedia_projects`, `multimedia_assets`,
  `media_localization_projects`, `media_localization_assets`,
  `library_publication_files`, `export_artifacts`.

Ownership rule:

- Media owns media project and media asset metadata. Library owns publication
  file references. Export owns generated export artifacts. The future physical
  model must define a shared asset reference contract.

### AI

Aggregate root: `AITask`.

Owned logical entities:

- `AITask`.
- `AIExecution`.
- `AIResult`.
- `AIProviderStatus`.
- `AIUsageRecord`.
- `AIBudget`.
- `AIQuota`.
- `AICostPolicy`.
- `AIBudgetOverrideRequest`.
- `AIAgentProfile`.

Current implementation references:

- `AiUsageRecord`.
- `AiProviderStatus`.
- `AiBudget`.
- `AiQuota`.
- `AiCostPolicy`.
- `AiBudgetOverrideRequest`.
- `AiAgentGovernanceProfile`.
- `ObservabilityAgentExecution`.
- `AgentCoordinationRun`.
- `MarketplaceAgent`.
- Runtime tables: `ai_provider_statuses`, `ai_usage_records`,
  `ai_budgets`, `ai_quotas`, `ai_cost_policies`,
  `ai_budget_override_requests`, `observability_agent_executions`,
  `agent_coordination_runs`, `marketplace_agents`.

Ownership rule:

- AI owns provider selection, cost governance, execution tracking, usage, and
  advisory AI results. Domain modules own human-approved domain changes.

### Workflow

Aggregate root: `WorkflowState`.

Owned logical entities:

- `WorkflowState`.
- `WorkflowTransition`.
- `WorkflowGate`.
- `ApprovalRecord`.
- `BlockingReason`.

Current implementation references:

- `WorkflowState`.
- `WorkflowTransition`.
- Runtime tables: `workflow_states`, `workflow_transitions`.

Ownership rule:

- Workflow owns state transitions, workflow gates, blocking rules, and human
  approvals. Workflow does not own manuscript, translation, rights, quality, or
  publication content.

### Calendar

Aggregate root: `CalendarEvent`.

Owned logical entities:

- `CalendarEvent`.
- `SchedulingTask`.
- `Reminder`.
- `SchedulingAgentRun`.

Current implementation references:

- `SchedulingTask`.
- `SchedulingEvent`.
- `SchedulingReminder`.
- `SchedulingAgentRun`.
- Runtime tables: `scheduling_tasks`, `scheduling_events`,
  `scheduling_reminders`, `scheduling_agent_runs`.

Ownership rule:

- Calendar owns scheduling metadata and reminders. It must not become an
  alternate workflow approval authority.

### Notifications

Aggregate root: `Notification`.

Owned logical entities:

- `Notification`.
- `NotificationDelivery`.
- `NotificationPreference`.

Current implementation references:

- Scheduling reminders.
- Workspace preferences.
- Observability logs for diagnostics.

Ownership rule:

- Notifications are not yet a fully implemented aggregate. Until they are
  scheduled, reminders remain owned by Calendar and UI preferences remain owned
  by Organization/Workspace.

### Audit

Aggregate root: `AuditRecord`.

Owned logical entities:

- `AuditRecord`.
- `AuditTrail`.
- `ChangeSet`.
- `ActorReference`.
- `ResourceReference`.

Current implementation references:

- Module-specific audit event tables across Auth, Foundation, Translation
  Memory, Terminology, QA, Semantic Fidelity, Workflow, Lexicographic,
  Editorial Decisions, Publishing, Library, Rights, Research, AI Governance,
  Security, Backup, Policy, Marketplace, Workspace, and other modules.

Ownership rule:

- Audit owns immutable action history. Module-specific audit events remain
  acceptable as long as they map to the shared `AuditRecord` concept.

### Configuration

Aggregate root: `ConfigurationRecord`.

Owned logical entities:

- `ConfigurationRecord`.
- `PolicyDefinition`.
- `SecurityPolicy`.
- `IntegrationProvider`.
- `WebhookDefinition`.
- `BackupPolicy`.
- `LanguageManagement`.
- `MarketplaceInstall`.
- `GatewayRouteRegistration`.

Current implementation references:

- Security policies.
- Policy definitions.
- Integration providers.
- Webhooks.
- Backup retention policies.
- Workspace language management.
- Marketplace installs.
- Gateway route registry.

Ownership rule:

- Configuration owns governed platform settings. Functional modules may read
  configuration but must not hardcode policy, provider, route, language, or
  integration settings.

## Common Logical Entity Fields

Every logical entity should expose or map to:

- `id`.
- `version`.
- `status`.
- `createdAt`.
- `updatedAt`.
- `createdBy`.
- `updatedBy`.

Tenant-scoped entities must expose:

- `organizationId`.

Project-scoped entities should expose:

- `projectId`.

References to external aggregate entities must be explicit ID references, not
duplicated ownership.

## Unified Logical Model

The unified logical model for future implementation is:

```text
Organization
  -> Workspace
  -> Membership
  -> Project
       -> ProjectIdentity
       -> ProjectDossier
       -> Manuscript
            -> ManuscriptSection
                 -> Draft
       -> Document
            -> TranslationSegment
                 -> Translation
       -> TranslationProject
       -> WorkflowState
       -> Rights references
       -> Library publication references

LibraryPublicationRecord
  -> PublicationEdition
  -> PublicationVersion
  -> PublicationFile
  -> PublishingRecord
  -> DistributionRecord

OriginalWork
  -> SourceEdition
  -> ProvenanceRecord
  -> TranslationAuthorization
  -> PublishingAuthorization

Asset
  -> AssetVersion
  -> MultimediaProject
  -> MediaLocalizationProject

AITask
  -> AIExecution
  -> AIResult
  -> Review
  -> Human Approval
  -> Domain Entity
```

## Scope Boundary

This logical model is authoritative for future physical database design, but it
does not authorize:

- New database tables.
- New migrations.
- Renaming runtime tables.
- Removing existing module records.
- API contract changes.
- UI changes.
- Docker or staging changes.

Validated Phase 7 Step 16 functionality must be preserved.
