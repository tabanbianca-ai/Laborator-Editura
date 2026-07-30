# Project Specification

## Vision Manifesto

The strategic vision for the platform is defined in `docs/MANIFEST.md`.

Document order:

1. `docs/MANIFEST.md` - strategic vision and purpose.
2. `docs/DEVELOPMENT_CONVENTIONS.md` - mandatory development conventions.
3. `SPEC.md`, Chapter 0 - fundamental platform principles.
4. `docs/ARCHITECTURE_CHAPTER_1.md` - general platform architecture.
5. `docs/ARCHITECTURE_CHAPTER_2.md` - application architecture.
6. `docs/ARCHITECTURE_CHAPTER_3.md` - module architecture.
7. `docs/ARCHITECTURE_CHAPTER_4.md` - conceptual domain model.
8. `docs/ARCHITECTURE_CHAPTER_5.md` - logical data model.
9. `docs/ARCHITECTURE_CHAPTER_6.md` - physical data model and database
   standards.
10. `docs/ARCHITECTURE_CHAPTER_7.md` - integrations and AI agent
    architecture.
11. `docs/ARCHITECTURE_CHAPTER_8.md` - Workflow Engine and editorial process
    architecture.
12. `docs/ARCHITECTURE_CHAPTER_9.md` - security, identity, and governance
    architecture.
13. `docs/ARCHITECTURE_CHAPTER_10.md` - integration and interoperability
    architecture.
14. `docs/ARCHITECTURE_CHAPTER_11.md` - frontend and design system
    architecture.
15. `docs/ARCHITECTURE_CHAPTER_12.md` - backend and application services
    architecture.
16. `docs/ARCHITECTURE_CHAPTER_13.md` - DevOps, infrastructure, deployment,
    and recovery architecture.
17. `docs/ARCHITECTURE_CHAPTER_14.md` - quality architecture and testing
    strategy.
18. `docs/ARCHITECTURE_CHAPTER_15.md` - operations, maintenance, and platform
    evolution architecture.
19. `docs/modules/library/library-overview.md` - Phase II Module 1, Library
    module implementation specification.
20. `docs/modules/translation/translation-overview.md` - Phase II Module 2,
    Translation module implementation specification.
21. Detailed module specifications and implementation plans.

All product, architecture, implementation, and roadmap decisions must remain
compatible with the Manifesto. When multiple implementation approaches are
valid, the selected approach must preserve the platform's coherence,
modularity, extensibility, traceability, security, native internationalization,
accessibility, and permanent human editorial control.

## Chapter 0 - Fundamental Platform Principles

### 0.1 Purpose

This chapter defines the fundamental principles that govern the design,
development, extension, and maintenance of the Laborator Editura platform.

These principles are mandatory for all software components, modules, services,
AI agents, and future development.

When multiple technical solutions are possible, the selected solution must be
the one that best respects the principles defined in this chapter.

### 0.2 Modularity

The platform must be composed of independent modules.

Each module must be developable, testable, updateable, and maintainable without
affecting the operation of the other modules.

Modules must communicate only through well-defined interfaces and services.

### 0.3 Scalability

The platform must be designed to support continuous growth in:

- Number of users.
- Volume of documents.
- Volume of translations.
- Number of modules.
- Number of AI agents.
- Number of languages.
- Number of editorial projects.

Scaling must not require major architectural changes.

### 0.4 Extensibility

Any new component must be addable without rewriting the existing application.

The platform must support straightforward integration of:

- New modules.
- New AI agents.
- New document types.
- New languages.
- External services.

### 0.5 Interoperability

All modules must communicate through well-defined APIs and contracts.

Direct dependencies between modules that prevent independent evolution are not
allowed.

### 0.6 Single Source of Truth

Each piece of information must have one official source.

Uncontrolled data duplication is not allowed.

All modules must use the same official source for shared information.

### 0.7 Separation of Responsibilities

Application logic, user interface, data access, and AI services must be clearly
separated.

Each component must have a well-defined responsibility.

### 0.8 Security by Design

Security is part of the platform architecture from the design phase.

Every new capability must respect requirements for:

- Authentication.
- Authorization.
- Data protection.
- Encryption.
- Audit.
- Logging.
- Disaster recovery.

### 0.9 Native Internationalization

The platform must be designed for international use from the beginning.

All components must support:

- Localization.
- Language switching.
- Regional formats.
- Translations.

Hardcoded user-facing text is not allowed.

### 0.10 Accessibility

The platform must be accessible to all users.

International accessibility standards, including WCAG, must be respected so
that the application and produced content can be used by people with different
accessibility needs.

### 0.11 AI-Assisted Automation

AI agents are specialized components that assist users in editorial work.

AI agents do not replace users and must not exceed the limits of the roles and
permissions defined in the platform.

All actions performed by AI agents must be auditable and traceable.

### 0.12 Complete Traceability

Every change made in the platform must be identifiable.

The platform must record:

- The author of the change.
- The date and time.
- The object changed.
- The version.
- The complete change history.

No information should be lost without the possibility of recovery.

### 0.13 Component Reuse

Developed components must be designed for reuse.

Duplicate implementations must not be created when a reusable solution already
exists.

### 0.14 Performance and Efficiency

The platform must provide low response times and efficient resource usage.

Performance optimization must not compromise architectural clarity or code
maintainability.

### 0.15 Incremental Development

The platform must be developed progressively through well-defined phases.

Each phase must produce functional components that are fully integrated into
the existing architecture.

Temporary implementations that require full rewriting in later phases are not
allowed.

### 0.16 Quality

All implementations must follow high quality standards.

Code must be:

- Clear.
- Modular.
- Documented.
- Testable.
- Easy to maintain.
- Easy to extend.

### 0.17 Architectural Decision Principle

When multiple valid implementation options exist, the selected solution must:

- Respect this specification.
- Preserve the modular architecture.
- Maximize component reuse.
- Minimize complexity.
- Support future development.
- Provide the best possible experience for users and developers.

### 0.18 Architectural Stability Principle

The platform architecture is the foundation of the entire project and must not
be changed to accommodate isolated shortcuts or quick implementations.

Every new capability must adapt to the existing architecture. If a capability
requires architectural changes, those changes must be analyzed, documented, and
approved before implementation.

This principle ensures coherent platform evolution and prevents ad hoc
solutions that could harm long-term maintainability and scalability.

## Chapter 1 - General Platform Architecture

The official general platform architecture is documented in
`docs/ARCHITECTURE_CHAPTER_1.md`.

Chapter 1 defines the unified platform model, public website, application,
central API, logical layers, shared components, general workflow, module
communication rules, AI agent constraints, security model, localization model,
data storage principles, observability requirements, and extensibility rules.

Before implementing any module, service, or AI agent, Codex must verify
conformity with:

1. `docs/MANIFEST.md`.
2. `docs/DEVELOPMENT_CONVENTIONS.md`.
3. `SPEC.md`, Chapter 0 - Fundamental Platform Principles.
4. `docs/ARCHITECTURE_CHAPTER_1.md`.

Any deviation from the general platform architecture requires explicit project
owner approval before implementation.

## Chapter 2 - Application Architecture

The official application architecture is documented in
`docs/ARCHITECTURE_CHAPTER_2.md`.

Chapter 2 defines the technical architecture for code organization, frontend,
backend, API access, module structure, application state, localization,
authentication, authorization, configuration, file management, AI integration,
observability, audit, background processing, testing, deployment, performance,
security, and implementation conventions.

Before implementing any new capability, Codex must verify that the change:

1. Respects the application architecture.
2. Reuses existing components and services.
3. Does not introduce circular dependencies.
4. Does not duplicate existing functionality.
5. Remains testable, extensible, and documented.

Any deviation from the application architecture requires explicit project owner
approval before implementation.

## Chapter 3 - Module Architecture

The official module architecture is documented in
`docs/ARCHITECTURE_CHAPTER_3.md`.

Chapter 3 defines the mandatory structure and standards for platform modules,
including controllers, services, domain rules, repositories, DTOs, validators,
events, permissions, localization, tests, documentation, audit, versioning, AI
integration, prohibitions, and module acceptance criteria.

Before implementing a new module, Codex must:

1. Check whether a reusable service already exists.
2. Follow the standard module structure.
3. Integrate with existing authentication, authorization, localization, audit,
   and observability.
4. Document public APIs and events.
5. Deliver appropriate tests.

Any deviation from the module architecture requires an approved Architecture
Decision Record before implementation.

## Chapter 4 - Conceptual Domain Model

The official conceptual domain model is documented in
`docs/ARCHITECTURE_CHAPTER_4.md`.

Chapter 4 defines the platform's conceptual data domains, main entities,
ownership rules, relationships, identifiers, lifecycle rules, versioning,
audit, files and digital assets, AI relationships, and domain dictionary.

The supporting baseline audit documents are:

1. `docs/domain/domain-model.md`.
2. `docs/domain/domain-glossary.md`.
3. `docs/domain/domain-relationships.md`.
4. `docs/domain/domain-gap-analysis.md`.
5. `docs/domain/domain-migration-plan.md`.

Chapter 4 precedes logical data modeling and physical database design. It does
not authorize database redesign, API changes, runtime persistence changes, or
removal of existing Phase 7 Step 16 validated functionality.

Before proposing schema changes, migrations, or new persistence structures,
Codex must verify the conceptual owner of each entity and follow the migration
sequence documented in `docs/domain/domain-migration-plan.md`.

## Chapter 5 - Logical Data Model

The official logical data model is documented in
`docs/ARCHITECTURE_CHAPTER_5.md`.

Chapter 5 transforms the conceptual domain model into technology-independent
logical aggregates, aggregate roots, logical entities, relationships,
cardinalities, integrity rules, data ownership rules, versioning strategies,
deletion strategies, and concurrency rules.

The supporting logical baseline documents are:

1. `docs/data/logical-data-model.md`.
2. `docs/data/aggregate-map.md`.
3. `docs/data/entity-relationships.md`.
4. `docs/data/integrity-rules.md`.
5. `docs/data/logical-gap-analysis.md`.
6. `docs/data/logical-migration-plan.md`.

Chapter 5 is authoritative for future physical database design, but it does
not authorize database-specific schemas, migrations, indexes, runtime
persistence changes, API changes, UI changes, Docker changes, or removal of
existing Phase 7 Step 16 validated functionality.

Before generating database-specific schema work, Codex must use Chapters 4 and
5 together and proceed through Chapter 6 - Physical Data Model and Database
Standards.

## Chapter 6 - Physical Data Model and Database Standards

The official physical database implementation standard is documented in
`docs/ARCHITECTURE_CHAPTER_6.md`.

Chapter 6 defines PostgreSQL as the primary relational database engine and
establishes mandatory physical database standards for naming, primary keys,
foreign keys, indexes, constraints, migrations, audit, versioning, deletion
strategies, performance, data security, reference data, and module
compatibility.

The supporting physical database baseline documents are:

1. `docs/database/physical-data-model.md`.
2. `docs/database/database-conventions.md`.
3. `docs/database/index-strategy.md`.
4. `docs/database/migration-strategy.md`.
5. `docs/database/database-gap-analysis.md`.
6. `docs/database/database-migration-plan.md`.

Chapter 6 is authoritative for future PostgreSQL schema work, but it does not
authorize immediate schema changes, table renames, destructive migrations, API
changes, UI changes, Docker changes, or removal of Phase 7 Step 16 validated
functionality.

All future database evolution must occur through documented, versioned,
tested migrations and must preserve tenant isolation, audit, backup/restore,
and validated publication workflow behavior.

## Chapter 7 - Integrations and AI Agent Architecture

The official integrations and AI agent architecture is documented in
`docs/ARCHITECTURE_CHAPTER_7.md`.

Chapter 7 defines the mandatory provider-agnostic AI architecture, AI
Orchestration Service, Capability Router, provider adapter model, prompt
management, context management, human-in-the-loop rules, audit, versioning,
security, privacy, observability, cost management, resilience, and module
integration rules.

The supporting AI architecture baseline documents are:

1. `docs/ai/ai-architecture.md`.
2. `docs/ai/provider-registry.md`.
3. `docs/ai/capability-catalog.md`.
4. `docs/ai/prompt-management.md`.
5. `docs/ai/ai-security.md`.
6. `docs/ai/ai-observability.md`.
7. `docs/ai/ai-gap-analysis.md`.
8. `docs/ai/ai-migration-plan.md`.

Chapter 7 is authoritative for future AI provider integrations, AI agent
runtime execution, provider routing, prompt governance, and AI observability.
It does not authorize immediate provider SDK integration, API changes,
database changes, UI changes, Docker changes, or removal of Phase 7 Step 16
validated functionality.

All future AI-enabled modules must call the AI Orchestration Service instead
of calling external providers directly. AI providers must be interchangeable
through provider adapters, and AI output remains subject to audit, versioning,
security policy, cost limits, and Human Final Authority.

## Chapter 8 - Workflow Engine and Editorial Process Architecture

The official Workflow Engine and editorial process architecture is documented
in `docs/ARCHITECTURE_CHAPTER_8.md`.

Chapter 8 defines the mandatory Workflow Engine architecture for process
coordination, workflow definitions, workflow versions, workflow instances,
stages, transitions, conditions, tasks, assignments, approvals, notifications,
deadlines, events, automation, escalations, parallelism, Work Table, Calendar
and Agenda integration, audit, versioning, permissions, and observability.

The supporting workflow baseline documents are:

1. `docs/workflow/workflow-architecture.md`.
2. `docs/workflow/workflow-definitions.md`.
3. `docs/workflow/workflow-events.md`.
4. `docs/workflow/workflow-permissions.md`.
5. `docs/workflow/workflow-gap-analysis.md`.
6. `docs/workflow/workflow-migration-plan.md`.

Chapter 8 is authoritative for future workflow consolidation, process
configuration, task orchestration, approval orchestration, workflow events, and
Work Table execution behavior. It does not authorize immediate runtime
refactoring, API changes, database changes, UI changes, Docker changes, or
removal of Phase 7 Step 16 validated functionality.

Workflow Engine coordinates process execution. Domain modules remain
responsible for their own domain validation rules. Generic workflow behavior
must not be duplicated across modules.

The Work Table is the user-facing execution surface for workflow tasks. It is
not a separate workflow engine.

## Chapter 9 - Security, Identity, and Governance Architecture

The official Security, Identity, and Governance architecture is documented in
`docs/ARCHITECTURE_CHAPTER_9.md`.

Chapter 9 defines the mandatory security architecture for IAM, users,
workspaces, roles, permissions, authorization policies, authentication,
session management, API security, encryption, secret management, audit,
compliance, AI governance, organization policies, data governance, data
classification, monitoring, recovery, continuity, module integration, and
security observability.

The supporting security baseline documents are:

1. `docs/security/security-architecture.md`.
2. `docs/security/iam-architecture.md`.
3. `docs/security/rbac-model.md`.
4. `docs/security/security-policies.md`.
5. `docs/security/data-classification.md`.
6. `docs/security/api-security.md`.
7. `docs/security/audit-strategy.md`.
8. `docs/security/compliance.md`.
9. `docs/security/security-gap-analysis.md`.
10. `docs/security/security-migration-plan.md`.

Chapter 9 is authoritative for future authentication, authorization, IAM,
workspace isolation, policy evaluation, API security, secret management,
audit, data classification, compliance, and security governance work. It does
not authorize immediate runtime refactoring, API changes, database changes, UI
changes, Docker changes, or removal of Phase 7 Step 16 validated
functionality.

All modules must use the shared IAM, authorization, audit, policy,
classification, and security infrastructure. Module-specific authentication or
authorization mechanisms are not allowed.

## Chapter 10 - Integration and Interoperability Architecture

The official Integration and Interoperability architecture is documented in
`docs/ARCHITECTURE_CHAPTER_10.md`.

Chapter 10 defines the mandatory integration architecture for Integration
Gateway, provider adapters, integration contracts, internal APIs, public APIs,
API versioning, events, webhooks, import/export, error handling,
observability, security, governance, and extensibility.

The supporting integration baseline documents are:

1. `docs/integration/integration-architecture.md`.
2. `docs/integration/api-contracts.md`.
3. `docs/integration/adapter-registry.md`.
4. `docs/integration/event-catalog.md`.
5. `docs/integration/webhooks.md`.
6. `docs/integration/integration-security.md`.
7. `docs/integration/integration-gap-analysis.md`.
8. `docs/integration/integration-migration-plan.md`.

Chapter 10 is authoritative for future external integrations, internal API
contracts, public API contracts, adapter registries, event contracts, webhook
governance, import/export interoperability, provider independence, and
integration security work. It does not authorize immediate runtime provider
activation, API changes, database changes, UI changes, Docker changes, or
removal of Phase 7 Step 16 validated functionality.

All external systems must be accessed through dedicated adapters and the
Integration Layer. Business modules must not depend directly on external
providers, provider SDKs, provider-specific payloads, provider-specific errors,
or provider secrets.

## Chapter 11 - Frontend and Design System Architecture

The official Frontend and Design System architecture is documented in
`docs/ARCHITECTURE_CHAPTER_11.md`.

Chapter 11 defines the mandatory frontend architecture for Application Shell,
routing, layouts, pages, feature components, shared components, Design System,
navigation, internationalization, accessibility, responsive behavior, PWA
readiness, state management, backend communication, error handling, visual
themes, performance, and frontend observability.

The supporting frontend baseline documents are:

1. `docs/frontend/frontend-architecture.md`.
2. `docs/frontend/design-system.md`.
3. `docs/frontend/component-catalog.md`.
4. `docs/frontend/layouts.md`.
5. `docs/frontend/accessibility.md`.
6. `docs/frontend/i18n.md`.
7. `docs/frontend/frontend-gap-analysis.md`.
8. `docs/frontend/frontend-migration-plan.md`.

Chapter 11 is authoritative for future frontend structure, design system
components, visual consistency, i18n, accessibility, responsive behavior, PWA
architecture, frontend state, frontend API clients, frontend errors,
frontend themes, frontend performance, and frontend observability work. It
does not authorize immediate UI rewrites, API changes, database changes,
backend changes, Docker changes, or removal of Phase 7 Step 16 validated
functionality.

All user interfaces must be built on the shared Design System. User-visible
text must use i18n resources. Backend communication must use reusable
frontend API clients rather than scattered HTTP calls inside visual
components.

## Chapter 12 - Backend and Application Services Architecture

The official Backend and Application Services architecture is documented in
`docs/ARCHITECTURE_CHAPTER_12.md`.

Chapter 12 defines the mandatory backend architecture for the modular
monolith, delivery layer, application services, domain layer, infrastructure
adapters, public module contracts, use cases, commands, queries, validation,
transactions, repositories, persistence, versioned APIs, DTOs, errors,
idempotency, domain events, integration events, messaging, background jobs,
cache, storage, AI orchestration, authentication, authorization,
multi-tenancy, audit, logging, metrics, health checks, configuration, feature
flags, limits, testing, compatibility, performance, security, and code
conventions.

The supporting backend baseline documents are:

1. `docs/backend/backend-architecture.md`.
2. `docs/backend/application-services.md`.
3. `docs/backend/domain-layer.md`.
4. `docs/backend/module-contracts.md`.
5. `docs/backend/api-standards.md`.
6. `docs/backend/error-model.md`.
7. `docs/backend/eventing-and-messaging.md`.
8. `docs/backend/background-jobs.md`.
9. `docs/backend/cache-strategy.md`.
10. `docs/backend/transaction-strategy.md`.
11. `docs/backend/backend-security.md`.
12. `docs/backend/backend-observability.md`.
13. `docs/backend/backend-gap-analysis.md`.
14. `docs/backend/backend-dependency-map.md`.
15. `docs/backend/backend-migration-plan.md`.

Chapter 12 is authoritative for future backend structure, application service
organization, domain separation, module contracts, API standards, error
classification, transaction strategy, eventing, messaging, background jobs,
cache, backend security, backend observability, and incremental backend
migration work. It does not authorize immediate runtime refactoring, API
breaking changes, database changes, frontend changes, Docker changes, or
removal of Phase 7 Step 16 validated functionality.

Before any structural backend refactoring, Codex must complete and respect the
Backend Architecture Baseline Audit, dependency map, gap analysis, risk
classification, and incremental migration plan.

## Chapter 13 - DevOps, Infrastructure, Deployment, and Recovery Architecture

The official DevOps, Infrastructure, Deployment, and Recovery architecture is
documented in `docs/ARCHITECTURE_CHAPTER_13.md`.

