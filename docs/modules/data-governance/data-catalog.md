# Data Catalog

## Purpose

Data Catalog provides a searchable inventory of platform datasets, resource
classes, ownership, schemas, quality state, lineage, sensitivity, retention,
consumers, and dependencies.

## Catalog Entry Fields

Each catalog entry should preserve:

- Name.
- Description.
- Domain.
- Owner.
- Steward.
- Source.
- Sensitivity.
- Schema.
- Quality.
- Retention.
- Consumers.
- Dependencies.
- Lineage.
- Status.

## Current Repository Baseline

The repository has documentation and runtime sources that can seed a future
catalog:

- `docs/domain/domain-model.md`.
- `docs/data/logical-data-model.md`.
- `docs/database/physical-data-model.md`.
- `packages/db/src/runtime-database.ts`.
- `docs/modules/*/domain-model.md`.
- `docs/modules/*/api-contracts.md`.
- `docs/modules/*/events.md`.
- `docs/JSON_MASTER_FORMAT.md`.

No searchable runtime Data Catalog exists yet.

## Capabilities

The Data Catalog should support:

- Search.
- Filtering.
- Domain navigation.
- Dependency visualization.
- Sensitive data identification.
- Owner and steward discovery.
- Schema and contract lookup.
- Quality state review.
- Lineage navigation.

## Rules

- Catalog data inherits classification from underlying resources.
- Restricted metadata must not be exposed to unauthorized users.
- Catalog entries must link to schemas, contracts, lineage, and retention
  policy where available.
- Search must respect IAM and Need-to-Know.
