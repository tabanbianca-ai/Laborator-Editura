# Schema Registry

## Purpose

Schema Registry governs all schemas exchanged between services, stored in
master records, used by APIs, emitted through events, imported from files, or
used to generate publication artifacts.

## Supported Schema Types

The registry should support:

- JSON Schema.
- OpenAPI schemas.
- AsyncAPI schemas.
- Avro where required.
- Protobuf where required.
- XML Schema for editorial integrations.

## Current Repository Baseline

Current schema definitions include:

- JSON Master TypeScript types and schema in `packages/shared/src/json-master-format`.
- API contract documentation under `docs/modules/*/api-contracts.md`.
- Event documentation under `docs/modules/*/events.md`.
- Runtime database backup format and schema version in `packages/db`.
- PostgreSQL migrations for core physical schema.

No central Schema Registry runtime exists yet.

## Compatibility Rules

- Every schema has a version.
- Published schemas are not modified retroactively.
- Incompatible changes require a major version.
- Consumers must be checked before deprecation.
- Compatibility must be tested automatically before rollout.
- Schema references must be present in data contracts.

## Registry Record

Each schema record should include:

- `id`.
- `name`.
- `namespace`.
- `version`.
- `entityType`.
- `schemaDefinition`.
- `requiredFields`.
- `validationRules`.
- `compatibilityPolicy`.
- `status`.
- `publishedAt`.
- `deprecatedAt`.
- `ownerId`.
- `stewardId`.