Chapter 13 defines the mandatory architecture for Infrastructure as Code,
immutable deployments, GitOps readiness, CI/CD, automated validation,
artifacts, containerization, environment management, configuration, secret
management, deployment, migrations, backup, disaster recovery, operational
observability, logging, monitoring, scalability, performance, operational
security, release versioning, and rollback.

The supporting DevOps baseline documents are:

1. `docs/devops/devops-architecture.md`.
2. `docs/devops/ci-cd.md`.
3. `docs/devops/deployment-strategy.md`.
4. `docs/devops/environment-management.md`.
5. `docs/devops/containerization.md`.
6. `docs/devops/backup-and-recovery.md`.
7. `docs/devops/disaster-recovery.md`.
8. `docs/devops/observability.md`.
9. `docs/devops/release-management.md`.
10. `docs/devops/devops-gap-analysis.md`.
11. `docs/devops/devops-migration-plan.md`.

Chapter 13 is authoritative for future CI/CD, infrastructure, container,
environment, secret, deployment, backup, disaster recovery, release,
operational security, and operational observability work. It does not
authorize application code changes, API changes, database schema changes, UI
changes, Docker rewrites, or removal of Phase 7 Step 16 validated
functionality.

Before structural infrastructure changes, Codex must complete and respect the
DevOps and Infrastructure Baseline Audit, current infrastructure inventory,
dependency map, gap analysis, risk assessment, and incremental migration plan.

## Chapter 14 - Quality Architecture and Testing Strategy

The official Quality Architecture and Testing Strategy is documented in
`docs/ARCHITECTURE_CHAPTER_14.md`.

Chapter 14 defines the mandatory standard for Quality by Design, test-first
development, shift-left testing, automation, repeatable validation,
continuous verification, risk-based testing, traceability, reproducibility,
unit tests, domain tests, application tests, integration tests, API tests,
contract tests, database tests, migration tests, security tests, performance
tests, accessibility tests, UI tests, end-to-end tests, AI validation tests,
regression tests, smoke tests, test data, coverage, Quality Gates, quality
observability, and defect management.

The supporting quality baseline documents are:

1. `docs/quality/testing-strategy.md`.
2. `docs/quality/test-pyramid.md`.
3. `docs/quality/test-catalog.md`.
4. `docs/quality/quality-gates.md`.
5. `docs/quality/coverage-policy.md`.
6. `docs/quality/security-testing.md`.
7. `docs/quality/accessibility-testing.md`.
8. `docs/quality/performance-testing.md`.
9. `docs/quality/ai-testing.md`.
10. `docs/quality/regression-policy.md`.
11. `docs/quality/quality-gap-analysis.md`.
12. `docs/quality/quality-migration-plan.md`.

Chapter 14 is authoritative for future test architecture, release validation,
coverage policy, Quality Gates, security testing, accessibility testing,
performance testing, AI validation, regression policy, defect management, and
quality observability work. It does not authorize application code changes,
API changes, database schema changes, UI changes, Docker changes, or removal
of Phase 7 Step 16 validated functionality.

Before changes to test architecture or release gates, Codex must complete and
respect the Quality and Testing Baseline Audit, coverage analysis, risk
assessment, quality gap analysis, and incremental migration plan.

## Chapter 15 - Operations, Maintenance, and Platform Evolution Architecture

The official Operations, Maintenance, and Platform Evolution Architecture is
documented in `docs/ARCHITECTURE_CHAPTER_15.md`.

Chapter 15 defines the mandatory standard for operational excellence,
continuous improvement, reliability, controlled evolution, preventive
maintenance, configuration management, feature lifecycle management, Semantic
Versioning, compatibility, deprecation, incident management, SLA, SLO,
operational monitoring, operational KPIs, operational audit, business
continuity, lifecycle management, roadmap management, risk management, and
long-term platform evolution.

The supporting operations baseline documents are:

1. `docs/operations/operations-architecture.md`.
2. `docs/operations/platform-governance.md`.
3. `docs/operations/release-management.md`.
4. `docs/operations/versioning-policy.md`.
5. `docs/operations/deprecation-policy.md`.
6. `docs/operations/incident-management.md`.
7. `docs/operations/business-continuity.md`.
8. `docs/operations/maintenance-strategy.md`.
9. `docs/operations/risk-management.md`.
10. `docs/operations/kpi-and-sla.md`.
11. `docs/operations/operations-gap-analysis.md`.
12. `docs/operations/platform-evolution-roadmap.md`.

Chapter 15 is authoritative for future operational architecture, platform
governance, release management, versioning, deprecation, incident management,
business continuity, maintenance, risk management, KPIs, SLA, and controlled
platform evolution. It does not authorize application code changes, API
changes, database schema changes, UI changes, Docker changes, infrastructure
changes, or removal of Phase 7 Step 16 validated functionality.

Before changes to operational architecture or long-term maintenance policy,
Codex must complete and respect the Operations and Platform Evolution Baseline
Audit, governance assessment, operational gap analysis, risk evaluation, and
controlled evolution roadmap.

Architecture Chapters 0-15 now form the complete high-level architecture
framework. The next stage is detailed module specifications and controlled
module implementation based on these standards.

## Phase II Module 1 - Library Module Architecture

The official Library module implementation specification begins in
`docs/modules/library/library-overview.md`.

The Library is the canonical repository and Single Source of Truth for all
editorial resources managed by the platform. No manuscript, book, magazine,
article, image, illustration, audio, video, translation, export, publication,
or source file may exist as an editorial object outside the Library model.

The supporting Library module specification documents are:

1. `docs/modules/library/library-overview.md`.
2. `docs/modules/library/domain-model.md`.
3. `docs/modules/library/metadata-model.md`.
4. `docs/modules/library/asset-management.md`.
5. `docs/modules/library/versioning.md`.
6. `docs/modules/library/search-and-indexing.md`.
7. `docs/modules/library/api-contracts.md`.
8. `docs/modules/library/events.md`.
9. `docs/modules/library/permissions.md`.
10. `docs/modules/library/workflows.md`.
11. `docs/modules/library/library-gap-analysis.md`.
12. `docs/modules/library/library-migration-plan.md`.

Library module rules:

- Every editorial object must be represented as a Library Item or explicitly
  linked Library publication record during migration.
- Every physical file must be managed as an Asset or current publication file
  record until the generalized Asset model is introduced.
- All metadata, assets, versions, relationships, rights, and provenance must
  be auditable.
- Existing Intelligent Editorial Library lifecycle behavior must be preserved.
- Existing Phase 7 Step 16 publishing, preflight, and distribution behavior
  must be preserved.
- Other modules must consume editorial resources through Library references
  and must not create duplicate repositories of editorial data.

Module 2 - Translation Module Architecture is now documented as the next
Phase II specification after Library.

## Phase II Module 2 - Translation Module Architecture

The official Translation module implementation specification begins in
`docs/modules/translation/translation-overview.md`.

The Translation Module manages the complete editorial translation process for
Laborator Editura. It preserves source immutability, semantic fidelity,
terminology consistency, traceability, Human Final Authority, and Library as
the Single Source of Truth.

The supporting Translation module specification documents are:

1. `docs/modules/translation/translation-overview.md`.
2. `docs/modules/translation/domain-model.md`.
3. `docs/modules/translation/segmentation.md`.
4. `docs/modules/translation/translation-memory.md`.
5. `docs/modules/translation/glossary-management.md`.
6. `docs/modules/translation/terminology.md`.
7. `docs/modules/translation/quality-validation.md`.
8. `docs/modules/translation/api-contracts.md`.
9. `docs/modules/translation/events.md`.
10. `docs/modules/translation/workflows.md`.
11. `docs/modules/translation/translation-gap-analysis.md`.
12. `docs/modules/translation/translation-migration-plan.md`.

Translation module rules:

- Original documents are immutable.
- Every translation must be linked to Library.
- Every segment must be persistent, auditable, and versionable.
- Translation Memory is reusable and proposal-only.
- Validated terminology overrides Translation Memory and AI suggestions.
- AI translation must operate through orchestration with full context.
- QA and Semantic Fidelity validation must remain connected.
- Workflow approval remains human-controlled.
- No translation workflow may duplicate editorial content outside Library.

Module 3 - Proofreading and Editorial Review Module Architecture is now
documented as the next Phase II specification after Translation.

## Phase II Module 3 - Proofreading and Editorial Review Module Architecture

The official Proofreading and Editorial Review module implementation
specification begins in
`docs/modules/editorial-review/editorial-review-overview.md`.

The Proofreading and Editorial Review Module validates linguistic,
terminological, stylistic, doctrinal, and editorial quality before approval,
publication, or distribution. It keeps review non-destructive, auditable,
workflow-controlled, and subordinate to Human Final Authority.

The supporting Proofreading and Editorial Review module specification
documents are:

1. `docs/modules/editorial-review/editorial-review-overview.md`.
2. `docs/modules/editorial-review/domain-model.md`.
3. `docs/modules/editorial-review/linguistic-validation.md`.
4. `docs/modules/editorial-review/style-validation.md`.
5. `docs/modules/editorial-review/terminology-validation.md`.
6. `docs/modules/editorial-review/comments-and-review.md`.
7. `docs/modules/editorial-review/api-contracts.md`.
8. `docs/modules/editorial-review/events.md`.
9. `docs/modules/editorial-review/workflows.md`.
10. `docs/modules/editorial-review/editorial-review-gap-analysis.md`.
11. `docs/modules/editorial-review/editorial-review-migration-plan.md`.

Editorial Review module rules:

- Review must remain non-destructive until an authorized human accepts a
  correction proposal.
- AI may suggest, explain, compare, and signal risk, but it must not approve,
  publish, apply corrections automatically, or bypass Workflow.
- Editorial Review must reuse Library, Translation, Terminology, Glossary,
  QA, Semantic Fidelity, Editorial Decisions, Collaboration, Workflow, Audit,
  and Publishing contracts.
- Validated terminology remains authoritative over Translation Memory and AI
  suggestions.
- Comments, observations, correction proposals, review decisions, approvals,
  and rejections must be auditable.
- Review must not duplicate Translation content ownership, Workflow state
  ownership, Publishing release authority, or Library source-of-truth
  responsibilities.
- Existing Phase 7 Step 16 publishing, preflight, and distribution behavior
  must be preserved.

Module 4 - Publishing Module Architecture is now documented as the next Phase
II specification after Proofreading and Editorial Review.

## Phase II Module 4 - Publishing Module Architecture

The official Publishing module implementation specification begins in
`docs/modules/publishing/publishing-overview.md`.

The Publishing Module manages the complete publication cycle from approved
Library content to official digital, print, audio, video, and public
distribution outputs. Publishing is the only controlled mechanism through
which an approved document becomes an official edition.

The supporting Publishing module specification documents are:

1. `docs/modules/publishing/publishing-overview.md`.
2. `docs/modules/publishing/domain-model.md`.
3. `docs/modules/publishing/publication-build.md`.
4. `docs/modules/publishing/publication-profiles.md`.
5. `docs/modules/publishing/format-generators.md`.
6. `docs/modules/publishing/distribution.md`.
7. `docs/modules/publishing/api-contracts.md`.
8. `docs/modules/publishing/events.md`.
9. `docs/modules/publishing/workflows.md`.
10. `docs/modules/publishing/publishing-gap-analysis.md`.
11. `docs/modules/publishing/publishing-migration-plan.md`.

Publishing module rules:

- Publishing may use only approved Library content.
- Published official editions are immutable and versioned.
- Corrections require a new version, edition, or republication record.
- All publication metadata must come from Library and must be validated before
  release.
- Export owns generated files and format artifacts.
- Rights & Provenance owns rights warnings and publication authorization.
- Workflow owns generic approval and transition gates.
- Public Portal owns public catalog visibility and reader access metadata.
- Commerce owns commercial edition and print/distribution metadata.
- Publishing must not create separate Preflight, Distribution, or Archive
  modules.
- AI may summarize readiness, detect blockers, and suggest remediation, but it
  must not publish, approve, withdraw, distribute, bypass rights, or bypass
  Workflow.
- Existing Phase 7 Step 16 publishing, final preflight, and distribution
  tracking behavior must be preserved.

Module 5 - Rights and Provenance Module Architecture is now documented as the
next Phase II specification after Publishing.

## Phase II Module 5 - Rights and Provenance Module Architecture

The official Rights and Provenance module implementation specification begins
in `docs/modules/rights/rights-overview.md`.

The Rights and Provenance Module centrally manages intellectual property,
copyright, translation rights, publishing rights, licenses, contracts,
provenance, legal restrictions, and legal history. No resource may be
published without validation from this module.

The supporting Rights and Provenance module specification documents are:

1. `docs/modules/rights/rights-overview.md`.
2. `docs/modules/rights/domain-model.md`.
3. `docs/modules/rights/provenance-model.md`.
4. `docs/modules/rights/license-management.md`.
5. `docs/modules/rights/contract-management.md`.
6. `docs/modules/rights/compliance-validation.md`.
7. `docs/modules/rights/api-contracts.md`.
8. `docs/modules/rights/events.md`.
9. `docs/modules/rights/workflows.md`.
10. `docs/modules/rights/rights-gap-analysis.md`.
11. `docs/modules/rights/rights-migration-plan.md`.

Rights and Provenance module rules:

- Every Library Item must have verifiable provenance before publication.
- Every legal right must be explicitly represented.
- Contracts and licenses must be linked to resources and must be versioned and
  auditable.
- Missing, expired, revoked, or incompatible rights must block publication and
  distribution.
- Rights and Provenance owns rights records, rights holders, licenses,
  contract metadata, restrictions, provenance validation, legal history, and
  rights validation verdicts.
- Library owns resource identity and contract assets.
- Publishing, Translation, Audio, Video, Public Portal, Commerce, and Quality
  must consume rights validation through public Rights contracts.
- No module may implement an independent rights system.
- AI may summarize agreements and detect missing or expired permissions, but
  it must not approve agreements, authorize translations, authorize
  publication, revoke rights, transfer rights, or modify validated provenance
  automatically.
- Existing Phase 7 Step 16 publishing, final preflight, and distribution
  tracking behavior must be preserved.

Module 6 - Magazine Module Architecture is now documented as the next Phase II
specification after Rights and Provenance.

## Phase II Module 6 - Magazine Module Architecture

The official Magazine module implementation specification begins in
`docs/modules/magazine/magazine-overview.md`.

The Magazine Module manages the complete lifecycle of periodical publications:
magazines, volumes, issues, sections, articles, assets, layout, publication,
archive, and distribution. Each article remains an independent Library Item,
and each issue is published through the Publishing Module.

The supporting Magazine module specification documents are:

1. `docs/modules/magazine/magazine-overview.md`.
2. `docs/modules/magazine/domain-model.md`.
3. `docs/modules/magazine/issue-management.md`.
4. `docs/modules/magazine/article-management.md`.
5. `docs/modules/magazine/layout.md`.
6. `docs/modules/magazine/publication.md`.
7. `docs/modules/magazine/api-contracts.md`.
8. `docs/modules/magazine/events.md`.
9. `docs/modules/magazine/workflows.md`.
10. `docs/modules/magazine/magazine-gap-analysis.md`.
11. `docs/modules/magazine/magazine-migration-plan.md`.

Magazine module rules:

- Every magazine article must be represented as an independent Library Item.
- Articles may be reused across issues and publications only through
  references, never duplicated editorial content.
- Magazine issues must be versioned and auditable.
- Issue layout must be decoupled from article content.
- Article translation must use the Translation Module.
- Article approval must use the Editorial Review Module.
- Rights validation must use Rights and Provenance.
- Official issue publication must be delegated exclusively to the Publishing
  Module.
- Assets such as images, covers, PDFs, and source files must remain managed
  through Library references.
- Existing Magazine Digital Experience, Phase 7 Step 16 publishing/preflight/
  distribution behavior, and architectural standards from Chapters 0-15 must
  be preserved.

Module 7 - AI Orchestration and Editorial Agents Module Architecture is now
documented as the next Phase II specification after Magazine.

## Phase II Module 7 - AI Orchestration and Editorial Agents Module Architecture

The official AI Orchestration and Editorial Agents module implementation
specification begins in
`docs/modules/ai-orchestration/ai-orchestration-overview.md`.

The AI Orchestration and Editorial Agents Module coordinates every AI request,
agent execution, context package, prompt version, model route, validation
result, human review handoff, cost signal, observability trace, and audit
event. It is the only approved path through which platform modules may request
AI capabilities.

The supporting AI Orchestration module specification documents are:

1. `docs/modules/ai-orchestration/ai-orchestration-overview.md`.
2. `docs/modules/ai-orchestration/domain-model.md`.
3. `docs/modules/ai-orchestration/agent-registry.md`.
4. `docs/modules/ai-orchestration/context-builder.md`.
5. `docs/modules/ai-orchestration/prompt-builder.md`.
6. `docs/modules/ai-orchestration/model-router.md`.
7. `docs/modules/ai-orchestration/validation-engine.md`.
8. `docs/modules/ai-orchestration/api-contracts.md`.
9. `docs/modules/ai-orchestration/events.md`.
10. `docs/modules/ai-orchestration/workflows.md`.
11. `docs/modules/ai-orchestration/ai-gap-analysis.md`.
12. `docs/modules/ai-orchestration/ai-migration-plan.md`.

AI Orchestration module rules:

- No functional module may communicate directly with an external AI provider.
- Every AI request must pass through AI Orchestration.
- Context packages must be built from authorized sources only.
- Prompts must be centralized, versioned, auditable, and selected through the
  orchestrator.
- Provider and model routing must be policy-driven, cost-aware, replaceable,
  and auditable.
- Agent registry and agent chains must be reusable, versioned, and governed.
- AI output must be validated before being returned to functional modules.
- Human Final Authority remains mandatory for approval, publication, rights,
  security, governance, and workflow gates.
- AI executions must record model, model version, prompt version, context
  references, duration, token usage, estimated cost, result, errors,
  validation status, audit references, and observability traces.
- Existing AI Governance, Marketplace, Observability, Gateway, Editorial
  Decision, Translation, Rights, Publishing, Magazine, and Quality behavior
  must be preserved.

Module 8 - Audio and Narration Module Architecture is now documented as the
next Phase II specification after AI Orchestration and Editorial Agents.

## Phase II Module 8 - Audio and Narration Module Architecture

The official Audio and Narration module implementation specification begins
in `docs/modules/audio/audio-overview.md`.

The Audio and Narration Module manages the complete lifecycle of editorial
audio: narration projects, audio chapters, voice profiles, human recordings,
TTS generation metadata, voice cloning governance metadata, text-audio
synchronization, transcripts, subtitles, accessibility metadata, audio assets,
and publication handoff.

The supporting Audio and Narration module specification documents are:

1. `docs/modules/audio/audio-overview.md`.
2. `docs/modules/audio/domain-model.md`.
3. `docs/modules/audio/narration-projects.md`.
4. `docs/modules/audio/voice-profiles.md`.
5. `docs/modules/audio/tts-pipeline.md`.
6. `docs/modules/audio/synchronization.md`.
7. `docs/modules/audio/api-contracts.md`.
8. `docs/modules/audio/events.md`.
9. `docs/modules/audio/workflows.md`.
10. `docs/modules/audio/audio-gap-analysis.md`.
11. `docs/modules/audio/audio-migration-plan.md`.

Audio and Narration module rules:

- Every audio project must be linked to a Library Item.
- Source text remains the authoritative source of truth.
- Audio assets are derived, non-destructive, versioned, and auditable.
- Voice profiles must be reusable and versioned.
- Voice cloning requires documented consent and Rights and Provenance
  validation.
- TTS and AI-assisted narration must route through AI Orchestration.
- Text-audio synchronization must be preserved at segment level.
- Preview audio is draft-only and must never be published.
- Official audio publication requires approved text, voice rights,
  publication rights, workflow approval, and Publishing handoff.
- Existing Multimedia Creation, Media Localization, AI Governance, Rights,
  Publishing, Public Portal, Pipeline, and Phase 7 Step 16 behavior must be
  preserved.

Module 9 - Video and Multimedia Module Architecture is now documented as the
next Phase II specification after Audio and Narration.

## Phase II Module 9 - Video and Multimedia Module Architecture

The official Video and Multimedia module implementation specification begins
in `docs/modules/video/video-overview.md`.

The Video and Multimedia Module manages the complete lifecycle of editorial
video: video projects, scenes, timelines, multimedia asset references,
narration, captions, synchronization, rendering, export, accessibility
metadata, platform targets, and publication handoff.

