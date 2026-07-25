# Logical Entity Relationships

Status: Relationship and cardinality baseline for Chapter 5 - Logical Data
Model.

This document defines logical relationships only. It does not prescribe
physical foreign keys, join tables, indexes, or database-specific
optimizations.

## Relationship Notation

- `1 -> 1`: one-to-one.
- `1 -> *`: one-to-many.
- `* -> *`: many-to-many through an explicit associative entity.
- `composition`: child cannot exist without the parent aggregate root.
- `aggregation`: child is referenced by a parent but may be owned elsewhere.

## Tenant and Workspace Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `Organization` | 1 -> * | `Workspace` | composition | Workspace context is scoped to one organization. |
| `Organization` | 1 -> * | `Project` | aggregation | Organization owns tenant boundary; Projects owns project content. |
| `Organization` | * -> * | `User` | associative | Users join organizations through `Membership` or `RoleAssignment`. |
| `Organization` | 1 -> * | `Team` | composition | Teams exist within one organization. |
| `Team` | * -> * | `User` | associative | Team membership assigns operational responsibility. |
| `Workspace` | 1 -> * | `WorkspaceNavigationItem` | composition | Navigation items belong to a workspace configuration. |
| `Workspace` | 1 -> * | `WorkspaceWidget` | composition | Widgets belong to a workspace/dashboard configuration. |
| `Workspace` | 1 -> * | `AccessGrant` | composition | Need-to-Know grants are scoped to a workspace or resource context. |

## Project Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `Project` | 1 -> 1 | `ProjectIdentity` | composition | Project Identity is mandatory before editorial process begins. |
| `Project` | 1 -> * | `ProjectDossier` | composition | Dossiers organize project-level references. |
| `ProjectDossier` | 1 -> * | `ProjectDossierItem` | composition | Dossier items are references to owned entities or assets. |
| `Project` | 1 -> * | `Manuscript` | aggregation | A project may organize one or more manuscripts. |
| `Project` | 1 -> * | `Document` | aggregation | A project may organize one or more documents. |
| `Project` | 1 -> * | `TranslationProject` | aggregation | A project may have multiple target-language translation efforts. |
| `Project` | 1 -> * | `WorkflowState` | aggregation | Workflow states track project, document, or segment progress. |
| `Project` | * -> * | `RightsAuthorization` | associative | Rights records govern project or publication eligibility. |
| `Project` | * -> * | `Asset` | associative | Assets are linked to projects through dossiers, media, export, or publication references. |

## Editorial Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `Manuscript` | 1 -> * | `ManuscriptSection` | composition | Sections, chapters, scenes, and outlines belong to a manuscript. |
| `ManuscriptSection` | 1 -> * | `Draft` | composition | Drafts preserve section-level writing history. |
| `Manuscript` | 1 -> * | `AuthorNote` | composition | Author notes remain private or scoped according to access rules. |
| `Manuscript` | 1 -> * | `SubmissionEvent` | composition | Submission events record movement into editorial workflow. |
| `Document` | 1 -> * | `TranslationSegment` | composition | Segments are the unit of translation, QA, and semantic fidelity. |
| `Document` | 1 -> * | `DocumentAttribution` | composition | Attribution must preserve author and translator metadata. |
| `Document` | * -> * | `Asset` | associative | Documents may reference source files, images, exports, or attachments. |

## Translation and Linguistic Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `TranslationProject` | 1 -> 1 | `Document` or `Manuscript` | aggregation | Translation work must reference a source object. |
| `TranslationProject` | 1 -> * | `TranslationSegment` | aggregation | Translation project work is organized by segments. |
| `TranslationSegment` | 1 -> * | `Translation` | composition | Each translation belongs to one segment and one target language/locale. |
| `TranslationProject` | * -> * | `TranslationMemoryEntry` | associative | TM entries are reusable evidence, not active content. |
| `TranslationProject` | * -> * | `TerminologyEntry` | associative | Terminology is consulted by language pair, project, and domain. |
| `TerminologyEntry` | * -> * | `DictionaryEntry` | associative | Dictionary evidence supports terminology but is not authoritative by itself. |
| `DictionarySource` | 1 -> * | `DictionaryEntry` | composition | Entries belong to a documented source. |
| `DictionaryEntry` | 1 -> * | `LexicalSense` | composition | Each lexical sense represents one meaning. |
| `LexicalSense` | 1 -> * | `LexicographicCitation` | composition | Citations preserve source evidence. |

## Review, QA, and Correction Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `Review` | 1 -> * | `ReviewFinding` | composition | Findings identify issues without mutating content. |
| `ReviewFinding` | 1 -> * | `CorrectionProposal` | composition | Proposed corrections remain pending until human action. |
| `Review` | * -> * | `Translation` | associative | Review can inspect translations but does not own them. |
| `QaReport` | 1 -> * | `QaIssue` | composition | QA issues belong to the QA report. |
| `SemanticFidelityReport` | 1 -> * | `SemanticFidelityIssue` | composition | Semantic issues belong to the semantic report. |
| `Review` | * -> * | `QaReport` | associative | QA reports support review decisions. |
| `Review` | * -> * | `SemanticFidelityReport` | associative | Semantic reports support review decisions. |
| `EditorialDecision` | * -> * | `CorrectionProposal` | associative | Editorial decisions may accept, reject, or document proposals. |

