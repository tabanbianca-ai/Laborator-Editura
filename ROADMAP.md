# Roadmap

## Current Priority

The architecture is frozen for MVP implementation. Build only the core
translation platform first.

MVP stabilization is active. Prioritize implementation, integration, and testing
of existing approved modules over new design work.

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
