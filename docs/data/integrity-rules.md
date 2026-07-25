# Logical Integrity Rules

Status: Integrity baseline for Chapter 5 - Logical Data Model.

This document defines technology-independent integrity rules. These rules must
later be translated into validators, API contracts, physical constraints,
tests, and migration checks.

## Universal Rules

- Every logical entity must have a globally unique `id`.
- Every tenant-scoped entity must have `organizationId`.
- Every mutable entity must have `version`, `status`, `createdAt`,
  `updatedAt`, `createdBy`, and `updatedBy` or a documented exception.
- IDs must never be reused.
- Cross-aggregate references must be explicit.
- No aggregate may own the same entity as another aggregate.
- Runtime duplication is allowed only as a read model, snapshot, or
  compatibility layer with documented ownership.
- Audit records are immutable.
- Version history must not be deleted when an entity is archived.

## Identity Rules

- A `User` must have one active identity record.
- Credentials belong only to Identity.
- Sessions must expire.
- Expired sessions must not authorize requests.
- Role assignments must reference an existing user and organization scope.
- Founder protection state must be immutable by normal administrator actions.
- Founder ownership transfer must have exactly one active pending transfer per
  organization.
- Founder ownership transfer must expire according to the configured policy.

## Organization and Workspace Rules

- An `Organization` is the tenant boundary.
- Every project, document, workflow state, rights record, audit record, and
  tenant-scoped asset must belong to exactly one organization.
- Teams belong to one organization.
- Memberships link users to organizations or teams.
- Need-to-Know access uses the most restrictive applicable rule.
- Temporary access must have an expiry and must be revoked immediately where
  implementation supports active-session revocation.
- Subscription limits must never delete existing user data.
- Workspace navigation must not expose hidden modules to unauthorized users.

## Project Rules

- A `Project` must belong to an organization.
- A `Project` must have a `ProjectIdentity`.
- A `Project` must have exactly one publication type.
- A `Project` must have one editorial domain.
- A `Project` may have optional series, collection, and volume metadata.
- A `Project` must have one original language.
- A `Project` must have one authoring language.
- A `Project` may have zero or more target languages.
- Original language is immutable after project creation unless explicitly
  changed by an authorized user.
- Project capabilities activate existing workflow stages; they must not create
  duplicate workflows.
- Flipbook capability is valid only for magazine publication type.
- Project dossiers group references and must not own or duplicate referenced
  content.

## Editorial Rules

- A manuscript may be created in any ISO-compatible language.
- A manuscript must preserve author attribution.
- A manuscript draft must not be overwritten automatically by AI.
- Manuscript sections belong to one manuscript.
- Draft versions belong to one manuscript section.
- Private author notes must not be exposed publicly.
- A submitted manuscript may link to a document or create a document through an
  approved workflow.
- A document must belong to one project.
- Document translator attribution must preserve original author attribution.

## Translation Rules

- Assisted translation v1.0 may target only approved v1.0 translation target
  languages and locales.
- A translation project must reference a source manuscript or document.
- A translation segment must belong to one document and project context.
- A translation must belong to one segment.
- Each translation must preserve target language and target locale separately.
- Translation must preserve translator attribution.
- Validated glossary terms have priority over Translation Memory and AI.
- Translation Memory stores only validated translations as reusable evidence.
- Translation Memory suggestions must not replace text automatically.
- AI suggestions must not overwrite Translation Memory or validated
  terminology.
- Dictionary evidence is supporting and non-authoritative unless elevated by an
  authorized human decision.

## Terminology and Lexicographic Rules

- New terminology starts as `PROPOSED`.
- AI must never create `VALIDATED` terminology automatically.
- Terms not found in approved sources must become `UNDER_REVIEW`.
- Romanian terms must pass diacritics and orthographic validation.
- Missing or incorrect Romanian diacritics create High severity terminology
  issues.
- Rejected terms create Critical terminology issues.
- Only authorized humans may validate, suspend, archive, or reject terminology.
- Lexicographic entries must preserve source attribution and citations.
- Full copyrighted dictionary content must not be ingested without documented
  authorization.
- Source priority changes must be audited.

## Correction, QA, and Semantic Rules

- Review proposals start as `PENDING`.
- Review proposals may become `ACCEPTED` or `REJECTED` only through authorized
  human action.
- Accepted proposals must preserve version history.
- Rejected proposals must remain auditable.
- QA reports may validate segments or documents.
- Semantic Fidelity reports may validate segments or documents.
- QA and Semantic Fidelity reports are evidence; they do not approve content.
- Unresolved High or Critical QA issues block review progression according to
  workflow rules.
- Unresolved High or Critical Semantic Fidelity issues block approval according
  workflow rules.

## Workflow Rules

- Workflow state belongs to one target scope: project, document, segment, or
  publication.
- Workflow transitions must follow approved state transition rules.
- Workflow gates must evaluate evidence from QA, Semantic Fidelity, Rights,
  Preflight, and Publishing where applicable.
