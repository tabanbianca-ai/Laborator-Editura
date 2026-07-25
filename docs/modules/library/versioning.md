# Library Versioning

## Purpose

This document defines Library versioning requirements.

## Core Rule

Every meaningful editorial change must be versioned.

Versions are immutable.

Any version may be restored through a controlled, audited action.

## Version Scope

Versioning applies to:

- Library Items.
- Metadata.
- Assets.
- Publication editions.
- Publication files.
- Relationships.
- Rights references.
- Provenance records.
- Published states.

## Current Implementation Baseline

Current implementation includes:

- `library_publication_editions`.
- `library_publication_versions`.
- `library_publication_files`.
- `LibraryPublicationVersion.immutableHistoricalVersion: true`.
- Audit events for edition creation, version creation, file addition,
  metadata/status/visibility changes, and publication changes.

## Official Version Fields

Version records should preserve:

- Version ID.
- Parent Library Item ID.
- Publication ID when applicable.
- Edition ID when applicable.
- Version number.
- Change summary.
- Created by.
- Created at.
- Previous version reference.
- Immutable flag.
- Restore reference when restored.
- Metadata snapshot reference.

## Restoration Rules

- Restoring a version must not delete newer versions.
- Restoration creates a new current state derived from the historical version.
- Restoration must be audited.
- Published historical versions remain preserved.
- Rights, provenance, and audit history must remain intact.

## Current Gaps

- Versioning is implemented for publication versions, not yet universal for
  all Library Items, Assets, relationships, and metadata snapshots.
- Restore endpoints are not defined in the current Library API.
- Version diff or comparison behavior is not yet specified.
