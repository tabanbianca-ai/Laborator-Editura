# Roadmap

## Current Priority

The architecture is frozen for MVP implementation. Build only the core
translation platform first.

MVP stabilization is active. Prioritize implementation, integration, and testing
of existing approved modules over new design work.

## Official Development Conventions

Status: Active.

Reference:

- `docs/DEVELOPMENT_CONVENTIONS.md`.

Roadmap impact:

- All future implementation must use English for internal code, APIs,
  database objects, tests, technical documentation, and technical comments.
- All user-facing UI text must use localization dictionaries or the approved
  localization system.
- Romanian, English, Spanish, French, Portuguese, Italian, and German are the
  first-stage platform UI languages.
- Mixed-language UI is not acceptable for launch readiness.
- Standard UI terminology must follow international localization standards and
  established operating-system translations before platform-specific terms are
  added.
- Platform-specific terms must be governed through the platform terminology
  dictionary.
- Authentication, roles, sessions, and permissions remain unified across the
  public, app, and API domains.
- Future work that adds languages, modules, roles, user types, or features must
  preserve the existing architecture.
- If future implementation choices are ambiguous, the official development
  conventions take precedence.

## MVP Scope

The MVP includes:

- Auth.
- Documents.
- Segment Editor.
- Basic Translation Memory.
- Basic QA.
- Basic TCPS/TLCG.
- Export.

Do not add major features outside this scope during MVP implementation.

## Current Implementation Priorities

1. Translation Memory.
2. Terminology & Glossary System.
   - Terminology Governance v2 is approved as an MVP stabilization enhancement
     inside the existing Terminology & Glossary System.
3. QA Engine.
4. Semantic Fidelity Engine.
5. Workflow Engine.

## MVP Roadmap

Implementation proceeds in this order:

Foundation -> Auth -> DB -> Document Editor -> Segments -> QA -> TM ->
TCPS/TLCG -> AI -> Publishing.

## End-to-End MVP Workflow

The MVP is successful when this complete workflow is operational and tested:

Authentication -> Project -> Document -> Segments -> Translation -> Translation
Memory -> Terminology Validation -> QA Validation -> Semantic Fidelity
Validation -> Review Workflow -> Versioning -> Audit -> Export.

Success criteria:

- End-to-end workflow operational.
- No critical architecture changes.
- No new major features.
- Existing modules integrated and tested together.

Roadmap expansion may resume only after MVP validation.

### Phase Notes

- Foundation: monorepo, development standards, local services, configuration.
- Auth: users, sessions, RBAC, organization-scoped access.
- DB: schema for organizations, projects, documents, segments, JSON Master data,
  audit, versions, terminology, QA, and Translation Memory.
- Document Editor: document creation, viewing, editing, and version tracking.
- Segments: segment editor, translation state, workflow state, and QA hooks.
- QA: basic semantic, terminology, formatting, and consistency checks.
- TM: basic Translation Memory storage and reuse suggestions.
- Terminology Governance v2: terminology quality score, Romanian diacritics and
  orthographic validation, source validation, rejection/under-review decisions,
  audit coverage, QA blocking, and workflow export gates for rejected or
  unresolved High/Critical terminology issues.
- Translation Rules Versioning & Impact Analysis: translation rules are
  immutable and versioned, manuscripts and exports record rule versions used,
  rule changes require impact analysis across books, manuscripts, languages,
  chapters, segments, terminology entries, and exports, and changes affecting
  existing publications require authorized approval.
- Rule Source Authority: translation rules, terminology rules, editorial rules,
  semantic fidelity rules, and exceptions require immutable, auditable,
  non-AI source authority references before validation.
- Authority Confidence Levels: source authorities are ranked as
  `PRIMARY_AUTHORITY`, `SECONDARY_AUTHORITY`, `EDITORIAL_AUTHORITY`, or
  `TEMPORARY_AUTHORITY`; conflicts require human review, AI cannot be an
  authority confidence source, and impact analysis records affected confidence
  levels.
- TCPS/TLCG: minimal competency profile, training challenge, scoring, and
  progression support.
- AI: suggestion and explanation integrations that remain under human final
  authority.
- Publishing: export from JSON Master Format.

## Phase 2 Planning Foundation - Editorial Intelligence & Production Agents

Status: Planned post-MVP architecture foundation. Documentation and
architecture scaffolding only.

Priority: `POST-MVP` / after closed beta readiness.

### Scope

Phase 2 reserves specialized editorial, production, media, narration, platform
coordination, and orchestration agents. This roadmap entry does not authorize
implementation yet and must not change the current MVP or staging behavior.

Governance rules:

- Do not change Phase 1 runtime behavior from this phase entry.
- Do not change Auth, Projects, Documents, Segments, Translations, QA, Semantic
  Fidelity, Workflow, Export, staging Docker, API contracts, or database schema.
- AI may suggest and automate drafts, but authorized human roles keep final
  approval authority.
- Every Phase 2 agent action must be auditable.
- JSON Master Format may reserve future fields for dictionaries, layout,
  visual assets, audio tracks, video assets, production profiles, and agent
  executions.

### Milestones

#### P2.1 - AI Orchestrator Planning

- Define execution order coordination.
- Define dependency tracking.
- Define cost-control metadata.
- Define audit trail requirements.
- Define human approval gates.

#### P2.2 - Lexicographic Intelligence Agent Planning

- Dictionary sources.
- Bilingual dictionaries.
- Monolingual dictionaries.
- DEX, DOOM, and DLR.
- Spanish-Romanian and Romanian-Spanish dictionary by Alexandru Calciu and
  Zaira Samharadze.
- Specialized spiritist dictionaries.
- Dictionary entries, lexical senses, examples, sources, and citations.
- Glossary priority:
  `validated platform glossary > documented editorial decision > specialized dictionary > academic dictionary > AI suggestion`.

#### P2.3 - Layout & Editorial Production Agent Planning

- Book layout.
- Magazine layout.
- Print finishing.
- PDF/X, EPUB, MOBI, and flipbook planning.
- European formats by default.
- American formats optional.
- Bleed, crop marks, margins, widows and orphans, and typography checks.

#### P2.4 - AI Video & Visual Creation Agent Planning

- Image generation.
- Cover generation.
- Illustration generation.
- Image editing.
- Text-to-video.
- Image-to-video.
- Trailer generation.
- Subtitle and visual localization.

#### P2.5 - Audio Narration Agent Planning

- Audiobook by chapters.
- Text-to-speech.
- Voice profiles.
- MP3, WAV, and FLAC export.
- Multilingual narration.

#### P2.6 - Platform Engineering, Optimization & Coordination Agent Planning

- Software update and upgrade planning.
- Dependency monitoring.
- Docker optimization.
- Backup and restore coordination.
- Auto-healing planning.
- Performance optimization.
- AI cost coordination.
- System maintenance audit.

#### P2.7 - JSON Master Phase 2 Extension Planning

- Reserve `dictionaries`.
- Reserve `layout`.
- Reserve `visualAssets`.
- Reserve `audioTracks`.
- Reserve `videoAssets`.
- Reserve `productionProfiles`.
- Reserve `agentExecutions`.

### Implementation Status

No implementation is authorized at this stage. This roadmap entry exists to
prepare Phase 2 architecture while keeping MVP stabilization and closed beta
preparation controlled.

## Future Phase - Media Localization Studio

Status: Future/Post-Beta Phase. Not scheduled for implementation yet.

### Scope

This future phase will add basic editorial media localization capabilities. It
is not a full Adobe Premiere replacement and is not intended to provide
professional non-linear video editing, compositing, advanced transitions, or
color grading.

- Video and audio upload.
- Automatic transcript generation.
- Transcript correction.
- Transcript translation.
- Subtitle generation.
- Subtitle formats: SRT, VTT, and ASS.
- Multilingual subtitles.
- Multilingual voice-over.
- Simple AI dubbing.
- Audio export.
- Transcript export.
- Localized video export.
- Text, audio, and video synchronization.
- Links from media assets to the original manuscript, article, book, or project.
- Language-specific media versions.
- Media Localization QA.
- Workflow Integration.

Excluded capabilities:

- Advanced video editing.
- Color grading.
- Complex timeline editing.
- Visual effects.
- Advanced transitions.
- Professional compositing.

Architectural rules:

- Original language must be configurable and never hard-coded.
- Every transcript, subtitle, audio version, dubbing version, and localized
  video export must remain linked to the original media asset.
- Media assets must remain linked to the original manuscript, article, book, or
  project when applicable.
- Media translations must follow terminology, QA, Semantic Fidelity, and global
  translation rules.
- Human final authority remains required for release approval.

### Roadmap Position

This phase should start only after the core translation workflow is stable:

1. Core document translation is operational.
2. Terminology and semantic QA are functional.
3. Workflow, review, and audit are stable.
4. Export and publishing systems exist.
5. The platform can reliably manage projects, users, roles, and approvals.

### Implementation Status

No implementation is authorized at this stage. This roadmap entry is included so
the architecture reserves space for future multimedia localization without
disrupting the current MVP.

## Future Phase - Magazine Platform Vision

Status: Planned future publication platform. Not scheduled for implementation
yet.

### Architectural Rules

Original language must be configurable per publication.

Supported original languages include, but are not limited to:

