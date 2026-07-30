# Roadmap

## Official Platform Manifesto

Status: Active.

Reference:

- `docs/MANIFEST.md`.

Roadmap impact:

- The Manifesto is the strategic foundation for the platform.
- All roadmap phases must preserve the platform as one unified editorial
  ecosystem.
- New work must support editorial quality, complete traceability, modularity,
  extensibility, scalability, security by design, native internationalization,
  accessibility, AI-assisted collaboration, component reuse, automation of
  repetitive processes, and permanent human editorial control.
- AI agents may assist, propose, and automate repetitive work, but they must not
  replace authorized human editorial responsibility.
- Roadmap expansion must not introduce independent applications that duplicate
  existing platform functionality.
- If future implementation choices are ambiguous, the Manifesto provides the
  strategic context before the development conventions, `SPEC.md`, and
  implementation plans.

## Current Priority

The architecture is frozen for MVP implementation. Build only the core
translation platform first.

MVP stabilization is active. Prioritize implementation, integration, and testing
of existing approved modules over new design work.

## Official Development Conventions

Status: Active.

Reference:

- `docs/DEVELOPMENT_CONVENTIONS.md`.

Roadmap impact:

- All future implementation must use English for internal code, APIs,
  database objects, tests, technical documentation, and technical comments.
- All user-facing UI text must use localization dictionaries or the approved
  localization system.
- Romanian, English, Spanish, French, Portuguese, Italian, and German are the
  first-stage platform UI languages.
- Mixed-language UI is not acceptable for launch readiness.
- Standard UI terminology must follow international localization standards and
  established operating-system translations before platform-specific terms are
  added.
- Platform-specific terms must be governed through the platform terminology
  dictionary.
- Authentication, roles, sessions, and permissions remain unified across the
  public, app, and API domains.
- Future work that adds languages, modules, roles, user types, or features must
  preserve the existing architecture.
- If future implementation choices are ambiguous, the official development
  conventions take precedence.

## Official General Platform Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_1.md`.

Roadmap impact:

- Chapter 1 defines the unified platform architecture for the public website,
  application, and central API.
- Future roadmap phases must reuse shared authentication, permissions,
  database, digital library, AI infrastructure, audit, localization,
  configuration, versioning, and backup components.
- New modules must communicate through services, APIs, events, messages, or
  well-defined contracts.
- Circular dependencies and duplicated shared components are not acceptable.
- AI agents must follow the same authentication, permissions, audit, logging,
  and localization rules as the rest of the platform.
- Before any module, service, or AI agent implementation, Codex must verify
  conformity with the Manifesto, Development Conventions, Chapter 0, and
  Chapter 1.

## Official Application Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_2.md`.

Roadmap impact:

- Chapter 2 defines mandatory application architecture for code organization,
  frontend, backend, API access, module structure, state management,
  localization, authentication, authorization, configuration, file management,
  AI integration, observability, audit, background processing, testing,
  deployment, performance, security, and implementation conventions.
- New roadmap implementation work must reuse existing components and services,
  avoid circular dependencies, avoid duplicate functionality, and remain
  testable, extensible, and documented.
- Frontend work must use reusable components and the official localization
  system.
- Backend work must keep business logic out of controllers and preserve
  server-side authorization.
- Long-running work must be planned through background processing services, not
  HTTP request handlers.
- No roadmap item may introduce hardcoded secrets, direct frontend database
  access, direct module access to filesystem storage, or direct AI provider
  calls from functional modules.

## Official Module Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_3.md`.

Roadmap impact:

- Chapter 3 defines the mandatory module architecture and standard module
  template.
- New modules must follow the shared structure for controllers, services,
  domain rules, repositories, DTOs, validators, events, permissions,
  localization, tests, documentation, and index exports.
- Module work must reuse existing services before adding new code.
- Modules must integrate with shared authentication, authorization,
  localization, audit, observability, versioning when editorial content is
  managed, and central AI orchestration where AI is used.
- Circular dependencies, duplicate authentication, duplicate permissions,
  duplicate localization, duplicate audit, and direct database access outside
  repositories are not acceptable.
- Any roadmap item that requires deviating from Chapter 3 must include an
  approved Architecture Decision Record before implementation.

## Official Conceptual Domain Model

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_4.md`.
- `docs/domain/domain-model.md`.
- `docs/domain/domain-glossary.md`.
- `docs/domain/domain-relationships.md`.
- `docs/domain/domain-gap-analysis.md`.
- `docs/domain/domain-migration-plan.md`.

Roadmap impact:

- Chapter 4 defines the platform's conceptual data domains, entity ownership
  rules, relationships, lifecycle, versioning, audit, and migration baseline.
- Future roadmap phases that change persistence, APIs, or module boundaries
  must first respect the conceptual owner and relationship rules documented in
  Chapter 4.
- The domain baseline audit identifies current entities, overlaps, missing
  conceptual concepts, and safe migration order without changing the runtime
  database.
- No roadmap item may redesign database schema or remove existing Phase 7 Step
  16 validated behavior solely on the basis of Chapter 4.
- Logical data modeling is governed by Chapter 5 and must remain the mandatory
  input before any physical database redesign or migration strategy is
  implemented.

## Official Logical Data Model

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_5.md`.
- `docs/data/logical-data-model.md`.
- `docs/data/aggregate-map.md`.
- `docs/data/entity-relationships.md`.
- `docs/data/integrity-rules.md`.
- `docs/data/logical-gap-analysis.md`.
- `docs/data/logical-migration-plan.md`.

Roadmap impact:

- Chapter 5 defines implementation-ready logical aggregates, aggregate roots,
  relationships, cardinalities, integrity rules, deletion strategies,
  versioning strategies, concurrency rules, and ownership boundaries.
- Future roadmap phases that change persistence, API contracts, cross-module
  relationships, or entity ownership must first respect the logical aggregate
  map and integrity rules.
- Physical database work must follow Chapter 6 - Physical Data Model and
  Database Standards.
- Chapter 5 does not authorize database-specific schemas, migrations, indexes,
  runtime persistence changes, API changes, UI changes, Docker changes, or
  removal of Phase 7 Step 16 validated behavior.
- Chapter 6 must use Chapter 4 and Chapter 5 together: Chapter 4 defines
  conceptual meaning, and Chapter 5 defines logical implementation boundaries.

## Official Physical Data Model and Database Standards

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_6.md`.
- `docs/database/physical-data-model.md`.
- `docs/database/database-conventions.md`.
- `docs/database/index-strategy.md`.
- `docs/database/migration-strategy.md`.
- `docs/database/database-gap-analysis.md`.
- `docs/database/database-migration-plan.md`.

Roadmap impact:

- Chapter 6 establishes PostgreSQL as the primary relational database engine
  and defines mandatory standards for naming, keys, foreign keys, indexes,
  constraints, migrations, audit, versioning, deletion strategies, data
  security, reference data, and module compatibility.
- Future roadmap phases that introduce or modify database schema must use
  documented, versioned, tested migrations.
- Existing validated plural table names are legacy-compatible and must not be
  renamed without an approved compatibility migration.
- Runtime persistence for Phase 2-7 foundations must move toward PostgreSQL
  only through bounded, approved, additive migration phases.
- Destructive schema changes are not allowed unless explicitly approved by the
  project owner.
- Phase 7 Step 16 publishing, preflight, distribution, Library, Rights,
  Workflow, Export, Quality, Backup, and audit behavior must be preserved.
- Chapter 7 - Integrations and AI Agent Architecture is now documented as the
  next architecture authority for provider-agnostic AI integration.

## Official Integrations and AI Agent Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_7.md`.
- `docs/ai/ai-architecture.md`.
- `docs/ai/provider-registry.md`.
- `docs/ai/capability-catalog.md`.
- `docs/ai/prompt-management.md`.
- `docs/ai/ai-security.md`.
- `docs/ai/ai-observability.md`.
- `docs/ai/ai-gap-analysis.md`.
- `docs/ai/ai-migration-plan.md`.

Roadmap impact:

- All future AI calls must pass through the AI Orchestration Service.
- Functional modules must request provider-independent capabilities and must
  not call external AI providers directly.
- AI providers must be integrated through adapters with normalized request,
  response, error, cost, health, and privacy metadata.
- Prompt content must be centralized, versioned, auditable, and selected by
  orchestration instead of hardcoded in functional modules.
- AI requests must preserve tenant isolation, Need-to-Know access, sensitive
  data filtering, security policies, budget and quota limits, observability,
  audit, and Human Final Authority.
- The current baseline has governance, marketplace, gateway, and observability
  metadata foundations, but no complete AI Orchestration Service, Capability
  Router, provider adapter runtime, or central prompt registry.
- No external provider SDK integration is authorized until orchestration,
  prompt governance, security filtering, cost enforcement, observability, and
  audit boundaries are implemented.
- Phase 7 Step 16 publishing, preflight, distribution, Library, Rights,
  Workflow, Export, Quality, Backup, and audit behavior must be preserved.
- Chapter 8 - Workflow Engine and Editorial Process Architecture is now
  documented as the next architecture authority for process coordination.

## Official Workflow Engine and Editorial Process Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_8.md`.
- `docs/workflow/workflow-architecture.md`.
- `docs/workflow/workflow-definitions.md`.
- `docs/workflow/workflow-events.md`.
- `docs/workflow/workflow-permissions.md`.
- `docs/workflow/workflow-gap-analysis.md`.
- `docs/workflow/workflow-migration-plan.md`.

Roadmap impact:

- Workflow Engine is the official coordination layer for editorial and
  administrative processes.
- Workflow Engine coordinates stages, transitions, tasks, assignments,
  approvals, notifications, deadlines, escalations, automations, events, and
  history.
- Domain modules keep domain validation rules. Generic workflow behavior must
  be consolidated into Workflow Engine over time.
- Workflow definitions must be versioned, and workflow instances must remain
  bound to the workflow version with which they were created.
- Work Table is the user-facing execution surface for workflow tasks, not a
  separate workflow engine.
- Workflow Engine must use Scheduling and Agenda for deadlines, meetings,
  notifications, and recurrences instead of implementing a separate calendar.
- AI-triggered workflow actions must use AI Orchestration from Chapter 7.
- Every workflow action must be authorized through central RBAC and
  Need-to-Know access and must be audited and observable.
- The current baseline has Workflow v1 status transitions, export gates,
  QA/Semantic/Terminology blocking checks, audit, Scheduling metadata, and
  multiple module-local approval flows.
- Future migration must consolidate dispersed workflow logic incrementally and
  preserve validated Phase 7 Step 16 behavior.
- Chapter 9 - Security, Identity, and Governance Architecture is documented as
  the architecture authority for identity, access, security, compliance, and
  governance.

## Official Security, Identity, and Governance Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_9.md`.
- `docs/security/security-architecture.md`.
- `docs/security/iam-architecture.md`.
- `docs/security/rbac-model.md`.
- `docs/security/security-policies.md`.
- `docs/security/data-classification.md`.
- `docs/security/api-security.md`.
- `docs/security/audit-strategy.md`.
- `docs/security/compliance.md`.
- `docs/security/security-gap-analysis.md`.
- `docs/security/security-migration-plan.md`.

Roadmap impact:

- IAM is the only official identity source.
- No module may implement its own authentication or authorization system.
- All protected API requests must use server-derived authenticated context.
- Authorization must evaluate role permissions, workspace, resource ownership,
  resource state, organization policies, subscription entitlements,
  Need-to-Know scope, and data classification.
- Workspace is the primary data isolation boundary for future alignment.
- Permissions must evolve toward a complete atomic permission catalog.
- Security-sensitive behavior must be centralized through shared IAM, policy,
  audit, classification, API security, and secret management infrastructure.
- Audit must be complete, immutable in the target architecture, and included in
  backup/restore.
- AI interactions must preserve prompt, prompt version, provider, model, cost,
  result reference, human approval status, audit, and policy traceability.
- Current foundations include Auth, server-derived request context, sessions,
  account lockout, rate limiting, security headers, environment secret
  validation, Security Governance, Policy Engine, Workspace Need-to-Know,
  Gateway, Launch Essentials, Observability, audit, and backup coverage.
- Future migration must preserve validated Phase 7 Step 16 behavior.
- Chapter 10 - Integration and Interoperability Architecture is now
  documented as the next architecture authority for external systems, provider
  adapters, API contracts, events, webhooks, import/export, and provider
  independence.

## Official Integration and Interoperability Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_10.md`.
- `docs/integration/integration-architecture.md`.
- `docs/integration/api-contracts.md`.
- `docs/integration/adapter-registry.md`.
- `docs/integration/event-catalog.md`.
- `docs/integration/webhooks.md`.
- `docs/integration/integration-security.md`.
- `docs/integration/integration-gap-analysis.md`.
- `docs/integration/integration-migration-plan.md`.

Roadmap impact:

- Integration Gateway is the official external communication boundary.
- Business modules must not communicate directly with external systems.
- All external providers must use dedicated adapters.
- All stable public and partner APIs must be contract-first and versioned.
- Internal APIs must preserve module ownership boundaries.
- Events and webhook payloads must be documented and versioned.
- Webhooks must be authenticated, signed, retryable, logged, observable, and
  audited.
