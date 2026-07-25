# Domain Relationships Baseline

Status: Relationship audit for Chapter 4 - Conceptual Domain Model.

This document describes conceptual relationships observed in the current
repository and required by the unified conceptual model. It does not define
foreign keys or physical database constraints.

## Core Ownership Relationships

| Relationship | Current evidence | Conceptual rule |
| --- | --- | --- |
| Organization owns tenant-scoped data | `organizationId` appears across runtime entities. | Every tenant-scoped entity belongs to exactly one Organization. |
| Organization contains Users through roles/memberships | `users`, `user_roles`, `admin_memberships`. | User identity is global within the platform context; organization access is scoped through Membership and Role. |
| Workspace presents Projects and module access | `WorkspaceNavigationItem`, `WorkspacePreferences`, `WorkspaceNeedToKnowGrant`. | Workspace is an access and presentation context, not an owner of editorial content. |
| Project contains Documents, Segments, Translations, Dossiers, and workflow context | `projectId` appears in `Document`, `Segment`, `SegmentTranslation`, `ProjectDossier`, rights records, export artifacts. | Project is the main editorial work container. |
| Project Identity links to Rights and Original Author metadata | `ProjectIdentity.linkedRightsContractIds`, `originalAuthor`. | Project Identity is the entry point for rights/provenance warnings but Rights owns authorization records. |
| Project Dossier groups project items | `ProjectDossierItem.itemType` and `itemId`. | Dossiers group references; they do not own the referenced item data. |

## Editorial Relationships

| Relationship | Current evidence | Conceptual rule |
| --- | --- | --- |
| Manuscript belongs to Author Studio and may link to Project or Document | `AuthorManuscript.projectId`, `documentId`. | Manuscript is the authoring object; Project is the editorial container. |
| Manuscript contains Sections | `AuthorManuscriptSection.manuscriptId`. | Sections structure manuscript content. |
| Section has Drafts | `AuthorDraft.sectionId`. | Drafts preserve content versions and autosave metadata. |
| Document belongs to Project | `Document.projectId`. | Document metadata is owned by Documents and scoped to a Project. |
| Segment belongs to Document and Project | `Segment.documentId`, `projectId`. | Segment is the translation and validation unit. |
| Translation belongs to Segment | `SegmentTranslation.segmentId`. | Translation is target text for a source segment. |
| Translation may reference TM, QA, and Semantic reports | `tmEntryId`, `qaReportId`, `semanticReportId`. | Validation and evidence records remain owned by their modules. |
| Translation Memory Entry may reference source segment, document, project | `sourceSegmentId`, `documentId`, `projectId`. | TM stores reusable validated translation evidence, not active segment state. |
| Terminology Terms may be platform, project, or personal scope | `GlossaryScope`, `projectId`, `ownerUserId`. | Glossary hierarchy determines authority and review behavior. |
| Lexicographic Entry belongs to Dictionary Source | `DictionaryEntry.sourceId`. | Dictionary source owns source authority metadata; entry owns lexical evidence. |
| Lexical Sense belongs to Dictionary Entry | `DictionaryEntry.senses`. | Sense represents one meaning and may carry citations. |
| QA/Semantic reports attach to segment or document | QA and Semantic modules include report/issue records with target context. | Validation reports are evidence for workflow gates. |
| Workflow State targets Document or Segment | `WorkflowScope`, `documentId`, `segmentId`. | Workflow controls progression and approval but does not own editorial content. |

## Publishing and Library Relationships