- Only authorized human roles may approve.
- AI may suggest next actions but must not advance approvals automatically.
- Blocking and unblocking must be audited.

## Library Rules

- Library publication records are the source of truth for publication identity
  and lifecycle.
- Library lifecycle statuses are status values, not separate libraries.
- Status changes must not destroy historical versions.
- Visibility is independent from lifecycle status.
- Published versions are immutable.
- Publication files reference assets or export artifacts.
- Reader data is private by default.
- Public previews must not expose restricted content.
- Duplicate detection must never merge records automatically.

## Publishing and Distribution Rules

- Publishing owns release readiness, official edition selection, and release
  snapshots.
- Publishing records must reference Library publication identity.
- Export owns generated artifacts.
- Rights & Provenance owns rights warnings and authorization records.
- Quality Agent owns quality findings; preflight aggregates signals.
- Critical preflight errors block publication.
- Warnings may be accepted only by authorized humans and must be audited.
- Official published editions are immutable.
- Corrections require a new edition, version, or republication record.
- Withdrawal must preserve Library records, generated files, audit, versions,
  and distribution history.
- Distribution tracks channel delivery status only.

## Rights and Provenance Rules

- Original work language must be preserved.
- Original source attribution must be preserved.
- A source edition belongs to one original work.
- Publication cannot proceed without valid rights, a valid public-domain rule,
  or another approved authorization status.
- Public domain projects may proceed without original author rights, but the
  platform must continue tracking rights for translations, adaptations,
  illustrations, layout, cover, audiobook, video, and other contributions.
- Rights records must not be automatically approved by AI.
- Provenance must not be modified automatically by AI.

## Media and Asset Rules

- All file-like resources are assets or asset references.
- Domain entities reference assets; they do not copy file content.
- Asset metadata must preserve storage reference, source reference, rights
  metadata where applicable, language metadata where applicable, and version.
- Localized media must remain linked to original media.
- Preview audio/video is never public.
- Official audio/video requires final approval and publishing rights.
- AI-generated media drafts require human approval before publication.

## AI Rules

- AI task execution must preserve provider, model metadata, cost metadata
  where available, input/output references, status, and audit trail.
- AI results must belong to AI tasks.
- AI results are advisory until accepted by authorized humans.
- AI cannot approve, publish, grant rights, bypass workflow, modify security,
  change governance, delete logs, or alter audit history.
- Provider fallback and recovery must be audited.
- Budget warnings must be emitted at 80%, 90%, and 100%.
- Limit reached must block only the restricted AI action and must not delete
  data.
- Platform Creator remains unrestricted for AI testing and monitoring.

## Calendar and Notification Rules

- Scheduling records must reference the project, document, user, team, or
  agent run they concern.
- Calendar entries do not replace workflow approvals.
- Reminders may produce notifications, but notification delivery must not
  expose restricted content.
- Publication schedule confirmation requires authorized human action.

## Audit and Observability Rules

- Audit records prove actor, action, resource, time, and relevant before/after
  state references.
- Audit is immutable.
- Observability logs, metrics, and traces explain runtime behavior but do not
  replace audit.
- Sensitive values and secrets must never be logged.
- Restricted access attempts must be audited.

## Configuration Rules

- Configuration changes must be auditable.
- Critical configuration changes require confirmation when defined by policy.
- Secrets must use secure metadata and must never be logged in clear text.
- Integration providers and webhooks remain disabled until explicitly enabled.
- Language configuration is centralized and must not be duplicated across
  modules.
- Policy exceptions require authorized human approval.

## Deletion Strategy Rules

| Entity group | Strategy | Rule |
| --- | --- | --- |
| Audit, published versions, provenance, rights history | Archive only | Permanent deletion is not allowed. |
| Projects, manuscripts, documents, publications | Archive | Historical references must remain intact. |
| Draft working records | Soft delete or archive | Recovery and versioning must remain available. |
| Reader notes and preferences | Soft delete where privacy permits | Privacy rules and account deletion requests apply. |
| Temporary sessions and reset tokens | Expire and purge where allowed | Security retention policies apply. |
| Logs and traces | Retain according to observability policy | Must not affect audit permanence. |
| Secrets | Rotate, revoke, or archive metadata | Clear secret values must not remain exposed. |

## Versioning Rules

- Editorial content must use shared versioning infrastructure.
- Publication versions are immutable after publication.
- Accepted review proposals must create or reference a content version.
- Translation rule versions and source authority references are immutable per
  version.
- Asset versions must preserve source, checksum where available, and rights
  metadata.
- Version restoration must be auditable.

## Concurrency Rules

- Mutable entities must use optimistic locking or equivalent version conflict
  checks.
- Stale writes must be rejected or routed to explicit conflict resolution.
- Collaborative editing must preserve user attribution and version history.
- AI output must not silently overwrite current user edits.

## Physical Model Prerequisite

Chapter 6 must translate these logical integrity rules into database-specific
constraints, indexes, migrations, retention policies, and tests.
