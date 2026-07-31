# Codex Canonical Definitions

## Document Control

- Title: Codex Canonical Definitions.
- Identifier: CODEX-CANONICAL-DEFINITIONS.
- Version: 1.0.0.
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
| Phase Classification | Phase II defines the 25 fundamental enterprise modules; Phase III defines cross-cutting governance frameworks; Phase IV defines canonical standards used by all modules and frameworks. | `docs/codex/module-catalog.md` | SPEC, ROADMAP, AGENTS, Manifest, future planning. |

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