The supporting Video and Multimedia module specification documents are:

1. `docs/modules/video/video-overview.md`.
2. `docs/modules/video/domain-model.md`.
3. `docs/modules/video/video-projects.md`.
4. `docs/modules/video/timeline.md`.
5. `docs/modules/video/media-assets.md`.
6. `docs/modules/video/rendering-pipeline.md`.
7. `docs/modules/video/api-contracts.md`.
8. `docs/modules/video/events.md`.
9. `docs/modules/video/workflows.md`.
10. `docs/modules/video/video-gap-analysis.md`.
11. `docs/modules/video/video-migration-plan.md`.

Video and Multimedia module rules:

- Every video project must be linked to a Library Item.
- All multimedia assets must be centrally managed and referenced from Library
  or approved asset modules.
- Timeline state must remain independent from source editorial content.
- Scene, timeline, render, caption, and synchronization changes must be
  versioned and auditable.
- Text-audio-video-caption synchronization must be preserved at segment
  level.
- Rendering must be asynchronous, scalable, traceable, and non-destructive.
- Preview video is draft-only and must never be published.
- Official video publication requires approved source content, asset rights,
  workflow approval, quality review, rendering review, and Publishing handoff.
- AI-assisted video, captioning, thumbnail, timing, or media generation must
  route through AI Orchestration.
- Existing Multimedia Creation, Media Localization, Audio, AI Governance,
  Rights, Publishing, Public Portal, Pipeline, and Phase 7 Step 16 behavior
  must be preserved.

Module 10 - Workflow Engine and Business Process Automation Module
Architecture is now documented as the next Phase II specification after Video
and Multimedia.

## Phase II Module 10 - Workflow Engine and Business Process Automation Module Architecture

The official Workflow Engine and Business Process Automation module
implementation specification begins in
`docs/modules/workflow/workflow-overview.md`.

The Workflow Engine coordinates platform processes from manuscript creation to
publication, distribution, archive, and operational follow-up. It manages
workflow definitions, workflow versions, workflow instances, state machines,
transitions, business rules, tasks, approvals, scheduler hooks, automation
metadata, SLA metadata, escalation metadata, events, and process audit.

The supporting Workflow Engine module specification documents are:

1. `docs/modules/workflow/workflow-overview.md`.
2. `docs/modules/workflow/domain-model.md`.
3. `docs/modules/workflow/state-machine.md`.
4. `docs/modules/workflow/rule-engine.md`.
5. `docs/modules/workflow/task-management.md`.
6. `docs/modules/workflow/approval-engine.md`.
7. `docs/modules/workflow/scheduler.md`.
8. `docs/modules/workflow/api-contracts.md`.
9. `docs/modules/workflow/events.md`.
10. `docs/modules/workflow/workflow-gap-analysis.md`.
11. `docs/modules/workflow/workflow-migration-plan.md`.

Workflow Engine module rules:

- All platform business processes must be coordinated through Workflow Engine
  when generic process orchestration is required.
- Domain modules keep ownership of domain validation and domain state.
- Domain modules must not create independent workflow engines.
- Workflow definitions must be versioned and configurable without code.
- Workflow instances must reference immutable workflow versions.
- Transitions must be validated, idempotent, auditable, and tenant-scoped.
- Tasks, approvals, deadlines, notifications, scheduler hooks, and
  escalations must be integrated through clear contracts.
- Automation rules must be reusable, auditable, retry-safe, and non-
  destructive.
- Automation must not approve, publish, grant rights, bypass workflow, modify
  security, or override Human Final Authority.
- AI-triggered workflow actions must route through AI Orchestration and must
  never call providers directly from Workflow Engine.
- Existing Workflow v1, Scheduling, Editorial Pipeline, Publishing,
  Preflight, Distribution, and Phase 7 Step 16 behavior must be preserved.

Module 11 - Notification and Communication Module Architecture is now
documented as the next Phase II specification after Workflow Engine and
Business Process Automation.

## Phase II Module 11 - Notification and Communication Module Architecture

The official Notification and Communication module implementation
specification begins in
`docs/modules/notifications/notifications-overview.md`.

The Notification and Communication Module centralizes all platform
communication generated by application events, workflows, approvals, tasks,
alerts, integrations, and operational processes. It manages notifications,
templates, template versions, preferences, channel routing, delivery queue
metadata, retry metadata, webhook dispatch metadata, delivery tracking, and
communication audit.

The supporting Notification and Communication module specification documents
are:

1. `docs/modules/notifications/notifications-overview.md`.
2. `docs/modules/notifications/domain-model.md`.
3. `docs/modules/notifications/template-engine.md`.
4. `docs/modules/notifications/channel-router.md`.
5. `docs/modules/notifications/delivery-queue.md`.
6. `docs/modules/notifications/webhooks.md`.
7. `docs/modules/notifications/api-contracts.md`.
8. `docs/modules/notifications/events.md`.
9. `docs/modules/notifications/workflows.md`.
10. `docs/modules/notifications/notifications-gap-analysis.md`.
11. `docs/modules/notifications/notifications-migration-plan.md`.

Notification and Communication module rules:

- All outbound platform communication must be coordinated through the
  centralized Notification Engine.
- Domain modules must emit events or notification requests instead of sending
  email, push, in-app, webhook, SMS, Slack, Teams, or external messages
  directly.
- Templates must be versioned, localized, previewable, and auditable.
- Channel routing must respect user preferences, organization policy,
  priority, channel availability, and Need-to-Know restrictions.
- Mandatory security, account recovery, workflow, rights, compliance, and
  Human Final Authority messages may follow policy-defined delivery rules.
- Deliveries must be asynchronous, retryable, traceable, idempotent, and
  auditable.
- Webhook dispatch must use documented payload versions, HMAC signatures,
  timeout handling, retries, and delivery logs.
- Restricted content must not be leaked into external channels.
- AI may draft templates, summarize messages, and suggest routing, but must
  not activate templates, enable channels, override preferences, expose
  restricted content, approve workflow, publish, or grant rights.
- Existing Gateway webhooks, Scheduling reminders, Workspace preferences,
  Auth recovery flows, Workflow Engine, Publishing, Distribution, and Phase 7
  Step 16 behavior must be preserved.

Module 12 - Identity, Access Management and Security Module Architecture is
now documented as the next Phase II specification after Notification and
Communication.

## Phase II Module 12 - Identity, Access Management and Security Module Architecture

The official Identity, Access Management and Security module implementation
specification begins in `docs/modules/iam/iam-overview.md`.

The IAM Module manages authentication, authorization, identity, roles,
permissions, sessions, MFA policy, future SSO providers, security policies,
and security audit for the entire platform. No module may implement its own
authentication or authorization mechanism.

The supporting IAM module specification documents are:

1. `docs/modules/iam/iam-overview.md`.
2. `docs/modules/iam/domain-model.md`.
3. `docs/modules/iam/authentication.md`.
4. `docs/modules/iam/authorization.md`.
5. `docs/modules/iam/rbac.md`.
6. `docs/modules/iam/mfa-sso.md`.
7. `docs/modules/iam/session-management.md`.
8. `docs/modules/iam/security-policies.md`.
9. `docs/modules/iam/api-contracts.md`.
10. `docs/modules/iam/events.md`.
11. `docs/modules/iam/iam-gap-analysis.md`.
12. `docs/modules/iam/iam-migration-plan.md`.

IAM module rules:

- IAM is the only official source of authentication, authorization, identity,
  roles, permissions, sessions, MFA policy, future SSO provider decisions, and
  security audit.
- All protected requests must use server-derived authenticated context.
- Client-provided user IDs, organization IDs, roles, and permissions must not
  be trusted.
- All modules must consult IAM or the approved authorization layer before
  reading, creating, modifying, deleting, publishing, approving, exporting, or
  executing restricted actions.
- RBAC is mandatory and may be extended by policy-based authorization,
  Need-to-Know scope, data classification, workflow state, organization
  policy, and subscription entitlements.
- The most restrictive valid access rule wins.
- MFA and SSO configuration must be centralized in IAM.
- Security policies must be administrable without application code changes.
- Every permission-sensitive action must be auditable.
- AI may detect risks, summarize access, and suggest policy changes, but must
  not grant roles, revoke users, approve access reviews, enable SSO, change
  security policies, or expand its own access.
- Existing Auth, Request Context, Security Governance, Policy Engine,
  Enterprise Admin, Workspace, Gateway, Launch Essentials, Workflow,
  Notification, Publishing, Distribution, and Phase 7 Step 16 behavior must be
  preserved.

Module 13 - Observability, Monitoring and Audit Module Architecture is now
documented as the next Phase II specification after Identity, Access
Management and Security.

## Phase II Module 13 - Observability, Monitoring and Audit Module Architecture

The official Observability, Monitoring and Audit module implementation
specification begins in
`docs/modules/observability/observability-overview.md`.

The Observability, Monitoring and Audit Module provides real-time monitoring,
structured logs, metrics, distributed traces, operational audit visibility,
alerting, dashboards, diagnostics, and telemetry correlation for all services,
workers, AI agents, workflows, infrastructure processes, and publication
pipelines.

The supporting Observability module specification documents are:

1. `docs/modules/observability/observability-overview.md`.
2. `docs/modules/observability/domain-model.md`.
3. `docs/modules/observability/logging.md`.
4. `docs/modules/observability/metrics.md`.
5. `docs/modules/observability/tracing.md`.
6. `docs/modules/observability/audit.md`.
7. `docs/modules/observability/alerting.md`.
8. `docs/modules/observability/dashboards.md`.
9. `docs/modules/observability/api-contracts.md`.
10. `docs/modules/observability/events.md`.
11. `docs/modules/observability/observability-gap-analysis.md`.
12. `docs/modules/observability/observability-migration-plan.md`.

Observability module rules:

- All platform components must emit telemetry through centralized
  observability infrastructure.
- Modules must not create isolated monitoring mechanisms that cannot be
  correlated, retained, audited, or diagnosed.
- Structured logs must include severity, service/module, timestamp,
  correlation ID, trace ID when available, tenant scope, and safe metadata.
- Metrics must be centrally collected and use documented names, units, types,
  and dimensions.
- Every request, event, job, workflow, AI execution, notification, export, and
  infrastructure process should propagate correlation ID and trace ID.
- Audit remains distinct from observability: audit proves authorized actions,
  while observability explains system behavior.
- Source modules remain authoritative for their own business audit records.
- Observability may provide immutable read models, correlation, dashboards,
  diagnostics, and alerting over audit sources.
- Alert rules must be configurable, deduplicated, acknowledged, escalated, and
  routed through Notification and Communication for delivery.
- Telemetry must not expose secrets, tokens, restricted content, or
  unnecessary personal data.
- AI may diagnose, summarize incidents, and suggest remediation, but must not
  delete logs, hide errors, alter audit, suppress critical alerts
  automatically, or execute infrastructure actions automatically.
- Existing Health, Observability, IAM, Notification, Workflow, Gateway,
  Security Governance, Backup, Platform Engineering, Publishing,
  Distribution, infrastructure scripts, and Phase 7 Step 16 behavior must be
  preserved.

## Phase II Module 14 - Backup, Disaster Recovery and Business Continuity Module Architecture

The official Backup, Disaster Recovery and Business Continuity module
implementation specification begins in
`docs/modules/backup/backup-overview.md`.

The Backup, Disaster Recovery and Business Continuity Module protects all
platform data, configuration, audit history, editorial assets, publication
artifacts, and operational continuity. It centralizes full backups,
incremental backups, differential backups, snapshots, replication, restore
workflows, disaster recovery plans, business continuity procedures, retention
policies, integrity validation, recovery objectives, and backup audit.

The supporting Backup module specification documents are:

1. `docs/modules/backup/backup-overview.md`.
2. `docs/modules/backup/domain-model.md`.
3. `docs/modules/backup/backup-strategies.md`.
4. `docs/modules/backup/retention-policies.md`.
5. `docs/modules/backup/replication.md`.
6. `docs/modules/backup/restore.md`.
7. `docs/modules/backup/disaster-recovery.md`.
8. `docs/modules/backup/business-continuity.md`.
9. `docs/modules/backup/api-contracts.md`.
10. `docs/modules/backup/events.md`.
11. `docs/modules/backup/backup-gap-analysis.md`.
12. `docs/modules/backup/backup-migration-plan.md`.

Backup module rules:

- All critical platform data, configuration, audit history, and publication
  artifacts must be covered by centralized backup policies.
- Modules must not create isolated backup or restore mechanisms that bypass
  centralized backup governance, tenant isolation, retention, encryption,
  validation, observability, or audit.
- Backups must be versioned, checksum-verified, encrypted in controlled
  environments, and retained according to documented policy.
- Restore operations require authenticated server-derived context, explicit
  authorized human approval, integrity validation, and full audit.
- Disaster recovery plans must define RPO, RTO, critical services,
  dependencies, restore order, failover/failback procedures, and post-recovery
  checks.
- Business continuity must prioritize safe degraded operation, preservation of
  editorial work, audit continuity, rights restrictions, and Human Final
  Authority.
- AI may recommend backup, restore, continuity, or disaster recovery actions,
  but must not restore data, delete backups, alter retention, execute
  failover, publish, approve, or bypass workflow.
- Existing Backup Governance, runtime backup/restore, Infrastructure Pack,
  Observability, IAM, Workflow, Publishing, Distribution, and Phase 7 Step 16
  behavior must be preserved.

## Phase II Module 15 - Search, Indexing and Knowledge Graph Module Architecture

The official Search, Indexing and Knowledge Graph module implementation
specification begins in `docs/modules/search/search-overview.md`.

The Search, Indexing and Knowledge Graph Module provides the unified
infrastructure for full-text search, semantic search, vector search,
autocomplete, faceted search, incremental indexing, entity linking,
relationship navigation, intelligent recommendations, and editorial knowledge
reuse across the entire platform.

The supporting Search module specification documents are:

1. `docs/modules/search/search-overview.md`.
2. `docs/modules/search/domain-model.md`.
3. `docs/modules/search/indexing.md`.
4. `docs/modules/search/full-text-search.md`.
5. `docs/modules/search/semantic-search.md`.
6. `docs/modules/search/vector-search.md`.
7. `docs/modules/search/knowledge-graph.md`.
8. `docs/modules/search/entity-relationships.md`.
9. `docs/modules/search/api-contracts.md`.
10. `docs/modules/search/events.md`.
11. `docs/modules/search/search-gap-analysis.md`.
12. `docs/modules/search/search-migration-plan.md`.

Search module rules:

- Search, indexing, autocomplete, semantic retrieval, vector retrieval, and
  Knowledge Graph capabilities must be centralized.
- Functional modules must not implement isolated search engines. Local query
  helpers may remain during migration only when they preserve existing
  behavior and are compatible with the central indexing plan.
- Indexing must be incremental, asynchronous, event-driven, re-runnable,
  language-aware, version-aware, and auditable.
- Search results must enforce IAM, Need-to-Know, project scope, document
  permissions, workflow visibility, rights restrictions, and public visibility
  rules server-side.
- Restricted content must not be indexed, embedded, exposed, summarized, or
  suggested unless copyright, license, security, and AI-eligibility policies
  allow it.
- Knowledge Graph entities and relationships must preserve source module,
  source resource ID, source version, provenance, confidence, and validation
  state where editorially relevant.
- AI may suggest related resources, entities, relationships, rankings,
  embeddings, and explanations, but it must not approve editorial facts,
  override validated terminology, publish, grant access, or bypass workflow.
- Existing Library, Research, Translation Memory, Terminology,
  Lexicographic Intelligence, Public Portal, Marketplace, IAM,
  Observability, Backup, Publishing, Distribution, and Phase 7 Step 16
  behavior must be preserved.

## Phase II Module 16 - Integration, API Gateway and External Connectors Module Architecture

The official Integration, API Gateway and External Connectors module
implementation specification begins in
`docs/modules/integration/integration-overview.md`.

The Integration, API Gateway and External Connectors Module provides the
unified infrastructure for secure external interoperability, API Gateway
routing, REST APIs, optional GraphQL APIs, webhooks, event gateway contracts,
external connectors, rate limiting, API versioning, API security, OAuth
integration, API monitoring, service discovery, and contract validation.

The supporting Integration module specification documents are:

1. `docs/modules/integration/integration-overview.md`.
2. `docs/modules/integration/domain-model.md`.
3. `docs/modules/integration/api-gateway.md`.
4. `docs/modules/integration/connectors.md`.
5. `docs/modules/integration/webhooks.md`.
6. `docs/modules/integration/api-versioning.md`.
7. `docs/modules/integration/rate-limiting.md`.
8. `docs/modules/integration/security.md`.
9. `docs/modules/integration/api-contracts.md`.
10. `docs/modules/integration/events.md`.
11. `docs/modules/integration/integration-gap-analysis.md`.
12. `docs/modules/integration/integration-migration-plan.md`.

Integration module rules:

- All external communication must pass through the API Gateway or approved
  centralized connector adapters.
- Functional modules must not call external services, provider SDKs, webhooks,
  storage providers, AI providers, publishing providers, payment providers, or
  productivity providers directly.
- API contracts must be versioned, documented, validated, observable, and
  backwards-compatible according to deprecation policy before stable external
  exposure.
- Webhooks must be signed, retryable, idempotent where needed, observable,
  auditable, and protected against replay.
- Rate limiting must be configurable by endpoint, tenant, consumer, connector,
  and sensitive-operation policy.
- Secrets, tokens, OAuth credentials, webhook secrets, and provider keys must
  not be hardcoded, logged, indexed, exported, embedded in JSON Master, or
  exposed in client bundles.
- IAM remains the source of authentication and authorization for integration
  traffic.
- AI may suggest integration settings, connector scopes, and risk summaries,
  but must not create active secrets, enable providers, expand scopes, bypass
  rate limits, or execute production-impacting integration actions.
- Existing Gateway, Integrations, Webhooks, IAM, Security Governance,
  Observability, Backup, Search, Notification, AI Orchestration, Publishing,
  Distribution, and Phase 7 Step 16 behavior must be preserved.

## Phase II Module 17 - Configuration, Feature Flags and Platform Administration Module Architecture

The official Configuration, Feature Flags and Platform Administration module
implementation specification begins in
`docs/modules/configuration/configuration-overview.md`.

The Configuration, Feature Flags and Platform Administration Module provides
the centralized infrastructure for global configuration, environment-specific
configuration, organization and project configuration, Feature Flags,
platform administration, service administration, module configuration, AI
parameters, editorial parameters, branding, localization, licensing, and
operational policies.

The supporting Configuration module specification documents are:

1. `docs/modules/configuration/configuration-overview.md`.
2. `docs/modules/configuration/domain-model.md`.
3. `docs/modules/configuration/configuration-service.md`.
4. `docs/modules/configuration/feature-flags.md`.
5. `docs/modules/configuration/environment-management.md`.
6. `docs/modules/configuration/branding.md`.
7. `docs/modules/configuration/localization.md`.
8. `docs/modules/configuration/platform-administration.md`.
9. `docs/modules/configuration/api-contracts.md`.
10. `docs/modules/configuration/events.md`.
11. `docs/modules/configuration/configuration-gap-analysis.md`.
12. `docs/modules/configuration/configuration-migration-plan.md`.

Configuration module rules:

- No component may contain business-critical hardcoded configuration or create
  its own independent administration mechanism for shared platform concerns.
- All modules must obtain shared runtime configuration through Configuration
  Service contracts once the service is implemented.
- Configuration must be scoped, typed, validated, versioned, auditable,
  reversible where safe, and isolated by environment.
- Feature Flags must be managed independently of deployments and evaluated
  server-side for gated backend behavior.
- Feature Flags do not replace IAM, RBAC, Need-to-Know access, subscription,
  policy, or workflow authorization.
- Development, Testing, Staging, and Production must remain isolated by
  configuration, database targets, secrets, policies, and Feature Flag state.
- Branding and localization must be configurable without code changes while
  preserving the official Platform Language, Original Language, Authoring
  Language, and Target Language separation.
- Secrets, tokens, credentials, provider keys, and webhook secrets must be
  stored only through approved secret references and must not be hardcoded,
  logged, indexed, exported, embedded in JSON Master, or exposed in client
  bundles.
- AI may suggest configuration changes, summarize risks, and identify drift,
  but must not activate production-impacting features, change security,
  approve configuration changes, alter secrets, or bypass administrative
  confirmation.
