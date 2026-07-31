# Digital Asset Metadata Standard

## Purpose

This document defines mandatory metadata for documents, editorial content,
publication assets, media assets, and derived formats.

## Required Metadata

Every governed asset must define:

- `uuid`.
- `title`.
- `subtitle` where applicable.
- `author`.
- `translator` where applicable.
- `editor` where applicable.
- `reviewer` where applicable.
- `illustrator` where applicable.
- `language`.
- `edition`.
- `publicationDate` where applicable.
- `keywords`.
- `tags`.
- `rights`.
- `license`.
- `accessibilityStatus`.
- `assetType`.
- `contentType`.
- `version`.
- `status`.
- `owner`.
- `lifecycleState`.
- `auditInformation`.

## Conditional Metadata

Assets may also require:

- `isbn` for book or edition publications where applicable.
- `doi` when assigned.
- `originalLanguage`.
- `authoringLanguage`.
- `targetLanguage`.
- `originalAuthor`.
- `rightsHolder`.
- `sourceManuscriptId`.
- `canonicalMasterId`.
- `sourceMasterVersion`.
- `exportFormat`.
- `checksum`.
- `duration` for audio or video.
- `dimensions` for image or video.
- `fileSize`.
- `mimeType`.
- `accessibilityProfile`.

## Rights Metadata

Rights metadata must preserve:

- Rights holder.
- License.
- Authorized languages.
- Authorized territories.
- Expiration where applicable.
- Commercial distribution status.
- Audio permission.
- Video permission.
- Print permission.
- eBook permission.
- Public domain or open license status where applicable.
- Provenance record reference.

Rights warnings must be visible to publishing and distribution workflows.

## Accessibility Metadata

Accessibility metadata should include:

- Accessibility status.
- Alternative text status.
- Caption status.
- Transcript status.
- Accessible document status.
- Reading order status.
- Language tagging status.
- Remediation notes.

## AI Readiness Metadata

AI readiness metadata may include:

- Approved AI use status.
- Allowed AI operations.
- Sensitive content flags.
- Source authority references.
- Citation requirements.
- Need-to-Know classification.
- RAG eligibility.
- Exclusion from AI processing where required.

## Metadata Governance

Metadata changes must be:

- Versioned where publication impact exists.
- Audited.
- Traceable to actor and workflow.
- Validated before publication.
- Preserved in exports where applicable.

## Audit

Audit must record:

- Metadata created.
- Metadata updated.
- Rights metadata changed.
- Language metadata changed.
- Accessibility metadata changed.
- Publication metadata changed.
- AI readiness metadata changed.
- Approved exception.

