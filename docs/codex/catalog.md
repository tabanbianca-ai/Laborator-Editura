# Codex Canonical Catalog

## Document Control

| Field | Value |
| --- | --- |
| Identifier | CODEX-CANONICAL-CATALOG |
| Version | 1.0.0 |
| Status | Active specification |
| Owner | Codex Standards Governance |
| Related standard | Standard 21 - Codex Standards Governance Meta-Standard |

## Purpose

This catalog is the canonical inventory of Codex standards, frameworks,
policies, canonical models, specifications, guides, conventions, and approved
extensions.

It complements `docs/codex/module-catalog.md` by focusing on standards
governance rather than product module sequencing.

The enterprise navigation entry point above this standards catalog is
`docs/master/codex-index.md`.

## Catalog Principles

- Single Source of Truth.
- Canonical Before Local.
- No Duplication.
- Backward Compatibility.
- Version Governance.
- Traceability by Default.
- Documentation First.
- Review Before Approval.
- Controlled Evolution.
- Continuous Improvement.

## Standard Record Model

Every standard must preserve:

- Standard ID.
- Canonical identifier.
- Title.
- Category.
- Purpose.
- Scope.
- Dependencies.
- Related standards.
- Owner.
- Approver.
- Status.
- Version.
- Lifecycle stage.
- Review cycle.
- Audit information.

## Standard Lifecycle

Every Codex standard follows:

```text
Draft -> Review -> Approved -> Implemented -> Validated -> Certified -> Deprecated -> Archived
```

## Canonical Standards

| Standard | Title | Owner document | Status | Version |
| --- | --- | --- | --- | --- |
| Standard 01 | Canonical Naming, Identification and Versioning | `docs/standards/naming-versioning/overview.md` | Certified baseline | 1.0.0 |
| Standard 02 | Canonical Data Model and Metadata | `docs/standards/data-model/overview.md` | Certified baseline | 1.0.0 |
| Standard 03 | Canonical API, Event and Integration | `docs/standards/api-governance/overview.md` | Certified baseline | 1.0.0 |
| Standard 04 | Canonical AI Assets, Prompt and Model | `docs/standards/ai-assets/overview.md` | Certified baseline | 1.0.0 |
| Standard 05 | Canonical Security, Identity and Access | `docs/standards/security-identity/overview.md` | Certified baseline | 1.0.0 |
| Standard 06 | Canonical Document, Digital Asset and Content | `docs/standards/digital-assets/overview.md` | Certified baseline | 1.0.0 |
| Standard 07 | Canonical Workflow, Process and Business Rules | `docs/standards/workflow-governance/overview.md` | Certified baseline | 1.0.0 |
| Standard 08 | Canonical Configuration, Environment and Deployment | `docs/standards/configuration-governance/overview.md` | Certified baseline | 1.0.0 |
| Standard 09 | Canonical Logging, Audit, Monitoring and Observability | `docs/standards/observability/overview.md` | Certified baseline | 1.0.0 |
| Standard 10 | Canonical Testing, Validation and Quality Gates | `docs/standards/testing-validation/overview.md` | Certified baseline | 1.0.0 |
| Standard 11 | Canonical Internationalization, Localization and Terminology | `docs/standards/localization/overview.md` | Certified baseline | 1.0.0 |
| Standard 12 | Canonical Accessibility and Inclusive Experience | `docs/standards/accessibility/overview.md` | Certified baseline | 1.0.0 |
| Standard 13 | Canonical Rights, Licensing and Provenance | `docs/standards/rights-provenance/overview.md` | Certified baseline | 1.0.0 |
| Standard 14 | Canonical Publishing, Distribution and Publication Withdrawal | `docs/standards/publishing-distribution/overview.md` | Certified baseline | 1.0.0 |
| Standard 15 | Canonical Backup, Restore, Disaster Recovery and Business Continuity | `docs/standards/backup-continuity/overview.md` | Certified baseline | 1.0.0 |
| Standard 16 | Canonical Governance, Compliance and Risk Management | `docs/standards/governance/overview.md` | Certified baseline | 1.0.0 |
| Standard 17 | Canonical Enterprise Architecture and Dependency Governance | `docs/standards/enterprise-architecture/overview.md` | Certified baseline | 1.0.0 |
| Standard 18 | Canonical Documentation, Knowledge Management and Specification Governance | `docs/standards/documentation/overview.md` | Certified baseline | 1.0.0 |
| Standard 19 | Canonical Platform Lifecycle Management | `docs/standards/platform-lifecycle/overview.md` | Certified baseline | 1.0.0 |
| Standard 20 | Canonical Consolidation and Certification for Codex v1.0 | `docs/certification/codex-v1/certification-report.md` | Certified baseline | 1.0.0 |
| Standard 21 | Codex Standards Governance Meta-Standard | `docs/codex/catalog.md` | Certified baseline | 1.0.0 |

