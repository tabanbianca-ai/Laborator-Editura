# Laborator Editura Official Platform Architecture

Chapter 5 - Logical Data Model.

Official architecture document.

Version: 1.0.

## 1. Purpose

This document defines the logical data model for the Laborator Editura
platform.

The logical model is the bridge between the conceptual domain model and the
future physical database implementation.

It defines:

- Aggregates.
- Logical entities.
- Relationships.
- Cardinalities.
- Integrity rules.
- Data ownership.
- Versioning strategies.
- Deletion strategies.
- Concurrency rules.

This document is independent of PostgreSQL, MySQL, SQLite, file storage, or
any other physical database or storage technology.

## 2. Principles

The logical model must follow these principles:

- Single Source of Truth.
- Transactional consistency within aggregate boundaries.
- Clear aggregate separation.
- Explicit references between aggregates.
- Referential integrity at the logical level.
- Complete auditability.
- Shared versioning infrastructure for versioned editorial entities.
- Extensibility without major architecture changes.
- Technology independence until the physical data model is approved.

## 3. Logical Aggregates

The platform is organized into logical aggregates. Each aggregate owns its
entities and exposes changes through its aggregate root or public service
contract.

Initial logical aggregate groups:

1. Identity.
2. Organization.
3. Projects.
4. Library.
5. Editorial.
6. Translation.
7. Correction.
8. Publishing.
9. Rights.
10. Media.
11. AI.
12. Workflow.
13. Calendar.
14. Notifications.
15. Audit.
16. Configuration.

Aggregates may reference entities owned by other aggregates, but they must not
copy ownership or become alternate sources of truth.

## 4. Aggregate Roots

Every aggregate must define at least one aggregate root. All mutations inside
the aggregate must pass through the aggregate root or a service that enforces
the same invariants.

| Aggregate | Primary aggregate root | Owned logical entities |
| --- | --- | --- |
| Identity | `User` | `UserProfile`, `Credential`, `Session`, `RoleAssignment`, `AuthenticationEvent`, `FounderProtection` |
| Organization | `Organization` | `Workspace`, `Membership`, `Team`, `Invitation`, `WorkspacePreference`, `AccessGrant` |
| Projects | `Project` | `ProjectIdentity`, `ProjectDossier`, `ProjectDossierItem`, `ProjectCapability`, `ProjectClassification` |
| Library | `LibraryPublicationRecord` | `PublicationEdition`, `PublicationVersion`, `PublicationFile`, lifecycle metadata, visibility metadata |
| Library | `LibraryItem` | `ReadingProgress`, `Bookmark`, `Highlight`, `ReaderNote`, `AccessEvent`, personal library state |
| Editorial | `Manuscript` | `ManuscriptSection`, `Draft`, `AuthorNote`, `SubmissionEvent` |
| Editorial | `Document` | Document metadata, document attribution, document audit context |
| Translation | `TranslationProject` | `TranslationSegment`, `Translation`, `TranslationMemoryEntry`, translation evidence |
| Correction | `Review` | `ReviewFinding`, `CorrectionProposal`, `EditorialDecision`, accepted/rejected proposal state |
| Publishing | `Publication` | `PublicationRelease`, `PreflightResult`, `DistributionRecord`, selected official edition, release snapshot |
| Rights | `OriginalWork` | `SourceEdition`, `ProvenanceRecord`, `TranslationAuthorization`, `PublishingAuthorization`, `CollaborationAgreement` |
| Media | `Asset` | Asset metadata, media asset metadata, localized asset metadata, asset version references |
| AI | `AITask` | `AIResult`, `AIExecution`, `AIProviderSelection`, `AIUsageRecord`, `AIReviewProposal` |
| Workflow | `WorkflowState` | `WorkflowTransition`, workflow gate metadata, approval state |
| Calendar | `CalendarEvent` | `SchedulingTask`, `Reminder`, `SchedulingAgentRun` |
| Notifications | `Notification` | Notification delivery metadata, reminder-derived notification references |
| Audit | `AuditRecord` | Audit event, actor reference, before/after state references, immutable log metadata |
| Configuration | `ConfigurationRecord` | Policy, security configuration, integration metadata, backup plan, language management |

When a current module contains entities that belong conceptually to another
aggregate, the entity must be treated as a reference or read model until a
later migration clarifies ownership.

