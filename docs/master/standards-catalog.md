# CEMI Standards Catalog

## Document Control

| Field | Value |
| --- | --- |
| Identifier | CODEX-CEMI-STANDARDS-CATALOG |
| Version | 1.0.0 |
| Status | Official master catalog |
| Owner | Codex Enterprise Governance |
| Canonical source | `docs/codex/catalog.md` |

## Purpose

This document summarizes the official standards, frameworks, policies, and
specifications used by Codex v1.0. It does not replace the canonical owner
documents. It points to them.

## Certification Wording

The `Certified` status in this master catalog refers to approved standards and
documentation baselines. It does not mean the Codex v1.0 product release is
certified.

Product release certification is governed only by
`docs/releases/v1.0/certification-record.md`.

## Standards Catalog

| ID | Title | Version | Status | Owner | Dependencies | Affected modules | Associated frameworks |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard 01 | Canonical Naming, Identification and Versioning | 1.0.0 | Certified | Naming and Versioning Governance | Manifest, conventions | All modules | Documentation Governance, Quality Governance |
| Standard 02 | Canonical Data Model and Metadata | 1.0.0 | Certified | Data Governance | Standard 01 | Data, DB, JSON Master, all modules | Data Engineering |
| Standard 03 | Canonical API, Event and Integration | 1.0.0 | Certified | API Governance | Standards 01-02 | API, Gateway, Integration, all API modules | Enterprise Integration |
| Standard 04 | Canonical AI Assets, Prompt and Model | 1.0.0 | Certified | AI Governance | Standards 01-03 | AI Governance, agents, Marketplace | AI Engineering |
| Standard 05 | Canonical Security, Identity and Access | 1.0.0 | Certified | Security Governance | Standards 01-04 | Auth, IAM, Security, all protected modules | Security Engineering |
| Standard 06 | Canonical Document, Digital Asset and Content | 1.0.0 | Certified | Content Governance | Standards 01-05 | Library, Documents, Publishing, Media | Data Engineering, UI Governance |
| Standard 07 | Canonical Workflow, Process and Business Rules | 1.0.0 | Certified | Workflow Governance | Standards 01-06 | Workflow, Pipeline, Review, Export | Quality Governance |
| Standard 08 | Canonical Configuration, Environment and Deployment | 1.0.0 | Certified | Configuration Governance | Standards 01, 05, 07 | DevSecOps, Platform Engineering, Deployment | Platform Engineering |
| Standard 09 | Canonical Logging, Audit, Monitoring and Observability | 1.0.0 | Certified | Observability Governance | Standards 01, 03, 05, 08 | Observability, Audit, all modules | Platform Engineering, Security Engineering |
| Standard 10 | Canonical Testing, Validation and Quality Gates | 1.0.0 | Certified | Quality Governance | Standards 01-09 | QA, CI, all modules | Quality Governance |
| Standard 11 | Canonical Internationalization, Localization and Terminology | 1.0.0 | Certified | Localization Governance | Standards 01-10 | Web, Translation, Terminology, Accessibility | UI Governance, Documentation Governance |
| Standard 12 | Canonical Accessibility and Inclusive Experience | 1.0.0 | Certified | Accessibility Governance | Standards 01, 06, 10, 11 | Web, Publishing, Media, Public Portal | UI Governance |
| Standard 13 | Canonical Rights, Licensing and Provenance | 1.0.0 | Certified | Rights Governance | Standards 01, 02, 05, 06, 09 | Rights, Publishing, Public Portal, Commerce | Documentation Governance |
| Standard 14 | Canonical Publishing, Distribution and Publication Withdrawal | 1.0.0 | Certified | Publishing Governance | Standards 01-13 | Publishing, Export, Public Portal, Commerce | Platform Engineering, Quality Governance |
| Standard 15 | Canonical Backup, Restore, Disaster Recovery and Business Continuity | 1.0.0 | Certified | Continuity Governance | Standards 01, 02, 05, 08, 09, 14 | Backup, Platform Engineering, Infrastructure | Platform Engineering, Security Engineering |
| Standard 16 | Canonical Governance, Compliance and Risk Management | 1.0.0 | Certified | Compliance Governance | Standards 01-15 | Policy, Compliance, Admin, all modules | Quality Governance, Documentation Governance |
| Standard 17 | Canonical Enterprise Architecture and Dependency Governance | 1.0.0 | Certified | Enterprise Architecture Governance | Standards 01-16 | Architecture, all modules | All frameworks |
| Standard 18 | Canonical Documentation, Knowledge Management and Specification Governance | 1.0.0 | Certified | Documentation Governance | Standards 01-17 | Documentation, Research, Knowledge, all modules | Documentation Governance |
| Standard 19 | Canonical Platform Lifecycle Management | 1.0.0 | Certified | Lifecycle Governance | Standards 01-18 | Platform Engineering, DevSecOps, Release | Platform Engineering, Quality Governance |
| Standard 20 | Canonical Consolidation and Certification for Codex v1.0 | 1.0.0 | Certified | Certification Governance | Standards 01-19 | All platform areas | Quality Governance, Documentation Governance |
| Standard 21 | Codex Standards Governance Meta-Standard | 1.0.0 | Certified | Codex Standards Governance | Standards 01-20 | Standards, frameworks, policies, specifications | Documentation Governance, Quality Governance |

