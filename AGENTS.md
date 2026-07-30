# Agents

## Development Governance

### Purpose

Define responsibilities and decision authority for the project.

### Manifesto Directive

Purpose:

- Define the strategic vision, mission, and conceptual foundation for all
  Laborator Editura implementation work.

Rules:

- The canonical platform Manifesto is documented in `docs/MANIFEST.md`.
- The Manifesto is the first document in the architecture suite and precedes
  the official development conventions, Chapter 0 fundamental principles, and
  detailed platform architecture.
- All implementations must remain compatible with the Manifesto, the official
  development conventions, and the architecture documents.
- When multiple implementation options exist, Codex must choose the solution
  that best preserves coherence, modularity, extensibility, traceability,
  security, native internationalization, accessibility, and permanent human
  editorial control.
- AI agents may assist, automate repetitive work, and propose solutions, but
  they do not replace authorized human editorial responsibility.
- Independent applications that duplicate platform functionality are not
  allowed. Laborator Editura remains one unified ecosystem with shared
  infrastructure, authentication, database, digital library, and security
  rules.

### General Platform Architecture Directive

Purpose:

- Define the official Chapter 1 general architecture that all modules,
  services, components, and AI agents must follow.

Rules:

- The canonical Chapter 1 architecture is documented in
  `docs/ARCHITECTURE_CHAPTER_1.md`.
- Laborator Editura is one unified editorial ecosystem, not a collection of
  independent applications.
- The public website, application, and central API must share the same
  authentication model, permission model, database, digital library, AI
  infrastructure, audit infrastructure, localization infrastructure, and
  security rules.
- Modules must not communicate through uncontrolled direct dependencies.
  Communication must use internal services, APIs, events, messages, or
  well-defined contracts.
- Circular dependencies are not allowed.
- Shared central components such as authentication, authorization, users,
  roles, permissions, audit, logging, localization, configuration, versions,
  digital library, and backup must not be duplicated.
- AI agents are integrated services and must follow the same authentication,
  permission, audit, logging, and localization rules as every other platform
  component.
- Before implementing any module, service, or AI agent, Codex must verify
  conformity with `docs/MANIFEST.md`, `docs/DEVELOPMENT_CONVENTIONS.md`,
  `SPEC.md` Chapter 0, and `docs/ARCHITECTURE_CHAPTER_1.md`.
- Any deviation from the general platform architecture requires explicit
  project owner approval.

### Application Architecture Directive

Purpose:

- Define the official Chapter 2 application architecture for organizing code,
  services, components, API access, infrastructure, tests, and deployment.

Rules:

- The canonical Chapter 2 application architecture is documented in
  `docs/ARCHITECTURE_CHAPTER_2.md`.
- The platform uses a modular monorepository. Current workspace names may map
  architecture responsibilities to approved existing packages and
  applications; this directive does not authorize disruptive renaming or
  duplicate parallel structures.
- Frontend work must use reusable components, separated pages, layouts,
  forms, dialogs, hooks, services, translations, and iconography.
- Backend work must remain module-based. Business logic must not be placed in
  controllers.
- The API is the only official access path to platform data. Frontend code
  must not access the database directly.
- Permissions must be verified server-side. UI hiding is not authorization.
- Configuration must remain external to code. Secrets, API keys, passwords,
  environment-specific URLs, and sensitive values must not be hardcoded or
  logged.
- Functional modules must use approved storage abstractions for files instead
  of direct filesystem access.
- Modules must use the shared AI integration layer and must not call AI
  providers directly.
- Long-running work such as PDF generation, EPUB conversion, media processing,
  AI analysis, backup, and indexing must run through background processing
  services instead of HTTP request handlers.
- Observability and audit are separate concerns. Observability explains system
  behavior; audit proves who acted on which resource and when.
- New code must include appropriate tests based on risk, module boundaries,
  and user-facing impact.
- Before implementing any new capability, Codex must verify that it follows
  Chapter 2, reuses existing components and services, avoids circular
  dependencies, avoids duplicate functionality, and remains testable,
  extensible, and documented.
- Any deviation from the application architecture requires explicit project
  owner approval.

### Module Architecture Directive

Purpose:

- Define the official Chapter 3 module architecture and mandatory template for
  every Laborator Editura module.

Rules:

- The canonical Chapter 3 module architecture is documented in
  `docs/ARCHITECTURE_CHAPTER_3.md`.
- Modules must be independent, reusable, extensible, testable, documented,
  secure, localizable, and auditable.
- Each module must have a clear responsibility, well-defined boundaries,
  public interfaces, services, rules, tests, and documentation.
- The standard module structure includes controllers, services, domain,
  repositories, DTOs, validators, events, permissions, localization, tests,
  documentation, and an index entry.
- Existing modules that predate Chapter 3 must not be used as precedent for
  new inconsistency. They should converge toward the standard structure when
  safely refactored, unless an approved Architecture Decision Record defines
  an exception.
- Controllers must not contain business logic.
- Repositories are the only module components responsible for data access.
  Controllers, UI components, and AI services must not access databases
  directly.
- Modules must define typed DTOs and validations for input data, functional
  rules, security rules, and relationship integrity.
- Module events must be typed, documented, and emitted through standardized
  mechanisms without direct module dependencies.
- Module permissions must integrate with central RBAC and Need-to-Know access
  and must be enforced server-side.
- User-facing module text must use the official i18n system and platform
  terminology dictionary.
- Modules that manage editorial content must support versioning, comparison,
  restoration, and complete history.
- Modules must use the central AI orchestration service and must not call AI
  providers directly.
- Before implementing a new module, Codex must check for reusable services,
  follow Chapter 3 structure, integrate with shared authentication,
  authorization, localization, audit, and observability, document APIs and
  events, and deliver appropriate tests.
- Any deviation from the module architecture requires an approved Architecture
  Decision Record before implementation.

### Conceptual Domain Model Directive

Purpose:

- Define the official Chapter 4 conceptual domain model and baseline audit that
  guide all future logical data modeling, physical persistence, APIs, and
  module ownership.

Rules:

- The canonical Chapter 4 conceptual domain model is documented in
  `docs/ARCHITECTURE_CHAPTER_4.md`.
- The required domain baseline deliverables are:
  - `docs/domain/domain-model.md`.
  - `docs/domain/domain-glossary.md`.
  - `docs/domain/domain-relationships.md`.
  - `docs/domain/domain-gap-analysis.md`.
  - `docs/domain/domain-migration-plan.md`.
- Chapter 4 is documentation and architecture analysis. It does not authorize
  database redesign, schema changes, API changes, runtime persistence changes,
  UI changes, or removal of existing validated functionality.
- Before adding or changing an entity, Codex must identify its conceptual
  owner, relationships, lifecycle, versioning needs, audit requirements, and
  current implementation overlap.
- Existing duplicated or overlapping entities must be documented and migrated
  incrementally. They must not be merged, renamed, or removed without an
  explicit implementation phase.
- Phase 7 Step 16 validated Publishing Workflow, Final Preflight, and
  Distribution Tracking behavior must be preserved.
- Logical data modeling is handled by Chapter 5 and must remain the mandatory
  input before physical database redesign or migrations are proposed.

### Logical Data Model Directive

Purpose:

- Define the official Chapter 5 logical data model that transforms conceptual
  entities into implementation-ready, technology-independent aggregates,
  relationships, integrity rules, versioning rules, deletion rules, and
  concurrency rules.

Rules:

- The canonical Chapter 5 logical data model is documented in
  `docs/ARCHITECTURE_CHAPTER_5.md`.
- The required logical baseline deliverables are:
  - `docs/data/logical-data-model.md`.
  - `docs/data/aggregate-map.md`.
  - `docs/data/entity-relationships.md`.
  - `docs/data/integrity-rules.md`.
  - `docs/data/logical-gap-analysis.md`.
  - `docs/data/logical-migration-plan.md`.
- Chapter 5 is technology-independent. It does not authorize database-specific
  schemas, indexes, migrations, runtime persistence changes, API changes, UI
  changes, Docker changes, or removal of existing validated functionality.
- Every logical entity must have exactly one owner aggregate.
- Cross-aggregate relationships must use explicit references, public
  contracts, events, or read models. They must not create alternate sources of
  truth.
- Many-to-many relationships must be represented through explicit associative
  entities in later physical design.
- Versioning, deletion, audit, and concurrency rules must be defined logically
  before physical schema work begins.
- AI must remain outside ownership of editorial data. `AIResult` may become
  domain evidence only through review and authorized human approval.
- Validated Phase 7 Step 16 Publishing Workflow, Final Preflight, Distribution
  Tracking, Library, Rights, Workflow, Export, Quality, Backup, and audit
  behavior must be preserved.
- Physical database design belongs to Chapter 6 and must use Chapters 4 and 5
  as mandatory inputs.

### Physical Database Model Directive

Purpose:

- Define the official Chapter 6 physical database implementation standards for
  PostgreSQL, migrations, naming, keys, constraints, indexes, audit,
  versioning, deletion strategies, security, and incremental evolution.

Rules:

- The canonical Chapter 6 physical database standard is documented in
  `docs/ARCHITECTURE_CHAPTER_6.md`.
- The required physical database baseline deliverables are:
  - `docs/database/physical-data-model.md`.
  - `docs/database/database-conventions.md`.
  - `docs/database/index-strategy.md`.
  - `docs/database/migration-strategy.md`.
  - `docs/database/database-gap-analysis.md`.
  - `docs/database/database-migration-plan.md`.
- PostgreSQL is the primary relational database engine.
- PostgreSQL-specific features must be documented and isolated when used.
- New canonical physical table designs must use English, singular nouns, and
  `snake_case`; existing validated plural table names must not be renamed
  without an approved compatibility migration.
- Every future physical table must define primary key, ownership, tenant scope
  where applicable, deletion strategy, audit requirements, versioning
  requirements, and index rationale.
- All database evolution must occur through documented, versioned, tested
  migrations.
- Manual direct schema changes are not allowed in controlled environments.
- Destructive schema changes, table renames, runtime-to-PostgreSQL conversion,
  audit consolidation, or broad physical redesign require explicit approval.
- Future migrations must preserve tenant isolation, RLS where applicable,
  audit history, version history, backup/restore compatibility, and Phase 7
  Step 16 validated publishing/preflight/distribution behavior.
- Chapter 6 does not authorize immediate implementation by itself. It provides
  the mandatory standards for future database work.

### Development Conventions Directive

Purpose:

- Define the official development standards for all Laborator Editura
  implementation work.

Rules:

- The canonical development conventions are documented in
  `docs/DEVELOPMENT_CONVENTIONS.md`.
- Internal implementation must use English only for source code, directories,
  files, classes, functions, methods, variables, constants, APIs, database
  objects, table names, column names, models, migrations, technical
  documentation, automated tests, and technical comments.
- User-facing interface text must be loaded through the localization system.
  Components must not introduce hardcoded labels, messages, notifications,
  button text, menu text, or mixed-language UI strings.
- Supported first-stage platform UI languages are Romanian, English, Spanish,
  French, Portuguese, Italian, and German. Romanian is the primary platform
  language.
- The full interface must follow the active Platform Language. Mixed-language
  UI is not allowed.
- Standard UI terminology must follow international localization standards
  first, then official Microsoft Windows and Apple macOS translations for
  general interface terms.
- Platform-specific terminology must live in the platform terminology
  dictionary and must not duplicate standard UI terminology.
- New user-facing terms must be checked against standard localization sources
  before becoming official platform dictionary terms.
- Different variants for the same official term are not allowed unless the
  project owner explicitly approves the change.
- Platform Language controls UI text only. It must not alter Original
  Language, Authoring Language, Target Language, manuscript content, or
  translation content.
- Internal role identifiers must remain in English. Role labels displayed in
  the UI must be localized.
- One authentication, session, role, and permission system must serve
  `laboratoreditorial.com`, `app.laboratoreditorial.com`, and
  `api.laboratoreditorial.com`.
- All modules must require authentication and authorization except explicitly
  approved public surfaces such as health checks or public catalog reads.
- New languages, modules, roles, user types, or features must be added without
  changing the existing architecture.
- If there is ambiguity or more than one possible implementation approach,
  these conventions take precedence.
- These conventions may be changed only by an explicit project owner decision.

### Architecture Freeze

The platform architecture is frozen for MVP implementation.

Rules:

- No new major features may be added without explicit architecture approval.
- Implementation must proceed in phases according to `ROADMAP.md`.
- Codex and Lovable must treat `SPEC.md` as the canonical product and
  architecture authority.
- Any conflict between implementation convenience and specification must be
  resolved in favor of the specification.

### MVP Stabilization Directive

Purpose:

- Maintain project control and execution discipline until MVP validation is
  complete.

Rules:

- Do not add new major modules.
- Do not expand scope beyond the approved architecture.
- Only clarify, refine, or complete existing specifications.
- Prioritize implementation over new design work.
- Roadmap expansion may resume only after MVP validation.

### Terminology Governance v2 Directive

Purpose:

- Protect terminology, Translation Memory, QA, Semantic Fidelity, workflow, and
  export from incorrect, invented, misspelled, or non-diacritic terms.

Rules:

- Treat Terminology Governance v2 as an approved stabilization enhancement of
  the existing Terminology & Glossary System, not as a new major module.