## Rights and Provenance Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `OriginalWork` | 1 -> * | `SourceEdition` | composition | A source edition belongs to one original work. |
| `OriginalWork` | 1 -> * | `ProvenanceRecord` | composition | Provenance records preserve source attribution and history. |
| `OriginalWork` | 1 -> * | `Publication` | aggregation | One original work may produce multiple publications, editions, and translations. |
| `OriginalWork` | 1 -> * | `TranslationAuthorization` | aggregation | Translation rights apply to original work, project, language, or document scope. |
| `Publication` | 1 -> * | `PublishingAuthorization` | aggregation | Publishing rights govern output formats and channels. |
| `CollaborationAgreement` | many -> 1 | `User` | aggregation | Agreements reference collaborators but do not own user identity. |

## Library, Publishing, and Distribution Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `LibraryPublicationRecord` | 1 -> * | `PublicationEdition` | composition | Editions belong to publication identity. |
| `PublicationEdition` | 1 -> * | `PublicationVersion` | composition | Versions preserve immutable historical changes. |
| `LibraryPublicationRecord` | 1 -> * | `PublicationFile` | composition | Files are publication asset/export references. |
| `Publication` | 1 -> 1 | `LibraryPublicationRecord` | aggregation | Publishing release state must reference Library identity. |
| `Publication` | 1 -> * | `PreflightResult` | composition | Preflight results belong to a publication/release context. |
| `PreflightResult` | 1 -> * | `PreflightCheck` | composition | Checks are individual readiness findings. |
| `Publication` | 1 -> * | `DistributionRecord` | composition | Distribution records track channel delivery status. |
| `Publication` | * -> * | `Asset` | associative | Publications reference files, covers, audio, video, and export artifacts. |
| `PublicCatalogItem` | 1 -> * | `PublicAccessRecord` | composition | Public access metadata belongs to public catalog exposure. |
| `CommerceEdition` | * -> 1 | `PublicationEdition` | aggregation | Commerce metadata references publication edition identity. |

## Media and Asset Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `Asset` | 1 -> * | `AssetVersion` | composition | Asset versions preserve file evolution and provenance. |
| `MultimediaProject` | 1 -> * | `Asset` | aggregation | Multimedia projects create or organize assets. |
| `MediaLocalizationProject` | 1 -> * | `LocalizedAsset` | composition | Localized media remains linked to original media. |
| `LocalizedAsset` | many -> 1 | `Asset` | aggregation | Localized assets reference the original asset. |
| `Asset` | * -> * | `RightsAuthorization` | associative | Rights metadata may govern use, export, or publication. |

## AI Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `AITask` | 1 -> * | `AIExecution` | composition | A task may be attempted or executed multiple times. |
| `AIExecution` | 1 -> * | `AIResult` | composition | Results belong to one execution. |
| `AITask` | many -> 1 | `AIProviderStatus` | aggregation | Provider status influences execution but does not own tasks. |
| `AITask` | 1 -> * | `AIUsageRecord` | composition | Usage records track tokens, costs, status, and scope. |
| `AIResult` | * -> * | `Review` | associative | AI output becomes review evidence only through human-governed review. |
| `AIResult` | * -> * | Domain entity | associative | Domain mutation requires human acceptance and audit. |

## Workflow, Calendar, and Notification Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `WorkflowState` | 1 -> * | `WorkflowTransition` | composition | Transition history belongs to workflow state. |
| `WorkflowState` | * -> 1 | `Project`, `Document`, `Segment`, or `Publication` | aggregation | Workflow targets resources but does not own them. |
| `CalendarEvent` | 1 -> * | `Reminder` | composition | Reminders belong to scheduling context. |
| `SchedulingTask` | many -> 1 | `Project` or `Document` | aggregation | Scheduled tasks reference work items. |
| `Notification` | many -> 1 | `User` | aggregation | Notifications target users or teams without owning identity. |

## Audit and Configuration Relationships

| Source | Cardinality | Target | Type | Rule |
| --- | --- | --- | --- | --- |
| `AuditRecord` | many -> 1 | `User` | aggregation | Audit references the actor. |
| `AuditRecord` | many -> 1 | Any auditable resource | aggregation | Audit references resource type and ID. |
| `ChangeSet` | 1 -> * | `AuditRecord` | composition | Change sets group related actions. |
| `ConfigurationRecord` | 1 -> * | `PolicyDefinition` | composition | Policies are governed configuration. |
| `ConfigurationRecord` | 1 -> * | `SecurityPolicy` | composition | Security policy metadata belongs to configuration. |
| `ConfigurationRecord` | 1 -> * | `IntegrationProvider` | composition | Integration metadata is governed configuration. |

## Missing or Implicit Relationships

The following relationships are present implicitly in the current repository
and should be made explicit in later logical-to-physical design:

- `OriginalWork -> Publication -> TranslationProject`.
- `LibraryPublicationRecord -> PublishingRecord -> DistributionRecord`.
- `Asset -> PublicationFile -> ExportArtifact`.
- `AITask -> AIResult -> ReviewFinding -> CorrectionProposal`.
- `RoleAssignment -> Membership -> AccessGrant`.
- `Notification -> Reminder -> User`.
- `ChangeSet -> Version -> AuditRecord`.

## Relationship Rules

- Cross-aggregate relationships must use IDs, public contracts, events, or
  read models.
- Many-to-many relationships require explicit associative entities.
- Relationships that affect rights, publication, security, workflow, or audit
  must be auditable.
- No aggregate may silently create or mutate a record owned by another
  aggregate.
