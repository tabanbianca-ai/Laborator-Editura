# Library Metadata Model

## Purpose

This document defines the official Library metadata model.

## Required Minimum Metadata

Every Library Item must support:

- `id`.
- `title`.
- `subtitle`.
- `originalTitle`.
- `description`.
- `language`.
- `originalLanguage`.
- `originalPublicationYear`.
- `authors`.
- `translators`.
- `editors`.
- `publisher`.
- `edition`.
- `status`.
- `keywords`.
- `tags`.
- `categories`.
- `license`.
- `rights`.
- `workspace`.
- `createdAt`.
- `updatedAt`.

## Current Implementation Baseline

Current `LibraryItem` includes:

- `id`.
- `organizationId`.
- `userId`.
- `itemType`.
- `title`.
- Language and locale fields.
- `sourceReference`.
- Favorite and access metadata.
- Flexible `metadata`.

Current `LibraryPublicationRecord` includes:

- Title, subtitle, author, contributors, description.
- Publication type and editorial domain.
- Language and locale.
- Series, collection, volume.
- Lifecycle status and visibility.
- Publication year and original publication metadata.
- Manuscript, project, workflow, translation, review, layout, publishing
  references.
- Rights status, license, contract references, provenance, restrictions.
- Available formats, channels, dates, distribution status.
- ISBN, identifiers, tags, fingerprint, restricted metadata, flexible metadata.

## Metadata Classes

### Identity Metadata

- Title.
- Subtitle.
- Original title.
- Publication type.
- Editorial domain.
- Series.
- Collection.
- Volume.

### Language Metadata

- Platform language belongs to user/workspace preferences, not content.
- Original language belongs to original work identity.
- Authoring language belongs to current manuscript.
- Target language belongs to a translation.
- Library records preserve content language, original language, locale, and
  translation references.

### Contributor Metadata

- Authors.
- Translators.
- Editors.
- Reviewers.
- Designers.
- Illustrators.
- Audio narrators.
- Collaborators.

### Rights Metadata

- Rights status.
- License.
- Contract references.
- Publication restrictions.
- Authorized languages when connected to Rights & Provenance.

### Provenance Metadata

- Original source reference.
- Original edition.
- Original publisher.
- Original author.
- First publication year.
- Source acquisition.
- Source file fingerprint.

### Operational Metadata

- Created by.
- Created at.
- Updated at.
- Version references.
- Audit references.
- Workflow references.

## Metadata Rules

- Metadata must be versioned when it affects publication, rights, provenance,
  language, workflow, search, AI context, or distribution.
- Restricted metadata must not be returned to unauthorized users.
- Metadata must not overwrite original author attribution.
- Translator attribution must be preserved separately from original author
  attribution.
- AI may suggest metadata but may not approve or silently alter canonical
  metadata.

## Gap

The current implementation has broad publication metadata, but a universal
required metadata schema for every Library Item is not fully enforced yet.
