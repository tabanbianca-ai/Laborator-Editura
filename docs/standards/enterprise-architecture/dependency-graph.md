# Canonical Dependency Graph Standard

## Purpose

The dependency graph is the canonical map of modules, services, applications,
APIs, events, data ownership, AI dependencies, integration points, and
infrastructure relationships.

## Required Maps

Codex must maintain or be able to generate:

- Dependency Graph.
- Service Map.
- Event Map.
- Data Ownership Map.
- AI Dependency Map.
- Integration Map.

## Current Static Dependency Baseline

The current repository baseline includes:

- 25 Phase II module overview documents under `docs/modules`.
- 16 Phase IV standard overview documents before Standard 17.
- 7 Phase III framework overview documents under `docs/frameworks`.
- 36 runtime API module directories under `apps/api/src/modules`.
- 36 runtime API module files.
- 36 runtime API controller files.
- 35 runtime API service files.
- 35 runtime API repository files.
- 25 module `api-contracts.md` documents.
- 25 module `events.md` documents.
- 25 module `domain-model.md` documents.
- Applications: `apps/api`, `apps/web`, and `apps/ai`.
- Shared packages: `packages/db` and `packages/shared`.

## Observed Runtime Dependency Examples

Static inspection shows explicit module imports such as:

- Documents depends on Projects.
- Segments depends on Documents.
- Translations depends on Segments, Translation Memory, Terminology, QA,
  Semantic Fidelity, and Lexicographic.
- QA depends on Terminology.
- Semantic Fidelity depends on Terminology, Translation Memory, QA, and
  Lexicographic.
- Workflow depends on QA and Semantic Fidelity.
- Export depends on Auth, Projects, Documents, Segments, Translations, and
  Workflow.
- Layout Publishing depends on Export, Library, Rights and Provenance, and
  Workflow.
- Media Localization depends on Layout Publishing, Multimedia Creation,
  Lexicographic, Terminology, Translations, and Semantic Fidelity.
- Editorial Decisions depends on Lexicographic, Terminology, Translation
  Memory, and Semantic Fidelity.
- Terminology depends on Lexicographic.

## Graph Rules

- Dependency graphs must show direction.
- Dependencies must point from consumer to provider.
- Runtime imports must match documented contracts.
- Cycles must be detected and remediated or approved as temporary
  architecture exceptions.
- Graph updates must be included in architecture change review.

