# Library Search and Indexing

## Purpose

This document defines the Library search and indexing strategy.

## Required Search Capabilities

Library must support:

- Full-text search.
- Semantic search.
- AI-assisted search.
- Metadata search.
- Filtering.
- Sorting.
- Faceted navigation.

## Indexed Fields

Minimum indexed fields:

- Title.
- Subtitle.
- Original title.
- Authors.
- Translators.
- Editors.
- Content when permitted.
- Tags.
- Categories.
- Collections.
- Languages.
- Rights status.
- Workflow status.
- Publication lifecycle status.
- Asset types.
- ISBN and identifiers.

## Current Implementation Baseline

Current implementation supports:

- Search over title, subtitle, author, ISBN, language, series, collection,
  original title, original author, and metadata.
- Normalized and accent-insensitive matching.
- Fuzzy token matching with Levenshtein distance.
- Filters for author, language, editorial domain, publication type, lifecycle
  status, publication year, original publication year, rights status, format,
  series, and collection.
- Sorting by title, author, year, status, and last update.
- View preference metadata for grid/list and saved searches.

## Target Indexing Model

Future indexing should support:

- Incremental indexing.
- Search index rebuilds.
- Separate searchable text from restricted raw content.
- License-aware content ingestion.
- Language-aware tokenization.
- Semantic embeddings where permitted.
- AI-ready contextual retrieval through approved Library metadata and evidence.

## Performance Objective

Library search should target sub-second response for common metadata searches
and indexed queries in production-grade deployments.

## Current Gaps

- Current search is runtime in-memory/file-backed filtering, not a dedicated
  search index.
- Semantic search and embeddings are not connected yet.
- Full content indexing is not implemented.
- Incremental index rebuild procedures are not defined.