| Relationship | Current evidence | Conceptual rule |
| --- | --- | --- |
| Library Publication may link Project, Manuscript, Workflow, Translations, Reviews, Layout, Publishing, Rights | `LibraryPublicationRecord` reference arrays and IDs. | Library owns publication identity and lifecycle relationships. |
| Publication has Editions | `LibraryPublicationEdition.publicationId`, `CommerceEdition`. | Edition is a publication variant; Commerce adds commercial metadata. |
| Publication has Versions | `LibraryPublicationVersion.publicationId`, `editionId`. | Version preserves immutable history. |
| Publication has Files | `LibraryPublicationFile.publicationId`, `editionId`. | Files are asset/export references, not the full publication identity. |
| Export Artifact belongs to Project and Document | `export_artifacts` reference validation in runtime database. | Export owns generated artifacts. |
| Public Catalog Item references release metadata | `public_catalog_items`, `public_distribution_records`. | Public Portal exposes approved releases and public access metadata. |
| Distribution records belong to publication/release/channel context | `layout_publishing_distribution_records`, `public_distribution_records`, `commerce_distribution_channels`. | Distribution tracks channel state and history only. |

## Rights and Provenance Relationships

| Relationship | Current evidence | Conceptual rule |
| --- | --- | --- |
| Rights records may reference Project and Document | `projectId`, `documentId` in rights entities. | Rights warnings apply to project/document/publishing workflows. |
| Collaboration Agreement references collaborator | `collaboratorId`, `collaboratorName`. | Agreement records contributor participation but does not own user identity. |
| Translation Authorization controls target language rights | `authorizedLanguages`, `territories`, `validUntil`. | Translation may proceed only according to rights policy and workflow gates. |
| Publishing Authorization controls output formats and commercial distribution | Boolean flags for ebook, print, PDF, MOBI, audiobook, video, commercial distribution. | Publishing and distribution must surface rights blockers. |
| Provenance Record links original work metadata to project/document/publication | Original title, language, edition, publisher, author, translator, reviewer, publication history. | Provenance is the canonical source attribution record. |

## AI Relationships

| Relationship | Current evidence | Conceptual rule |
| --- | --- | --- |
| AI Agent has governance profile | `AiAgentGovernanceProfile`. | Agents have mission, limits, responsibility, and human authority rules. |
| AI Task produces AI Result | `AiUsageRecord`, `ObservabilityAgentExecution`, `AiReviewProposal`, `EditorialDecisionRecommendation`. | AI output is advisory until accepted by authorized humans. |
| AI Provider and Model support AI Task | provider/model metadata in AI governance and integration registry. | Functional modules must use orchestration, not provider-specific calls. |
| AI Result may reference editorial entities | Review proposals include `projectId`, `documentId`, `segmentId`. | AI results must not directly mutate editorial entities. |

## Asset Relationships

| Relationship | Current evidence | Conceptual rule |
| --- | --- | --- |
| Asset belongs to Organization and may reference Project/Publication/Media project | `MultimediaAsset`, `MediaLocalizationAsset`, `LibraryPublicationFile`, `ExportArtifact`. | Asset is unified conceptual metadata for file-like resources. |
| Asset metadata is separate from physical file content | File metadata and artifact references are stored; physical storage is abstracted. | File content must be accessed through storage services. |
| Localized media remains linked to original media | JSON Master media localization fields and media localization project assets. | Localization preserves original source linkage and language-specific versions. |

## Audit, Versioning, and Observability Relationships

| Relationship | Current evidence | Conceptual rule |
| --- | --- | --- |
| Audit event references actor and resource | Module-specific audit event types contain actor/action/entity IDs. | Audit is immutable and separate from content versions. |
| Version references content evolution | Library publication versions and JSON Master version history. | Versioning preserves content changes; audit records who changed what and when. |
| Observability records operational behavior | Metrics, logs, traces, agent executions. | Observability does not replace audit and must not hide errors. |

## Required Relationships Not Yet Fully Unified

- Original Work to Source Edition to Publication is present through provenance
  and library metadata but needs a clearer conceptual aggregate before logical
  modeling.
- Asset is implemented in multiple modules and should be unified conceptually
  before physical design.
- Review and Correction exist through workflow, AI proposals, QA/Semantic
  issues, and editorial decisions, but should receive a clearer conceptual
  boundary before logical modeling.
- Membership and Role appear in Auth, Administration, and Workspace. Their
  canonical ownership should be clarified in the logical model.
- Notification and Message are partly represented through Scheduling and
  Collaboration; a later logical model should define whether they share a
  communication aggregate.