- English.
- Romanian.
- Spanish.
- French.
- Italian.
- Portuguese.
- German.
- Any supported language.

Rules:

- Original language is never hard-coded.
- Every translation must remain linked to the original publication.
- Audio versions remain linked to the same original publication.
- Translation alignment must remain auditable through JSON Master references.

### M1 - Digital Magazine MVP

Status: `PLANNED`.

Priority: `POST-BETA`.

Features:

- Flipbook reader.
- Interactive table of contents.
- Fullscreen mode.
- Zoom controls.
- Full-text search.
- Responsive desktop, tablet, and mobile reading.
- Multi-language reading.
- Language switcher.
- Audio per article.
- PDF export.
- HTML export.
- Link to original article or manuscript.
- Accessibility baseline.

### M2 - Advanced Reading

Status: `PLANNED`.

Priority: `POST-BETA`.

Features:

- Bookmarks.
- Reading history.
- Favorites.
- Text highlighting.
- Personal notes.
- Offline PWA support.
- Reading progress tracking.

### M3 - Interactive Magazine

Status: `PLANNED`.

Priority: `FUTURE`.

Features:

- Text/audio synchronization.
- Embedded video.
- Image galleries.
- Podcasts.
- Interactive editorial content.
- Rich media articles.

### M4 - Enterprise Magazine

Status: `FUTURE`.

Priority: `LONG_TERM`.

Features:

- Original vs translation comparison.
- Edition comparison.
- Semantic analysis.
- AI recommendations.
- Advanced analytics.
- Mobile applications.
- Cross-publication knowledge linking.

### Implementation Status

No implementation is authorized at this stage. This roadmap entry is included so
the architecture reserves space for future magazine publishing, reading, audio,
and cross-publication workflows without disrupting the current MVP or closed
beta preparation.

## Phase 7 Step 8 - AI Agent Governance & Quality Agent

Status: Implemented as governance refinement.

Scope:

- No new enterprise modules.
- Reuses AI Governance, Marketplace Agent Registry, and Platform Engineering
  orchestration.
- No Docker or staging configuration changes.
- No breaking API changes.

Rules:

- Every agent defines mission, responsibilities, collaboration, limits, and
  authority.
- Agents may exchange information, request assistance, reuse results, notify
  other agents, and coordinate through the Coordinator Agent.
- No communication restrictions exist between agents.
- Each agent has final AI responsibility only within its own specialization.
- Human approval always overrides every AI decision.
- No AI agent may publish automatically, approve automatically, grant rights,
  bypass workflow, modify security, or change governance.

Quality Agent:

- Verifies editorial consistency, metadata, missing assets, exports,
  accessibility, links, publication readiness, and distribution readiness.
- Reports issues only.
- Does not translate, review, edit, illustrate, publish, approve, or correct
  the project.

Current governed agents:

1. Coordinator Agent.
2. Projects Agent.
3. Manuscripts Agent.
4. Documentation Agent.
5. Translation Agent.
6. Review Agent.
7. Layout Agent.
8. Publishing Agent.
9. Distribution Agent.
10. Library Agent.
11. Rights & Provenance Agent.
12. Illustration Agent.
13. Audio Agent.
14. Video Agent.
15. Magazine Agent.
16. Administration Agent.
17. Evolution Agent.
18. Quality Agent.

## Phase 7 Step 9 - Complete AI Agent Roles, Subagents & Parallel Review

Status: Implemented as governance and interface refinement.

Scope:

- No new enterprise modules.
- Reuses AI Governance, Marketplace, Workflow, Audit, and Editorial Pipeline
  infrastructure.
- No Docker or staging configuration changes.
- No breaking API changes.

Implemented refinements:

- All 18 principal agents expose complete governance metadata: ID, name,
  mission, responsibilities, collaboration rules, limits, authority, enabled
  state, version, and last update timestamp.
- All agents may collaborate freely through the Coordinator Agent.
- Agents cannot bypass workflow, remove audit history, modify rights/security
  outside authority, perform another specialized agent's responsibility, or
  publish automatically without validation.
- Review Agent responsibilities now cover detailed linguistic and editorial
  review: style, register, tense, paragraph structure, transitions,
  orthography, grammar, punctuation, agreement, word order, prepositions,
  anacolutha, pleonasms, cacophonies, plural forms, and repetitions.
- Review Agent proposals are non-imposed, remain pending until human action,
  and support individual accept/reject decisions.
- Quality Agent statuses are `READY`, `READY_WITH_WARNINGS`, and `BLOCKED`.

Specialized subagents:

1. Terminology & Lexicography Subagent under Translation Agent.
2. Semantic Fidelity Subagent under Translation Agent.
3. Editorial Decision Subagent under Review Agent.
4. Planning & Coordination Subagent under Coordinator Agent.
5. Media Localization Subagent under Audio Agent and Video Agent.
6. Platform Engineering Subagent under Evolution Agent.

