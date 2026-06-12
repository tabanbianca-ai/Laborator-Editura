# Codex Master Task List - Translation Platform

This file transfers the ChatGPT build plan into this Codex workspace.

Working name: Laboratorul Editurii

## Base Stack

- Frontend: Next.js App Router
- Backend: NestJS
- AI service: FastAPI
- Database: PostgreSQL + Prisma
- Realtime: Yjs + WebSockets + Redis
- Monorepo: Turborepo
- Infrastructure: Docker Compose

## Execution Rule

Codex must always:

1. Implement one task at a time.
2. Write tests where possible.
3. Avoid large refactors.
4. Preserve architecture boundaries.
5. Never change the semantic fidelity rule.

Core design principle:

Translation fidelity > fluency > stylistic adaptation, without breaking meaning, context, or author intent.

Expanded semantic fidelity principle:

The translation must preserve the meaning, intent, context, and terminology of the
original author while ensuring fluency and naturalness in the target language,
without reinterpretations that change the author's fundamental message.

## Phase 0 - Monorepo Foundation

### Task 0.1 - Create monorepo structure

- Initialize Turborepo.
- Set up pnpm workspaces.
- Create folders:
  - `/apps/web`
  - `/apps/api`
  - `/apps/ai`
  - `/packages/shared`
  - `/packages/db`
- Add TypeScript base config.
- Add ESLint + Prettier.
- Add shared tsconfig.

### Task 0.2 - Docker base environment

- PostgreSQL container.
- Redis container.
- API container.
- Web container.
- Add `docker-compose.yml`.

### Task 0.3 - Shared database package

- Prisma init.
- Create schema base.
- Set up migrations system.

## Phase 1 - Auth + RBAC + Security Core

### Task 1.1 - Authentication system

- JWT authentication.
- Refresh tokens.
- Login and register endpoints.
- Password hashing with bcrypt.

### Task 1.2 - RBAC system

Roles:

- `ADMIN`
- `TRANSLATOR`
- `REVIEWER`
- `VIEWER`

Implement:

- Role guards.
- Route protection middleware.
- Permission decorators.

### Task 1.3 - Audit system

Log every action:

- `userId`
- `action`
- `timestamp`
- affected entity
- before and after state

## Phase 2 - Document Core System

### Task 2.1 - Document model

- `Document`
- `DocumentSegment`
- `DocumentVersion`

### Task 2.2 - Document API

- Create document.
- Get document.
- Update document.
- Delete document.
- List documents.

### Task 2.3 - Versioning system

- Every edit creates a snapshot.
- Immutable history.
- Rollback support.

## Phase 3 - Realtime Collaboration

### Task 3.1 - Yjs integration

- Yjs document model.
- WebSocket sync server.
- Presence system.

### Task 3.2 - Live cursors

- Track cursor positions.
- Display per-user color.
- Sync in real time.

### Task 3.3 - Conflict resolution

- CRDT automatic merge.
- No overwrite conflicts.

## Phase 4 - Translation Engine Core

### Task 4.1 - Translation model

- Source text.
- Target text.
- Segment-based structure.

### Task 4.2 - Translation editor API

- Segment fetch.
- Segment update.
- Auto-save.
- Sync with CRDT layer.

### Task 4.3 - Translation Memory

- Store translated segments.
- Similarity search.
- Reuse suggestions.

## Phase 5 - Terminology System

### Task 5.1 - Glossary system

- Glossary table.
- Domain structure.
- Multi-language support.

### Task 5.2 - Dictionary integration layer

- Pluggable sources.
- DEX for Romanian.
- DOOM for Romanian.
- External dictionaries per language.
- Expression support.

### Task 5.3 - Terminology enforcement engine

- Force consistency rules.
- Highlight forbidden terms.
- Suggest approved terms.

## Phase 6 - QA + Semantic Engine

### Task 6.1 - QA engine

- Missing segments.
- Number mismatches.
- Punctuation.
- Formatting errors.
- Terminology violations.

### Task 6.2 - Semantic fidelity engine

- Detect meaning drift.
- Compare source and translation.
- Flag reinterpretations.

### Task 6.3 - AI explainability layer

- Reason.
- Source.
- Confidence score.
- Alternatives.

## Phase 7 - Translation Competency System

