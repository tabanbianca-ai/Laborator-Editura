# Data Migration Plan

Batch 05 uses Expand-Migrate-Contract.

## Expand

- Add shared canonical contracts.
- Add JSON Master optional export fields.
- Add runtime table inventory for canonical library entities.
- Preserve all existing Library, Rights, Public Portal, Commerce, Project, Document, and Author Studio tables.

## Inventory

Existing resources to inventory:

- Books.
- Manuscripts.
- PDFs.
- EPUBs.
- Magazines.
- Images.
- Audio.
- Video.
- Translations.
- Historical metadata.
- Resources without provenance.
- Resources without rights.
- Duplicates.
- Orphaned files.

Classification:

- `MIGRATED`
- `NEEDS_REVIEW`
- `RIGHTS_UNKNOWN`
- `PROVENANCE_UNKNOWN`
- `ORPHANED`
- `POSSIBLE_DUPLICATE`

## Migrate

- Map existing `library_publications` to canonical Work/Edition/LibraryRecord records.
- Map existing rights/provenance records by resource reference.
- Map files to DigitalAsset records with checksum/integrity metadata when available.
- Preserve ambiguous records with review statuses.

## Contract

No old runtime table is removed in this batch. Later physical migrations may contract duplicated fields only
after data parity, backup restore, and compatibility tests pass.

## No Destructive Migration

No resource is deleted because rights, provenance, or duplicate status is unclear.