- Import and export operations must be authenticated, authorized, validated,
  audited, observable, tenant-aware, and compatible with JSON Master when
  applicable.
- Current foundations include Gateway, route registry metadata, API key
  metadata, integration provider metadata, webhook metadata, webhook delivery
  logs, AI provider metadata, security governance, observability, and backup
  coverage.
- Future migration must preserve validated Phase 7 Step 16 behavior.
- Chapter 11 - Frontend and Design System Architecture is now documented as
  the next architecture authority for frontend structure, Design System,
  i18n, accessibility, responsive behavior, PWA readiness, and frontend API
  clients.

## Official Frontend and Design System Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_11.md`.
- `docs/frontend/frontend-architecture.md`.
- `docs/frontend/design-system.md`.
- `docs/frontend/component-catalog.md`.
- `docs/frontend/layouts.md`.
- `docs/frontend/accessibility.md`.
- `docs/frontend/i18n.md`.
- `docs/frontend/frontend-gap-analysis.md`.
- `docs/frontend/frontend-migration-plan.md`.

Roadmap impact:

- Application Shell, routing, layouts, pages, feature components, shared
  components, and Design System are the official frontend layers.
- All visual components must belong to the Design System or derive from it.
- All user-visible text must use i18n resources.
- Initial UI languages are Romanian, English, Spanish, French, Portuguese,
  Italian, and German.
- Frontend must target WCAG 2.2 AA.
- Desktop, laptop, tablet, and mobile form factors are mandatory.
- PWA architecture must support installation, partial offline operation,
  intelligent caching, deferred synchronization, and push notifications when
  implemented.
- Backend communication must use reusable frontend API clients and
  server-derived session tokens.
- Current foundations include AppShell, Workspace-driven navigation, UI
  primitives, feature workspaces, centralized API clients, partial i18n,
  responsive CSS, accessibility basics, and frontend contract tests.
- Future migration must preserve validated Phase 7 Step 16 behavior.
- Chapter 12 - Backend and Application Services Architecture is now documented
  as the next architecture authority for backend structure, application
  services, domain separation, module contracts, API standards, transactions,
  eventing, background jobs, cache, backend security, and backend
  observability.

## Official Backend and Application Services Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_12.md`.
- `docs/backend/backend-architecture.md`.
- `docs/backend/application-services.md`.
- `docs/backend/domain-layer.md`.
- `docs/backend/module-contracts.md`.
- `docs/backend/api-standards.md`.
- `docs/backend/error-model.md`.
- `docs/backend/eventing-and-messaging.md`.
- `docs/backend/background-jobs.md`.
- `docs/backend/cache-strategy.md`.
- `docs/backend/transaction-strategy.md`.
- `docs/backend/backend-security.md`.
- `docs/backend/backend-observability.md`.
- `docs/backend/backend-gap-analysis.md`.
- `docs/backend/backend-dependency-map.md`.
- `docs/backend/backend-migration-plan.md`.

Roadmap impact:

- The backend remains a modular monolith and must not be split into
  microservices prematurely.
- Backend dependencies must move toward delivery, application, domain, ports,
  infrastructure, and external adapter boundaries.
- Controllers must remain thin and must not contain business logic.
- Business operations must become explicit use cases with command/query
  contracts where appropriate.
- Cross-module dependencies must move toward documented public contracts.
- Stable APIs must converge toward versioned `/api/v1` contracts.
- DTOs must become operation-specific and must not expose internal domain
  objects.
- Transactions, idempotency, Outbox, events, background jobs, cache, and
  observability require incremental implementation phases before runtime
  changes.
- Backend security must continue to use central IAM, server-derived context,
  RBAC, Need-to-Know scope, tenant/workspace isolation, audit, and safe error
  handling.
- Current foundations include NestJS modules, typed runtime database
  persistence, central request context, security middleware, rate limiting,
  audit event coverage, runtime backup/restore, observability metadata,
  gateway metadata, and module contract tests.
- Future migration must preserve validated Phase 7 Step 16 behavior.
- Chapter 13 - DevOps, Infrastructure, Deployment, and Recovery Architecture
  is now documented as the next architecture authority for CI/CD,
  infrastructure, deployment, environments, secrets, backup, disaster
  recovery, operational observability, release management, and rollback.

## Official DevOps, Infrastructure, Deployment, and Recovery Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_13.md`.
- `docs/devops/devops-architecture.md`.
- `docs/devops/ci-cd.md`.
- `docs/devops/deployment-strategy.md`.
- `docs/devops/environment-management.md`.
- `docs/devops/containerization.md`.
- `docs/devops/backup-and-recovery.md`.
- `docs/devops/disaster-recovery.md`.
- `docs/devops/observability.md`.
- `docs/devops/release-management.md`.
- `docs/devops/devops-gap-analysis.md`.
- `docs/devops/devops-migration-plan.md`.

Roadmap impact:

- The official delivery path is Git, Pull Request, CI validation, build,
  artifact publication, staging deployment, staging validation, human approval,
  production deployment, monitoring, backup, rollback, and recovery.
- `main` must contain stable versions only in controlled environments.
- Pull Requests must run automated validation before merge.
- Staging deployment remains the current operational target and production
  deployment must be added only after staging is validated.
- Deployment must remain reproducible, health-checked, rollback-capable, and
  free of environment-specific application code.
- Configuration differences between environments must come from external
  configuration and secrets.
- Backup and restore must be verifiable, monitored, and encryption-ready.
- Disaster recovery must define RPO, RTO, owners, restore steps, and
  validation steps before public production launch.
- Current foundations include GitHub Actions CI, staging deployment workflow,
  staging operations workflow, Docker Compose, API/Web Dockerfiles,
  Infrastructure Pack v1.0, backup/restore scripts, monitoring scripts,
  Nginx templates, systemd units, validation scripts, and operational
  runbooks.
- Future migration must preserve validated Phase 7 Step 16 behavior.
- Chapter 14 - Quality Architecture and Testing Strategy is documented as
  the official architecture authority for unit tests, domain tests, application
  tests, integration tests, API tests, contract tests, database tests,
  migration tests, security tests, accessibility tests, performance tests,
  AI validation tests, regression tests, smoke tests, Quality Gates, coverage,
  quality observability, and defect management.

