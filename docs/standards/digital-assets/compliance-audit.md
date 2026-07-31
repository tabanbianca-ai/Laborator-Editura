# Canonical Digital Asset and Editorial Content Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 06:
Canonical Document, Digital Asset and Content.

It is a documentation and governance audit. It does not change runtime
document storage, file processing, export generation, APIs, database schema,
Docker, infrastructure, or UI behavior.

## Audit Date

2026-07-31.

## Baseline Inventory

| Area | Current count or evidence |
| --- | --- |
| Library module documents | 12 documents under `docs/modules/library` |
| Publishing, Rights, Translation, Magazine, Audio, Video, Accessibility documents | 79 documents across related module documentation |
| Backend content and asset runtime files | 45 files across Documents, Author Studio, Export, Layout Publishing, Multimedia Creation, Media Localization, Public Portal, Library, and Rights Provenance modules |
| JSON Master documentation | `docs/JSON_MASTER_FORMAT.md` |
| Domain and logical data documents | `docs/domain` and `docs/data` |
| Searchable content/asset related docs | 59 matching documentation files across `docs` |
| Canonical standards before Standard 06 | Standard 01 through Standard 05 |
| Canonical standards after Standard 06 | Standard 01 through Standard 06 |

## Digital Asset Inventory Summary

Current content and asset foundations include:

- Library asset management.
- Library metadata model.
- Library versioning.
- Documents module.
- Author Studio manuscripts and drafts.
- Translation documents and segments.
- Rights and Provenance records.
- Publishing profiles, builds, exports, and distribution.
- Export artifacts.
- Public Portal publication metadata.
- Magazine issues and articles.
- Audio narration projects.
- Video projects and media assets.
- Multimedia Creation projects and assets.
- Media Localization assets.
- Accessibility document and audio/video metadata.
- JSON Master Format.

## Master Document Validation

Current strengths:

- JSON Master is documented as a canonical interchange and preservation
  structure.
- Library is documented as central editorial repository and Single Source of
  Truth.
- Translation alignment, manuscript language organization, rights provenance,
  export metadata, and publication metadata are documented.
- Export artifacts and publication records preserve source references in the
  target architecture.

Current gaps:

- Not every asset family has an explicit canonical master identifier.
- Some derivative format relationships are documentation-level rather than
  enforced through a central runtime registry.
- Media and accessibility derivatives are not yet fully connected to a single
  master registry.
- Duplicate and orphan asset detection is not centralized.

## Metadata Compliance Assessment

Current strengths:

- Data Model Standard defines required canonical metadata.
- Library metadata model exists.
- Rights and Provenance metadata exists.
- Language policy, manuscript language organization, publication type,
  editorial taxonomy, and export metadata are documented.
- Accessibility metadata is documented in the Accessibility module.

Current gaps:

- Mandatory metadata coverage must be audited per asset family.
- ISBN, DOI, edition, rights, accessibility status, checksum, and derivative
  metadata are not uniformly required by runtime records.
- Metadata completeness scoring is not centralized.

## Relationship Analysis

Current strengths:

- Domain and logical data relationships are documented.
- Translation alignment is documented.
- Rights and Provenance relationships are documented.
- Publishing and Distribution relationships are documented.
- Media Localization and Multimedia Creation link assets to projects and
  sources in the target architecture.

Current gaps:

- A central digital asset relationship registry is not implemented.
- Relationship types such as `AUDIO_VERSION_OF`, `VIDEO_VERSION_OF`, and
  `ILLUSTRATION_FOR` are not uniformly enforced.
- Derivative-to-master impact analysis remains a future governance capability.

## Lifecycle Review

Current strengths:

- Editorial pipeline states exist.
- Workflow Engine, publishing workflow, preflight, distribution, export,
  review, and approval foundations exist.
- Human Final Authority is consistently documented.

Current gaps:

- Asset lifecycle state mapping is not centralized across all asset families.
- Archived and restored state handling differs by module.
- Lifecycle event coverage should be audited per asset family.

## Preservation Assessment

Current strengths:

- Backup, disaster recovery, retention, and preservation foundations exist.
- JSON Master supports export and preservation.
- Audit and version history requirements are documented.

Current gaps:

- Preservation format policy is not centrally defined per asset family.
- Integrity verification is not uniformly attached to every derivative.
- Long-term archival policy is not fully operationalized across media and
  publication artifacts.

## Duplicate and Orphan Risk

Potential risks:

- Multiple module-level asset records may refer to the same editorial work
  without a shared canonical master.
- Export artifacts may exist without complete source master version metadata.
- Media assets may exist without explicit source content relationships.
- Publication records may lack complete rights or provenance references.
- Marketing materials may be less governed than editorial assets.

Standard 06 becomes the canonical owner for document, digital asset, master
document, derivative, metadata, lifecycle, relationship, and preservation
rules. Existing documents remain local module guidance and must reference
Standard 06 instead of creating conflicting models.

## Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| Canonical master model | Partially compliant | JSON Master and Library foundations exist; central master registry future |
| Metadata | Partially compliant | Strong docs exist; uniform runtime completeness audit future |
| Relationships | Partially compliant | Relationships documented; central relationship registry future |
| Lifecycle | Partially compliant | Workflow exists; asset lifecycle mapping future |
| Rights awareness | Mostly compliant baseline | Rights and Provenance module exists |
| Accessibility | Partially compliant | Accessibility metadata documented; enforcement future |
| Preservation | Partially compliant | Backup/preservation foundations exist; integrity policy future |
| Duplicate/orphan detection | Early foundation | Needs future registry and checks |

## Immediate Standardization Priorities

1. Treat Standard 06 as canonical owner for document, digital asset, content,
   derivative, metadata, lifecycle, relationship, and preservation rules.
2. Preserve existing Library, Documents, Author Studio, Translation, Rights,
   Publishing, Export, Public Portal, Multimedia, Media Localization, Audio,
   Video, Magazine, Accessibility, Backup, and JSON Master behavior.
3. Inventory all asset families and map each to canonical master, metadata,
   lifecycle, relationship, preservation, rights, and audit requirements.
4. Define derivative-to-master mapping before expanding export, media, or
   public distribution workflows.
5. Plan duplicate/orphan detection and metadata completeness checks as future
   approved implementation phases.