## Framework Catalog

| Framework | Title | Owner document | Status |
| --- | --- | --- | --- |
| Framework 02 | User Experience, Design System and UI Governance | `docs/frameworks/ui-governance/design-system.md` | Active baseline |
| Framework 03 | Data Engineering, Information Architecture and Data Governance | `docs/frameworks/data-engineering/overview.md` | Active baseline |
| Framework 04 | AI Engineering, Prompt Governance and Intelligent Automation | `docs/frameworks/ai-engineering/overview.md` | Active baseline |
| Framework 05 | Cloud Infrastructure, Platform Engineering and Operations | `docs/frameworks/platform-engineering/overview.md` | Active baseline |
| Framework 06 | Enterprise Integration, Messaging and Interoperability | `docs/frameworks/enterprise-integration/overview.md` | Active baseline |
| Framework 07 | Enterprise Security Engineering and Cybersecurity | `docs/frameworks/security-engineering/overview.md` | Active baseline |
| Framework 08 | Enterprise Documentation, Knowledge Management and Technical Writing | `docs/frameworks/documentation-governance/overview.md` | Active baseline |
| Framework 09 | Enterprise Quality, Architecture Review and Continuous Improvement | `docs/frameworks/quality-governance/overview.md` | Active baseline |

## Policy and Specification Catalog

| Artifact | Category | Canonical role | Status |
| --- | --- | --- | --- |
| `docs/MANIFEST.md` | Policy | Strategic vision and mission authority | Active baseline |
| `docs/DEVELOPMENT_CONVENTIONS.md` | Convention | Development language, i18n, authentication, and implementation conventions | Active baseline |
| `SPEC.md` | Specification | Product, architecture, scope, and business rule authority | Active baseline |
| `ROADMAP.md` | Roadmap | Sequencing, phase control, and implementation planning | Active baseline |
| `AGENTS.md` | Governance guide | Agent responsibilities and implementation constraints | Active baseline |
| `FUTURE_MODULES.md` | Planning specification | Future module reservation and post-baseline planning | Active baseline |
| `docs/JSON_MASTER_FORMAT.md` | Canonical model | Canonical JSON Master data format | Active baseline |
| `docs/codex/canonical-definitions.md` | Canonical registry | Shared canonical definitions and ownership map | Active baseline |
| `docs/codex/governance-framework.md` | Governance framework | Codex governance workflow and approval flow | Active baseline |
| `docs/codex/change-management.md` | Policy | Change control and compatibility governance | Active baseline |
| `docs/codex/codex-versioning.md` | Policy | Codex versioning policy | Active baseline |
| `docs/operations/platform-governance.md` | Policy | Platform operations governance | Active baseline |
| `docs/operations/versioning-policy.md` | Policy | Operational versioning policy | Active baseline |
| `docs/operations/deprecation-policy.md` | Policy | Deprecation and retirement policy | Active baseline |
| `docs/security/security-policies.md` | Policy | Security policy baseline | Active baseline |
| `docs/quality/quality-gates.md` | Policy | Quality gate requirements | Active baseline |
| `docs/quality/coverage-policy.md` | Policy | Coverage expectations | Active baseline |
| `docs/quality/regression-policy.md` | Policy | Regression testing expectations | Active baseline |
| `docs/codex/api-contracts.md` | Specification | Canonical Codex API contract guidance | Active baseline |
| `docs/codex/events.md` | Specification | Canonical Codex event guidance | Active baseline |
| `docs/master/codex-index.md` | Master index | Single navigation entry point for the approved Codex corpus | Active baseline |

## Root Governance Artifacts

| Artifact | Purpose |
| --- | --- |
| `docs/MANIFEST.md` | Vision and strategic foundation. |
| `docs/DEVELOPMENT_CONVENTIONS.md` | Official development conventions. |
| `SPEC.md` | Product and architecture specification. |
| `ROADMAP.md` | Implementation and governance roadmap. |
| `AGENTS.md` | Agent and implementation governance. |
| `docs/master/codex-index.md` | Canonical Enterprise Master Index and entry point. |
| `docs/codex/canonical-definitions.md` | Canonical definition registry. |
| `docs/codex/module-catalog.md` | Module, framework, and standard sequence. |
| `docs/codex/governance-framework.md` | Codex governance workflow. |
| `docs/codex/codex-consolidation-report.md` | Redundancy and consolidation evidence. |

## Governance Rule

No future Codex standard may duplicate an existing standard. New standards
must first reference this catalog, justify the need, document dependencies,
define compatibility impact, and receive approved governance review.