## 5. Cardinalities

All relationships must be documented before implementation.

Baseline logical cardinalities:

| Source | Cardinality | Target | Rule |
| --- | --- | --- | --- |
| `Organization` | 1 to many | `Workspace` | An organization may have one or more workspace contexts. |
| `Organization` | 1 to many | `Project` | Every project belongs to exactly one organization. |
| `Organization` | many to many | `User` | Users join organizations through memberships or role assignments. |
| `Workspace` | 1 to many | `Project` | A workspace exposes projects according to access rules. |
| `Project` | 1 to many | `ProjectDossier` | Dossiers organize project-level references. |
| `Project` | 1 to many | `Manuscript` | A project may contain one or more manuscripts. |
| `Project` | 1 to many | `Document` | A project may contain one or more documents. |
| `Manuscript` | 1 to many | `ManuscriptSection` | Manuscripts are structured by sections, chapters, scenes, or notes. |
| `ManuscriptSection` | 1 to many | `Draft` | Drafts preserve writing history. |
| `Document` | 1 to many | `TranslationSegment` | Documents are segmented for translation and validation. |
| `TranslationProject` | 1 to many | `TranslationSegment` | A translation project manages target-language segment work. |
| `TranslationSegment` | 1 to many | `Translation` | A segment may have translations for one or more target languages or versions. |
| `TranslationProject` | many to many | `TranslationMemoryEntry` | Translation Memory entries are reused as proposal evidence. |
| `TranslationProject` | many to many | `TerminologyEntry` | Terminology is consulted by language pair and domain. |
| `Publication` | 1 to many | `PublicationEdition` | Publications may have multiple editions. |
| `PublicationEdition` | 1 to many | `PublicationVersion` | Editions may have immutable historical versions. |
| `Publication` | many to many | `User` | Authors, translators, reviewers, designers, and narrators are contributors. |
| `Publication` | many to many | `Asset` | Publications reference assets through associative entities. |
| `OriginalWork` | 1 to many | `SourceEdition` | Original works may have multiple source editions. |
| `OriginalWork` | 1 to many | `Publication` | One original work may produce multiple publications and translations. |
| `Asset` | 1 to many | `AssetVersion` | Assets may evolve through versions while preserving source references. |
| `AITask` | 1 to many | `AIResult` | AI results belong to the task that produced them. |
| `AIResult` | many to one | `Review` | AI results become review evidence only after workflow routing. |
| `WorkflowState` | 1 to many | `WorkflowTransition` | Workflow history is an ordered transition log. |
| `AuditRecord` | many to one | Any auditable resource | Audit references resources without owning their data. |

Many-to-many relationships must be represented through explicit associative
entities in the future physical design.

## 6. Relationship Types

The logical model uses:

- One-to-one relationships.
- One-to-many relationships.
- Many-to-many relationships through associative entities.
- Composition, when the child cannot exist without the parent aggregate root.
- Aggregation, when the child may be referenced by multiple aggregates.

Relationships must reflect domain rules before database optimization.

## 7. Identifiers and Common Fields

Every logical entity must define:

- A globally unique `id`.
- Internal `version`.
- Lifecycle `status`.
- `createdAt`.
- `updatedAt`.
- `createdBy`.
- `updatedBy`.

Tenant-scoped entities must also define:

- `organizationId`.

Project-scoped entities should define:

- `projectId`, unless they intentionally represent cross-project resources.

Identifiers must never be reused.

## 8. Data Ownership

Each entity has exactly one logical owner.

Ownership examples:

- `User` is owned by Identity.
- `Organization` is owned by Organization.
- `Project` is owned by Projects.
- `Manuscript` is owned by Editorial.
- `TranslationProject` is owned by Translation.
- `Review` and `CorrectionProposal` are owned by Correction.
- `Publication` release state is owned by Publishing.
- Publication identity and lifecycle records are owned by Library.
- `OriginalWork` and rights authority are owned by Rights.
- `Asset` metadata is owned by Media or Library according to source of truth.
- `AITask` and provider/cost governance are owned by AI.
- `WorkflowState` is owned by Workflow.
- `AuditRecord` is owned by Audit.

Other aggregates must access these entities through public contracts,
references, read models, or events.

## 9. Deletion Strategies

The logical model defines three deletion strategies.

### Soft Delete