Parallel translation and review interface:

- Default two-column view: original text and current translation.
- Proposed replacement variants are displayed next to the relevant translated
  sentence.
- Original text is immutable.
- Translation remains unchanged until a proposal is accepted.
- Differences are highlighted.
- Accepted/rejected proposals are auditable.
- Version history is preserved.
- Optional three-column and four-column comparison modes support additional
  languages, versions, or comparison texts.

## Phase 7 Step 10 - Functional Testing of AI Agents

Status: Implemented as deterministic functional test coverage.

Scope:

- No new enterprise modules.
- Reuses AI Governance, Workflow, Audit, Review, Translation, Publishing,
  Library, Rights, and Editorial Pipeline infrastructure.
- No Docker or staging configuration changes.
- No breaking API changes.

Implemented validation:

- Functional integration tests for realistic editorial workflows.
- Reusable editorial fixtures for translated book, original manuscript,
  children's book, magazine issue, audiobook, and video publication.
- Deterministic mocked AI responses for offline/local validation.
- Coverage matrix for all 18 principal agents and all 6 specialized subagents.
- Workflow execution reports with expected result, actual result, pass/fail,
  detected gaps, and unresolved risks.
- Failure and boundary tests for unauthorized publication, workflow bypass,
  rights failure, malformed manuscript, missing translation segment,
  terminology conflict, semantic omission, timeout/retry handling, human
  override, and audit integrity.

Report:

- `docs/PHASE_7_STEP_10_AI_AGENT_FUNCTIONAL_TEST_REPORT.md`.

## Phase 7 Step 11 - Integrated Linguistic Knowledge Base

Status: Implemented as an extension of existing Lexicographic Intelligence,
Terminology, Translation, Semantic Fidelity, AI Governance, Audit, and Quality
infrastructure.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Uses existing lexicographic runtime persistence and audit tables.

Implemented capabilities:

- Project-level linguistic resource metadata for monolingual dictionaries,
  bilingual dictionaries, orthographic/orthoepic/morphological dictionaries,
  official grammar and punctuation rules, idioms, phraseological expressions,
  specialized glossaries, terminology databases, editorial guides, corpora, and
  usage examples.
- Resource metadata: language, language pair, title, publisher/institution,
  edition, publication year, version, source URL/imported document reference,
  license status, copyright holder, redistribution permission, authority level,
  domain, effective date, last verification date, and enabled status.
- `INTEGRATED_CONTENT` and `EXTERNAL_CONTROLLED_ACCESS` modes with guardrails
  preventing full copyrighted dictionary ingestion without authorization.
- Configurable Romanian linguistic source profile for DOOM, DEX-type
  resources, official grammar, orthographic and punctuation rules, bilingual
  dictionaries, phraseological dictionaries, and specialized dictionaries.
- Search by headword, phrase, idiom, language, language pair, domain,
  grammatical category, source, edition, authority level, and exact,
  normalized, fuzzy, or morphological modes.
- Source authority levels:
  `OFFICIAL_NORMATIVE > ACADEMIC > VALIDATED_SPECIALIZED > EDITORIAL_GUIDE >
  DESCRIPTIVE > INFORMATIVE`.
- Conflict reporting for competing definitions or source authorities with
  required human review and no silent replacement.
- Optional source edition, license, authority, and verification metadata in
  Translation, Terminology, and Semantic Fidelity evidence.
- Quality Agent resource readiness reporting for missing, outdated, disabled,
  or unauthorized sources.

Validation coverage:

- Monolingual and bilingual dictionary modeling.
- Idioms and expressions.
- Language-pair lookup.
- Source priority.
- Conflicting definitions.
- Edition traceability.
- License restrictions.
- Forbidden full-content ingestion.
- Translation Agent lookup.
- Terminology & Lexicography Subagent behavior.
- Semantic Fidelity validation.
- Review Agent recommendations.
- Quality Agent outdated-source detection.

Report:

- `docs/PHASE_7_STEP_11_INTEGRATED_LINGUISTIC_KNOWLEDGE_BASE_REPORT.md`.

## Phase 7 Step 12 - Platform-Wide Need-to-Know Access Model

Status: Implemented as an additive Workspace/IAM refinement.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Uses existing workspace, IAM/RBAC, project/document permissions, audit,
  runtime DB, backup/restore, and AI governance.

Implemented capabilities:

- Collaborator invitation flow with person, role, project scope, assigned
  documents/chapters/sections/segments, permitted tools, optional expiry, and
  access preview.
- Role-based visibility for translators, reviewers, layout specialists,
  illustrators, audio/video collaborators, collaborators, and administrators.