## Official Quality Architecture and Testing Strategy

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_14.md`.
- `docs/quality/testing-strategy.md`.
- `docs/quality/test-pyramid.md`.
- `docs/quality/test-catalog.md`.
- `docs/quality/quality-gates.md`.
- `docs/quality/coverage-policy.md`.
- `docs/quality/security-testing.md`.
- `docs/quality/accessibility-testing.md`.
- `docs/quality/performance-testing.md`.
- `docs/quality/ai-testing.md`.
- `docs/quality/regression-policy.md`.
- `docs/quality/quality-gap-analysis.md`.
- `docs/quality/quality-migration-plan.md`.

Roadmap impact:

- Every critical domain rule, workflow gate, rights gate, AI approval gate,
  language rule, security boundary, and publishing rule must have appropriate
  automated validation.
- The current repository baseline includes 55 API test files, 30 Web test
  files, 10 DB test files, and 2 Shared package test files.
- CI already validates API contracts, DB/runtime/backup tests, shared tests,
  fixture JSON, infrastructure syntax, Docker Compose config, Nginx templates,
  secret scan, typecheck/lint/test/build when dependencies are available, and
  vulnerability scan.
- Future migration must add pure unit/domain tests, coverage reporting,
  deterministic AI evaluation fixtures, browser E2E smoke tests,
  accessibility automation, performance baselines, flaky test tracking, and
  release quality reports.
- Quality Gates must block release on failed builds, tests, migrations,
  security checks, critical accessibility checks, and critical smoke checks.
- Future migration must preserve validated Phase 7 Step 16 behavior.

## Official Operations, Maintenance, and Platform Evolution Architecture

Status: Active.

Reference:

- `docs/ARCHITECTURE_CHAPTER_15.md`.
- `docs/operations/operations-architecture.md`.
- `docs/operations/platform-governance.md`.
- `docs/operations/release-management.md`.
- `docs/operations/versioning-policy.md`.
- `docs/operations/deprecation-policy.md`.
- `docs/operations/incident-management.md`.
- `docs/operations/business-continuity.md`.
- `docs/operations/maintenance-strategy.md`.
- `docs/operations/risk-management.md`.
- `docs/operations/kpi-and-sla.md`.
- `docs/operations/operations-gap-analysis.md`.
- `docs/operations/platform-evolution-roadmap.md`.

Roadmap impact:

- Architecture Chapters 0-15 are now complete as the high-level platform
  architecture baseline.
- Future roadmap work must move into detailed module specifications and
  controlled module implementation.
- Every future module must comply with operations, maintenance, quality,
  security, workflow, AI, data, frontend, backend, integration, and DevOps
  standards before acceptance.
- Current operational strengths include GitHub Actions CI, staging deploy and
  operations workflows, Infrastructure Pack v1.0, backup/restore scripts,
  monitoring scripts, Nginx templates, systemd units, runbooks, DevOps
  baseline documentation, and Quality Gate documentation.
- Future migration must formalize release records, ADRs, incident registers,
  deprecation registers, RPO/RTO targets, KPI history, production deployment,
  artifact management, backup encryption enforcement, and centralized
  observability.
- Validated Phase 7 Step 16 behavior must be preserved.
- No additional general architecture chapter is planned. The next recommended
  stage is Phase 2 - Detailed Module Specifications.

## Phase II Module 1 - Library Module Architecture

Status: Active specification.

Reference:

- `docs/modules/library/library-overview.md`.
- `docs/modules/library/domain-model.md`.
- `docs/modules/library/metadata-model.md`.
- `docs/modules/library/asset-management.md`.
- `docs/modules/library/versioning.md`.
- `docs/modules/library/search-and-indexing.md`.
- `docs/modules/library/api-contracts.md`.
- `docs/modules/library/events.md`.
- `docs/modules/library/permissions.md`.
- `docs/modules/library/workflows.md`.
- `docs/modules/library/library-gap-analysis.md`.
- `docs/modules/library/library-migration-plan.md`.

Roadmap impact:

- Library is the first detailed module specification after completion of
  Architecture Chapters 0-15.
- Library is the canonical repository and Single Source of Truth for editorial
  resources.
- Existing Library implementation already includes reader items, publication
  records, editions, versions, files, view preferences, reading progress,
  bookmarks, highlights, notes, access events, audit, search, lifecycle,
  duplicate detection, preview protection, runtime persistence, and backup/
  restore support.
- Future Library migration must add canonical Library Item mapping,
  generalized Asset records, required metadata enforcement, typed
  relationships, universal item/asset/metadata versioning, dedicated indexing,
  canonical item/search/asset APIs, and operational hardening.
- Migration must be additive, preserve current clients, preserve Phase 7 Step
  16 behavior, and prevent duplicate editorial repositories.
- Module 2 - Translation Module Architecture is now documented as the next
  Phase II specification after Library.

## Phase II Module 2 - Translation Module Architecture

Status: Active specification.

Reference:

- `docs/modules/translation/translation-overview.md`.
- `docs/modules/translation/domain-model.md`.
- `docs/modules/translation/segmentation.md`.
- `docs/modules/translation/translation-memory.md`.
- `docs/modules/translation/glossary-management.md`.
- `docs/modules/translation/terminology.md`.
- `docs/modules/translation/quality-validation.md`.
- `docs/modules/translation/api-contracts.md`.
- `docs/modules/translation/events.md`.
- `docs/modules/translation/workflows.md`.
- `docs/modules/translation/translation-gap-analysis.md`.
- `docs/modules/translation/translation-migration-plan.md`.

Roadmap impact:

- Translation is the second detailed module specification after Library.
- Translation depends on Library as the Single Source of Truth and must not
  duplicate source editorial content.
- Existing implementation already includes segments, translations,
  Translation Memory, terminology governance, lexicographic evidence, QA,
  Semantic Fidelity, Workflow integration, frontend Translation Workspace,
  runtime persistence, backup/restore support, and contract tests.
- Future Translation migration must add canonical Library Item linkage,
  top-level Translation Project aggregate, immutable segment/translation
  version lineage, standardized context schema, explicit AI orchestration
  records, broader language-specific style validation, version comparison,
  performance/indexing hardening, and canonical versioned API routes.
- Migration must be additive, preserve current clients, preserve validated
  terminology priority, preserve Translation Memory proposal-only behavior,
  preserve QA/Semantic/Workflow gates, and preserve Phase 7 Step 16 behavior.
- Module 3 - Proofreading and Editorial Review Module Architecture is now
  documented as the next Phase II specification after Translation.

## Phase II Module 3 - Proofreading and Editorial Review Module Architecture

Status: Active specification.

Reference:

- `docs/modules/editorial-review/editorial-review-overview.md`.
- `docs/modules/editorial-review/domain-model.md`.
- `docs/modules/editorial-review/linguistic-validation.md`.
- `docs/modules/editorial-review/style-validation.md`.
- `docs/modules/editorial-review/terminology-validation.md`.
- `docs/modules/editorial-review/comments-and-review.md`.
- `docs/modules/editorial-review/api-contracts.md`.
- `docs/modules/editorial-review/events.md`.
- `docs/modules/editorial-review/workflows.md`.
- `docs/modules/editorial-review/editorial-review-gap-analysis.md`.
- `docs/modules/editorial-review/editorial-review-migration-plan.md`.

Roadmap impact:

- Proofreading and Editorial Review is the third detailed module
  specification after Library and Translation.
- Existing implementation already includes QA, Semantic Fidelity,
  Terminology Governance v2, Editorial Decisions, Collaboration comments,
  Workflow gates, Review Workspace UI, runtime persistence, backup/restore,
  and contract tests.
- Future Editorial Review migration must add a canonical `EditorialReview`
  aggregate, unified observations, persistent correction proposals,
  non-destructive accept/reject state, language-specific linguistic rule
  packs, project style profiles, doctrinal review configuration, version
  comparison, canonical versioned review APIs, and search/performance
  hardening.
- Migration must be additive, preserve current clients, preserve validated
  terminology priority, preserve Workflow gates, preserve Human Final
  Authority, and preserve Phase 7 Step 16 publishing, preflight, and
  distribution behavior.
- Module 4 - Publishing Module Architecture is now documented as the next
  Phase II specification after Proofreading and Editorial Review.

## Phase II Module 4 - Publishing Module Architecture

Status: Active specification.

Reference:

- `docs/modules/publishing/publishing-overview.md`.
- `docs/modules/publishing/domain-model.md`.
- `docs/modules/publishing/publication-build.md`.
- `docs/modules/publishing/publication-profiles.md`.
- `docs/modules/publishing/format-generators.md`.
- `docs/modules/publishing/distribution.md`.
- `docs/modules/publishing/api-contracts.md`.
- `docs/modules/publishing/events.md`.
- `docs/modules/publishing/workflows.md`.
- `docs/modules/publishing/publishing-gap-analysis.md`.
- `docs/modules/publishing/publishing-migration-plan.md`.

Roadmap impact:

- Publishing is the fourth detailed module specification after Library,
  Translation, and Proofreading/Editorial Review.
- Existing implementation already includes layout publishing records,
  publishing preflight, publishing state transitions, publication,
  withdrawal, republication, distribution records, JSON Master export,
  Library publication records, public portal catalog/release records,
  commerce editions, rights warnings, workflow gates, Distribution Center UI,
  runtime persistence, backup/restore, and contract tests.
- Future Publishing migration must add a canonical `Publication` facade,
  first-class reproducible `PublicationBuild` records, reusable/versioned
  publication profiles, generator contracts for each supported format,
  distribution adapter contracts, state mapping, performance planning,
  parallel format generation, incremental builds, asynchronous distribution,
  and canonical versioned API routes.
- Migration must be additive, preserve current clients, preserve Library
  metadata ownership, preserve Export artifact ownership, preserve Rights &
  Provenance authority, preserve Workflow gates, preserve immutable published
  editions, and preserve Phase 7 Step 16 publishing/preflight/distribution
  behavior.
- Module 5 - Rights and Provenance Module Architecture is now documented as
  the next Phase II specification after Publishing.

## Phase II Module 5 - Rights and Provenance Module Architecture

Status: Active specification.

Reference:

- `docs/modules/rights/rights-overview.md`.
- `docs/modules/rights/domain-model.md`.
- `docs/modules/rights/provenance-model.md`.
- `docs/modules/rights/license-management.md`.
- `docs/modules/rights/contract-management.md`.
- `docs/modules/rights/compliance-validation.md`.
- `docs/modules/rights/api-contracts.md`.
- `docs/modules/rights/events.md`.
- `docs/modules/rights/workflows.md`.
- `docs/modules/rights/rights-gap-analysis.md`.
- `docs/modules/rights/rights-migration-plan.md`.

Roadmap impact:

- Rights and Provenance is the fifth detailed module specification after
  Library, Translation, Proofreading/Editorial Review, and Publishing.
- Existing implementation already includes collaboration agreements,
  translation authorizations, publishing authorizations, provenance records,
  rights audit events, Rights Workspace UI, Publishing Workspace warnings,
  Distribution Center rights warnings, runtime persistence, backup/restore,
  and contract tests.
- Future Rights migration must add a canonical `RightsRecord`, first-class
  rights holder registry, generalized rights type model, versioned License
  records, structured Contract lifecycle, Library Item-scoped provenance,
  unified restriction model, reusable compliance validation endpoint,
  immutable legal-history timeline, rights workflow integration, expiration
  automation, search, and performance hardening.
- Migration must be additive, preserve current clients, preserve Library
  resource identity, preserve contract assets in Library, preserve Publishing
  preflight rights gates, preserve Human Final Authority, and preserve Phase 7
  Step 16 publishing/preflight/distribution behavior.
- Module 6 - Magazine Module Architecture is now documented as the next Phase
  II specification after Rights and Provenance.

## Phase II Module 6 - Magazine Module Architecture

Status: Active specification.

Reference:

- `docs/modules/magazine/magazine-overview.md`.
- `docs/modules/magazine/domain-model.md`.
- `docs/modules/magazine/issue-management.md`.
- `docs/modules/magazine/article-management.md`.
- `docs/modules/magazine/layout.md`.
- `docs/modules/magazine/publication.md`.
- `docs/modules/magazine/api-contracts.md`.
- `docs/modules/magazine/events.md`.
- `docs/modules/magazine/workflows.md`.
- `docs/modules/magazine/magazine-gap-analysis.md`.
- `docs/modules/magazine/magazine-migration-plan.md`.

Roadmap impact:

- Magazine is the sixth detailed module specification after Library,
  Translation, Proofreading/Editorial Review, Publishing, and Rights and
  Provenance.
- Existing implementation already includes project publication type
  `MAGAZINE`, magazine-only `FLIPBOOK` capability, Library magazine/article
  metadata, Author Studio magazine article type, Magazine Digital Experience
  frontend, Rights warnings, Layout Publishing magazine plans, Public Portal
  magazine/article catalog support, Distribution Center flipbook readiness,
  and contract tests.
- Future Magazine migration must add canonical Magazine, Volume, Issue,
  Section, and Article Assignment records, issue versioning, issue archive
  state, issue-specific layout placement, issue-to-Publishing handoff,
  canonical Magazine APIs, domain events, full-text search, indexing, and
  performance planning.
- Migration must be additive, preserve current Magazine Digital Experience,
  preserve Library article ownership, preserve Publishing release authority,
  preserve Rights and Provenance gates, preserve Translation and Editorial
  Review ownership, and preserve Phase 7 Step 16 publishing/preflight/
  distribution behavior.
- Module 7 - AI Orchestration and Editorial Agents Module Architecture is now
  documented as the next Phase II specification after Magazine.

## Phase II Module 7 - AI Orchestration and Editorial Agents Module Architecture

Status: Active specification.

Reference:

- `docs/modules/ai-orchestration/ai-orchestration-overview.md`.
- `docs/modules/ai-orchestration/domain-model.md`.
- `docs/modules/ai-orchestration/agent-registry.md`.
- `docs/modules/ai-orchestration/context-builder.md`.
- `docs/modules/ai-orchestration/prompt-builder.md`.
- `docs/modules/ai-orchestration/model-router.md`.
- `docs/modules/ai-orchestration/validation-engine.md`.
- `docs/modules/ai-orchestration/api-contracts.md`.
- `docs/modules/ai-orchestration/events.md`.
- `docs/modules/ai-orchestration/workflows.md`.
- `docs/modules/ai-orchestration/ai-gap-analysis.md`.
- `docs/modules/ai-orchestration/ai-migration-plan.md`.

Roadmap impact:

- AI Orchestration is the seventh detailed module specification after Library,
  Translation, Proofreading/Editorial Review, Publishing, Rights and
  Provenance, and Magazine.
- Existing implementation already includes AI Governance provider metadata,
  OpenAI primary and Anthropic fallback metadata, budgets, quotas, usage
  records, cost policies, agent governance profiles, Marketplace agent
  registry metadata, Observability agent execution records, Gateway integration
  metadata, deterministic AI workflow tests, and an `apps/ai` health endpoint.
- Future AI Orchestration migration must add canonical AI task lifecycle,
  context package construction, prompt registry, model router, provider
  adapter contracts, AI output validation, agent chain execution,
  orchestration events, full observability traces, and human review handoff.
- Migration must be additive, preserve current AI Governance, Marketplace,
  Observability, Gateway, Editorial Decision, Translation, Rights, Publishing,
  Magazine, Quality, and Phase 7 Step 16 publishing/preflight/distribution
  behavior, and prevent direct provider calls from functional modules.
- Module 8 - Audio and Narration Module Architecture is now documented as the
  next Phase II specification after AI Orchestration and Editorial Agents.

## Phase II Module 8 - Audio and Narration Module Architecture

Status: Active specification.

Reference:

- `docs/modules/audio/audio-overview.md`.
- `docs/modules/audio/domain-model.md`.
- `docs/modules/audio/narration-projects.md`.
- `docs/modules/audio/voice-profiles.md`.
- `docs/modules/audio/tts-pipeline.md`.
- `docs/modules/audio/synchronization.md`.
- `docs/modules/audio/api-contracts.md`.
- `docs/modules/audio/events.md`.
- `docs/modules/audio/workflows.md`.
- `docs/modules/audio/audio-gap-analysis.md`.
- `docs/modules/audio/audio-migration-plan.md`.

Roadmap impact:

- Audio and Narration is the eighth detailed module specification after
  Library, Translation, Proofreading/Editorial Review, Publishing, Rights and
  Provenance, Magazine, and AI Orchestration.
- Existing implementation already includes generic audio support in
  Multimedia Creation, voice-over and dubbing metadata in Media Localization,
  Audio Agent governance, audiobook rights flags, Public Portal audio chapter
  references, Editorial Pipeline preview audio and official audiobook gating,
  and runtime backup coverage for multimedia and media localization assets.
- Future Audio migration must add canonical Narration Project, Audio Chapter,
  Voice Profile, Narrator, Audio Asset, TTS Pipeline Run, Text-Audio
  Synchronization Map, Voice Consent Record, audio-specific APIs, events,
  rights gates, workflow gates, Publishing handoff, and async generation
  planning.
- Migration must be additive, preserve current Multimedia Creation, Media
  Localization, AI Governance, Rights, Publishing, Public Portal, Pipeline,
  and Phase 7 Step 16 publishing/preflight/distribution behavior, and route
  all provider-based TTS or voice operations through AI Orchestration.
- Module 9 - Video and Multimedia Module Architecture is now documented as the
  next Phase II specification after Audio and Narration.

## Phase II Module 9 - Video and Multimedia Module Architecture

Status: Active specification.

Reference:

- `docs/modules/video/video-overview.md`.
- `docs/modules/video/domain-model.md`.
- `docs/modules/video/video-projects.md`.
- `docs/modules/video/timeline.md`.
- `docs/modules/video/media-assets.md`.
- `docs/modules/video/rendering-pipeline.md`.
- `docs/modules/video/api-contracts.md`.
- `docs/modules/video/events.md`.
- `docs/modules/video/workflows.md`.
- `docs/modules/video/video-gap-analysis.md`.
- `docs/modules/video/video-migration-plan.md`.

Roadmap impact:

- Video and Multimedia is the ninth detailed module specification after
  Library, Translation, Proofreading/Editorial Review, Publishing, Rights and
  Provenance, Magazine, AI Orchestration, and Audio and Narration.
- Existing implementation already includes generic video support in
  Multimedia Creation, video localization, localized captions, multilingual
  audio tracks, Video Agent governance, video rights flags, Public Portal
  video references, Editorial Pipeline preview video and official video
  gating, and runtime backup coverage for multimedia and media localization
  assets.
- Future Video migration must add canonical Video Project, Scene, Timeline,
  Video Asset Reference, Caption Track, Video Synchronization Map, Render Job,
  Render Profile, video-specific APIs, events, rights gates, workflow gates,
  Publishing handoff, and distributed rendering planning.
- Migration must be additive, preserve current Multimedia Creation, Media
  Localization, Audio, AI Governance, Rights, Publishing, Public Portal,
  Pipeline, and Phase 7 Step 16 publishing/preflight/distribution behavior,
  and route all provider-based video, captioning, thumbnail, timing, or media
  operations through AI Orchestration.
- Module 10 - Workflow Engine and Business Process Automation Module
  Architecture is now documented after Video and Multimedia.

## Phase II Module 10 - Workflow Engine and Business Process Automation Module Architecture

Status: Active specification.

Reference:

- `docs/modules/workflow/workflow-overview.md`.
- `docs/modules/workflow/domain-model.md`.
- `docs/modules/workflow/state-machine.md`.
- `docs/modules/workflow/rule-engine.md`.
- `docs/modules/workflow/task-management.md`.
- `docs/modules/workflow/approval-engine.md`.
- `docs/modules/workflow/scheduler.md`.
- `docs/modules/workflow/api-contracts.md`.
- `docs/modules/workflow/events.md`.
- `docs/modules/workflow/workflow-gap-analysis.md`.
- `docs/modules/workflow/workflow-migration-plan.md`.

Roadmap impact:

- Workflow Engine and Business Process Automation is the tenth detailed module
  specification after Library, Translation, Proofreading/Editorial Review,
  Publishing, Rights and Provenance, Magazine, AI Orchestration, Audio and
  Narration, and Video and Multimedia.
- Existing implementation already includes Workflow v1 document and segment
  status gates, QA and Semantic Fidelity blockers, terminology blockers,
  approval and export gates, audit events, Scheduling primitives, and
  Editorial Pipeline frontend orchestration.
- Future Workflow migration must add runtime workflow definitions, immutable
  workflow versions, version-bound workflow instances, configurable state
  machines, IF/THEN rule evaluation, generated workflow tasks, centralized
  approval orchestration, scheduler/SLA/escalation integration, automation
  metadata, versioned events, observability metrics, and Notification module
  hooks.
- Migration must be additive, preserve current Workflow v1, Scheduling,
  Editorial Pipeline, Publishing, Preflight, Distribution, and Phase 7 Step 16
  behavior, and keep domain validation inside the owning modules.
- Workflow automation must remain subordinate to Human Final Authority and
  must not approve, publish, grant rights, bypass workflow, modify security,
  or call AI providers directly.
- Module 11 - Notification and Communication Module Architecture is now
  documented after Workflow Engine and Business Process Automation.

## Phase II Module 11 - Notification and Communication Module Architecture

Status: Active specification.

Reference:

- `docs/modules/notifications/notifications-overview.md`.
- `docs/modules/notifications/domain-model.md`.
- `docs/modules/notifications/template-engine.md`.
- `docs/modules/notifications/channel-router.md`.
- `docs/modules/notifications/delivery-queue.md`.
- `docs/modules/notifications/webhooks.md`.
- `docs/modules/notifications/api-contracts.md`.
- `docs/modules/notifications/events.md`.
- `docs/modules/notifications/workflows.md`.
- `docs/modules/notifications/notifications-gap-analysis.md`.
- `docs/modules/notifications/notifications-migration-plan.md`.

Roadmap impact:

- Notification and Communication is the eleventh detailed module
  specification after Library, Translation, Proofreading/Editorial Review,
  Publishing, Rights and Provenance, Magazine, AI Orchestration, Audio and
  Narration, Video and Multimedia, and Workflow Engine.
- Existing implementation already includes Gateway webhook registry and
  delivery logs, Scheduling reminders and overdue alert metadata, Workspace
  notification preference metadata, Auth password reset and email verification
  request records, and Observability logging primitives.
- Future Notification migration must add centralized notification records,
  versioned localized templates, typed preferences, channel routing,
  asynchronous delivery queue metadata, retry and dead letter handling,
  webhook dispatch orchestration, delivery status tracking, communication
  events, and communication audit.
- Migration must be additive, preserve current Gateway, Scheduling, Workspace,
  Auth, Workflow, Publishing, Distribution, and Phase 7 Step 16 behavior, and
  keep domain decisions inside the owning modules.
- No module may send direct outbound communication after adoption; modules
  must emit events or requests for Notification Engine.
- Module 12 - Identity, Access Management and Security Module Architecture is
  now documented after Notification and Communication.

## Phase II Module 12 - Identity, Access Management and Security Module Architecture

Status: Active specification.

Reference:

- `docs/modules/iam/iam-overview.md`.
- `docs/modules/iam/domain-model.md`.
- `docs/modules/iam/authentication.md`.
- `docs/modules/iam/authorization.md`.
- `docs/modules/iam/rbac.md`.
- `docs/modules/iam/mfa-sso.md`.
- `docs/modules/iam/session-management.md`.
- `docs/modules/iam/security-policies.md`.
- `docs/modules/iam/api-contracts.md`.
- `docs/modules/iam/events.md`.
- `docs/modules/iam/iam-gap-analysis.md`.
- `docs/modules/iam/iam-migration-plan.md`.

Roadmap impact:

- Identity, Access Management and Security is the twelfth detailed module
  specification after Library, Translation, Proofreading/Editorial Review,
  Publishing, Rights and Provenance, Magazine, AI Orchestration, Audio and
  Narration, Video and Multimedia, Workflow Engine, and Notification and
  Communication.
- Existing implementation already includes Auth, server-derived request
  context, MVP RBAC permissions, session expiration/refresh/revocation,
  account lockout, rate limiting, security headers, secret validation,
  Founder Protection, Security Governance, Policy Engine, Enterprise Admin,
  Workspace Need-to-Know access, Gateway API keys, MFA metadata, GDPR
  metadata, Secret Vault metadata, and security audit foundations.
- Future IAM migration must add a complete atomic permission catalog,
  centralized authorization decision service, runtime MFA enforcement, OIDC
  and SAML SSO provider runtime, distributed session strategy, policy
  enforcement alignment, service principal alignment, versioned IAM events,
  and IAM performance metrics.
- Migration must be additive, preserve current Auth, Request Context,
  Security Governance, Policy Engine, Enterprise Admin, Workspace, Gateway,
  Launch Essentials, Workflow, Notification, Publishing, Distribution, and
  Phase 7 Step 16 behavior, and prevent modules from creating independent
  authentication or authorization mechanisms.
- Module 13 - Observability, Monitoring and Audit Module Architecture is now
  documented after Identity, Access Management and Security.

## Phase II Module 13 - Observability, Monitoring and Audit Module Architecture

Status: Active specification.

Reference:

- `docs/modules/observability/observability-overview.md`.
- `docs/modules/observability/domain-model.md`.
- `docs/modules/observability/logging.md`.
- `docs/modules/observability/metrics.md`.
- `docs/modules/observability/tracing.md`.
- `docs/modules/observability/audit.md`.
- `docs/modules/observability/alerting.md`.
- `docs/modules/observability/dashboards.md`.
- `docs/modules/observability/api-contracts.md`.
- `docs/modules/observability/events.md`.
- `docs/modules/observability/observability-gap-analysis.md`.
- `docs/modules/observability/observability-migration-plan.md`.

Roadmap impact:

- Observability, Monitoring and Audit is the thirteenth detailed module
  specification after Library, Translation, Proofreading/Editorial Review,
  Publishing, Rights and Provenance, Magazine, AI Orchestration, Audio and
  Narration, Video and Multimedia, Workflow Engine, Notification and
  Communication, and IAM.
- Existing implementation already includes public health, authenticated
  observability health/metrics/logs/traces/agent-execution endpoints,
  runtime observability tables, observability backup coverage, infrastructure
  monitoring scripts, DevOps/backend/AI observability documentation, and broad
  module audit coverage.
- Future Observability migration must add universal correlation and trace
  propagation, centralized structured logging helpers, standardized metrics,
  distributed tracing, unified audit read model, configurable alert manager,
  dashboard definitions, telemetry retention alignment, and optional external
  provider adapters after approval.
- Migration must be additive, preserve current Health, Observability, IAM,
  Notification, Workflow, Gateway, Security Governance, Backup, Platform
  Engineering, Publishing, Distribution, infrastructure scripts, and Phase 7
  Step 16 behavior, and keep source module audit ownership intact.
## Phase II Module 14 - Backup, Disaster Recovery and Business Continuity Module Architecture

Status: Active specification.

Reference:

- `docs/modules/backup/backup-overview.md`.
- `docs/modules/backup/domain-model.md`.
- `docs/modules/backup/backup-strategies.md`.
- `docs/modules/backup/retention-policies.md`.
- `docs/modules/backup/replication.md`.
- `docs/modules/backup/restore.md`.
- `docs/modules/backup/disaster-recovery.md`.
- `docs/modules/backup/business-continuity.md`.
- `docs/modules/backup/api-contracts.md`.
- `docs/modules/backup/events.md`.
- `docs/modules/backup/backup-gap-analysis.md`.
- `docs/modules/backup/backup-migration-plan.md`.

Roadmap impact:

- Backup, Disaster Recovery and Business Continuity is the fourteenth
  detailed module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, and Observability.
- Existing implementation already includes Backup Governance metadata APIs,
  runtime backup governance tables, deterministic runtime database
  backup/restore, tenant-boundary backup validation, infrastructure backup and
  restore scripts, restore dry-run scripts, systemd backup timer assets, and
  backup/restore/disaster recovery runbooks.
- Future Backup migration must add canonical backup repository metadata,
  policy-driven scheduling, governed restore jobs, PostgreSQL backup and PITR,
  replication records, selective restore, continuity plan runtime metadata,
  RPO/RTO monitoring, and Observability/Notification integration.
- Migration must be additive, preserve current Backup Governance, runtime
  backup/restore, Infrastructure Pack, IAM, Observability, Notification,
  Workflow, Publishing, Distribution, and Phase 7 Step 16 behavior, and
  prevent functional modules from creating isolated backup mechanisms.
## Phase II Module 15 - Search, Indexing and Knowledge Graph Module Architecture

Status: Active specification.

Reference:

- `docs/modules/search/search-overview.md`.
- `docs/modules/search/domain-model.md`.
- `docs/modules/search/indexing.md`.
- `docs/modules/search/full-text-search.md`.
- `docs/modules/search/semantic-search.md`.
- `docs/modules/search/vector-search.md`.
- `docs/modules/search/knowledge-graph.md`.
- `docs/modules/search/entity-relationships.md`.
- `docs/modules/search/api-contracts.md`.
- `docs/modules/search/events.md`.
- `docs/modules/search/search-gap-analysis.md`.
- `docs/modules/search/search-migration-plan.md`.

Roadmap impact:

- Search, Indexing and Knowledge Graph is the fifteenth detailed module
  specification after Library, Translation, Proofreading/Editorial Review,
  Publishing, Rights and Provenance, Magazine, AI Orchestration, Audio and
  Narration, Video and Multimedia, Workflow Engine, Notification and
  Communication, IAM, Observability, and Backup.
- Existing implementation already includes distributed local search in
  Library, Research, Translation Memory, Terminology, Lexicographic
  Intelligence, Public Portal, and Marketplace, plus research entities and
  relationships that form the current graph-like baseline.
- Future Search migration must add canonical search documents, search index
  metadata, indexing jobs, event-driven incremental indexing, centralized
  full-text and faceted search, autocomplete, platform-wide Knowledge Graph,
  semantic search, vector search, reindexing, schema versioning, and search
  audit.
- Migration must be additive, preserve current Library, Research,
  Translation Memory, Terminology, Lexicographic Intelligence, Public Portal,
  Marketplace, IAM, Observability, Backup, Publishing, Distribution, and
  Phase 7 Step 16 behavior, and prevent modules from creating new isolated
  search engines.
## Phase II Module 16 - Integration, API Gateway and External Connectors Module Architecture

Status: Active specification.

Reference:

- `docs/modules/integration/integration-overview.md`.
- `docs/modules/integration/domain-model.md`.
- `docs/modules/integration/api-gateway.md`.
- `docs/modules/integration/connectors.md`.
- `docs/modules/integration/webhooks.md`.
- `docs/modules/integration/api-versioning.md`.
- `docs/modules/integration/rate-limiting.md`.
- `docs/modules/integration/security.md`.
- `docs/modules/integration/api-contracts.md`.
- `docs/modules/integration/events.md`.
- `docs/modules/integration/integration-gap-analysis.md`.
- `docs/modules/integration/integration-migration-plan.md`.

Roadmap impact:

- Integration, API Gateway and External Connectors is the sixteenth detailed
  module specification after Library, Translation, Proofreading/Editorial
  Review, Publishing, Rights and Provenance, Magazine, AI Orchestration,
  Audio and Narration, Video and Multimedia, Workflow Engine, Notification and
  Communication, IAM, Observability, Backup, and Search.
- Existing implementation already includes Gateway route registry metadata,
  API key metadata with scopes, expiration, hashing, revocation and audit,
  Integration provider metadata, Webhook metadata with retry policy and
  delivery logs, rate limiting middleware, integration security docs, runtime
  persistence, and backup/restore coverage.
- Future Integration migration must add API definition registry, stable
  versioned public API namespace, connector adapter interfaces, Secret Vault
  and OAuth maturity, signed webhook dispatch and inbound verification,
  configurable distributed rate-limit policies, event gateway runtime,
  integration observability, and provider adapter activation by category.
- Migration must be additive, preserve current Gateway, Integrations,
  Webhooks, IAM, Security Governance, Observability, Backup, Search,
  Notification, AI Orchestration, Publishing, Distribution, and Phase 7 Step
  16 behavior, and prevent business modules from directly calling external
  providers.
## Phase II Module 17 - Configuration, Feature Flags and Platform Administration Module Architecture

Status: Active specification.

Reference:

- `docs/modules/configuration/configuration-overview.md`.
- `docs/modules/configuration/domain-model.md`.
- `docs/modules/configuration/configuration-service.md`.
- `docs/modules/configuration/feature-flags.md`.
- `docs/modules/configuration/environment-management.md`.
- `docs/modules/configuration/branding.md`.
- `docs/modules/configuration/localization.md`.
- `docs/modules/configuration/platform-administration.md`.
- `docs/modules/configuration/api-contracts.md`.
- `docs/modules/configuration/events.md`.
- `docs/modules/configuration/configuration-gap-analysis.md`.
- `docs/modules/configuration/configuration-migration-plan.md`.

Roadmap impact:

- Configuration, Feature Flags and Platform Administration is the seventeenth
  detailed module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  and Integration.
- Existing implementation already includes staging environment examples,
  Docker Compose runtime environment wiring, protected-environment secret
  validation, in-memory rate limiting policy, security headers, Enterprise
  Administration metadata, Workspace preferences and platform language,
  Gateway/Integration/Webhook metadata, AI Governance, Policy Engine, Security
  Governance, Observability, Backup Governance, and frontend localization
  dictionaries.
- Future Configuration migration must add Configuration Service contracts,
  scoped typed configuration, immutable configuration versions, central
  Feature Flag runtime, environment registry, branding profiles, localization
  profiles, module administration profiles, configuration events, runtime
  distribution, rollback, and hardcoded policy reduction.
- Migration must be additive, preserve current Enterprise Administration,
  Workspace, Gateway, Security Governance, Policy Engine, AI Governance,
  Observability, Backup, Search, Integration, Publishing, Distribution, and
  Phase 7 Step 16 behavior, and prevent modules from creating independent
  configuration stores for shared platform concerns.
## Phase II Module 18 - Data Governance, Metadata and Master Data Management Module Architecture

Status: Active specification.

Reference:

- `docs/modules/data-governance/data-governance-overview.md`.
- `docs/modules/data-governance/domain-model.md`.
- `docs/modules/data-governance/canonical-data-model.md`.
- `docs/modules/data-governance/master-data-management.md`.
- `docs/modules/data-governance/metadata-registry.md`.
- `docs/modules/data-governance/data-catalog.md`.
- `docs/modules/data-governance/data-dictionary.md`.
- `docs/modules/data-governance/schema-registry.md`.
- `docs/modules/data-governance/data-contracts.md`.
- `docs/modules/data-governance/reference-data.md`.
- `docs/modules/data-governance/data-quality.md`.
- `docs/modules/data-governance/entity-resolution.md`.
- `docs/modules/data-governance/golden-record.md`.
- `docs/modules/data-governance/data-lineage.md`.
- `docs/modules/data-governance/data-classification.md`.
- `docs/modules/data-governance/data-retention.md`.
- `docs/modules/data-governance/api-contracts.md`.
- `docs/modules/data-governance/events.md`.
- `docs/modules/data-governance/data-governance-gap-analysis.md`.
- `docs/modules/data-governance/data-governance-migration-plan.md`.

Roadmap impact:

- Data Governance, Metadata and Master Data Management is the eighteenth
  detailed module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, and Configuration.
- Existing implementation already includes Chapter 4 conceptual domain model,
  Chapter 5 logical data model, Chapter 6 physical database standards, JSON
  Master v1.0, PostgreSQL migrations for the MVP foundation, runtime database
  table registry, deterministic backup/restore, and module-level domain/API/
  event documentation.
- Future Data Governance migration must add canonical identifiers, explicit
  legacy ID mappings, Schema Registry, Data Dictionary, Reference Data
  Registry, Metadata Registry, Data Catalog, Data Quality Engine, Provenance
  and Lineage capture, Entity Resolution, Golden Records, Classification,
  Retention, stewardship assignments, and continuous quality monitoring.
- Migration must be additive, preserve JSON Master v1.0, existing identifiers,
  module source-of-truth ownership, audit, versions, rights restrictions,
  publication history, backup/restore compatibility, and Phase 7 Step 16
  behavior, and prevent modules from maintaining incompatible independent
  definitions of shared entities.
## Phase II Module 19 - Accessibility, Localization and Inclusive Experience Module Architecture

Status: Active specification.

Reference:

- `docs/modules/accessibility/accessibility-overview.md`.
- `docs/modules/accessibility/domain-model.md`.
- `docs/modules/accessibility/ui-accessibility.md`.
- `docs/modules/accessibility/document-accessibility.md`.
- `docs/modules/accessibility/audio-video-accessibility.md`.
- `docs/modules/accessibility/localization.md`.
- `docs/modules/accessibility/internationalization.md`.
- `docs/modules/accessibility/accessibility-profiles.md`.
- `docs/modules/accessibility/api-contracts.md`.
- `docs/modules/accessibility/events.md`.
- `docs/modules/accessibility/accessibility-gap-analysis.md`.
- `docs/modules/accessibility/accessibility-migration-plan.md`.

Roadmap impact:

- Accessibility, Localization and Inclusive Experience is the nineteenth
  detailed module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, and Data Governance.
- Existing implementation already includes WCAG 2.2 AA frontend targets,
  accessibility and i18n documentation, skip links, semantic main content,
  localized navigation, shared UI primitives, focus styles, Platform Language
  preferences, seven initial UI languages, Media Localization metadata for
  subtitles and localized media, multimedia metadata, and manual release
  accessibility recommendations.
- Future Accessibility migration must add Accessibility Profiles, centralized
  localization resource registry, automated WCAG validation, document
  accessibility validation, EPUB/PDF accessibility reports, Caption Service,
  Transcript Service, Audio Description metadata, Alternative Text metadata,
  accessibility preflight integration, observability, and audit.
- Migration must be additive, preserve Platform Language behavior, Media
  Localization Studio, Multimedia, Publishing, Export, Library, Search,
  Configuration, Data Governance, IAM, Observability, Backup, and Phase 7 Step
  16 behavior, and prevent modules from creating isolated accessibility or
  localization systems.

## Phase II Module 20 - Analytics, Business Intelligence and Decision Support Module Architecture

Status: Active specification.

Reference:

- `docs/modules/analytics/analytics-overview.md`.
- `docs/modules/analytics/domain-model.md`.
- `docs/modules/analytics/kpi-management.md`.
- `docs/modules/analytics/report-engine.md`.
- `docs/modules/analytics/dashboard-engine.md`.
- `docs/modules/analytics/decision-support.md`.
- `docs/modules/analytics/data-warehouse.md`.
- `docs/modules/analytics/api-contracts.md`.
- `docs/modules/analytics/events.md`.
- `docs/modules/analytics/analytics-gap-analysis.md`.
- `docs/modules/analytics/analytics-migration-plan.md`.

Roadmap impact:

- Analytics, Business Intelligence and Decision Support is the twentieth
  detailed module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, Data Governance, and Accessibility.
- Existing implementation already includes Observability metrics and health
  endpoints, Workspace dashboard widgets, static Reports Center surfaces, QA
  and Semantic Fidelity reports, Workflow and Publishing status records, AI
  Governance usage and budget records, and module audit events.
- Future Analytics migration must add a centralized Analytics module runtime,
  versioned KPI catalog, Analytics dataset registry, report engine, dashboard
  engine, data warehouse connector, OLAP query definitions, forecast engine,
  decision-support records, analytics export audit, and analytics IAM rules.
- Migration must be additive, preserve canonical Data Governance ownership,
  IAM, Need-to-Know, Observability, Workspace dashboards, Reports Center,
  source module audit, Backup, Accessibility, and Phase 7 Step 16 behavior,
  and prevent modules from creating isolated reporting or BI systems.

## Phase II Module 21 - AI Governance, Model Management and Responsible AI Module Architecture

Status: Active specification.

Reference:

- `docs/modules/ai-governance/ai-governance-overview.md`.
- `docs/modules/ai-governance/domain-model.md`.
- `docs/modules/ai-governance/model-registry.md`.
- `docs/modules/ai-governance/prompt-registry.md`.
- `docs/modules/ai-governance/agent-registry.md`.
- `docs/modules/ai-governance/policy-engine.md`.
- `docs/modules/ai-governance/model-evaluation.md`.
- `docs/modules/ai-governance/cost-management.md`.
- `docs/modules/ai-governance/explainability.md`.
- `docs/modules/ai-governance/api-contracts.md`.
- `docs/modules/ai-governance/events.md`.
- `docs/modules/ai-governance/ai-governance-gap-analysis.md`.
- `docs/modules/ai-governance/ai-governance-migration-plan.md`.

Roadmap impact:

- AI Governance, Model Management and Responsible AI is the twenty-first
  detailed module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, Data Governance, Accessibility, and Analytics.
- Existing implementation already includes AI provider status metadata,
  OpenAI primary and Anthropic fallback metadata, AI usage records, cost
  summary, budgets, quotas, cost policies, override requests, agent governance
  profiles, AI cost audit events, AI Orchestration documentation, and
  provider registry documentation.
- Future AI Governance migration must add a runtime model registry, prompt
  registry, model lifecycle management, prompt approval workflow, AI policy
  engine expansion, model evaluation, benchmarking, Responsible AI risk
  records, explainability records, and AI governance event contracts.
- Migration must be additive, preserve existing `/ai-governance/*` APIs, AI
  Orchestration, Marketplace, Observability, Analytics, IAM, Policy Engine,
  Configuration, Integration Gateway, Backup, and Phase 7 Step 20 behavior,
  and prevent modules from invoking unmanaged AI models or maintaining
  independent production prompt repositories.
## Phase II Module 22 - DevSecOps, CI/CD, Release and Platform Operations Module Architecture

Status: Active specification.

Reference:

- `docs/modules/devsecops/devsecops-overview.md`.
- `docs/modules/devsecops/domain-model.md`.
- `docs/modules/devsecops/source-control.md`.
- `docs/modules/devsecops/ci-pipelines.md`.
- `docs/modules/devsecops/cd-pipelines.md`.
- `docs/modules/devsecops/release-management.md`.
- `docs/modules/devsecops/infrastructure-as-code.md`.
- `docs/modules/devsecops/secret-management.md`.
- `docs/modules/devsecops/platform-operations.md`.
- `docs/modules/devsecops/api-contracts.md`.
- `docs/modules/devsecops/events.md`.
- `docs/modules/devsecops/devsecops-gap-analysis.md`.
- `docs/modules/devsecops/devsecops-migration-plan.md`.

Roadmap impact:

- DevSecOps, CI/CD, Release and Platform Operations is the twenty-second
  detailed module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, Data Governance, Accessibility, Analytics, and
  AI Governance.
- Existing implementation already includes GitHub Actions CI, manual staging
  deployment, staging operations workflow, Docker Compose staging, API and Web
  Dockerfiles, Infrastructure Pack v1.0, backup/restore/dry-run scripts,
  rollback scripts, monitoring scripts, Nginx templates, systemd units,
  validation scripts, and operational runbooks.
- Future DevSecOps migration must add artifact registry publication,
  immutable artifact promotion, release registry, semantic version automation,
  production deployment workflow, central secret manager integration, artifact
  signing, supply-chain provenance, and optional Kubernetes/GitOps/Terraform
  infrastructure only when explicitly required.
- Migration must be additive, preserve current CI, staging deployment,
  staging operations, Infrastructure Pack, backup/restore, rollback,
  monitoring, Chapter 13 DevOps documentation, and Phase 7 Step 21 behavior,
  and prevent unmanaged manual production deployment or operational changes
  outside approved DevSecOps procedure.

## Phase II Module 23 - Quality Assurance, Testing and Validation Module Architecture

Status: Active specification.

Reference:

- `docs/modules/quality-assurance/qa-overview.md`.
- `docs/modules/quality-assurance/domain-model.md`.
- `docs/modules/quality-assurance/test-management.md`.
- `docs/modules/quality-assurance/test-automation.md`.
- `docs/modules/quality-assurance/quality-gates.md`.
- `docs/modules/quality-assurance/performance-testing.md`.
- `docs/modules/quality-assurance/security-testing.md`.
- `docs/modules/quality-assurance/accessibility-testing.md`.
- `docs/modules/quality-assurance/ai-validation.md`.
- `docs/modules/quality-assurance/api-contracts.md`.
- `docs/modules/quality-assurance/events.md`.
- `docs/modules/quality-assurance/qa-gap-analysis.md`.
- `docs/modules/quality-assurance/qa-migration-plan.md`.

Roadmap impact:

- Quality Assurance, Testing and Validation is the twenty-third detailed
  module specification after Library, Translation, Proofreading/Editorial
  Review, Publishing, Rights and Provenance, Magazine, AI Orchestration,
  Audio and Narration, Video and Multimedia, Workflow Engine, Notification
  and Communication, IAM, Observability, Backup, Search, Integration,
  Configuration, Data Governance, Accessibility, Analytics, AI Governance,
  and DevSecOps.
- Existing implementation already includes API contract and integration
  tests, Web contract tests, runtime database and backup tests, shared JSON
  Master tests, fixture validation, staging validation scripts, Infrastructure
  Pack validators, GitHub Actions CI, dependency-aware typecheck/lint/test/
  build/audit, and filesystem vulnerability scanning.
- Future Quality Assurance migration must add a centralized test plan
  registry, test case registry, test execution records, defect lifecycle,
  coverage snapshots, quality gate records, manual validation evidence,
  release validation records, QA event contracts, and formal runtime APIs.
- Migration must be additive, preserve current API/Web/DB/shared test suites,
  CI, staging validation, Infrastructure Pack, DevSecOps controls, existing
  editorial QA Engine behavior, Chapter 14 quality architecture, and Phase 7
  Step 22 behavior, and prevent release promotion without mandatory
  validation evidence.

## Phase II Module 24 - Enterprise Architecture, Portfolio and Strategic Governance Module Architecture

Status: Active specification.

Reference:

- `docs/modules/enterprise-architecture/architecture-overview.md`.
- `docs/modules/enterprise-architecture/domain-model.md`.
- `docs/modules/enterprise-architecture/capability-catalog.md`.
- `docs/modules/enterprise-architecture/architecture-decision-records.md`.
- `docs/modules/enterprise-architecture/technology-standards.md`.
- `docs/modules/enterprise-architecture/technology-lifecycle.md`.
- `docs/modules/enterprise-architecture/technical-debt-registry.md`.
- `docs/modules/enterprise-architecture/strategic-roadmap.md`.
- `docs/modules/enterprise-architecture/api-contracts.md`.
- `docs/modules/enterprise-architecture/events.md`.
- `docs/modules/enterprise-architecture/architecture-gap-analysis.md`.
- `docs/modules/enterprise-architecture/architecture-migration-plan.md`.

Roadmap impact:

- Enterprise Architecture, Portfolio and Strategic Governance is the
  twenty-fourth detailed module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, Data Governance, Accessibility, Analytics, AI
  Governance, DevSecOps, and Quality Assurance.
- Existing implementation already includes Manifest, development conventions,
  architecture Chapters 1-15, SPEC, ROADMAP, AGENTS, detailed domain/data/
  database/frontend/backend/security/operations/quality architecture
  documents, Phase II module specifications, release checklists, readiness
  reports, staging validation plans, and module migration plans.
- Future Enterprise Architecture migration must add a structured capability
  catalog, ADR repository, technology standards registry, technology
  lifecycle records, strategic roadmap records, portfolio records, technical
  debt registry, architecture review workflow, architecture governance API
  contracts, and architecture governance events.
- Migration must be additive, preserve all existing architecture documents,
  module specifications, DevSecOps controls, Quality Assurance gates, IAM,
  Data Governance, AI Governance, and Phase 7 Step 23 behavior, and prevent
  architectural change outside approved governance.
## Phase II Module 25 - Compliance, Legal Governance and Risk Management Module Architecture

Status: Active specification.

Reference:

- `docs/modules/compliance/compliance-overview.md`.
- `docs/modules/compliance/domain-model.md`.
- `docs/modules/compliance/policy-registry.md`.
- `docs/modules/compliance/risk-registry.md`.
- `docs/modules/compliance/control-framework.md`.
- `docs/modules/compliance/privacy-governance.md`.
- `docs/modules/compliance/legal-hold.md`.
- `docs/modules/compliance/audit-management.md`.
- `docs/modules/compliance/api-contracts.md`.
- `docs/modules/compliance/events.md`.
- `docs/modules/compliance/compliance-gap-analysis.md`.
- `docs/modules/compliance/compliance-migration-plan.md`.

Roadmap impact:

- Compliance, Legal Governance and Risk Management is the twenty-fifth
  detailed module specification after Library, Translation,
  Proofreading/Editorial Review, Publishing, Rights and Provenance, Magazine,
  AI Orchestration, Audio and Narration, Video and Multimedia, Workflow
  Engine, Notification and Communication, IAM, Observability, Backup, Search,
  Integration, Configuration, Data Governance, Accessibility, Analytics, AI
  Governance, DevSecOps, Quality Assurance, and Enterprise Architecture.
- Existing implementation already includes security compliance documentation,
  operations risk management, data retention, backup retention policies,
  rights compliance validation, IAM, Data Governance, AI Governance,
  DevSecOps, Quality Assurance, Enterprise Architecture, audit rules,
  production readiness reports, and staging validation reports.
- Future Compliance migration must add a centralized policy registry, risk
  registry, control framework, privacy governance records, legal hold records,
  compliance assessments, internal and external audit records, exception
  management, corrective action tracking, compliance API contracts, and
  compliance events.
- Migration must be additive, preserve Rights and Provenance, Data Governance,
  IAM, DevSecOps, Quality Assurance, AI Governance, Enterprise Architecture,
  Backup, audit history, and Phase 7 Step 24 behavior, and prevent isolated
  compliance implementations outside the centralized framework.
- Module 25 completes the fundamental Phase II architecture chain by adding
  compliance, legal governance, and risk management to editorial
  capabilities, infrastructure, AI, operations, governance, quality, and
  strategy.

## MVP Scope

The MVP includes:

- Auth.
- Documents.
- Segment Editor.
- Basic Translation Memory.
- Basic QA.
- Basic TCPS/TLCG.
- Export.

Do not add major features outside this scope during MVP implementation.

## Current Implementation Priorities

1. Translation Memory.
2. Terminology & Glossary System.
   - Terminology Governance v2 is approved as an MVP stabilization enhancement
     inside the existing Terminology & Glossary System.
3. QA Engine.
4. Semantic Fidelity Engine.
5. Workflow Engine.

## MVP Roadmap

Implementation proceeds in this order:

Foundation -> Auth -> DB -> Document Editor -> Segments -> QA -> TM ->
TCPS/TLCG -> AI -> Publishing.

## End-to-End MVP Workflow

The MVP is successful when this complete workflow is operational and tested:

Authentication -> Project -> Document -> Segments -> Translation -> Translation
Memory -> Terminology Validation -> QA Validation -> Semantic Fidelity
Validation -> Review Workflow -> Versioning -> Audit -> Export.

Success criteria:

- End-to-end workflow operational.
- No critical architecture changes.
- No new major features.
- Existing modules integrated and tested together.

Roadmap expansion may resume only after MVP validation.

### Phase Notes

- Foundation: monorepo, development standards, local services, configuration.
- Auth: users, sessions, RBAC, organization-scoped access.
- DB: schema for organizations, projects, documents, segments, JSON Master data,
  audit, versions, terminology, QA, and Translation Memory.
- Document Editor: document creation, viewing, editing, and version tracking.
- Segments: segment editor, translation state, workflow state, and QA hooks.
- QA: basic semantic, terminology, formatting, and consistency checks.
- TM: basic Translation Memory storage and reuse suggestions.
- Terminology Governance v2: terminology quality score, Romanian diacritics and
  orthographic validation, source validation, rejection/under-review decisions,
  audit coverage, QA blocking, and workflow export gates for rejected or
  unresolved High/Critical terminology issues.
- Translation Rules Versioning & Impact Analysis: translation rules are
  immutable and versioned, manuscripts and exports record rule versions used,
  rule changes require impact analysis across books, manuscripts, languages,
  chapters, segments, terminology entries, and exports, and changes affecting
  existing publications require authorized approval.
- Rule Source Authority: translation rules, terminology rules, editorial rules,
  semantic fidelity rules, and exceptions require immutable, auditable,
  non-AI source authority references before validation.
- Authority Confidence Levels: source authorities are ranked as
  `PRIMARY_AUTHORITY`, `SECONDARY_AUTHORITY`, `EDITORIAL_AUTHORITY`, or
  `TEMPORARY_AUTHORITY`; conflicts require human review, AI cannot be an
  authority confidence source, and impact analysis records affected confidence
  levels.
- TCPS/TLCG: minimal competency profile, training challenge, scoring, and
  progression support.
- AI: suggestion and explanation integrations that remain under human final
  authority.
- Publishing: export from JSON Master Format.

## Phase 2 Planning Foundation - Editorial Intelligence & Production Agents

Status: Planned post-MVP architecture foundation. Documentation and
architecture scaffolding only.

Priority: `POST-MVP` / after closed beta readiness.

### Scope

Phase 2 reserves specialized editorial, production, media, narration, platform
coordination, and orchestration agents. This roadmap entry does not authorize
implementation yet and must not change the current MVP or staging behavior.

Governance rules:

- Do not change Phase 1 runtime behavior from this phase entry.
- Do not change Auth, Projects, Documents, Segments, Translations, QA, Semantic
  Fidelity, Workflow, Export, staging Docker, API contracts, or database schema.
- AI may suggest and automate drafts, but authorized human roles keep final
  approval authority.
- Every Phase 2 agent action must be auditable.
- JSON Master Format may reserve future fields for dictionaries, layout,
  visual assets, audio tracks, video assets, production profiles, and agent
  executions.

### Milestones

#### P2.1 - AI Orchestrator Planning

- Define execution order coordination.
- Define dependency tracking.
- Define cost-control metadata.
- Define audit trail requirements.
- Define human approval gates.

#### P2.2 - Lexicographic Intelligence Agent Planning

- Dictionary sources.
- Bilingual dictionaries.
- Monolingual dictionaries.
- DEX, DOOM, and DLR.
- Spanish-Romanian and Romanian-Spanish dictionary by Alexandru Calciu and
  Zaira Samharadze.
- Specialized spiritist dictionaries.
- Dictionary entries, lexical senses, examples, sources, and citations.
- Glossary priority:
  `validated platform glossary > documented editorial decision > specialized dictionary > academic dictionary > AI suggestion`.

#### P2.3 - Layout & Editorial Production Agent Planning

- Book layout.
- Magazine layout.
- Print finishing.
- PDF/X, EPUB, MOBI, and flipbook planning.
- European formats by default.
- American formats optional.
- Bleed, crop marks, margins, widows and orphans, and typography checks.

#### P2.4 - AI Video & Visual Creation Agent Planning

- Image generation.
- Cover generation.
- Illustration generation.
- Image editing.
- Text-to-video.
- Image-to-video.
- Trailer generation.
- Subtitle and visual localization.

#### P2.5 - Audio Narration Agent Planning

- Audiobook by chapters.
- Text-to-speech.
- Voice profiles.
- MP3, WAV, and FLAC export.
- Multilingual narration.

#### P2.6 - Platform Engineering, Optimization & Coordination Agent Planning

- Software update and upgrade planning.
- Dependency monitoring.
- Docker optimization.
- Backup and restore coordination.
- Auto-healing planning.
- Performance optimization.
- AI cost coordination.
- System maintenance audit.

#### P2.7 - JSON Master Phase 2 Extension Planning

- Reserve `dictionaries`.
- Reserve `layout`.
- Reserve `visualAssets`.
- Reserve `audioTracks`.
- Reserve `videoAssets`.
- Reserve `productionProfiles`.
- Reserve `agentExecutions`.

### Implementation Status

No implementation is authorized at this stage. This roadmap entry exists to
prepare Phase 2 architecture while keeping MVP stabilization and closed beta
preparation controlled.

## Future Phase - Media Localization Studio

Status: Future/Post-Beta Phase. Not scheduled for implementation yet.

### Scope

This future phase will add basic editorial media localization capabilities. It
is not a full Adobe Premiere replacement and is not intended to provide
professional non-linear video editing, compositing, advanced transitions, or
color grading.

- Video and audio upload.
- Automatic transcript generation.
- Transcript correction.
- Transcript translation.
- Subtitle generation.
- Subtitle formats: SRT, VTT, and ASS.
- Multilingual subtitles.
- Multilingual voice-over.
- Simple AI dubbing.
- Audio export.
- Transcript export.
- Localized video export.
- Text, audio, and video synchronization.
- Links from media assets to the original manuscript, article, book, or project.
- Language-specific media versions.
- Media Localization QA.
- Workflow Integration.

Excluded capabilities:

- Advanced video editing.
- Color grading.
- Complex timeline editing.
- Visual effects.
- Advanced transitions.
- Professional compositing.

Architectural rules:

- Original language must be configurable and never hard-coded.
- Every transcript, subtitle, audio version, dubbing version, and localized
  video export must remain linked to the original media asset.
- Media assets must remain linked to the original manuscript, article, book, or
  project when applicable.
- Media translations must follow terminology, QA, Semantic Fidelity, and global
  translation rules.
- Human final authority remains required for release approval.

### Roadmap Position

This phase should start only after the core translation workflow is stable:

1. Core document translation is operational.
2. Terminology and semantic QA are functional.
3. Workflow, review, and audit are stable.
4. Export and publishing systems exist.
5. The platform can reliably manage projects, users, roles, and approvals.

### Implementation Status

No implementation is authorized at this stage. This roadmap entry is included so
the architecture reserves space for future multimedia localization without
disrupting the current MVP.

## Future Phase - Magazine Platform Vision

Status: Planned future publication platform. Not scheduled for implementation
yet.

### Architectural Rules

Original language must be configurable per publication.

Supported original languages include, but are not limited to:

- English.
- Romanian.
- Spanish.
- French.
- Italian.
- Portuguese.
- German.
- Any supported language.

Rules:

- Original language is never hard-coded.
- Every translation must remain linked to the original publication.
- Audio versions remain linked to the same original publication.
- Translation alignment must remain auditable through JSON Master references.

### M1 - Digital Magazine MVP

Status: `PLANNED`.

Priority: `POST-BETA`.

Features:

- Flipbook reader.
- Interactive table of contents.
- Fullscreen mode.
- Zoom controls.
- Full-text search.
- Responsive desktop, tablet, and mobile reading.
- Multi-language reading.
- Language switcher.
- Audio per article.
- PDF export.
- HTML export.
- Link to original article or manuscript.
- Accessibility baseline.

### M2 - Advanced Reading

Status: `PLANNED`.

Priority: `POST-BETA`.

Features:

- Bookmarks.
- Reading history.
- Favorites.
- Text highlighting.
- Personal notes.
- Offline PWA support.
- Reading progress tracking.

### M3 - Interactive Magazine

Status: `PLANNED`.

Priority: `FUTURE`.

Features:

- Text/audio synchronization.
- Embedded video.
- Image galleries.
- Podcasts.
- Interactive editorial content.
- Rich media articles.

### M4 - Enterprise Magazine

Status: `FUTURE`.

Priority: `LONG_TERM`.

Features:

- Original vs translation comparison.
- Edition comparison.
- Semantic analysis.
- AI recommendations.
- Advanced analytics.
- Mobile applications.
- Cross-publication knowledge linking.

### Implementation Status

No implementation is authorized at this stage. This roadmap entry is included so
the architecture reserves space for future magazine publishing, reading, audio,
and cross-publication workflows without disrupting the current MVP or closed
beta preparation.

## Phase 7 Step 8 - AI Agent Governance & Quality Agent

Status: Implemented as governance refinement.

Scope:

- No new enterprise modules.
- Reuses AI Governance, Marketplace Agent Registry, and Platform Engineering
  orchestration.
- No Docker or staging configuration changes.
- No breaking API changes.

Rules:

- Every agent defines mission, responsibilities, collaboration, limits, and
  authority.
- Agents may exchange information, request assistance, reuse results, notify
  other agents, and coordinate through the Coordinator Agent.
- No communication restrictions exist between agents.
- Each agent has final AI responsibility only within its own specialization.
- Human approval always overrides every AI decision.
- No AI agent may publish automatically, approve automatically, grant rights,
  bypass workflow, modify security, or change governance.

Quality Agent:

- Verifies editorial consistency, metadata, missing assets, exports,
  accessibility, links, publication readiness, and distribution readiness.
- Reports issues only.
- Does not translate, review, edit, illustrate, publish, approve, or correct
  the project.

Current governed agents:

1. Coordinator Agent.
2. Projects Agent.
3. Manuscripts Agent.
4. Documentation Agent.
5. Translation Agent.
6. Review Agent.
7. Layout Agent.
8. Publishing Agent.
9. Distribution Agent.
10. Library Agent.
11. Rights & Provenance Agent.
12. Illustration Agent.
13. Audio Agent.
14. Video Agent.
15. Magazine Agent.
16. Administration Agent.
17. Evolution Agent.
18. Quality Agent.

## Phase 7 Step 9 - Complete AI Agent Roles, Subagents & Parallel Review

Status: Implemented as governance and interface refinement.

Scope:

- No new enterprise modules.
- Reuses AI Governance, Marketplace, Workflow, Audit, and Editorial Pipeline
  infrastructure.
- No Docker or staging configuration changes.
- No breaking API changes.

Implemented refinements:

- All 18 principal agents expose complete governance metadata: ID, name,
  mission, responsibilities, collaboration rules, limits, authority, enabled
  state, version, and last update timestamp.
- All agents may collaborate freely through the Coordinator Agent.
- Agents cannot bypass workflow, remove audit history, modify rights/security
  outside authority, perform another specialized agent's responsibility, or
  publish automatically without validation.
- Review Agent responsibilities now cover detailed linguistic and editorial
  review: style, register, tense, paragraph structure, transitions,
  orthography, grammar, punctuation, agreement, word order, prepositions,
  anacolutha, pleonasms, cacophonies, plural forms, and repetitions.
- Review Agent proposals are non-imposed, remain pending until human action,
  and support individual accept/reject decisions.
- Quality Agent statuses are `READY`, `READY_WITH_WARNINGS`, and `BLOCKED`.

Specialized subagents:

1. Terminology & Lexicography Subagent under Translation Agent.
2. Semantic Fidelity Subagent under Translation Agent.
3. Editorial Decision Subagent under Review Agent.
4. Planning & Coordination Subagent under Coordinator Agent.
5. Media Localization Subagent under Audio Agent and Video Agent.
6. Platform Engineering Subagent under Evolution Agent.

Parallel translation and review interface:

- Default two-column view: original text and current translation.
- Proposed replacement variants are displayed next to the relevant translated
  sentence.
- Original text is immutable.
- Translation remains unchanged until a proposal is accepted.
- Differences are highlighted.
- Accepted/rejected proposals are auditable.
- Version history is preserved.
- Optional three-column and four-column comparison modes support additional
  languages, versions, or comparison texts.

## Phase 7 Step 10 - Functional Testing of AI Agents

Status: Implemented as deterministic functional test coverage.

Scope:

- No new enterprise modules.
- Reuses AI Governance, Workflow, Audit, Review, Translation, Publishing,
  Library, Rights, and Editorial Pipeline infrastructure.
- No Docker or staging configuration changes.
- No breaking API changes.

Implemented validation:

- Functional integration tests for realistic editorial workflows.
- Reusable editorial fixtures for translated book, original manuscript,
  children's book, magazine issue, audiobook, and video publication.
- Deterministic mocked AI responses for offline/local validation.
- Coverage matrix for all 18 principal agents and all 6 specialized subagents.
- Workflow execution reports with expected result, actual result, pass/fail,
  detected gaps, and unresolved risks.
- Failure and boundary tests for unauthorized publication, workflow bypass,
  rights failure, malformed manuscript, missing translation segment,
  terminology conflict, semantic omission, timeout/retry handling, human
  override, and audit integrity.

Report:

- `docs/PHASE_7_STEP_10_AI_AGENT_FUNCTIONAL_TEST_REPORT.md`.

## Phase 7 Step 11 - Integrated Linguistic Knowledge Base

Status: Implemented as an extension of existing Lexicographic Intelligence,
Terminology, Translation, Semantic Fidelity, AI Governance, Audit, and Quality
infrastructure.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Uses existing lexicographic runtime persistence and audit tables.

Implemented capabilities:

- Project-level linguistic resource metadata for monolingual dictionaries,
  bilingual dictionaries, orthographic/orthoepic/morphological dictionaries,
  official grammar and punctuation rules, idioms, phraseological expressions,
  specialized glossaries, terminology databases, editorial guides, corpora, and
  usage examples.
- Resource metadata: language, language pair, title, publisher/institution,
  edition, publication year, version, source URL/imported document reference,
  license status, copyright holder, redistribution permission, authority level,
  domain, effective date, last verification date, and enabled status.
- `INTEGRATED_CONTENT` and `EXTERNAL_CONTROLLED_ACCESS` modes with guardrails
  preventing full copyrighted dictionary ingestion without authorization.
- Configurable Romanian linguistic source profile for DOOM, DEX-type
  resources, official grammar, orthographic and punctuation rules, bilingual
  dictionaries, phraseological dictionaries, and specialized dictionaries.
- Search by headword, phrase, idiom, language, language pair, domain,
  grammatical category, source, edition, authority level, and exact,
  normalized, fuzzy, or morphological modes.
- Source authority levels:
  `OFFICIAL_NORMATIVE > ACADEMIC > VALIDATED_SPECIALIZED > EDITORIAL_GUIDE >
  DESCRIPTIVE > INFORMATIVE`.
- Conflict reporting for competing definitions or source authorities with
  required human review and no silent replacement.
- Optional source edition, license, authority, and verification metadata in
  Translation, Terminology, and Semantic Fidelity evidence.
- Quality Agent resource readiness reporting for missing, outdated, disabled,
  or unauthorized sources.

Validation coverage:

- Monolingual and bilingual dictionary modeling.
- Idioms and expressions.
- Language-pair lookup.
- Source priority.
- Conflicting definitions.
- Edition traceability.
- License restrictions.
- Forbidden full-content ingestion.
- Translation Agent lookup.
- Terminology & Lexicography Subagent behavior.
- Semantic Fidelity validation.
- Review Agent recommendations.
- Quality Agent outdated-source detection.

Report:

- `docs/PHASE_7_STEP_11_INTEGRATED_LINGUISTIC_KNOWLEDGE_BASE_REPORT.md`.

## Phase 7 Step 12 - Platform-Wide Need-to-Know Access Model

Status: Implemented as an additive Workspace/IAM refinement.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Uses existing workspace, IAM/RBAC, project/document permissions, audit,
  runtime DB, backup/restore, and AI governance.

Implemented capabilities:

- Collaborator invitation flow with person, role, project scope, assigned
  documents/chapters/sections/segments, permitted tools, optional expiry, and
  access preview.
- Role-based visibility for translators, reviewers, layout specialists,
  illustrators, audio/video collaborators, collaborators, and administrators.
- Server-side access evaluation where the most restrictive valid rule wins.
- Hidden panels and restricted metadata are not returned for unauthorized
  access decisions.
- Temporary access expiration and immediate revocation metadata.
- Audit events for invitation sent/accepted, access granted/revoked, temporary
  expiration, restricted attempts, document opening, confidential resource
  access, AI agent data access, and human override.
- Runtime persistence and backup/restore coverage for workspace collaborator
  invitations and need-to-know grants.
- AI agent data access records minimum task scope and prevents self-expansion.

Validation coverage:

- Existing Workspace module reused; no separate Need-to-Know module.
- Invitation and preview endpoints.
- Effective access dimensions.
- Role-specific panels.
- Hidden restricted resources.
- Temporary and revoked access.
- AI agent minimum necessary data access.
- Runtime DB and backup/restore inclusion.

Report:

- `docs/PHASE_7_STEP_12_PLATFORM_NEED_TO_KNOW_ACCESS_MODEL_REPORT.md`.

## Phase 7 Step 13 - Editorial Workspace Final

Status: Implemented as the primary frontend production workspace.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses Projects, Project Dossiers, Editorial Process, Translation, Review,
  Publishing, Distribution, AI Governance, Audit, Library, and Need-to-Know
  access.

Implemented capabilities:

- `/workspace` route and home route render the unified Editorial Workspace.
- Single manuscript-centered workspace for Book, Children's Book, Magazine,
  Poetry, Dictionary, Course, Audiobook, and Video projects.
- Fast production action hub with common actions reachable in 2-3 clicks.
- Project queue connected to the existing Editorial Production Pipeline.
- Translation/review preview with immutable original, highlighted proposed
  variants, two-column default mode, and optional three/four-column review
  modes.
- Collaboration surface for invitation, role assignment, chapter assignment,
  segment assignment, comments, mentions, suggestions, accept/reject,
  synchronized updates, audit, and version history.
- InDesign-inspired production function inventory without reproducing Adobe UI.
- Publication format catalog and automatic adaptation targets for layout,
  templates, styles, guides, image placement, page numbering, export settings,
  and previews.
- Panel behavior model: collapsible, dockable, resizable, restorable,
  favorites, universal search, configurable shortcuts, and recently used tools.
- Performance readiness markers for large books, large magazines, thousands of
  pages, high-resolution illustrations, and multiple collaborators.

Validation coverage:

- Primary `/workspace` route and home route.
- Supported publication types.
- Production tools.
- Publication formats.
- Automatic adaptation.
- Translation/review modes.
- Collaboration and panels.
- Human Final Authority.
- No backend `EditorialWorkspaceModule`.

Report:

- `docs/PHASE_7_STEP_13_EDITORIAL_WORKSPACE_FINAL_REPORT.md`.

## Phase 7 Step 14 - Administration Review and Simplification

Status: Implemented as a frontend simplification and launch-readiness polish
step.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses existing Administration, IAM/RBAC, Need-to-Know, AI governance, audit,
  backup, security, integration, and system metadata concepts.

Implemented capabilities:

- `/admin` and `/administration` now use the same Administration configuration
  center.
- Administration is positioned as a platform configuration area, not a daily
  production workspace.
- Configuration is limited to two visible navigation levels: section and
  settings.
- Eleven approved sections are surfaced: organization, users, roles and
  permissions, AI agents, linguistic resources, editorial templates,
  publishing and distribution, security, audit and backup, integrations, and
  system.
- Role guidance makes administrator access explicit and keeps editors in
  production workspaces.
- Critical configuration areas are marked as requiring confirmation.
- Audit, reversibility, and Need-to-Know governance are visible.

Validation coverage:

- Administration routes.
- Approved section list.
- Two-level navigation rule.
- Role access guidance.
- Audit and critical confirmation safeguards.
- Responsive administration layout classes.

Report:

- `docs/PHASE_7_STEP_14_ADMINISTRATION_SIMPLIFICATION_REPORT.md`.

## Phase 7 Step 14.1 - Roles, Permissions and Subscription Entitlements

Status: Implemented as an additive Workspace/Administration access-policy
refinement.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses Workspace, Administration, IAM/RBAC, Need-to-Know access, audit, and
  existing subscription/billing placeholders.

Implemented capabilities:

- Central effective access policy:
  `Role permissions × Subscription entitlements × Need-to-Know scope`.
- Additive Workspace endpoints:
  - `GET /workspace/subscription`.
  - `POST /workspace/access/resolve`.
- Official operational role model separated from subscription plans.
- Subscription plan model for `FREE`, `BASIC`, `PREMIUM`, `BUSINESS`, and
  disabled `ENTERPRISE_RESERVED`.
- Plan entitlement and quota metadata for projects, collaborators, storage, AI
  usage, translation volume, export formats, team administration, retention,
  publishing, distribution, API access, and priority processing.
- Safe plan-limit behavior: existing content is preserved and only restricted
  new actions are blocked.
- Downgrade behavior: preserve content/audit/versions and mark over-limit
  resources read-only where necessary.
- Administration UI separates Users and Roles from Subscription and Usage.
- Audit actions for role changes, subscription changes, feature blocks, quota
  exceeded events, upgrades, downgrades, temporary access, and human override.

Validation coverage:

- No new subscription or billing module.
- Endpoint coverage.
- Role/plan separation.
- Effective access formula.
- Feature and quota blocking.
- Downgrade without data loss.
- Administration separation between roles and subscription usage.

Report:

- `docs/PHASE_7_STEP_14_1_ROLES_SUBSCRIPTION_ENTITLEMENTS_REPORT.md`.

## Phase 7 Step 14.2 - Unified Language Management

Status: Implemented as an additive Workspace/Administration language-policy
refinement.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses Projects, Translation, Review, Workspace, AI Governance, Linguistic
  Knowledge Base, Administration, and Audit.

Implemented capabilities:

- Central shared language policy for the four official attributes:
  `platformLanguage`, `originalLanguage`, `authoringLanguage`, and
  `targetLanguage`.
- Additive Workspace endpoints:
  - `GET /workspace/language-management`.
  - `POST /workspace/language-management`.
- Central language metadata stored through Workspace preferences metadata
  instead of duplicated per-panel settings.
- Project language model with one Original Language, one Authoring Language,
  and multiple Target Languages.
- Original Language immutability guard unless an authorized user explicitly
  changes it.
- UI localization helpers for language labels, workflow names, and AI agent
  names through Platform Language.
- Parallel review language-column metadata for default two-column review and
  optional three/four-column comparisons.
- Linguistic resource loading plan by Source Language to Target Language for
  dictionaries, glossaries, terminology, phraseology, and linguistic resources.
- Administration Central Language Management panel with installed/enabled
  languages, default Platform Language, fallback, completeness, dictionaries,
  glossaries, resources, and audit actions.
- Audit actions for Platform Language, Original Language, Authoring Language,
  Target Language additions/removals, and language resource updates.

Validation coverage:

- Shared language-policy contract tests.
- Workspace language-management contract tests.
- Frontend language-management UI contract tests.
- Existing language-policy UI and backend contracts remain in place.

Report:

- `docs/PHASE_7_STEP_14_2_UNIFIED_LANGUAGE_MANAGEMENT_REPORT.md`.

## Phase 7 Step 14.3 - Advanced Linguistic Resources & Translation Memory

Status: Implemented as an additive extension of the existing Linguistic
Knowledge Base, Translation, Terminology & Lexicography, Semantic Fidelity,
Review, AI Governance, and Audit infrastructure.

Scope:

- No new enterprise modules.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses existing Translation Memory, Terminology, Lexicographic Intelligence,
  runtime database, backup/restore, and frontend Administration/Translation
  surfaces.

Implemented capabilities:

- Project-configurable source consultation priority with drag-and-drop-ready
  ordering metadata.
- Default source priority:
  official normative source, project glossary, specialized glossary,
  Translation Memory, bilingual dictionary, explanatory dictionary, and
  corpus/examples.
- Runtime persistence and backup coverage for project source priority
  configuration.
- Translation Memory entries enriched with source segment, translated segment,
  language pair, project/document/segment references, domain, context, author,
  reviewer, approval date, confidence, and version.
- Translation Memory proposal lookup supports exact, fuzzy, and context match.
- Translation Memory remains proposal-only and never replaces text
  automatically.
- Translation flow stores Translation Memory entries only when the submitted
  translation passes validation as a validated translation.
- Glossary hierarchy:
  Project Glossary > Platform Glossary > Personal Glossary suggestions.
- Personal glossary entries remain optional suggestions and do not become
  authoritative over project/platform terminology.
- Glossary conflict detection requiring human review.
- Linguistic proposal explanation with confidence score, consulted sources,
  glossary used, Translation Memory match, terminology status, semantic
  validation, and rationale.
- Audit coverage for glossary created/updated/conflict, Translation Memory
  entry added/reused, source priority changed, and confidence recalculated.
- Administration and Translation Workspace display source priority, glossary
  hierarchy, TM proposals, confidence, and proposal-only guidance.

Validation coverage:

- Glossary priority.
- Translation Memory exact, fuzzy, and context match.
- Source priority.
- Confidence score.
- Conflict detection.
- Proposal explanation.
- Audit event coverage.

Report:

- `docs/PHASE_7_STEP_14_3_ADVANCED_LINGUISTIC_RESOURCES_REPORT.md`.

## Phase 7 Step 14.4 - Organization, Teams and Platform Creator

Status: Implemented as an additive Administration and access-governance
refinement.

Scope:

- No new enterprise module.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses Administration, Users, Roles, Permissions, Need-to-Know, Audit, and
  Workspace access filtering.

Implemented capabilities:

- Organization Management with organization profile, organization type, teams,
  members, and invitations.
- Supported organization types:
  `PERSOANA_FIZICA`, `EDITURA`, `ASOCIATIE_ONG`, `COMPANIE`, and
  `INSTITUTIE`.
- Default organization type: `PERSOANA_FIZICA`.
- Runtime persistence and backup coverage for organization administration
  metadata and teams.
- Default teams:
  Echipa Traducere, Echipa Revizie, Echipa Machetare, Echipa Ilustrații,
  Echipa Multimedia, Echipa Publicare, Echipa Marketing, and Echipa
  Publicitate.
- Teams can carry projects, tasks, documents, and workflow responsibility
  metadata.
- Protected `PLATFORM_CREATOR` / `Creatorul platformei` system role.
- Platform Creator is separate from Administrator, cannot be assigned through
  normal Administration flows, cannot be removed/downgraded through membership
  removal, and is independent of subscription limits.
- Workspace and administrative permission gates recognize Platform Creator as
  an unrestricted system role.
- Administration UI displays organization model, teams, Creator protections,
  and relevant audit actions.

Validation coverage:

- Backend contract coverage for organization types, default teams, protected
  Platform Creator role, audit actions, runtime persistence, and backup tables.
- Frontend contract coverage for Organization Management, team labels,
  Creator protections, and audit actions.

Report:

- `docs/PHASE_7_STEP_14_4_ORGANIZATION_TEAMS_PLATFORM_CREATOR_REPORT.md`.

## Phase 7 Step 14.5 - AI Providers & Cost Management

Status: Implemented as an additive AI Governance and Administration
refinement.

Scope:

- No new enterprise module.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses AI Governance, AI Orchestrator, Administration, Subscription Plans,
  Audit, Organization Management, and Workspace.

Implemented capabilities:

- OpenAI is modeled as the primary v1.0 AI provider.
- Anthropic is modeled as the fallback v1.0 AI provider.
- Provider status records persist in the runtime database and backup/restore
  set.
- Automatic fallback activates when the primary provider times out, is
  unavailable, returns an API error, or is in configured outage.
- Fallback recovery is auditable when the active provider returns to OpenAI.
- Model selection defaults to automatic, with manual selection guarded by role
  and subscription entitlement.
- Subscription plan model includes `FREE`, `BASIC`, `PREMIUM`, `BUSINESS`, and
  disabled `ENTERPRISE_RESERVED`.
- AI cost summary tracks monthly budget, remaining budget, monthly
  consumption, consumption by AI agent, and consumption by project.
- Budget warnings are tracked at 80%, 90%, and 100%.
- Reaching a limit blocks only the restricted AI action and never deletes data.
- Platform Creator remains unrestricted for AI usage, testing, and monitoring.
- Administration displays configured providers, active provider, fallback
  status, budget, consumption, remaining budget, usage history, and audit
  actions.

Validation coverage:

- Provider fallback and recovery.
- Automatic/manual model selection metadata.
- Budget limits and warning thresholds.
- Subscription plan model.
- Platform Creator unlimited access.
- Audit event coverage.
- Runtime backup/restore coverage.

Report:

- `docs/PHASE_7_STEP_14_5_AI_PROVIDERS_COST_MANAGEMENT_REPORT.md`.

## Phase 7 Step 15 - Intelligent Editorial Library & UX Finalization

Status: Implemented as an additive extension of the existing Library.

Scope:

- No new enterprise module.
- No separate Archive module.
- No Docker or staging configuration changes.
- No breaking API changes.
- Reuses Projects, Manuscripts, Project Dossiers, Translation, Review, Layout,
  Publishing, Distribution, Rights & Provenance, Unified Language Management,
  Audit, Versioning, Backup, and Need-to-Know infrastructure.

Implemented capabilities:

- Unified Library publication records for editorial lifecycle management.
- Lifecycle statuses: `STOC_REAL`, `IN_LUCRU`, and `PUBLICAT`.
- Status transitions:
  - Stoc real to În lucru.
  - În lucru to Publicat.
  - Publicat to În lucru for new edition/revision.
- Historical versions are immutable and preserved during status changes.
- Publication type remains metadata/filter, not a separate Library module.
- Search supports exact, normalized, fuzzy, partial title, author,
  multilingual metadata, ISBN, series, and collection matching.
- Filters cover author, language, editorial domain, publication type,
  lifecycle status, publication year, original publication year, rights
  status, format, series, and collection.
- Grid/list view and persistent user view preference metadata.
- Publication records connect original edition, manuscript, project, workflow,
  translations, review, layout, publishing, files, formats, editions, versions,
  rights, provenance, publishing history, and distribution status.
- Visibility is independent from lifecycle status and supports `PUBLIC`,
  `PRIVATE`, and `INTERNAL_WORKING_PUBLICATION`.
- Library preview returns safe metadata only and does not expose restricted
  content.
- Bulk actions support status changes, collections, series, tags, metadata
  export/update, project assignment, public/private marking, rights validation,
  and reporting.
- Duplicate detection compares normalized title, author, ISBN, original title,
  and source file fingerprint, with no automatic merge.
- Runtime persistence and backup/restore cover publications, editions,
  versions, files, preferences, and audit references.
- Frontend Library workspace exposes primary search, filter chips, advanced
  filters, grid/list views, quick preview, contextual actions, bulk actions,
  and lifecycle overview while preserving the existing reader experience.

Validation coverage:

- Alphabetical organization, sorting, title/author/multilingual search, and
  filters.
- Grid/list switching and persistent preferences.
- Lifecycle status transitions and visibility independence.
- Publication record completeness.
- Manuscript/project relationships.
- Edition and version history.
- Rights metadata and format availability.
- Preview authorization and restricted metadata protection.
- Bulk actions.
- Duplicate detection and no automatic merge.
- Library Agent and Quality Agent behavior boundaries.
- Audit completeness.
- Backup and restore.

Report:

- `docs/PHASE_7_STEP_15_INTELLIGENT_EDITORIAL_LIBRARY_REPORT.md`.

## Phase 7 Step 16 - Publishing Workflow, Final Preflight and Distribution Tracking

Status: Implemented as an additive refinement of the existing Layout &
Publishing, Library, Export, Rights & Provenance, Workflow, Quality, Audit, and
Backup infrastructure.

Scope:

- No new enterprise module.
- No separate Preflight module.
- No separate Archive module.
- No social-media promotion implementation.
- No Docker or staging configuration changes.
- No breaking API changes.

Implemented capabilities:

- Publishing states: `IN_PREGATIRE`, `GATA_PENTRU_PUBLICARE`, `PUBLICAT`,
  `REPUBLICAT`, and `RETRAS_DIN_PUBLICARE`.
- Final preflight aggregation with statuses `PASS`, `WARNING`, `ERROR`,
  `NOT_APPLICABLE`, and `PENDING`.
- Preflight severities `INFORMATIONAL`, `WARNING`, and `CRITICAL`.
- Approved publication channels: `INTERNAL_LIBRARY`, `PUBLIC_PORTAL`,
  `DIGITAL_BOOKSTORE`, `EXTERNAL_EXPORT`, and `PRINT_ON_DEMAND`.
- Official edition/version selection from Library records.
- Immutable published edition snapshots.
- Critical preflight errors block publication.
- Distribution history records delivery state and channel events without
  duplicating Library metadata, export files, or rights records.
- Withdrawal and republication preserve audit, versions, generated artifacts,
  and distribution history.
- Runtime database and deterministic backup/restore support for publishing
  preflight results, publishing records, and publishing distribution records.
- Distribution Center UI displays publishing state, readiness percentage,
  official preflight status, source component, severity, remediation link, and
  approved publication channels.

Validation coverage:

- Publishing state transitions.
- Readiness/preflight aggregation.
- Rights/provenance blocking.
- Immutable official edition records.
- Distribution history.
- Audit event coverage.
- Backup/restore compatibility.
- No duplicate Preflight or Distribution module.
- No social-media promotion workflow.

Report:

- `docs/PHASE_7_STEP_16_PUBLISHING_PREFLIGHT_DISTRIBUTION_REPORT.md`.

## Documentation-Only Governance Requirements

The following requirements are approved for specification and JSON Master Format
documentation, but are not authorized for implementation until explicitly
scheduled:

- Translation Rules Versioning.
- Translation Rule Impact Analysis.
- Rule change approval for existing publications.
- Identification of publications translated under older rule versions.
- Rule Source Authority for rules and exceptions.
- Authority Confidence Levels for conflicting source authorities.
- Magazine Platform Vision original-language flexibility and future publication
  alignment requirements.
- Media Localization Studio as a Future/Post-Beta basic editorial media
  localization module, explicitly excluding advanced video editing and
  professional compositing.
- Phase 2 Planning Foundation for Lexicographic Intelligence, Layout &
  Editorial Production, AI Video & Visual Creation, Audio Narration, Platform
  Engineering Coordination, AI Orchestration, and JSON Master future fields.
