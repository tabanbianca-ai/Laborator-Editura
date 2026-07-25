# Domain Model Baseline

Status: Baseline audit for Chapter 4 - Conceptual Domain Model.

Scope: Documentation only. This document does not redesign the physical
database, alter runtime persistence, or change API contracts.

## Method

The baseline was prepared by inspecting:

- `apps/api/src/modules/*/*.types.ts`.
- `packages/shared/src/json-master-format/types.ts`.
- `packages/shared/src/language-policy.ts`.
- `packages/db/src/runtime-database.ts`.
- Existing architecture and Phase 7 documentation.

The goal is to identify the current conceptual entities, assign functional
ownership, detect overlaps, and define the unified conceptual model that should
guide later logical and physical data design.

## Functional Domains

### Identity and Access

Functional owner: Identity & Access.

Existing entities:

- `AuthOrganization`.
- `AuthUser`.
- `AuthUserProfile`.
- `MvpRole`.
- `MvpPermission`.
- `AuthCredential`.
- `AuthSession`.
- `AuthLoginAttempt`.
- `AuthPasswordResetRequest`.
- `AuthEmailVerificationRequest`.
- `AuthActivityEvent`.
- `AuthSecurityEvent`.
- `FounderProtection`.
- `FounderOwnershipTransfer`.

Conceptual entities:

- Organization.
- User.
- User Profile.
- Role.
- Permission.
- Session.
- Credential.
- Authentication Event.
- Founder Protection.

Ownership rule:

- Identity owns authentication, sessions, user identity, role identity,
  permission identity, and founder protection. Administration and Workspace may
  reference users and roles but must not own authentication state.

### Organization and Workspace

Functional owner: Organization / Workspace.

Existing entities:

- `Project`.
- `ProjectIdentity`.
- `ProjectDossier`.
- `ProjectDossierItem`.
- `WorkspaceLayout`.
- `WorkspaceNavigationItem`.
- `WorkspaceWidget`.
- `WorkspacePreferences`.
- `WorkspaceLanguageManagement`.
- `WorkspaceNeedToKnowGrant`.
- `WorkspaceCollaboratorInvitation`.
- `WorkspaceSubscriptionPlanDefinition`.
- `WorkspaceSubscriptionUsage`.
- `WorkspaceEffectiveAccessResult`.
- `AdminOrganization`.
- `AdminTeam`.
- `AdminMembership`.
- `AdminInvitation`.

Conceptual entities:

- Workspace.
- Project.
- Project Identity.
- Project Dossier.
- Team.
- Membership.
- Invitation.
- Workspace Preference.
- Navigation Item.
- Dashboard Widget.
- Access Grant.
- Subscription Entitlement.

Ownership rule:

- Project owns project-level identity, taxonomy, capabilities, dossiers, and
  editorial process activation.
- Workspace owns navigation, preferences, language management, subscriptions,
  and Need-to-Know access context.
- Enterprise Administration owns administrative metadata for organizations,
  teams, roles, and invitations, but must not replace Auth identity.

### Editorial Activity

Functional owner: Editorial / Author Studio / Translation.

Existing entities:

- `AuthorManuscript`.
- `AuthorManuscriptSection`.
- `AuthorDraft`.
- `AuthorNote`.
- `AuthorSubmissionEvent`.
- `Document`.
- `Segment`.
- `SegmentTranslation`.
- `TranslationMemoryEntry`.
- `TerminologyTerm`.
- `DictionarySource`.
- `DictionaryEntry`.
- `LexicalSense`.
- `LexicographicCitation`.
- `LexicographicDecision`.
- `EditorialDecisionRecommendation`.
- `ReviewProposal` equivalents in AI Governance.
- `QaReport`.
- `QaIssue`.
- `SemanticFidelityReport`.
- `SemanticFidelityIssue`.
- `WorkflowState`.
- `WorkflowTransition`.

Conceptual entities:

- Manuscript.
- Manuscript Section.
- Draft.
- Editorial Note.
- Document.
- Translation Segment.
- Translation.
- Translation Memory Entry.
- Terminology Entry.
- Glossary Entry.
- Dictionary Source.
- Dictionary Entry.
- Lexical Sense.
- Editorial Decision.
- Review.
- Correction.
- QA Finding.
- Semantic Finding.
- Workflow Stage.
- Workflow Transition.