- AI must never automatically create `VALIDATED` terminology.
- New terminology entries must start as `PROPOSED`.
- Terms not found in approved sources must become `UNDER_REVIEW`.
- Romanian terms must pass diacritics and orthographic validation.
- Missing or incorrect Romanian diacritics must create High severity
  terminology issues.
- Rejected terms must create Critical terminology issues.
- Only authorized human users may validate, suspend, archive, or reject
  terminology.
- Repeated usage must not auto-promote terminology.
- `VALIDATED` terminology remains authoritative over Translation Memory and AI
  suggestions.
- Documents with rejected terminology or unresolved High/Critical terminology
  issues must not move to `READY_FOR_EXPORT` or `EXPORTED`.
- Every terminology governance action must be audited.

### Authority Confidence Level Directive

Purpose:

- Rank documented source authorities when translation rules, terminology rules,
  editorial rules, semantic fidelity rules, or exceptions have conflicting
  sources.

Rules:

- `PRIMARY_AUTHORITY` has priority over `SECONDARY_AUTHORITY`.
- `SECONDARY_AUTHORITY` has priority over `EDITORIAL_AUTHORITY`.
- `EDITORIAL_AUTHORITY` has priority over `TEMPORARY_AUTHORITY`.
- `TEMPORARY_AUTHORITY` cannot validate a permanent rule.
- Conflicting authorities must be flagged for authorized human review.
- AI output cannot be a source authority or authority confidence level.
- Authority confidence must be auditable and immutable per rule version.
- Impact Analysis must include authority confidence level.
- Backend implementation is not authorized until rule/source authority models
  are explicitly scheduled.

### Magazine Platform Vision Directive

Purpose:

- Reserve a future publication experience for digital magazines without
  expanding the current MVP implementation scope.

Rules:

- Magazine Platform Vision is documentation-only until explicitly promoted in
  `ROADMAP.md`.
- Original language must remain configurable per publication and must never be
  hard-coded.
- Every translated article, manuscript, audio version, and future magazine
  edition must remain linked to the same original publication.
- Translation alignment for magazine content must remain auditable through JSON
  Master references.
- M1 Digital Magazine MVP is `PLANNED` with `POST-BETA` priority.
- M2 Advanced Reading is `PLANNED` with `POST-BETA` priority.
- M3 Interactive Magazine is `PLANNED` with `FUTURE` priority.
- M4 Enterprise Magazine is `FUTURE` with `LONG_TERM` priority.
- No code, UI, API, database schema, migrations, or infrastructure work is
  authorized for Magazine Platform Vision until a later implementation phase is
  explicitly approved.

### Phase 2 Planning Foundation Directive

Purpose:

- Reserve the next editorial intelligence, production, media, narration, and
  platform coordination capabilities without changing Phase 1 runtime behavior.

Rules:

- Phase 2 Planning Foundation is documentation and architecture scaffolding
  only until individual modules are explicitly scheduled in `ROADMAP.md`.
- No runtime API, database schema, migration, UI, staging Docker, Auth,
  Projects, Documents, Segments, Translations, QA, Semantic Fidelity, Workflow,
  or Export logic changes are authorized by this directive.
- The approved Phase 2 planning modules are:
  - Lexicographic Intelligence Agent.
  - Layout & Editorial Production Agent.
  - AI Video & Visual Creation Agent.
  - Audio Narration Agent.
  - Platform Engineering, Optimization & Coordination Agent.
  - AI Orchestrator.
- AI may suggest, automate drafts, coordinate tasks, and prepare outputs, but
  authorized human roles keep final approval authority.
- Every Phase 2 agent action must be auditable, including inputs, outputs,
  dependencies, cost metadata when available, approvals, rejections, and
  generated artifacts.
- The AI Orchestrator may coordinate execution order, dependencies, cost
  controls, audit trails, and human approval gates, but it must not bypass
  security, tenant isolation, workflow gates, terminology governance, or human
  final authority.
- JSON Master Format may reserve future fields for dictionaries, layout,
  visual assets, audio tracks, video assets, production profiles, and agent
  executions, but those fields do not authorize runtime implementation by
  themselves.

### AI Agent Governance & Quality Agent Directive

Purpose:

- Define the final governance model for AI agents and add Quality Agent as a
  validation-only agent within the existing orchestration architecture.

Rules:

- Every AI agent must define mission, responsibilities, collaboration, limits,
  and authority.
- Agents may exchange information, request assistance, reuse results, notify
  other agents, and coordinate through the Coordinator Agent.
- There are no communication restrictions between agents.
- Each agent has final AI responsibility only within its own specialization.
- Human approval always overrides every AI decision.
- No AI agent may publish automatically, approve automatically, grant rights,
  bypass workflow, modify security, or change governance.
- Quality Agent verifies editorial consistency, metadata, missing assets,
  exports, accessibility, links, publication readiness, and distribution
  readiness.
- Quality Agent reports issues only. It must not translate, review, edit,
  illustrate, publish, approve, or correct the project.
- Quality Agent is a governance refinement in existing AI Governance,
  Marketplace, and Platform Engineering orchestration. It is not a new
  enterprise module.

### Complete AI Agent Roles, Subagents & Parallel Review Directive

Purpose:

- Complete AI agent role definitions, specialized subagent relationships, and
  the multilingual parallel review interface without creating new enterprise
  modules.

Rules:

- The 18 principal agents remain the only principal AI agent roles.
- Specialized subagents are scoped under their parent agents and do not replace
  parent responsibility.
- Approved subagents are:
  - Terminology & Lexicography Subagent under Translation Agent.
  - Semantic Fidelity Subagent under Translation Agent.
  - Editorial Decision Subagent under Review Agent.
  - Planning & Coordination Subagent under Coordinator Agent.
  - Media Localization Subagent under Audio Agent and Video Agent.
  - Platform Engineering Subagent under Evolution Agent.
- Review Agent must identify issues, explain them, propose replacement
  variants, and preserve current text until an authorized human accepts a
  proposal.
- Review proposals must support `PENDING`, `ACCEPTED`, and `REJECTED` states,
  individual accept/reject decisions, audit trail, and version history.
- The default review interface is two columns: original text and current
  translation.
- Optional comparison modes may show three or four columns for additional
  languages, versions, or comparison texts.
- Original text is immutable, translation is unchanged until acceptance, and
  accepted/rejected proposals must be auditable.
- Quality Agent readiness statuses are `READY`, `READY_WITH_WARNINGS`, and
  `BLOCKED`.
- No AI agent or subagent may bypass workflow, remove audit history, publish
  automatically, change rights/security outside authority, or perform another
  agent's specialized responsibility.

### Integrated Linguistic Knowledge Base Directive

Purpose:

- Provide a central, project-level linguistic knowledge base through existing
  Lexicographic Intelligence, Terminology, Semantic Fidelity, Translation,
  Review, Documentation, Rights, Quality, Audit, and AI Governance
  infrastructure.

Rules:

- This is not a new enterprise module and must not duplicate existing
  Lexicographic, Terminology, Research, Rights, or Quality infrastructure.
- Linguistic resources may include monolingual dictionaries, bilingual
  dictionaries, orthographic/orthoepic/morphological dictionaries, grammar and
  punctuation rules, idioms, phraseological expressions, specialized
  glossaries, terminology databases, editorial guides, corpora, and usage
  examples.
- Every resource must preserve language, language pair when bilingual, title,
  publisher or institution, edition, publication year, version, source URL or
  imported document reference, license status, copyright holder, redistribution
  permission, authority level, domain, effective date, last verification date,
  and enabled status.
- `INTEGRATED_CONTENT` may store searchable content only when license and
  redistribution metadata permit internal ingestion.
- `EXTERNAL_CONTROLLED_ACCESS` must store metadata, official links, authorized
  integration references, permitted excerpts, access restrictions, and license
  notes only.
- Full copyrighted dictionary content must never be ingested without documented
  authorization.
- Romanian linguistic sources such as DOOM, DEX-type explanatory resources,
  official grammar, orthographic and punctuation rules, bilingual dictionaries,
  phraseological dictionaries, and specialized dictionaries are configurable
  metadata sources. Copyrighted content must not be hardcoded.
- Source authority levels are `OFFICIAL_NORMATIVE`, `ACADEMIC`,
  `VALIDATED_SPECIALIZED`, `EDITORIAL_GUIDE`, `DESCRIPTIVE`, and
  `INFORMATIVE`.
- Normative sources take priority for orthography and grammar; validated
  specialized sources may take priority for domain terminology.
- Source conflicts must be reported for authorized human review. No silent
  replacement is allowed.
- Translation Agent, Review Agent, Documentation Agent, Rights & Provenance
  Agent, Quality Agent, Terminology & Lexicography Subagent, and Semantic
  Fidelity Subagent must use the knowledge base within their existing
  specialization and may not bypass human final authority.
- Audit must cover resource added, resource updated, license changed, entry
  imported, source consulted, terminology decision, dictionary conflict, human
  override, and resource disabled events.

### Advanced Linguistic Resources & Translation Memory Directive

Purpose:

- Complete the existing Linguistic Knowledge Base with configurable source
  priority, integrated Translation Memory, glossary hierarchy, transparent
  confidence scoring, and auditability.

Rules:

- This extends existing Linguistic Knowledge Base, Translation, Terminology &
  Lexicography, Semantic Fidelity, Review, AI Governance, and Audit
  infrastructure. It is not a new enterprise module.
- Each project may define source consultation priority. The default order is
  official normative source, project glossary, specialized glossary,
  Translation Memory, bilingual dictionary, explanatory dictionary, and
  corpus/examples.
- Source priority changes must be auditable.
- Translation Memory stores only validated translations as reusable proposal
  evidence.
- Translation Memory entries must preserve source segment, translated segment,
  language pair, project, domain, context, author, reviewer, approval date,
  confidence, and version.
- Translation Memory supports exact match, fuzzy match, and context match.
- Translation Memory must never replace text automatically. It always proposes.
- Glossary hierarchy is Project Glossary > Platform Glossary > Personal
  Glossary.
- Personal Glossary entries are optional suggestions only and must not override
  project or platform glossary decisions.
- Glossary conflicts require authorized human review and audit.
- Every linguistic proposal must expose confidence score, consulted sources,
  glossary used, Translation Memory match, terminology status, semantic
  validation, and explanation.
- Audit must cover glossary created, glossary updated, glossary conflict,
  Translation Memory entry added, Translation Memory reused, source priority
  changed, and confidence recalculated.

### Platform-Wide Need-to-Know Access Model Directive

Purpose:

- Apply contextual, role-based, task-based, and scope-based visibility across
  the entire platform while reusing existing IAM, RBAC, project roles, document
  permissions, audit, workspace, and AI governance.

Rules:

- This is a Workspace/IAM refinement, not a new enterprise module.
- Every user must see only information, documents, panels, tools, and actions
  required for the current role, project, assigned task, assigned document,
  manuscript, chapter, section, segment, workflow stage, explicit grant, and
  confidentiality classification.
- The most restrictive valid rule wins.
- Hidden data and restricted metadata must not be loaded or returned through
  APIs for unauthorized users.
- Collaborators receive access through an invitation flow that defines person,
  role, scope, permitted tools, expiry when temporary, reason, granting user,
  preview, and confirmation.
- Temporary access must expire automatically and revocation must be immediate
  across active sessions as implementation allows.
- Translators may see assigned source text, target translation fields,
  linguistic resources, glossaries, terminology decisions, and assigned
  comments.
- Reviewers may see assigned source text, translations, review proposals,
  comments, and relevant version history.
- Layout specialists may see validated text, styles, illustrations, layout
  assets, and publication specifications.
- Illustrators may see assigned fragments, briefs, approved references, and
  relevant assets.
- Audio/video collaborators may see validated text, assigned chapters,
  pronunciation/localization information, and approved media assets.
- Unrelated contracts, financial data, rights negotiations, administration
  data, distribution credentials, and private internal discussions must remain
  hidden unless explicitly authorized.
- Need-to-know enforcement must be server-side for projects, manuscripts,
  document sections, comments, versions, linguistic sources, rights records,
  media assets, exports, publishing, distribution, administration, and agent
  execution records.
- AI agents receive minimum necessary data only and may not expand their own
  access.
- Audit must cover invitation sent and accepted, access granted, changed,
  revoked, temporary access expired, restricted access attempt, document opened,
  confidential resource accessed, AI agent data access, and human override.

### Editorial Workspace Final Directive

Purpose:

- Make the Editorial Workspace the primary production environment while reusing
  existing modules and preserving a clean, individual-first workflow that can
  become collaborative instantly.

Rules:

- This is a frontend orchestration and workspace refinement, not a new
  enterprise backend module.
- The manuscript remains the central working object.
- The same Editorial Workspace must support Book, Children's Book, Magazine,
  Poetry, Dictionary, Course, Audiobook, and Video projects.
- Do not create separate production workspaces for writing, translation,
  review, illustration, layout, magazine production, publishing preparation, or
  distribution. Existing module pages may remain as tools opened from the
  unified workspace.
- Common editorial actions should be reachable in 2-3 clicks where practical.
- Only relevant tools should appear for the current role, project, assignment,
  task, and workflow state.