### Task 7.1 - User skill model

- XP system.
- Levels.
- Domain specialization.

### Task 7.2 - Scoring engine

- Semantic score.
- Terminology score.
- Fluency score.
- QA score.

### Task 7.3 - Progression system

- Unlock features based on competence.
- Restrict advanced workflow actions.

## Phase 8 - Learning Games

- Task 8.1 - Synonyms engine.
- Task 8.2 - Antonyms engine.
- Task 8.3 - Context disambiguation game.
- Task 8.4 - Sentence reconstruction.
- Task 8.5 - Terminology matching.
- Task 8.6 - Fidelity detection game.
- Task 8.7 - Adaptive difficulty system.

Phase 21 operationalizes this system as a permanent Translation Academy module,
not as a separate game product.

## Phase 9 - Knowledge System

### Task 9.1 - Corpus manager

- Store real translations.
- Searchable corpus.

### Task 9.2 - Knowledge graph

- Authors.
- Terms.
- Concepts.
- Translations.

### Task 9.3 - Author profile engine

- Style memory per author.
- Terminology fingerprint.

## Phase 10 - Search Engine

- Task 10.1 - Full-text search.
- Task 10.2 - Semantic search.
- Task 10.3 - Cross-document search.

## Phase 11 - Analytics + Health

### Task 11.1 - Project health score

- QA score.
- Semantic score.
- Consistency score.

### Task 11.2 - Dashboard metrics

- Translator performance.
- Project quality trends.

## Phase 12 - Import / Export

### Task 12.1 - Import formats

- DOCX.
- PDF.
- TXT.
- EPUB.

### Task 12.2 - Export engine

- PDF.
- EPUB.
- HTML.
- Print-ready.

## Phase 13 - Governance System

### Task 13.1 - Terminology governance

- Approve terms.
- Reject terms.
- Suspend terms.

### Task 13.2 - Editorial rules engine

- Per-language rules.
- Per-domain rules.

## Phase 14 - Citation System

### Task 14.1 - References manager

- Citations.
- Bibliography.

## Phase 15 - Expert Review System

### Task 15.1 - Review workflow

- Assign expert reviewers.
- Approval pipeline.

## Phase 16 - Offline Mode

### Task 16.1 - Local storage

- IndexedDB for web.
- SQLite for desktop or mobile.

### Task 16.2 - Offline sync engine

- CRDT sync reconciliation.
- Conflict-free merge.

## Phase 17 - AI Service

- Task 17.1 - Translation suggestion API.
- Task 17.2 - QA analysis API.
- Task 17.3 - Semantic drift detection API.

## Phase 18 - Production Hardening

- Task 18.1 - Logging system.
- Task 18.2 - Monitoring and observability.
- Task 18.3 - Rate limiting.
- Task 18.4 - Security headers.

## Phase 19 - Final Integration

### Task 19.1 - Connect all services

- Web to API.
- API to AI.
- Realtime sync.
- Database consistency.

### Task 19.2 - End-to-end flow test

Flow:

Login -> create document -> translate segments -> AI feedback -> QA check -> version saved -> audit logged -> export.

## Phase 21 - Translation Competency & Progression System

Objective:

- Continuously grow translator competency and validate professional level through
  real translation activity, semantic verification, terminology knowledge, and
  integrated linguistic exercises.

Ecosystem integration:

Language Authority Layer -> Translation Competency System -> Translation
Workflow -> Translation Memory -> Global Editorial Memory -> Publishing.

Positioning:

- Translation Learning & Competency Games are a permanent professional
  development mechanism inside the platform.
- This module is part of the same platform pillar set as translation,
  terminology management, semantic fidelity, and translation competency.
- TLCG is not a separate game product; it is part of the translation workflow.
- It must integrate with CRDT, Offline-First, Translation Memory, Global
  Editorial Memory, Language Authority Layer, Semantic Fidelity Engine,
  Workflow, Audit, Dashboard, Agenda, enterprise security, and publishing.

TLCG platform functions:

- Linguistic training.
- Competency validation.
- TCPS progression unlocks.

Functional system flow:

Translation Editor -> TCPS Evaluation Engine -> TLCG Games Layer -> Skill Update
-> Access Control with RBAC and leveling.

Official permanent modules:

1. Translation Competency & Progression System.
2. Translation Learning & Competency Games.
3. Translation Academy UI.
4. Certification Center.
5. Recovery Mode.
6. Domain Specialization System.
7. AI Learning Assistant.

Submodules:

- Competency Engine.
- Translator Progression Engine.
- Certification Engine.
- Training Engine.
- Semantic Challenge Engine.
- Terminology Challenge Engine.
- Domain Specialization Engine.
- Translation Gate System.
- Translation Learning & Competency Games Layer.

### Task 21.1 - Translation Academy UI

Main menu:

- Dashboard.
- Projects.
- Translation Editor.
- Terminology.
- Workflow.
- Agenda.
- Translation Academy.
- Reports.
- Administration.

UI direction:

- Duolingo-style progression for motivation.
- SDL Trados-style professional translation context.
- Enterprise dashboard clarity for scores, risk, and progress.

### Task 21.2 - Competency dashboard

Cards:

- Current level.
- Total XP.
- Certifications.
- Semantic score.
- Terminology score.
- Fidelity score.
- Fluency score.
- Domain progress.

### Task 21.3 - Skill tree

General Translation:

- Semantic Fidelity.
- Terminology.
- Fluency.
- Expressions.
- Context Analysis.

Domains:

- Philosophy.
- Spirituality.
- Spiritism.
- Medicine.
- Law.
- Technical.
- Science.

### Task 21.4 - Learning Center

Sections:

- Synonyms Engine: the user receives a word and generates semantically accurate,
  context-relevant, lexically diverse synonyms.
- Antonyms Engine: the user provides accurate opposite terms in context.
- Context Disambiguation Game: the user selects the correct sense for ambiguous
  words based on sentence context.
- Segment Reconstruction Game: the user reconstructs a mixed sentence in the
  correct order.
- Terminology Matching Game: the user associates term, definition, domain, and
  source such as DEX, DOOM, or glossary.
- Fidelity Detection Game: the user compares two translations and identifies
  which is faithful and which introduces interpretation.
- Translation Micro-Segments Game: read, translate, correct, receive score, and
  continue.
- Domain Challenge Mode: the user translates with correct domain terminology for
  philosophy, medicine, spiritism, law, and technical fields.
- Expression Equivalence Game: the user identifies equivalent expressions across
  languages.

### Task 21.5 - Translation Recovery Mode

Flow:

Translation -> insufficient score -> Recovery Mode -> personalized exercises ->
reevaluation -> continue translation.

Requirements:

- Trigger Recovery Mode when the minimum score threshold is not reached.
- Generate personalized exercises from the user's actual errors.
- Return the user directly to the interrupted translation context.
- Trigger TLCG automatically when translation score is low, semantic errors are
  detected, or terminology reinforcement is required.
- TLCG exercises are not fully optional when required for professional training
  or access to advanced workflows.

### Task 21.6 - Certification Center

Internal certifications:

- Junior Translator.
- Translator.
- Senior Translator.
- Expert Translator.

Specializations:

- Philosophy.
- Spirituality.
- Spiritism.
- Medicine.
- Law.
- IT.
- Technical.

### Task 21.7 - Translation Editor integration

In the editor, each segment can display:

- Semantic Score.
- Terminology Score.
- Fluency Score.
- Fidelity Score.
- Suggestions.

When a problem appears:

- Show semantic issue warning.
- Offer Open Learning Challenge.
- Let the user solve the challenge and return immediately to translation.

### Task 21.8 - Backend modules

NestJS modules:

- `competency`
- `training`
- `certification`
- `learning`
- `tlcg`
- `domain-specialization`
- `progression`
- `translator-progression`
- `translation-gate`
- `competency-audit`
- `semantic-challenge`
- `terminology-engine`
- `domain-engine`

API:

- `GET /competency/profile`
- `GET /competency/skills`
- `GET /competency/certifications`
- `GET /learning/games`
- `POST /learning/start`
- `POST /learning/submit`
- `POST /learning/games/start`
- `POST /learning/games/submit`
- `GET /training/challenges`
- `POST /training/answer`
- `GET /certifications`
- `POST /certifications/exam`
- `GET /progression/access`
- `POST /progression/recalculate`
- `GET /progression/levels`
- `POST /translation-gate/evaluate`
- `GET /segments/:segmentId/gate`
- `GET /competency/audit`

