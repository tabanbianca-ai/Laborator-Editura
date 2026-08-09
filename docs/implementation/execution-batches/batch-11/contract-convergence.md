# Contract Convergence

Status: Contract convergence reviewed  
Owner: Architecture Governance

## Review Scope

- APIs;
- events;
- data models;
- permissions;
- states;
- configurations;
- localization;
- AI models and routing metadata.

## Decisions

| Area | Decision | Evidence |
| --- | --- | --- |
| API routes | CANONICAL | Existing additive endpoints are contract-tested. |
| Runtime persistence tables | CANONICAL_WITH_COMPATIBILITY | Runtime database and backup tests cover table inventory. |
| Workflow states | CANONICAL | Workflow contract tests cover transition and export gates. |
| Roles and permissions | CANONICAL | Auth, admin, need-to-know, and security tests cover RBAC boundaries. |
| Localization | CANONICAL | Shared locale catalogs and web tests cover seven initial UI languages. |
| AI governance | CANONICAL | Batch 09 and AI governance tests cover orchestrator and approval boundaries. |
| Operational readiness | CANONICAL | Batch 10 shared contract and docs define RC1 gates. |
| Build artifact model | MIGRATION_REQUIRED | Immutable artifact digest and provenance evidence must be added before RC1 approval. |
| Dependency lock model | HUMAN_DECISION_REQUIRED | `pnpm-lock.yaml` is missing; freeze requires lockfile or approved exception. |

## Rule

Deprecated or compatibility contracts must remain tested until migration is complete.

