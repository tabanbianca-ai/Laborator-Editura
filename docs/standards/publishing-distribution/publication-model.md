# Canonical Publication Model

## Purpose

The publication model defines the canonical identity and lifecycle of every
official edition that can be published or distributed.

Library remains the canonical owner of publication identity and lifecycle
records. Publishing owns official release state, edition selection, preflight,
publication snapshots, and distribution tracking.

## Publishable Edition Fields

Each publishable edition must preserve:

- `id`.
- `canonicalIdentifier`.
- `workId`.
- `sourceMasterId`.
- `sourceMasterVersion`.
- `editionNumber`.
- `publicationType`.
- `language`.
- `publisher`.
- `publicationStatus`.
- `publicationDate`.
- `rightsRecordId`.
- `metadataRecordId`.
- `accessibilityRecordId`.
- `approvalRecordId`.
- `version`.
- `createdAt`.
- `updatedAt`.
- `auditInformation`.

## Canonical Publication Types

Allowed canonical publication types are:

- `BOOK`.
- `EBOOK`.
- `MAGAZINE`.
- `ARTICLE`.
- `AUDIOBOOK`.
- `VIDEO_PUBLICATION`.
- `CHILDREN_PUBLICATION`.
- `EDUCATIONAL_MATERIAL`.
- `ACCESSIBLE_EDITION`.
- `PRINT_EDITION`.
- `PRINT_ON_DEMAND_EDITION`.

An editorial project may produce multiple editions, but every edition must
remain linked to the same canonical work.

## Publication Statuses

Allowed canonical publication statuses are:

- `DRAFT`.
- `UNDER_REVIEW`.
- `READY_FOR_PUBLICATION`.
- `PUBLICATION_BLOCKED`.
- `APPROVED`.
- `GENERATING`.
- `VALIDATING`.
- `PUBLISHED`.
- `DISTRIBUTED`.
- `UPDATED`.
- `WITHDRAWN`.
- `ARCHIVED`.
- `FAILED`.

Only `APPROVED` allows official edition generation to begin.

`PUBLICATION_BLOCKED` must preserve exact blocking reasons.

## Translation Publication Rules

A translation may be published only when:

- The source work is identified.
- The source edition is registered.
- The source language is declared.
- The target language is declared.
- Translation rights are valid.
- The translator is identified.
- Editorial review is approved.
- Terminology is validated.
- Rights for the resulting edition are documented.
- Metadata includes original-edition information.

## Ownership Rules

- Working files are not official publications.
- Derived files are not master records.
- External channel copies are not master records.
- Publication identity must not be duplicated in distribution channels.
- Official editions must be reproducible from approved master version,
  approved generation profile, and validation evidence.