Ownership rule:

- Author Studio owns author manuscripts, sections, drafts, and author notes.
- Documents owns document metadata.
- Segments owns source segment persistence.
- Translations owns translated segment persistence.
- Translation Memory owns reusable validated translation evidence.
- Terminology owns glossary and term governance.
- Lexicographic Intelligence owns dictionary sources, entries, senses,
  citations, and lexicographic decisions.
- QA and Semantic Fidelity own validation reports and issues.
- Workflow owns state transitions and approval gates.

### Publishing and Distribution

Functional owner: Publishing / Export / Public Portal / Commerce.

Existing entities:

- `ExportArtifact`.
- `LayoutPublicationPlan`.
- `LayoutPublishingPreflightResult`.
- `LayoutPublishingRecord`.
- `LayoutPublishingDistributionRecord`.
- `PublicCatalogItem`.
- `PublicDistributionRecord`.
- `PublicAccessRecord`.
- `CommerceEdition`.
- `CommerceDistributionChannel`.
- `CommercePrintProfile`.
- `LibraryPublicationRecord`.
- `LibraryPublicationEdition`.
- `LibraryPublicationVersion`.
- `LibraryPublicationFile`.

Conceptual entities:

- Export Artifact.
- Publication.
- Publication Version.
- Release.
- Distribution Channel.
- Public Catalog Item.
- Public Access Record.
- Commerce Edition.
- Print Profile.
- Publication File.
- Preflight Result.

Ownership rule:

- Library owns publication identity and lifecycle records.
- Publishing owns publication readiness, selected official editions, release
  gates, immutable publication snapshots, and distribution tracking.
- Export owns generated artifacts.
- Public Portal owns public catalog exposure.
- Commerce owns commercial edition and print distribution metadata.

### Digital Library

Functional owner: Library.

Existing entities:

- `LibraryItem`.
- `LibraryPublicationRecord`.
- `LibraryPublicationEdition`.
- `LibraryPublicationVersion`.
- `LibraryPublicationFile`.
- `LibraryViewPreference`.
- `LibraryReadingProgress`.
- `LibraryBookmark`.
- `LibraryHighlight`.
- `LibraryNote`.
- `LibraryAccessEvent`.

Conceptual entities:

- Library Item.
- Publication Record.
- Publication Edition.
- Publication Version.
- Publication File.
- Collection.
- Category.
- Tag.
- Reading Progress.
- Bookmark.
- Highlight.
- Reader Note.
- Access Event.

Ownership rule:

- Library owns user library state, reader experience records, publication
  identity, lifecycle metadata, publication files, and library preferences.
  Public Portal and Commerce may reference library publication records but must
  not duplicate publication identity.

### Rights and Provenance

Functional owner: Rights & Provenance.

Existing entities:

- `CollaborationAgreement`.
- `TranslationAuthorization`.
- `PublishingAuthorization`.
- `ProvenanceRecord`.
- `RightsDocumentMetadata`.

Conceptual entities:

- Author.
- Contract.
- Collaboration Agreement.
- License.
- Translation Authorization.
- Publishing Authorization.
- Source Edition.
- Original Work.
- Provenance Record.

Ownership rule:

- Rights & Provenance owns permissions, authorizations, rights warnings,
  agreements, source provenance, and attribution metadata. Project, Publishing,
  Export, Public Portal, Commerce, and Library may reference rights records.

### Artificial Intelligence

Functional owner: AI Governance / AI Orchestration.

Existing entities:

- `AiAgentGovernanceProfile`.
- `AiReviewProposal`.
- `AiParallelReviewInterfaceModel`.
- `AiUsageRecord`.
- `AiBudget`.
- `AiQuota`.
- `AiCostPolicy`.
- `AiBudgetOverrideRequest`.
- `AiProviderStatus`.
- `EditorialDecisionRecommendation`.
- `AgentCoordinationRun`.
- `PlatformEngineeringPlan`.
- AI execution records in Observability.

Conceptual entities:

