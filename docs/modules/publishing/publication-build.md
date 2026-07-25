# Publication Build

## Purpose

Publication Build defines how approved Library content, assets, metadata,
layout, and generators are assembled into official publication packages.

## Canonical Build Flow

```text
Library Item
  -> Assets
  -> Metadata
  -> Layout
  -> Format Generator
  -> Publication Package
```

## Current Baseline

Existing build-related foundations include:

- JSON Master export through the `export` module.
- Layout publication plans and export history in `layout-publishing`.
- Publishing preflight generation and readiness checks.
- Library publication files with artifact references and checksums.
- Commerce print profile metadata.
- Public Portal reader access metadata.
- Distribution Center frontend preflight aggregation.

## Build Inputs

A publication build must use:

- Approved Library publication record.
- Approved document or version.
- Selected edition.
- Selected version.
- Rights and provenance snapshot.
- Metadata snapshot.
- Layout publication plan.
- Required asset references.
- Publication profile.
- Requested output formats.

## Reproducibility Requirements

Every build should preserve:

- Source Library item id.
- Document id and version id.
- Edition id.
- Publication profile id/version.
- Layout plan id/version.
- Metadata snapshot reference.
- Rights snapshot reference.
- Generator versions.
- Asset references.
- Generated artifact references.
- Validation result.
- Actor and timestamp.

## Validation Before Build

Build must fail or remain blocked when:

- Source content is not approved.
- Required metadata is incomplete.
- Publishing rights are missing or expired.
- Required review approvals are missing.
- Required assets are missing.
- Version references are inconsistent.
- Requested format requirements cannot be satisfied.

## Current Gaps

- There is no dedicated `PublicationBuild` aggregate.
- Generator version metadata is not first-class.
- Build repeatability is partially documented through preflight and artifact
  refs, but not fully modeled.
- Parallel format generation and incremental build records are not explicit.

## Implementation Constraint

Future build implementation must preserve current Phase 7 Step 16 behavior and
must not create separate Preflight or Distribution modules.
