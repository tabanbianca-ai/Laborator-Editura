# Provenance Model

## Purpose

Provenance records where an editorial resource comes from and preserves the
verifiable history needed for legal, editorial, translation, and publication
decisions.

## Required Provenance Fields

For each Library Item, provenance should preserve:

- Original source.
- Original author.
- Original title.
- Original language.
- First publication year.
- Original edition.
- Original publisher.
- Acquisition method.
- Source reference.
- Translator.
- Reviewer.
- Publisher.
- Publication history.

Validated provenance is immutable except through a new audited correction or
versioned legal update.

## Current Baseline

Current `ProvenanceRecord` supports:

- Project and document references.
- Original title.
- Original language and locale.
- Authoring and target language metadata.
- First publication year.
- Original edition.
- Original publisher.
- Original source reference.
- Original author.
- Translator.
- Reviewer.
- Publisher.
- Publication history.
- Free-form metadata.
- Audit event on creation.

## Target Behavior

The provenance layer should:

- Link directly to Library Item and Library publication records.
- Store acquisition method.
- Preserve source evidence references.
- Track validation status.
- Track provenance version.
- Prevent silent overwrite after validation.
- Support provenance correction as a new audited version.

## Provenance Validation

Validation should check:

- Original source is identified.
- Original author is recorded where applicable.
- Original language is present.
- Original edition and publisher are known when required.
- Acquisition method is documented.
- Contract/license references exist when the resource is not public domain or
  original creation.

## Current Gaps

- Provenance is currently document/project scoped, not directly Library Item
  scoped.
- Acquisition method is not a first-class field.
- Provenance validation status is not modeled.
- Provenance versioning and correction workflow are not first-class.
- Validated provenance immutability is not enforced beyond audit guidance.

## Integration Rule

Library remains the source of truth for resource identity. Rights and
Provenance owns the legal/source truth about where the resource comes from.
