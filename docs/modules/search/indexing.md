# Indexing

## Purpose

Indexing transforms authorized platform resources into searchable documents,
facets, embeddings, and knowledge graph updates.

## Target Indexing Pipeline

```text
Content Updated
  -> Index Event
  -> Content Extraction
  -> Metadata Extraction
  -> Language Analysis
  -> Entity Extraction
  -> Embedding Generation
  -> Index Update
  -> Knowledge Graph Update
  -> Search Available
```

## Indexing Modes

The indexing pipeline must support:

- Incremental indexing.
- Asynchronous indexing.
- Distributed indexing.
- Event-driven indexing.
- Re-runnable indexing.
- Full index rebuild.
- Selective reindex by resource.
- Version-aware indexing.
- Language-aware indexing.

## Trigger Events

Indexing is triggered by:

- Creation.
- Modification.
- Translation.
- Approval.
- Publication.
- Restore.
- Logical deletion.
- Rights status change.
- Workflow state change.
- Metadata update.
- Relationship update.

## Indexed Resource Types

Indexing must cover:

- Projects.
- Project dossiers.
- Manuscripts.
- Documents.
- Chapters.
- Sections.
- Segments.
- Translations.
- Library items.
- Publications.
- Editions.
- Export artifacts.
- Rights records.
- Provenance records.
- Research sources.
- Research notes.
- Research entities.
- Terminology terms.
- Lexicographic entries.
- Translation Memory entries.
- Review proposals.
- Workflow tasks.
- Magazine issues and articles.
- Audio tracks.
- Video assets.
- Media localization assets.
- Public catalog items.

## Current Repository Baseline

Current indexing is mostly implicit:

- Library performs runtime filtering over publication metadata.
- Research performs runtime filtering over sources, notes, entities,
  relationships, and collections.
- Translation Memory computes exact, fuzzy, and context matches at query time.
- Terminology searches terms at query time.
- Lexicographic searches dictionary entries at query time and audits source
  consultation.
- There is no central indexing job, search document, search index, or
  indexing event pipeline.

## Indexing Security

Indexing must not leak restricted content:

- Restricted source content is indexed only when policy allows it.
- Search documents include permission metadata for filtering, but IAM remains
  authoritative.
- Search results are filtered by organization, role, project, assignment,
  document permission, workflow state, rights status, and Need-to-Know scope.
- Private notes, contracts, financial metadata, and confidential discussions
  require explicit indexing rules.

## Rebuild Rules

Full rebuilds must:

- Be authorized.
- Be auditable.
- Preserve search service availability where possible.
- Use schema versioning.
- Validate counts and integrity.
- Emit observability metrics.
- Avoid exposing stale restricted content.

## Gaps

- No `SearchDocument` runtime model exists.
- No indexing job runtime exists.
- No event-driven indexing pipeline exists.
- No centralized language analyzer exists.
- No dedicated reindex workflow exists.
