# Domain Model Gap Analysis

Status: Baseline comparison between current repository entities and Chapter 4.

Scope: Documentation only. No database redesign, API change, or module rewrite
is authorized by this document.

## Summary

The repository already contains most conceptual domains required by Chapter 4.
The implementation is broad and operational, especially for Identity,
Projects, Documents, Segments, Translation Memory, Terminology, QA, Semantic
Fidelity, Workflow, Library, Rights, Publishing, AI Governance, Research,
Collaboration, Scheduling, Commerce, Observability, Security, Backup, and
Policy.

The main gap is not missing functionality. The main gap is conceptual
normalization: several entities overlap across modules because they were
introduced incrementally as backend foundations.

## Coverage Matrix

| Chapter 4 domain | Current coverage | Assessment |
| --- | --- | --- |
| Identity and Access | Auth, Enterprise Admin, Workspace access, Founder Protection. | Strong coverage with overlap between Auth and Admin user/role metadata. |
| Organization | Auth organizations, admin organizations, teams, memberships, workspace. | Strong coverage; ownership boundaries should be clarified. |
| Editorial Activity | Author Studio, Documents, Segments, Translations, TM, Terminology, Lexicographic, QA, Semantic Fidelity, Workflow. | Strong coverage; Review/Correction are distributed concepts. |
| Publishing | Layout Publishing, Export, Public Portal, Commerce, Library publication records. | Strong coverage after Phase 7 Step 16; publication identity vs release state must remain separated. |
| Digital Library | Library items, publication records, editions, versions, files, reader data. | Strong coverage; Library is already close to single source of truth for publication identity. |
| Rights and Provenance | Rights agreements, translation authorization, publishing authorization, provenance record. | Strong coverage; Original Work and Source Edition need conceptual extraction. |
| Artificial Intelligence | AI Governance, Editorial Decisions, Platform Engineering, Observability agent execution, Marketplace agents. | Strong coverage; AI Task and AI Result should be unified conceptually. |
| Files and Digital Assets | Multimedia, Media Localization, Export artifacts, Library files, JSON Master media assets. | Partial conceptual unification; physical storage abstraction should be clarified later. |
| Audit and Observability | Many audit event tables plus observability metrics/logs/traces. | Strong coverage; audit events are module-specific, which is acceptable but needs a shared conceptual dictionary. |
| Configuration | Security, Policy, Workspace language management, Gateway, Integrations, Backup, Marketplace. | Strong coverage; configuration ownership varies by concern. |

## Duplicated or Overlapping Concepts

### Organization

Current overlap:

- `AuthOrganization`.
- `AdminOrganization`.
- `organizations`.
- `admin_organizations`.

Recommendation:

- Treat `Organization` as the conceptual tenant identity.
- Treat Administration records as administrative metadata for the same
  conceptual organization.
- Do not create a second organization concept in future work.

### User, Role, Permission, Membership

Current overlap:

- Auth has `AuthUser`, `MvpRole`, `MvpPermission`, `user_roles`.
- Enterprise Admin has `AdminUser`, `AdminRole`, `AdminPermission`,
  `AdminMembership`.
- Workspace has operational roles, subscriptions, Need-to-Know grants, and
  collaborator invitations.

Recommendation:

- Identity owns User, Role, Permission, Session.
- Administration owns admin metadata and management workflows.
- Workspace owns effective access computation and scoped grants.
- Logical model should separate `RoleAssignment`, `Membership`, and
  `AccessGrant`.

### Publication

Current overlap:

- `LibraryPublicationRecord`.
- `LayoutPublishingRecord`.
- `PublicCatalogItem`.
- `CommerceEdition`.
- `JsonMasterPublicationProfile`.

Recommendation:

- Library owns publication identity and lifecycle.
- Publishing owns release readiness, official edition selection, and release
  snapshots.
- Public Portal owns public exposure metadata.
- Commerce owns commercial edition/distribution metadata.

### Asset

Current overlap:

- `MultimediaAsset`.
- `MediaLocalizationAsset`.
- `LibraryPublicationFile`.
- `ExportArtifact`.
- JSON Master media assets and production assets.

Recommendation:

- Define a conceptual `Asset` aggregate in Chapter 5.
- Keep module-specific asset metadata where needed, but ensure every asset has
  stable ownership, source reference, rights metadata, language metadata when
  applicable, and storage reference.

### Review and Correction

Current overlap:

- AI review proposals.
- Editorial decision recommendations.
- QA issues.
- Semantic Fidelity issues.
- Workflow review states.
- Collaboration comments.

Recommendation:

- Define `Review`, `Review Finding`, `Correction Proposal`, and `Decision`
  concepts in the logical model.
- Preserve module-specific validation ownership.
- Do not let AI proposals mutate translation or manuscript content directly.

### Original Work and Source Edition

Current overlap:

- Project Identity original author fields.
- Provenance Record original title/language/edition/publisher fields.
- Library publication original title/author/source fields.
- Research Source and Dictionary Source edition metadata.

Recommendation:

- Conceptually define `OriginalWork` and `SourceEdition`.
- Rights & Provenance should own provenance authority.
- Library and Project should reference provenance rather than duplicate source
  authority data over time.

### AI Task and AI Result

Current overlap:

- `AiUsageRecord`.
- `ObservabilityAgentExecution`.
- `AgentCoordinationRun`.
- `AiReviewProposal`.
- `EditorialDecisionRecommendation`.
- AI metadata in validation reports.

Recommendation:

- Chapter 5 should define `AITask`, `AIExecution`, and `AIResult`.
- AI Governance owns provider, budget, quota, and authority policy.
- Functional modules own accepted domain changes resulting from human-approved
  AI suggestions.

## Missing or Partial Concepts

| Concept | Current state | Gap |
| --- | --- | --- |
| Authentication Provider | Not explicit beyond credentials/session conventions. | Add conceptual entity before external SSO/provider implementation. |
| Category | Tags and taxonomy exist; Category is not clearly unified. | Define whether Category belongs to Library taxonomy, editorial taxonomy, or both. |
| Message | Collaboration comments exist; messaging is not independent. | Decide later whether Message is a separate communication entity. |
| Notification | Scheduling reminders exist; notifications are not fully unified. | Define notification aggregate later if needed. |
| Change Set | Audit before/after state exists; change sets are not unified. | Define conceptual grouping for multi-entity changes. |
| Asset | Multiple module-specific asset entities. | Needs conceptual unification before physical database design. |
| Original Work | Present as fields, not a standalone conceptual aggregate. | Needs conceptual extraction in Chapter 5. |
| Source Edition | Present as fields in provenance/research/lexicographic sources. | Needs clear relationship to Original Work and Publication. |

## Architecture Risks

- If Publication identity continues to evolve independently in Library,
  Publishing, Public Portal, and Commerce, future release workflows may require
  avoidable reconciliation.
- If Asset remains module-specific without a shared conceptual aggregate, media
  localization, export, and library files may drift.
- If User/Role/Permission/Plan/Grant concepts remain blurred, Need-to-Know
  access, subscriptions, and administration can become hard to reason about.
- If Review, Correction, QA, Semantic, and Editorial Decision remain only
  module-specific, the final editorial approval model may become fragmented.

## Non-Goals

- Do not rename runtime tables now.
- Do not merge modules now.
- Do not redesign the database now.
- Do not change validated Phase 7 Step 16 behavior.
- Do not change API contracts from this audit alone.