- Existing Enterprise Administration, Workspace, Gateway, Security Governance,
  Policy Engine, AI Governance, Observability, Backup, Search, Integration,
  Publishing, Distribution, and Phase 7 Step 16 behavior must be preserved.

## Phase II Module 18 - Data Governance, Metadata and Master Data Management Module Architecture

The official Data Governance, Metadata and Master Data Management module
implementation specification begins in
`docs/modules/data-governance/data-governance-overview.md`.

The Data Governance, Metadata and Master Data Management Module provides the
centralized infrastructure for coherent platform data and metadata governance,
canonical data models, master data, metadata registry, data catalog, data
dictionary, schema registry, reference data, data classification, data quality,
data lineage, data ownership, data stewardship, data retention, deduplication,
entity resolution, Golden Records, data contracts, and controlled data import
and export governance.

The supporting Data Governance module specification documents are:

1. `docs/modules/data-governance/data-governance-overview.md`.
2. `docs/modules/data-governance/domain-model.md`.
3. `docs/modules/data-governance/canonical-data-model.md`.
4. `docs/modules/data-governance/master-data-management.md`.
5. `docs/modules/data-governance/metadata-registry.md`.
6. `docs/modules/data-governance/data-catalog.md`.
7. `docs/modules/data-governance/data-dictionary.md`.
8. `docs/modules/data-governance/schema-registry.md`.
9. `docs/modules/data-governance/data-contracts.md`.
10. `docs/modules/data-governance/reference-data.md`.
11. `docs/modules/data-governance/data-quality.md`.
12. `docs/modules/data-governance/entity-resolution.md`.
13. `docs/modules/data-governance/golden-record.md`.
14. `docs/modules/data-governance/data-lineage.md`.
15. `docs/modules/data-governance/data-classification.md`.
16. `docs/modules/data-governance/data-retention.md`.
17. `docs/modules/data-governance/api-contracts.md`.
18. `docs/modules/data-governance/events.md`.
19. `docs/modules/data-governance/data-governance-gap-analysis.md`.
20. `docs/modules/data-governance/data-governance-migration-plan.md`.

Data Governance module rules:

- Shared entities must have canonical definitions, stable identifiers,
  authoritative source references, owners, stewards, validation rules,
  classification, history, provenance, and explicit relationships.
- Existing identifiers must be preserved through explicit mapping records;
  migrations must not silently replace or discard legacy identifiers.
- Functional modules remain authoritative for their own business behavior, but
  shared entity definitions must align with the canonical model.
- IAM remains authoritative for identity and access. Rights and Provenance
  remains authoritative for legal rights behavior. Workflow remains
  authoritative for transitions and approvals. Publishing remains authoritative
  for release gates.
- Schemas, metadata definitions, data contracts, reference data, and generated
  artifact contracts must be versioned and compatibility-tested.
- AI-generated or AI-extracted data must not become validated master data
  without the applicable human approval and governance policy.
- Entity Resolution and Golden Records must preserve all source records,
  conflicting values, provenance, approvals, and history.
- Derived PDF, EPUB, HTML, XML, print-ready PDF, audiobook, transcript,
  subtitle, video, accessibility, and distribution outputs must retain
  verifiable references to the exact master record and master version used to
  generate them.
- Classification, retention, legal hold, audit, backup, observability, IAM,
  and Need-to-Know policies must apply consistently to master data and
  metadata operations.
- No destructive schema changes, irreversible data migrations, or massive
  reconciliation may begin during the baseline audit.
- Existing JSON Master v1.0, Domain Model, Logical Data Model, Physical
  Database Model, Library, Translation, Rights, Publishing, Export, Search,
  Integration, Configuration, Backup, Observability, IAM, and Phase 7 Step 16
  behavior must be preserved.

## Phase II Module 19 - Accessibility, Localization and Inclusive Experience Module Architecture

The official Accessibility, Localization and Inclusive Experience module
implementation specification begins in
`docs/modules/accessibility/accessibility-overview.md`.

The Accessibility, Localization and Inclusive Experience Module provides the
centralized infrastructure for UI accessibility, document accessibility, EPUB
accessibility, PDF accessibility, audio accessibility, video accessibility,
localization, internationalization, multilingual UI, caption management,
subtitle management, transcript management, audio description, alternative
text, screen reader support, keyboard navigation, inclusive UX, and
accessibility validation.

The supporting Accessibility module specification documents are:

1. `docs/modules/accessibility/accessibility-overview.md`.
2. `docs/modules/accessibility/domain-model.md`.
3. `docs/modules/accessibility/ui-accessibility.md`.
4. `docs/modules/accessibility/document-accessibility.md`.
5. `docs/modules/accessibility/audio-video-accessibility.md`.
6. `docs/modules/accessibility/localization.md`.
7. `docs/modules/accessibility/internationalization.md`.
8. `docs/modules/accessibility/accessibility-profiles.md`.
9. `docs/modules/accessibility/api-contracts.md`.
10. `docs/modules/accessibility/events.md`.
11. `docs/modules/accessibility/accessibility-gap-analysis.md`.
12. `docs/modules/accessibility/accessibility-migration-plan.md`.

Accessibility module rules:

- Accessibility and localization are native platform capabilities, not
  optional extensions.
- UI, documents, publications, audio, video, multimedia, exports, public
  catalog surfaces, and generated artifacts must preserve accessibility
  metadata where applicable.
- The platform targets WCAG 2.2 AA for web UI, EPUB Accessibility for EPUB
  outputs, PDF/UA for PDF outputs, WAI-ARIA where semantic HTML is
  insufficient, semantic HTML5, WebVTT, and SRT.
- Platform Language controls UI text only and must not change Original
  Language, Authoring Language, Target Language, manuscript content,
  translation content, captions, transcripts, or imported content.
- Localization resources must be centralized, versioned, reviewable, and
  auditable before they become managed runtime resources.
- Accessibility profiles may adjust presentation and interaction behavior, but
  must not alter source content.
- Caption, subtitle, transcript, audio description, and alternative text
  records must remain linked to source media, localized media versions,
  language/locale metadata, and master records where applicable.
- Media Localization Studio remains the distinct media localization capability
  and must integrate with this module for captions, subtitles, transcripts,
  dubbing, voice-over, localized media, and accessibility metadata without
  duplicating responsibility.
- AI may suggest alt text, captions, transcripts, audio descriptions, and
  accessibility findings, but must not approve compliance, publish, bypass
  workflow, or replace authorized human review.
- Existing frontend i18n, Platform Language behavior, Media Localization,
  Multimedia, Publishing, Export, Library, Search, Configuration, Data
  Governance, IAM, Observability, Backup, and Phase 7 Step 16 behavior must be
  preserved.

## Phase II Module 20 - Analytics, Business Intelligence and Decision Support Module Architecture

The official Analytics, Business Intelligence and Decision Support module
implementation specification begins in
`docs/modules/analytics/analytics-overview.md`.

The Analytics, Business Intelligence and Decision Support Module provides the
centralized infrastructure for operational analytics, editorial analytics,
business intelligence, KPI management, executive dashboards, AI analytics,
workflow analytics, publishing analytics, financial analytics, usage
analytics, performance analytics, predictive analytics, report building, data
warehouse integration, OLAP queries, and decision support.

The supporting Analytics module specification documents are:

1. `docs/modules/analytics/analytics-overview.md`.
2. `docs/modules/analytics/domain-model.md`.
3. `docs/modules/analytics/kpi-management.md`.
4. `docs/modules/analytics/report-engine.md`.
5. `docs/modules/analytics/dashboard-engine.md`.
6. `docs/modules/analytics/decision-support.md`.
7. `docs/modules/analytics/data-warehouse.md`.
8. `docs/modules/analytics/api-contracts.md`.
9. `docs/modules/analytics/events.md`.
10. `docs/modules/analytics/analytics-gap-analysis.md`.
11. `docs/modules/analytics/analytics-migration-plan.md`.

Analytics module rules:

- Analytics is the single platform-wide reporting, BI, KPI, dashboard,
  forecasting, and decision-support boundary.
- Functional modules must not implement isolated reporting or analytics
  authorities.
- All analytics data must come from canonical sources defined by Data
  Governance and Master Data Management.
- KPI definitions must be configurable, versioned, explainable, and auditable.
- Reports must be reproducible, exportable, version-aware, and source-lineage
  aware.
- Dashboards must enforce IAM, Need-to-Know visibility, tenant isolation, and
  privacy by design.
- Decision recommendations are informational and must not modify platform
  data, approve content, publish, grant rights, grant access, or bypass
  workflow.
- Analytics operations must be observable, traceable, exportable where
  authorized, and auditable.
- Existing Observability, Workspace dashboards, Reports Center, QA, Semantic
  Fidelity, Workflow, Publishing, Distribution, Rights, AI Governance, Data
  Governance, IAM, Backup, Configuration, Search, Accessibility, and Phase 7
  Step 16 behavior must be preserved.

## Phase II Module 21 - AI Governance, Model Management and Responsible AI Module Architecture

The official AI Governance, Model Management and Responsible AI module
implementation specification begins in
`docs/modules/ai-governance/ai-governance-overview.md`.

The AI Governance, Model Management and Responsible AI Module provides the
centralized framework for model registry, prompt registry, AI agent registry,
AI policy management, model lifecycle management, model evaluation,
benchmarking, responsible AI controls, explainability, human oversight, AI
audit, AI risk management, AI provider management, and cost management.

The supporting AI Governance module specification documents are:

1. `docs/modules/ai-governance/ai-governance-overview.md`.
2. `docs/modules/ai-governance/domain-model.md`.
3. `docs/modules/ai-governance/model-registry.md`.
4. `docs/modules/ai-governance/prompt-registry.md`.
5. `docs/modules/ai-governance/agent-registry.md`.
6. `docs/modules/ai-governance/policy-engine.md`.
7. `docs/modules/ai-governance/model-evaluation.md`.
8. `docs/modules/ai-governance/cost-management.md`.
9. `docs/modules/ai-governance/explainability.md`.
10. `docs/modules/ai-governance/api-contracts.md`.
11. `docs/modules/ai-governance/events.md`.
12. `docs/modules/ai-governance/ai-governance-gap-analysis.md`.
13. `docs/modules/ai-governance/ai-governance-migration-plan.md`.

AI Governance module rules:

- AI Governance is the mandatory governance boundary for all AI models,
  prompts, agents, providers, policies, evaluations, benchmarks,
  explainability records, costs, risks, approvals, and audit.
- No functional module may invoke unmanaged AI models, call unmanaged AI
  providers, or maintain independent production prompt repositories.
- AI Orchestration remains the execution and coordination boundary; AI
  Governance owns the registries, policies, approvals, lifecycle records,
  evaluations, benchmarks, cost controls, and responsible AI evidence that AI
  Orchestration must consult.
- Every AI model must be registered, evaluated, policy-checked, and approved
  where required before use.
- Every production prompt must be centrally registered, versioned, evaluated,
  and auditable.
- Every AI agent must have documented mission, responsibilities, limits,
  authority, assigned models, assigned prompts, workflows, permissions,
  policies, and monitoring profile.
- Every AI output used in platform workflows must preserve explainability
  metadata including model, model version, prompt version, parameters, sources,
  provider, timestamp, user, workflow, cost, and token usage.
- AI policies must govern allowed and forbidden models, cost limits, token
  limits, data classification, required approvals, autonomy level, provider
  usage, and prompt/response retention.
- AI may recommend, explain, evaluate, classify, summarize, and generate
  drafts when authorized, but it must not publish, approve, grant rights,
  grant access, modify security, change governance, bypass workflow, approve
  its own budget increase, or hide audit history.
- Existing AI Governance runtime APIs, AI Orchestration, Marketplace,
  Observability, Analytics, IAM, Policy Engine, Configuration, Integration
  Gateway, and Phase 7 Step 20 behavior must be preserved.

## Phase II Module 22 - DevSecOps, CI/CD, Release and Platform Operations Module Architecture

The official DevSecOps, CI/CD, Release and Platform Operations module
implementation specification begins in
`docs/modules/devsecops/devsecops-overview.md`.

The DevSecOps, CI/CD, Release and Platform Operations Module provides the
centralized framework for source control, branch strategy, CI/CD pipelines,
build automation, release management, environment promotion, Infrastructure as
Code, container management, Kubernetes operations readiness, secret
management, DevSecOps controls, artifact registry governance, deployment
automation, rollback management, patch management, operational runbooks, and
platform operations.

The supporting DevSecOps module specification documents are:

1. `docs/modules/devsecops/devsecops-overview.md`.
2. `docs/modules/devsecops/domain-model.md`.
3. `docs/modules/devsecops/source-control.md`.
4. `docs/modules/devsecops/ci-pipelines.md`.
5. `docs/modules/devsecops/cd-pipelines.md`.
6. `docs/modules/devsecops/release-management.md`.
7. `docs/modules/devsecops/infrastructure-as-code.md`.
8. `docs/modules/devsecops/secret-management.md`.
9. `docs/modules/devsecops/platform-operations.md`.
10. `docs/modules/devsecops/api-contracts.md`.
11. `docs/modules/devsecops/events.md`.
12. `docs/modules/devsecops/devsecops-gap-analysis.md`.
13. `docs/modules/devsecops/devsecops-migration-plan.md`.

DevSecOps module rules:

- DevSecOps is the mandatory platform boundary for source control, CI/CD,
  release, deployment, rollback, infrastructure, secrets, artifacts,
  operational runbooks, and platform operations.
- No service may be implemented, released, deployed, or operated outside the
  approved DevSecOps process.
- All builds must be automated, reproducible, traceable to source commits,
  and validated through official CI.
- All deployments must be versioned, environment-scoped, auditable,
  rollback-capable, and promoted only after configured validation and
  approvals.
- Infrastructure must be managed as code where practical; unmanaged manual
  production changes are prohibited outside approved emergency procedure.
- Secrets must be centrally governed and must not be committed, logged,
  embedded in images, exposed in client bundles, or exported through project
  data.
- Artifacts must be immutable, versioned, checksummed, and traceable to
  commits, dependency state, build number, security status, and deployment.
- Existing CI, staging deployment, staging operations, Infrastructure Pack,
  backup/restore, rollback, monitoring, Chapter 13 DevOps documentation, and
  Phase 7 Step 21 behavior must be preserved.

## Phase II Module 23 - Quality Assurance, Testing and Validation Module Architecture

The official Quality Assurance, Testing and Validation module implementation
specification begins in
`docs/modules/quality-assurance/qa-overview.md`.

The Quality Assurance, Testing and Validation Module provides the centralized
framework for quality assurance, test management, test planning, test
execution, test automation, manual validation, unit testing, integration
testing, contract testing, API testing, end-to-end testing, performance
testing, load testing, stress testing, security testing, accessibility
testing, AI validation, regression testing, and release validation.

The supporting Quality Assurance module specification documents are:

1. `docs/modules/quality-assurance/qa-overview.md`.
2. `docs/modules/quality-assurance/domain-model.md`.
3. `docs/modules/quality-assurance/test-management.md`.
4. `docs/modules/quality-assurance/test-automation.md`.
5. `docs/modules/quality-assurance/quality-gates.md`.
6. `docs/modules/quality-assurance/performance-testing.md`.
7. `docs/modules/quality-assurance/security-testing.md`.
8. `docs/modules/quality-assurance/accessibility-testing.md`.
9. `docs/modules/quality-assurance/ai-validation.md`.
10. `docs/modules/quality-assurance/api-contracts.md`.
11. `docs/modules/quality-assurance/events.md`.
12. `docs/modules/quality-assurance/qa-gap-analysis.md`.
13. `docs/modules/quality-assurance/qa-migration-plan.md`.

Quality Assurance module rules:

- Quality Assurance is the mandatory validation boundary for tests, manual
  evidence, coverage, quality gates, defects, regression, AI validation,
  accessibility validation, security validation, performance validation, and
  release validation.
- No software component, API, AI agent, editorial workflow, publication
  output, infrastructure change, or operational process may be promoted
  without the required validation evidence.
- Automated tests must be integrated with CI/CD where practical.
- Manual validation must produce auditable evidence when automation is not
  sufficient.
- Quality gates must be configurable, mandatory, auditable, and connected to
  release approval.
- Critical vulnerabilities, failed mandatory tests, failed AI validation,
  failed accessibility validation, and unmet minimum coverage thresholds block
  promotion.
- Every requirement should be traceable to test cases, executions, evidence,
  defects when applicable, and release decisions.
- Existing API, Web, runtime database, backup, shared package, staging,
  Infrastructure Pack, DevSecOps, Quality, Chapter 14, and Phase 7 Step 22
  validation behavior must be preserved.

## Phase II Module 24 - Enterprise Architecture, Portfolio and Strategic Governance Module Architecture

The official Enterprise Architecture, Portfolio and Strategic Governance module
implementation specification begins in
`docs/modules/enterprise-architecture/architecture-overview.md`.

The Enterprise Architecture, Portfolio and Strategic Governance Module provides
the centralized framework for enterprise architecture, architecture governance,
product portfolio management, capability management, business capability
mapping, strategic roadmap, Architecture Decision Records, technical
standards, technology lifecycle, platform governance, architectural
compliance, domain ownership, Architecture Review Board, strategic planning,
technical debt governance, and innovation governance.

The supporting Enterprise Architecture module specification documents are:

1. `docs/modules/enterprise-architecture/architecture-overview.md`.
2. `docs/modules/enterprise-architecture/domain-model.md`.
3. `docs/modules/enterprise-architecture/capability-catalog.md`.
4. `docs/modules/enterprise-architecture/architecture-decision-records.md`.
5. `docs/modules/enterprise-architecture/technology-standards.md`.
6. `docs/modules/enterprise-architecture/technology-lifecycle.md`.
7. `docs/modules/enterprise-architecture/technical-debt-registry.md`.
8. `docs/modules/enterprise-architecture/strategic-roadmap.md`.
9. `docs/modules/enterprise-architecture/api-contracts.md`.
10. `docs/modules/enterprise-architecture/events.md`.
11. `docs/modules/enterprise-architecture/architecture-gap-analysis.md`.
12. `docs/modules/enterprise-architecture/architecture-migration-plan.md`.

Enterprise Architecture module rules:

- Enterprise Architecture is the mandatory governance boundary for business,
  application, data, integration, security, infrastructure, AI, operations,
  quality, and platform evolution architecture.
- All major architecture decisions must be documented through Architecture
  Decision Records.
- All capabilities must be cataloged with ownership, maturity, priority,
  dependencies, and lifecycle status.
- Technology standards must be centralized, versioned, lifecycle-governed,
  and auditable.
- New technologies must not be adopted without architecture approval.
- Strategic roadmap changes must preserve dependency, risk, milestone,
  budget, success indicator, and audit metadata.
- Technical debt must be registered, prioritized, assigned, and linked to
  remediation plans.
- Architecture deviations require authorized review, approved exception, and
  audit trail.
- Existing Manifest, development conventions, architecture Chapters 0-23,
  SPEC, ROADMAP, AGENTS, DevSecOps, Quality Assurance, IAM, Data Governance,
  AI Governance, and Phase 7 Step 23 behavior must be preserved.

## Phase II Module 25 - Compliance, Legal Governance and Risk Management Module Architecture

The official Compliance, Legal Governance and Risk Management module
implementation specification begins in
`docs/modules/compliance/compliance-overview.md`.

The Compliance, Legal Governance and Risk Management Module provides the
centralized framework for compliance management, regulatory compliance,
internal policies, legal governance, enterprise risk management, control
framework, privacy governance, consent management, records management,
retention policies, legal hold, compliance assessments, internal audits,
external audits, exception management, and corrective actions.

The supporting Compliance module specification documents are:

1. `docs/modules/compliance/compliance-overview.md`.
2. `docs/modules/compliance/domain-model.md`.
3. `docs/modules/compliance/policy-registry.md`.
4. `docs/modules/compliance/risk-registry.md`.
5. `docs/modules/compliance/control-framework.md`.
6. `docs/modules/compliance/privacy-governance.md`.
7. `docs/modules/compliance/legal-hold.md`.
8. `docs/modules/compliance/audit-management.md`.
9. `docs/modules/compliance/api-contracts.md`.
10. `docs/modules/compliance/events.md`.
11. `docs/modules/compliance/compliance-gap-analysis.md`.
12. `docs/modules/compliance/compliance-migration-plan.md`.

Compliance module rules:

- Compliance is the mandatory governance boundary for policies, regulatory
  obligations, legal governance, enterprise risks, internal controls, privacy,
  consent, retention, legal hold, audits, exceptions, and corrective actions.