- Server-side access evaluation where the most restrictive valid rule wins.
- Hidden panels and restricted metadata are not returned for unauthorized
  access decisions.
- Temporary access expiration and immediate revocation metadata.
- Audit events for invitation sent/accepted, access granted/revoked, temporary
  expiration, restricted attempts, document opening, confidential resource
  access, AI agent data access, and human override.
- Runtime persistence and backup/restore coverage for workspace collaborator
  invitations and need-to-know grants.
- AI agent data access records minimum task scope and prevents self-expansion.

Validation coverage:

- Existing Workspace module reused; no separate Need-to-Know module.
- Invitation and preview endpoints.
- Effective access dimensions.
- Role-specific panels.
- Hidden restricted resources.
- Temporary and revoked access.
- AI agent minimum necessary data access.
- Runtime DB and backup/restore inclusion.

Report:

- `docs/PHASE_7_STEP_12_PLATFORM_NEED_TO_KNOW_ACCESS_MODEL_REPORT.md`.

## Phase 7 Step 13 - Editorial Workspace Final

Status: Implemented as the primary frontend production workspace.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses Projects, Project Dossiers, Editorial Process, Translation, Review,
  Publishing, Distribution, AI Governance, Audit, Library, and Need-to-Know
  access.

Implemented capabilities:

- `/workspace` route and home route render the unified Editorial Workspace.
- Single manuscript-centered workspace for Book, Children's Book, Magazine,
  Poetry, Dictionary, Course, Audiobook, and Video projects.
- Fast production action hub with common actions reachable in 2-3 clicks.
- Project queue connected to the existing Editorial Production Pipeline.
- Translation/review preview with immutable original, highlighted proposed
  variants, two-column default mode, and optional three/four-column review
  modes.
- Collaboration surface for invitation, role assignment, chapter assignment,
  segment assignment, comments, mentions, suggestions, accept/reject,
  synchronized updates, audit, and version history.
- InDesign-inspired production function inventory without reproducing Adobe UI.
- Publication format catalog and automatic adaptation targets for layout,
  templates, styles, guides, image placement, page numbering, export settings,
  and previews.
- Panel behavior model: collapsible, dockable, resizable, restorable,
  favorites, universal search, configurable shortcuts, and recently used tools.
- Performance readiness markers for large books, large magazines, thousands of
  pages, high-resolution illustrations, and multiple collaborators.

Validation coverage:

- Primary `/workspace` route and home route.
- Supported publication types.
- Production tools.
- Publication formats.
- Automatic adaptation.
- Translation/review modes.
- Collaboration and panels.
- Human Final Authority.
- No backend `EditorialWorkspaceModule`.

Report:

- `docs/PHASE_7_STEP_13_EDITORIAL_WORKSPACE_FINAL_REPORT.md`.

## Phase 7 Step 14 - Administration Review and Simplification

Status: Implemented as a frontend simplification and launch-readiness polish
step.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses existing Administration, IAM/RBAC, Need-to-Know, AI governance, audit,
  backup, security, integration, and system metadata concepts.

Implemented capabilities:

- `/admin` and `/administration` now use the same Administration configuration
  center.
- Administration is positioned as a platform configuration area, not a daily
  production workspace.
- Configuration is limited to two visible navigation levels: section and
  settings.
- Eleven approved sections are surfaced: organization, users, roles and
  permissions, AI agents, linguistic resources, editorial templates,
  publishing and distribution, security, audit and backup, integrations, and
  system.
- Role guidance makes administrator access explicit and keeps editors in
  production workspaces.
- Critical configuration areas are marked as requiring confirmation.
- Audit, reversibility, and Need-to-Know governance are visible.

Validation coverage:

- Administration routes.
- Approved section list.
- Two-level navigation rule.
- Role access guidance.
- Audit and critical confirmation safeguards.
- Responsive administration layout classes.

Report:

- `docs/PHASE_7_STEP_14_ADMINISTRATION_SIMPLIFICATION_REPORT.md`.

## Phase 7 Step 14.1 - Roles, Permissions and Subscription Entitlements

Status: Implemented as an additive Workspace/Administration access-policy
refinement.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses Workspace, Administration, IAM/RBAC, Need-to-Know access, audit, and
  existing subscription/billing placeholders.

Implemented capabilities:

- Central effective access policy:
  `Role permissions × Subscription entitlements × Need-to-Know scope`.
- Additive Workspace endpoints:
  - `GET /workspace/subscription`.
  - `POST /workspace/access/resolve`.
- Official operational role model separated from subscription plans.
- Subscription plan model for `FREE`, `BASIC`, `PREMIUM`, `BUSINESS`, and
  disabled `ENTERPRISE_RESERVED`.