### Task 21.9 - Database model

Tables:

- `competency_profiles`
- `competency_scores`
- `translator_levels`
- `translator_level_assignments`
- `skill_trees`
- `skill_nodes`
- `learning_sessions`
- `learning_attempts`
- `game_engines`
- `game_sessions`
- `game_results`
- `game_score_breakdowns`
- `training_challenges`
- `challenge_answers`
- `certifications`
- `certification_results`
- `domain_specializations`
- `translator_progress`
- `skill_unlocks`
- `level_unlock_rules`
- `minimum_score_thresholds`
- `segment_gate_results`
- `translation_gate_events`
- `competency_audit_events`
- `domain_certification_rules`
- `xp_transactions`

### Task 21.10 - AI service learning endpoints

FastAPI endpoints:

- `POST /ai/generate-challenge`
- `POST /ai/evaluate-answer`
- `POST /ai/explain-error`
- `POST /ai/recommend-training`

Requirements:

- Generate challenges from translation context, terminology violations, and
  semantic fidelity issues.
- Explain errors with source, reason, confidence, and alternatives.
- Recommend training based on competency history and current project risks.
- Adapt difficulty based on user performance and domain specialization.
- Create new linguistic scenarios when existing challenges are insufficient.

AI authority limits:

- AI can generate exercises.
- AI can explain errors.
- AI can adapt difficulty.
- AI can create new scenarios.
- AI cannot approve levels.
- AI cannot grant certifications.
- AI cannot modify final scores.

### Task 21.11 - Frontend routes and components

Next.js pages:

- `/academy`
- `/academy/dashboard`
- `/academy/challenges`
- `/academy/skills`
- `/academy/certifications`

Components:

- `SkillTree`
- `XPProgressBar`
- `ChallengeCard`
- `CertificationCard`
- `RecoveryMode`
- `SemanticChallenge`
- `TerminologyChallenge`

### Task 21.12 - Gamification system

Systems:

- XP.
- Levels.
- Achievements.
- Badges.
- Certifications.
- Domain Mastery.

Achievement examples:

- 100 correct synonyms.
- 500 translated segments.
- 50 philosophy exercises.
- Terminology Master.
- Semantic Fidelity Expert.

Core score outputs per game:

- Semantic Score.
- Terminology Score.
- Accuracy Score.
- Consistency Score.
- Fluency Score.

TCPS effects:

- Increase translator level.
- Unlock AI features.
- Permit access to advanced workflow actions.
- Update domain mastery.
- Feed access control decisions through RBAC and leveling.

### Task 21.13 - Learning fidelity rule

All exercises and evaluations must be built around the central rule:

The translation must preserve the meaning, intent, context, and terminology of the
original author while ensuring fluency and naturalness in the target language,
without reinterpretations that change the author's fundamental message.

### Task 21.14 - Implementation acceptance criteria

Backend acceptance:

- NestJS exposes the competency, learning, training, certification, progression,
  and TLCG endpoints listed in this phase.
- Each game submission creates a score breakdown with semantic, terminology,
  accuracy, consistency, and fluency scores.
- TCPS progression recalculates from verified learning results.
- RBAC and leveling can block or unlock advanced workflow actions.
- Certification approval remains outside AI authority.

Frontend acceptance:

- Translation Academy appears in the main navigation.
- Academy dashboard shows current level, XP, certifications, core scores, and
  domain progress.
- Skill tree renders both General Translation and Domains.
- Challenges can be started, answered, scored, and reviewed.
- Recovery Mode can launch from the Translation Editor and return the user to
  the interrupted segment.
- Certification Center lists internal certifications and specialization tracks.

AI service acceptance:

- AI can generate challenges, evaluate answers, explain errors, and recommend
  training.
- AI explanations include reason, source, confidence, and alternatives.
- AI cannot approve levels, grant certifications, or modify final scores.

### Task 21.15 - MVP implementation order

1. Create database schema for competency profiles, skill trees, game sessions,
   score breakdowns, progress, and XP transactions.
2. Implement NestJS competency and learning modules with profile, skills, game
   start, game submit, and progression recalculation endpoints.
3. Implement FastAPI challenge generation and answer evaluation stubs with clear
   contracts for later model integration.
