# Library Events

## Purpose

This document defines the official Library event model.

## Required Events

Official Library events:

- `LibraryItemCreated`.
- `LibraryItemUpdated`.
- `LibraryItemPublished`.
- `AssetUploaded`.
- `VersionCreated`.
- `MetadataUpdated`.
- `RightsUpdated`.

## Current Audit Actions

Current implementation includes audit actions for:

- `LIBRARY_ITEM_ADDED`.
- `LIBRARY_PUBLICATION_CREATED`.
- `LIBRARY_METADATA_CHANGED`.
- `LIBRARY_STATUS_CHANGED`.
- `LIBRARY_VISIBILITY_CHANGED`.
- `LIBRARY_MANUSCRIPT_LINKED`.
- `LIBRARY_PROJECT_LINKED`.
- `LIBRARY_EDITION_CREATED`.
- `LIBRARY_VERSION_CREATED`.
- `LIBRARY_FILE_ADDED`.
- `LIBRARY_FILE_REPLACED`.
- `LIBRARY_BULK_ACTION`.
- `LIBRARY_PUBLICATION_PUBLISHED`.
- `LIBRARY_PUBLICATION_WITHDRAWN`.
- `LIBRARY_DUPLICATE_REVIEWED`.
- `LIBRARY_RIGHTS_STATUS_CHANGED`.
- `LIBRARY_VIEW_PREFERENCE_SAVED`.
- Reader experience actions such as progress, bookmarks, highlights, notes,
  favorites, and access events.

## Event Contract Fields

Each Library event should include:

- Event ID.
- Event type.
- Organization ID.
- Library Item ID when applicable.
- Publication ID when applicable.
- Asset ID when applicable.
- Version ID when applicable.
- Actor ID.
- Timestamp.
- Before state reference where applicable.
- After state reference where applicable.
- Reason.
- Correlation ID when available.

## Event Rules

- Events must be auditable.
- Events must be versioned when payload structure changes.
- Events must not expose restricted metadata to unauthorized consumers.
- Workflow, Publishing, Export, Rights, AI, and Search may consume Library
  events but must not mutate Library state without authorized service calls.

## Current Gaps

- Current implementation stores audit events but does not expose a dedicated
  domain event bus for Library events.
- Event names are audit-action oriented and should be mapped to canonical
  Library event names in future integration work.
