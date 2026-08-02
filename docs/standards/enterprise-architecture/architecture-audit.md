# Enterprise Architecture and Dependency Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 17:
Canonical Enterprise Architecture and Dependency Governance.

It is a documentation and governance audit. It does not change runtime
behavior, APIs, database schema, Docker, staging, frontend behavior, tests, or
application logic.

## Audit Date

2026-08-02.

## Static Inventory

| Area | Current count or evidence |
| --- | --- |
| Phase II module overview documents | 25 overview documents under `docs/modules` |
| Phase IV canonical standard overview documents before Standard 17 | 16 overview documents under `docs/standards` |
| Phase III framework overview documents | 7 overview documents under `docs/frameworks` |
| Runtime API module directories | 36 directories under `apps/api/src/modules` |
| Runtime API module files | 36 `*.module.ts` files |
| Runtime API controller files | 36 `*.controller.ts` files |
| Runtime API service files | 35 `*.service.ts` files |
| Runtime API repository files | 35 `*.repository.ts` files |
| Module API contract documents | 25 `api-contracts.md` documents under `docs/modules` |
| Module event documents | 25 `events.md` documents under `docs/modules` |
| Module domain model documents | 25 `domain-model.md` documents under `docs/modules` |
| Applications | `apps/api`, `apps/web`, `apps/ai` |
| Shared packages | `packages/db`, `packages/shared` |
| Searchable architecture/dependency candidates | Documentation and source candidates across apps, packages, docs, infrastructure, and deploy before classification |

## Current Strengths

- Codex Governance Framework exists.
- Enterprise Meta-Architecture exists.
- Dependency Registry exists.
- Reference Models document exists.
- Module Catalog exists.
- Canonical Definitions registry exists.
- Architecture chapters exist.
- Backend architecture, frontend architecture, integration architecture,
  workflow architecture, security architecture, AI architecture, and DevOps
  architecture documents exist.
- Runtime API modules generally follow module/controller/service/repository
  structure.
- Module documentation consistently includes API contracts, events, and domain
  models for the Phase II module set.

## Current Gaps

- A single machine-readable dependency graph is not yet maintained.
- A single machine-readable service map is not yet maintained.
- Event topology is documented by module but not consolidated into one map.
- Data ownership is documented across domain, data, database, module, and
  standard documents but not yet enforced through a single registry.
- AI Dependency Map is not yet generated as a canonical artifact.
- Integration Map is distributed across Integration, Gateway, Enterprise
  Integration, and module documents.
- Runtime dependencies are explicit in module imports but are not yet fully
  compared against documented contracts.
- Architecture risk assessment exists through governance documents but is not
  yet attached to every dependency change.
- Redundant or overlapping components require mapping before consolidation.

## Baseline Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| Module model | Partial foundation | Module documentation and runtime structure exist |
| Dependency model | Partial foundation | Dependency Registry exists; generated graph future |
| Data ownership | Partial foundation | Ownership rules exist across data/domain/module docs |
| API contracts | Partial foundation | Module API docs exist; enterprise catalog future |
| Event topology | Partial foundation | Module events docs exist; consolidated topology future |
| Dependency graph | Early foundation | Static imports visible; generated graph future |
| Architecture audit | Partial foundation | Governance and quality audits exist |
| Consolidation roadmap | Partial foundation | Codex consolidation report exists |

## Baseline Conclusion

The repository has a strong architecture foundation with Codex Governance,
Meta-Architecture, module catalog, dependency registry, reference models,
architecture chapters, module documents, runtime module structure, and
canonical standards.

Standard 17 consolidates these into one enterprise architecture and dependency
governance model. Future implementation must generate machine-readable maps
and compare runtime dependencies against documented contracts before any
consolidation or architectural restructuring.

