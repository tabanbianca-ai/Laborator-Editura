# Data Lineage

## Purpose

Data Lineage allows reconstruction of the full path of information from source
records through transformations, validations, approvals, exports, and
publication artifacts.

## Example Flow

```text
Original Manuscript
  -> Source Edition
  -> Translation Project
  -> Reviewed Translation
  -> Published Edition
     -> EPUB
     -> PDF
     -> Audio
     -> Video
```

## Required Lineage Fields

For each transformation:

- Source entity.
- Source version.
- Target entity.
- Target version.
- Transformation type.
- Transformation identifier.
- Actor or AI agent.
- Workflow instance.
- Timestamp.
- Validation result.

## Provenance Metadata

Important data must include:

- `sourceType`.
- `sourceId`.
- `sourceLocation`.
- `sourceVersion`.
- `importedAt`.
- `importedBy`.
- `extractionMethod`.
- `confidence`.
- `validationStatus`.

Source types include:

- Manual entry.
- Imported document.
- External provider.
- OCR extraction.
- AI extraction.
- System generation.
- Migrated legacy data.
- Derived metadata.

## Current Repository Baseline

Lineage exists partially through:

- JSON Master provenance.
- Audit tables.
- Version history.
- Export artifacts.
- Publishing records.
- Rights provenance records.
- Workflow transitions.
- Backup metadata.

There is no central Lineage Service yet.

## Rules

- AI-generated or AI-extracted data is not automatically validated.
- Generated files must reference master record, master version, generator
  version, configuration profile, and generation timestamp.
- Lineage records must be immutable after creation.
