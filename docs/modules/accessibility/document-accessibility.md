# Document Accessibility

## Purpose

Document Accessibility ensures generated editorial outputs are accessible,
machine-readable, navigable, and traceable to source master records.

## Covered Outputs

Document accessibility applies to:

- EPUB.
- PDF.
- PDF/UA.
- HTML.
- XML.
- Print-ready PDF metadata where relevant.
- JSON Master accessibility metadata.
- Distribution metadata feeds.

## Required Capabilities

Accessible publications must support:

- Semantic document structure.
- Correct heading hierarchy.
- Reading order.
- Chapter navigation.
- Landmarks.
- Bookmarks.
- Alternative text for images.
- Long descriptions where required.
- Language metadata.
- Table structure.
- Footnote and citation relationships.
- Accessible links.
- Metadata for title, language, author, translator, rights, and publication.

## Current Repository Baseline

Current strengths:

- Publishing documentation defines publication builds, formats, profiles, and
  preflight.
- Distribution Center includes readiness checks and blocker states.
- JSON Master can carry language, media, layout, publication, and future
  accessibility metadata.
- Library publication records include available formats, language, locale,
  rights, source provenance, and publication lifecycle.
- Release checklist recommends manual accessibility and viewport validation.

Current gaps:

- No PDF/UA validator is configured.
- No EPUB Accessibility validation engine is configured.
- Export artifacts do not yet uniformly carry machine-readable accessibility
  conformance metadata.
- Alternative text and reading order are not centrally managed.
- Accessibility validation is not yet a formal pre-publication gate for every
  generated output.

## Standards

Target standards:

- EPUB Accessibility.
- PDF/UA.
- Semantic HTML5.
- WCAG 2.2 AA where applicable to web-rendered publications.

## Rules

- Generated files are derived outputs, not sources of truth.
- Derived outputs must reference master record, master version, generator
  version, configuration profile, and generation timestamp.
- Accessibility metadata must travel with export and publication artifacts.
- Publication must not ignore blocking accessibility issues when policy marks
  them as required.