Data remains recoverable and hidden from normal active views.

Use for:

- User-facing reversible records.
- Draft working objects.
- Temporary configuration records where retention permits recovery.

### Archive

Data becomes inactive but remains visible in historical, audit, preservation,
or reporting contexts.

Use for:

- Projects.
- Manuscripts.
- Documents.
- Publications.
- Rights records.
- Research sources.
- Media assets.
- AI execution records.
- Configuration records.

### Permanent Delete

Permanent deletion is allowed only for data without retention, audit,
copyright, provenance, legal, or preservation obligations.

Permanent deletion must never remove:

- Audit records.
- Published versions.
- Provenance records.
- Rights history.
- Validated terminology history.
- Official publication snapshots.
- Backup or preservation records.

GDPR deletion requests must be handled through approved privacy workflows and
must preserve legally required audit and editorial history through
pseudonymization or retention-safe references when required.

## 10. Versioning

Editorial entities must preserve:

- Current version.
- Historical versions.
- Author of the change.
- Change summary.
- Differences between versions where available.
- Restoration metadata.

Versioning must be shared infrastructure, not a separate bespoke mechanism in
every module.

Versioned editorial entities include:

- Manuscripts.
- Manuscript sections.
- Drafts.
- Documents.
- Segments.
- Translations.
- Reviews.
- Correction proposals.
- Publications.
- Publication editions.
- Publication files.
- Terminology entries.
- Translation rules.
- Source authority records.
- Assets.

Audit records are not the same as versions. Audit records prove who performed
an action and when; versions preserve recoverable content evolution.

## 11. Concurrency

The model must prevent uncontrolled editing conflicts.

Required logical strategy:

- Optimistic locking through entity `version`.
- Conflict detection on stale updates.
- Explicit conflict resolution for collaborative editing.
- No silent overwrites of manuscript, translation, review, layout, publishing,
  rights, terminology, or asset state.

For future real-time collaboration, CRDT or equivalent synchronization may be
used inside approved modules, but the logical model still requires explicit
version and audit records.

## 12. Integrity Rules

Integrity rules are defined at the logical level and later translated into
physical constraints.

Baseline rules:

- A `Project` must belong to an `Organization`.
- A `Project` must have one `ProjectIdentity`.
- A `Project` must have exactly one publication type.
- A `Project` must have one original language and one authoring language.
- A `Project` may have zero or more target languages.
- A `Manuscript` must belong to a `Project` or be explicitly private to an
  author until submitted.
- A `Document` must belong to a `Project`.
- A `TranslationProject` must reference a source manuscript or document.
- A `Translation` must belong to a `TranslationSegment`.
- A `Translation` must preserve translator attribution.
- A `Publication` cannot be released without valid rights and final human
  approval.
- A `Publication` cannot bypass final preflight.
- Critical preflight errors block publication.
- A `PublishingRecord` must reference a Library publication identity.
- An `OriginalWork` must preserve original language and source attribution.
- A `SourceEdition` must belong to an `OriginalWork`.
- A `RightsAuthorization` must reference the project, document, original work,
  publication, or scope it governs.
- An `Asset` must preserve ownership, source reference, storage reference,
  rights metadata when applicable, and language metadata when applicable.
- An `AIResult` must belong to an `AITask`.
- AI output must not mutate domain entities without authorized human action.
- A workflow approval must be performed by an authorized human role.
- Audit records must not be edited or deleted.

## 13. Enumerations

Fixed values must be centrally defined and reused. Hardcoded values inside
implementation logic are not allowed.

Logical enumeration families include:

- `ProjectStatus`.
- `ProjectOrigin`.
- `ProjectRightsStatus`.
- `PublicationType`.
- `ProjectCapability`.
- `EditorialDomain`.
- `ManuscriptStatus`.
- `DocumentStatus`.
- `TranslationStatus`.
- `ReviewStatus`.
- `CorrectionProposalStatus`.
- `PublicationStatus`.
- `PublicationLifecycleStatus`.
- `PublishingState`.
- `PreflightStatus`.
- `DistributionStatus`.
- `RightsStatus`.
- `AssetType`.
- `WorkflowStatus`.
- `AITaskStatus`.
- `AIResultStatus`.
- `AuditAction`.
- `DeletionStrategy`.

Enums must be documented in the logical model before physical implementation.

## 14. Relationship with AI

