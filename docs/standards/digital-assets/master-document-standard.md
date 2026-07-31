# Canonical Master Document Standard

## Purpose

This document defines the canonical master document rules for editorial works
and digital assets.

The canonical master is the official source from which all derivatives,
exports, accessible versions, audio versions, video versions, print editions,
and distribution artifacts are generated.

## Canonical Master Requirements

Every work must define one canonical master record with:

- `uuid`.
- `canonicalIdentifier`.
- `workId`.
- `projectId`.
- `documentId` where applicable.
- `assetType`.
- `title`.
- `language`.
- `version`.
- `status`.
- `owner`.
- `sourceOfTruth`.
- `rightsInformation`.
- `metadata`.
- `relationships`.
- `auditInformation`.

## Master Document Formats

Approved canonical master formats may include:

- JSON Master.
- Structured manuscript record.
- Structured editorial document record.
- Structured article record.
- Structured magazine issue record.
- Structured media project record.

PDF, EPUB, MOBI, DOCX, HTML, audio, video, print-ready files, flipbooks, and
accessibility outputs are derivatives unless explicitly promoted through an
approved, audited migration.

## Single Source of Truth

The canonical master is the only source for:

- Editorial text.
- Segment alignment.
- Translation alignment.
- Language metadata.
- Rights and provenance references.
- Publication metadata.
- Accessibility metadata.
- Export generation.
- Long-term preservation metadata.

Derived formats may store rendering-specific metadata, but they must not
silently override canonical content.

## Derivative Generation

Derivative records must preserve:

- Source master identifier.
- Source master version.
- Derivative type.
- Generation date.
- Generator or workflow.
- Approval status.
- Rights status.
- Accessibility status.
- Integrity checksum where applicable.
- Audit reference.

## Versioning

Master versions must be immutable after publication. Corrections or new
editions create new versions.

Version metadata must preserve:

- Previous version.
- New version.
- Change reason.
- Approver.
- Date and time.
- Affected derivatives.
- Impact on publications.

## Promotion Rule

A derivative may become a canonical master only through an approved migration
when:

- The original master is unavailable, corrupted, or officially superseded.
- Provenance is documented.
- Rights implications are reviewed.
- Affected derivatives are mapped.
- Authorized human approval is recorded.
- Audit history is preserved.

## Audit

Audit must record:

- Master created.
- Master updated.
- Master version created.
- Master approved.
- Derivative generated.
- Derivative regenerated.
- Derivative promoted by approved migration.
- Master archived.
- Master restored.