4. Build `/academy/dashboard`, `/academy/challenges`, `/academy/skills`, and
   `/academy/certifications`.
5. Add Translation Editor entry point: semantic issue -> Open Learning Challenge.
6. Add Recovery Mode flow and return-to-segment behavior.
7. Add certification and domain specialization rules after scoring is stable.

### Task 21.16 - Competency Engine scoring dimensions

The Competency Engine calculates user scores from real translation and training
activity across these dimensions:

- Semantic fidelity.
- Terminological fidelity.
- Fluency.
- Grammar correctness.
- Consistency.
- Glossary compliance.
- Domain rule compliance.

### Task 21.17 - Translator levels

Level 0 - Guest:

- Read-only access.
- Cannot translate, approve, review, or publish.

Level 1 - Apprentice Translator:

- Can translate simple segments.
- Can complete exercises.
- Cannot approve or publish.

Level 2 - Junior Translator:

- Can translate complete documents.
- Can use Translation Memory.

Level 3 - Translator:

- Can participate in professional projects.

Level 4 - Senior Translator:

- Can review translations.

Level 5 - Specialist Translator:

- Domain-based level for medicine, philosophy, spirituality, spiritism, law, IT,
  and technical translation.

Level 6 - Expert Translator:

- Can validate terminology.
- Can lead projects.

### Task 21.18 - Translation Gate System

Flow:

Read -> understand -> translate -> correct -> semantic validation -> continue.

Rule:

- If the minimum score is not reached, the segment cannot be finalized.
- The system explains the problems.
- The system proposes relevant exercises.
- The user can retry after training or correction.

### Task 21.19 - Segment progression

Translation progresses by sentence or segment:

Segment 1 -> minimum score reached -> Segment 2 -> minimum score reached ->
Segment 3.

Requirements:

- Each segment stores gate status and score breakdown.
- Segment completion requires the configured minimum score threshold.
- Segment progression must remain compatible with CRDT collaboration and
  offline sync.

### Task 21.20 - Thirty percent progression rule

If the user has correctly translated and corrected at least 30 percent of the
text and the minimum scores are reached, then the user can:

- Continue with the next segments.
- Unlock additional features.
- Progress toward level or domain mastery updates.

The 30 percent rule must be configurable by project, domain, and workflow policy.

### Task 21.21 - Re-entry through exercises

When a user encounters difficulty, they can re-enter progression through:

- Synonyms.
- Antonyms.
- Expressions.
- Terminology.
- Contextual meaning.

The resulting exercise scores can improve competency only when verified by TCPS
rules and audit history.

### Task 21.22 - Domain certification rules

Philosophy certification checks:

- Philosophical concepts.
- Authors.
- Terminology.

Spirituality certification checks:

- Spiritual concepts.
- Established expressions.

Spiritism certification checks:

- Validated terminology.
- Specialized glossaries.

Medicine certification checks:

- Medical terminology.
- Definitions.

### Task 21.23 - TCPS audit

The system records:

- Completed exercises.
- Results.
- Levels obtained.
- Certifications.
- Progress.
- Gate evaluations.
- Score changes.
- Access unlocks and blocks.

### Task 21.24 - Competency-based access principle

Access to professional responsibilities and certain advanced platform features
is not determined only by subscription. It is also determined by demonstrated
competency through real translations, semantic fidelity, terminology knowledge,
and measurable progress inside TCPS.

## Enterprise Expansion - Phases 22-36

These components extend the approved platform architecture without removing or
replacing any previously defined functionality or architectural decision.

## Phase 22 - Quality Assurance Engine

Automatic checks:

- Numbers.
- Dates.
- Units of measure.
- Proper names.
- HTML/XML tags.
- Required terminology.
- Omitted segments.
- Duplicate segments.
- Punctuation.
- Formatting.

Scoring:

- QA score per document.
- QA score per project.

## Phase 23 - Corpus Manager

Corpus library sources:

- Complete books.
- Articles.
- Historical documents.
- Validated translations.
- Technical documentation.
- Thematic collections.
- Specialized corpora.

Functions:

- Contextual search.
- Real usage examples.
- Terminology reuse.

## Phase 24 - Source Traceability Engine

For every suggestion or term, the system must answer:

- Where does it come from?

Possible sources:

