# Canonical Provenance Model

## Purpose

This document defines provenance records under Standard 13.

## Canonical Provenance Fields

Every resource must preserve:

| Field | Description |
| --- | --- |
| `source_type` | Source classification |
| `source_id` | Source identifier |
| `source_location` | Location or reference |
| `source_owner` | Source owner |
| `source_version` | Exact source version |
| `acquisition_method` | How the resource was acquired |
| `acquired_at` | Acquisition timestamp |
| `acquired_by` | Actor who acquired it |
| `import_process` | Import or migration process |
| `transformation_history` | Transformations applied |
| `validation_status` | Provenance validation state |
| `confidence` | Confidence level |

## Provenance Types

Allowed provenance types:

- `ORIGINAL_CREATION`.
- `AUTHOR_SUBMISSION`.
- `AUTHORIZED_IMPORT`.
- `PUBLIC_DOMAIN_SOURCE`.
- `LICENSED_SOURCE`.
- `EXTERNAL_PROVIDER`.
- `OCR_EXTRACTION`.
- `AI_GENERATION`.
- `AI_TRANSFORMATION`.
- `MIGRATED_LEGACY_RESOURCE`.
- `DERIVED_RESOURCE`.

## Preservation Rules

- Provenance must be versioned.
- Corrections create new versions.
- Source references must not be overwritten silently.
- Conflicts must be documented and reviewed.
- Provenance must remain linked through derivative chains.

## AI Rules

AI may identify possible provenance links and confidence risks.

AI may not modify validated provenance automatically.

