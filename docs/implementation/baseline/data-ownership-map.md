# Data Ownership Map Baseline

Status: Batch 01 baseline

## Purpose

This map records initial ownership boundaries for Batch 01. It does not change runtime
persistence.

| Data family | Owner | Current location |
| --- | --- | --- |
| Auth users, credentials, sessions, activity | Auth module | `apps/api/src/modules/auth`, `packages/db/src/runtime-database.ts` |
| Projects and project dossiers | Projects module | `apps/api/src/modules/projects`, project dossier repository/tests |
| Documents and segments | Documents and Segments modules | `apps/api/src/modules/documents`, `apps/api/src/modules/segments` |
| Translations and Translation Memory | Translations and Translation Memory modules | `apps/api/src/modules/translations`, `apps/api/src/modules/translation-memory` |
| Terminology and lexicographic evidence | Terminology and Lexicographic modules | `apps/api/src/modules/terminology`, `apps/api/src/modules/lexicographic` |
| Semantic fidelity and QA | Semantic Fidelity and QA modules | `apps/api/src/modules/semantic-fidelity`, `apps/api/src/modules/qa` |
| Workflow, export, publishing | Workflow, Export, Layout/Publishing modules | API modules and runtime database |
| Rights and provenance | Rights Provenance module | `apps/api/src/modules/rights-provenance` |
| Runtime database state | Database package | `packages/db/src/runtime-database.ts` |
| Configuration, error, logging, localization foundations | Shared package | `packages/shared/src` |

## Ownership Rules

- Every table-like runtime collection must have one owner module.
- Cross-module use must go through services, repositories, public contracts, or
  additive metadata.
- AI output is evidence and cannot own editorial data.

