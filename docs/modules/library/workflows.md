# Library Workflows

## Purpose

This document defines how Library participates in editorial workflows.

## Official Library Workflow

```text
Import
  -> Metadata
  -> Review
  -> Approval
  -> Publication
```

## Current Implementation Baseline

Current Library implementation supports:

- Adding Library Items.
- Creating publication records.
- Searching and filtering publications.
- Changing publication lifecycle status.
- Changing visibility.
- Creating editions.
- Creating versions.
- Adding publication files.
- Previewing publications without restricted content.
- Running non-destructive bulk action foundations.
- Detecting duplicates without automatic merge.
- Reader progress, bookmarks, highlights, notes, favorites, and access events.

## Publication Lifecycle Integration

Current lifecycle statuses:

- `STOC_REAL`.
- `IN_LUCRU`.
- `PUBLICAT`.

Supported transitions:

- `STOC_REAL` -> `IN_LUCRU`.
- `IN_LUCRU` -> `PUBLICAT`.
- `PUBLICAT` -> `IN_LUCRU` for new edition or revision.

Canonical Library Item workflow status:

- `DRAFT`.
- `IN_REVIEW`.
- `APPROVED`.
- `PUBLISHED`.
- `ARCHIVED`.
- `DEPRECATED`.

Future implementation must map publication lifecycle and workflow status
without deleting validated lifecycle behavior.

## Workflow Rules

- Workflow state changes must be audited.
- Publication requires rights, quality, preflight, and human approval gates.
- Library may expose warnings but must not auto-approve rights or publication.
- Publishing, Export, Rights, Quality, and Workflow modules remain specialized
  owners of their decisions.
- Library stores canonical relationships and evidence.

## Current Gaps

- Library does not yet enforce a universal item-level workflow status.
- Full import-to-publication orchestration remains distributed across Pipeline,
  Workflow, Publishing, Rights, Export, and Quality.
- Library relationship records are reference arrays and metadata today; typed
  relationship workflow records should be added incrementally.