- AI Agent.
- AI Task.
- AI Prompt.
- AI Result.
- AI Provider.
- AI Model.
- AI Usage Record.
- AI Budget.
- AI Quota.
- AI Governance Policy.
- Agent Coordination Run.
- Review Proposal.

Ownership rule:

- AI Governance owns agent profiles, provider selection, cost policy, budgets,
  quotas, and AI authority rules.
- Functional modules may request AI assistance through orchestration, but AI
  results remain proposal evidence until accepted by authorized humans.

### Files and Digital Assets

Functional owner: Storage / Multimedia / Media Localization / Export.

Existing entities:

- `MultimediaProject`.
- `MultimediaAsset`.
- `MediaLocalizationProject`.
- `MediaLocalizationAsset`.
- `JsonMasterMediaAsset`.
- `JsonMasterCreationMediaAsset`.
- `JsonMasterIllustration`.
- `JsonMasterAudioTrack`.
- `JsonMasterVideoAsset`.
- `JsonMasterSubtitleTrack`.
- `ExportArtifact`.
- `LibraryPublicationFile`.

Conceptual entities:

- Asset.
- Image.
- Audio.
- Video.
- Document File.
- Attachment.
- Export File.
- Subtitle Track.
- Voice Track.
- Localized Media Version.

Ownership rule:

- Asset metadata is conceptually unified. Physical content must remain behind
  storage abstractions. Domain modules may reference assets but must not own
  physical file access.

### Audit and Observability

Functional owner: Audit / Observability.

Existing entities:

- Module-specific audit events across Auth, Projects, Documents, Segments,
  Translations, TM, Terminology, QA, Semantic Fidelity, Workflow, Rights,
  Library, Research, Publishing, Commerce, Collaboration, Scheduling, and other
  modules.
- `ObservabilityMetric`.
- `ObservabilityLog`.
- `ObservabilityTrace`.
- `ObservabilityAgentExecution`.
- `SecurityEvent`.
- `BackupAuditEvent`.

Conceptual entities:

- Audit Record.
- Version.
- Change Set.
- Metric.
- Log Entry.
- Trace.
- Agent Execution.
- Security Event.

Ownership rule:

- Audit owns immutable action history. Observability owns diagnostics,
  metrics, traces, logs, and operational visibility. Observability must not be
  treated as a substitute for audit.

### Configuration and Infrastructure

Functional owner: Configuration / Platform Engineering / Backup / Security /
Gateway.

Existing entities:

- `Configuration` represented through environment and governance metadata.
- `BackupJob`.
- `BackupRestoreEvent`.
- `BackupRetentionPolicy`.
- `DisasterRecoveryPlan`.
- `PreservationRecord`.
- `SecurityPolicy`.
- `SecurityAccessReview`.
- `SecurityPolicyViolation`.
- `GatewayApiKey`.
- `IntegrationProvider`.
- `Webhook`.
- `MarketplaceAgent`.
- `MarketplaceExtension`.
- `PolicyDefinition`.
- `PolicyEvaluation`.
- `PolicyExceptionRequest`.
- `ComplianceRecord`.

Conceptual entities:

- Configuration.
- Backup.
- Restore Event.
- Retention Policy.
- Disaster Recovery Plan.
- Preservation Record.
- Security Policy.
- API Key.
- Integration Provider.
- Webhook.
- Policy.
- Compliance Record.
- Marketplace Registry Item.

Ownership rule:

- Infrastructure and governance modules own operational metadata, policy
  metadata, integrations, and backup governance. They may coordinate platform
  behavior but must not own editorial content.

## Unified Baseline Model

The unified conceptual model should use these top-level aggregate concepts:

- Organization.
- User.
- Workspace.
- Project.
- Manuscript.
- Document.
- Segment.
- Translation.
- Publication.
- Library Record.
- Rights Record.
- Asset.
- Workflow State.
- AI Execution.
- Audit Record.
- Configuration Record.

Each specialized entity should reference one of these aggregate concepts rather
than duplicating ownership.

## Baseline Constraints

- Do not redesign physical database tables from this document.
- Do not remove existing runtime tables.
- Do not break Phase 7 Step 16 publishing, preflight, distribution, Library,
  Rights, Export, Quality, Workflow, or audit functionality.
- Preserve existing API contracts until a later logical data model and
  migration plan are approved.
