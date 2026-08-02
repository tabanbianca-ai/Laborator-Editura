# Digital Format Standard

## Purpose

Digital formats are controlled derivatives of an approved master publication.
They are not independent source records.

## Supported Digital Outputs

The platform must be able to govern:

- EPUB.
- PDF.
- Print-ready PDF.
- HTML.
- Audiobook.
- Video material.
- Accessible formats.
- MOBI when a channel requires it.
- JSON or XML distribution metadata.

## Required Derived Format Fields

Each derived format must preserve:

- `sourceMasterId`.
- `sourceMasterVersion`.
- `publicationId`.
- `generatorVersion`.
- `generationProfile`.
- `generatedAt`.
- `checksum`.
- `format`.
- `mimeType`.
- `fileSize`.
- `validationReportId`.
- `publicationPackageId`.

## Digital Format Rules

- Formats must be generated from the approved master version.
- Formats must not be directly edited after approval.
- Regeneration requires an approved source change, format profile change, or
  correction workflow.
- Accessibility formats must follow Standard 12.
- Language and localization metadata must follow Standard 11.
- Rights restrictions must follow Standard 13.
- Integrity records must be retained for every produced file.

## Format-Specific Validation

Digital validation must include, as applicable:

- PDF and PDF/A/PDF/X validation.
- EPUB structure and accessibility checks.
- HTML export structure and link checks.
- Audio metadata, chapters, and synchronization checks.
- Video metadata, captions, and synchronization checks.
- JSON/XML schema validation.
- Required artifact coverage for selected distribution channels.

