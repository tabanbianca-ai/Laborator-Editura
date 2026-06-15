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
