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
- TCPS/TLCG: minimal competency profile, training challenge, scoring, and
  progression support.
- AI: suggestion and explanation integrations that remain under human final
  authority.
- Publishing: export from JSON Master Format.

## Future Phase - Video Localization & Media Studio

Status: Future Phase. Not scheduled for implementation yet.

### Scope

This future phase will add video and media localization capabilities:

- Automatic Speech-to-Text.
- Subtitle Management for SRT, VTT, and ASS.
- Subtitle Translation.
- AI Voice-Over.
- AI Dubbing.
- Audio-Video Synchronization.
- Localized Video Export.
- Media Localization QA.
- Workflow Integration.

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