- Plan entitlement and quota metadata for projects, collaborators, storage, AI
  usage, translation volume, export formats, team administration, retention,
  publishing, distribution, API access, and priority processing.
- Safe plan-limit behavior: existing content is preserved and only restricted
  new actions are blocked.
- Downgrade behavior: preserve content/audit/versions and mark over-limit
  resources read-only where necessary.
- Administration UI separates Users and Roles from Subscription and Usage.
- Audit actions for role changes, subscription changes, feature blocks, quota
  exceeded events, upgrades, downgrades, temporary access, and human override.

Validation coverage:

- No new subscription or billing module.
- Endpoint coverage.
- Role/plan separation.
- Effective access formula.
- Feature and quota blocking.
- Downgrade without data loss.
- Administration separation between roles and subscription usage.

Report:

- `docs/PHASE_7_STEP_14_1_ROLES_SUBSCRIPTION_ENTITLEMENTS_REPORT.md`.

## Phase 7 Step 14.2 - Unified Language Management

Status: Implemented as an additive Workspace/Administration language-policy
refinement.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses Projects, Translation, Review, Workspace, AI Governance, Linguistic
  Knowledge Base, Administration, and Audit.

Implemented capabilities:

- Central shared language policy for the four official attributes:
  `platformLanguage`, `originalLanguage`, `authoringLanguage`, and
  `targetLanguage`.
- Additive Workspace endpoints:
  - `GET /workspace/language-management`.
  - `POST /workspace/language-management`.
- Central language metadata stored through Workspace preferences metadata
  instead of duplicated per-panel settings.
- Project language model with one Original Language, one Authoring Language,
  and multiple Target Languages.
- Original Language immutability guard unless an authorized user explicitly
  changes it.
- UI localization helpers for language labels, workflow names, and AI agent
  names through Platform Language.
- Parallel review language-column metadata for default two-column review and
  optional three/four-column comparisons.
- Linguistic resource loading plan by Source Language to Target Language for
  dictionaries, glossaries, terminology, phraseology, and linguistic resources.
- Administration Central Language Management panel with installed/enabled
  languages, default Platform Language, fallback, completeness, dictionaries,
  glossaries, resources, and audit actions.
- Audit actions for Platform Language, Original Language, Authoring Language,
  Target Language additions/removals, and language resource updates.

Validation coverage:

- Shared language-policy contract tests.
- Workspace language-management contract tests.
- Frontend language-management UI contract tests.
- Existing language-policy UI and backend contracts remain in place.

Report:

- `docs/PHASE_7_STEP_14_2_UNIFIED_LANGUAGE_MANAGEMENT_REPORT.md`.

## Phase 7 Step 14.3 - Advanced Linguistic Resources & Translation Memory

Status: Implemented as an additive extension of the existing Linguistic
Knowledge Base, Translation, Terminology & Lexicography, Semantic Fidelity,
Review, AI Governance, and Audit infrastructure.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses existing Translation Memory, Terminology, Lexicographic Intelligence,
  runtime database, backup/restore, and frontend Administration/Translation
  surfaces.

Implemented capabilities:

- Project-configurable source consultation priority with drag-and-drop-ready
  ordering metadata.
- Default source priority:
  official normative source, project glossary, specialized glossary,
  Translation Memory, bilingual dictionary, explanatory dictionary, and
  corpus/examples.
- Runtime persistence and backup coverage for project source priority
  configuration.
- Translation Memory entries enriched with source segment, translated segment,
  language pair, project/document/segment references, domain, context, author,
  reviewer, approval date, confidence, and version.
- Translation Memory proposal lookup supports exact, fuzzy, and context match.
- Translation Memory remains proposal-only and never replaces text
  automatically.
- Translation flow stores Translation Memory entries only when the submitted
  translation passes validation as a validated translation.
- Glossary hierarchy:
  Project Glossary > Platform Glossary > Personal Glossary suggestions.
- Personal glossary entries remain optional suggestions and do not become
  authoritative over project/platform terminology.
- Glossary conflict detection requiring human review.
- Linguistic proposal explanation with confidence score, consulted sources,
  glossary used, Translation Memory match, terminology status, semantic
  validation, and rationale.
- Audit coverage for glossary created/updated/conflict, Translation Memory
  entry added/reused, source priority changed, and confidence recalculated.
- Administration and Translation Workspace display source priority, glossary
  hierarchy, TM proposals, confidence, and proposal-only guidance.

Validation coverage:

- Glossary priority.
- Translation Memory exact, fuzzy, and context match.
- Source priority.
- Confidence score.
- Conflict detection.
- Proposal explanation.
- Audit event coverage.

Report:

