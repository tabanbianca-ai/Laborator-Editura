# Metadata Registry

## Purpose

Metadata Registry is the official source for metadata namespaces, schemas,
fields, data types, required values, enumerations, validation rules, localized
labels, compatibility policy, and field deprecation.

## Metadata Types

Supported metadata types:

- Descriptive.
- Structural.
- Administrative.
- Technical.
- Rights.
- Preservation.
- Accessibility.
- Provenance.
- Workflow.
- Distribution.

## Current Repository Baseline

Metadata currently exists in:

- JSON Master optional `metadata` fields.
- Module-specific TypeScript interfaces.
- Runtime database JSON fields.
- Domain documentation.
- Publishing, Rights, Library, Research, Translation, Media, and Export
  records.
- Frontend display models.

These metadata definitions are useful but not centrally registered.

## Registry Requirements

Metadata Registry must manage:

- Namespace.
- Schema.
- Field definitions.
- Type definitions.
- Required fields.
- Enumerations.
- Validation rules.
- Localized labels.
- Compatibility policy.
- Field deprecation.
- Source authority.
- Owner and steward.

## Multilingual Metadata

Metadata must support localized values:

```json
{
  "title": {
    "ro": "Cartea Spiritelor",
    "fr": "Le Livre des Esprits",
    "es": "El Libro de los Espiritus"
  }
}
```

The model must distinguish:

- Canonical value.
- Translation.
- Transliteration.
- Alternative name.
- Historical name.

## Rules

- Metadata schemas are versioned.
- Published schemas are immutable.
- Incompatible changes require a major version.
- Deprecated fields remain auditable.
- AI-extracted metadata remains unvalidated until approved by policy.
