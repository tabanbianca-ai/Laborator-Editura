# Codex Canonical Definitions

## Document Control

- Title: Codex Canonical Definitions.
- Identifier: CODEX-CANONICAL-DEFINITIONS.
- Version: 1.14.0.
- Status: Active specification.
- Owner: Enterprise Meta-Architecture.
- Reviewers: Platform Architecture, Documentation Governance, Quality
  Governance, Security Governance, Data Governance, AI Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/codex/meta-architecture.md`,
  `docs/codex/module-catalog.md`,
  `docs/frameworks/documentation-governance/overview.md`,
  `docs/frameworks/quality-governance/overview.md`,
  `docs/standards/naming-versioning/overview.md`,
  `docs/standards/enterprise-architecture/overview.md`,
  `docs/standards/documentation/overview.md`,
  `docs/standards/platform-lifecycle/overview.md`,
  `docs/certification/codex-v1/certification-report.md`,
  `docs/codex/catalog.md`,
  `docs/master/codex-index.md`,
  `docs/implementation/master-plan.md`.
- References: `SPEC.md`, `ROADMAP.md`, `AGENTS.md`, `docs/MANIFEST.md`.
- Change history:
  - 1.0.0: Initial canonical definition registry for repeated Codex concepts.
  - 1.1.0: Added repository-wide deduplication rules and canonical ownership
    map for repeated architecture, governance, module, framework, and standard
    information.
  - 1.2.0: Added Standard 11 canonical localization and terminology ownership.
  - 1.3.0: Added Standard 12 canonical accessibility and inclusive experience
    ownership.
  - 1.4.0: Added Standard 13 canonical rights, licensing, and provenance
    ownership.
  - 1.5.0: Added Standard 14 canonical publishing, distribution, and
    publication withdrawal ownership.
  - 1.6.0: Added Standard 15 canonical backup, restore, disaster recovery,
    and business continuity ownership.
  - 1.7.0: Added Standard 16 canonical governance, compliance, and risk
    management ownership.
  - 1.8.0: Added Standard 17 canonical enterprise architecture and dependency
    governance ownership.
  - 1.9.0: Added Standard 18 canonical documentation, knowledge management,
    and specification governance ownership.
  - 1.10.0: Added Standard 19 canonical platform lifecycle management
    ownership.
  - 1.11.0: Added Standard 20 canonical consolidation and certification
    ownership for Codex v1.0.
  - 1.12.0: Added Standard 21 standards governance meta-standard ownership.
  - 1.13.0: Added CEMI master index ownership for Codex navigation and
    enterprise orientation.
  - 1.14.0: Added CIMP implementation plan ownership for execution,
    progress, Release Candidate preparation, and final readiness.

## Purpose

This document is the canonical registry for cross-cutting Codex definitions
that appear across multiple modules, frameworks, standards, reports, and
roadmap sections.

Its purpose is to prevent parallel definitions while preserving all local
module implications, dependencies, and safety rules.

## Consolidation Rule

Cross-cutting concepts must have one canonical definition. Other documents may
summarize local implications, but they must not redefine the concept
differently.

When a conflict exists:

1. Use the canonical definition in this document.
2. Follow the canonical owner document listed for the concept.
3. Preserve module-specific dependencies as local implementation notes.
4. Record any exception through Codex Governance.

## Canonical Deduplication Rules

A repeated definition is any statement that defines the same identity,
lifecycle, authority model, data ownership, status model, access model,
workflow gate, AI rule, configuration rule, observability rule, validation
gate, release rule, or preservation rule in more than one place.

Rules:

- Each repeated concept must resolve to exactly one canonical owner.
- Local documents may retain module-specific implications, dependencies,
  events, examples, acceptance criteria, tests, warnings, and implementation
  notes.
- Local documents must not introduce alternate canonical status values,
  lifecycle states, role names, approval rules, ownership rules, API contract
  conventions, metadata conventions, deployment rules, observability schemas,
  or validation gates.
- Safety-critical reminders may remain repeated, but they must preserve the
  canonical meaning and point to the canonical owner during normalization.
- Stricter local rules are allowed only as local constraints that depend on the
  canonical definition, not as replacement definitions.
- Consolidation must preserve references, dependencies, and local ownership.
  It should remove competing definitions and duplicated explanations, not
  module context.

## Canonical Definitions

| Concept | Canonical Definition | Canonical Owner | Dependent Areas |
| --- | --- | --- | --- |
| Codex Governance | The control layer for architectural proposals, impact analysis, compatibility review, risk assessment, approval, validation, publication, exceptions, and Codex evolution. | `docs/standards/governance/overview.md`, `docs/codex/governance-framework.md` | All modules, frameworks, standards, roadmap changes. |
| Enterprise Meta-Architecture | The governing architecture above all modules, services, APIs, data models, AI agents, workflows, standards, and future extensions. | `docs/codex/meta-architecture.md` | Module catalog, dependency registry, reference models, standards. |
| Module Catalog | The canonical list of fundamental modules, specialized frameworks, canonical standards, closure rules, and architecture classification. | `docs/codex/module-catalog.md` | SPEC, ROADMAP, AGENTS, module migration plans. |
| Unified Platform | Laborator Editura is one unified editorial ecosystem with shared authentication, authorization, database, library, AI governance, audit, localization, security, and backup foundations. | `docs/MANIFEST.md`, `docs/ARCHITECTURE_CHAPTER_1.md` | Public website, application, API, modules, integrations. |
| Development Conventions | Internal implementation uses English; user-facing UI uses i18n; one authentication, session, role, and permission system serves the platform. | `docs/DEVELOPMENT_CONVENTIONS.md` | Code, docs, UI, tests, APIs, database, frontend localization. |
| Human Final Authority | AI, automation, and validation engines may recommend, explain, detect, draft, and assist, but authorized humans retain final approval for editorial, publishing, rights, security, governance, budget, certification, and production-impacting decisions. | `docs/codex/governance-framework.md`, `docs/frameworks/ai-engineering/overview.md` | AI agents, workflow, publishing, rights, security, quality, documentation. |
| AI Advisory Scope | AI output is advisory until reviewed through the applicable workflow and approved by authorized humans where approval is required. AI must not approve, publish, grant rights, bypass workflow, modify security, alter governance, hide findings, or expand its own access. | `docs/frameworks/ai-engineering/overview.md` | AI orchestration, agents, review, translation, security, quality, documentation. |
| Central IAM and RBAC | Authentication, sessions, roles, permissions, and authorization are centralized and enforced server-side. UI hiding is not authorization. | `docs/modules/iam/iam-overview.md`, `docs/frameworks/security-engineering/identity-security.md` | API, frontend, workspace, public/private routes, administration. |
| Server-Derived Context | Protected backend requests must derive user, organization, roles, and permissions from authenticated server-side session or validated token, never from client-provided identity headers. | `docs/frameworks/security-engineering/identity-security.md` | API controllers, services, repositories, audit, tenant isolation. |
| Need-to-Know | Users and AI agents receive only the information, documents, panels, actions, and metadata required by their role, project, task, assignment, scope, and confidentiality classification. The most restrictive valid rule wins. | Platform-Wide Need-to-Know Access Model directive in `AGENTS.md`, Security Engineering. | Workspace, search, library, documents, media, rights, audit, AI context. |
| Tenant Isolation | Organization, workspace, project, user, role, data, audit, backup, and AI contexts must remain isolated unless explicit authorized sharing exists. | `docs/frameworks/security-engineering/overview.md`, `docs/frameworks/data-engineering/overview.md` | Database, runtime repositories, APIs, backups, search, observability. |
| Auditability | Governance-relevant actions must produce immutable, traceable records of actor, time, scope, action, before/after state where applicable, approval, exception, and related artifact. | `docs/modules/observability/audit.md`, `docs/modules/compliance/audit-management.md` | All modules, workflows, AI, rights, publishing, security, backup. |
| Single Source of Truth | Each canonical data, workflow, terminology, documentation, or governance concept has one owner and one authoritative definition. Other modules reference it instead of creating competing sources. | `docs/frameworks/data-engineering/overview.md`, `docs/frameworks/documentation-governance/overview.md` | Library, JSON Master, data models, documentation, glossary, APIs. |
| JSON Master Format | JSON Master is the canonical structured editorial exchange, backup, export, and interoperability format for projects, documents, manuscripts, segments, translations, terminology, QA, workflow, versions, audit, rights, publishing, and future media localization metadata. | `docs/JSON_MASTER_FORMAT.md`, `packages/shared/src/json-master-format` | Export, backup, publishing, data governance, integrations, media. |
| Language Model | Platform Language controls UI and AI conversation language; Original Language identifies the original work; Authoring Language identifies the manuscript language; Target Language identifies each translation output. These fields must not be merged. | `docs/standards/localization/overview.md`, `docs/frameworks/ui-governance/localization.md`, Unified Language Management report. | Projects, authoring, translation, review, publishing, rights, AI agents. |
| Terminology Governance | Validated terminology is authoritative over Translation Memory and AI suggestions. AI may propose terminology but must not create validated terminology or override human-approved terminology. | Terminology Governance v2 directive in `AGENTS.md`, Terminology docs. | Translation, QA, semantic fidelity, lexicographic evidence, export gates. |
| Linguistic Knowledge Base | Linguistic resources are governed supporting evidence for translation, terminology, review, semantic fidelity, and quality. Copyrighted resources must not be ingested without documented authorization. | Integrated Linguistic Knowledge Base directive in `AGENTS.md`, Lexicographic and Terminology docs. | Translation, review, documentation, rights, quality, AI governance. |
| Translation Memory | Translation Memory stores validated translations as reusable proposal evidence. It may provide exact, fuzzy, and context matches, but it never replaces text automatically. | Advanced Linguistic Resources and Translation Memory directive in `AGENTS.md`, Translation Memory docs. | Translation, terminology, QA, semantic fidelity, review. |
| Editorial Production Pipeline | The user-facing production workflow is Import, Analysis, Editing or Translation, Review, Editorial Validation, Layout, Export, Technical Validation, Final Approval, Publication, with optional audiobook, video, magazine, and distribution branches. | Phase 7 pipeline reports, Workflow and Publishing docs. | Author Studio, translation, review, publishing, export, rights, distribution. |
| Publishing, Preflight and Distribution | Publishing readiness is gated by workflow approval, rights, metadata, export artifacts, technical validation, quality findings, and Human Final Authority. Preflight aggregates readiness; it does not bypass owners. Publication creates the official edition; distribution submits that edition to authorized channels and does not create independent source copies. | `docs/standards/publishing-distribution/overview.md`, Publishing module docs, Phase 7 Step 16 report, Quality Governance. | Export, public portal, commerce, rights, layout, media, distribution, Library publication lifecycle. |
| Rights and Provenance | Rights, permissions, authorship, translation authorization, publishing authorization, provenance, and attribution must be preserved and shown before publication decisions. The platform warns but does not authorize automatically. | `docs/standards/rights-provenance/overview.md`, `docs/modules/rights/rights-overview.md` | Projects, publishing, public portal, export, commerce, library. |
| Backup and Preservation | Backup, restore, retention, disaster recovery, and preservation protect platform continuity and history. A backup is not valid until restoration is verified. AI may recommend but must not restore, delete, or alter retention automatically. | `docs/standards/backup-continuity/overview.md`, `docs/modules/backup/backup-overview.md`, Platform Engineering. | Runtime database, audit, JSON Master, operations, compliance, Infrastructure Pack. |
| Documentation Governance | Official documentation is documentation-as-code, versioned, traceable, searchable, reviewed before publication, and governed as a strategic platform asset. | `docs/frameworks/documentation-governance/overview.md` | All docs, manuals, API docs, release notes, glossary, knowledge base. |
| Quality Governance | Components are not final or production-ready until evaluated through quality, architecture review, maturity assessment, technical debt review, and certification criteria. | `docs/frameworks/quality-governance/overview.md` | Modules, frameworks, releases, documentation, operations, AI. |
| Canonical Naming and Versioning | Every governed artifact requires canonical identity, naming, versioning, lifecycle state, metadata, traceability, and auditability. | `docs/standards/naming-versioning/overview.md` | Modules, services, APIs, events, documentation, AI assets, infrastructure. |
| Canonical Data Model and Metadata | Every persistent data object requires canonical structure, complete metadata, classification, validated relationships, schema evolution controls, lifecycle state, traceability, AI readiness, and auditability. | `docs/standards/data-model/overview.md` | Domain models, JSON Master, APIs, events, databases, AI assets, metadata records. |
| Canonical API, Event and Integration | Every integration interface requires a documented contract, version, owner, compatibility policy, security model, observability metadata, audit relationship, and controlled evolution path. | `docs/standards/api-governance/overview.md` | REST APIs, internal APIs, public APIs, events, webhooks, connectors, AI interfaces, service communication. |
| Canonical AI Assets, Prompt and Model | Every AI asset requires canonical identity, version, owner, lifecycle state, dependencies, prompt/model/RAG/policy metadata, evaluation evidence, security constraints, cost awareness, auditability, and Human Final Authority. | `docs/standards/ai-assets/overview.md` | AI agents, prompts, models, RAG collections, knowledge bases, evaluations, policies, AI workflows. |
| Canonical Security, Identity and Access | Every identity, permission, credential, secret, cryptographic asset, security event, and access decision requires canonical ownership, lifecycle, classification, policy, server-derived trust, least privilege, Need-to-Know, auditability, and controlled evolution. | `docs/standards/security-identity/overview.md` | Users, organizations, roles, permissions, sessions, service accounts, API clients, AI agent identities, secrets, keys, certificates, access decisions. |
| Canonical Document, Digital Asset and Content | Every document, editorial content object, media asset, publication derivative, metadata file, archive, and reusable content asset requires one canonical master, complete metadata, rights awareness, controlled derivatives, lifecycle mapping, preservation policy, version history, traceability, and auditability. | `docs/standards/digital-assets/overview.md` | Manuscripts, translations, books, articles, magazines, images, audio, video, exports, accessibility assets, marketing materials, archives. |
| Canonical Workflow, Process and Business Rules | Every workflow, process, approval flow, state machine, decision table, automation, and operational business rule requires canonical identity, version, owner, separated business rules, deterministic execution, exception policy, observability, traceability, auditability, and Human Final Authority. | `docs/standards/workflow-governance/overview.md` | Editorial workflows, translation processes, review processes, publication processes, AI workflows, approval chains, scheduling, integrations, backup, administrative processes. |
| Canonical Configuration, Environment and Deployment | Every configuration, environment, deployment artifact, feature flag, runtime parameter, service discovery record, release configuration, secret reference, and promotion path requires canonical identity, version, owner, environment scope, validation, security classification, reproducibility, rollback, auditability, and controlled promotion. | `docs/standards/configuration-governance/overview.md` | Applications, services, APIs, databases, AI components, Workflow Engine, containers, infrastructure, pipelines, staging, production, disaster recovery. |
| Canonical Logging, Audit, Monitoring and Observability | Every log, audit trail, metric, trace, health check, alert, dashboard, telemetry event, compliance monitor, and AI monitoring signal requires structured fields, correlation, severity, environment scope, tenant-safe metadata, retention, access control, audit linkage, and centralized governance. | `docs/standards/observability/overview.md` | Applications, services, APIs, AI agents, databases, workflows, infrastructure, integrations, security services, deployment pipelines. |
| Canonical Testing, Validation and Quality Gates | Every requirement, acceptance criterion, test case, execution, evidence record, defect, quality gate, waiver, AI evaluation, security test, accessibility test, migration test, and release approval requires traceability, versioning, reproducibility, risk classification, retained evidence, auditability, and mandatory gate enforcement. | `docs/standards/testing-validation/overview.md` | Tests, fixtures, CI/CD, release gates, QA, DevSecOps, AI validation, accessibility, security, migrations, backup/restore, publishing validation. |
| Canonical Internationalization, Localization and Terminology | Every user-facing text, localization resource, language policy, terminology record, regional format, localized metadata value, multimedia localization asset, and localized user message requires canonical keys, separated content and interface languages, supported locale policy, official terminology governance, fallback control, versioning, traceability, validation, and auditability. | `docs/standards/localization/overview.md` | Web, PWA, tablet, future mobile, UI governance, accessibility, terminology, multimedia localization, AI localization, backend user messages, release validation. |
| Canonical Accessibility and Inclusive Experience | Every interface, component, form, document, PDF, EPUB, image, audio asset, video asset, reader experience, accessibility profile, validation record, waiver, evidence artifact, and release gate requires accessibility by design, semantic structure, keyboard operation, assistive technology compatibility, multimedia alternatives, language-aware accessibility, automated and human validation, traceability, auditability, and release-blocking quality gates for blocking or critical violations. | `docs/standards/accessibility/overview.md` | Web, PWA, future mobile, Design System, documents, publishing, PDF, EPUB, audio, video, media localization, reader, profile preferences, testing, release validation. |
| Canonical Rights, Licensing and Provenance | Every work, manuscript, edition, translation, asset, contract, license, permission, rights holder, public-domain declaration, AI-generated resource, voice consent, derived asset, distribution channel, promotional material, and publication gate requires documented provenance, verified authorization basis, rights separated by language, territory, format and channel, controlled inheritance, expiration and revocation handling, Human Final Authority, versioning, auditability, and default publication blocking when rights are missing, expired, revoked, ambiguous, or incompatible. | `docs/standards/rights-provenance/overview.md` | Library, Rights and Provenance, Publishing, Distribution, Public Portal, Commerce, Translation, Media, Audio, Video, AI Governance, Workflow, Compliance. |
| Canonical Publishing, Distribution and Publication Withdrawal | Every official edition, publication package, metadata record, derived format, print profile, distribution record, channel connector, external synchronization record, publication update, withdrawal request, archival record, integrity record, and publication audit event requires an approved master source, exact source version, validated rights, complete metadata, accessibility evidence, controlled generation, immutable package evidence, separated distribution, traceable channel state, no direct editing of distributed files, controlled withdrawal, preserved history, Human Final Authority, and auditability. | `docs/standards/publishing-distribution/overview.md` | Library, Publishing, Export, Rights and Provenance, Accessibility, Workflow, Integration Gateway, Public Portal, Commerce, Magazine, Audio, Video, Quality Agent, Testing Standard. |
| Canonical Backup, Restore, Disaster Recovery and Business Continuity | Every protected resource, backup policy, backup execution, storage target, snapshot, replica, restore request, restore validation, RPO/RTO objective, retention rule, disaster recovery plan, degraded-operation procedure, continuity plan, backup test, integrity record, and recovery audit event requires criticality classification, 3-2-1 protection for critical data, encryption, integrity verification, retention governance, immutability where appropriate, tested restore evidence, dependency-aware recovery order, no unmanaged copies, Human Final Authority, and auditability. | `docs/standards/backup-continuity/overview.md` | Backup and Recovery, Platform Engineering, Security, Data Governance, Publishing, Rights and Provenance, Observability, Testing, Infrastructure Pack, Configuration Governance, Digital Assets. |
| Canonical Governance, Compliance and Risk Management | Every policy, standard, architectural decision, risk, exception, change, control, internal audit, governance indicator, compliance scorecard, architecture conformance report, and remediation roadmap requires canonical ownership, scope, approval, review cycle, evidence, traceability, auditability, risk-based decisioning, separation of duties, no permanent exceptions, controlled change, and Human Final Authority. | `docs/standards/governance/overview.md` | Codex Governance, Enterprise Meta-Architecture, Compliance, Policy Engine, Security Governance, AI Governance, Quality Governance, Observability, Platform Engineering, all modules, frameworks, standards, and roadmap changes. |
| Canonical Enterprise Architecture and Dependency Governance | Every module, service, application, AI agent, API, database, workflow, connector, infrastructure component, UI component, external service, dependency, interface, contract, event, and data ownership relationship requires explicit ownership, documented and versioned dependencies, approved contracts, no circular dependencies, one canonical data owner, governed interface use, dependency maps, architecture audit, controlled evolution, and auditability. | `docs/standards/enterprise-architecture/overview.md` | Codex Governance, Enterprise Meta-Architecture, Dependency Registry, Reference Models, Module Catalog, all modules, frameworks, standards, APIs, events, data models, integrations, infrastructure, and architecture consolidation. |
| Canonical Documentation, Knowledge Management and Specification Governance | Every specification, architecture document, API document, AI document, workflow definition, standard, framework, policy, guide, manual, knowledge record, and Architecture Decision Record requires canonical identity, document type, ownership, approval, lifecycle status, versioning, traceability to modules, standards, requirements, tests, risks, policies, and ADRs, semantic search readiness, AI readiness, auditability, and preservation of approved history. | `docs/standards/documentation/overview.md` | Documentation Governance, Codex Governance, Enterprise Meta-Architecture, Module Catalog, Canonical Definitions, Knowledge Base, Search, AI Governance, Quality Governance, Testing, Observability, all modules, frameworks, standards, and documentation consolidation. |
| Canonical Platform Lifecycle Management | Every module, application, service, AI agent, API, database, workflow, UI component, infrastructure component, documentation asset, publication, package, standard, framework, and policy requires a governed lifecycle stage, maturity level, version, owner, dependencies, status, support level, compatibility assessment, deprecation policy, retirement policy, end-of-life planning where applicable, auditability, and controlled evolution from idea to archive. | `docs/standards/platform-lifecycle/overview.md` | Codex Governance, Enterprise Meta-Architecture, Enterprise Architecture and Dependency Governance, Documentation Governance, Configuration Governance, Testing, Observability, Backup, Platform Engineering, all modules, frameworks, standards, releases, and long-term evolution. |
| Canonical Consolidation and Certification for Codex v1.0 | Codex v1.0 certification requires complete inventory, duplication analysis, controlled consolidation, gap analysis, architecture validation, security validation, quality validation, documentation validation, compliance validation, final certification, traceability from requirement to audit, preserved history, zero functional regression, evidence-based certification, and Codex v1.1 planning. Certification outcomes are `CERTIFIED`, `CERTIFIED_WITH_RECOMMENDATIONS`, `CONDITIONALLY_CERTIFIED`, and `NOT_CERTIFIED`. | `docs/certification/codex-v1/certification-report.md` | Codex Governance, Enterprise Meta-Architecture, Module Catalog, all modules, all frameworks, all standards, applications, APIs, data models, workflows, AI agents, documentation, infrastructure, publications, release readiness, certification evidence, and v1.1 planning. |
| Codex Standards Governance Meta-Standard | Every Codex standard, framework, policy, canonical model, specification, guide, convention, and extension requires a governed creation, approval, modification, consolidation, deprecation, and archival process with canonical identity, owner, approver, dependencies, semantic version, lifecycle stage, review cycle, compatibility assessment, traceability, auditability, and no duplication of certified standards. | `docs/codex/catalog.md` | Standards 01-20, future Codex v1.1 standards and revisions, frameworks, policies, canonical models, specifications, guides, conventions, Codex Governance, Documentation Governance, Quality Governance, certification evidence, and review calendars. |
| Canonical Enterprise Master Index | CEMI is the single navigation entry point for the approved Codex corpus. It organizes standards, frameworks, modules, specifications, policies, inventories, dependency maps, traceability records, executive reporting, and roadmaps without creating new rules or duplicating canonical definitions. | `docs/master/codex-index.md` | Standards 01-21, frameworks, modules, specifications, policies, dependency graphs, enterprise inventory, traceability matrix, executive dashboard, roadmap, certification evidence, and future approved work registration. |
| Canonical Implementation Master Plan | CIMP is the official execution plan for turning approved Codex standards into incremental implementation, documentation, testing, validation, audit evidence, progress reporting, Release Candidate preparation, and final readiness without creating new architecture standards. | `docs/implementation/master-plan.md` | CEMI, Standards 01-21, modules, frameworks, runtime implementation, tests, documentation, audit, release planning, RC1, RC2, Final Release Candidate, Codex v1.0. |
| Phase Classification | Phase II defines the 25 fundamental enterprise modules; Phase III defines cross-cutting governance frameworks; Phase IV defines canonical standards used by all modules and frameworks. | `docs/codex/module-catalog.md` | SPEC, ROADMAP, AGENTS, Manifest, future planning. |

## Canonical Ownership Map

This map consolidates repeated information into one canonical definition while
preserving references and dependencies in the local documents that use it.

| Repeated Information Area | Single Canonical Definition | Preserved Dependencies and Local Context |
| --- | --- | --- |
| Vision, mission, platform identity, and human editorial responsibility. | `docs/MANIFEST.md`. | `SPEC.md`, roadmap phases, module overviews, AI rules, publishing and rights decisions. |
| Official development conventions, internal English, UI localization, supported UI languages, and no mixed-language interface. | `docs/DEVELOPMENT_CONVENTIONS.md`, `docs/standards/localization/overview.md`. | Frontend i18n, Platform Language behavior, role labels, technical documentation, tests, user-facing terminology. |
| General, application, and module architecture. | `docs/ARCHITECTURE_CHAPTER_1.md`, `docs/ARCHITECTURE_CHAPTER_2.md`, `docs/ARCHITECTURE_CHAPTER_3.md`. | Module boundaries, shared services, dependency rules, repository patterns, frontend architecture, test expectations. |
| Enterprise architecture, module model, dependency model, data ownership, interface contracts, event topology, dependency graph, architecture audit, and consolidation roadmap. | `docs/standards/enterprise-architecture/overview.md`. | Codex Governance, Enterprise Meta-Architecture, Module Catalog, Dependency Registry, Reference Models, Application Architecture, Module Architecture, Data Governance, API Governance, Event Governance, Integration Governance, Observability, Quality Governance, all modules and standards. |
| Documentation, specifications, knowledge base, ADRs, traceability, semantic search readiness, AI-ready documentation, and documentation consolidation. | `docs/standards/documentation/overview.md`, `docs/frameworks/documentation-governance/overview.md`. | Codex Governance, Enterprise Meta-Architecture, Module Catalog, Canonical Definitions, API documentation, AI documentation, workflow documentation, standards, frameworks, policies, manuals, guides, Search, Quality Governance, Testing, Observability. |
| Platform lifecycle, maturity, semantic versioning, compatibility, deprecation, retirement, support levels, end-of-life planning, lifecycle dashboards, and controlled evolution. | `docs/standards/platform-lifecycle/overview.md`. | Codex Governance, Enterprise Meta-Architecture, Enterprise Architecture and Dependency Governance, Documentation Governance, Configuration Governance, Testing and Validation, Observability, Backup and Continuity, Platform Engineering, Release Management, all modules, frameworks, standards, applications, packages, and publications. |
| Final Codex v1.0 certification, consolidation, traceability matrix, compliance scorecard, maturity assessment, certification dashboard, executive summary, and Codex v1.1 planning baseline. | `docs/certification/codex-v1/certification-report.md`. | Codex Governance, Enterprise Meta-Architecture, Module Catalog, Canonical Definitions, Documentation Governance, Quality Governance, Testing and Validation, Security Governance, Lifecycle Governance, all approved modules, frameworks, standards, runtime foundations, infrastructure, documentation, and release readiness. |
| Standards governance, standards catalog, dependency matrix, version matrix, compliance matrix, review calendar, standard lifecycle, standard change approval, standard consolidation, deprecation, archival, and future standard control. | `docs/codex/catalog.md`. | Standards 01-20, future Codex standards and revisions, frameworks, policies, canonical models, specifications, guides, conventions, Codex Governance, Documentation Governance, Quality Governance, certification evidence, and Codex v1.1 planning. |
| Codex entry point, master navigation, enterprise inventory, master dependency map, master traceability matrix, executive dashboard, and master roadmap. | `docs/master/codex-index.md`. | Standards 01-21, framework catalog, module catalog, specifications, policies, runtime inventory, documentation inventory, certification evidence, operations, audit, and future approved work registration. |
| Implementation execution stages, module gates, progress dashboard, release plan, RC checklist, final readiness, and Release Candidate path. | `docs/implementation/master-plan.md`. | CEMI, module roadmap, progress dashboard, release plan, RC checklist, final readiness assessment, tests, compliance, documentation, audit, and release governance. |
| Module sequence, phase classification, framework classification, standard classification, and architecture closure. | `docs/codex/module-catalog.md`. | `SPEC.md`, `ROADMAP.md`, `AGENTS.md`, module migration plans, future phase planning. |
| Conceptual, logical, and physical data modeling. | `docs/ARCHITECTURE_CHAPTER_4.md`, `docs/ARCHITECTURE_CHAPTER_5.md`, `docs/ARCHITECTURE_CHAPTER_6.md`. | Domain model, aggregate map, entity relationships, database conventions, migration strategy, gap analyses. |
| Canonical data objects, metadata, JSON Master, schema evolution, and data governance. | `docs/standards/data-model/overview.md`, `docs/frameworks/data-engineering/overview.md`, `docs/JSON_MASTER_FORMAT.md`. | Export, backup, APIs, events, search, AI context, integrations, master data, publication metadata. |
| API contracts, events, webhooks, connectors, gateway, and interoperability. | `docs/standards/api-governance/overview.md`, `docs/frameworks/enterprise-integration/overview.md`. | Backend modules, external integrations, event catalogs, webhooks, API gateway, service communication. |
| AI agents, prompts, models, RAG assets, orchestration, model routing, AI governance, and Quality Agent rules. | `docs/standards/ai-assets/overview.md`, `docs/frameworks/ai-engineering/overview.md`, AI Agent Governance directives in `AGENTS.md`. | Marketplace, AI Governance, Lexicographic, Review, Translation, Quality, Observability, Policy, Cost Governance. |
| IAM, RBAC, Need-to-Know, tenant isolation, secrets, cryptography, sessions, API keys, and access decisions. | `docs/standards/security-identity/overview.md`, `docs/frameworks/security-engineering/overview.md`, `docs/modules/iam/iam-overview.md`. | Workspace, Administration, Search, Gateway, Security Governance, Launch Essentials, protected APIs, AI context filtering. |
| Documents, manuscripts, digital assets, media assets, derivatives, source preservation, and canonical master content. | `docs/standards/digital-assets/overview.md`. | Library, Documents, Author Studio, Translation, Publishing, Rights, Public Portal, Multimedia, Media Localization, Audio, Video, Magazine, Accessibility, Backup. |
| Workflow, process, business rules, state machines, approvals, exceptions, and editorial gates. | `docs/standards/workflow-governance/overview.md`, `docs/modules/workflow/workflow-overview.md`. | Editorial Pipeline, Translation, Review, Publishing, Export, Preflight, Distribution, Scheduling, AI Orchestration, Policy, Backup. |
| Configuration, environments, deployment artifacts, feature flags, runtime parameters, promotion, and rollback. | `docs/standards/configuration-governance/overview.md`, `docs/modules/configuration/configuration-overview.md`. | DevSecOps, Platform Engineering, Infrastructure Pack, staging deployment, CI/CD, security configuration, observability configuration. |
| Logging, audit, metrics, traces, health checks, alerts, dashboards, telemetry, and monitoring evidence. | `docs/standards/observability/overview.md`, `docs/modules/observability/observability-overview.md`. | Platform Engineering, Security, Workflow, AI Governance, Backup, Gateway, Infrastructure Pack, staging scripts, CI/CD. |
| Testing, validation, quality gates, defects, test evidence, release approval, and migration validation. | `docs/standards/testing-validation/overview.md`, `docs/modules/quality-assurance/qa-overview.md`, `docs/frameworks/quality-governance/overview.md`. | CI/CD, release reports, staging validation, security testing, accessibility testing, AI validation, backup/restore, publishing validation. |
| Translation, terminology, lexicographic evidence, semantic fidelity, Translation Memory, glossary hierarchy, and source priority. | Translation, Terminology, Integrated Linguistic Knowledge Base, and Advanced Linguistic Resources directives in `AGENTS.md`; Translation and Lexicographic module docs. | Review, QA, Semantic Fidelity, Author Studio, Research, Rights, Publishing, AI Governance, audit. |
| Rights, provenance, authorship, translation authorization, publishing authorization, attribution, and rights warnings. | `docs/standards/rights-provenance/overview.md`, `docs/modules/rights/rights-overview.md`. | Project Identity, Publishing, Distribution, Public Portal, Export, Commerce, Library, Preflight, Quality Agent. |
| Publishing, final preflight, distribution, publication readiness, publication derivatives, publication updates, withdrawal, and integrity evidence. | `docs/standards/publishing-distribution/overview.md`, `docs/modules/publishing/publishing-overview.md`, Phase 7 Step 16 documentation, `docs/standards/workflow-governance/overview.md`, `docs/standards/testing-validation/overview.md`. | Export, Rights, Public Portal, Commerce, Layout, Media, Distribution Center, Quality Agent, Workflow gates, Library publication lifecycle. |
| Backup, disaster recovery, retention, preservation, restore, degraded operation, and continuity. | `docs/standards/backup-continuity/overview.md`, `docs/modules/backup/backup-overview.md`, `docs/standards/digital-assets/overview.md`, `docs/standards/configuration-governance/overview.md`. | Runtime database, JSON Master, audit, infrastructure, platform engineering, compliance, release validation, Infrastructure Pack. |
| UX governance, Platform Language, accessibility, inclusive experience, workspace navigation, and user-facing terminology. | `docs/standards/accessibility/overview.md`, `docs/standards/localization/overview.md`, `docs/frameworks/ui-governance/localization.md`, `docs/modules/accessibility/accessibility-overview.md`, `docs/DEVELOPMENT_CONVENTIONS.md`. | Web UI, Administration, Dashboard, Pipeline, Translation Workspace, Review, Publishing, Library, Public Portal. |
| Administration, roles, permissions, subscriptions, Platform Creator, AI provider settings, and organizational configuration. | Administration directives in `AGENTS.md`, `docs/modules/configuration/configuration-overview.md`, `docs/modules/iam/iam-overview.md`, `docs/modules/ai-governance/ai-governance-overview.md`. | Workspace, Security, AI Cost Governance, Marketplace, Organization Management, audit, Need-to-Know. |
| Governance, compliance, risk, policies, exceptions, internal audit, controls, architecture conformance, and remediation roadmaps. | `docs/standards/governance/overview.md`, `docs/codex/governance-framework.md`, `docs/modules/compliance/compliance-overview.md`. | All modules, frameworks, standards, Codex changes, release readiness, quality governance, security governance, AI governance, operations. |

## Local Definition Rules

Module and framework documents may include local sections such as "Rules",
"AI Rules", "Security", "Audit", or "Dependencies". These sections must:

- Reference the canonical concept when repeating a cross-cutting rule.
- Explain only the local implication for that module or framework.
- Avoid introducing alternate authority, alternate lifecycle, alternate
  access model, or alternate data ownership.
- Preserve stricter local safety rules when required by the module.

## Intentional Safety Repetition

The following concepts may remain repeated as local reminders because they are
safety-critical:

- Human Final Authority.
- Server-side authorization.
- Need-to-Know.
- Tenant isolation.
- No automatic AI approval.
- Auditability.
- No runtime implementation from documentation-only phases.
- Preservation of validated behavior.

These repetitions must still point to canonical ownership when documents are
normalized.

## Governance

Changes to canonical definitions require:

1. Impact analysis.
2. Architecture review.
3. Affected module and framework review.
4. Documentation governance review.
5. Quality governance review.
6. Project owner approval.
7. Version and audit update.
