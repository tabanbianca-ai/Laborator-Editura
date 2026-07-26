# Full-Text Search

## Purpose

Full-text search provides fast keyword, exact, prefix, fuzzy, faceted, and
multilingual discovery across platform resources.

## Supported Search Types

The module must support:

- Exact search.
- Full-text search.
- Prefix search.
- Fuzzy search.
- Hybrid textual and semantic search.
- Similar documents.
- Related entities.
- Multilingual search.

## Current Repository Baseline

Existing local search behavior:

- Library supports normalized and accent-insensitive metadata matching,
  fuzzy token matching, filters, sorting, duplicate detection, and saved
  search metadata.
- Research supports filtering by query, author, language, tags, source type,
  entity, and project.
- Terminology supports term lookup by language, domain, status, query, and
  limit.
- Translation Memory supports approved-entry lookup by language pair, domain,
  source text, confidence, and similarity threshold.
- Lexicographic Intelligence supports term lookup by source language, target
  language, language pair, phrase, idiom, source, edition, domain,
  grammatical category, authority level, and search mode.
- Public Portal exposes approved public catalog reads.

## Target Query Model

Common search input:

- `query`.
- `resourceTypes`.
- `languages`.
- `locales`.
- `authors`.
- `translators`.
- `editors`.
- `organizationId`.
- `projectIds`.
- `categories`.
- `dateRange`.
- `workflowStatuses`.
- `rightsStatuses`.
- `versions`.
- `facets`.
- `sort`.
- `limit`.
- `cursor`.

## Faceted Search

Required facets:

- Language.
- Author.
- Translator.
- Editor.
- Organization.
- Project.
- Category.
- Resource type.
- Date.
- Workflow status.
- Rights.
- Version.
- Publication type.
- Editorial domain.

## Ranking

Textual ranking should consider:

- Exact title match.
- Exact identifier match.
- Prefix match.
- Term frequency.
- Field weight.
- Fuzzy distance.
- Recency.
- Workflow/publication status.
- User permissions.
- Project relevance.

## Security Rules

- Search results must be filtered server-side.
- Hidden or unauthorized resource metadata must not be returned.
- Public search may return only resources explicitly approved for public
  visibility.
- Administrative search requires explicit permission and must be audited.

## Current Gaps

- Full-text search is not centralized.
- No query parser or common filter contract exists.
- No common faceted search model exists.
- No global autocomplete service exists.
- No common relevance ranking service exists.