- Collaboration must activate through invitation, role assignment, chapter or
  segment scope, comments, mentions, suggestions, accept/reject, synchronized
  updates, audit, and version history without making individual work slower.
- Useful production functions inspired by Adobe InDesign may be modeled, but
  Adobe UI must not be reproduced.
- Publication format changes should adapt layout, templates, styles, guides,
  image placement, page numbering, export settings, and previews without manual
  reconstruction.
- Human Final Authority remains required. AI may suggest, preview, summarize,
  and detect blockers, but it must not approve, publish, grant rights, or
  bypass workflow.

### Administration Review and Simplification Directive

Purpose:

- Keep Administration as a platform configuration center, not a daily editorial
  workspace.

Rules:

- This is a frontend simplification and governance refinement, not a new
  enterprise module.
- Administration navigation must remain simple, logical, and limited to a
  maximum of two levels.
- Do not duplicate administration options across multiple admin surfaces.
- Administrator roles may see all administration sections.
- Editors and production users should work in production workspaces rather than
  Administration.
- Administration sections cover organization, users, roles and permissions, AI
  agents, linguistic resources, editorial templates, publishing and
  distribution, security, audit and backup, integrations, and system health.
- Each section must include short explanatory text.
- All administration changes must be reversible where possible and audited.
- Critical changes must require explicit confirmation.

### Roles, Permissions and Subscription Entitlements Directive

Purpose:

- Separate operational editorial authority from commercial subscription plans
  and finalize the effective access model.

Rules:

- Effective access is `Role permissions × Subscription entitlements ×
  Need-to-Know scope`.
- A user may perform an action only when the assigned role permits it, the
  subscription plan includes the required feature or quota, and the user has
  access to the relevant project, document, chapter, section, or segment.
- Editorial roles and subscription plans must never be treated as the same
  concept.
- Official roles are Administrator, Project Manager, Editor, Translator,
  Reviewer, Designer, Audio Narrator, Author, Collaborator, Reader, and Guest.
- Subscription plans are `FREE`, `BASIC`, `PREMIUM`, `BUSINESS`, and
  `ENTERPRISE_RESERVED`.
- `ENTERPRISE_RESERVED` remains disabled until explicitly activated later.
- Plan limits must not destroy data, remove existing work, or delete
  collaborators. They may block only restricted new actions.
- Downgrades preserve content, audit, versions, projects, files, and
  collaborators, and mark over-limit resources read-only where needed.
- Account owners may manage subscription and billing-related settings but may
  not bypass rights restrictions, workflow blocks, audit, security policies, or
  explicit legal restrictions.
- Administration must clearly separate Users and Roles from Subscription and
  Usage.
- Role assignments, subscription changes, quota exceeded events, feature
  blocks, upgrades, downgrades, temporary access changes, and permitted human
  overrides must be audited.

### Unified Language Management Directive

Purpose:

- Centralize platform language, original publication language, authoring
  language, target translation languages, language resources, AI conversation
  language, review comparison language columns, and language audit.

Rules:

- Every module must use one centralized Language Management model.
- No duplicate language settings may be introduced in Projects, Translation,
  Review, Workspace, AI Governance, Linguistic Knowledge Base,
  Administration, Audit, Publishing, Distribution, or Public Portal metadata.
- The four official language attributes are `platformLanguage`,
  `originalLanguage`, `authoringLanguage`, and `targetLanguage`.
- `platformLanguage` controls UI labels, menus, administration, dashboard,
  workflow names, AI conversations, notifications, dialogs, and workspace
  text.
- Changing `platformLanguage` must not change `originalLanguage`,
  `authoringLanguage`, or `targetLanguage`.
- `originalLanguage` is immutable after project creation unless an authorized
  user explicitly changes it.
- `authoringLanguage` supports multilingual manuscript authoring.
- Projects may have one Original Language, one Authoring Language, and one or
  more Target Languages.
- Translation uses Original Language to Target Language. Documentation and
  Review explanations use Platform Language.
- AI agents communicate with the user in Platform Language and may not change
  language configuration by themselves.
- Parallel review defaults to Original and Translation columns and may support
  three or four columns, each with independently selected language and version.
- The Linguistic Knowledge Base loads dictionaries, glossaries, terminology,
  phraseology, and linguistic resources by Source Language to Target Language.
- Administration owns installed languages, enabled languages, default Platform
  Language, fallback, translation completeness, linguistic resources,
  dictionaries, and glossaries as central configuration.
- Audit must cover Platform Language changed, Original Language changed,
  Authoring Language changed, Target Language added, Target Language removed,
  and language resources updated.

### Organization, Teams and Platform Creator Directive

Purpose:

- Finalize the organizational model with a simple, scalable structure that
  reuses Administration, Users, Roles, Permissions, Need-to-Know access, and
  Audit.

Rules:

- This is an Administration and access-governance refinement, not a new
  enterprise module.
- Supported organization types are `PERSOANA_FIZICA`, `EDITURA`,
  `ASOCIATIE_ONG`, `COMPANIE`, and `INSTITUTIE`.
- `PERSOANA_FIZICA` remains the default organization type.
- Organizations may create teams and sub-assign projects, tasks, documents,
  and workflow responsibilities to teams.
- Default teams are Translation, Review, Layout, Illustrations, Multimedia,
  Publishing, Marketing, and Advertising.
- `PLATFORM_CREATOR` / `Creatorul platformei` is a unique protected system
  role for platform ownership, development, maintenance, testing, and
  configuration.
- `PLATFORM_CREATOR` is separate from `ADMIN`, cannot be removed, downgraded,
  assigned to normal users, modified by other administrators, or limited by
  subscription plans.
- Administrator users may manage organization profile, organization type,
  teams, members, and invitations.
- Creator access and all organization/team/member changes must be audited.

### AI Providers & Cost Management Directive

Purpose:

- Finalize provider fallback, model selection, subscription-aware AI usage,
  budget governance, and administrative monitoring through existing AI
  Governance, AI Orchestrator, Administration, Subscription Plans, Audit,
  Organization Management, and Workspace infrastructure.

Rules:

- This is an AI Governance and Administration refinement, not a new enterprise
  module.
- Supported v1.0 providers are OpenAI as primary provider and Anthropic as
  fallback provider.
- Provider architecture must remain extensible for future providers without
  major code changes.
- OpenAI is the default provider. If it times out, is unavailable, returns an
  API error, or is placed in configured outage, the platform may automatically
  switch to Anthropic.
- When OpenAI becomes available again, the platform may automatically recover
  to OpenAI.
- Provider changes, fallback activation, and fallback recovery must be audited.
- Model selection is automatic by default. Manual model selection is available
  only when role and subscription entitlement permit it.
- Subscription plans for v1.0 are `FREE`, `BASIC`, `PREMIUM`, and `BUSINESS`.
  `ENTERPRISE_RESERVED` remains disabled unless explicitly activated later.
- Subscription may control AI access, quotas, collaborators, projects, storage,
  exports, advanced AI capabilities, and team functionality.
- AI budgets may be tracked for user, project, and organization scopes.
- Cost monitoring tracks estimated cost, actual cost, monthly consumption,
  consumption by AI agent, and consumption by project.
- Budget warning thresholds are 80%, 90%, and 100%.
- Reaching a limit must never delete data. It may block only the restricted AI
  action until quota reset or subscription upgrade.
- `PLATFORM_CREATOR` remains unrestricted for AI access, testing, and
  monitoring regardless of subscription plan.
- Administration must display configured providers, active provider, fallback
  status, consumption, monthly budget, remaining budget, and AI usage history.
- Audit must cover provider changed, fallback activated, fallback recovered,
  budget warning, budget exceeded, AI blocked, subscription upgraded, and
  subscription downgraded.

### Integrations and AI Agent Architecture Directive

Purpose:

- Define the mandatory provider-agnostic AI integration model, orchestration
  boundary, provider adapter strategy, prompt governance, context management,
  audit, observability, security, privacy, cost control, and resilience rules
  for all current and future AI capabilities.

Rules:

- Chapter 7 - Integrations and AI Agent Architecture is the official authority
  for AI and external provider integration.
- No functional module may communicate directly with an external AI provider.
- All AI calls must pass through the AI Orchestration Service.
- Modules request platform capabilities, not provider-specific SDK methods or
  model-specific APIs.
- Provider-specific code is allowed only inside approved provider adapters.
- Providers must be interchangeable through normalized request, response,
  error, health, cost, and privacy contracts.
- Production prompts must be centralized, versioned, auditable, and selected by
  orchestration. Prompts must not be embedded directly in functional modules.
- AI context must be assembled centrally and filtered by tenant isolation,
  role permissions, subscription entitlements, Need-to-Know scope, privacy
  classification, language policy, rights metadata, and provider policy.
- Every AI execution must record user, organization, calling module,
  capability, provider, model, prompt version, routing policy version,
  duration, estimated cost, result reference, error state, approval state, and
  audit metadata.
- AI observability must track requests, latency, errors, retries, fallback,
  circuit breaker state, queue depth, cost, and usage by module, provider,
  capability, project, user, and organization.
- Cost and quota checks must happen before external provider execution when
  real provider adapters are enabled.
- Sensitive data must not be sent to external providers without an explicit
  approved policy.
- AI may recommend, explain, draft, summarize, classify, and validate, but it
  must not approve, publish, grant rights, bypass workflow, modify security, or
  change governance.
- Direct provider SDK integrations are not authorized until orchestration,
  prompt governance, security filtering, cost enforcement, observability, and
  audit boundaries are implemented.
- Validated Phase 7 Step 16 behavior must be preserved.

### Workflow Engine and Editorial Process Architecture Directive

Purpose:

- Define Workflow Engine as the mandatory coordination layer for editorial and
  administrative processes, including workflow definitions, workflow versions,
  instances, stages, transitions, tasks, assignments, approvals, notifications,
  deadlines, events, automation, escalation, Work Table execution, audit,
  observability, and RBAC-based execution.

Rules:

- Chapter 8 - Workflow Engine and Editorial Process Architecture is the
  official authority for workflow and process coordination.
- Workflow Engine coordinates processes. Domain modules retain ownership of
  their domain validation rules.
- Generic workflow logic must not be duplicated across modules.
- Workflow definitions must be versioned.
- Workflow versions are immutable after activation.
- Workflow instances must remain bound to the workflow version with which they
  were created.
- Work Table is the user-facing execution surface for workflow tasks. It is
  not a separate workflow engine.
- Workflow Engine must use Scheduling and Agenda for deadlines, meetings,
  notifications, recurrences, and editorial calendars. It must not implement a
  separate calendar.
- Workflow Engine may request AI assistance only through AI Orchestration.
- AI may recommend, summarize, classify, and detect blockers, but it must not
  approve, publish, grant rights, bypass workflow, modify security, or change
  governance.
- Workflow actions must be authorized server-side through central RBAC,
  subscription entitlements where applicable, and Need-to-Know scope.
- Workflow audit must cover definition changes, version creation, instance
  changes, stage changes, transitions, assignments, approvals, rejections,
  tasks, deadlines, notifications, AI execution requests, automation,
  escalations, and manual overrides.
- Workflow observability must track stage duration, average execution time,
  bottlenecks, pending tasks, overdue tasks, SLA status, approval latency,
  AI usage triggered by workflow, and blocked workflow count.
- Structural workflow changes require a baseline audit, gap analysis,
  dependency map, and incremental migration plan before implementation.
- Validated Phase 7 Step 16 behavior must be preserved.

### Security, Identity and Governance Architecture Directive

Purpose:

- Define the mandatory security, identity, access, IAM, workspace isolation,
  policy, secret management, data classification, audit, compliance, AI
  governance, monitoring, recovery, and operational governance architecture for
  the entire platform.

Rules:

- Chapter 9 - Security, Identity, and Governance Architecture is the official
  authority for security, identity, access, and governance.
- IAM is the only official source for identity.
- No module may implement its own authentication or authorization system.
- Protected requests must use server-derived authenticated context only.
- Client-provided user IDs, organization IDs, roles, permissions, tenant IDs,
  or workspace IDs must not be trusted for authorization.
- Authorization must be explicit and must evaluate role permissions,
  workspace, organization, resource ownership, resource state, organization
  policies, subscription entitlements where applicable, Need-to-Know scope,
  data classification, and audit requirements.
- No operation may be authorized solely because a user has a role.
- Workspaces are the primary data isolation boundary for future alignment.
- Local workspace policies may increase security but must not reduce the
  platform minimum security baseline.
- Permissions must evolve toward a complete atomic permission catalog.
- Secrets must not be stored in source code, logs, traces, client bundles, or
  exported project data.
- API security must include authentication, authorization, rate limiting,
  input validation, documented CORS policy, CSRF protection where applicable,
  safe errors, and security headers.
