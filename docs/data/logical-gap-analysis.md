# Logical Data Model Gap Analysis

Status: Baseline comparison between the current repository and Chapter 5 -
Logical Data Model.

Scope: Documentation only. No physical schema, API, Docker, UI, or runtime
logic changes are authorized by this analysis.

## Summary

The current repository already contains broad functional coverage across the
logical aggregate groups required by Chapter 5. Most runtime foundations exist
as module-specific repositories, type definitions, and runtime database
tables.

The remaining gap is logical normalization, not immediate missing product
functionality. Several concepts are implemented in multiple modules because
they were added incrementally as foundation modules. Chapter 5 provides the
rules needed to normalize those concepts before a future physical data model.

## Aggregate Coverage Matrix

| Logical aggregate | Current coverage | Assessment |
| --- | --- | --- |
| Identity | Auth users, credentials, sessions, activity/security events, founder protection. | Strong. Needs clearer separation between identity roles and admin role metadata. |
| Organization | Auth organizations, admin organizations, teams, workspace, subscriptions, Need-to-Know grants. | Strong. Needs canonical organization/membership mapping. |
| Projects | Project identity, publication type, editorial domain, capabilities, dossiers. | Strong. Already close to logical model. |
| Library | Publication records, editions, versions, files, user library items, reading data. | Strong. Library is already the best candidate for publication identity ownership. |
| Editorial | Author Studio manuscripts, sections, drafts, notes, submissions, documents. | Strong. Need clearer logical bridge between manuscript and document after submission. |
| Translation | Segments, translations, TM, terminology, lexicographic sources, dictionary evidence. | Strong. Missing explicit `TranslationProject` root as a named logical aggregate. |
| Correction | QA, Semantic Fidelity, editorial decisions, AI review proposals, workflow review states. | Partial. Review and correction concepts are distributed across modules. |
| Publishing | Layout plans, preflight, publishing records, distribution records, export artifacts, public portal and commerce metadata. | Strong. Needs logical separation between Library publication identity and Publishing release state in future mappings. |
| Rights | Agreements, translation authorization, publishing authorization, provenance records. | Strong. Needs explicit `OriginalWork` and `SourceEdition` logical roots. |
| Media | Multimedia creation, media localization, library files, export artifacts, JSON Master media fields. | Partial. Needs unified `Asset` aggregate before physical design. |
| AI | AI governance, provider fallback, budgets, quotas, agent profiles, usage records, observability executions. | Strong. Needs unified `AITask`, `AIExecution`, and `AIResult` mapping. |
| Workflow | Workflow states, transitions, gates, approval rules. | Strong. Should remain a state/gate owner, not content owner. |
| Calendar | Scheduling tasks, events, reminders, agent runs. | Present. Should not overlap with workflow approvals. |
| Notifications | Reminders and workspace preferences exist. | Partial. Dedicated notification aggregate is not yet implemented. |
| Audit | Module-specific audit events. | Strong. Needs shared logical `AuditRecord` and `ChangeSet` mapping. |
| Configuration | Security, policy, integrations, webhooks, backup, language management, marketplace, gateway. | Strong. Needs centralized configuration taxonomy before physical design. |

## Duplicated or Overlapping Concepts

### Organization and Workspace

Current overlap:

- `AuthOrganization`.
- `AdminOrganization`.
- `WorkspaceLayout`.
- `WorkspacePreferences`.
- Subscription and Need-to-Know records.

Logical target:

- `Organization` is the tenant root.
- `Workspace` is the presentation and access context.
- Administration manages organization metadata without duplicating identity.

Migration concern:

- Future physical design should not create multiple organization sources of
  truth.

### User, Role, Permission, Membership, and Grant

Current overlap:

- Auth roles and permissions.
- Admin users, roles, permissions, memberships.
- Workspace operational roles, Need-to-Know grants, subscriptions, and
  invitations.

Logical target:

- Identity owns `User`, credential, session, and base role assignment.
- Organization owns membership and teams.
- Workspace owns scoped grants and effective access calculation.
- Subscription entitlements are commercial limits, not editorial authority.

Migration concern:

- Effective access must remain `Role permissions x Subscription entitlements x
  Need-to-Know scope`.

### Publication

Current overlap:

- `LibraryPublicationRecord`.
- `PublishingRecord`.
- `PublicCatalogItem`.
- `CommerceEdition`.
- `ExportArtifact`.

Logical target:

- Library owns publication identity and lifecycle.
- Publishing owns release readiness and official publication state.
- Export owns generated artifacts.
- Public Portal owns public exposure.
- Commerce owns commercial distribution metadata.

Migration concern:

- Future physical design must avoid duplicating title, author, edition,
  rights, files, and lifecycle data across these surfaces.

### Asset

Current overlap:

