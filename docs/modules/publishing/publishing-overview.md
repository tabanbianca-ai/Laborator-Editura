# Publishing Module Overview

## Purpose

The Publishing Module manages the full publication cycle of Laborator Editura,
from an approved editorial source to official digital, print, audio, video, and
public distribution outputs.

Publishing is the only mechanism through which an approved document becomes an
official edition.

## Status

Phase II - Module 4.

Official implementation specification.

Version: 1.0.

## Scope

The Publishing Module coordinates:

- Publication generation.
- Editions.
- Published versions.
- Multi-format export.
- Publication profiles.
- Final validation.
- Release readiness.
- Distribution.
- Synchronization with Library.
- Synchronization with public website and public reader surfaces.
- Publication history.
- Edition withdrawal.

## Current Repository Baseline

Current implementation already includes strong publication foundations:

- `layout-publishing` backend module for layout plans, style revisions,
  publishing preflight, publishing records, official edition publishing,
  republishing, withdrawal, distribution records, and audit.
- `export` backend module for JSON Master export artifacts.
- `library` backend module for publication identity, lifecycle status,
  editions, versions, files, metadata, available formats, channels, and audit.
- `public-portal` backend module for public catalog items, public distribution
  records, release approval, and public catalog reads.
- `commerce` backend module for editions, print profiles, pricing,
  commercial distribution, and Print On Demand metadata.
- `rights-provenance` backend module for translation and publishing
  authorization warnings.
- `workflow` backend module for approval gates and export readiness.
- Publishing workspace frontend at `/publishing`.
- Distribution Center frontend at `/distribution`.
- Phase 7 Step 16 final preflight and distribution tracking report.
- Runtime database and backup/restore support for layout publishing,
  export artifacts, Library publication records, public portal records,
  commerce records, and rights records.
- Contract tests for publishing workflow, preflight, distribution, export,
  public portal, commerce, Library, and frontend publishing/distribution UI.

The current baseline intentionally keeps Preflight and Distribution inside
existing publishing infrastructure. It does not create separate Preflight,
Distribution, or Archive modules.

## Principles

- Publish from Approved Sources Only.
- Immutable Published Editions.
- Multi-Format First.
- Metadata Driven.
- Traceable Releases.
- Reproducible Builds.
- Audit by Default.
- Distribution Independent.
- Library First.
- Human Final Authority.

## Canonical Publishing Flow

```text
Approved Document
  -> Publication Build
  -> Format Generation
  -> Validation
  -> Release
  -> Distribution
  -> Public Library
```

## Ownership Boundaries

- Library owns publication identity, metadata, editions, versions, files,
  rights/provenance references, and lifecycle records.
- Publishing owns official edition selection, readiness state, publication
  snapshots, publication timestamps, selected channels, and release gates.
- Export owns generated files and format artifacts.
- Rights & Provenance owns rights warnings and publication authorization.
- Workflow owns generic approval and transition gates.
- Quality Agent owns quality findings.
- Public Portal owns public catalog visibility and reader access metadata.
- Commerce owns commercial edition and print/distribution metadata.

## AI Rule

AI may summarize readiness, detect blockers, suggest profiles, suggest
remediation, and prepare draft packaging metadata.

AI must not:

- Publish automatically.
- Approve publication.
- Withdraw publication.
- Distribute automatically.
- Bypass rights.
- Bypass Workflow.
- Modify immutable published editions.

## Acceptance Criteria

The module is compliant when:

- Only approved Library content can be published.
- Published editions are immutable and versioned.
- Every format is generated from the same authoritative source.
- Metadata comes from Library and is validated before release.
- Format generation is reproducible.
- Distribution is adapter-based and auditable.
- Withdrawal preserves publication history.
- Phase 7 Step 16 publishing, preflight, and distribution behavior is
  preserved.
