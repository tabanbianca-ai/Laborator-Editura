# Naming Conventions

## Document Control

- Title: Naming Conventions.
- Identifier: STANDARD-01-NAMING-CONVENTIONS.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Platform Architecture.
- Reviewers: Engineering Governance, Documentation Governance, Data
  Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/naming-versioning/overview.md`,
  `docs/DEVELOPMENT_CONVENTIONS.md`.
- References: `docs/database/database-conventions.md`,
  `docs/backend/api-standards.md`.
- Change history:
  - 1.0.0: Initial naming conventions baseline.

## Purpose

This document defines canonical naming rules for modules, services, APIs,
events, databases, code objects, UI components, documentation, configuration,
AI assets, and infrastructure assets.

## General Rules

Names must be:

- English for implementation-facing artifacts.
- Stable.
- Descriptive.
- Searchable.
- Consistent with domain ownership.
- Free of ambiguous abbreviations unless the abbreviation is approved.
- Free of mixed language naming.
- Different from display labels unless the artifact is user-facing metadata.

## Module Names

Canonical module names use lowercase kebab-case with the `module-` prefix when
the name is used as an enterprise artifact identifier.

Examples:

- `module-editorial-review`.
- `module-library`.
- `module-magazine`.
- `module-audio`.

Repository folder names may omit the `module-` prefix when the folder already
lives under a module namespace, such as `docs/modules/translation` or
`apps/api/src/modules/translation-memory`.

## Service Names

Services use lowercase kebab-case for artifact names and PascalCase for class
names.

Examples:

- Artifact name: `translation-service`.
- Artifact name: `workflow-service`.
- Artifact name: `publication-service`.
- Artifact name: `ai-orchestrator`.
- Class name: `TranslationService`.
- Class name: `WorkflowService`.

## API Names

APIs must use lowercase plural nouns where appropriate, hyphenated resource
names, and explicit versions for future public or external contracts.

Examples:

- `GET /api/v1/books`.
- `POST /api/v1/translations`.
- `DELETE /api/v1/workflows/{id}`.

Compatibility rule:

- Existing validated API paths must not be renamed without an approved API
  versioning and migration plan.
- New public APIs should be versioned.
- Internal APIs should document whether they are versioned, private, or
  compatibility-stable.

## Event Names

Events use past tense and PascalCase.

Examples:

- `BookPublished`.
- `TranslationCompleted`.
- `WorkflowApproved`.
- `PromptValidated`.

Events must describe something that already happened. Commands and requests
must not be named as events.

## Database Names

Canonical future physical table designs use singular lowercase `snake_case`
unless a compatibility rule preserves an existing validated plural table name.

Examples:

- `book`.
- `translation`.
- `publication`.
- `workflow`.
- `audit_record`.

Common column names:

- `created_at`.
- `updated_at`.
- `created_by`.
- `updated_by`.
- `deleted_at`.
- `version`.
- `status`.

Compatibility rule:

- Existing deployed or validated table names must not be renamed without an
  approved compatibility migration.

## Class Names

Classes use PascalCase.

Examples:

- `BookService`.
- `TranslationEngine`.
- `WorkflowManager`.

## Method Names

Methods use lower camelCase and start with a verb.

Examples:

- `publishBook()`.
- `approveTranslation()`.
- `createWorkflow()`.

## Constant Names

Constants use uppercase `SNAKE_CASE`.

Examples:

- `MAX_UPLOAD_SIZE`.
- `DEFAULT_LANGUAGE`.
- `SYSTEM_ADMIN_ROLE`.

## Documentation Names

Documentation filenames use lowercase kebab-case and Markdown extensions.

Examples:

- `api-contracts.md`.
- `domain-model.md`.
- `migration-plan.md`.
- `compliance-audit.md`.

Document titles may use Title Case.

## UI Component Names

UI component files and exported component names must follow the established
frontend conventions in the codebase. Component display text must come from
i18n dictionaries, not from implementation-facing names.

## AI Asset Names

AI assets must define canonical names for:

- Agent.
- Subagent.
- Prompt.
- Model profile.
- Evaluation set.
- RAG source.
- Tool permission.

AI display labels are localized separately from internal canonical names.

## Infrastructure Names

Infrastructure asset names use lowercase kebab-case or provider-compatible
names. Environment-specific suffixes must be explicit, such as `staging` or
`production`.

## Duplicate Names

Duplicate names are allowed only when scopes differ and the canonical
identifier makes the distinction clear. Ambiguous duplicates must be resolved
through canonical ownership or renamed through a migration plan.