- `MultimediaAsset`.
- `MediaLocalizationAsset`.
- `LibraryPublicationFile`.
- `ExportArtifact`.
- JSON Master media assets.

Logical target:

- `Asset` is the shared metadata concept.
- Module-specific records may remain as specialized profiles or references.

Migration concern:

- Chapter 6 should define whether assets are one physical table, a shared
  reference interface, or specialized tables with a common asset registry.

### Review, QA, Semantic Fidelity, and Editorial Decision

Current overlap:

- QA issues.
- Semantic Fidelity issues.
- Editorial decisions.
- AI review proposals.
- Collaboration comments.
- Workflow review states.

Logical target:

- `Review` owns review context.
- `ReviewFinding` collects issues from QA, Semantic Fidelity, terminology,
  rights, or human reviewer input.
- `CorrectionProposal` preserves proposed changes without mutating content.
- `EditorialDecision` documents accepted/rejected outcomes.

Migration concern:

- AI review proposal acceptance must always produce auditable versioned human
  changes, never direct automatic mutation.

### Original Work and Source Edition

Current overlap:

- Project Identity original author metadata.
- Rights provenance fields.
- Library original title/author/language metadata.
- Research and lexicographic source edition metadata.

Logical target:

- `OriginalWork` is the root for source authorship and original language.
- `SourceEdition` captures edition-specific authority.
- Rights owns provenance authority.

Migration concern:

- Future physical design should reduce repeated original work fields by using
  references and snapshots.

### AI Task, AI Execution, and AI Result

Current overlap:

- AI usage records.
- Observability agent executions.
- Agent coordination runs.
- Review proposals.
- Editorial decision recommendations.

Logical target:

- `AITask` represents requested work.
- `AIExecution` represents the provider/model attempt.
- `AIResult` represents output evidence.
- Domain modules own accepted domain changes.

Migration concern:

- Cost governance, observability, and domain outputs should link to the same
  logical AI execution chain.

### Audit and Versioning

Current overlap:

- Many module-specific audit tables.
- Library publication versions.
- JSON Master version references.
- before/after states in audit records.

Logical target:

- `AuditRecord` is immutable action history.
- `Version` is recoverable content evolution.
- `ChangeSet` groups multi-entity actions.

Migration concern:

- Audit should remain module-compatible while Chapter 6 defines shared
  metadata conventions.

## Missing Logical Elements

| Logical element | Current state | Required before physical design |
| --- | --- | --- |
| `TranslationProject` root | Translation state is distributed through projects, documents, segments, and translations. | Define whether it is a first-class aggregate or a logical read model. |
| `Review` root | Review is distributed across AI proposals, QA, Semantic, workflow, and collaboration. | Define unified review/correction model. |
| `OriginalWork` root | Provenance fields exist but no dedicated logical root in implementation. | Define source work identity and relationship to publication and rights. |
| `SourceEdition` | Edition metadata exists in provenance, research, lexicographic, and library. | Define source authority edition model. |
| `Asset` root | Asset-like records exist in multiple modules. | Define shared asset registry or reference contract. |
| `Notification` root | Reminders exist; notifications are not unified. | Decide whether notifications remain a later aggregate. |
| `ChangeSet` | Audit before/after state exists, but grouped changes are not unified. | Define grouping model for multi-entity actions. |
| Central enum registry | Enums exist in many modules. | Define shared enum ownership and allowed module-local enums. |

## Implicit Cardinalities That Need Formalization

- One project may have many manuscripts, documents, translation projects, and
  publication outputs.
- One original work may have many source editions and many translated
  publications.
- One publication may have many editions, versions, files, channels, and public
  catalog entries.
- One document may have many segments and translations.
- One segment may have translations in multiple target languages.
- One AI task may produce multiple executions and multiple results.
- One review may aggregate findings from QA, Semantic Fidelity, Terminology,
  AI, and human reviewer comments.
- One asset may be linked to multiple publication contexts, but physical file
  ownership must remain singular.

## Logical Risks

- Physical schema design before resolving `Publication`, `Asset`,
  `OriginalWork`, and `Review` boundaries may create duplicate tables and
  migration debt.
- Treating subscriptions as roles would violate the access model.
- Treating AI results as domain entity mutations would violate Human Final
  Authority.
- Treating preflight as a new source of truth would duplicate Quality, Rights,
  Export, and Workflow responsibilities.
- Treating project dossiers as a global file manager would duplicate asset and
  library responsibilities.

## Non-Goals

- Do not generate database-specific schemas now.
- Do not create migrations now.
- Do not rename existing runtime tables now.
- Do not modify APIs now.
- Do not change Docker or staging configuration.
- Do not alter Phase 7 Step 16 validated behavior.

## Recommendation

Proceed to Chapter 6 only after accepting this logical model baseline.

Chapter 6 should translate the logical model into database-specific standards
and a physical schema proposal while preserving existing APIs and validated
runtime behavior.