AI is not the owner of editorial data.

Logical flow:

```text
AITask
  -> AIResult
  -> Review
  -> Human Approval
  -> Domain Entity
```

AI may:

- Suggest.
- Analyze.
- Summarize.
- Generate draft recommendations.
- Explain alternatives.
- Detect blockers.

AI may not:

- Approve.
- Publish.
- Grant rights.
- Mutate validated domain data directly.
- Bypass workflow.
- Modify security or governance.
- Alter audit history.

## 15. Digital Assets

All file-like resources are treated as `Asset` references.

An `Asset` may represent:

- Image.
- PDF.
- EPUB.
- DOCX.
- Audio.
- Video.
- Illustration.
- Subtitle.
- Cover.
- Export package.
- Source manuscript file.

Domain entities must reference assets rather than copying file content.

Asset metadata must include:

- `id`.
- `organizationId`.
- `assetType`.
- `storageReference`.
- `sourceReference`.
- `rightsMetadata`.
- `language`.
- `locale`.
- `version`.
- `checksum` where available.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

## 16. Audit

Every aggregate must define:

- Audited actions.
- Detail level.
- Retention period.
- Access rules.
- Sensitive metadata handling.

Audit must capture:

- Actor.
- Organization.
- Resource type.
- Resource ID.
- Action.
- Timestamp.
- Before-state reference where appropriate.
- After-state reference where appropriate.
- Reason or justification where required.

Audit is immutable and separate from observability logs.

## 17. Naming Rules

In the logical model:

- All internal names are English.
- Entity names use singular nouns.
- Entity names use PascalCase.
- Property names use camelCase.
- Enumeration values use stable uppercase identifiers.
- UI labels are localized through the i18n system and are not logical names.

Examples:

- `Publication`.
- `PublicationVersion`.
- `TranslationProject`.
- `OriginalWork`.
- `LibraryItem`.

## 18. Logical Constraints

The logical model must define:

- Unique fields.
- Required fields.
- Optional fields.
- Required relationships.
- Optional relationships.
- Value limits.
- State transition rules.
- Visibility rules.
- Tenant isolation rules.
- Need-to-Know access restrictions.

These rules must be translated later into the physical schema, runtime
validators, API contracts, and tests.

## 19. Acceptance Criteria

The logical model is complete when:

- All aggregates are defined.
- All aggregate roots are documented.
- All logical entities are assigned one owner.
- All relationships are documented.
- All cardinalities are defined.
- Integrity rules are complete.
- Versioning strategy is defined.
- Deletion strategy is defined.
- Concurrency strategy is defined.
- Existing repository aggregates are compared with the logical model.
- Duplications and overlaps are documented.
- An incremental migration plan exists.

## Logical Data Model Baseline Audit

Codex must perform a Logical Data Model Baseline Audit.

Objectives:

1. Identify existing aggregates in the repository.
2. Compare them with the logical model defined here.
3. Detect missing relationships.
4. Detect implicit cardinalities.
5. Identify duplicated concepts.
6. Propose the unified logical model.

Required deliverables:

- `docs/data/logical-data-model.md`.
- `docs/data/aggregate-map.md`.
- `docs/data/entity-relationships.md`.
- `docs/data/integrity-rules.md`.
- `docs/data/logical-gap-analysis.md`.
- `docs/data/logical-migration-plan.md`.

## Mandatory Requirement for Codex

Treat this document as the official logical data model for Laborator Editura.

Codex must inspect the current repository and identify all aggregates, logical
entities, relationships, ownership rules, integrity constraints, and versioning
strategies.

Codex must compare the existing implementation with this logical model and
produce a gap analysis and an incremental migration plan.

Codex must not generate database-specific schemas yet. Technology-dependent
optimizations are not allowed in this chapter.

Validated functionality from Phase 7 - Step 16 must be preserved.

The resulting logical model is the authoritative source for future physical
database design.

## Recommended Next Architecture Document

Chapter 6 - Physical Data Model and Database Standards is now documented in
`docs/ARCHITECTURE_CHAPTER_6.md`.

After Chapter 6 is validated, the next recommended document is:

- Chapter 7 - Integrations and AI Agent Architecture.

Chapter 7 should define AI orchestration, provider integration, module-agent
contracts, prompt governance, cost controls, limits, logging, human approval,
and traceability rules.
