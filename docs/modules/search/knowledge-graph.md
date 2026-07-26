# Knowledge Graph

## Purpose

The Knowledge Graph represents relationships between all platform entities so
users and AI agents can navigate editorial, linguistic, rights, publication,
media, and research knowledge coherently.

## Graph Node Types

Knowledge entities may represent:

- Authors.
- Translators.
- Editors.
- Reviewers.
- Works.
- Books.
- Chapters.
- Paragraphs.
- Documents.
- Segments.
- Translations.
- Doctrinal terms.
- Concepts.
- People.
- Organizations.
- Events.
- Images.
- Audio files.
- Video files.
- Publications.
- Editions.
- Export artifacts.
- Rights records.
- Research sources.

## Graph Relationship Examples

Supported relationship examples:

- `wrote`.
- `translated`.
- `reviewed`.
- `published`.
- `references`.
- `cites`.
- `derived_from`.
- `related_to`.
- `version_of`.
- `replaces`.
- `contains`.
- `translated_to`.
- `has_rights_holder`.
- `has_publication_artifact`.
- `has_audio_version`.
- `has_video_version`.

## Current Repository Baseline

Research currently stores graph-like data:

- Research entities.
- Research relationships.
- Source references.
- Ecosystem references.
- Collections.

Library, Rights, Publishing, Author Studio, Translation, Lexicographic,
Terminology, Multimedia, Media Localization, Public Portal, and Commerce each
store relationship metadata in their own domain records.

There is no central platform-wide Knowledge Graph service yet.

## Graph Construction

The Knowledge Graph should be built from:

- Explicit domain relationships.
- Version references.
- Translation alignment.
- Rights and provenance records.
- Research citations.
- Lexicographic citations.
- Terminology decisions.
- Workflow and review approvals.
- Publication artifacts.
- AI-suggested relationships after review where needed.

## Provenance

Every node and relationship must preserve:

- Source module.
- Source resource ID.
- Source version.
- Creation method.
- Evidence.
- Confidence.
- Human validation state when editorially relevant.
- Last indexed timestamp.

## AI Rules

AI may:

- Suggest entities.
- Suggest relationships.
- Detect missing links.
- Summarize graph neighborhoods.

AI may not:

- Treat suggested relationships as validated editorial facts.
- Modify source records automatically.
- Grant access to graph data.
- Bypass human approval for editorially significant graph changes.

## Current Gaps

- No central graph node store exists.
- No central graph edge store exists.
- No graph query API exists.
- No graph traversal service exists.
- No graph provenance standard is implemented across modules.
