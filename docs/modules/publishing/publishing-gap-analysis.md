# Publishing Gap Analysis

## Purpose

This document compares the current implementation with the official Publishing
Module Architecture.

## Current Strengths

- Layout Publishing module already includes publishing records, preflight,
  publishing state transitions, publication, withdrawal, republication,
  distribution records, and audit.
- Library already includes publication records, editions, versions, files,
  lifecycle status, metadata, format availability, channel history, and audit.
- Export already produces JSON Master artifacts.
- Public Portal already supports public catalog items, release approval, public
  catalog reads, and distribution records.
- Commerce already supports editions, print profiles, pricing, commercial
  approval, and Print On Demand metadata.
- Rights & Provenance already provides publication authorization warnings.
- Workflow gates already prevent unsafe approval/export transitions.
- Distribution Center frontend already aggregates preflight and channel
  readiness.
- Runtime database and backup/restore include publication-related tables.
- Phase 7 Step 16 validated final preflight and distribution tracking without
  creating duplicate Preflight or Distribution modules.

## Gap Table

| Area | Current State | Gap | Risk |
| --- | --- | --- | --- |
| Canonical publication facade | Publishing exists through `layout-publishing` and Library | `/publications` API is not present | Medium |
| Publication aggregate | `PublishingRecord` and `LibraryPublicationRecord` exist | Single canonical Publication facade is not explicit | Medium |
| Publication build | Export/preflight/history exist | First-class reproducible `PublicationBuild` aggregate is missing | High |
| Format generators | Format vocabulary is broad | Real generators for PDF/EPUB/DOCX/MOBI/ODT/audio/video packages are incomplete | High |
| Publication profiles | Layout and print profiles exist | Canonical reusable/versioned profile model is missing | Medium |
| Distribution adapters | Distribution records exist | Formal adapter interface and async delivery/retry model are missing | Medium |
| Metadata validation | Preflight checks metadata | Field-level metadata validation rules need expansion | Medium |
| Archive state | Withdrawal exists | Canonical archive action/state is not implemented | Low |
| Parallel build | Not explicit | Multi-format parallel build orchestration is missing | Medium |
| Incremental build | Not explicit | Incremental build tracking is missing | Medium |
| External Website/Mobile sync | Public Portal metadata exists | Real website/mobile distribution integrations are not connected | Medium |

## Risk Evaluation

High-risk gaps:

- Publication builds need reproducibility metadata before high-volume
  production.
- Format generation requires dedicated generator contracts and validation
  before all declared formats can be considered operational.

Medium-risk gaps:

- Canonical `/publications` APIs and adapter abstractions should be introduced
  without disrupting existing `layout-publishing`, Library, Export, Public
  Portal, Commerce, or Rights APIs.
- Metadata validation and profile versioning must be made explicit before
  large-scale publication workflows.

## Implementation Constraint

All remediation must be additive and preserve:

- Current Phase 7 Step 16 behavior.
- Existing publishing, preflight, and distribution records.
- Library source-of-truth boundaries.
- Export artifact ownership.
- Rights & Provenance authority.
- Workflow approval gates.
- Human Final Authority.
- Backup/restore compatibility.
