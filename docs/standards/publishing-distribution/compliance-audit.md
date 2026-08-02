# Publishing, Distribution and Withdrawal Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 14:
Canonical Publishing, Distribution and Publication Withdrawal.

It is a documentation and governance audit. It does not change runtime
behavior, APIs, database schema, Docker, staging, frontend behavior, tests, or
application logic.

## Audit Date

2026-08-02.

## Static Inventory

| Area | Current count or evidence |
| --- | --- |
| Publishing module documents | 11 files under `docs/modules/publishing` |
| Library module documents | 12 files under `docs/modules/library` |
| Rights module documents | 11 files under `docs/modules/rights` |
| Magazine module documents | 11 files under `docs/modules/magazine` |
| Related API source files | 35 files across publishing, export, public portal, commerce, library, rights, and workflow areas |
| Searchable publishing/distribution candidates | 472 matching files across `apps`, `packages`, and `docs` before classification |
| Existing Phase 7 publishing validation | `docs/PHASE_7_STEP_16_PUBLISHING_PREFLIGHT_DISTRIBUTION_REPORT.md` |
| Runtime publishing persistence | `layout_publishing_preflight_results`, `layout_publishing_records`, `layout_publishing_distribution_records` |
| Existing frontend surfaces | `/publishing`, `/distribution`, `/export-center`, `/library`, `/rights`, `/magazine` |
| Existing backup references | Runtime backup/restore includes layout publishing, public portal, commerce, library, export, and rights records |

## Current Strengths

- Publishing module documentation exists.
- Library owns publication identity and lifecycle.
- Layout Publishing runtime module exists.
- Export runtime module exists.
- Public Portal runtime module exists.
- Commerce runtime module exists.
- Rights and Provenance runtime module exists.
- Workflow gates exist.
- Phase 7 Step 16 implemented preflight and distribution tracking.
- Runtime database includes preflight, publishing, and distribution tables.
- Backup/restore includes publishing and distribution persistence.
- Publishing and Distribution frontend surfaces exist.
- Withdrawal behavior preserves history in the validated Phase 7 Step 16
  baseline.

## Current Gaps

- Canonical `PublishableEdition` aggregate is not yet represented as a
  unified implementation construct across Library and Publishing.
- Immutable publication package manifests are documented but not fully
  implemented as first-class runtime artifacts.
- Channel connector interfaces are metadata-level and not yet standardized as
  formal adapter contracts.
- External provider synchronization is metadata-only and not connected to real
  distribution providers.
- Complete metadata compliance reporting is distributed across modules rather
  than unified as a canonical report.
- Source-to-output lineage exists through records and references but is not
  yet exposed as a single lineage map.
- Update impact analysis is not yet first-class for every publication change.
- Withdrawal readiness is implemented for core publishing records but not yet
  generalized for every external channel category.
- Duplicate and orphan publication analysis remains a governance inventory
  activity.

## Baseline Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| Approved master source | Partial foundation | Library, workflow, and publishing records exist |
| Publication model | Partial foundation | Library and publishing share responsibilities; canonical aggregate future |
| Publication package | Early foundation | Manifests documented; full immutable package future |
| Metadata requirements | Partial foundation | Library, public portal, commerce, rights, and export metadata exist |
| Digital formats | Partial foundation | Export and layout publishing formats exist |
| Print publication | Partial foundation | Commerce print profiles and layout print formats exist |
| Distribution model | Partial foundation | Layout publishing, public portal, and commerce distribution records exist |
| Channel connectors | Early foundation | Metadata exists; formal adapters future |
| Updates and corrections | Early foundation | Republishing exists; full impact analysis future |
| Withdrawal | Partial foundation | Withdrawal preserves history in Phase 7 Step 16 |
| Integrity validation | Early foundation | Checksums and artifact metadata exist in exports; full package integrity future |
| Audit | Partial foundation | Publishing, library, rights, public portal, and commerce audit records exist |

## Baseline Conclusion

The repository has a strong publication foundation with Library ownership,
Publishing preflight, export artifacts, public portal metadata, commerce
records, rights warnings, distribution tracking, and withdrawal history.

Standard 14 consolidates these capabilities into one canonical publishing,
distribution, update, withdrawal, and integrity model. Future implementation
must map existing records before introducing canonical package manifests or
connector adapters.

