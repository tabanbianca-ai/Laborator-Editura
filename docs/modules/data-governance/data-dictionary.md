# Data Dictionary

## Purpose

Data Dictionary defines the official meaning of each shared field, business
term, data type, domain, constraint, source, owner, and version.

## Required Fields

Each dictionary term should include:

- Name.
- Definition.
- Data type.
- Domain.
- Synonyms.
- Restrictions.
- Examples.
- Source.
- Owner.
- Version.
- Classification.
- Validation rule references.

## Example

```text
Field: firstPublicationYear
Definition: Year in which the original work was first published.
Data type: Integer.
Required: Yes.
Validation: 4-digit year; must not exceed the current year.
Owner: Editorial Governance.
Classification: Internal.
```

## Current Repository Baseline

Data definitions currently appear in:

- TypeScript interfaces.
- JSON Master schema and documentation.
- Domain model documentation.
- Logical and physical data model documentation.
- Module-specific domain-model documents.
- API contract documents.

No single Data Dictionary currently consolidates these definitions.

## Rules

- Official definitions must be versioned.
- Shared terms must not be redefined incompatibly by individual modules.
- Module-specific extensions are allowed only through documented, versioned
  schemas linked to canonical definitions.
- Localized labels are metadata; internal field names remain English.