- Dictionary.
- Glossary.
- Translation Memory.
- GEM.
- Corpus.
- Previous books or validated historical translations.
- Editorial decision.
- AI.

Requirements:

- Complete audit trail.
- Source attribution for terminology and AI suggestions.

## Phase 25 - Author Profile Engine

Semantic profile per author.

Contains:

- Preferred terminology.
- Recurring concepts.
- Style.
- Frequent expressions.
- Specific rules.

Used by:

- AI.
- Consistency Engine.
- Semantic Fidelity Engine.

## Phase 26 - Comparative Translation Analysis

Simultaneous comparison:

- Original.
- Current translation.
- Previous versions.
- Historical translations.

Requirements:

- Automatically highlight semantic differences.
- Support version-to-version translation analysis.

## Phase 27 - Citation & Reference Manager

Manage:

- Footnotes.
- Bibliography.
- Citations.
- Academic references.
- Documentary sources.

Requirements:

- Export in standard reference formats.
- Preserve citations across publication formats.

## Phase 28 - Translation Health Score

Global indicators:

- Semantic Fidelity.
- Terminology.
- Consistency.
- Fluency.
- QA.
- Risk Level.

Score levels:

- Segment.
- Document.
- Project.

## Phase 29 - Knowledge Graph Engine

Connects:

- Authors.
- Concepts.
- Terms.
- Books.
- Translations.
- Glossaries.
- Domains.

Requirements:

- Semantic exploration.
- Cross-linking between terminology, sources, authors, and documents.

## Phase 30 - Multi-Version Publishing Engine

Single source of truth:

- JSON Master Format.

Architectural rule:

- Every publication output must be generated from the JSON Master Format.
- No format-specific publication file can become the source of truth.

Generate:

- PDF.
- EPUB.
- MOBI.
- HTML.
- Print.

Requirements:

- Preserve source structure, citations, and terminology metadata through export.

## Phase 31 - Governance & Standards System

No code changes required for rule definition.

Administrators can define:

- Editorial rules.
- Terminology rules.
- Rules by language.
- Rules by domain.
- Rules by collection.

## Phase 32 - Expert Review Network

Validated expert network.

Domains:

- Medicine.
- Philosophy.
- Spirituality.
- Spiritism.
- Law.
- IT.
- Engineering.
- Technical domains.

Permissions:

- Approve terminology.
- Validate terminology.
- Participate in review workflows.

## Phase 33 - Offline Knowledge Packs

Downloadable packs.

Examples:

- Philosophy.
- Spirituality.
- Spiritism.
- Medicine.
- Law.

Contains:

- Dictionaries.
- Glossaries.
- Translation Memory.
- Corpora.

Requirements:

- Offline operation.
- Sync when the user returns online.

## Phase 34 - AI Explainability Layer

Mandatory for every AI recommendation.

For each suggestion:

- Reason.
- Source.
- Confidence score.
- Alternatives.

Rule:

- AI must never be a black box.

## Phase 35 - Terminology Governance Board

Term states:

- Proposed.
- Under Review.
- Validated.
- Suspended.
- Archived Historically.

Requirements:

- Audit.
- Approval.
- Complete history.
- Specialized terminology governance.

## Phase 36 - Benchmark Translation Suite

Benchmark text collection.

Used for:

- Translator evaluation.
- AI evaluation.
- Certifications.
- Performance comparisons.

## Final Target Ecosystem

After these enterprise components are integrated, the platform supports:

- Specialized translation.
- Terminology management.
- Semantic control.
- Real-time collaboration.
- Translator training and certification.
- Complete traceability.
- Multi-format publishing.
- Offline-first operation.
- Windows, macOS, Android, and Web support.
- Explainable and controlled AI.
- Enterprise terminology and editorial governance.

## Strategic Priority Set

If implementation must be narrowed to the five most important enterprise
components, prioritize:

1. Quality Assurance Engine.
2. Source Traceability Engine.
3. Author Profile Engine.
4. AI Explainability Layer.
5. Knowledge Graph Engine.

Together with Semantic Fidelity Engine, Language Authority Layer, Translation
Memory, Global Editorial Memory, CRDT collaboration, Workflow, Competency System,
and Offline-First support, these priorities define the platform as a professional
translation ecosystem centered on semantic fidelity, traceability, and quality.