- Data must be classified as `PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, or
  `RESTRICTED`; classification must influence access, AI eligibility, export,
  backup, retention, and audit.
- Audit must cover authentication, failures, changes, approvals, AI
  executions, permission changes, role changes, publishing, deletion,
  sensitive resource access, restricted access attempts, policy changes, and
  compliance exceptions.
- AI interactions must comply with Chapter 7 and must preserve user, prompt,
  prompt version, model, provider, cost, result reference, human approval
  status where required, and audit reference.
- Security events must integrate with Observability.
- Structural security changes require a baseline audit, gap analysis,
  dependency map, and incremental migration plan before implementation.
- Validated Phase 7 Step 16 behavior must be preserved.

### Integration and Interoperability Architecture Directive

Purpose:

- Define the mandatory integration, interoperability, API contract, adapter,
  webhook, event, import/export, security, observability, and provider
  independence architecture for the entire platform.

Rules:

- Chapter 10 - Integration and Interoperability Architecture is the official
  authority for integration and interoperability.
- Integration Gateway is the approved external communication boundary.
- Business modules must not communicate directly with external systems.
- Business modules must not depend on provider SDKs, provider-specific
  payloads, provider-specific errors, or provider secrets.
- Every external system must use a dedicated adapter registered through the
  Integration Layer.
- Every stable integration must define a contract before implementation.
- Public APIs must be explicitly versioned, documented, authenticated,
  authorized, rate limited, validated, observable, and audited when state
  changes occur.
- Internal APIs must preserve module ownership boundaries. A module must not
  access another module's private persistence or implementation details.
- Events and webhook payloads must be documented and versioned.
- Webhooks must use authentication, signature verification, replay protection,
  retry policy, delivery logging, observability, tenant awareness, and audit.
- Import and export operations must be authenticated, authorized, validated,
  audited, observable, tenant-aware, and JSON Master compatible when
  applicable.
- Integration errors must use timeout, controlled retry, circuit breaker,
  fallback, standardized errors, correlation IDs, and safe user-facing
  messages.
- Integration secrets must not be stored in source code, logs, traces, client
  bundles, export artifacts, JSON Master data, or webhook delivery logs.
- AI may suggest integration configuration, but AI may not enable providers,
  create active secrets, approve external access, or bypass human final
  authority.
- Structural integration changes require a baseline audit, gap analysis,
  dependency map, and incremental migration plan before implementation.
- Validated Phase 7 Step 16 behavior must be preserved.

### Frontend and Design System Architecture Directive

Purpose:

- Define the mandatory frontend, Application Shell, routing, layout, component,
  Design System, i18n, accessibility, responsive, PWA, state management,
  backend communication, error handling, theme, performance, and frontend
  observability architecture for the entire platform.

Rules:

- Chapter 11 - Frontend and Design System Architecture is the official
  authority for frontend architecture and Design System work.
- The approved frontend layers are Application Shell, Routing Layer, Layouts,
  Pages, Feature Components, Shared Components, and Design System.
- All visual components must belong to the Design System or derive from it.
- Isolated or inconsistent visual components are not allowed.
- User-visible text, including labels, messages, helper text, loading states,
  empty states, error states, and ARIA labels, must use i18n resources.
- Initial UI languages are Romanian, English, Spanish, French, Portuguese,
  Italian, and German.
- Changing Platform Language must not change Original Language, Authoring
  Language, or Target Language.
- Frontend must target WCAG 2.2 AA.
- Frontend must support desktop, laptop, tablet, and mobile form factors.
- PWA behavior must preserve security, data classification, tenant isolation,
  and offline safety.
- Backend communication must use centralized reusable API clients. Scattered
  HTTP calls inside visual components are not allowed.
- Frontend state must distinguish UI State, Session State, Domain State,
  Server State, and Cache State.
- Themes must be implemented through Design System tokens.
- Frontend observability must respect privacy, data classification, and
  Need-to-Know constraints.
- Structural frontend changes require a baseline audit, gap analysis,
  component inventory, dependency map, and incremental migration plan before
  implementation.
- Validated Phase 7 Step 16 behavior must be preserved.

### Backend and Application Services Architecture Directive

Purpose:

- Define the mandatory backend, application service, domain, contract, API,
  validation, transaction, eventing, messaging, background job, cache,
  security, observability, and code organization architecture for the entire
  platform.

Rules:

- Chapter 12 - Backend and Application Services Architecture is the official
  authority for backend structure and application services.
- The backend remains a modular monolith until an explicit future extraction
  phase is approved.
- Backend dependencies must move toward Delivery/API, Application, Domain,
  Ports, Infrastructure Adapters, and Database/External Services.
- Controllers must not contain business logic.
- State-changing business operations must be represented as explicit use
  cases or command operations.
- Read operations must be represented as explicit query operations where
  practical.
- Domain rules must remain independent from NestJS, persistence, provider
  SDKs, filesystem access, and external services.
- Module communication must occur through documented public contracts,
  commands, queries, events, ports, or read models.
- Internal domain entities must not become external API contracts.
- Stable APIs must converge toward versioned contracts and operation-specific
  DTOs.
- Authorization must be enforced inside application services and use cases,
  not only controllers or frontend visibility.
- Every operation must preserve organization, workspace, role, subscription,
  Need-to-Know, resource-state, and policy context where applicable.
- Critical state changes must define transaction boundaries and must use
  idempotency and Outbox patterns when external side effects require reliable
  publication.
- Long-running operations must move toward recoverable background jobs with
  progress, retries, cancellation, and restart recovery.
- Cache must never be the source of truth and must define key scope, TTL,
  invalidation, and tenant safety.
- External providers and AI providers must be accessed only through Chapter 10
  adapters and AI Orchestration ports.
- Audit and observability remain separate concerns but must be correlatable.
- Structural backend changes require repository inspection, backend inventory,
  dependency mapping, gap analysis, risk classification, and incremental
  migration planning before implementation.
- Validated Phase 7 Step 16 behavior must be preserved.

### DevOps, Infrastructure, Deployment, and Recovery Architecture Directive

Purpose:

- Define the mandatory infrastructure, DevOps, CI/CD, deployment,
  environment, configuration, secret management, backup, disaster recovery,
  operational observability, release, rollback, and operations architecture
  for the entire platform.

Rules:

- Chapter 13 - DevOps, Infrastructure, Deployment, and Recovery Architecture
  is the official authority for operational architecture.
- Infrastructure must be managed as code where practical.
- Deployments must be reproducible, validated, and rollback-capable.
- No version may reach production without passing the official pipeline.
- `main` must contain stable versions only in controlled environments.
- Integration must occur through Pull Requests and automated validation.
- CI must validate code, tests, builds, migrations/runtime data where
  applicable, documentation, infrastructure syntax, Docker Compose
  configuration, and secrets scanning.
- CD must deploy through controlled environments with staging validation and
  explicit human approval before production.
- Artifacts must be immutable, versioned, and traceable to Git commits.
- Environment differences must be handled through external configuration and
  secrets, not environment-specific application code.
- Secrets must not be committed, logged, embedded in images, exposed in client
  bundles, or exported through project data.
- Backups must be encrypted where applicable, periodically tested, monitored,
  and restore-validated.
- Disaster recovery must define RPO, RTO, restore procedures, validation,
  responsibilities, and communication.
- Operational observability must cover uptime, resources, latency, errors,
  queues, database, cache, AI, Workflow, integrations, backups, and deployment
  health.
- Deployment architecture must prepare for rollback, blue/green deployment,
  rolling updates, and post-deployment checks.
- Structural infrastructure changes require current infrastructure inventory,
  pipeline review, container inventory, secret review, backup/DR review,
  observability review, gap analysis, risk assessment, and migration planning
  before implementation.
- Validated Phase 7 Step 16 behavior must be preserved.

### Quality Architecture and Testing Strategy Directive

Purpose:

- Define the mandatory quality, testing, Quality Gate, coverage, security
  testing, accessibility testing, performance testing, AI validation,
  regression, smoke testing, defect management, and release validation
  architecture for the entire platform.

Rules:

- Chapter 14 - Quality Architecture and Testing Strategy is the official
  authority for quality and testing.
- Quality must be designed into every module, workflow, API, frontend route,
  database change, AI agent, integration, and release process.
- The official test pyramid prioritizes unit tests, then integration tests,
  then UI tests.
- Domain tests are the highest-value protection for business rules and must be
  framework-independent where practical.
- Public API, event, DTO, adapter, JSON Master, backup, and runtime database
  contracts must have contract tests.
- Application tests must verify use cases, permissions, transactions,
  orchestration, audit, and event side effects.
- Security tests must cover authentication, RBAC, Need-to-Know,
  workspace/tenant isolation, safe public endpoints, rate limiting, secret
  handling, and safe errors.
- Accessibility testing must target WCAG 2.2 AA.
- AI validation tests must verify prompts, versions, responses, fallback,
  audit, cost, reproducibility, provider independence, and Human Final
  Authority.
- Every fixed defect must create or update a regression test unless the fix is
  documentation-only or a documented exception is approved.
- Test data must be reproducible, versioned, anonymized, and independent from
  production.
- Coverage quality is more important than raw coverage percentage; thresholds
  may be introduced only after baseline measurement.
- Quality Gates must block release when builds, tests, migrations, security
  checks, critical accessibility checks, or critical smoke tests fail.
- Structural quality strategy changes require test inventory, test
  classification, coverage analysis, Quality Gate review, AI/security/
  accessibility/performance test review, gap analysis, risk assessment, and
  migration planning before implementation.
- Validated Phase 7 Step 16 behavior must be preserved.

### Operations, Maintenance and Platform Evolution Directive

Purpose:

- Define the mandatory operational excellence, maintenance, versioning,
  release, incident, KPI, SLA, business continuity, risk, governance, and
  controlled platform evolution architecture for the entire platform.

Rules:

- Chapter 15 - Operations, Maintenance, and Platform Evolution Architecture is
  the official authority for long-term platform operations and evolution.
- Architecture Chapters 0-15 now form the complete high-level architecture
  baseline.
- All platform changes must be controlled, traceable, documented, reversible
  where practical, and compatible with validated Phase 7 Step 16 behavior.
- Platform configuration must be classified, traceable, audited, and versioned
  where practical.
- New functionality must follow controlled feature lifecycle management and
  use feature flags when gradual rollout, beta exposure, operational fallback,
  or controlled disabling is required.
- Platform releases must use Semantic Versioning and include release notes,
  migration guidance when needed, compatibility notes, known issues, commit or
  artifact reference, backup reference, and rollback reference.
- Backward compatibility must be preserved whenever possible. Incompatible
  changes require justification, migration plan, transition period, user or
  operator notification, and rollback or mitigation strategy.
- Deprecated functionality must follow the lifecycle `Supported` ->
  `Deprecated` -> `Removal Planned` -> `Removed`.
- Incidents must be classified as Critical, High, Medium, or Low and must
  preserve impact, cause, mitigation, permanent fix, lessons learned, and
  follow-up actions.
- Operational monitoring must cover uptime, performance, resources, AI,
  Workflow, runtime database, cache when introduced, module usage, errors,
  backup/restore health, and deployment health.
- Operational KPIs must include availability, mean response time, mean time to
  restore, mean time between incidents, deployment success rate, AI execution
  duration, workflow duration, backup success rate, and restore dry-run
  success rate.
- Architecture may evolve only through Architecture Decision Records,
  Architecture Review, Impact Analysis, and Approval Process.
- Future modules, services, AI capabilities, integrations, and production
  operations must comply with Chapters 0-15 before acceptance.
- The next stage after Chapters 0-15 is detailed module specifications and
  controlled implementation, not a new general architecture chapter.

### Phase II Library Module Architecture Directive

Purpose:

- Define Library as the first detailed module specification after completion
  of Architecture Chapters 0-15 and establish it as the Single Source of Truth
  for editorial resources.

Rules:

- Library is the canonical repository for manuscripts, books, magazines,
  articles, images, illustrations, audio, video, translations, publication
  artifacts, source files, metadata, versions, rights, provenance, and
  relationships.
- No editorial object may be introduced as a duplicate repository outside the
  Library model.
- Other modules may operate on editorial resources only through Library
  references or controlled Library service contracts.
- Every Library resource must be metadata-first, versionable, auditable,
  searchable, rights-aware, provenance-aware, and compatible with Need-to-Know
  access.
- Physical files must be managed as Assets or, during migration, existing
  Library publication file records.
- Existing Library reader experience, Intelligent Editorial Library behavior,
  runtime persistence, backup/restore, and Phase 7 Step 16 publishing/
  preflight/distribution behavior must be preserved.
- Current publication lifecycle statuses `STOC_REAL`, `IN_LUCRU`, and
  `PUBLICAT` must be preserved and mapped to canonical Library Item workflow
  status before any future consolidation.
- Future Library work must be additive and must follow
  `docs/modules/library/library-migration-plan.md`.
- Module 2 - Translation Module Architecture is now documented as the next
  Phase II specification after Library.

### Phase II Translation Module Architecture Directive

Purpose:

- Define Translation as the second detailed module specification after Library
  and establish the official rules for source preservation, segmentation,
  Translation Memory, terminology, QA, Semantic Fidelity, Workflow, AI
  assistance, and translation audit.

Rules:

- Translation must preserve original source documents and must never modify
  them directly.
- Every translation must be linked to a Library Item or Library publication
  record during migration.
- Every translation segment must be persistent, auditable, and versionable.
- Translation Memory stores only validated reusable translations and remains
  proposal-only; it must never overwrite target text automatically.
- Validated terminology has priority over Translation Memory and AI
  suggestions.
- AI may suggest, explain, compare, and validate, but it must operate through
  AI orchestration, receive full contextual information, and never approve,
  publish, overwrite validated terminology, or bypass Workflow.
- Translation workflows must use the centralized Workflow Engine and Human
  Final Authority.
- QA and Semantic Fidelity validation must remain connected to segment and
  document translation checks.
- Translation must reuse centralized terminology, glossary, lexicographic,
  language policy, audit, and Library services.
- Translation must not introduce duplicate editorial source repositories
  outside Library.
- Future Translation work must be additive and must follow
  `docs/modules/translation/translation-migration-plan.md`.
- Module 3 - Proofreading and Editorial Review Module Architecture is now
  documented as the next Phase II specification after Translation.

### Phase II Proofreading and Editorial Review Module Architecture Directive

Purpose:

- Define Proofreading and Editorial Review as the third detailed module
  specification after Library and Translation and establish the official rules
  for linguistic validation, style validation, terminology validation,
  comments, correction proposals, editorial decisions, workflow approval, and
  review audit.

Rules:

- Editorial Review must validate linguistic, terminological, stylistic,
  doctrinal, and editorial quality before approval, publication, or
  distribution.
- Review changes must be non-destructive until an authorized human accepts a
  correction proposal.
- AI may propose corrections, explain issues, identify inconsistencies,
  suggest reformulations, and signal editorial risk, but it must never approve
  documents, publish, apply corrections automatically, override validated
  terminology, or bypass Workflow.
- Review must reuse Library, Translation, Terminology, Glossary, QA, Semantic
  Fidelity, Editorial Decisions, Collaboration, Workflow, Audit, and
  Publishing contracts.
- Validated terminology remains authoritative over Translation Memory and AI
  suggestions.
- Comments, observations, correction proposals, approvals, rejections, version
  comparisons, and AI-assisted recommendations must be auditable.
- Editorial Review must not duplicate Translation content ownership, Workflow
  state ownership, Publishing release authority, or Library source-of-truth
  responsibilities.
- Workflow Engine remains responsible for generic transitions and gates.
  Editorial Review may add review-specific observations and decisions without
  creating a competing workflow engine.
- Future Editorial Review work must be additive and must follow
  `docs/modules/editorial-review/editorial-review-migration-plan.md`.
- Module 4 - Publishing Module Architecture is now documented as the next
  Phase II specification after Proofreading and Editorial Review.

### Phase II Publishing Module Architecture Directive

Purpose:

- Define Publishing as the fourth detailed module specification after Library,
  Translation, and Proofreading/Editorial Review and establish the official
  rules for publication generation, editions, immutable published versions,
  multi-format exports, publication profiles, release validation,
  distribution, withdrawal, and publishing audit.

Rules:

- Publishing may publish only approved Library content.
- Publishing is the only controlled mechanism through which an approved
  document becomes an official edition.
- Published official editions are immutable and versioned.
- Corrections to published content require a new version, edition, or
  republication record.
- Publication metadata must come from Library and must not be duplicated as a
  competing source of truth.
- Export owns generated files and format artifacts.
- Rights & Provenance owns rights warnings and publication authorization.
- Workflow Engine owns generic approval and transition gates.
- Public Portal owns public catalog visibility and reader access metadata.
- Commerce owns commercial edition and print/distribution metadata.
- Publishing must not create separate Preflight, Distribution, or Archive
  modules.
- Distribution must be adapter-based, auditable, and must preserve history
  when publication is withdrawn.
- AI may summarize readiness, detect blockers, suggest profiles, suggest
  remediation, and prepare draft packaging metadata, but it must never publish,
  approve, withdraw, distribute automatically, bypass rights, bypass Workflow,
  or modify immutable published editions.
- Future Publishing work must be additive and must follow
  `docs/modules/publishing/publishing-migration-plan.md`.
- Module 5 - Rights and Provenance Module Architecture is now documented as
  the next Phase II specification after Publishing.

### Phase II Rights and Provenance Module Architecture Directive

Purpose:

- Define Rights and Provenance as the fifth detailed module specification
  after Library, Translation, Proofreading/Editorial Review, and Publishing
  and establish the official rules for intellectual property, copyright,
  translation rights, publishing rights, licenses, contracts, provenance,
  restrictions, legal history, compliance validation, and rights audit.

Rules:

- Every Library Item must have verifiable provenance before publication.
- Every legal right must be explicitly represented and auditable.
- Contracts and licenses must be linked to resources and must be versioned.
- Missing, expired, revoked, or incompatible rights must block publication and
  distribution.
- Rights and Provenance owns rights records, rights holders, licenses,
  contract metadata, restrictions, provenance validation, legal history, and
  rights validation verdicts.
- Library owns resource identity and stores contract files as assets.
- Publishing, Translation, Audio, Video, Public Portal, Commerce, and Quality
  must consume rights validation through public Rights contracts.
- No module may implement an independent rights system.
- Legal history must be immutable. Corrections, amendments, renewals,
  revocations, and transfers must create auditable records or versions.
- AI may summarize agreements, detect missing permissions, detect expired
  permissions, and identify missing provenance, but it must never approve
  agreements, authorize translations, authorize publication, revoke rights,
  transfer rights, modify validated provenance automatically, or bypass Human
  Final Authority.
- Future Rights and Provenance work must be additive and must follow
  `docs/modules/rights/rights-migration-plan.md`.
- Module 6 - Magazine Module Architecture is now documented as the next Phase
  II specification after Rights and Provenance.

### Phase II Magazine Module Architecture Directive

Purpose:

- Define Magazine as the sixth detailed module specification after Library,
  Translation, Proofreading/Editorial Review, Publishing, and Rights and
  Provenance and establish the official rules for periodical publications,
  volumes, issues, sections, article assignment, reusable content, issue
  layout, publication handoff, archive, distribution readiness, and magazine
  audit.

Rules:

- Every magazine article must be represented as an independent Library Item.
- Articles may be reused across issues and publications only through
  references. Editorial content must not be duplicated across issues.
- Magazine issues must be versioned and auditable.
- Issue layout must remain decoupled from article content and must not mutate
  article body text or Library records.
- Article translation must use the Translation Module.
- Article approval must use the Editorial Review Module.
- Rights validation must use Rights and Provenance.
- Official issue publication must be delegated exclusively to the Publishing
  Module.
- Magazine assets such as images, illustrations, covers, PDFs, and source
  files must remain managed through Library references.
- Magazine must not create independent publishing, rights, translation,
  review, or asset repositories.
- Future Magazine work must be additive and must follow
  `docs/modules/magazine/magazine-migration-plan.md`.
- Module 7 - AI Orchestration and Editorial Agents Module Architecture is now
  documented as the next Phase II specification after Magazine.

### Phase II AI Orchestration and Editorial Agents Module Architecture Directive

Purpose:

- Define AI Orchestration and Editorial Agents as the seventh detailed module
  specification after Library, Translation, Proofreading/Editorial Review,
  Publishing, Rights and Provenance, and Magazine and establish the official
  rules for centralized AI task execution, agent registry, context building,
  prompt building, model routing, validation, observability, cost governance,
  human review handoff, and audit.

Rules:

- No functional module may communicate directly with an external AI provider.
- Every AI request must pass through AI Orchestration.
- AI Orchestration is the only approved runtime boundary between platform
  modules and provider adapters.
- Context packages must be built from authorized sources only and must obey
  server-side authentication, tenant isolation, RBAC, Need-to-Know access,
  rights restrictions, workflow state, and privacy filtering.
- Prompts must be centralized, versioned, auditable, and selected through the
  orchestrator. Production prompts must not be hardcoded in functional
  modules.
- Provider and model routing must be policy-driven, cost-aware, replaceable,
  observable, and auditable.
- Agent registry and agent chains must be reusable, versioned, governed,
  auditable, and subject to Human Final Authority.
- AI output must be validated before being returned to functional modules.
- AI may propose, analyze, synthesize, classify, draft, and explain, but it
  must never publish, approve editorial decisions, modify rights, modify
  permissions, validate legal status, alter security, change governance, or
  bypass workflow.
- AI executions must record model, model version, prompt version, context
  references, duration, token usage, estimated cost, result, errors,
  validation status, audit references, and observability traces.
- Future AI Orchestration work must be additive and must follow
  `docs/modules/ai-orchestration/ai-migration-plan.md`.
- Module 8 - Audio and Narration Module Architecture is now documented as the
  next Phase II specification after AI Orchestration and Editorial Agents.

### Phase II Audio and Narration Module Architecture Directive

Purpose:

- Define Audio and Narration as the eighth detailed module specification after
  Library, Translation, Proofreading/Editorial Review, Publishing, Rights and
  Provenance, Magazine, and AI Orchestration and establish the official rules
  for narration projects, audio chapters, reusable voice profiles, TTS
  pipeline metadata, human recording metadata, voice cloning governance,
  text-audio synchronization, accessibility, audio publication handoff, and
  audit.

Rules:

- Every audio project must be linked to a Library Item.
- Library source text remains the authoritative source of truth.
- Audio assets are derived resources and must be non-destructive, versioned,
  and auditable.
- Voice profiles must be reusable, versioned, and rights-aware.
- Voice cloning requires documented consent and Rights and Provenance
  validation.
- TTS, transcription, voice generation, and AI-assisted narration must route
  through AI Orchestration. Audio must not call providers directly.
- Segment-level text-audio synchronization must preserve source text version,
  segment IDs, timestamps, confidence, and review status.
- Preview audio is draft-only and must never be published.
- Official audio publication requires approved source text, voice rights,
  publication rights, workflow approval, and Publishing handoff.
- AI may suggest narration, pronunciation, timing, accessibility improvements,
  and voice candidates, but it must not approve, publish, clone voices without
  consent, bypass rights, or bypass workflow.
- Future Audio work must be additive and must follow
  `docs/modules/audio/audio-migration-plan.md`.
- Module 9 - Video and Multimedia Module Architecture is now documented as the
  next Phase II specification after Audio and Narration.

### Phase II Video and Multimedia Module Architecture Directive

Purpose:

- Define Video and Multimedia as the ninth detailed module specification after
  Library, Translation, Proofreading/Editorial Review, Publishing, Rights and
  Provenance, Magazine, AI Orchestration, and Audio and Narration and
  establish the official rules for video projects, scenes, timelines,
  multimedia asset references, captions, synchronization, rendering,
  accessibility, publication handoff, and audit.

Rules:

- Every video project must be linked to a Library Item.
- All multimedia assets must be centrally managed and referenced from Library
  or approved asset modules.
- Video must not duplicate Library text, Audio narration, Translation content,
  or media assets.
- Timeline state must remain independent from source editorial content.
- Scene, timeline, render, caption, and synchronization changes must be
  versioned and auditable.
- Text-audio-video-caption synchronization must preserve source text version,
  segment IDs, scene IDs, timestamps, confidence, and review status.
- Rendering must be asynchronous, scalable, traceable, and non-destructive.
- Preview video is draft-only and must never be published.
- Official video publication requires approved source content, asset rights,
  workflow approval, quality review, rendering review, and Publishing handoff.
- AI-assisted video, captioning, thumbnail, timing, or media generation must
  route through AI Orchestration. Video must not call providers directly.
- AI may suggest visuals, timing, captions, thumbnails, scene structures, and
  platform formats, but it must not approve, publish, bypass rights, bypass
  workflow, or alter source content.
- Future Video work must be additive and must follow
  `docs/modules/video/video-migration-plan.md`.
- Module 10 - Workflow Engine and Business Process Automation Module
  Architecture is now documented after Video and Multimedia.

### Phase II Workflow Engine and Business Process Automation Module Architecture Directive

Purpose:

- Define Workflow Engine and Business Process Automation as the tenth detailed
  Phase II module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, and Video and Multimedia.

Rules:

- Workflow Engine is the official coordination layer for generic platform
  business processes.
- Domain modules keep ownership of domain validation and domain state.
- Domain modules must not create independent workflow engines.
- Workflow definitions must be versioned and configurable without code.
- Workflow instances must reference immutable workflow versions.
- State transitions must be validated, idempotent, auditable, tenant-scoped,
  and compatible with Need-to-Know access.
- Workflow tasks, approvals, deadlines, notifications, scheduler hooks,
  escalations, automation metadata, and process audit must use clear contracts.
- Automation must be reusable, retry-safe, non-destructive, and audited.
- Automation must not approve, publish, grant rights, bypass workflow, modify
  security, or override Human Final Authority.
- Workflow Engine may request AI assistance only through AI Orchestration and
  must not call AI providers directly.
- Workflow notification delivery belongs to the future Notification and
  Communication Module. Workflow may emit notification requests and events.
- Existing Workflow v1, Scheduling, Editorial Pipeline, Publishing, Preflight,
  Distribution, and Phase 7 Step 16 behavior must be preserved.
- Future Workflow implementation must follow
  `docs/modules/workflow/workflow-migration-plan.md`.
- Module 11 - Notification and Communication Module Architecture is now
  documented after Workflow Engine and Business Process Automation.

### Phase II Notification and Communication Module Architecture Directive

Purpose:

- Define Notification and Communication as the eleventh detailed Phase II
  module specification after Library, Translation, Proofreading/Editorial
  Review, Publishing, Rights and Provenance, Magazine, AI Orchestration, Audio
  and Narration, Video and Multimedia, and Workflow Engine.

Rules:

- Notification Engine is the official centralized outbound communication layer
  for platform-generated notifications, email, in-app messages, push
  notifications, webhook dispatch, future SMS, Teams, Slack, and external
  communication adapters.
- Domain modules must emit events or notification requests instead of sending
  outbound communication directly.
- Workflow Engine coordinates process intent. Notification Engine executes
  communication rendering, routing, delivery metadata, retries, and delivery
  audit.
- Templates must be versioned, localized, previewable, and auditable.
- Active template versions cannot be overwritten.
- Channel routing must respect recipient preferences, Platform Language,
  organization policy, priority, channel availability, tenant isolation,
  Need-to-Know access, and confidentiality classification.
- Mandatory security, account recovery, workflow, rights, compliance, and
  Human Final Authority messages may follow explicit policy-defined delivery
  rules.
- Deliveries must be asynchronous, idempotent, retryable, traceable, and
  auditable.
- Webhook dispatch must use documented event versions, HMAC signatures,
  timeout handling, retry policy, safe payloads, and delivery logs.
- Restricted content must not be leaked into external channels.
- AI may draft templates, summarize messages, and suggest routing, but it must
  not activate templates, enable channels, override preferences, expose
  restricted content, approve workflow, publish, grant rights, or bypass
  Human Final Authority.
- Existing Gateway webhooks, Scheduling reminders, Workspace preferences, Auth
  recovery flows, Workflow Engine, Publishing, Distribution, and Phase 7 Step
  16 behavior must be preserved.
- Future Notification implementation must follow
  `docs/modules/notifications/notifications-migration-plan.md`.
- Module 12 - Identity, Access Management and Security Module Architecture is
  now documented after Notification and Communication.

### Phase II Identity, Access Management and Security Module Architecture Directive

Purpose:

- Define Identity, Access Management and Security as the twelfth detailed
  Phase II module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, and Notification and Communication.

Rules:

- IAM is the only official source of authentication, authorization, identity,
  users, roles, permissions, sessions, MFA policy, future SSO provider
  decisions, security policies, and security audit.
- Functional modules must not implement independent authentication or
  authorization mechanisms.
- All protected requests must use server-derived authenticated context.
- Client-provided user IDs, organization IDs, roles, and permissions must not
  be trusted.
- All modules must consult IAM or the approved authorization layer before
  reading, creating, modifying, deleting, publishing, approving, exporting, or
  executing restricted actions.
- RBAC is mandatory and may be extended by policy-driven authorization,
  Need-to-Know scope, data classification, workflow state, organization
  policy, and subscription entitlements.
- The most restrictive valid access rule wins.
- MFA and SSO configuration must be centralized in IAM.
- Security policies must be administrable without application code changes.
- Every permission-sensitive action must be auditable.
- AI may detect risks, summarize access, and suggest policy changes, but it
  must not grant roles, revoke users, approve access reviews, enable SSO,
  change security policies, or expand its own access.
- Existing Auth, Request Context, Security Governance, Policy Engine,
  Enterprise Admin, Workspace, Gateway, Launch Essentials, Workflow,
  Notification, Publishing, Distribution, and Phase 7 Step 16 behavior must be
  preserved.
- Future IAM implementation must follow
  `docs/modules/iam/iam-migration-plan.md`.
- Module 13 - Observability, Monitoring and Audit Module Architecture is now
  documented after Identity, Access Management and Security.

### Phase II Observability, Monitoring and Audit Module Architecture Directive

Purpose:

- Define Observability, Monitoring and Audit as the thirteenth detailed Phase
  II module specification after Library, Translation, Proofreading/Editorial
  Review, Publishing, Rights and Provenance, Magazine, AI Orchestration, Audio
  and Narration, Video and Multimedia, Workflow Engine, Notification and
  Communication, and IAM.

Rules:

- Observability is the official centralized telemetry layer for structured
  logs, metrics, traces, operational audit visibility, alerting, dashboards,
  diagnostics, and health monitoring.
- Modules must not create isolated monitoring mechanisms that cannot be
  correlated, retained, audited, or diagnosed.
- Structured logs must include severity, service/module, timestamp,
  correlation ID, trace ID when available, tenant scope, and safe metadata.
- Metrics must use documented names, units, types, and dimensions.
- Requests, events, jobs, workflows, AI executions, notifications, exports,
  and infrastructure processes should propagate correlation ID and trace ID.
- Audit and observability are distinct. Audit proves authorized actions;
  observability explains system behavior.
- Source modules remain authoritative for their own business audit records.
- Observability may provide immutable read models, correlation, dashboards,
  diagnostics, and alerting over audit sources.
- Alert delivery must route through Notification and Communication.
- Telemetry must not expose secrets, tokens, restricted content, or
  unnecessary personal data.
- AI may diagnose, summarize incidents, and suggest remediation, but it must
  not delete logs, hide errors, alter audit, suppress critical alerts
  automatically, execute infrastructure actions automatically, or change
  security policy.
- Existing Health, Observability, IAM, Notification, Workflow, Gateway,
  Security Governance, Backup, Platform Engineering, Publishing,
  Distribution, infrastructure scripts, and Phase 7 Step 16 behavior must be
  preserved.
- Future Observability implementation must follow
  `docs/modules/observability/observability-migration-plan.md`.
- Module 14 - Backup, Disaster Recovery and Business Continuity Module
  Architecture is now documented after Observability, Monitoring and Audit.

### Backup, Disaster Recovery and Business Continuity Module Architecture Directive

Purpose:

- Define Backup, Disaster Recovery and Business Continuity as the fourteenth
  detailed Phase II module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, and Observability.

Rules:

- Backup is the official centralized protection layer for platform data,
  configuration, audit history, editorial assets, publication artifacts,
  recovery plans, retention, restore validation, disaster recovery, and
  business continuity.
- Functional modules must not implement isolated backup or restore mechanisms
  that bypass centralized backup governance, tenant isolation, retention,
  encryption, validation, observability, or audit.
- All critical platform data and configuration must be covered by centralized
  backup policies.
- Backups must be versioned, checksum-verified, encrypted in controlled
  environments, retained according to policy, and validated through restore
  tests.
- Restore operations require authenticated server-derived context, explicit
  authorized human approval, integrity validation, and full audit.
- Disaster recovery plans must define RPO, RTO, critical services,
  dependencies, restore order, failover/failback procedures, post-recovery
  checks, and test evidence.
- Business continuity must preserve editorial work, audit continuity, rights
  restrictions, security restrictions, Need-to-Know access, and Human Final
  Authority during degraded operation.
- AI may diagnose, summarize, and recommend backup, restore, continuity, or
  disaster recovery actions, but it must not restore data, delete backups,
  alter retention, execute failover, approve recovery, publish, or bypass
  workflow.
- Existing Backup Governance, runtime backup/restore, Infrastructure Pack,
  IAM, Observability, Notification, Workflow, Publishing, Distribution, and
  Phase 7 Step 16 behavior must be preserved.
- Future Backup implementation must follow
  `docs/modules/backup/backup-migration-plan.md`.
- Module 15 - Search, Indexing and Knowledge Graph Module Architecture is now
  documented after Backup, Disaster Recovery and Business Continuity.

### Search, Indexing and Knowledge Graph Module Architecture Directive

Purpose:

- Define Search, Indexing and Knowledge Graph as the fifteenth detailed Phase
  II module specification after Library, Translation, Proofreading/Editorial
  Review, Publishing, Rights and Provenance, Magazine, AI Orchestration,
  Audio and Narration, Video and Multimedia, Workflow Engine, Notification
  and Communication, IAM, Observability, and Backup.

Rules:

- Search is the official centralized discovery layer for full-text search,
  semantic search, vector search, autocomplete, faceted search, indexing,
  entity linking, relationship navigation, recommendations, and Knowledge
  Graph traversal.
- Functional modules must not implement new isolated search engines. Existing
  local query helpers may remain during migration only when they preserve
  compatibility and converge toward the central Search module.
- Indexing must be incremental, asynchronous, event-driven, re-runnable,
  language-aware, version-aware, and auditable.
- Search results must enforce IAM, Need-to-Know, project scope, document
  permissions, workflow visibility, rights restrictions, and public
  visibility server-side.
- Restricted content must not be indexed, embedded, exposed, summarized, or
  suggested unless copyright, license, security, and AI-eligibility policies
  allow it.
- Knowledge Graph entities and relationships must preserve source module,
  source resource ID, source version, provenance, confidence, validation
  state where editorially relevant, and audit trail.
- AI may suggest related resources, entities, relationships, rankings,
  embeddings, and explanations, but it must not approve editorial facts,
  override validated terminology, publish, grant access, change rights, or
  bypass workflow.
- Existing Library, Research, Translation Memory, Terminology, Lexicographic
  Intelligence, Public Portal, Marketplace, IAM, Observability, Backup,
  Publishing, Distribution, and Phase 7 Step 16 behavior must be preserved.
- Future Search implementation must follow
  `docs/modules/search/search-migration-plan.md`.
- Module 16 - Integration, API Gateway and External Connectors Module
  Architecture is now documented after Search, Indexing and Knowledge Graph.

### Integration, API Gateway and External Connectors Module Architecture Directive

Purpose:

- Define Integration, API Gateway and External Connectors as the sixteenth
  detailed Phase II module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, and
  Search.

Rules:

- Integration is the official centralized interoperability boundary for API
  Gateway routing, REST APIs, optional GraphQL APIs, webhooks, event gateway
  contracts, external connectors, rate limiting, API versioning, API security,
  OAuth integration, monitoring, service discovery, and contract validation.
- All external communication must pass through the API Gateway or approved
  centralized connector adapters.
- Functional modules must not call external services, provider SDKs, webhooks,
  storage providers, AI providers, publishing providers, payment providers, or
  productivity providers directly.
- API contracts must be versioned, documented, validated, observable, and
  backwards-compatible according to deprecation policy before stable external
  exposure.
- Webhooks must be signed, retryable, idempotent where needed, observable,
  auditable, and protected against replay.
- Rate limiting must be configurable by endpoint, tenant, consumer, connector,
  and sensitive-operation policy.
- Secrets, tokens, OAuth credentials, webhook secrets, and provider keys must
  not be hardcoded, logged, indexed, exported, embedded in JSON Master, or
  exposed in client bundles.
- IAM remains the source of authentication and authorization for integration
  traffic.
- AI may suggest integration settings, connector scopes, and risk summaries,
  but it must not create active secrets, enable providers, expand scopes,
  bypass rate limits, or execute production-impacting integration actions.
- Existing Gateway, Integrations, Webhooks, IAM, Security Governance,
  Observability, Backup, Search, Notification, AI Orchestration, Publishing,
  Distribution, and Phase 7 Step 16 behavior must be preserved.
- Future Integration implementation must follow
  `docs/modules/integration/integration-migration-plan.md`.
- Module 17 - Configuration, Feature Flags and Platform Administration Module
  Architecture is now documented after Integration, API Gateway and External
  Connectors.

### Configuration, Feature Flags and Platform Administration Module Architecture Directive

Purpose:

- Define Configuration, Feature Flags and Platform Administration as the
  seventeenth detailed Phase II module specification after Library,
  Translation, Proofreading/Editorial Review, Publishing, Rights and
  Provenance, Magazine, AI Orchestration, Audio and Narration, Video and
  Multimedia, Workflow Engine, Notification and Communication, IAM,
  Observability, Backup, Search, and Integration.

Rules:

- Configuration is the official centralized administration boundary for
  global configuration, environment-specific configuration, organization and
  project configuration, Feature Flags, platform administration, module
  configuration, AI parameters, editorial parameters, branding, localization,
  licensing, and operational policies.
- No component may contain business-critical hardcoded configuration or create
  its own independent administration mechanism for shared platform concerns.
- All modules must obtain shared runtime configuration through Configuration
  Service contracts once the service is implemented.
- Configuration must be scoped, typed, validated, versioned, auditable,
  reversible where safe, and isolated by environment.
- Feature Flags must be managed independently of deployments and evaluated
  server-side for gated backend behavior.
- Feature Flags do not replace IAM, RBAC, Need-to-Know access, subscription,
  policy, or workflow authorization.
- Development, Testing, Staging, and Production must remain isolated by
  configuration, database targets, secrets, policies, and Feature Flag state.
- Branding and localization must be configurable without code changes while
  preserving the official Platform Language, Original Language, Authoring
  Language, and Target Language separation.
- Secrets, tokens, credentials, provider keys, and webhook secrets must be
  stored only through approved secret references and must not be hardcoded,
  logged, indexed, exported, embedded in JSON Master, or exposed in client
  bundles.
- AI may suggest configuration changes, summarize risks, and identify drift,
  but must not activate production-impacting features, change security,
  approve configuration changes, alter secrets, or bypass administrative
  confirmation.
- Existing Enterprise Administration, Workspace, Gateway, Security Governance,
  Policy Engine, AI Governance, Observability, Backup, Search, Integration,
  Publishing, Distribution, and Phase 7 Step 16 behavior must be preserved.
- Future Configuration implementation must follow
  `docs/modules/configuration/configuration-migration-plan.md`.
- Module 18 - Data Governance, Metadata and Master Data Management Module
  Architecture is now documented after Configuration, Feature Flags and
  Platform Administration.

### Data Governance, Metadata and Master Data Management Module Architecture Directive

Purpose:

- Define Data Governance, Metadata and Master Data Management as the eighteenth
  detailed Phase II module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, and Configuration.

Rules:

- Data Governance is the official centralized governance boundary for
  canonical data models, master data, metadata registry, data catalog, data
  dictionary, schema registry, reference data, data classification, data
  quality, data lineage, ownership, stewardship, retention, deduplication,
  entity resolution, Golden Records, data contracts, and controlled data
  import/export governance.
- Shared entities must have canonical definitions, stable identifiers,
  authoritative source references, owners, stewards, validation rules,
  classification, history, provenance, and explicit relationships.
- Existing identifiers must be preserved through explicit mapping records;
  migrations must not silently replace or discard legacy identifiers.
- Functional modules remain authoritative for their own business behavior, but
  shared entity definitions must align with the canonical model.
- IAM remains authoritative for identity and access. Rights and Provenance
  remains authoritative for legal rights behavior. Workflow remains
  authoritative for transitions and approvals. Publishing remains authoritative
  for release gates.
- Schemas, metadata definitions, data contracts, reference data, and generated
  artifact contracts must be versioned and compatibility-tested.
- AI-generated or AI-extracted data must not become validated master data
  without the applicable human approval and governance policy.
- Entity Resolution and Golden Records must preserve all source records,
  conflicting values, provenance, approvals, and history.
- Derived publication and media outputs must retain verifiable references to
  the exact master record and master version used to generate them.
- Classification, retention, legal hold, audit, backup, observability, IAM,
  and Need-to-Know policies must apply consistently to master data and
  metadata operations.
- Do not perform destructive schema changes, irreversible data migrations, or
  massive reconciliation during the baseline audit.
- Existing JSON Master v1.0, Domain Model, Logical Data Model, Physical
  Database Model, Library, Translation, Rights, Publishing, Export, Search,
  Integration, Configuration, Backup, Observability, IAM, and Phase 7 Step 16
  behavior must be preserved.
- Future Data Governance implementation must follow
  `docs/modules/data-governance/data-governance-migration-plan.md`.
- Module 19 - Accessibility, Localization and Inclusive Experience Module
  Architecture is now documented after Data Governance, Metadata and Master
  Data Management.

### Accessibility, Localization and Inclusive Experience Module Architecture Directive

Purpose:

- Define Accessibility, Localization and Inclusive Experience as the nineteenth
  detailed Phase II module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, and Data Governance.

Rules:

- Accessibility and localization are native platform capabilities, not
  optional extensions.
- Accessibility is the centralized governance boundary for UI accessibility,
  document accessibility, EPUB/PDF accessibility, audio/video accessibility,
  localization, internationalization, multilingual UI, captions, subtitles,
  transcripts, audio descriptions, alternative text, screen reader support,
  keyboard navigation, inclusive UX, and accessibility validation.
- The platform targets WCAG 2.2 AA, EPUB Accessibility, PDF/UA, WAI-ARIA where
  semantic HTML is insufficient, semantic HTML5, WebVTT, and SRT.
- Platform Language controls UI text only and must not change Original
  Language, Authoring Language, Target Language, manuscript content,
  translation content, captions, transcripts, or imported content.
- Localization resources must be centralized, versioned, reviewable, and
  auditable before they become managed runtime resources.
- Accessibility profiles may adjust presentation and interaction behavior, but
  must not alter source content.
- Caption, subtitle, transcript, audio description, and alternative text
  records must remain linked to source media, localized media versions,
  language/locale metadata, and master records where applicable.
- Media Localization Studio remains the distinct media localization capability
  and must integrate with this module for captions, subtitles, transcripts,
  dubbing, voice-over, localized media, and accessibility metadata without
  duplicating responsibility.
- AI may suggest alt text, captions, transcripts, audio descriptions, and
  accessibility findings, but must not approve compliance, publish, bypass
  workflow, or replace authorized human review.
- Existing frontend i18n, Platform Language behavior, Media Localization,
  Multimedia, Publishing, Export, Library, Search, Configuration, Data
  Governance, IAM, Observability, Backup, and Phase 7 Step 16 behavior must be
  preserved.
- Future Accessibility implementation must follow
  `docs/modules/accessibility/accessibility-migration-plan.md`.
- Module 20 - Analytics, Business Intelligence and Decision Support Module
  Architecture is now documented after Accessibility, Localization and
  Inclusive Experience.

### Analytics, Business Intelligence and Decision Support Module Architecture Directive

Purpose:

- Define Analytics, Business Intelligence and Decision Support as the
  twentieth detailed Phase II module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, Data Governance, and Accessibility.

Rules:

- Analytics is the centralized platform boundary for reporting, business
  intelligence, KPI management, executive dashboards, operational analytics,
  editorial analytics, AI analytics, workflow analytics, publishing analytics,
  financial analytics, usage analytics, performance analytics, predictive
  analytics, report building, data warehouse integration, OLAP queries, and
  decision support.
- Functional modules must not create isolated reporting, analytics, KPI,
  dashboard, forecast, or BI authorities.
- Analytics data must come from canonical sources defined by Data Governance
  and Master Data Management.
- KPI definitions must be configurable, versioned, explainable, and auditable.
- Reports must be reproducible, exportable, version-aware, and source-lineage
  aware.
- Dashboards must enforce IAM, Need-to-Know visibility, tenant isolation, and
  privacy by design.
- Decision recommendations are informational and must not mutate source module
  data, approve editorial decisions, publish, grant rights, grant access,
  change budgets, bypass workflow, or hide audit history.
- Analytics operations must be observable, traceable, and auditable.
- Existing Observability, Workspace dashboards, Reports Center, QA, Semantic
  Fidelity, Workflow, Publishing, Distribution, Rights, Public Portal,
  Commerce, AI Governance, Data Governance, IAM, Backup, Configuration,
  Search, Notifications, Integration, Audio, Video, Accessibility, and Phase 7
  Step 16 behavior must be preserved.
- Future Analytics implementation must follow
  `docs/modules/analytics/analytics-migration-plan.md`.
- Module 21 - AI Governance, Model Management and Responsible AI Module
  Architecture is now documented after Analytics, Business Intelligence and
  Decision Support.

### AI Governance, Model Management and Responsible AI Module Architecture Directive

Purpose:

- Define AI Governance, Model Management and Responsible AI as the twenty-first
  detailed Phase II module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, Data Governance, Accessibility, and Analytics.

Rules:

- AI Governance is the mandatory governance boundary for every AI model,
  provider, prompt, agent, policy, evaluation, benchmark, risk record,
  explainability record, cost record, approval, and audit event.
- Functional modules must not invoke unmanaged AI models, call unmanaged AI
  providers, or maintain independent production prompt repositories.
- AI Orchestration remains the execution and coordination boundary. AI
  Governance owns the registries, policies, lifecycle records, approvals,
  evaluations, benchmarks, cost controls, and responsible AI evidence that AI
  Orchestration must consult.
- Every AI model must be registered, evaluated, policy-checked, and approved
  where required before use.
- Every production prompt must be centrally registered, versioned, evaluated,
  approval-controlled, and auditable.
- Every AI agent must define mission, responsibilities, collaboration, limits,
  authority, assigned models, assigned prompts, workflows, permissions,
  policies, monitoring profile, and lifecycle status.
- AI policies must cover allowed models, forbidden models, cost limits, token
  limits, data classification, required approvals, autonomy levels, external
  provider usage, prompt retention, and response retention.
- Every AI output used in platform workflows must preserve explainability
  metadata including model, version, prompt, parameters, sources used,
  temperature, provider, timestamp, user, workflow, cost, and token usage.
- AI may recommend, explain, evaluate, classify, summarize, and generate
  drafts when authorized, but it must not publish, approve, grant rights,
  grant access, modify security, change governance, bypass workflow, approve
  its own budget increase, or hide audit history.
- Existing `/ai-governance/*` APIs, provider fallback metadata, AI usage and
  cost governance, AI agent profiles, AI Orchestration, Marketplace,
  Observability, Analytics, IAM, Policy Engine, Configuration, Integration
  Gateway, Backup, and Phase 7 Step 20 behavior must be preserved.
- Future AI Governance implementation must follow
  `docs/modules/ai-governance/ai-governance-migration-plan.md`.
- Module 22 - DevSecOps, CI/CD, Release and Platform Operations Module
  Architecture is now documented after AI Governance, Model Management and
  Responsible AI.

### DevSecOps, CI/CD, Release and Platform Operations Module Architecture Directive

Purpose:

- Define DevSecOps, CI/CD, Release and Platform Operations as the
  twenty-second detailed Phase II module specification after Library,
  Translation, Proofreading/Editorial Review, Publishing, Rights and
  Provenance, Magazine, AI Orchestration, Audio and Narration, Video and
  Multimedia, Workflow Engine, Notification and Communication, IAM,
  Observability, Backup, Search, Integration, Configuration, Data Governance,
  Accessibility, Analytics, and AI Governance.

Rules:

- DevSecOps is the mandatory platform boundary for source control, branch
  strategy, CI/CD pipelines, build automation, release management,
  environment promotion, Infrastructure as Code, container management,
  Kubernetes operations readiness, secret management, artifact registry
  governance, deployment automation, rollback management, patch management,
  operational runbooks, and platform operations.
- No service may be implemented, released, deployed, or operated outside the
  approved DevSecOps process.
- All builds must be automated, reproducible, traceable to source commits,
  and validated through official CI.
- All deployments must be versioned, environment-scoped, auditable,
  rollback-capable, and promoted only after configured validation and
  approvals.
- Infrastructure must be managed as code where practical. Unmanaged manual
  production changes are prohibited outside approved emergency procedure.
- Secrets must be centrally governed and must not be committed, logged,
  embedded in images, exposed in client bundles, or exported through project
  data.
- Artifacts must be immutable, versioned, checksummed, and traceable to
  commits, dependencies, build number, security status, and deployment.
- CI must validate repository structure, infrastructure syntax, secret
  scanning, typecheck, tests, builds, runtime database/backup contracts,
  fixture validation, Docker Compose configuration, and security scanning
  where dependencies and tools are available.
- CD must promote changes through controlled environments and require
  explicit authorized approval before production.
- Existing GitHub Actions CI, staging deployment, staging operations,
  Infrastructure Pack, Docker Compose staging, backup/restore, rollback,
  monitoring, Chapter 13 DevOps documentation, and Phase 7 Step 21 behavior
  must be preserved.
- Future DevSecOps implementation must follow
  `docs/modules/devsecops/devsecops-migration-plan.md`.
- Module 23 - Quality Assurance, Testing and Validation Module Architecture
  is now documented after DevSecOps, CI/CD, Release and Platform Operations.

### Quality Assurance, Testing and Validation Module Architecture Directive

Purpose:

- Define Quality Assurance, Testing and Validation as the twenty-third
  detailed Phase II module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, Data Governance, Accessibility, Analytics, AI
  Governance, and DevSecOps.

Rules:

- Quality Assurance is the mandatory platform boundary for quality assurance,
  test management, test planning, test execution, test automation, manual
  validation, unit testing, integration testing, contract testing, API
  testing, end-to-end testing, performance testing, load testing, stress
  testing, security testing, accessibility testing, AI validation, regression
  testing, and release validation.
- No software component, API, AI agent, editorial workflow, publication
  output, infrastructure change, or operational process may be promoted
  without the required validation evidence.
- Automated tests must be integrated with CI/CD where practical.
- Manual validation must produce auditable evidence when automation is not
  sufficient.
- Quality gates must be configurable, mandatory, auditable, and connected to
  release approval.
- Critical vulnerabilities, failed mandatory tests, failed AI validation,
  failed accessibility validation, and unmet minimum coverage thresholds block
  promotion.
- Every requirement should be traceable to test cases, executions, evidence,
  defects when applicable, and release decisions.
- AI may summarize quality status, identify risks, and recommend remediation,
  but it must not approve releases, waive quality gate failures, hide failed
  results, or bypass validation controls.
- Existing API, Web, runtime database, backup, shared package, staging,
  Infrastructure Pack, DevSecOps, Quality, Chapter 14, and Phase 7 Step 22
  validation behavior must be preserved.
- Future Quality Assurance implementation must follow
  `docs/modules/quality-assurance/qa-migration-plan.md`.
- Module 24 - Enterprise Architecture, Portfolio and Strategic Governance
  Module Architecture is now documented after Quality Assurance, Testing and
  Validation.

### Enterprise Architecture, Portfolio and Strategic Governance Module Architecture Directive

Purpose:

- Define Enterprise Architecture, Portfolio and Strategic Governance as the
  twenty-fourth detailed Phase II module specification after Library,
  Translation, Proofreading/Editorial Review, Publishing, Rights and
  Provenance, Magazine, AI Orchestration, Audio and Narration, Video and
  Multimedia, Workflow Engine, Notification and Communication, IAM,
  Observability, Backup, Search, Integration, Configuration, Data Governance,
  Accessibility, Analytics, AI Governance, DevSecOps, and Quality Assurance.

Rules:

- Enterprise Architecture is the mandatory governance boundary for business
  architecture, application architecture, data architecture, integration
  architecture, security architecture, infrastructure architecture, AI
  architecture, platform architecture, product portfolio, strategic roadmap,
  technology standards, technology lifecycle, domain ownership, architecture
  decisions, technical debt, innovation governance, and architecture
  compliance.
- All major architecture decisions must be documented through Architecture
  Decision Records.
- All capabilities must be cataloged with ownership, maturity, priority,
  dependencies, and lifecycle status.
- Technology standards must be centralized, versioned, lifecycle-governed,
  and auditable.
- No new technology may be adopted without architecture approval.
- Strategic roadmap changes must preserve dependencies, risks, milestones,
  budget metadata, success indicators, and audit evidence.
- Technical debt must be registered, prioritized, assigned, and linked to
  remediation plans.
- Architecture deviations require authorized review, approved exception, and
  audit trail.
- AI may summarize architecture state, draft ADR proposals, identify risks,
  and recommend standards, but it must not approve architecture decisions,
  adopt technologies, approve exceptions, change governance, or bypass
  architecture review.
- Existing Manifest, development conventions, architecture Chapters 0-23,
  SPEC, ROADMAP, AGENTS, DevSecOps, Quality Assurance, IAM, Data Governance,
  AI Governance, and Phase 7 Step 23 behavior must be preserved.
- Future Enterprise Architecture implementation must follow
  `docs/modules/enterprise-architecture/architecture-migration-plan.md`.
- Module 25 - Compliance, Legal Governance and Risk Management Module
  Architecture is now documented after Enterprise Architecture, Portfolio and
  Strategic Governance.

### Compliance, Legal Governance and Risk Management Module Architecture Directive

Purpose:

- Define Compliance, Legal Governance and Risk Management as the twenty-fifth
  detailed Phase II module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, Data Governance, Accessibility, Analytics, AI
  Governance, DevSecOps, Quality Assurance, and Enterprise Architecture.

Rules:

- Compliance is the mandatory governance boundary for compliance management,
  regulatory compliance, internal policies, legal governance, enterprise risk
  management, control framework, privacy governance, consent management,
  records management, retention policies, legal hold, compliance assessments,
  internal audits, external audits, exception management, and corrective
  actions.
- Compliance and risk management must not be implemented as isolated,
  module-local authorities outside this centralized framework.
- All policies must be versioned, owned, reviewed, approved,
  lifecycle-managed, and auditable.
- All risks must have owners, score, status, linked controls, and mitigation
  plans where required.
- All controls must be traceable to policies, risks, evidence, owners,
  frequency, execution mode, and effectiveness status.
- Exceptions must be documented, approved, time-limited, monitored, and
  audited.
- Legal hold overrides retention deletion but does not grant unauthorized
  access.
- Compliance assessments, audit findings, and corrective actions must preserve
  evidence and be tracked to closure.
- AI may summarize policies, detect risks, suggest controls, and recommend
  remediation, but it must not approve policies, accept risks, approve
  exceptions, release legal holds, close audit findings, or bypass compliance.
- Existing Manifest, development conventions, architecture Chapters 0-24,
  SPEC, ROADMAP, AGENTS, IAM, Data Governance, AI Governance, DevSecOps,
  Quality Assurance, Enterprise Architecture, Rights and Provenance, Backup,
  and Phase 7 Step 24 behavior must be preserved.
- Future Compliance implementation must follow
  `docs/modules/compliance/compliance-migration-plan.md`.
- Module 25 completes the fundamental Phase II architecture chain by adding
  compliance, legal governance, and risk management to editorial capabilities,
  infrastructure, AI, operations, governance, quality, and strategy. Future
  modules are specialized extensions unless explicitly approved as new
  fundamental architecture.

### Enterprise Meta-Architecture and Codex Governance Framework Directive

Purpose:

- Define Phase III Module 26 as the supreme Codex governance layer above all
  Phase I architecture chapters, Phase II fundamental modules, services, APIs,
  data models, AI agents, workflows, standards, and future extensions.

Rules:

- This directive does not authorize new user-facing functionality.
- No future module, service, API, data model, AI agent, workflow, standard, or
  extension may bypass the Enterprise Meta-Architecture and Codex Governance
  Framework.
- All modules must define purpose, responsibilities, principles,
  architecture, entities, workflows, APIs, events, integration, performance,
  security, acceptance criteria, audit, deliverables, and final Codex
  instruction.
- Module lifecycle states are `PROPOSED`, `DRAFT`, `UNDER_REVIEW`,
  `VALIDATED`, `APPROVED`, `IMPLEMENTED`, `OPERATIONAL`, `DEPRECATED`, and
  `ARCHIVED`.
- All module lifecycle transitions must be versioned and audited.
- Every architectural change must include justification, impact on existing
  modules, compatibility analysis, risk assessment, migration plan,
  validation criteria, and architecture approval.
- Dependencies between modules, APIs, events, data models, workflows, and AI
  agents must be explicit.
- Uncontrolled circular dependencies are not allowed.
- Canonical reference models are the official reference for users, projects,
  publications, translations, multimedia assets, workflows, AI, audit, and
  configuration.
- Codex versions, structural changes, reviews, approvals, architectural
  exceptions, compatibility decisions, and migration plans must be audited.
- AI may assist with analysis, summaries, dependency checks, maturity
  assessments, impact analysis, and draft recommendations, but it must not
  approve Codex changes, grant exceptions, alter governance, publish Codex
  versions, or bypass architectural review.
- Future capabilities after Module 26 are specialized extensions unless
  explicitly approved through Codex Governance as fundamental architecture.
- Future Codex Governance implementation must follow
  `docs/codex/meta-architecture-migration-plan.md`.

### Intelligent Editorial Library & UX Finalization Directive

Purpose:

- Transform the existing Library into a unified intelligent editorial center
  that manages the complete lifecycle of every publication while remaining
  simple, fast, intuitive, and optimized for minimum clicks.

Rules:

- This extends the existing Library, Projects, Manuscripts, Project Dossiers,
  Translation, Review, Layout, Publishing, Distribution, Rights & Provenance,
  Unified Language Management, Audit, Versioning, Backup, and Need-to-Know
  infrastructure. It is not a new enterprise module.
- Do not create a separate Archive module.
- Library lifecycle statuses are `STOC_REAL`, `IN_LUCRU`, and `PUBLICAT`.
  These are statuses, not separate libraries.
- Supported lifecycle transitions are Stoc real to În lucru, În lucru to
  Publicat, and Publicat to În lucru when a new edition or revision is created.
- Status changes must never destroy historical versions.
- Publication types are filters and metadata, not separate Library modules.
- Library must support all existing publication types and other configured
  publication types.
- The primary Library experience must include one search field, clear filter
  chips, collapsible advanced filters, grid/list toggle, status labels,
  quick preview, contextual actions, minimal clutter, responsive layout,
  keyboard accessibility, and clear empty/loading/error states.
- Search must support exact, normalized, fuzzy, partial title, author,
  multilingual metadata, ISBN, series, and collection search.
- Filters must include author, language, editorial domain, publication type,
  lifecycle status, publication year, original publication year, rights status,
  format, series, and collection.
- Grid and list view preferences and filters should persist per user.
- Publication records must connect general metadata, original edition,
  manuscripts, projects, workflow, translations, review, layout, publishing,
  files/formats, editions, versions, rights, provenance, publishing history,
  and distribution status.
- Visibility is independent from lifecycle status and may be `PUBLIC`,
  `PRIVATE`, or `INTERNAL_WORKING_PUBLICATION`.
- Preview must not expose restricted content.
- Bulk actions must respect role permissions, subscription entitlements,
  Need-to-Know scope, project/document scope, visibility, and rights
  restrictions.
- Duplicate detection may compare title, normalized title, author, ISBN,
  original title, edition, and source file fingerprint, but must never merge
  automatically.
- Library Agent may classify publications, validate metadata completeness,
  detect duplicates, connect editions and versions, maintain project/manuscript
  relationships, suggest missing metadata, and preserve status consistency.
  It must never delete historical versions automatically.
- Quality Agent checks completeness, required formats, metadata, rights,
  accessibility, and readiness issues.
- Rights & Provenance Agent validates source and rights information before
  publication.
- Audit must cover publication created, metadata changed, status changed,
  visibility changed, manuscript linked, project linked, edition created,
  version created, file added/replaced, bulk action, publication published,
  publication withdrawn, duplicate reviewed, and rights status changed.
- Library data must be included in backup/restore without breaking project or
  manuscript links.

### Publishing Workflow, Final Preflight and Distribution Tracking Directive

Purpose:

- Finalize publication release readiness while preserving Library as the single
  source of truth and avoiding duplicate Export, Quality, Rights, Workflow, or
  Distribution responsibilities.

Rules:

- This extends the existing Layout & Publishing, Library, Export, Rights &
  Provenance, Workflow, Quality, Audit, and Backup infrastructure. It is not a
  new enterprise module.
- Do not create a separate Preflight module, separate Distribution module,
  separate Archive module, or social-media promotion workflow.
- Library owns publication identity, lifecycle, editions, versions, metadata,
  files, rights/provenance references, and historical publication records.
- Publishing owns official edition selection, readiness state, human release
  gates, publication timestamps, selected channels, and immutable publication
  snapshots.
- Export owns generated files and format artifacts.
- Rights & Provenance owns rights warnings and authorization records.
- Quality Agent owns quality findings. Preflight only aggregates these signals.
- Distribution tracks channel delivery status and history only. It must not
  duplicate publication metadata, generated files, rights data, or Library
  records.
- Publishing states are `IN_PREGATIRE`,
  `GATA_PENTRU_PUBLICARE`, `PUBLICAT`, `REPUBLICAT`, and
  `RETRAS_DIN_PUBLICARE`.
- Final preflight statuses are `PASS`, `WARNING`, `ERROR`,
  `NOT_APPLICABLE`, and `PENDING`; severities are `INFORMATIONAL`, `WARNING`,
  and `CRITICAL`.
- Approved publication channels are `INTERNAL_LIBRARY`, `PUBLIC_PORTAL`,
  `DIGITAL_BOOKSTORE`, `EXTERNAL_EXPORT`, and `PRINT_ON_DEMAND`.
- Critical preflight errors block publication. Warnings may be accepted only by
  authorized humans and must be audited.
- Official published editions are immutable. Corrections require a new edition,
  version, or republication record; historical versions must remain auditable.
- Withdrawal from publication must preserve Library records, generated files,
  audit, versions, and distribution history.
- AI may summarize readiness, detect blockers, and suggest remediation, but it
  may not approve, publish, withdraw, distribute, bypass rights, or override
  human final authority.
- Audit must cover preflight generated/refreshed, warnings accepted,
  overrides, official edition selected, publication state changes, publication,
  republication, withdrawal, distribution initiated, delivered, failed, and
  channel withdrawal.

### ChatGPT

Role: System Architect.

Responsibilities:

- Product vision.
- Architecture.
- Specifications.
- Business rules.
- Workflow definitions.
- Roadmap management.
- Future module planning.

### Codex

Role: Software Engineer.

Responsibilities:

- Implementation.
- Database schema.
- APIs.
- Tests.
- Refactoring.
- Performance improvements.

Rules:

- Must follow `SPEC.md`, `AGENTS.md`, and `ROADMAP.md`.
- Must not change architecture without approval.
- Must not introduce major features outside roadmap.
- Must implement only the approved MVP scope until the architecture is reopened.

### Lovable

Role: Rapid UI Prototyping.

Responsibilities:

- UI generation.
- Navigation.
- Dashboards.
- Forms.
- Workflow screens.

Rules:

- Not responsible for architecture decisions.
- Must follow specifications.

### Priority Order

1. `docs/MANIFEST.md`.
2. `docs/DEVELOPMENT_CONVENTIONS.md`.
3. `SPEC.md`, Chapter 0 - Fundamental Platform Principles.
4. `docs/ARCHITECTURE_CHAPTER_1.md`.
5. `docs/ARCHITECTURE_CHAPTER_2.md`.
6. `docs/ARCHITECTURE_CHAPTER_3.md`.
7. `docs/ARCHITECTURE_CHAPTER_4.md`.
8. `docs/ARCHITECTURE_CHAPTER_5.md`.
9. `docs/ARCHITECTURE_CHAPTER_6.md`.
10. `docs/ARCHITECTURE_CHAPTER_7.md`.
11. `docs/ARCHITECTURE_CHAPTER_8.md`.
12. `docs/ARCHITECTURE_CHAPTER_9.md`.
13. `docs/ARCHITECTURE_CHAPTER_10.md`.
14. `docs/ARCHITECTURE_CHAPTER_11.md`.
15. `docs/ARCHITECTURE_CHAPTER_12.md`.
16. `docs/ARCHITECTURE_CHAPTER_13.md`.
17. `docs/ARCHITECTURE_CHAPTER_14.md`.
18. `docs/ARCHITECTURE_CHAPTER_15.md`.
19. `SPEC.md`.
20. `AGENTS.md`.
21. `ROADMAP.md`.
22. Codex implementation.
23. Lovable UI generation.

When conflicts occur, architecture and specifications take precedence.
