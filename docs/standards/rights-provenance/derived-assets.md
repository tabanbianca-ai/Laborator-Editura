# Canonical Derived Assets Rights Standard

## Purpose

This document defines rights and provenance requirements for derived assets
under Standard 13.

## Required Derived Asset Linkage

Every derivative asset must be associated with:

- Source resource.
- Exact source version.
- Transformation operation.
- Inherited rights.
- Additional rights required.
- Person or agent that performed the transformation.
- Approval.
- Generation date.

## Examples

```text
Master edition
  -> PDF
  -> EPUB
  -> Audiobook
  -> Video
  -> Promotional excerpt
```

Derived assets do not modify the official edition and do not become
independent sources.

## Rights Inheritance

Derived assets automatically inherit source restrictions.

Example:

```text
Source:
  commercial_use: false
  territory: Spain

Derived audiobook:
  commercial_use: false
  territory: Spain
```

A derivative asset cannot receive broader rights than the source without
additional documented authorization.

## Promotional Materials

Promotional materials are derivative assets. They require:

- Official published source edition.
- Derived-use authorization.
- Channel authorization.
- Territory authorization.
- Format authorization.
- Attribution and restriction preservation.

Promotional materials must not modify the official edition.