- `docs/PHASE_7_STEP_14_3_ADVANCED_LINGUISTIC_RESOURCES_REPORT.md`.

## Phase 7 Step 14.4 - Organization, Teams and Platform Creator

Status: Implemented as an additive Administration and access-governance
refinement.

Scope:

- No new enterprise module.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses Administration, Users, Roles, Permissions, Need-to-Know, Audit, and
  Workspace access filtering.

Implemented capabilities:

- Organization Management with organization profile, organization type, teams,
  members, and invitations.
- Supported organization types:
  `PERSOANA_FIZICA`, `EDITURA`, `ASOCIATIE_ONG`, `COMPANIE`, and
  `INSTITUTIE`.
- Default organization type: `PERSOANA_FIZICA`.
- Runtime persistence and backup coverage for organization administration
  metadata and teams.
- Default teams:
  Echipa Traducere, Echipa Revizie, Echipa Machetare, Echipa Ilustrații,
  Echipa Multimedia, Echipa Publicare, Echipa Marketing, and Echipa
  Publicitate.
- Teams can carry projects, tasks, documents, and workflow responsibility
  metadata.
- Protected `PLATFORM_CREATOR` / `Creatorul platformei` system role.
- Platform Creator is separate from Administrator, cannot be assigned through
  normal Administration flows, cannot be removed/downgraded through membership
  removal, and is independent of subscription limits.
- Workspace and administrative permission gates recognize Platform Creator as
  an unrestricted system role.
- Administration UI displays organization model, teams, Creator protections,
  and relevant audit actions.

Validation coverage:

- Backend contract coverage for organization types, default teams, protected
  Platform Creator role, audit actions, runtime persistence, and backup tables.
- Frontend contract coverage for Organization Management, team labels,
  Creator protections, and audit actions.

Report:

- `docs/PHASE_7_STEP_14_4_ORGANIZATION_TEAMS_PLATFORM_CREATOR_REPORT.md`.

## Phase 7 Step 14.5 - AI Providers & Cost Management

Status: Implemented as an additive AI Governance and Administration
refinement.

Scope:

- No new enterprise module.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses AI Governance, AI Orchestrator, Administration, Subscription Plans,
  Audit, Organization Management, and Workspace.

Implemented capabilities:

- OpenAI is modeled as the primary v1.0 AI provider.
- Anthropic is modeled as the fallback v1.0 AI provider.
- Provider status records persist in the runtime database and backup/restore
  set.
- Automatic fallback activates when the primary provider times out, is
  unavailable, returns an API error, or is in configured outage.
- Fallback recovery is auditable when the active provider returns to OpenAI.
- Model selection defaults to automatic, with manual selection guarded by role
  and subscription entitlement.
- Subscription plan model includes `FREE`, `BASIC`, `PREMIUM`, `BUSINESS`, and
  disabled `ENTERPRISE_RESERVED`.
- AI cost summary tracks monthly budget, remaining budget, monthly
  consumption, consumption by AI agent, and consumption by project.
- Budget warnings are tracked at 80%, 90%, and 100%.
- Reaching a limit blocks only the restricted AI action and never deletes data.
- Platform Creator remains unrestricted for AI usage, testing, and monitoring.
- Administration displays configured providers, active provider, fallback
  status, budget, consumption, remaining budget, usage history, and audit
  actions.

Validation coverage:

- Provider fallback and recovery.
- Automatic/manual model selection metadata.
- Budget limits and warning thresholds.
- Subscription plan model.
- Platform Creator unlimited access.
- Audit event coverage.
- Runtime backup/restore coverage.

Report:

- `docs/PHASE_7_STEP_14_5_AI_PROVIDERS_COST_MANAGEMENT_REPORT.md`.

## Phase 7 Step 15 - Intelligent Editorial Library & UX Finalization

Status: Implemented as an additive extension of the existing Library.

Scope:

- No new enterprise module.
- No separate Archive module.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses Projects, Manuscripts, Project Dossiers, Translation, Review, Layout,
  Publishing, Distribution, Rights & Provenance, Unified Language Management,
  Audit, Versioning, Backup, and Need-to-Know infrastructure.

Implemented capabilities:

- Unified Library publication records for editorial lifecycle management.
- Lifecycle statuses: `STOC_REAL`, `IN_LUCRU`, and `PUBLICAT`.
- Status transitions:
  - Stoc real to În lucru.
  - În lucru to Publicat.
  - Publicat to În lucru for new edition/revision.
- Historical versions are immutable and preserved during status changes.
- Publication type remains metadata/filter, not a separate Library module.
- Search supports exact, normalized, fuzzy, partial title, author,
  multilingual metadata, ISBN, series, and collection matching.
