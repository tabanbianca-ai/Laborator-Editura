# Library Module Overview

## Purpose

The Library module is the canonical repository and Single Source of Truth for
all editorial resources managed by Laborator Editura.

No manuscript, book, magazine, article, image, illustration, audio file, video
file, translation, export, publication, or source file may exist as an
editorial object outside the Library model.

Other modules may create, transform, review, publish, distribute, or read
editorial resources, but they must reference Library-managed objects instead
of creating duplicate repositories of editorial data.

## Status

Phase II - Module 1.

Official implementation specification.

Version: 1.0.

## Scope

The Library module owns:

- Library Items.
- Collections.
- Assets.
- Metadata.
- Versions.
- Rights references.
- Provenance.
- Tags.
- Categories.
- Relationships.
- Search and indexing contracts.
- Library audit.

## Current Repository Baseline

Current implementation already includes:

- Backend module at `apps/api/src/modules/library`.
- Frontend workspace at `/library`.
- Runtime database tables for user library items, publication records,
  editions, versions, files, view preferences, reading progress, bookmarks,
  highlights, notes, access events, and audit events.
- Backup/restore support for Library tables.
- Contract tests for Library reader experience and Intelligent Editorial
  Library behavior.
- Search, filtering, sorting, grid/list preference metadata, duplicate
  detection, preview protection, lifecycle status changes, editions, versions,
  and publication files.

## Core Principles

- Single Source of Truth.
- Asset First.
- Metadata First.
- Version Everything.
- Immutable History.
- Search Everywhere.
- AI Ready.
- Audit by Default.
- Need-to-Know by Default.
- Human Final Authority.

## Module Responsibilities

Library is responsible for representing and connecting:

- Manuscripts.
- Books.
- Magazines.
- Articles.
- Images.
- Illustrations.
- Audio.
- Video.
- PDF, EPUB, DOCX, source files, and other export artifacts.
- Translations.
- Metadata.
- Versions.
- Rights.
- Provenance.
- Relationships between resources.

## Non-Goals

Library must not duplicate:

- Translation workflow logic.
- Review workflow logic.
- Publishing approval logic.
- Rights contract approval logic.
- Export generation logic.
- Public portal rendering.
- Commerce execution.

Library stores identity, metadata, relationships, lifecycle, files/assets, and
references. Specialized modules operate on those Library-managed resources.

## Acceptance Criteria

Library is compliant when:

- Every editorial object is represented as a Library Item or an explicitly
  linked Library publication record.
- Every physical file is represented as an Asset or publication file record.
- Metadata is complete, auditable, and versioned.
- Relationships between resources are explicit.
- Rights and provenance references are preserved.
- Search and indexing can discover Library resources.
- AI receives context only through Library-approved metadata, relationships,
  and evidence, not direct uncontrolled file access.
