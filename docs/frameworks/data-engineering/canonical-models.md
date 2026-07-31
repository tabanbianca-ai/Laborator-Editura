# Canonical Data Models

## Purpose

Canonical Data Models define the official shape and ownership of platform data
independently from individual repositories, runtime tables, UI components,
integration providers, or generated publication formats.

## Canonical First Rule

Every operational record must trace back to one canonical model or an approved
derived model.

Operational models may include implementation-specific fields, but they must
not become alternative sources of truth.

## Canonical Entity Pattern

Every canonical entity should define:

- `id`.
- `canonicalIdentifier`.
- `entityType`.
- `schemaId`.
- `schemaVersion`.
- `version`.
- `lifecycleState`.
- `organizationId` where tenant scoped.
- `ownerId`.
- `stewardId`.
- `createdAt`.
- `updatedAt`.
- `createdBy`.
- `updatedBy`.
- `sourceSystem`.
- `provenance`.
- `classification`.
- `sensitivity`.
- `qualityStatus`.
- `retentionPolicyId`.
- `effectiveFrom`.
- `effectiveUntil`.
- `metadata`.

## Required Canonical Models

The mandatory canonical model set includes:

- User.
- Organization.
- Role.
- Project.
- Manuscript.
- Book.
- Magazine.
- Translation.
- Revision.
- Publication.
- Audio Asset.
- Video Asset.
- AI Prompt.
- AI Model.
- Workflow.
- Notification.
- Contract.
- License.
- Audit Record.
- Metadata.

## Canonical Domain Map

### Identity and Access

Canonical models:

- User.
- User Profile.
- Credential.
- Session.
- Role.
- Permission.
- Membership.
- Access Grant.
- Authentication Event.

Primary authority:

- IAM and Auth.

### Organization and Workspace

Canonical models:

- Organization.
- Workspace.
- Team.
- Invitation.
- Subscription Entitlement.
- Workspace Navigation Item.
- Workspace Preference.

Primary authority:

- Administration and Workspace.

### Editorial Production

Canonical models:

- Project.
- Project Identity.
- Project Dossier.
- Manuscript.
- Manuscript Section.
- Draft.
- Document.
- Segment.
- Translation.
- Revision.
- Review Proposal.
- Editorial Decision.

Primary authority:

- Projects, Author Studio, Documents, Translation, Review, and Workflow.

### Publication and Library

Canonical models:

- Publication.
- Edition.
- Publication Version.
- Publication File.
- Export Artifact.
- Distribution Record.
- Library Item.
- Reader Access Record.

Primary authority:

- Publishing, Export, Distribution, Public Portal, Commerce, and Library.

### Linguistic Knowledge

Canonical models:

- Translation Memory Entry.
- Glossary Entry.
- Terminology Decision.
- Lexicographic Source.
- Lexicographic Entry.
- Lexical Sense.
- Citation.
- Linguistic Resource.
- Source Priority Rule.

Primary authority:

- Translation Memory, Terminology, Lexicographic Intelligence, and Linguistic
  Knowledge Base.

### Rights and Provenance

Canonical models:

- Collaboration Agreement.
- Translation Authorization.
- Publishing Authorization.
- Provenance Record.
- Contract.
- License.
- Rights Holder.
- Source Authority.

Primary authority:

- Rights and Provenance.

### Media and Multimedia

Canonical models:

- Image Asset.
- Audio Asset.
- Video Asset.
- Subtitle Track.
- Voice Profile.
- Media Localization Project.
- Multimedia Project.
- Localized Media Version.

Primary authority:

- Multimedia, Media Localization, Audio, Video, and Publishing.

### AI and Automation

Canonical models:

- AI Prompt.
- AI Model.
- AI Provider.
- AI Agent.
- Agent Execution.
- AI Usage Record.
- AI Budget.
- AI Quota.
- AI Policy.

Primary authority:

- AI Governance, AI Orchestration, Marketplace, and Platform Engineering.

### Operations and Governance

Canonical models:

- Workflow.
- Notification.
- Audit Record.
- Observability Metric.
- Log Record.
- Trace.
- Backup Job.
- Restore Event.
- Disaster Recovery Plan.
- Policy.
- Compliance Record.
- Security Event.

Primary authority:

- Workflow, Notifications, Audit, Observability, Backup, Policies, Security,
  and Compliance.

## Mapping to Existing Baselines

Current canonical sources:

- `docs/modules/data-governance/canonical-data-model.md`.
- `docs/data/logical-data-model.md`.
- `docs/data/aggregate-map.md`.
- `docs/database/physical-data-model.md`.
- `packages/db/src/runtime-database.ts`.
- `docs/JSON_MASTER_FORMAT.md`.

Framework 03 is the governing layer above these documents. Future changes
should update this framework and then update subordinate model documents.

## Canonical Conflict Rules

- If two modules define the same concept, the canonical owner must be selected
  from the aggregate map.
- Duplicate records must be resolved through mapping, reference, or migration,
  not silent replacement.
- AI-generated data is not canonical until validated and approved by
  authorized humans where approval is required.
- Derived data must reference source model, source version, transformation,
  actor or service, timestamp, and validation result.

## Baseline Gaps

- Complete model-to-runtime-table mapping is not yet machine-readable.
- Some runtime table families are scaffolding foundations and need future
  canonical field alignment.
- Some cross-domain references are currently metadata fields rather than
  explicit typed references.
- Canonical model version registry is not yet implemented.
