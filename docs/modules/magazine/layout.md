# Magazine Layout

## Purpose

Magazine Layout defines issue structure, templates, styles, reusable
components, pagination, table of contents, cover, and media placement without
changing article content.

## Layout Rule

Changing issue layout must not modify article body text or article Library
records.

Layout stores references, placement, style, and presentation metadata only.

## Target Layout Capabilities

Issue layout should support:

- Templates.
- Styles.
- Reusable components.
- Automatic pagination.
- Automatic table of contents.
- Cover placement.
- Section ordering.
- Article ordering.
- Image placement.
- Captions.
- Flipbook readiness.
- Mobile edition layout metadata.

## Current Baseline

Current layout support includes:

- `LayoutPublicationPlan`.
- `MagazineLayoutPlan` with issues, articles, columns, image galleries, covers,
  and archives.
- `EditorialFinishingProfile`.
- `LayoutExportFormat`.
- Frontend Magazine Digital Experience flipbook readiness.
- Publishing preflight checks for cover, fonts, table of contents, PDF, EPUB,
  MOBI, JSON Master, and flipbook readiness.

## Target Integration

Magazine Layout should produce or reference:

- Issue layout plan id.
- Section placement.
- Article placement.
- Cover asset reference.
- Image gallery references.
- Export profile references.
- Publishing profile references.

## Current Gaps

- Layout plans are not linked to first-class Magazine Issue records.
- Issue template/version records are not first-class.
- Layout placement per article is not stored in a magazine-specific model.
- Flipbook is readiness metadata, not a generator or layout artifact.

## Publishing Boundary

Layout prepares the issue for publication. Publishing creates official
editions and generated artifacts.