- Compliance and risk management must not be implemented as isolated,
  module-local authorities outside this centralized framework.
- All policies must be versioned, owned, reviewed, approved, lifecycle-managed,
  and auditable.
- All risks must have owners, score, status, linked controls, and mitigation
  plans where required.
- All controls must be traceable to policies, risks, evidence, owners,
  frequency, execution mode, and effectiveness status.
- Exceptions must be documented, approved, time-limited, monitored, and
  audited.
- Legal hold overrides retention deletion but does not grant unauthorized
  access.
- Compliance assessments, audit findings, and corrective actions must preserve
  evidence and be tracked to closure.
- AI may summarize policies, detect risks, suggest controls, and recommend
  remediation, but it must not approve policies, accept risks, approve
  exceptions, release legal holds, close audit findings, or bypass compliance.
- Existing Manifest, development conventions, architecture Chapters 0-24,
  SPEC, ROADMAP, AGENTS, IAM, Data Governance, AI Governance, DevSecOps,
  Quality Assurance, Enterprise Architecture, Rights and Provenance, Backup,
  and Phase 7 Step 24 behavior must be preserved.

With Module 25, the fundamental Phase II architecture covers the full
enterprise chain: editorial capabilities, infrastructure, AI, operations,
governance, quality, strategy, and compliance. Future modules should be
treated as specialized extensions unless explicitly approved as new
fundamental architecture.

## Architecture Freeze & Governance Requirements

Status: Frozen for phased MVP implementation.

The project architecture is now frozen. New major features must not be added
unless explicitly approved through the architecture and roadmap process.
Implementation must proceed in phases and remain aligned with `SPEC.md`,
`AGENTS.md`, and `ROADMAP.md`.

### Official Development Conventions

The platform follows the official development conventions documented in
`docs/DEVELOPMENT_CONVENTIONS.md`.

Canonical rules:

- Internal implementation language is English only.
- User-facing UI text must be loaded from the localization system.
- Mixed-language UI is not allowed.
- First-stage platform UI languages are Romanian, English, Spanish, French,
  Portuguese, Italian, and German, with Romanian as the primary platform
  language.
- Standard UI terminology follows international localization standards first,
  then official Microsoft Windows and Apple macOS translations for general
  interface terms.
- Platform-specific terms are managed through the platform terminology
  dictionary and must not duplicate standard UI terminology.
- Platform Language affects UI text only and must remain separate from
  Original Language, Authoring Language, Target Language, manuscript content,
  and translation content.
- The platform uses one authentication, session, role, and permission model
  across `laboratoreditorial.com`, `app.laboratoreditorial.com`, and
  `api.laboratoreditorial.com`.

These conventions may be changed only by explicit project owner approval.
When implementation choices are ambiguous, these conventions take precedence.

### MVP Scope

The MVP is limited to:

- Auth.
- Documents.
- Segment Editor.
- Basic Translation Memory.
- Basic QA.
- Basic TCPS/TLCG.
- Export.

### MVP Stabilization Requirements

Current implementation priorities:

1. Translation Memory.
2. Terminology & Glossary System.
3. QA Engine.
4. Semantic Fidelity Engine.
5. Workflow Engine.

End-to-end MVP workflow:

Authentication -> Project -> Document -> Segments -> Translation -> Translation
Memory -> Terminology Validation -> QA Validation -> Semantic Fidelity
Validation -> Review Workflow -> Versioning -> Audit -> Export.

Success criteria:

- End-to-end workflow is operational.
- No critical architecture changes are introduced.
- No new major features are introduced.
- Existing modules are integrated and tested together.

### Platform Support Requirements

The platform must support the approved MVP workflow across the following
platforms:

- Windows.
- macOS.
- Linux.
- Android.
- iOS.
- iPadOS.

Supported form factors:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

UI requirements:

- Responsive UI design.
- Touch support.
- Mobile navigation.
- Mobile-optimized layouts.
- Tablet-optimized editor layouts.
- Desktop keyboard shortcuts.

Application requirements:

- PWA support.
- Installable application support and application-like experience.
- Offline-first capabilities where already supported by the approved
  architecture.

These requirements define delivery and compatibility expectations for the
approved platform. They do not introduce new modules, new MVP scope, or future
feature expansion.

### JSON Master Format Governance

JSON Master Format is the canonical structure for:

- Projects.
- Language-specific manuscripts.
- Documents.
- Segments.
- Metadata.
- Terminology.
- QA.
- Workflow.
- Versions.
- Future media localization.
- Future digital magazine publications and reading experiences.

All platform data that must survive export, backup, audit, migration, or
publishing must be representable in JSON Master Format.

### Manuscript Language Organization

A book or project may contain multiple language-specific manuscripts linked to
the same original work.

Example:

- Book project: one original work.
- Original manuscript: French.
- Romanian manuscript.
- Spanish manuscript.

Rules:

- Each language manuscript must have a stable `manuscriptId`.
- Each manuscript must declare its `language`.
- A translated manuscript must store `sourceManuscriptId` pointing to the
  manuscript from which it was translated.
- The original manuscript must not require `sourceManuscriptId`.
- Each manuscript must include its own `title`, `chapters`, `segments`,
  translation status, workflow status, and language-specific export artifacts.
- Each language manuscript must be exportable separately.
- All language manuscripts must remain linked to the same original work and
  project.
- Translation alignment between source and target segments must be preserved
  through stable source segment references or alignment keys.
- Export artifacts must be tracked per manuscript language.
- This requirement is documentation-only until explicitly scheduled for
  implementation.

### Magazine Platform Vision

Status: Future platform vision. Documentation only. Do not implement now.

The platform reserves a future magazine publishing and reading experience for
multilingual digital publications. This vision extends the publishing layer
after beta without changing the current MVP implementation scope.

#### Original Language Flexibility

Original language must be configurable per publication.

Examples:

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

#### M1 - Digital Magazine MVP

Status: `PLANNED`.

Priority: `POST-BETA`.

Features:

- Flipbook reader.
- Interactive table of contents.
- Fullscreen mode.
- Zoom controls.
- Full-text search.
- Responsive desktop, tablet, and mobile layout.
- Multi-language reading.
- Language switcher.
- Audio per article.
- PDF export.
- HTML export.
- Link to original article or manuscript.
- Accessibility baseline.

#### M2 - Advanced Reading

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

#### M3 - Interactive Magazine

Status: `PLANNED`.

Priority: `FUTURE`.

Features:

- Text/audio synchronization.
- Embedded video.
- Image galleries.
- Podcasts.
- Interactive editorial content.
- Rich media articles.

#### M4 - Enterprise Magazine

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

#### Non-Implementation Rule

Magazine Platform Vision is specification-only until explicitly scheduled. No
application code, UI creation, database schema changes, API changes, migrations,
AI endpoints, or infrastructure changes are authorized by this section.

### Phase 2 Planning Foundation - Editorial Intelligence & Production Agents

Status: Planned post-MVP architecture foundation. Documentation and
architecture scaffolding only. Do not implement now.

Phase 2 reserves the next layer of specialized editorial agents for
lexicographic intelligence, production layout, visual creation, audio
narration, platform coordination, and AI orchestration. These agents extend the
approved platform direction after the operational MVP and closed beta are
stable.

#### Governance Rules

- Phase 2 does not change current Phase 1 behavior.
- Phase 2 does not authorize runtime API changes, database schema changes,
  migrations, UI work, staging Docker changes, or modifications to Auth,
  Projects, Documents, Segments, Translations, QA, Semantic Fidelity, Workflow,
  or Export logic.
- AI may suggest, automate drafts, prepare artifacts, and coordinate work, but
  authorized human roles keep final approval authority.
- Every Phase 2 agent action must be auditable, including input references,
  output references, dependencies, execution order, cost metadata when
  available, approval status, rejection status, and artifact links.
- Phase 2 outputs must remain traceable through JSON Master Format.
- Validated platform glossary decisions remain authoritative over documented
  editorial decisions, dictionaries, and AI suggestions according to glossary
  priority rules.

#### Lexicographic Intelligence Agent

Purpose: provide structured dictionary and lexical-source intelligence for
terminology, translation decisions, semantic fidelity, QA, and editorial review.

Planned source coverage:

- Dictionary sources.
- Bilingual dictionaries.
- Monolingual dictionaries.
- DEX, DOOM, and DLR.
- Spanish-Romanian and Romanian-Spanish dictionary by Alexandru Calciu and
  Zaira Samharadze.
- Specialized spiritist dictionaries.
- Dictionary entries, lexical senses, examples, sources, and citations.

Glossary priority rules:

1. Validated platform glossary.
2. Documented editorial decision.
3. Specialized dictionary.
4. Academic dictionary.
5. AI suggestion.

AI suggestions cannot become source authority or validated terminology without
authorized human approval.

### Integrated Linguistic Knowledge Base

Status: implemented as an extension of the existing Lexicographic Intelligence,
Terminology, Semantic Fidelity, AI Governance, Audit, and Translation
infrastructure. It is not a new enterprise module.

Purpose: provide a project-level linguistic knowledge base used by Translation,
Review, Documentation, Terminology & Lexicography, Semantic Fidelity, and
Quality agents.

Supported resource categories:

- Monolingual explanatory dictionaries.
- Orthographic, orthoepic, and morphological dictionaries.
- Official grammar and punctuation rules.
- Bilingual dictionaries.
- Idioms and phraseological expressions.
- Specialized glossaries.
- Terminology databases.
- Validated editorial guides.
- Linguistic corpora and usage examples.

Each linguistic resource must preserve:

- Language.
- Language pair when bilingual.
- Title.
- Publisher or issuing institution.
- Edition.
- Publication year.
- Version.
- Source URL or imported document reference.
- License status.
- Copyright holder.
- Redistribution permission.
- Authority level.
- Domain.
- Effective date.
- Last verification date.
- Enabled status.

Content access modes:

1. `INTEGRATED_CONTENT`: allowed only when the license permits ingestion and
   internal use. Searchable entries may include headword, definition, senses,
   grammatical category, inflection, pronunciation, usage labels, examples,
   idioms, synonyms, antonyms, etymology, bilingual equivalents, source, and
   exact edition.
2. `EXTERNAL_CONTROLLED_ACCESS`: used for resources that cannot be copied or
   redistributed. The platform stores metadata, authorized API integration,
   official link, permitted excerpts, access restrictions, and license notes
   only.

Rules:

- The platform must never ingest full copyrighted dictionary content without
  documented authorization.
- Romanian linguistic sources such as DOOM editions, DEX-type explanatory
  resources, official grammar, orthographic and punctuation rules, bilingual
  dictionaries, phraseological dictionaries, and specialized dictionaries are
  configurable metadata sources. Their copyrighted content is not hardcoded.
- Translation Agent queries source-language and target-language resources,
  checks idioms and contextual meanings, compares dictionary senses, cites exact
  source and edition, and sends unresolved terms to Terminology & Lexicography.
- Terminology & Lexicography Subagent indexes dictionary entries, manages
  approved terminology, detects source conflicts, distinguishes normative,
  descriptive, and specialized sources, proposes preferred terms, and records
  provenance.
- Semantic Fidelity Subagent verifies selected dictionary senses against source
  context, detects literal but semantically wrong translations, and checks
  idioms or figurative expressions.
- Review Agent proposes spelling, grammar, inflection, register, and usage
  corrections against approved resources without imposing them.
- Documentation Agent adds and verifies linguistic sources and editions.
- Rights & Provenance Agent validates licenses, permissions, and redistribution
  rights.
- Quality Agent reports missing, outdated, disabled, or unauthorized linguistic
  resources and does not correct project content.

Source authority levels:

1. `OFFICIAL_NORMATIVE`.
2. `ACADEMIC`.
3. `VALIDATED_SPECIALIZED`.
4. `EDITORIAL_GUIDE`.
5. `DESCRIPTIVE`.
6. `INFORMATIVE`.

Conflict rules:

- Normative sources take priority for orthography and grammar.
- Validated specialized sources may take priority for domain terminology.
- All conflicts must be reported for authorized human review.
- No silent replacement is allowed.

Search requirements:

- Search by headword, phrase, idiom, language, language pair, domain,
  grammatical category, source, edition, and authority level.
- Support exact, normalized, fuzzy, and morphological search modes.

Advanced Linguistic Resources & Translation Memory requirements:

- This capability extends the existing Linguistic Knowledge Base, Translation,
  Terminology & Lexicography, Semantic Fidelity, Review, AI Governance, and
  Audit systems. It is not a new enterprise module.
- Each project may define a configurable source consultation priority. The
  default order is:
  1. Official normative source.
  2. Project glossary.
  3. Specialized glossary.
  4. Translation Memory.
  5. Bilingual dictionary.
  6. Explanatory dictionary.
  7. Corpus/examples.
- Source priority must support ordered, drag-and-drop-ready configuration and
  must be auditable when changed.
- Integrated Translation Memory stores only validated translations as reusable
  proposal evidence. Each entry preserves source segment, translated segment,
  language pair, project, domain, context, author, reviewer, approval date,
  confidence, and version.
- Translation Memory supports exact match, fuzzy match, and context match.
- Translation Memory must never replace text automatically. It always proposes
  and authorized humans retain final authority.
- Glossaries have three levels: Project Glossary, Platform Glossary, and
  Personal Glossary.
- Glossary priority is Project > Platform > Personal. Personal glossary entries
  are optional suggestions only and must not become authoritative over project
  or platform terminology.
- Conflicts between glossary levels require human review and audit.
- Every linguistic proposal must expose confidence score, consulted sources,
  glossary used, Translation Memory match, terminology status, semantic
  validation, and an explanation so the user understands why it exists.
- Audit must cover glossary created, glossary updated, glossary conflict,
  Translation Memory entry added, Translation Memory reused, source priority
  changed, and confidence recalculated.

#### Layout & Editorial Production Agent

Purpose: reserve professional editorial production support for print and
digital outputs.

Planned capabilities:

- Book layout.
- Magazine layout.
- Print finishing.
- PDF/X, EPUB, MOBI, and flipbook production guidance.
- European formats by default.
- American formats as optional production profiles.
- Bleed, crop marks, margins, widows and orphans, and typography checks.

Layout production must remain downstream from approved manuscripts, workflow
state, export readiness, terminology governance, QA, and semantic fidelity.

#### AI Video & Visual Creation Agent

Purpose: reserve AI-assisted visual production for editorial assets and future
media localization.

Planned capabilities:

- Image generation.
- Cover generation.
- Illustration generation.
- Image editing.
- Text-to-video.
- Image-to-video.
- Trailer generation.
- Subtitle and visual localization.

Generated or edited visual assets must preserve source links, rights metadata,
human approval status, and audit references.

#### Audio Narration Agent

Purpose: reserve multilingual narration and audiobook production support.

Planned capabilities:

- Audiobook generation by chapters.
- Text-to-speech.
- Voice profiles.
- MP3, WAV, and FLAC export.
- Multilingual narration.

Narration outputs must remain linked to source manuscripts, chapters, segments,
language versions, voice profiles, approval state, and audit events.

#### Platform Engineering, Optimization & Coordination Agent

Purpose: reserve an operational planning agent for platform maintenance and
release discipline without granting it uncontrolled runtime authority.

Planned responsibilities:

- Software update and upgrade planning.
- Dependency monitoring.
- Docker optimization.
- Backup and restore coordination.
- Auto-healing planning.
- Performance optimization.
- AI cost coordination.
- System maintenance audit.

This agent may prepare recommendations and plans, but implementation remains
subject to authorized engineering review and the existing governance order.

#### AI Orchestrator

Purpose: coordinate approved agents once Phase 2 implementation is explicitly
scheduled.

Planned responsibilities:

- Coordinate all Phase 2 agents.
- Determine execution order.
- Track dependencies.
- Control cost and resource usage.
- Preserve audit trails.
- Enforce human approval gates.

The AI Orchestrator must not bypass security, tenant isolation, RBAC,
terminology governance, workflow gates, source authority requirements, or human
final approval.

### Translation Rules Versioning & Impact Analysis

Every translation rule must be versioned and auditable.

Rules:

- Translation rules cannot be overwritten.
- Every rule change must create a new rule version.
- Previous rule versions must remain auditable.
- Each manuscript must record the translation rule version or versions used.
- Each export artifact must record the translation rule version or versions used
  at export time.
- The system must be able to identify publications, manuscripts, and exports
  translated under older rule versions.

Before approving a rule change, the system must calculate an impact report
covering:

- Affected books.
- Affected manuscripts.
- Affected languages.
- Affected chapters.
- Affected segments.
- Affected terminology entries.
- Affected exports.

Change approval rules:

- Rule changes affecting existing publications must require authorized human
  approval.
- Rule change audit records must store the previous rule version, new rule
  version, approver, date/time, and impact report.
- Impact analysis and approval records must be preserved in JSON Master Format.
- This requirement is documentation-only until explicitly scheduled for
  implementation.

### Rule Source Authority

Every translation rule, terminology rule, editorial rule, semantic fidelity
rule, and exception must have at least one documented authority source.

Required source authority fields:

- `ruleId`.
- `ruleVersion`.
- `sourceType`.
- `sourceReference`.
- `sourceDetails`.
- `sourceLanguage`.
- `sourcePublicationYear`.
- `sourcePageOrSection`.
- `approvalAuthority`.
- `approvalDate`.
- `authorityConfidenceLevel`.

Allowed source types:

- `Original Author`.
- `Original Publication`.
- `Editorial Board Decision`.
- `Approved Editorial Glossary`.
- `Approved Specialized Glossary`.
- `Academic Reference`.
- `Historical Reference`.
- `Regulatory Reference`.
- `Internal Editorial Standard`.

Rules:

- A rule cannot become `VALIDATED` without a source authority.
- Exceptions must also contain a source authority.
- Rule version history must preserve source authority references.
- Impact analysis reports must include affected source authorities.
- AI-generated rules cannot be treated as source authority.
- Source authority references must be auditable and immutable.

Example:

- Rule: `Esprit -> Spirit`.
- Source type: `Original Author`.
- Source reference: `Allan Kardec`.
- Source details: `Le Livre des Esprits, 1860 edition`.
- Source language: `French`.
- Source page or section: `Chapter I`.

This requirement is documentation-only until explicitly scheduled for
implementation.

### Authority Confidence Levels

Authority confidence levels allow the platform to rank source authorities when
translation rules, terminology rules, editorial rules, semantic fidelity rules,
or exceptions have conflicting sources.

Levels:

- `PRIMARY_AUTHORITY`: original author, original publication, canonical edition,
  or validated primary source.
- `SECONDARY_AUTHORITY`: academic reference, recognized dictionary, or
  specialized published reference.
- `EDITORIAL_AUTHORITY`: editorial board decision, approved editorial glossary,
  or approved internal standard.
- `TEMPORARY_AUTHORITY`: provisional editorial decision, unresolved source
  conflict, or temporary beta rule.

Priority rules:

- `PRIMARY_AUTHORITY` has priority over `SECONDARY_AUTHORITY`.
- `SECONDARY_AUTHORITY` has priority over `EDITORIAL_AUTHORITY`.
- `EDITORIAL_AUTHORITY` has priority over `TEMPORARY_AUTHORITY`.
- `TEMPORARY_AUTHORITY` cannot validate a permanent rule.
- Conflicting authorities must be flagged for authorized human review.
- AI output cannot be a source authority or authority confidence level.
- Authority confidence must be auditable and immutable per rule version.
- Impact Analysis reports must include authority confidence levels.

This requirement is documentation-only until explicitly scheduled for
implementation.

### Data Governance & GDPR

The platform must govern:

- Personal data.
- Copyright.
- Corpus licensing.
- Dictionary sources.
- Auditability.
- Compliance.

Required rules:

- Personal data must be stored only when necessary for platform operation,
  workflow accountability, audit, security, or legal compliance.
- Copyright and licensing status must be tracked for documents, corpora,
  dictionaries, glossaries, and external sources.
- Corpus and dictionary usage must preserve source attribution.
- Audit logs must support compliance review without exposing unnecessary
  personal data.
- Export and deletion workflows must respect applicable data protection duties.

### Multi-Tenant Model

The platform must support isolated access for:

- Organizations.
- Teams.
- Projects.
- Users.
- Roles.

Rules:

- Organization boundaries must be enforced at data, API, workflow, and audit
  levels.
- Users may belong to multiple organizations or teams, but access must be scoped
  explicitly.
