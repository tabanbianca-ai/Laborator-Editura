# Codex Redundancy Consolidation Report

## Document Control

- Title: Codex Redundancy Consolidation Report.
- Identifier: CODEX-REDUNDANCY-CONSOLIDATION-REPORT.
- Version: 2.10.0.
- Status: Active consolidation report.
- Owner: Enterprise Meta-Architecture.
- Reviewers: Documentation Governance, Quality Governance, Data Governance,
  Security Governance, AI Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/codex/canonical-definitions.md`,
  `docs/codex/module-catalog.md`, `docs/codex/meta-architecture.md`,
  `docs/frameworks/documentation-governance/overview.md`,
  `docs/frameworks/quality-governance/overview.md`.
- Change history:
  - 1.0.0: Initial consolidation of repeated Phase II closure statements.
  - 2.0.0: Expanded consolidation for cross-cutting Codex definitions.
  - 2.1.0: Added repository-wide consolidation pass for repeated module,
    framework, standard, governance, validation, and launch readiness
    information.
  - 2.2.0: Added Standard 11 localization and terminology ownership to the
    consolidation baseline.
  - 2.3.0: Added Standard 12 accessibility and inclusive experience
    ownership to the consolidation baseline.
  - 2.4.0: Added Standard 13 rights, licensing, and provenance ownership to
    the consolidation baseline.
  - 2.5.0: Added Standard 14 publishing, distribution, and publication
    withdrawal ownership to the consolidation baseline.
  - 2.6.0: Added Standard 15 backup, restore, disaster recovery, and business
    continuity ownership to the consolidation baseline.
  - 2.7.0: Added Standard 16 governance, compliance, and risk management
    ownership to the consolidation baseline.
  - 2.8.0: Added Standard 17 enterprise architecture and dependency
    governance ownership to the consolidation baseline.
  - 2.9.0: Added Standard 18 documentation, knowledge management, and
    specification governance ownership to the consolidation baseline.
  - 2.10.0: Added Standard 19 platform lifecycle management ownership to the
    consolidation baseline.

## Purpose

This report records the analysis and consolidation of overlapping, redundant,
or duplicated Codex governance information. It does not change runtime
behavior, APIs, database schema, frontend behavior, Docker configuration, or
infrastructure.

## Executive Summary

The Codex contains intentional repetition because safety-critical governance
rules must remain visible in local module contexts. However, repeated
definitions can create drift when the same concept is restated differently in
root specifications, module documents, frameworks, standards, and reports.

This consolidation establishes:

- `docs/codex/canonical-definitions.md` as the single canonical registry for
  repeated cross-cutting concepts.
- `docs/codex/module-catalog.md` as the canonical owner for module,
  framework, standard, and phase classification.
- `docs/codex/meta-architecture.md` as the canonical owner for Codex evolution
  and governance rules.
- Framework 08 as the canonical owner for documentation governance.
- Framework 09 as the canonical owner for quality, architecture review, and
  certification.
- Standard 01 as the canonical owner for naming, identification, metadata,
  lifecycle, and versioning.

## Audit Method

The audit inspected:

- Root governance documents: `SPEC.md`, `ROADMAP.md`, `AGENTS.md`.
- Manifest and development conventions.
- Architecture chapters.
- Codex governance documents.
- Module documentation under `docs/modules`.
- Framework documentation under `docs/frameworks`.
- Standard documentation under `docs/standards`.
- Release, staging, validation, and production readiness reports.
- Runtime module and package structure at inventory level only.

The audit searched repeated cross-cutting terms including:

- `Human Final Authority`.
- `Need-to-Know`.
- `JSON Master`.
- `Platform Language`.
- `Single Source of Truth`.
- `Semantic Versioning`.
- `AI may`.
- `server-derived`.
- `tenant isolation`.
- `auditability`.
- `dependency governance`.
- `data ownership`.
- `module boundaries`.
- `documentation as code`.
- `Architecture Decision Record`.
- `knowledge base`.
- `semantic search`.
- `platform lifecycle`.
- `deprecation`.
- `retirement`.
- `end-of-life`.

## 2026-08-01 Consolidation Pass

This pass reviewed repeated Codex information across root governance
documents, module documentation, framework documentation, canonical standards,
release and staging reports, and infrastructure validation documentation.
Repository-wide search found repeated cross-cutting governance terminology in
449 documentation files.

The consolidation decision is documentation-only:

- Keep `docs/codex/canonical-definitions.md` as the single canonical registry
  for repeated cross-cutting definitions.
- Keep `docs/codex/module-catalog.md` as the single canonical owner for module,
  framework, standard, and phase classification.
- Keep local module and framework documents as dependency-preserving context,
  not as competing definition sources.
- Preserve safety-critical local reminders where they prevent unsafe
  interpretation.
- Do not change application code, APIs, database schema, Docker, staging,
  frontend behavior, tests, or infrastructure scripts.

### Redundancy Patterns Consolidated

| Redundant Pattern | Canonical Owner | Consolidation Rule |
| --- | --- | --- |
| Human Final Authority repeated in AI, workflow, rights, publishing, backup, security, quality, and documentation contexts. | `docs/codex/canonical-definitions.md`, `docs/codex/governance-framework.md`, `docs/frameworks/ai-engineering/overview.md`. | Keep as safety reminder locally; do not redefine approval authority. |
| Need-to-Know repeated across IAM, workspace, search, documents, media, AI context, administration, and privacy. | `docs/standards/security-identity/overview.md`, Security Engineering, Need-to-Know directive in `AGENTS.md`. | Local docs specify scope only; enforcement model remains server-side and canonical. |
| JSON Master repeated across data, export, backup, publishing, media, integrations, and roadmap. | `docs/JSON_MASTER_FORMAT.md`, `docs/standards/data-model/overview.md`. | Local docs may list owned JSON sections but must not create alternate master formats. |
| Language model and Platform Language repeated across UI, AI, projects, translation, administration, and accessibility. | `docs/DEVELOPMENT_CONVENTIONS.md`, UI Governance localization, Unified Language Management directive in `AGENTS.md`. | Platform Language controls UI only; Original, Authoring, and Target Language remain separate. |
| AI advisory limits repeated across AI agents, modules, marketplace, orchestration, policy, and cost governance. | `docs/standards/ai-assets/overview.md`, AI Engineering, AI Governance directives. | AI may recommend and assist; it must not approve, publish, grant rights, alter security, or bypass workflow. |
| Security, identity, server-derived trust, tenant isolation, secrets, and cryptography repeated across security, gateway, configuration, DevSecOps, and administration. | `docs/standards/security-identity/overview.md`, `docs/frameworks/security-engineering/overview.md`. | Local docs may add stricter controls; trust and access models remain canonical. |
| Documents, assets, derivatives, media, source preservation, and publication content repeated across Library, Author Studio, Publishing, Rights, Media, Audio, Video, Magazine, Accessibility, and Backup. | `docs/standards/digital-assets/overview.md`. | Local docs describe asset use; canonical master, derivative, lifecycle, and preservation rules remain unified. |
| Workflows, approvals, state machines, process rules, exceptions, and editorial gates repeated across Workflow Engine, Pipeline, Review, Publishing, Export, Scheduling, Policy, and Backup. | `docs/standards/workflow-governance/overview.md`, `docs/modules/workflow/workflow-overview.md`. | Local docs define module-specific steps only; canonical workflow and business rule governance owns state and gate rules. |
| Configuration, environments, deployment, feature flags, runtime parameters, staging, rollback, and Infrastructure Pack rules repeated across operations docs. | `docs/standards/configuration-governance/overview.md`. | Local docs may provide environment-specific values and procedures; canonical configuration governance owns model and promotion rules. |
| Logs, audit, metrics, traces, health checks, alerts, dashboards, telemetry, and monitoring repeated across Observability, Security, Platform Engineering, Workflow, AI Governance, Backup, Gateway, and CI/CD. | `docs/standards/observability/overview.md`, `docs/modules/observability/observability-overview.md`. | Local docs list events and signals; canonical observability owns structure and retention/access rules. |
| Tests, validation, quality gates, evidence, defects, release approval, migration testing, accessibility testing, security testing, and AI validation repeated across QA, Quality Governance, DevSecOps, release reports, and staging plans. | `docs/standards/testing-validation/overview.md`, `docs/modules/quality-assurance/qa-overview.md`, Quality Governance. | Local docs list required tests; canonical validation standard owns traceability, evidence, gates, and waiver rules. |
| Internationalization, localization, interface language purity, terminology, fallback, regional formatting, and localized user messages repeated across Development Conventions, UI Governance, Accessibility, Configuration, Language Policy, and frontend docs. | `docs/standards/localization/overview.md`, `docs/DEVELOPMENT_CONVENTIONS.md`, UI Governance localization. | Local docs may describe surface-specific behavior; Standard 11 owns canonical localization resource, key, fallback, terminology, regional formatting, and audit rules. |
| Accessibility, inclusive experience, keyboard operation, semantic UI, PDF/EPUB accessibility, audio/video alternatives, accessibility profiles, and release-blocking accessibility evidence repeated across Accessibility Module, UI Governance, Testing Validation, Publishing, Media, and release docs. | `docs/standards/accessibility/overview.md`, `docs/modules/accessibility/accessibility-overview.md`, UI Governance accessibility. | Local docs may describe module-specific surfaces and tools; Standard 12 owns canonical accessibility evaluation, component, profile, evidence, severity, waiver, and release gate rules. |
| Rights, licenses, provenance, contracts, public-domain validation, translation rights, voice consent, AI content rights, derived asset inheritance, and publication rights gates repeated across Rights Module, Library, Publishing, Distribution, Commerce, Media, AI Governance, Workflow, and Compliance docs. | `docs/standards/rights-provenance/overview.md`, `docs/modules/rights/rights-overview.md`. | Local docs may describe module operations and current implementation; Standard 13 owns canonical rights record, holder, authorization basis, language/territory/format/channel, provenance, inheritance, expiration, revocation, and publication gate rules. |
| Publishing, distribution, publication packages, publication manifests, generated formats, channel connectors, updates, corrections, withdrawal, archival preservation, and integrity checks repeated across Library, Publishing, Export, Public Portal, Commerce, Rights, Accessibility, Magazine, Audio, Video, Workflow, and release docs. | `docs/standards/publishing-distribution/overview.md`, `docs/modules/publishing/publishing-overview.md`, Phase 7 Step 16 documentation. | Local docs may describe module operations and current implementation; Standard 14 owns canonical publishable edition, package, metadata, format, distribution, connector, update, withdrawal, integrity, and audit rules. |
| Backup, restore, retention, preservation, disaster recovery, RPO/RTO, restore validation, degraded operation, continuity, infrastructure backup, secret recovery, and backup evidence repeated across Backup Module, Platform Engineering, Security, Configuration, Observability, Infrastructure Pack, Data Governance, Digital Assets, Publishing, and release docs. | `docs/standards/backup-continuity/overview.md`, `docs/modules/backup/backup-overview.md`. | Local docs may describe module operations, scripts, and environment procedures; Standard 15 owns canonical resource classification, 3-2-1 rule, policy, execution, restore, validation, RPO/RTO, retention, DR, continuity, degraded operation, integrity, and audit rules. |
| Governance, compliance, risk, policies, architecture review, standards, exceptions, controls, internal audit, maturity assessment, scorecards, and remediation repeated across Codex Governance, Compliance Module, Quality Governance, Security Governance, AI Governance, Platform Engineering, release reports, and module gap analyses. | `docs/standards/governance/overview.md`, `docs/codex/governance-framework.md`, `docs/modules/compliance/compliance-overview.md`. | Local docs may describe module operations and current implementation; Standard 16 owns canonical policy, risk, change, control, exception, internal audit, dashboard, conformance, and remediation rules. |
| Enterprise architecture, module boundaries, dependencies, data ownership, API contracts, events, architecture audit, dependency graphs, and consolidation roadmaps repeated across Codex Governance, architecture chapters, module documentation, data models, API/event docs, integration docs, and roadmap sections. | `docs/standards/enterprise-architecture/overview.md`, `docs/codex/meta-architecture.md`, `docs/codex/dependency-registry.md`. | Local docs may describe module-specific dependencies and contracts; Standard 17 owns canonical module model, dependency model, data ownership model, API/event contract governance, dependency graph, architecture audit, and consolidation roadmap rules. |
| Documentation as Code, specifications, document metadata, versioning, ADRs, knowledge base, traceability, semantic search readiness, AI-ready documentation, and documentation consolidation repeated across Documentation Governance, Codex Governance, architecture chapters, module docs, standards, frameworks, API docs, AI docs, workflow docs, release reports, and operations docs. | `docs/standards/documentation/overview.md`, `docs/frameworks/documentation-governance/overview.md`, `docs/codex/canonical-definitions.md`. | Local docs may preserve operational guidance and module-specific documentation context; Standard 18 owns canonical document model, specification standard, ADR standard, knowledge base model, semantic search readiness, compliance audit, and documentation consolidation roadmap rules. |
| Lifecycle stages, maturity levels, semantic versioning, compatibility, deprecation, retirement, support levels, release readiness, operation, monitoring, improvement, and end-of-life planning repeated across roadmaps, module plans, release reports, operations docs, DevSecOps, Platform Engineering, Configuration, Testing, Observability, Backup, and standards. | `docs/standards/platform-lifecycle/overview.md`, `docs/codex/module-catalog.md`, `docs/standards/naming-versioning/overview.md`. | Local docs may describe release-specific or component-specific lifecycle context; Standard 19 owns canonical lifecycle stages, maturity model, compatibility assessment, deprecation policy, retirement policy, dashboard model, baseline audit, and lifecycle roadmap rules. |
| Translation, terminology, lexicography, semantic fidelity, Translation Memory, glossary hierarchy, and confidence scoring repeated across linguistic modules. | Translation, Terminology, Integrated Linguistic Knowledge Base, and Advanced Linguistic Resources directives in `AGENTS.md`; module docs. | Local docs preserve language-pair/domain behavior; canonical linguistic priority and evidence rules remain shared. |

### Dependency Preservation

No dependency reference is removed by this consolidation. Module documents may
continue to reference upstream and downstream modules, APIs, events, JSON
sections, tests, workflows, data models, and audit events. The only prohibited
pattern is a local document redefining a cross-cutting canonical concept with a
different meaning.

## Repetition Findings

The largest repeated concepts are:

| Concept | Observed Pattern | Consolidation |
| --- | --- | --- |
| Need-to-Know | Repeated across security, IAM, workspace, search, library, AI, documents, media, and administration. | Canonical definition added to `docs/codex/canonical-definitions.md`; local documents should reference it and retain only local scope rules. |
| JSON Master | Repeated across data governance, export, backup, publishing, media, and roadmap sections. | Canonical definition added and owner remains `docs/JSON_MASTER_FORMAT.md`. |
| Human Final Authority | Repeated across AI, workflow, publishing, rights, quality, documentation, security, and backup. | Canonical definition added; repetition remains allowed as a safety-critical local reminder. |
| Platform Language and language model | Repeated across UI governance, configuration, AI, projects, translation, reports, and root specs. | Canonical definition added; owner remains UI Governance and Unified Language Management. |
| AI advisory limits | Repeated in almost every AI-adjacent module. | Canonical definition added; module-level "AI may / AI may not" lists remain local implications. |
| Single Source of Truth | Repeated across library, data governance, documentation, and JSON Master. | Canonical definition added with ownership split by data and documentation governance. |
| Auditability | Repeated across all governance-sensitive modules. | Canonical definition added; audit module and compliance remain owners for detailed audit behavior. |
| Quality and production readiness | Repeated across release reports, QA, DevSecOps, and framework docs. | Canonical owner is Framework 09. |
| Naming and versioning | Repeated across database, documentation, release, API, and Codex versioning docs. | Canonical owner is Standard 01. |
| Canonical data model and metadata | Repeated across domain, logical data, physical database, data governance, JSON Master, API contracts, events, backup, and AI readiness documentation. | Canonical owner is Standard 02, with Framework 03 as data governance framework. |
| API, event, webhook, and integration contracts | Repeated across backend API standards, integration contracts, enterprise integration framework, Codex API catalogs, event catalogs, webhook docs, gateway docs, and module API/event docs. | Canonical owner is Standard 03, with Framework 06 as integration governance framework. |
| AI assets, prompts, models, RAG, and AI policies | Repeated across AI architecture, AI Engineering framework, AI Governance, AI Orchestration, Marketplace, Observability, Policy, and agent governance documentation. | Canonical owner is Standard 04, with Framework 04 as AI engineering framework. |
| Security, identity, access, secrets, and cryptography | Repeated across Chapter 9, IAM, security docs, security engineering framework, Gateway, Enterprise Admin, Workspace, Launch Essentials, DevSecOps, and infrastructure security docs. | Canonical owner is Standard 05, with Framework 07 as security engineering framework. |
| Documents, digital assets, editorial content, derivatives, and preservation | Repeated across Library, Documents, Author Studio, Translation, Publishing, Rights, Public Portal, Multimedia, Media Localization, Audio, Video, Magazine, Accessibility, Backup, JSON Master, and data model docs. | Canonical owner is Standard 06, with Library, Documentation Governance, Publishing, and Rights as operational owners. |
| Workflows, processes, business rules, state machines, approvals, and exceptions | Repeated across Workflow Engine, Editorial Pipeline, Translation, Review, Publishing, Export, Preflight, Distribution, AI Orchestration, Scheduling, Policy, Backup, Observability, and Integration docs. | Canonical owner is Standard 07, with Workflow Engine and Business Process Governance as operational owners. |
| Configuration, environments, deployment, feature flags, runtime parameters, and promotion | Repeated across Configuration, DevSecOps, Platform Engineering, Security, Observability, Backup, Gateway, AI Governance, Infrastructure Pack, staging deployment, and CI/CD docs. | Canonical owner is Standard 08, with Configuration Governance, Platform Engineering, and DevSecOps as operational owners. |
| Logging, audit trails, metrics, traces, health checks, alerts, dashboards, and telemetry | Repeated across Observability, Platform Engineering, Security, DevSecOps, Workflow, AI Governance, Backup, Gateway, Configuration, Infrastructure Pack, staging scripts, and CI/CD docs. | Canonical owner is Standard 09, with Observability, Monitoring and Audit Governance as operational owner. |
| Testing, validation, quality gates, defects, evidence, and release approval | Repeated across Quality Assurance, Quality Governance, DevSecOps, release reports, CI/CD, staging validation, security, accessibility, AI Governance, Backup, and workflow docs. | Canonical owner is Standard 10, with Quality Assurance, Testing and Validation Governance as operational owner. |
| Internationalization, localization, terminology, regional formatting, fallback, and localized user messages | Repeated across Development Conventions, UI Governance, Accessibility, Configuration Localization, Language Policy, frontend i18n docs, and Testing Validation docs. | Canonical owner is Standard 11, with Localization, Terminology and Inclusive Experience Governance as operational owner. |
| Accessibility, inclusive UX, keyboard/focus behavior, accessible documents, accessible media, profiles, validation evidence, and release-blocking accessibility issues | Repeated across Accessibility Module, UI Governance, Testing Validation, Publishing, Media Localization, Audio, Video, Digital Assets, and release docs. | Canonical owner is Standard 12, with Accessibility and Inclusive Experience Governance as operational owner. |
| Rights, licensing, provenance, public-domain validation, derived assets, voice consent, AI content rights, expiration, revocation, and publication blocking | Repeated across Rights Module, Library, Publishing, Distribution, Public Portal, Commerce, Translation, Media, Audio, Video, AI Governance, Workflow, Data Governance, and Compliance docs. | Canonical owner is Standard 13, with Rights, Licensing and Provenance Governance as operational owner. |
| Publishing, distribution, publication packages, manifests, generated formats, channel synchronization, publication updates, corrections, withdrawal, archival preservation, and integrity validation | Repeated across Library, Publishing, Export, Public Portal, Commerce, Rights, Accessibility, Magazine, Audio, Video, Workflow, Quality Agent, Testing, and release docs. | Canonical owner is Standard 14, with Publishing, Distribution and Publication Withdrawal Governance as operational owner. |
| Backup, restore, retention, preservation, disaster recovery, RPO/RTO, degraded operation, continuity, infrastructure backup, secret/key recovery, restore testing, and backup evidence | Repeated across Backup Module, Platform Engineering, Security, Configuration, Observability, Infrastructure Pack, Data Governance, Digital Assets, Publishing, Rights, Testing, and release docs. | Canonical owner is Standard 15, with Backup, Restore, Disaster Recovery and Business Continuity Governance as operational owner. |
| Governance, compliance, risk, policies, architecture exceptions, change management, internal controls, audit, scorecards, conformance reports, and remediation | Repeated across Codex Governance, Meta-Architecture, Compliance Module, Policy Engine, Quality Governance, Security Governance, AI Governance, Platform Engineering, Observability, release reports, standards, and module gap analyses. | Canonical owner is Standard 16, with Governance, Compliance and Risk Management as operational owner. |
| Enterprise architecture, module boundaries, dependency declarations, data ownership, interface contracts, event topology, dependency graph, architecture audit, and consolidation roadmap | Repeated across Codex Governance, Meta-Architecture, Dependency Registry, Reference Models, architecture chapters, module documentation, data/domain docs, API/event docs, integration docs, and roadmap sections. | Canonical owner is Standard 17, with Enterprise Architecture and Dependency Governance as operational owner. |
| Documentation, specifications, knowledge base, ADRs, document metadata, traceability, semantic search readiness, AI-ready documentation, and documentation consolidation | Repeated across Documentation Governance, Codex Governance, architecture chapters, module documentation, framework docs, standard docs, API docs, AI docs, workflow docs, release reports, operations docs, and root specifications. | Canonical owner is Standard 18, with Documentation, Knowledge Management and Specification Governance as operational owner. |
| Platform lifecycle, component maturity, semantic versioning, compatibility, release operation, monitoring, improvement, deprecation, retirement, support levels, and end-of-life planning | Repeated across roadmap sections, module plans, release readiness documents, operations documents, DevSecOps, Platform Engineering, Configuration, Testing, Observability, Backup, and standards. | Canonical owner is Standard 19, with Platform Lifecycle Management as operational owner. |
| Phase closure and module sequence | Previously repeated in module migration plans. | Canonical owner remains `docs/codex/module-catalog.md`. |

## Canonical Definitions

The complete canonical definition registry is:

- `docs/codex/canonical-definitions.md`.

Local documents must not create competing definitions for the same
cross-cutting concepts. They may keep local rules, examples, constraints, and
acceptance criteria.

## Preserved Information

No information was intentionally removed. The consolidation preserves:

- Module-specific responsibilities.
- Framework-specific responsibilities.
- Standard-specific rules.
- Security-critical local reminders.
- AI boundaries.
- Rights, workflow, publishing, quality, audit, and documentation gates.
- Existing references and dependency paths.
- Existing compatibility and migration warnings.

## Removed or Reduced Redundancy

This pass removes structural redundancy by creating a single canonical
definition registry and linking the existing meta-architecture and module
catalog to it.

It does not perform broad mechanical deletion across hundreds of documents
because many repeated statements are intentionally local safety reminders.
Future normalization should convert repeated explanations into references only
after document owners review each area.

## Ownership Snapshot

The authoritative ownership map is maintained in
`docs/codex/canonical-definitions.md`. This report keeps the following
snapshot only as consolidation evidence for the audited pass.

| Area | Canonical Owner at Audit Time |
| --- | --- |
| Cross-cutting definitions | `docs/codex/canonical-definitions.md` |
| Module sequence and phase closure | `docs/codex/module-catalog.md` |
| Governance workflow and exceptions | `docs/codex/governance-framework.md` |
| Meta-architecture and evolution | `docs/codex/meta-architecture.md` |
| Dependencies | `docs/codex/dependency-registry.md` |
| Reference models | `docs/codex/reference-models.md` |
| Documentation governance | `docs/frameworks/documentation-governance/overview.md` |
| Quality and certification | `docs/frameworks/quality-governance/overview.md` |
| Naming and versioning | `docs/standards/naming-versioning/overview.md` |
| Canonical data model and metadata | `docs/standards/data-model/overview.md` |
| API, event, webhook, and integration governance | `docs/standards/api-governance/overview.md` |
| AI assets, prompts, models, RAG, and AI policy governance | `docs/standards/ai-assets/overview.md` |
| Security, identity, access, secrets, and cryptography governance | `docs/standards/security-identity/overview.md` |
| Documents, digital assets, editorial content, derivatives, and preservation | `docs/standards/digital-assets/overview.md` |
| Workflow, process, business rule, state machine, and approval governance | `docs/standards/workflow-governance/overview.md` |
| Configuration, environment, deployment, feature flag, and runtime governance | `docs/standards/configuration-governance/overview.md` |
| Logging, audit, monitoring, metrics, tracing, alerting, and observability governance | `docs/standards/observability/overview.md` |
| Testing, validation, quality gate, defect, evidence, and release approval governance | `docs/standards/testing-validation/overview.md` |
| Internationalization, localization, terminology, regional formatting, fallback, and localized message governance | `docs/standards/localization/overview.md` |
| Accessibility, inclusive experience, accessible components, accessible documents, accessible media, accessibility profiles, testing evidence, and remediation governance | `docs/standards/accessibility/overview.md` |
| Rights, licensing, provenance, rights holders, contracts, licenses, public-domain validation, derived assets, translation rights, media rights, voice consent, AI content rights, and publication gate governance | `docs/standards/rights-provenance/overview.md` |
| Publishing, distribution, publication packages, metadata, digital formats, print publication, channel connectors, updates, withdrawal, archival preservation, and integrity validation governance | `docs/standards/publishing-distribution/overview.md` |
| Backup, restore, disaster recovery, business continuity, RPO/RTO, retention, immutability, degraded operation, restore testing, and recovery evidence governance | `docs/standards/backup-continuity/overview.md` |
| Governance, compliance, risk, policies, change management, architecture exceptions, internal controls, internal audit, dashboards, conformance, and remediation governance | `docs/standards/governance/overview.md` |
| Enterprise architecture, dependency governance, module ownership, data ownership, interface contracts, event topology, dependency graphs, architecture audit, and consolidation roadmap governance | `docs/standards/enterprise-architecture/overview.md` |
| Documentation, knowledge management, specifications, ADRs, traceability, semantic search readiness, AI-ready documentation, and documentation consolidation governance | `docs/standards/documentation/overview.md` |
| Platform lifecycle, maturity, semantic versioning, compatibility, deprecation, retirement, support, end-of-life, lifecycle dashboard, and controlled evolution governance | `docs/standards/platform-lifecycle/overview.md` |
| Data and JSON Master governance | `docs/frameworks/data-engineering/overview.md`, `docs/JSON_MASTER_FORMAT.md` |
| Security and access | `docs/frameworks/security-engineering/overview.md`, `docs/modules/iam/iam-overview.md` |
| AI governance | `docs/frameworks/ai-engineering/overview.md`, `docs/modules/ai-governance/ai-governance-overview.md` |

## Intentional Repetition Policy

The following statements may remain repeated in local documents because they
protect the platform from unsafe interpretation:

- AI cannot approve, publish, grant rights, change security, or bypass
  workflow.
- Authorized humans retain final authority.
- Protected data requires server-side authorization.
- Need-to-Know must be enforced.
- Tenant isolation must be preserved.
- Audit is mandatory for governance-relevant actions.
- Documentation-only phases do not authorize runtime implementation.
- Validated functionality must not be broken by governance cleanup.

When repeated, these statements should reference canonical ownership during
future normalization.

## Remaining Consolidation Work

Recommended next cleanup:

1. Add a traceability matrix from canonical definitions to all dependent
   documents.
2. Normalize older document control metadata using Framework 08.
3. Convert duplicate explanatory paragraphs into references in high-traffic
   documents.
4. Build a canonical artifact registry using Standard 01.
5. Consolidate technical debt items from module gap analyses into Framework
   09 technical debt records.
6. Add documentation linting after tooling is explicitly approved.

## No Runtime Impact

This consolidation changes documentation structure only. It does not modify:

- Application code.
- API contracts at runtime.
- Database schema.
- Docker or staging configuration.
- Frontend behavior.
- Tests.
- Infrastructure scripts.