## Framework Catalog

| Framework | Title | Version | Status | Canonical owner |
| --- | --- | --- | --- | --- |
| Framework 02 | User Experience, Design System and UI Governance | 1.0.0 | Active baseline | `docs/frameworks/ui-governance/design-system.md` |
| Framework 03 | Data Engineering, Information Architecture and Data Governance | 1.0.0 | Active baseline | `docs/frameworks/data-engineering/overview.md` |
| Framework 04 | AI Engineering, Prompt Governance and Intelligent Automation | 1.0.0 | Active baseline | `docs/frameworks/ai-engineering/overview.md` |
| Framework 05 | Cloud Infrastructure, Platform Engineering and Operations | 1.0.0 | Active baseline | `docs/frameworks/platform-engineering/overview.md` |
| Framework 06 | Enterprise Integration, Messaging and Interoperability | 1.0.0 | Active baseline | `docs/frameworks/enterprise-integration/overview.md` |
| Framework 07 | Enterprise Security Engineering and Cybersecurity | 1.0.0 | Active baseline | `docs/frameworks/security-engineering/overview.md` |
| Framework 08 | Enterprise Documentation, Knowledge Management and Technical Writing | 1.0.0 | Active baseline | `docs/frameworks/documentation-governance/overview.md` |
| Framework 09 | Enterprise Quality, Architecture Review and Continuous Improvement | 1.0.0 | Active baseline | `docs/frameworks/quality-governance/overview.md` |

## Policy and Specification Catalog

| Artifact | Type | Canonical role |
| --- | --- | --- |
| `docs/MANIFEST.md` | Policy | Strategic vision and mission. |
| `docs/DEVELOPMENT_CONVENTIONS.md` | Convention | Development language, localization, authentication, and extensibility conventions. |
| `SPEC.md` | Specification | Product and architecture authority. |
| `ROADMAP.md` | Roadmap | Sequencing and implementation authority. |
| `AGENTS.md` | Governance guide | Codex and AI agent implementation constraints. |
| `FUTURE_MODULES.md` | Planning specification | Reserved post-baseline capabilities. |
| `docs/JSON_MASTER_FORMAT.md` | Canonical model | JSON Master data format. |
| `docs/codex/canonical-definitions.md` | Registry | Canonical shared definitions. |
| `docs/codex/governance-framework.md` | Governance framework | Codex governance process. |
| `docs/codex/catalog.md` | Standards governance | Standard 21 catalog and standards lifecycle. |
| `docs/master/codex-index.md` | Master index | Single entry point for navigating the approved Codex corpus. |
| `docs/implementation/master-plan.md` | Implementation plan | Official execution plan for implementation, validation, audit, and Release Candidate readiness. |
| `docs/implementation/implementation-tasks.md` | Execution framework | Official task model, Definition of Ready, Definition of Done, and implementation execution flow. |

## Maintenance Rule

Do not add a duplicate local standards list. Update this catalog by linking to
the existing canonical owner document.