- Projects, documents, Translation Memory, glossaries, QA results, workflow
  states, audit logs, and exports must not leak across tenants.

### Human Final Authority

AI may suggest and the system may validate, but final editorial decisions belong
to authorized humans.

Rules:

- AI cannot approve final translations.
- AI cannot grant certifications.
- AI cannot override terminology governance.
- AI cannot publish documents or localized media.
- Authorized human reviewers remain responsible for final editorial approval.

### Terminology Governance v2

Status: Approved MVP stabilization enhancement for the existing Terminology &
Glossary System. This is not a new major module.

Purpose: prevent incorrect, invented, misspelled, or non-diacritic terms from
contaminating terminology, Translation Memory, QA, Semantic Fidelity, workflow
approval, exports, and future translations.

Rules:

- AI must never automatically create `VALIDATED` terminology.
- New terminology entries must start as `PROPOSED`.
- Terms not found in approved sources must become `UNDER_REVIEW`.
- Romanian terms must pass diacritics and orthographic validation.
- Terms with missing or incorrect Romanian diacritics must be flagged as High
  severity terminology issues.
- Rejected terms must be treated as Critical terminology issues.
- Terminology Quality Score must be calculated from:
  - spelling correctness.
  - diacritics correctness.
  - approved source presence.
  - glossary presence.
  - reference sources.
  - editorial approval.
  - historical usage.
- Terminology Quality Score levels:
  - `90-100 TRUSTED`.
  - `75-89 ACCEPTABLE`.
  - `50-74 REVIEW_REQUIRED`.
  - `0-49 REJECTED`.
- Only authorized human users may validate, suspend, archive, or reject
  terminology.
- Documents with rejected terms or unresolved High/Critical terminology issues
  cannot move to `READY_FOR_EXPORT` or `EXPORTED`.
- Every terminology governance action must be audited.

Authority rules:

- `VALIDATED` terminology remains authoritative over Translation Memory and AI
  suggestions.
- AI suggestions may be evaluated, explained, or proposed, but they cannot
  validate terminology.
- Repeated usage cannot auto-promote a term to `VALIDATED`.
- Human final authority remains mandatory for validation, suspension, archival,
  and rejection.

### Benchmark & Evaluation Protocol

The platform must define and preserve measurement rules for:

- Semantic fidelity.
- Terminology accuracy.
- Fluency.
- QA.
- Semantic risk.

Evaluation outputs must be explainable, auditable, and comparable across
documents, projects, translators, AI suggestions, and benchmark suites.

### Backup, Export & Exit Strategy

The platform must support full export of:

- Projects.
- Translation Memory.
- Glossaries.
- Audit logs.
- Versions.
- JSON Master data.

Exit strategy rules:

- Users and organizations must be able to retrieve their canonical project data.
- Export must preserve IDs, metadata, terminology, QA, workflow, audit, and
  version references.
- Backup and export must not depend on proprietary runtime state alone.

## JSON Master Format v1.0

Status: Official platform specification. Documentation only. Do not implement
code yet.

JSON Master Format v1.0 is the single source of truth for the platform. Every
project, language-specific manuscript, document, segment, translation, term, QA
result, workflow event, audit entry, version snapshot, and future media
localization asset must be representable from this format.

No exported file format can become the source of truth. PDF, EPUB, HTML, print,
subtitle files, dubbed media, voice-over tracks, and localized videos must be
generated from, or traced back to, JSON Master Format.

### Scope

JSON Master Format v1.0 supports:

- Projects and project metadata.
- Language-specific manuscripts for the same original work.
- Documents and document metadata.
- Segment-based source text.
- Translations per target language.
- Versioned translation rules and rule impact reports.
- Terminology and glossary references.
- Translation Memory references and matches.
- QA results and semantic fidelity checks.
- Workflow state, assignments, approvals, and review status.
- Audit logs.
- Version history and immutable snapshots.
- Future basic editorial media localization for transcripts, subtitles,
  voice-over, simple dubbing, audio export, transcript export, and localized
  video exports.
- Future magazine publications, article language variants, article audio assets,
  and links to original articles or manuscripts.
- Future Phase 2 planning fields for dictionaries, layout production, visual
  assets, audio narration tracks, video assets, production profiles, and agent
  executions.

### Core Rules

- `formatVersion` must be `1.0`.
- `project.id`, `manuscripts[].manuscriptId`, `documents[].id`, and
  `segments[].id` must be stable IDs.
- A project may contain one or more language-specific manuscripts.
- Translated manuscripts must preserve `sourceManuscriptId`.
- Segment alignment between source and translated manuscripts must be preserved
  through `sourceSegmentId` or stable alignment keys.
- Each manuscript language must be exportable independently.
- Each manuscript and export artifact must record the translation rule version
  or versions used.
- Translation rules cannot be overwritten; rule changes must create new versions.
- Rule changes affecting existing publications must include impact analysis and
  authorized approval before activation.
- Every rule version and exception must retain at least one non-AI source
  authority reference.
- Source authority references must include immutable authority confidence levels.
- Impact reports must include affected source authorities.
- Impact reports must include affected authority confidence levels.
- Source content must never be overwritten by target translations.
- Each translation must keep language, status, author, timestamps, QA, and
  provenance metadata.
- Segment order must be explicit.
- Terminology decisions must be traceable to glossary, dictionary, corpus,
  editorial decision, or AI suggestion.
- Workflow and audit events must be append-only.
- Version history must preserve immutable snapshots or snapshot references.
- Media localization data is optional in v1.0 but reserved in the schema for
  transcript generation/correction, transcript translation, subtitle,
  multilingual voice-over, simple dubbing, synchronization, audio export,
  transcript export, and localized video export.
- Media localization is a Future/Post-Beta basic editorial localization
  workflow, not a full professional video editor or Adobe Premiere replacement.
- Media original language must be configurable and never hard-coded.
- Every transcript, subtitle, audio track, dubbing track, and localized video
  export must remain linked to the original media asset.
- Media assets must remain linked to the original manuscript, article, book, or
  project when applicable.
- Media translations must follow terminology, QA, Semantic Fidelity, and global
  translation rules.
- Magazine publication data is optional in v1.0 but reserved conceptually for
  future flipbook reading, article audio, language switching, search, PDF/HTML
  magazine export, and links back to original articles or manuscripts.
- Phase 2 planning data is optional in v1.0 and reserved conceptually for
  dictionary intelligence, editorial layout, visual creation, audio narration,
  video assets, production profiles, and auditable agent execution records.
- Phase 2 agent execution records must preserve human approval gates and audit
  references.

### Top-Level Structure

Required top-level keys:

- `formatVersion`
- `project`
- `manuscripts`
- `documents`
- `terminology`
- `translationMemory`
- `translationRules`
- `qa`
- `workflow`
- `audit`
- `versionHistory`

Optional top-level key reserved for future phases:

- `mediaLocalization`
- `dictionaries`
- `layout`
- `visualAssets`
- `audioTracks`
- `videoAssets`
- `productionProfiles`
- `agentExecutions`

### JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://laboratorul-editurii.local/schemas/json-master-format-1.0.schema.json",
  "title": "JSON Master Format v1.0",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "formatVersion",
    "project",
    "manuscripts",
    "documents",
    "terminology",
    "translationMemory",
    "translationRules",
    "qa",
    "workflow",
    "audit",
    "versionHistory"
  ],
  "properties": {
    "formatVersion": {
      "const": "1.0"
    },
    "project": {
      "$ref": "#/$defs/project"
    },
    "manuscripts": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/manuscript"
      },
      "minItems": 1
    },
    "documents": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/document"
      }
    },
    "terminology": {
      "$ref": "#/$defs/terminology"
    },
    "translationMemory": {
      "$ref": "#/$defs/translationMemory"
    },
    "translationRules": {
      "$ref": "#/$defs/translationRules"
    },
    "qa": {
      "$ref": "#/$defs/projectQa"
    },
    "workflow": {
      "$ref": "#/$defs/workflow"
    },
    "audit": {
      "$ref": "#/$defs/audit"
    },
    "versionHistory": {
      "$ref": "#/$defs/versionHistory"
    },
    "mediaLocalization": {
      "$ref": "#/$defs/mediaLocalization"
    },
    "dictionaries": {
      "$ref": "#/$defs/futurePhaseObject"
    },
    "layout": {
      "$ref": "#/$defs/futurePhaseObject"
    },
    "visualAssets": {
      "$ref": "#/$defs/futurePhaseArray"
    },
    "audioTracks": {
      "$ref": "#/$defs/futurePhaseArray"
    },
    "videoAssets": {
      "$ref": "#/$defs/futurePhaseArray"
    },
    "productionProfiles": {
      "$ref": "#/$defs/futurePhaseArray"
    },
    "agentExecutions": {
      "$ref": "#/$defs/futurePhaseArray"
    }
  },
  "$defs": {
    "id": {
      "type": "string",
      "minLength": 1
    },
    "futurePhaseObject": {
      "type": "object",
      "additionalProperties": true
    },
    "futurePhaseArray": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true
      }
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "languageCode": {
      "type": "string",
      "pattern": "^[a-z]{2,3}(-[A-Za-z0-9]+)?$"
    },
    "project": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "name",
        "sourceLanguage",
        "targetLanguages",
        "status",
        "createdAt",
        "updatedAt"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "sourceLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "targetLanguages": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/languageCode"
          }
        },
        "domain": {
          "type": "string"
        },
        "status": {
          "enum": [
            "draft",
            "active",
            "in_review",
            "approved",
            "published",
            "archived"
          ]
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        },
        "updatedAt": {
          "$ref": "#/$defs/timestamp"
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "manuscript": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "manuscriptId",
        "projectId",
        "language",
        "title",
        "chapters",
        "segments",
        "ruleVersionRefs",
        "translationStatus",
        "workflowStatus",
        "exportArtifacts"
      ],
      "properties": {
        "manuscriptId": {
          "$ref": "#/$defs/id"
        },
        "projectId": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "sourceManuscriptId": {
          "$ref": "#/$defs/id"
        },
        "title": {
          "type": "string"
        },
        "chapters": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/manuscriptChapter"
          }
        },
        "segments": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/manuscriptSegment"
          }
        },
        "ruleVersionRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "translationStatus": {
          "enum": [
            "original",
            "not_started",
            "in_translation",
            "translated",
            "in_review",
            "approved",
            "ready_for_export",
            "exported"
          ]
        },
        "workflowStatus": {
          "enum": [
            "DRAFT",
            "IN_TRANSLATION",
            "IN_QA",
            "IN_SEMANTIC_REVIEW",
            "IN_REVIEW",
            "APPROVED",
            "READY_FOR_EXPORT",
            "EXPORTED",
            "BLOCKED"
          ]
        },
        "exportArtifacts": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/manuscriptExportArtifact"
          }
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "manuscriptChapter": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "chapterId",
        "order",
        "title",
        "segmentIds"
      ],
      "properties": {
        "chapterId": {
          "$ref": "#/$defs/id"
        },
        "order": {
          "type": "integer",
          "minimum": 0
        },
        "title": {
          "type": "string"
        },
        "sourceChapterId": {
          "$ref": "#/$defs/id"
        },
        "segmentIds": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        }
      }
    },
    "manuscriptSegment": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "segmentId",
        "order",
        "text",
        "status"
      ],
      "properties": {
        "segmentId": {
          "$ref": "#/$defs/id"
        },
        "sourceSegmentId": {
          "$ref": "#/$defs/id"
        },
        "alignmentKey": {
          "type": "string"
        },
        "order": {
          "type": "integer",
          "minimum": 0
        },
        "text": {
          "type": "string"
        },
        "status": {
          "enum": [
            "new",
            "in_translation",
            "translated",
            "in_review",
            "approved",
            "locked"
          ]
        },
        "workflowStatus": {
          "type": "string"
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "manuscriptExportArtifact": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "artifactId",
        "language",
        "format",
        "uri",
        "ruleVersionRefs",
        "createdAt"
      ],
      "properties": {
        "artifactId": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "format": {
          "enum": [
            "json_master",
            "pdf",
            "epub",
            "mobi",
            "html",
            "docx",
            "txt",
            "print",
            "srt",
            "vtt",
            "ass",
            "localized_video"
          ]
        },
        "uri": {
          "type": "string"
        },
        "checksum": {
          "type": "string"
        },
        "workflowStatusAtExport": {
          "type": "string"
        },
        "ruleVersionRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        }
      }
    },
    "document": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "projectId",
        "title",
        "sourceLanguage",
        "segments"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "projectId": {
          "$ref": "#/$defs/id"
        },
        "title": {
          "type": "string"
        },
        "sourceLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "documentType": {
          "enum": [
            "book",
            "article",
            "technical_document",
            "subtitle_script",
            "media_transcript",
            "other"
          ]
        },
        "sourceFile": {
          "$ref": "#/$defs/sourceFile"
        },
        "segments": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/segment"
          }
        },
        "versions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/versionReference"
          }
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "sourceFile": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "name": {
          "type": "string"
        },
        "mimeType": {
          "type": "string"
        },
        "checksum": {
          "type": "string"
        },
        "uri": {
          "type": "string"
        }
      }
    },
    "segment": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "order",
        "source",
        "translations",
        "status"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "order": {
          "type": "integer",
          "minimum": 0
        },
        "source": {
          "$ref": "#/$defs/sourceSegment"
        },
        "translations": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translation"
          }
        },
        "terminologyRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "translationMemoryRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "qaRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "workflowState": {
          "type": "string"
        },
        "status": {
          "enum": [
            "new",
            "in_translation",
            "translated",
            "in_review",
            "approved",
            "locked"
          ]
        },
        "mediaTiming": {
          "$ref": "#/$defs/mediaTiming"
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "sourceSegment": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "text"
      ],
      "properties": {
        "text": {
          "type": "string"
        },
        "normalizedText": {
          "type": "string"
        },
        "notes": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "structuralPath": {
          "type": "string"
        }
      }
    },
    "translation": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "language",
        "text",
        "status",
        "createdAt",
        "updatedAt"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "text": {
          "type": "string"
        },
        "status": {
          "enum": [
            "draft",
            "machine_suggested",
            "human_edited",
            "reviewed",
            "approved",
            "rejected"
          ]
        },
        "translatorId": {
          "$ref": "#/$defs/id"
        },
        "reviewerId": {
          "$ref": "#/$defs/id"
        },
        "qa": {
          "$ref": "#/$defs/segmentQa"
        },
        "provenance": {
          "$ref": "#/$defs/provenance"
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        },
        "updatedAt": {
          "$ref": "#/$defs/timestamp"
        }
      }
    },
    "provenance": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "source": {
          "enum": [
            "human",
            "ai",
            "translation_memory",
            "glossary",
            "dictionary",
            "corpus",
            "editorial_decision"
          ]
        },
        "sourceRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "confidence": {
          "type": "number",
          "minimum": 0,
          "maximum": 1
        },
        "explanation": {
          "type": "string"
        }
      }
    },
    "terminology": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "terms"
      ],
      "properties": {
        "terms": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/term"
          }
        }
      }
    },
    "term": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "sourceTerm",
        "language",
        "status"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "sourceTerm": {
          "type": "string"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "approvedTranslations": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/termTranslation"
          }
        },
        "forbiddenTranslations": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "domain": {
          "type": "string"
        },
        "definition": {
          "type": "string"
        },
        "source": {
          "enum": [
            "dictionary",
            "glossary",
            "translation_memory",
            "corpus",
            "editorial_decision",
            "ai"
          ]
        },
        "status": {
          "enum": [
            "proposed",
            "under_review",
            "validated",
            "suspended",
            "archived_historically"
          ]
        }
      }
    },
    "termTranslation": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "language",
        "text"
      ],
      "properties": {
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "text": {
          "type": "string"
        }
      }
    },
    "translationMemory": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "entries"
      ],
      "properties": {
        "entries": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translationMemoryEntry"
          }
        }
      }
    },
    "translationMemoryEntry": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "sourceText",
        "targetText",
        "sourceLanguage",
        "targetLanguage"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "sourceText": {
          "type": "string"
        },
        "targetText": {
          "type": "string"
        },
        "sourceLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "targetLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "domain": {
          "type": "string"
        },
        "qualityScore": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "sourceDocumentId": {
          "$ref": "#/$defs/id"
        }
      }
    },
    "translationRules": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "rules",
        "sourceAuthorities",
        "impactReports",
        "changeApprovals",
        "exceptions"
      ],
      "properties": {
        "rules": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translationRule"
          }
        },
        "sourceAuthorities": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/ruleSourceAuthority"
          }
        },
        "impactReports": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translationRuleImpactReport"
          }
        },
        "changeApprovals": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translationRuleChangeApproval"
          }
        },
        "exceptions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/ruleException"
          }
        }
      }
    },
    "translationRule": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "ruleId",
        "currentVersionId",
        "versions"
      ],
      "properties": {
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "name": {
          "type": "string"
        },
        "scope": {
          "enum": [
            "global",
            "language",
            "domain",
            "project",
            "manuscript",
            "terminology"
          ]
        },
        "currentVersionId": {
          "$ref": "#/$defs/id"
        },
        "versions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translationRuleVersion"
          },
          "minItems": 1
        }
      }
    },
    "translationRuleVersion": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "ruleVersionId",
        "ruleId",
        "versionNumber",
        "status",
        "content",
        "sourceAuthorityRefs",
        "createdBy",
        "createdAt"
      ],
      "properties": {
        "ruleVersionId": {
          "$ref": "#/$defs/id"
        },
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "previousRuleVersionId": {
          "$ref": "#/$defs/id"
        },
        "versionNumber": {
          "type": "integer",
          "minimum": 1
        },
        "status": {
          "enum": [
            "draft",
            "pending_impact_analysis",
            "pending_approval",
            "approved",
            "validated",
            "active",
            "superseded",
            "rejected"
          ]
        },
        "content": {
          "type": "object",
          "additionalProperties": true
        },
        "sourceAuthorityRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          },
          "minItems": 1
        },
        "createdBy": {
          "$ref": "#/$defs/id"
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        },
        "approvedBy": {
          "$ref": "#/$defs/id"
        },
        "approvedAt": {
          "$ref": "#/$defs/timestamp"
        }
      }
    },
    "ruleSourceAuthority": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "ruleId",
        "ruleVersion",
        "sourceType",
        "sourceReference",
        "sourceDetails",
        "sourceLanguage",
        "sourcePublicationYear",
        "sourcePageOrSection",
        "approvalAuthority",
        "approvalDate",
        "authorityConfidenceLevel"
      ],
      "properties": {
        "sourceAuthorityId": {
          "$ref": "#/$defs/id"
        },
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "ruleVersion": {
          "type": "string"
        },
        "sourceType": {
          "enum": [
            "Original Author",
            "Original Publication",
            "Editorial Board Decision",
            "Approved Editorial Glossary",
            "Approved Specialized Glossary",
            "Academic Reference",
            "Historical Reference",
            "Regulatory Reference",
            "Internal Editorial Standard"
          ]
        },
        "sourceReference": {
          "type": "string"
        },
        "sourceDetails": {
          "type": "string"
        },
        "sourceLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "sourcePublicationYear": {
          "type": "integer"
        },
        "sourcePageOrSection": {
          "type": "string"
        },
        "approvalAuthority": {
          "type": "string"
        },
        "approvalDate": {
          "$ref": "#/$defs/timestamp"
        },
        "authorityConfidenceLevel": {
          "enum": [
            "PRIMARY_AUTHORITY",
            "SECONDARY_AUTHORITY",
            "EDITORIAL_AUTHORITY",
            "TEMPORARY_AUTHORITY"
          ]
        },
        "immutable": {
          "const": true
        },
        "aiGenerated": {
          "const": false
        }
      }
    },
    "ruleException": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "exceptionId",
        "ruleId",
        "ruleVersion",
        "reason",
        "sourceAuthorityRefs",
        "status"
      ],
      "properties": {
        "exceptionId": {
          "$ref": "#/$defs/id"
        },
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "ruleVersion": {
          "type": "string"
        },
        "reason": {
          "type": "string"
        },
        "sourceAuthorityRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          },
          "minItems": 1
        },
        "status": {
          "enum": [
            "proposed",
            "under_review",
            "validated",
            "rejected",
            "archived"
          ]
        },
        "approvedBy": {
          "$ref": "#/$defs/id"
        },
        "approvedAt": {
          "$ref": "#/$defs/timestamp"
        }
      }
    },
    "translationRuleImpactReport": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "impactReportId",
        "ruleId",
        "newRuleVersionId",
        "generatedAt",
        "affectedBooks",
        "affectedManuscripts",
        "affectedLanguages",
        "affectedChapters",
        "affectedSegments",
        "affectedTerminologyEntries",
        "affectedSourceAuthorities",
        "affectedAuthorityConfidenceLevels",
        "affectedExports"
      ],
      "properties": {
        "impactReportId": {
          "$ref": "#/$defs/id"
        },
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "previousRuleVersionId": {
          "$ref": "#/$defs/id"
        },
        "newRuleVersionId": {
          "$ref": "#/$defs/id"
        },
        "generatedAt": {
          "$ref": "#/$defs/timestamp"
        },
        "affectedBooks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedManuscripts": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedLanguages": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/languageCode"
          }
        },
        "affectedChapters": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedSegments": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedTerminologyEntries": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedSourceAuthorities": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedAuthorityConfidenceLevels": {
          "type": "array",
          "items": {
            "enum": [
              "PRIMARY_AUTHORITY",
              "SECONDARY_AUTHORITY",
              "EDITORIAL_AUTHORITY",
              "TEMPORARY_AUTHORITY"
            ]
          }
        },
        "affectedExports": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        }
      }
    },
    "translationRuleChangeApproval": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "approvalId",
        "ruleId",
        "newRuleVersionId",
        "approverId",
        "approvedAt",
        "impactReportId"
      ],
      "properties": {
        "approvalId": {
          "$ref": "#/$defs/id"
        },
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "previousRuleVersionId": {
          "$ref": "#/$defs/id"
        },
        "newRuleVersionId": {
          "$ref": "#/$defs/id"
        },
        "sourceAuthorityRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          },
          "minItems": 1
        },
        "approverId": {
          "$ref": "#/$defs/id"
        },
        "approvedAt": {
          "$ref": "#/$defs/timestamp"
        },
        "impactReportId": {
          "$ref": "#/$defs/id"
        },
        "decision": {
          "enum": [
            "approved",
            "rejected",
            "approved_with_conditions"
          ]
        }
      }
    },
    "projectQa": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "checks"
      ],
      "properties": {
        "checks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/qaCheck"
          }
        },
        "scores": {
          "$ref": "#/$defs/qaScores"
        }
      }
    },
    "segmentQa": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "checks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/qaCheck"
          }
        },
        "scores": {
          "$ref": "#/$defs/qaScores"
        }
      }
    },
    "qaCheck": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "type",
        "severity",
        "status"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "type": {
          "enum": [
            "semantic_fidelity",
            "terminology",
            "numbers",
            "dates",
            "units",
            "proper_names",
            "punctuation",
            "formatting",
            "missing_segment",
            "duplicate_segment",
            "subtitle_timing",
            "audio_sync",
            "reading_speed"
          ]
        },
        "severity": {
          "enum": [
            "info",
            "warning",
            "error",
            "blocking"
          ]
        },
        "message": {
          "type": "string"
        },
        "status": {
          "enum": [
            "open",
            "resolved",
            "accepted_risk",
            "false_positive"
          ]
        }
      }
    },
    "qaScores": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "semanticFidelity": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "terminology": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "consistency": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "fluency": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "overall": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        }
      }
    },
    "workflow": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "state",
        "events"
      ],
      "properties": {
        "state": {
          "enum": [
            "draft",
            "translation",
            "review",
            "approved",
            "published",
            "archived"
          ]
        },
        "assignments": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/assignment"
          }
        },
        "events": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/workflowEvent"
          }
        }
      }
    },
    "assignment": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "userId",
        "role"
      ],
      "properties": {
        "userId": {
          "$ref": "#/$defs/id"
        },
        "role": {
          "enum": [
            "admin",
            "translator",
            "reviewer",
            "viewer",
            "expert"
          ]
        }
      }
    },
    "workflowEvent": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "type",
        "createdAt"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "type": {
          "type": "string"
        },
        "actorId": {
          "$ref": "#/$defs/id"
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        },
        "payload": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "audit": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "events"
      ],
      "properties": {
        "events": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/auditEvent"
          }
        }
      }
    },
    "auditEvent": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "action",
        "timestamp"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "actorId": {
          "$ref": "#/$defs/id"
        },
        "action": {
          "type": "string"
        },
        "entityType": {
          "type": "string"
        },
        "entityId": {
          "$ref": "#/$defs/id"
        },
        "before": {
          "type": [
            "object",
            "null"
          ],
          "additionalProperties": true
        },
        "after": {
          "type": [
            "object",
            "null"
          ],
          "additionalProperties": true
        },
        "timestamp": {
          "$ref": "#/$defs/timestamp"
        }
      }
    },
    "versionHistory": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "versions"
      ],
      "properties": {
        "versions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/versionReference"
          }
        }
      }
    },
    "versionReference": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "createdAt",
        "createdBy",
        "snapshotRef"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        },
        "createdBy": {
          "$ref": "#/$defs/id"
        },
        "summary": {
          "type": "string"
        },
        "snapshotRef": {
          "type": "string"
        },
        "checksum": {
          "type": "string"
        }
      }
    },
    "mediaLocalization": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "mediaAssets": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/mediaAsset"
          }
        },
        "transcripts": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/mediaTranscript"
          }
        },
        "subtitleTracks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/subtitleTrack"
          }
        },
        "voiceOverTracks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/audioTrack"
          }
        },
        "dubbingTracks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/audioTrack"
          }
        },
        "mediaVersions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/languageSpecificMediaVersion"
          }
        },
        "localizedVideoExports": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/localizedVideoExport"
          }
        }
      }
    },
    "mediaAsset": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "type",
        "uri"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "type": {
          "enum": [
            "video",
            "audio",
            "subtitle",
            "transcript"
          ]
        },
        "uri": {
          "type": "string"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "originalLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "projectId": {
          "$ref": "#/$defs/id"
        },
        "bookId": {
          "$ref": "#/$defs/id"
        },
        "manuscriptId": {
          "$ref": "#/$defs/id"
        },
        "articleId": {
          "$ref": "#/$defs/id"
        },
        "durationMs": {
          "type": "integer",
          "minimum": 0
        },
        "checksum": {
          "type": "string"
        }
      }
    },
    "mediaTranscript": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "mediaAssetId",
        "language",
        "status",
        "segmentRefs"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "mediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "sourceTranscriptId": {
          "$ref": "#/$defs/id"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "status": {
          "enum": [
            "generated",
            "corrected",
            "translated",
            "approved",
            "exported"
          ]
        },
        "segmentRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        }
      }
    },
    "mediaTiming": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "startMs": {
          "type": "integer",
          "minimum": 0
        },
        "endMs": {
          "type": "integer",
          "minimum": 0
        },
        "speakerId": {
          "$ref": "#/$defs/id"
        }
      }
    },
    "subtitleTrack": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "language",
        "format",
        "segmentRefs"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "format": {
          "enum": [
            "srt",
            "vtt",
            "ass"
          ]
        },
        "mediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "sourceTranscriptId": {
          "$ref": "#/$defs/id"
        },
        "sourceSubtitleTrackId": {
          "$ref": "#/$defs/id"
        },
        "segmentRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        }
      }
    },
    "audioTrack": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "language",
        "type",
        "uri"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "type": {
          "enum": [
            "voice_over",
            "dubbing"
          ]
        },
        "uri": {
          "type": "string"
        },
        "mediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "sourceAudioTrackId": {
          "$ref": "#/$defs/id"
        },
        "sourceSegmentRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "syncQualityScore": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        }
      }
    },
    "languageSpecificMediaVersion": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "originalMediaAssetId",
        "language",
        "mediaAssetRefs"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "transcriptId": {
          "$ref": "#/$defs/id"
        },
        "subtitleTrackIds": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "audioTrackIds": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "mediaAssetRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        }
      }
    },
    "localizedVideoExport": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "language",
        "uri",
        "createdAt"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "uri": {
          "type": "string"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "mediaVersionId": {
          "$ref": "#/$defs/id"
        },
        "transcriptId": {
          "$ref": "#/$defs/id"
        },
        "subtitleTrackId": {
          "$ref": "#/$defs/id"
        },
        "audioTrackId": {
          "$ref": "#/$defs/id"
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        }
      }
    }
  }
}
```

## AI Agent Governance, Subagents & Parallel Review

Status: Governance refinement. No new enterprise module.

All AI agents follow one governance model. For every agent the platform records
or exposes:

- ID.
- Name.
- Parent agent ID where applicable.
- Mission.
- Responsibilities.
- Collaboration rules.
- Limits.
- Authority.
- Enabled state.
- Version.
- Last update timestamp.

### Collaboration

All agents may collaborate freely. Agents may exchange information, request
assistance, reuse results, notify other agents, and coordinate through the
Coordinator Agent. There are no communication restrictions between agents.

All agent invocations, subagent invocations, generated proposals,
accepted/rejected proposals, responsibility transfers, quality statuses, final
agent decisions, and human overrides must remain auditable.

### Responsibility

Each agent has final AI responsibility only within its own specialization:

- Translation Agent: translation suggestions and translation decision support.
- Review Agent: editorial corrections and review recommendations.
- Layout Agent: page layout recommendations.
- Illustration Agent: illustration drafts and visual consistency.
- Audio Agent: audiobook draft support and audio readiness.
- Video Agent: video draft support and video readiness.
- Quality Agent: quality verification.

Principal agents retain final responsibility for their subagents' results.

### Human Final Authority

Human approval always overrides every AI decision. No AI agent may publish
automatically, approve automatically, grant rights, bypass workflow, modify
security, or change governance.

### Current Agents

The current governed agents are:

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

### Specialized Subagents

The approved subagents are:

1. Terminology & Lexicography Subagent.
   Parent: Translation Agent.
   Responsibilities: validated glossaries, terminology consistency,
   specialized terms, terminology status, source tracking, alternatives that do
   not silently replace validated terms.
2. Semantic Fidelity Subagent.
   Parent: Translation Agent.
   Responsibilities: sentence-by-sentence source/translation comparison,
   omissions, additions, meaning shifts, tone, intent, verbal tense, semantic
   divergence reports.
3. Editorial Decision Subagent.
   Parent: Review Agent.
   Responsibilities: competing editorial variants, stylistic differences,
   normative differences, preferred-variant recommendations, no automatic
   application.
4. Planning & Coordination Subagent.
   Parent: Coordinator Agent.
   Responsibilities: deadlines, priorities, dependencies, workload balancing,
   milestones, scheduling conflicts, AI task scheduling.
5. Media Localization Subagent.
   Parents: Audio Agent and Video Agent.
   Responsibilities: multilingual subtitles, localized narration,
   pronunciation, timing and synchronization, regional variants, accessible
   localized media.
6. Platform Engineering Subagent.
   Parent: Evolution Agent.
   Responsibilities: architecture compatibility, dependency analysis, upgrade
   plans, migrations, rollback plans, technical risk assessment.

### Quality Agent

Mission: verify that an editorial project is ready for publication.

Responsibilities:

- Editorial completeness.
- Editorial consistency.
- Metadata validation.
- Missing assets.
- Links verification.
- Accessibility verification.
- Export validation.
- Rights status.
- Workflow completion.
- Publication readiness.
- Distribution readiness.

Quality Agent reports issues only. It does not correct the project and may not
translate, review, edit, illustrate, publish, or approve.

Quality Agent statuses:

- `READY`.
- `READY_WITH_WARNINGS`.
- `BLOCKED`.

### Review Agent Proposal Model

Review proposals must store:

- `proposalId`.
- `projectId`.
- `documentId`.
- `segmentId`.
- `sourceText`.
- `currentTranslation`.
- `proposedText`.
- `language`.
- `issueType`.
- `explanation`.
- `confidence`.
- `status`: `PENDING`, `ACCEPTED`, or `REJECTED`.
- `createdByAgent`.
- `reviewedBy`.
- `createdAt`.
- `resolvedAt`.

Review Agent identifies each issue, explains it, proposes one or more
replacement variants when available, never imposes the proposed change,
preserves current text until a proposal is accepted, supports individual accept
or reject actions, does not alter original meaning, and does not replace
validated terminology without justification and traceability.

### Parallel Translation & Review Interface

The original text and translation must remain visible in parallel.

Default display:

- Two columns.
- Column 1: original text.
- Column 2: current translation and proposed replacement variants attached to
  relevant translated sentences.

Required behavior:

- Sentence and paragraph alignment.
- Synchronized scrolling can be enabled or disabled.
- Original text remains immutable.
- Translation remains unchanged until a proposal is accepted.
- Differences are highlighted.
- Accepted and rejected proposals are audited.
- Version history is preserved.
- User may resize or temporarily hide columns.

Optional display modes:

- Three columns: original, translation, and another language, version, or
  comparison text.
- Four columns: simultaneous comparison of up to four languages or versions.

For optional columns, language or version can be selected independently while
alignment is preserved.

## Future Phase - Media Localization Studio

Status: Future Phase. Do not implement now.

The platform will include a future basic editorial media localization subsystem
for translating, adapting, dubbing, subtitling, synchronizing, and exporting
localized audio/video content. This module extends the translation platform into
multimedia localization workflows while preserving the same principles of
semantic fidelity, terminology control, traceability, and professional review.

Media Localization Studio is not a full Adobe Premiere replacement and is not a
professional non-linear video editing suite.

### Capabilities

- Video and audio upload: import source media for editorial localization.
- Automatic transcript generation: transcribe source audio/video into editable
  text.
- Transcript correction: allow humans to correct generated transcripts before
  translation or export.
- Transcript translation: translate transcript segments under the same
  terminology, QA, Semantic Fidelity, and global translation rules as document
  translation.
- Subtitle generation: create subtitles from transcript or translated segments.
- Subtitle formats: export and manage SRT, VTT, and ASS.
- Multilingual subtitles: maintain subtitle tracks per target language.
- Multilingual voice-over: generate or manage localized narration tracks.
- Simple AI dubbing: produce basic localized dialogue aligned with speaker timing
  and intent.
- Audio export: export localized voice-over or dubbing audio.
- Transcript export: export source and translated transcripts.
- Localized video export: export localized video with selected subtitle,
  voice-over, dubbing, and audio settings.
- Text/audio/video synchronization: align transcripts, subtitles, audio, timing,
  and visual cues.
- Source linking: link media assets to the original manuscript, article, book,
  or project.
- Language-specific media versions: preserve separate media versions per target
  language while keeping alignment to the original media.
- Media Localization QA: detect subtitle timing issues, missing subtitles,
  terminology violations, reading-speed problems, audio drift, and sync errors.
- Workflow Integration: connect media localization tasks with projects, roles,
  review, audit, terminology, Translation Memory, and publishing workflows.

### Explicit Exclusions

- Advanced video editing.
- Color grading.
- Complex timeline editing.
- Visual effects.
- Advanced transitions.
- Professional compositing.

### Rules

- Original language must be configurable and never hard-coded.
- Every transcript, subtitle, audio version, dubbing version, and localized
  video export must remain linked to the original media asset.
- Media assets must remain linked to the original manuscript, article, book, or
  project when applicable.
- Language-specific media versions must preserve auditable alignment to the
  original media and source text.
- Transcript and subtitle translations must follow terminology, QA, Semantic
  Fidelity, and global translation rules.
- Human final authority remains required for release approval.

### Architectural Position

Media Localization Studio is a future subsystem, not part of the current
MVP. It must integrate with:

- Translation Editor.
- Terminology and glossary systems.
- Semantic Fidelity Engine.
- Quality Assurance Engine.
- Translation Memory.
- Global Editorial Memory.
- Workflow and review pipelines.
- Audit and source traceability.
- Export and publishing systems.

### Non-Implementation Rule

This phase is specification-only until explicitly scheduled. No application code,
database migrations, AI endpoints, UI routes, or infrastructure changes should be
implemented for this module yet.

## Future Phase - Magazine Platform Vision

Status: Planned future phase. Do not implement now.

Magazine Platform Vision defines a future digital magazine layer for publishing,
reading, audio, export, and rich editorial experiences. It is downstream from
the core translation workflow and must preserve JSON Master traceability,
language alignment, semantic fidelity, terminology governance, workflow review,
audit, and human final authority.

### Cross-References

- `ROADMAP.md`: Future Phase - Magazine Platform Vision.
- `FUTURE_MODULES.md`: Future Phase - Magazine Platform Vision.
- `docs/JSON_MASTER_FORMAT.md`: Magazine publication representation guidance.
- `AGENTS.md`: Magazine Platform Vision Directive.

### Non-Implementation Rule

This phase is specification-only until explicitly scheduled. No application
code, UI routes, database migrations, API endpoints, AI endpoints, or
infrastructure changes should be implemented for this module yet.

## Phase 7 Step 12 - Platform-Wide Need-to-Know Access Model

Status: Implemented as an additive refinement of the existing IAM, RBAC,
workspace, audit, project role, document permission, and AI governance
architecture.

### Core Principle

Every user, collaborator, and AI agent sees only the information, documents,
panels, tools, and actions required for the current organization role, project
role, editorial role, assigned task, assigned manuscript/document scope,
workflow stage, explicit grant, and confidentiality classification.

The most restrictive valid rule wins. Hidden data must not be loaded through
API responses for unauthorized users.

### Default Collaborative Access

- The manuscript is the primary shared editorial object.
- Collaborators see only assigned manuscript sections, chapters, documents, or
  segments.
- Role-essential panels and tools are visible by default.
- Additional information requires explicit access.
- Unauthorized metadata, private discussions, unrelated contracts, financial
  data, rights negotiations, administration data, distribution credentials, and
  confidential records remain hidden.

### Role Visibility

- Translators may see assigned source text, target translation fields,
  linguistic resources, glossaries, terminology decisions, and assigned
  comments.
- Reviewers may see assigned source text, translations, review proposals,
  comments, and relevant version history.
- Layout specialists may see validated text, styles, illustrations, layout
  assets, and publication specifications.
- Illustrators may see assigned fragments, briefs, approved references, and
  relevant assets.
- Audio/video collaborators may see validated text, assigned chapters,
  pronunciation/localization information, and approved media assets.
- Administrators may manage workspace access, but human final authority and
  audit rules still apply.

### Invitation and Temporary Access

The invite collaborator flow requires:

1. Person.
2. Role.
3. Scope: project, document, manuscript, chapter, section, segment, resource,
   tools, and optional expiry.
4. Preview of exactly what the collaborator will see.
5. Confirmation by an authorized human role.

Temporary access records start time, expiration, reason, granting user,
automatic revocation, and audit trail.

### API Enforcement

Need-to-know access is enforced server-side for projects, manuscripts, document
sections, comments, versions, linguistic sources, rights records, media assets,
exports, publishing, distribution, administration, and agent execution records.
Unauthorized requests return no restricted metadata.

### AI Agent Data Access

AI agents receive minimum necessary task data only. Every access records agent,
task, accessed resource references, access scope, decision, result, and
timestamp. Agents may not expand their own access.

### Audit Events

Audit must cover invitation sent/accepted, access granted/changed/revoked,
temporary access expiration, restricted attempts, document opening,
confidential resource access, AI agent data access, and human overrides.

## Phase 7 Step 13 - Editorial Workspace Final

Status: Implemented as the primary frontend production environment and an
orchestration refinement over existing modules.

### Core Principle

Laborator Editura uses one unified Editorial Workspace for every publication
type:

- Book.
- Children's Book.
- Magazine.
- Poetry.
- Dictionary.
- Course.
- Audiobook.
- Video.

The manuscript remains the central working object. The workspace is optimized
primarily for individual work, while collaboration can be activated instantly
without changing the interface.

### Reused Architecture

The Editorial Workspace reuses:

- Projects.
- Project Dossiers.
- Editorial Process.
- Translation.
- Review.
- Illustrations and media planning.
- Publishing.
- Distribution.
- AI Governance.
- Audit.
- Library.
- Need-to-Know access.

It must not duplicate these modules or introduce a new enterprise module.

### Workspace Behavior

- Common editorial actions target 2-3 clicks maximum.
- Only tools relevant to the current task, role, project, and assignment should
  be visible.
- Panels are collapsible, dockable, resizable, restorable, and support
  favorites, universal search, configurable shortcuts, and recently used tools.
- Collaboration supports invitation, role assignment, chapter assignment,
  segment assignment, comments, mentions, suggestions, accept/reject,
  synchronized updates, audit, and version history.
- Human Final Authority remains required for review, approval, rights,
  publication, and workflow transitions.

### Editorial Production Tools

The workspace may include useful production functions inspired by Adobe
InDesign, but it must not reproduce Adobe UI.

Supported production functions include drag and drop, page thumbnails,
paragraph styles, character styles, object styles, master pages/templates, page
guides, rulers, grids, snapping, alignment, page numbering, headers, footers,
table of contents, footnotes, endnotes, hyperlinks, anchors, image placement,
image fitting, image replacement, layers, preflight, package project, and live
preview.

### Publication Formats

The workspace supports configurable publication formats:

- ISO: A0, A1, A2, A3, A4, A5, A6, A7.
- Series B: B4, B5, B6.
- Series C: C4, C5, C6.
- North America: Letter, Legal, Executive, Ledger, Tabloid, Half Letter,
  Junior Legal.
- Trade books: Pocket, Digest, Crown, Royal, Demy, Trade Paperback, US Trade,
  Mass Market Paperback.
- Magazine: A4, A5, Letter, Square, Landscape, Brochure.
- Children's books: Board Book, Picture Book, Large Format, Square.
- Custom: width, height, portrait, landscape, bleed, spine, inside margin,
  outside margin, top margin, bottom margin, gutter, safe area, columns.

Users may change publication format at any time. The workspace should
automatically adapt layout, templates, styles, guides, image placement, page
numbering, export settings, and previews without manual reconstruction.

### Translation and Review

Default review mode is two columns:

- Column 1: immutable original.
- Column 2: translation with highlighted proposed variants.

Optional modes may show three or four columns, sentence alignment, paragraph
alignment, synchronized scrolling, and individual accept/reject decisions.

### Performance

The workspace must remain usable for large books, large magazines, thousands of
pages, high-resolution illustrations, and multiple collaborators.

## Phase 7 Step 14 - Administration Review and Simplification

Status: Implemented as a frontend configuration-center refinement.

### Goal

Administration is a platform configuration center. It is not a daily editorial
production workspace.

### Principles

- Simple and logical.
- Maximum two levels of navigation.
- No duplicate administration options.
- Access is role-based.
- All changes are audited.
- Critical changes require explicit confirmation.

### Administration Sections

Administration is organized into these high-level sections:

- Organization: organization data, logo, branding, timezone, and currency.
- Users: users, invitations, teams, and groups.
- Roles and permissions: roles, permissions, Need-to-Know policies, and
  temporary access.
- AI agents: activation, priorities, AI models, limits, costs, and monitoring.
- Linguistic resources: languages, dictionaries, glossaries, approved sources,
  and updates.
- Editorial templates: book formats, magazine formats, styles, templates, and
  exports.
- Publishing and distribution: ISBN, marketplace, channels, and export profiles.
- Security: authentication, MFA, sessions, and API keys.
- Audit and backup: audit, backup, restore, and retention.
- Integrations: AI, email, cloud, and API.
- System: updates, versions, diagnostics, and platform health.

### Access Rules

- Administrators may see every Administration section.
- Editors do not enter Administration for daily work.
- Production users work in Editorial Workspace, Pipeline, and module-specific
  production pages.
- Critical administration changes must remain disabled until confirmed by an
  authorized human.
- Reversibility and auditability are mandatory for administration changes.

## Phase 7 Step 14.1 - Roles, Permissions and Subscription Entitlements

Status: Implemented as an additive Workspace/Administration access-policy
refinement.

### Core Rule

Effective access is:

```text
Role permissions × Subscription entitlements × Need-to-Know scope
```

A user may perform an action only when:

- The assigned role permits it.
- The subscription plan includes the required feature, capacity, or quota.
- The user has access to the relevant project, document, chapter, section, or
  segment.

The most restrictive valid result wins.

### Role Model

Roles define what a person may do operationally. The official roles are:

- Administrator.
- Project Manager.
- Editor.
- Translator.
- Reviewer.
- Designer.
- Audio Narrator.
- Author.
- Collaborator.
- Reader.
- Guest.

Roles may be assigned at organization, project, document, chapter, and segment
scope. Authorized account owners, administrators, or project managers may assign
and revoke roles.

### Subscription Model

Subscription plans define available features, limits, and resources. Plans are:

- `FREE`.
- `BASIC`.
- `PREMIUM`.
- `BUSINESS`.
- `ENTERPRISE_RESERVED`.

Subscription plans are not user roles. `ENTERPRISE_RESERVED` remains disabled
until explicitly activated later.

Plans may control active projects, storage quota, collaborators, AI agent
availability, AI usage, translation volume, export formats, advanced editorial
tools, collaboration features, team administration, audit retention, backup
retention, publishing channels, distribution channels, API access, and priority
processing.

### Plan Limit Behavior

When a plan limit is reached:

- Do not destroy data.
- Do not remove existing work.
- Block only the restricted new action.
- Explain the limit clearly.
- Show the required plan.
- Audit the blocked attempt.

On downgrade:

- Preserve all existing content.
- Preserve audit and versions.
- Disable only unavailable future actions.
- Mark over-limit resources read-only where necessary.
- Do not delete projects, files, or collaborators automatically.
- Show a remediation summary.

### Administration UI

Administration must separate:

- Users and Roles: users, invitations, role assignment, project scope,
  temporary access, and revocation.
- Subscription and Usage: current plan, included features, usage, quotas,
  upgrade/downgrade, billing status, and limit warnings.

Plan names must never be mixed with editorial role names.

### Server Enforcement and Audit

The model is enforced server-side through the Workspace access-resolution
policy. It evaluates authentication status, ownership/admin authority,
organization role, project role, document scope, task, workflow stage,
Need-to-Know grants, subscription plan, quota, temporary access, and explicit
denial.

Audit covers role assigned, changed, and revoked; subscription activated and
changed; quota exceeded; feature blocked; upgrade; downgrade; temporary access
granted and expired; and human override where permitted.

## Phase 7 Step 14.2 - Unified Language Management

Status: Implemented as an additive centralized language architecture.

### Core Rule

Every module uses one centralized Language Management model. Language settings
must not be duplicated across Projects, Translation, Review, Workspace, AI
Governance, Linguistic Knowledge Base, Administration, Audit, or publication
metadata.

The official language attributes are:

- `platformLanguage`: language of menus, buttons, labels, dialogs,
  notifications, administration, dashboard, editorial workspace, and AI
  conversations with the user.
- `originalLanguage`: language of the original publication. It is immutable
  after project creation unless an authorized user explicitly changes it.
- `authoringLanguage`: language currently used while editing a manuscript. It
  supports multilingual authoring.
- `targetLanguage`: language of each translation. A project may contain
  multiple target languages.

Changing `platformLanguage` must update UI labels immediately and must not
change `originalLanguage`, `authoringLanguage`, or any `targetLanguage`.

### Project Language Configuration

Each project may contain:

- One Original Language.
- One Authoring Language.
- One or more Target Languages.

Example:

- Original: French.
- Authoring: Romanian.
- Target languages: English, Spanish, Portuguese, and Italian.

Multiple translations of the same original work are supported. Translation
always follows Original Language to Target Language. Documentation, review
explanations, administration text, workflow labels, AI agent labels, and user
messages use Platform Language.

### Review and Linguistic Resources

Parallel review defaults to two columns:

- Original.
- Translation.

Optional comparison modes may use three or four columns. Each column selects
language and version independently.

The Linguistic Knowledge Base automatically loads dictionaries, glossaries,
terminology, phraseology, and linguistic resources by Source Language to Target
Language. These resources remain supporting evidence unless a validated glossary
or authorized editorial decision gives them authority.

### Administration and Audit

Administration exposes Central Language Management for:

- Installed languages.
- Enabled languages.
- Default Platform Language.
- Language fallback.
- Translation completeness.
- Linguistic resources.
- Dictionaries.
- Glossaries.

Audit covers:

- `PLATFORM_LANGUAGE_CHANGED`.
- `ORIGINAL_LANGUAGE_CHANGED`.
- `AUTHORING_LANGUAGE_CHANGED`.
- `TARGET_LANGUAGE_ADDED`.
- `TARGET_LANGUAGE_REMOVED`.
- `LANGUAGE_RESOURCES_UPDATED`.

## Phase 7 Step 14.4 - Organization, Teams and Platform Creator

Status: Implemented as an additive Administration and access-governance
refinement.

### Organization Model

Every organization has a simple profile and one organization type.

Supported organization types:

- `PERSOANA_FIZICA` - Persoană fizică.
- `EDITURA` - Editură.
- `ASOCIATIE_ONG` - Asociație / ONG.
- `COMPANIE` - Companie.
- `INSTITUTIE` - Instituție.

`PERSOANA_FIZICA` is the default organization type.

Organization Management in Administration covers organization profile,
organization type, teams, members, and invitations.

### Teams

Organizations may create teams and assign projects, tasks, documents, and
workflow responsibilities to those teams.

Default teams:

- Echipa Traducere.
- Echipa Revizie.
- Echipa Machetare.
- Echipa Ilustrații.
- Echipa Multimedia.
- Echipa Publicare.
- Echipa Marketing.
- Echipa Publicitate.

Teams remain organization-scoped and must not become a global file manager or a
separate enterprise module.

### Platform Creator

`PLATFORM_CREATOR` / `Creatorul platformei` is a unique protected system role
for platform ownership, development, maintenance, testing, and configuration.

Rules:

- Completely separate from Administrator.
- Unrestricted access to platform functionality, Administration, AI agents,
  testing, and configuration.
- Independent from subscription limits.
- Cannot be removed.
- Cannot be downgraded.
- Cannot be modified by other administrators.
- Cannot be assigned to normal users through Administration.
- Exists only for the platform owner.

### Audit

Audit covers:

- `ADMIN_ORGANIZATION_CREATED`.
- `ADMIN_ORGANIZATION_MODIFIED`.
- `ADMIN_TEAM_CREATED`.
- `ADMIN_TEAM_MODIFIED`.
- `ADMIN_MEMBER_ADDED`.
- `ADMIN_MEMBER_REMOVED`.
- `ADMIN_PLATFORM_CREATOR_ACCESS`.
- `CREATOR_ROLE_ACCESS`.

## Phase 7 Step 14.5 - AI Providers & Cost Management

Status: Implemented as an additive AI Governance and Administration
refinement.

### AI Providers

Supported providers for v1.0:

- OpenAI as primary provider.
- Anthropic as fallback provider.

The provider architecture remains extensible for future providers without major
code changes.

Default provider: OpenAI.

Automatic fallback may switch to Anthropic when OpenAI has:

- Timeout.
- Unavailable service.
- API error.
- Configured outage.

When OpenAI becomes available again, the platform may recover to OpenAI.
Provider changes, fallback activation, and fallback recovery are auditable.

### Model Selection

Model selection is automatic by default. Advanced users may choose a model only
when role and subscription entitlement permit manual selection.

### Subscription Plans

Visible v1.0 subscription plans:

- `FREE`.
- `BASIC`.
- `PREMIUM`.
- `BUSINESS`.

`ENTERPRISE_RESERVED` remains disabled until explicitly activated later.

Subscription controls AI access, quotas, collaborators, projects, storage,
exports, advanced AI capabilities, and team functionality. Subscription plans
remain separate from operational editorial roles.

### AI Cost Policy

AI cost management supports budgets for:

- User.
- Project.
- Organization.

The platform tracks:

- Estimated cost.
- Actual cost.
- Monthly consumption.
- Consumption by AI agent.
- Consumption by project.

Budget warning thresholds:

- 80%.
- 90%.
- 100%.

When a limit is reached, the platform must never delete data. It blocks only
the restricted AI action and allows the user to wait until quota reset or
upgrade subscription.

### Platform Creator

`PLATFORM_CREATOR` has unlimited AI access, unlimited testing, full monitoring
access, and is not limited by subscription plans.

### Administration and Audit

Administration displays:

- Configured providers.
- Active provider.
- Fallback status.
- Consumption.
- Monthly budget.
- Remaining budget.
- AI usage history.

Audit covers:

- `AI_PROVIDER_CHANGED`.
- `AI_FALLBACK_ACTIVATED`.
- `AI_FALLBACK_RECOVERED`.
- `AI_BUDGET_WARNING`.
- `AI_BUDGET_EXCEEDED`.
- `AI_ACTION_BLOCKED`.
- `AI_SUBSCRIPTION_UPGRADED`.
- `AI_SUBSCRIPTION_DOWNGRADED`.

## Phase 7 Step 15 - Intelligent Editorial Library & UX Finalization

Status: Implemented as an additive extension of the existing Library.

### Purpose

The Library is a unified intelligent editorial center for the complete
publication lifecycle. It is not only a file repository and must not become a
separate Archive module.

### Lifecycle Model

Publication lifecycle statuses:

- `STOC_REAL` - publication or source stored in the Library but not currently
  in editorial production.
- `IN_LUCRU` - publication connected to an active editorial project or
  workflow.
- `PUBLICAT` - final publication approved and published.

Allowed transitions:

- `STOC_REAL` to `IN_LUCRU`.
- `IN_LUCRU` to `PUBLICAT`.
- `PUBLICAT` to `IN_LUCRU` when a new edition or revision is created.

Historical versions must never be destroyed during status changes.

### Publication Types

Publication type is metadata and a filter, not a separate Library module.
Supported types include Book, Children's Book, Magazine, Poetry, Dictionary,
Course, Audiobook, Video, and other configured publication types.

### Essential Functions

The Library supports:

- Alphabetical organization by title.
- Ascending and descending sorting.
- Fast search across title, subtitle, author, ISBN, language, series,
  collection, and metadata.
- Exact, normalized, fuzzy, partial-title, author, multilingual metadata, ISBN,
  series, and collection search.
- Filters by author, language, editorial domain, publication type, lifecycle
  status, publication year, original publication year, rights status, format,
  series, and collection.
- Grid and list views.
- Persistent user view preferences and persistent filters.
- Cover, title, author, status, language, year, and quick actions visible in
  the main view.
- Access to editions, versions, available formats, manuscripts, editorial
  projects, original edition metadata, rights, provenance, publishing history,
  and distribution status.
- PDF, EPUB, MOBI, print-ready PDF, audio, video, accessible formats, and
  source/working/final files where supported.
- Status movement between Stoc real, În lucru, and Publicat.
- Bulk actions for multiple titles.

### Publication Record

Each publication has one unified record containing:

- General information: title, subtitle, author, contributors, description,
  publication type, domain, language, series, collection, and volume.
- Original edition: original title, original language, original author, first
  edition, first publication year, publisher, source reference, and source
  acquisition metadata where available.
- Editorial relationships: manuscript, project, active workflow, translations,
  review, layout, and publishing records.
- Files and formats: source files, working files, final files, PDF, EPUB,
  MOBI, print-ready PDF, audio, video, accessibility variants, and print
  formats.
- Editions and versions: edition number, version history, edition status,
  publication date, revision date, and change summary.
- Rights and provenance: rights status, license, contracts, source provenance,
  asset provenance, and publication restrictions.
- Publishing history: published channels, publication dates, distribution
  status, withdrawn or superseded edition metadata, and associated identifiers.

### Visibility

Visibility is independent from lifecycle status:

- `PUBLIC`.
- `PRIVATE`.
- `INTERNAL_WORKING_PUBLICATION`.

A publication may be `PUBLICAT` and still `PRIVATE`.

### Preview, Actions and Bulk Operations

Preview is available inside the Library and may include cover, metadata, table
of contents, selected pages, audio sample, video sample, formats, publication
status, and associated project. Restricted content must not be exposed.

Contextual actions include open publication, open manuscript, open project,
continue editorial work, start new edition, add translation, view rights, view
versions, preview, export, move status, publish when permitted, add to
collection, and edit metadata.

Bulk operations may change status, assign collection, assign series, add tags,
export metadata, update selected metadata, assign project, mark public/private,
validate rights status, or generate a report. Bulk actions must respect role
permissions, subscription entitlements, Need-to-Know scope, project/document
scope, visibility, and rights restrictions.

### Duplicate Detection

Potential duplicates are detected using title, normalized title, author, ISBN,
original title, edition, and source file fingerprint. The Library must never
merge automatically; it must show comparison evidence and require authorized
human confirmation.

### Agent Integration

Library Agent responsibilities:

- Classify publications.
- Validate metadata completeness.
- Detect duplicate records.
- Connect editions and versions.
- Maintain relationships with projects and manuscripts.
- Suggest missing metadata.
- Preserve status consistency.
- Never delete historical versions automatically.

Quality Agent checks publication completeness, required formats, metadata,
rights, accessibility, and readiness issues.

Rights & Provenance Agent validates source and rights information before
publication.

### Audit and Backup

Audit covers:

- `LIBRARY_PUBLICATION_CREATED`.
- `LIBRARY_METADATA_CHANGED`.
- `LIBRARY_STATUS_CHANGED`.
- `LIBRARY_VISIBILITY_CHANGED`.
- `LIBRARY_MANUSCRIPT_LINKED`.
- `LIBRARY_PROJECT_LINKED`.
- `LIBRARY_EDITION_CREATED`.
- `LIBRARY_VERSION_CREATED`.
- `LIBRARY_FILE_ADDED`.
- `LIBRARY_FILE_REPLACED`.
- `LIBRARY_BULK_ACTION`.
- `LIBRARY_PUBLICATION_PUBLISHED`.
- `LIBRARY_PUBLICATION_WITHDRAWN`.
- `LIBRARY_DUPLICATE_REVIEWED`.
- `LIBRARY_RIGHTS_STATUS_CHANGED`.

Backup and restore include publications, metadata, editions, versions, files,
relationships, rights, statuses, visibility, and audit references. Restore must
not break project or manuscript links.

## Phase 7 Step 16 - Publishing Workflow, Final Preflight and Distribution Tracking

### Goal

Phase 7 Step 16 finalizes the publication release flow without duplicating
Library, Export, Quality, Rights, Translation, Review, Layout, Workflow, or
Audit responsibilities.

### Ownership Boundaries

- Library is the single source of truth for publication identity, lifecycle,
  metadata, editions, versions, files, rights/provenance references, and
  publication history.
- Publishing selects the official edition/version, manages publication
  readiness state, records human publication decisions, and creates immutable
  official publication snapshots.
- Export owns generated files and format artifacts.
- Rights & Provenance owns rights warnings and authorization records.
- Quality Agent owns quality findings. Preflight aggregates signals only.
- Distribution tracks delivery history per approved publication channel. It
  must not duplicate metadata, generated files, rights, or Library records.

### Publishing States

- `IN_PREGATIRE`.
- `GATA_PENTRU_PUBLICARE`.
- `PUBLICAT`.
- `REPUBLICAT`.
- `RETRAS_DIN_PUBLICARE`.

Allowed transitions:

- `IN_PREGATIRE` to `GATA_PENTRU_PUBLICARE`.
- `GATA_PENTRU_PUBLICARE` to `PUBLICAT`.
- `PUBLICAT` to `REPUBLICAT`.
- `PUBLICAT` to `RETRAS_DIN_PUBLICARE`.
- `REPUBLICAT` to `RETRAS_DIN_PUBLICARE`.

### Final Preflight

Final Preflight is an aggregation layer inside Publishing, not a separate
module. It checks signals from Library, Rights & Provenance, Export, Workflow,
Layout, Review, Translation, and Quality Agent.

Checklist statuses:

- `PASS`.
- `WARNING`.
- `ERROR`.
- `NOT_APPLICABLE`.
- `PENDING`.

Severity levels:

- `INFORMATIONAL`.
- `WARNING`.
- `CRITICAL`.

Critical preflight errors block publication. Warnings may be accepted only by
authorized humans and must be audited.

### Publication Channels

Approved channels:

- `INTERNAL_LIBRARY`.
- `PUBLIC_PORTAL`.
- `DIGITAL_BOOKSTORE`.
- `EXTERNAL_EXPORT`.
- `PRINT_ON_DEMAND`.

Distribution records channel delivery, status, timestamps, blockers, and
history only. Social media promotion is out of scope.

### Edition Immutability

Official published editions are immutable. Corrections require a new edition,
new version, or republication record. Withdrawal preserves Library records,
generated files, audit, versions, and distribution history.

### Human Final Authority

AI may summarize readiness, detect blockers, and suggest remediation. AI must
not approve, publish, withdraw, distribute, bypass rights, or override human
final authority.

### Audit and Backup

Audit covers preflight generation/refresh, warning acceptance, overrides,
official edition selection, publishing state transitions, publication,
republication, withdrawal, distribution initiated, delivered, failed, and
channel withdrawal.

Backup and restore include publishing preflight results, publishing records,
distribution records, and their references to Library editions, versions,
exports, and audit history.
