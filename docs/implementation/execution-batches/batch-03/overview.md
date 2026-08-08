# Batch 03 Overview

Batch: Canonical data models, data ownership, migrations, and API contracts
Baseline branch: `main`
Scope status: P0/P1 information and contract foundation

## Goal

Establish the repository-level information foundation for Laborator Editura
without implementing full Library, Translation, or Publishing functionality and
without making destructive schema, Docker, staging, or public API changes.

## Start Conditions

| Condition | Status | Evidence |
| --- | --- | --- |
| Canonical identities available | Validated | Batch 02 auth identity foundation |
| Organizations and projects identifiable | Validated | `organizations`, `projects`, `auth_identities` runtime tables |
| Server-side data isolation applicable | Validated | `selectForTenant` and `findByIdForTenant` runtime accessors |
| Central configuration available | Validated | `packages/shared/src/configuration.ts` |
| Structured logs and correlation identifiers available | Validated | `packages/shared/src/structured-logging.ts` |
| Reproducible test and build commands available | Validated | `pnpm test`, `pnpm build` |
| CI can validate schemas and migrations | Validated | CI and repository tests |
| Recoverable baseline exists | Validated | `main` branch and git history |

## Implemented Scope

- Added shared canonical data, metadata, API, event, migration, import/export,
  referential integrity, and retention contract types in `@laborator/shared`.
- Inventoried persistent runtime data stores, SQL migrations, local persistent
  files, generated artifacts, and unsupported data-store categories.
- Created canonical entity registry for the initial 20 approved entity types.
- Mapped data ownership, write authority, read interfaces, event ownership,
  retention ownership, security ownership, and backup tiers.
- Documented metadata and audit applicability, lifecycle states, referential
  integrity rules, migration standardization, API contracts, event contracts,
  import/export contracts, data classification, retention, and rollback.
- Added Batch 03 contract tests.

## Explicit Non-Scope

- No destructive database migration.
- No public API route change.
- No Docker or staging configuration change.
- No runtime outbox implementation unless a later batch approves it.
- No automatic merge of ambiguous historical entities.

