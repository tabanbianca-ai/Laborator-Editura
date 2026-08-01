# Codex Canonical Definitions

## Document Control

- Title: Codex Canonical Definitions.
- Identifier: CODEX-CANONICAL-DEFINITIONS.
- Version: 1.1.0.
- Status: Active specification.
- Owner: Enterprise Meta-Architecture.
- Reviewers: Platform Architecture, Documentation Governance, Quality
  Governance, Security Governance, Data Governance, AI Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/codex/meta-architecture.md`,
  `docs/codex/module-catalog.md`,
  `docs/frameworks/documentation-governance/overview.md`,
  `docs/frameworks/quality-governance/overview.md`,
  `docs/standards/naming-versioning/overview.md`.
- References: `SPEC.md`, `ROADMAP.md`, `AGENTS.md`, `docs/MANIFEST.md`.
- Change history:
  - 1.0.0: Initial canonical definition registry for repeated Codex concepts.
  - 1.1.0: Added repository-wide deduplication rules and canonical ownership
    map for repeated architecture, governance, module, framework, and standard
    information.

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
| Codex Governance | The control layer for architectural proposals, impact analysis, compatibility review, risk assessment, approval, validation, publication, exceptions, and Codex evolution. | `docs/codex/governance-framework.md` | All modules, frameworks, standards, roadmap changes. |
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
| Language Model | Platform Language controls UI and AI conversation language; Original Language identifies the original work; Authoring Language identifies the manuscript language; Target Language identifies each translation output. These fields must not be merged. | `docs/frameworks/ui-governance/localization.md`, Unified Language Management report. | Projects, authoring, translation, review, publishing, rights, AI agents. |
| Terminology Governance | Validated terminology is authoritative over Translation Memory and AI suggestions. AI may propose terminology but must not create validated terminology or override human-approved terminology. | Terminology Governance v2 directive in `AGENTS.md`, Terminology docs. | Translation, QA, semantic fidelity, lexicographic evidence, export gates. |
| Linguistic Knowledge Base | Linguistic resources are governed supporting evidence for translation, terminology, review, semantic fidelity, and quality. Copyrighted resources must not be ingested without documented authorization. | Integrated Linguistic Knowledge Base directive in `AGENTS.md`, Lexicographic and Terminology docs. | Translation, review, documentation, rights, quality, AI governance. |
| Translation Memory | Translation Memory stores validated translations as reusable proposal evidence. It may provide exact, fuzzy, and context matches, but it never replaces text automatically. | Advanced Linguistic Resources and Translation Memory directive in `AGENTS.md`, Translation Memory docs. | Translation, terminology, QA, semantic fidelity, review. |
| Editorial Production Pipeline | The user-facing production workflow is Import, Analysis, Editing or Translation, Review, Editorial Validation, Layout, Export, Technical Validation, Final Approval, Publication, with optional audiobook, video, magazine, and distribution branches. | Phase 7 pipeline reports, Workflow and Publishing docs. | Author Studio, translation, review, publishing, export, rights, distribution. |
| Publishing, Preflight and Distribution | Publishing readiness is gated by workflow approval, rights, metadata, export artifacts, technical validation, quality findings, and Human Final Authority. Preflight aggregates readiness; it does not bypass owners. | Publishing module docs, Phase 7 Step 16 report, Quality Governance. | Export, public portal, commerce, rights, layout, media, distribution. |
| Rights and Provenance | Rights, permissions, authorship, translation authorization, publishing authorization, provenance, and attribution must be preserved and shown before publication decisions. The platform warns but does not authorize automatically. | `docs/modules/rights/rights-overview.md` | Projects, publishing, public portal, export, commerce, library. |
| Backup and Preservation | Backup, restore, retention, disaster recovery, and preservation protect platform continuity and history. AI may recommend but must not restore, delete, or alter retention automatically. | `docs/modules/backup/backup-overview.md`, Platform Engineering. | Runtime database, audit, JSON Master, operations, compliance. |
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
| Phase Classification | Phase II defines the 25 fundamental enterprise modules; Phase III defines cross-cutting governance frameworks; Phase IV defines canonical standards used by all modules and frameworks. | `docs/codex/module-catalog.md` | SPEC, ROADMAP, AGENTS, Manifest, future planning. |

## Canonical Ownership Map

This map consolidates repeated information into one canonical definition while
preserving references and dependencies in the local documents that use it.

| Repeated Information Area | Single Canonical Definition | Preserved Dependencies and Local Context |
| --- | --- | --- |
| Vision, mission, platform identity, and human editorial responsibility. | `docs/MANIFEST.md`. | `SPEC.md`, roadmap phases, module overviews, AI rules, publishing and rights decisions. |
| Official development conventions, internal English, UI localization, supported UI languages, and no mixed-language interface. | `docs/DEVELOPMENT_CONVENTIONS.md`. | Frontend i18n, Platform Language behavior, role labels, technical documentation, tests, user-facing terminology. |
| General, application, and module architecture. | `docs/ARCHITECTURE_CHAPTER_1.md`, `docs/ARCHITECTURE_CHAPTER_2.md`, `docs/ARCHITECTURE_CHAPTER_3.md`. | Module boundaries, shared services, dependency rules, repository patterns, frontend architecture, test expectations. |
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
| Rights, provenance, authorship, translation authorization, publishing authorization, attribution, and rights warnings. | `docs/modules/rights/rights-overview.md`. | Project Identity, Publishing, Distribution, Public Portal, Export, Commerce, Library, Preflight, Quality Agent. |
| Publishing, final preflight, distribution, publication readiness, and publication derivatives. | `docs/modules/publishing/publishing-overview.md`, Phase 7 Step 16 documentation, `docs/standards/workflow-governance/overview.md`, `docs/standards/testing-validation/overview.md`. | Export, Rights, Public Portal, Commerce, Layout, Media, Distribution Center, Quality Agent, Workflow gates. |
| Backup, disaster recovery, retention, preservation, restore, and continuity. | `docs/modules/backup/backup-overview.md`, `docs/standards/digital-assets/overview.md`, `docs/standards/configuration-governance/overview.md`. | Runtime database, JSON Master, audit, infrastructure, platform engineering, compliance, release validation. |
| UX governance, Platform Language, accessibility, inclusive experience, workspace navigation, and user-facing terminology. | `docs/frameworks/ui-governance/localization.md`, `docs/modules/accessibility/accessibility-overview.md`, `docs/DEVELOPMENT_CONVENTIONS.md`. | Web UI, Administration, Dashboard, Pipeline, Translation Workspace, Review, Publishing, Library, Public Portal. |
| Administration, roles, permissions, subscriptions, Platform Creator, AI provider settings, and organizational configuration. | Administration directives in `AGENTS.md`, `docs/modules/configuration/configuration-overview.md`, `docs/modules/iam/iam-overview.md`, `docs/modules/ai-governance/ai-governance-overview.md`. | Workspace, Security, AI Cost Governance, Marketplace, Organization Management, audit, Need-to-Know. |

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
