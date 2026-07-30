# Codex Dependency Registry

The Dependency Registry records dependencies between modules, APIs, events,
data models, workflows, AI agents, infrastructure, and governance rules.

## Dependency Types

The registry tracks:

- Module dependencies.
- API dependencies.
- Event dependencies.
- Data model dependencies.
- Workflow dependencies.
- AI agent dependencies.
- Infrastructure dependencies.
- Security dependencies.
- Compliance dependencies.
- Quality gate dependencies.

## Rules

- Dependencies must be explicit.
- Circular dependencies are not allowed unless documented, controlled, and
  approved.
- Shared services must remain shared and must not be duplicated.
- Modules must not create hidden direct dependencies.
- Dependencies must preserve module ownership boundaries.
- Dependency changes require impact analysis.

## Core Dependency Layers

Universal governance dependencies:

- IAM.
- Data Governance.
- Configuration.
- Observability.
- Audit.
- DevSecOps.
- Quality Assurance.
- Enterprise Architecture.
- Compliance.

Editorial production dependencies:

- Library.
- Translation.
- Editorial Review.
- Publishing.
- Rights and Provenance.
- Workflow.

AI dependencies:

- AI Orchestration.
- AI Governance.
- Quality Assurance.
- Compliance.
- Enterprise Architecture.

Operational dependencies:

- Backup.
- Observability.
- DevSecOps.
- Integration.
- Configuration.
- Security.

## Current Baseline

Dependencies are described across module documents, architecture chapters,
roadmaps, and migration plans. A single machine-readable dependency registry
does not yet exist.

## Migration Guidance

Future implementation should:

1. Extract dependencies from module documentation.
2. Classify dependency type and direction.
3. Detect potential cycles.
4. Link dependencies to impact analysis.
5. Add dependency review to architectural change workflow.
