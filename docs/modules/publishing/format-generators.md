# Format Generators

## Purpose

Format generators transform one approved publication source into multiple
publication-ready artifacts.

## Target Supported Formats

Publishing must support architecture for:

- PDF.
- EPUB.
- HTML.
- DOCX.
- MOBI.
- ODT.
- Print-ready PDF.
- Audiobook Package.
- Video Package.

The architecture must allow adding new formats without changing existing
publication logic.

## Current Baseline

Current format-related support includes:

- JSON Master artifact generation in the `export` module.
- `LayoutExportFormat` values for PDF, EPUB, MOBI, HTML, DOCX, print,
  audiobook/video-related formats, accessible formats, subtitle formats, and
  archive formats.
- `LayoutPublicationExportHistory` for recorded exports.
- `LibraryPublicationFile` for publication files, artifact refs, checksums,
  and visibility.
- Distribution Center format cards and preflight checks for PDF print, EPUB,
  MOBI, JSON Master, audiobook, video, and magazine flipbook readiness.

## Generator Contract

Each generator should expose:

- Format.
- Input source references.
- Profile reference.
- Generator version.
- Output artifact references.
- Checksum.
- Validation result.
- Warnings.
- Error list.
- Build duration.
- Actor or automated job reference.

## Reproducibility

Re-running a generator with the same:

- Source version.
- Assets.
- Metadata snapshot.
- Profile version.
- Generator version.

should produce the same artifact or an auditable difference report.

## Current Gaps

- Real generators for all requested formats are not implemented.
- JSON Master is the most concrete export artifact currently present.
- Generator versioning is not modeled.
- Parallel generation and job orchestration are not first-class.
- ODT, DOCX, audiobook package, video package, and print-ready PDF need
  dedicated implementation phases.

## AI Rule

AI may suggest layout, accessibility improvements, metadata completion, and
format remediation.

AI must not publish, approve, or mark generated formats as official without
authorized human approval and Workflow gates.
