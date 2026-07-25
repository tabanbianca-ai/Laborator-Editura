# Publication Profiles

## Purpose

Publication profiles define the formatting, layout, accessibility, language,
and output constraints used to build publication packages.

## Profile Fields

Each profile should define:

- Page size.
- Fonts.
- Margins.
- Numbering.
- Cover requirements.
- Metadata requirements.
- Accessibility requirements.
- Language and locale.
- Format target.
- Print or digital constraints.

## Examples

- A4 Print.
- A5 Print.
- EPUB Standard.
- Mobile Reader.
- Flipbook.
- Print-ready PDF.
- Audiobook Package.
- Video Package.

## Current Baseline

Current profile-related foundations include:

- `EditorialFinishingProfile` in `layout-publishing`.
- `BookLayoutPlan` and `MagazineLayoutPlan`.
- `LayoutExportFormat`.
- Commerce print profiles for European and American trim sizes.
- Publishing workspace display of print profile metadata.
- Distribution Center preflight coverage for formats, layout, cover, fonts,
  and accessibility-related outputs.

## Rules

- Profiles must be metadata-driven.
- Profiles must be reusable and versionable.
- Profile changes must not mutate already published editions.
- Profiles must support new formats without changing existing publication
  logic.
- Profile selection must be auditable.

## Library Integration

Library remains the owner of canonical publication metadata. Publication
profiles may reference Library metadata, but they must not duplicate it as an
independent source of truth.

## Current Gaps

- A canonical `PublicationProfile` entity does not yet exist.
- Profile versioning is not first-class.
- Accessibility profiles are represented through format/status metadata but
  not as dedicated profile rules.
- Flipbook is represented as a planned/readiness concept, not as a generator
  profile.
