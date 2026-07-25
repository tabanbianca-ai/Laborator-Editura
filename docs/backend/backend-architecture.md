# Backend Architecture Baseline

## Purpose

This document defines the backend baseline for Chapter 12 and compares the
current repository with the target Backend and Application Services
Architecture.

It must be reviewed before structural backend refactoring, API versioning work,
transaction redesign, background job implementation, eventing implementation,
cache introduction, or persistence changes.

## Target Architecture

The backend target is a modular monolith with clean internal layering:

```text
Delivery/API
  -> Application Services
  -> Domain Model
  -> Ports
  -> Infrastructure Adapters
  -> Database / External Services
```

The approved per-module target layout is:

```text
modules/<module>/
  api/
  application/
  domain/
  infrastructure/
  contracts/
  tests/
```

## Current Repository Baseline

The current backend is a NestJS modular monolith under
`apps/api/src/modules`.

The current module layout is mostly flat:

```text
modules/<module>/
  <module>.controller.ts
  <module>.module.ts
  <module>.repository.ts
  <module>.service.ts
  <module>.types.ts
```

Shared runtime persistence is provided by:

- `packages/db/src/runtime-database.ts`.
- `apps/api/src/modules/runtime-database.provider.ts`.

Registered backend modules include:

- `ai-governance`.
- `auth`.
- `author-studio`.
- `backup-governance`.
- `collaboration`.
- `commerce`.
- `documents`.
- `editorial-decisions`.
- `enterprise-admin`.
- `export`.
- `gateway`.
- `launch-essentials`.
- `layout-publishing`.
- `lexicographic`.
- `library`.
- `marketplace`.
- `media-localization`.
- `multimedia-creation`.
- `observability`.
- `platform-engineering`.
- `policy-engine`.
- `projects`.
- `public-portal`.
- `qa`.
- `research`.
- `rights-provenance`.
- `scheduling`.
- `security-governance`.
- `segments`.
- `semantic-fidelity`.
- `terminology`.
- `translation-memory`.
- `translations`.
- `workflow`.
- `workspace`.

## Current Strengths

- Modules are registered explicitly in `AppModule`.
- Most modules have controller, service, repository, module, and type files.
- Controllers generally delegate to services.
- Runtime persistence uses typed table names and tenant-scoped helpers.
- Central request context middleware enforces authenticated context for
  protected routes.
- Security headers and rate limiting middleware are registered globally.
- Contract tests exist for the major modules and Phase 7 refinements.
- Backup/restore support exists for the runtime database state.
- Observability, gateway, security governance, policy, backup governance, and
  AI governance have backend foundations.

## Current Gaps

- Modules do not yet use the full `api/application/domain/infrastructure`
  folder structure.
- Application services and domain services are not consistently separated.
- Public module contracts are not yet extracted from implementation classes.
- Some services depend directly on other module services instead of public
  ports or contracts.
- Current HTTP routes are not consistently prefixed with `/api/v1`.
- DTOs are mostly represented through module type files, not operation-specific
  DTO folders.
- Transaction boundaries are not explicitly modeled.
- Domain events and integration events are mostly represented by audit records
  or module metadata, not by a central event dispatcher.
- Background jobs are represented by metadata foundations, but not by a
  recoverable job runner.
- Cache strategy is not centralized.
- Correlation ID propagation is not yet standardized across every execution
  path.

## Required Alignment

Future backend work must converge toward:

- Explicit use cases for state-changing operations.
- Public commands, queries, events, and DTOs per module.
- Internal domain models independent from NestJS and persistence.
- Repository interfaces owned by the inner layer and implemented by
  infrastructure.
- Versioned API contracts.
- Classified error model and safe responses.
- Transaction boundaries and Outbox where events cross boundaries.
- Central background job and scheduling infrastructure.
- Central cache policy and key scope model.
- Unified logging, metrics, traces, health checks, and correlation IDs.

## Protection Rule

The current working backend must remain stable. Refactoring toward Chapter 12
requires an approved incremental migration plan and test coverage before
implementation.