- Filters cover author, language, editorial domain, publication type,
  lifecycle status, publication year, original publication year, rights
  status, format, series, and collection.
- Grid/list view and persistent user view preference metadata.
- Publication records connect original edition, manuscript, project, workflow,
  translations, review, layout, publishing, files, formats, editions, versions,
  rights, provenance, publishing history, and distribution status.
- Visibility is independent from lifecycle status and supports `PUBLIC`,
  `PRIVATE`, and `INTERNAL_WORKING_PUBLICATION`.
- Library preview returns safe metadata only and does not expose restricted
  content.
- Bulk actions support status changes, collections, series, tags, metadata
  export/update, project assignment, public/private marking, rights validation,
  and reporting.
- Duplicate detection compares normalized title, author, ISBN, original title,
  and source file fingerprint, with no automatic merge.
- Runtime persistence and backup/restore cover publications, editions,
  versions, files, preferences, and audit references.
- Frontend Library workspace exposes primary search, filter chips, advanced
  filters, grid/list views, quick preview, contextual actions, bulk actions,
  and lifecycle overview while preserving the existing reader experience.

Validation coverage:

- Alphabetical organization, sorting, title/author/multilingual search, and
  filters.
- Grid/list switching and persistent preferences.
- Lifecycle status transitions and visibility independence.
- Publication record completeness.
- Manuscript/project relationships.
- Edition and version history.
- Rights metadata and format availability.
- Preview authorization and restricted metadata protection.
- Bulk actions.
- Duplicate detection and no automatic merge.
- Library Agent and Quality Agent behavior boundaries.
- Audit completeness.
- Backup and restore.

Report:

- `docs/PHASE_7_STEP_15_INTELLIGENT_EDITORIAL_LIBRARY_REPORT.md`.

## Phase 7 Step 16 - Publishing Workflow, Final Preflight and Distribution Tracking

Status: Implemented as an additive refinement of the existing Layout &
Publishing, Library, Export, Rights & Provenance, Workflow, Quality, Audit, and
Backup infrastructure.

Scope:

- No new enterprise module.
- No separate Preflight module.
- No separate Archive module.
- No social-media promotion implementation.
- No Docker or staging configuration changes.
- No breaking API changes.

Implemented capabilities:

- Publishing states: `IN_PREGATIRE`, `GATA_PENTRU_PUBLICARE`, `PUBLICAT`,
  `REPUBLICAT`, and `RETRAS_DIN_PUBLICARE`.
- Final preflight aggregation with statuses `PASS`, `WARNING`, `ERROR`,
  `NOT_APPLICABLE`, and `PENDING`.
- Preflight severities `INFORMATIONAL`, `WARNING`, and `CRITICAL`.
- Approved publication channels: `INTERNAL_LIBRARY`, `PUBLIC_PORTAL`,
  `DIGITAL_BOOKSTORE`, `EXTERNAL_EXPORT`, and `PRINT_ON_DEMAND`.
- Official edition/version selection from Library records.
- Immutable published edition snapshots.
- Critical preflight errors block publication.
- Distribution history records delivery state and channel events without
  duplicating Library metadata, export files, or rights records.
- Withdrawal and republication preserve audit, versions, generated artifacts,
  and distribution history.
- Runtime database and deterministic backup/restore support for publishing
  preflight results, publishing records, and publishing distribution records.
- Distribution Center UI displays publishing state, readiness percentage,
  official preflight status, source component, severity, remediation link, and
  approved publication channels.

Validation coverage:

- Publishing state transitions.
- Readiness/preflight aggregation.
- Rights/provenance blocking.
- Immutable official edition records.
- Distribution history.
- Audit event coverage.
- Backup/restore compatibility.
- No duplicate Preflight or Distribution module.
- No social-media promotion workflow.

Report:

- `docs/PHASE_7_STEP_16_PUBLISHING_PREFLIGHT_DISTRIBUTION_REPORT.md`.

## Documentation-Only Governance Requirements

The following requirements are approved for specification and JSON Master Format
documentation, but are not authorized for implementation until explicitly
scheduled:

- Translation Rules Versioning.
- Translation Rule Impact Analysis.
- Rule change approval for existing publications.
- Identification of publications translated under older rule versions.
- Rule Source Authority for rules and exceptions.
- Authority Confidence Levels for conflicting source authorities.
- Magazine Platform Vision original-language flexibility and future publication
  alignment requirements.
- Media Localization Studio as a Future/Post-Beta basic editorial media
  localization module, explicitly excluding advanced video editing and
  professional compositing.
- Phase 2 Planning Foundation for Lexicographic Intelligence, Layout &
  Editorial Production, AI Video & Visual Creation, Audio Narration, Platform
  Engineering Coordination, AI Orchestration, and JSON Master future fields.
