# Domain Glossary

Status: Baseline glossary for Chapter 4 - Conceptual Domain Model.

This glossary defines the canonical conceptual language for the platform. It is
not a physical database schema.

## Glossary Table

| Conceptual entity | Functional owner | Current implementation references | Responsibility |
| --- | --- | --- | --- |
| Organization | Identity / Administration | `AuthOrganization`, `AdminOrganization`, `organizations`, `admin_organizations` | Tenant and ownership boundary for platform data. |
| User | Identity | `AuthUser`, `AdminUser`, `users`, `admin_users` | Person account identity used for authentication and attribution. |
| User Profile | Identity | `AuthUserProfile` | User metadata such as display name and platform preferences. |
| Role | Identity / Administration | `MvpRole`, `AdminRole`, `user_roles`, `admin_roles` | Defines operational authority through RBAC. |
| Permission | Identity / Administration | `MvpPermission`, `AdminPermission`, `admin_permissions` | Server-enforced action capability. |
| Session | Identity | `AuthSession`, `auth_sessions` | Authenticated access lifecycle. |
| Credential | Identity | `AuthCredential`, `auth_credentials` | Password and authentication material metadata. |
| Founder Protection | Identity | `FounderProtection`, `FounderOwnershipTransfer` | Protected platform founder and ownership transfer state. |
| Workspace | Workspace | `WorkspaceLayout`, `WorkspaceNavigationItem`, `WorkspacePreferences` | User-facing configurable work environment. |
| Membership | Organization / Workspace | `AdminMembership`, `WorkspaceNeedToKnowGrant` | User relationship to organization, team, project, or scoped resource. |
| Team | Administration | `AdminTeam`, `admin_teams` | Grouping of users for assignments and responsibilities. |
| Project | Projects | `Project`, `projects` | Editorial project container and capability activation boundary. |
| Project Identity | Projects / Rights | `ProjectIdentity` | Project origin, rights status, original author metadata, and eligibility. |
| Project Dossier | Projects | `ProjectDossier`, `ProjectDossierItem` | Project-level organization of manuscripts, documents, contracts, assets, exports, and publishing files. |
| Manuscript | Author Studio / Editorial | `AuthorManuscript`, `author_manuscripts` | Author-created editorial work unit before or during editorial process. |
| Manuscript Section | Author Studio | `AuthorManuscriptSection` | Chapter, section, scene, synopsis, outline, or note structure. |
| Draft | Author Studio | `AuthorDraft` | Versioned manuscript writing content. |
| Document | Documents | `Document`, `documents` | Editorial document metadata and translation context. |
| Segment | Segments / Translation | `Segment`, `JsonMasterSegment`, `document_segments` | Source text unit used for translation, QA, semantic review, and workflow. |
| Translation | Translations | `SegmentTranslation`, `JsonMasterTranslation` | Target-language text for a segment, with translator attribution. |
| Translation Memory Entry | Translation Memory | `TranslationMemoryEntry`, `translation_memory_entries` | Validated reusable translation evidence and proposals. |
| Terminology Entry | Terminology | `TerminologyTerm`, `terminology_terms` | Governed term, approved translation, variants, quality score, and status. |
| Glossary Entry | Terminology | `TerminologyTerm` with `glossaryScope` | Platform, project, or personal glossary term. |
| Dictionary Source | Lexicographic | `DictionarySource`, `lexicographic_sources` | Source metadata for dictionaries, glossaries, corpora, grammar, phraseology, or terminology resources. |
| Dictionary Entry | Lexicographic | `DictionaryEntry`, `lexicographic_entries` | Lexical headword/term with senses, citations, equivalents, and authority metadata. |
| Lexical Sense | Lexicographic | `LexicalSense` | Meaning unit inside a dictionary entry. |
| Citation | Lexicographic / Research | `LexicographicCitation`, `ResearchSource.citation` | Source reference used as evidence. |
| Editorial Decision | Editorial Decisions | `EditorialDecisionRecommendation`, `LexicographicDecision` | Human-governed decision or recommendation with evidence and audit. |
| QA Report | QA | `QaReport`, `qa_reports` | Quality validation report for segment or document. |
| QA Issue | QA | `QaIssue`, `qa_issues` | Specific quality validation finding. |
| Semantic Fidelity Report | Semantic Fidelity | `SemanticFidelityReport`, `semantic_fidelity_reports` | Meaning fidelity validation report. |
| Semantic Fidelity Issue | Semantic Fidelity | `SemanticFidelityIssue`, `semantic_fidelity_issues` | Meaning drift, omission, addition, reinterpretation, terminology conflict, or context mismatch. |
| Workflow State | Workflow | `WorkflowState`, `workflow_states` | Document or segment workflow status. |
| Workflow Transition | Workflow | `WorkflowTransition`, `workflow_transitions` | Auditable state transition. |
| Review | Review / AI Governance | `AiReviewProposal`, workflow review states | Review activity and proposed changes. |
| Publication | Library / Publishing | `LibraryPublicationRecord`, `LayoutPublishingRecord`, `PublicCatalogItem` | Editorial publication identity and release metadata. |
| Publication Edition | Library / Commerce | `LibraryPublicationEdition`, `CommerceEdition` | Edition-level publication record and commercial edition metadata. |
| Publication Version | Library / Versioning | `LibraryPublicationVersion`, `JsonMasterVersionReference` | Immutable historical version or revision reference. |
| Release | Publishing / Public Portal | `LayoutPublishingRecord`, `PublicCatalogItem` | Human-approved public or internal release record. |
| Distribution Channel | Publishing / Commerce / Public Portal | `LayoutPublishingDistributionRecord`, `CommerceDistributionChannel`, `PublicDistributionRecord` | Channel delivery metadata and state. |
| Library Item | Library | `LibraryItem`, `library_items` | User-saved library item and reader access link. |
| Library Record | Library | `LibraryPublicationRecord`, `library_publications` | Single source of truth for publication identity and lifecycle. |
| Reading Progress | Library | `LibraryReadingProgress` | Private reader progress metadata. |
| Bookmark | Library | `LibraryBookmark` | Private reader bookmark. |
| Highlight | Library | `LibraryHighlight` | Private reader text highlight. |
| Reader Note | Library | `LibraryNote` | Private reader note. |
| Rights Agreement | Rights & Provenance | `CollaborationAgreement` | Agreement metadata for contributors. |
| Translation Authorization | Rights & Provenance | `TranslationAuthorization` | Translation rights metadata. |
| Publishing Authorization | Rights & Provenance | `PublishingAuthorization` | Publication and format authorization metadata. |
| Provenance Record | Rights & Provenance | `ProvenanceRecord` | Original work, edition, author, translator, reviewer, source, and publication history metadata. |
| Original Work | Rights & Provenance / Library | `ProvenanceRecord`, `LibraryPublicationRecord.originalTitle` | Conceptual source work linked to publications and translations. |
| Source Edition | Rights / Research / Lexicographic | `ProvenanceRecord.originalEdition`, `ResearchSource`, `DictionarySource.edition` | Edition used as source authority. |
| Research Source | Research | `ResearchSource`, `research_sources` | Book, PDF, article, manuscript, website, historical, or multimedia source. |
| Research Note | Research | `ResearchNote` | Research, editorial, translation, semantic, terminology, or manuscript note. |
| Research Entity | Research | `ResearchEntity` | Knowledge graph entity such as concept, character, place, timeline, or terminology entry. |
| Research Relationship | Research | `ResearchRelationship` | Relationship between research entities. |
| Research Collection | Research | `ResearchCollection` | Thematic, private, project, or shared editorial research grouping. |
| Asset | Files / Storage | `MultimediaAsset`, `MediaLocalizationAsset`, `LibraryPublicationFile`, `ExportArtifact`, `JsonMasterMediaAsset` | Unified metadata concept for document, image, audio, video, illustration, attachment, subtitle, or export. |
| Multimedia Project | Multimedia Creation | `MultimediaProject` | Illustration, audio, or video creation project metadata. |
| Media Localization Project | Media Localization | `MediaLocalizationProject` | Image, subtitle, voice-over, dubbing, or video localization project. |
| AI Agent | AI Governance | `AiAgentGovernanceProfile`, `marketplace_agents` | Governed agent or extension identity. |
| AI Task | AI Governance / Observability | `AiUsageRecord`, `ObservabilityAgentExecution`, `AgentCoordinationRun` | AI execution request or planned agent run. |
| AI Result | AI Governance / Functional modules | `AiReviewProposal`, `EditorialDecisionRecommendation`, AI metadata on reports | Output from AI that remains advisory until human action. |
| AI Provider | AI Governance | `AiProviderStatus`, integration providers | Provider availability and fallback metadata. |
| AI Model | AI Governance | Provider/model metadata in AI usage and policy records | Model selection metadata. |
| Notification | Communication / Scheduling | `SchedulingReminder`, future notification records | Reminder or notification to a user or team. |
| Comment | Collaboration / Community | `CollaborationComment`, `CommunityComment` | Internal or public comment. |
| Event | Scheduling | `SchedulingEvent` | Calendar or publication event. |
| Reminder | Scheduling | `SchedulingReminder` | Time-based notification metadata. |
| Audit Record | Audit | Module-specific audit event entities | Immutable history of relevant actions. |
| Version | Versioning / Library / JSON Master | `LibraryPublicationVersion`, `JsonMasterVersionReference` | Content evolution record, separate from audit. |
| Change Set | Audit / Versioning | Audit before/after states and version references | Grouped conceptual change metadata. |
| Configuration | Configuration / Security / Policy | `SecurityPolicy`, `PolicyDefinition`, `WorkspaceLanguageManagement` | Governed platform or module configuration. |
| Backup | Backup Governance | `BackupJob`, `BackupRetentionPolicy`, `DisasterRecoveryPlan`, `PreservationRecord` | Backup, restore, retention, DR, and preservation metadata. |
| Job | Platform Engineering / Scheduling | `PlatformEngineeringPlan`, `SchedulingAgentRun`, background processing plans | Non-interactive work record or plan. |
| Log Entry | Observability | `ObservabilityLog` | Operational diagnostic record. |

## Naming Rules

- Internal technical names remain English.
- UI names must be localized through i18n.
- Domain dictionary entries must preserve localized names separately from
  technical names.
- Conceptual entities are singular nouns.
- Physical table names are not authoritative conceptual names.
