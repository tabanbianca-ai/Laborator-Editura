# Data Contracts

## Purpose

Data Contracts define the structure, meaning, ownership, quality, update
frequency, classification, retention, compatibility, and error behavior for
data produced or consumed by platform modules.

## Contract Fields

Each contract should include:

- Name.
- Version.
- Owner.
- Producer.
- Consumer list.
- Entity.
- Schema reference.
- Quality rules.
- Classification.
- Retention.
- Compatibility policy.
- Error behavior.
- Update frequency.
- Contact or stewardship owner.

## Example

```yaml
data_contract:
  name: publication-metadata
  version: 1.0.0
  owner: publishing-module
  entity: publication
  schema: publication.schema.json
  quality_rules:
    - title_required
    - original_language_required
    - first_publication_year_required
  classification: internal
```

## Current Repository Baseline

Contract information is distributed across:

- API contract documents.
- Event documents.
- Module domain models.
- TypeScript DTO and type files.
- JSON Master schema and fixtures.
- Runtime backup format.

## Rules

- Every shared data producer must publish a contract.
- Contract changes must be versioned.
- Breaking changes require compatibility review and major version updates.
- Contracts must identify data classification and retention requirements.
- Contracts must reference quality rules where applicable.
