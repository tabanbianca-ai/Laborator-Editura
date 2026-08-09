# Codex Standards Dependency Matrix

## Purpose

This matrix records the canonical dependencies between standards, frameworks,
policies, and specifications.

## Dependency Rules

- Every standard must declare dependencies.
- A new standard must not invalidate approved baseline standards.
- Cross-standard dependencies must be explicit.
- Local documents may describe local impact but must not redefine upstream
  canonical rules.
- Dependency changes require justification, impact analysis, compatibility
  review, migration plan when needed, approval, and audit.

## Standards Dependency Matrix

| Standard | Primary dependencies | Downstream dependents |
| --- | --- | --- |
| Standard 01 | Manifest, Development Conventions | All standards, modules, frameworks |
| Standard 02 | Standard 01, Data Engineering | JSON Master, database, APIs, events, AI assets |
| Standard 03 | Standard 01, Standard 02, Enterprise Integration | APIs, events, webhooks, connectors, gateway |
| Standard 04 | Standard 01, Standard 02, Standard 03, AI Engineering | AI agents, prompts, models, RAG, AI governance |
| Standard 05 | Standard 01, Security Engineering | Auth, IAM, RBAC, Need-to-Know, secrets, sessions |
| Standard 06 | Standard 01, Standard 02, Library | Documents, assets, publishing, rights, backup |
| Standard 07 | Standard 01, Standard 02, Workflow Module | Editorial pipeline, approvals, business rules |
| Standard 08 | Standard 01, Configuration, Platform Engineering | Environments, deployment, feature flags, rollback |
| Standard 09 | Standard 01, Observability Module | Logs, metrics, traces, alerts, audit evidence |
| Standard 10 | Standard 01, Quality Governance | CI/CD, validation, gates, evidence, defects |
| Standard 11 | Standard 01, Development Conventions | UI language, terminology, localization, AI messages |
| Standard 12 | Standard 01, Standard 10, UI Governance | Accessible UI, documents, media, release gates |
| Standard 13 | Standard 01, Standard 06, Rights Module | Publication gates, provenance, licenses, attribution |
| Standard 14 | Standard 01, Standard 06, Standard 07, Standard 13 | Editions, packages, distribution, withdrawal |
| Standard 15 | Standard 01, Standard 06, Standard 08, Standard 09 | Backup, restore, DR, continuity, preservation |
| Standard 16 | Codex Governance, Standards 01-15 | Policies, risks, exceptions, controls, audits |
| Standard 17 | Standards 01-16, Enterprise Architecture | Module ownership, dependencies, contracts, events |
| Standard 18 | Standards 01, 16, 17, Documentation Governance | Specifications, ADRs, knowledge base, search readiness |
| Standard 19 | Standards 01, 08, 10, 16, 17, 18 | Lifecycle, compatibility, deprecation, retirement |
| Standard 20 | Standards 01-19, Quality Governance | Certification, consolidation, traceability, v1.1 planning |
| Standard 21 | Standards 01-20, Codex Governance | Future standards, standards catalog, compliance matrices |

## Dependency Graph Summary

Standard 21 governs the creation, modification, consolidation, deprecation,
and archival of standards. Standard 20 governs the Codex v1.0 architecture and
documentation certification process. Product release certification is governed
by `docs/releases/v1.0/certification-record.md`. Standards 01 through 19 govern
the operational, architectural, documentation, lifecycle, and quality domains
being certified at standards level.

## Conflict Rule

When standards conflict, use this order:

1. Project owner decision.
2. Standard 21 standards governance.
3. Standard 20 architecture and documentation certification baseline.
4. Standard 16 governance and exceptions.
5. The specific domain standard.
6. Local module, framework, or implementation guidance.
