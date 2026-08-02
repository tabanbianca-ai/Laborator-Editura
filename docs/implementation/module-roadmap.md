# CIMP Module Roadmap

## Document Control

| Field | Value |
| --- | --- |
| Identifier | CODEX-CIMP-MODULE-ROADMAP |
| Version | 1.0.0 |
| Status | Official implementation roadmap |
| Owner | Codex Implementation Governance |
| Related plan | `docs/implementation/master-plan.md` |

## Purpose

This roadmap translates the approved Codex module catalog into execution
stages. It does not create new modules.

## Execution Stage 1 - Foundation

| Capability | Primary modules or areas | Required implementation gates |
| --- | --- | --- |
| Enterprise Architecture | Enterprise Architecture, Codex Governance, CEMI | Analyse, validate dependencies, document implementation boundaries |
| Platform Engineering | Platform Engineering, DevSecOps, Configuration | Validate environment, deployment, CI, runtime operations |
| Security | Auth, IAM, Security, Need-to-Know, Secret Vault metadata | Validate authentication, authorization, sessions, audit, tenant isolation |
| Data Governance | JSON Master, database, shared package, metadata | Validate canonical data, migrations, backup compatibility |
| Workflow Engine | Workflow, Pipeline, approvals, gates | Validate state transitions, blocking rules, audit |

## Execution Stage 2 - Editorial Core

| Capability | Primary modules or areas | Required implementation gates |
| --- | --- | --- |
| Library | Library, reader experience, publication lifecycle | Validate ownership, access, privacy, backup |
| Translation | Translation, Translation Memory, Terminology, Lexicographic | Validate linguistic priority, suggestions, audit |
| Proofreading | QA, Semantic Fidelity, Review, Editorial Decisions | Validate issue handling, review proposals, human approval |
| Magazine | Magazine, Flipbook, article media readiness | Validate optional magazine gates and publishing integration |
| Publishing | Layout, Export, Distribution, Public Portal | Validate preflight, exports, publication readiness |
| Rights and Provenance | Rights, contracts, provenance, attribution | Validate rights warnings and publication blocking |

## Execution Stage 3 - AI

| Capability | Primary modules or areas | Required implementation gates |
| --- | --- | --- |
| AI Orchestrator | AI Governance, agent coordination, policy | Validate orchestration boundaries and audit |
| AI Agents | Translation, Review, Quality, Media, Platform agents | Validate role limits and Human Final Authority |
| RAG | Research, Lexicographic, Knowledge Base | Validate source authority and licensing |
| Cost Management | AI Governance, budgets, quotas, provider fallback | Validate limits, warnings, audit |
| AI Governance | Policy, Marketplace, model registry | Validate approvals and non-self-enablement |

## Execution Stage 4 - User Experience

| Capability | Primary modules or areas | Required implementation gates |
| --- | --- | --- |
| Design System | Web components and UI governance | Validate consistency and accessibility |
| Web | App shell, workspaces, routes | Validate navigation and protected access |
| PWA | Installable experience and offline-ready foundations | Validate existing architecture support |
| Mobile | Responsive mobile/tablet behavior | Validate core routes and navigation |
| Localization | Platform Language and i18n dictionaries | Validate no mixed-language UI |
| Accessibility | Keyboard, semantics, focus, accessible content | Validate evidence and remediation |

## Execution Stage 5 - Operations

| Capability | Primary modules or areas | Required implementation gates |
| --- | --- | --- |
| Observability | Health, logs, metrics, traces | Validate diagnostics and tenant-safe metadata |
| Backup | Runtime backup, restore, preservation | Validate deterministic backup and restore dry-runs |
| Disaster Recovery | DR plans, retention, continuity | Validate recovery procedures and audit |
| DevSecOps | CI/CD, release scripts, staging | Validate builds, tests, deployment steps |
| Monitoring | Logs, alerts, review runbooks | Validate monitoring procedures |

## Execution Stage 6 - Validation

| Capability | Primary modules or areas | Required implementation gates |
| --- | --- | --- |
| Testing | Unit, contract, integration, frontend, backend | Validate pass/fail evidence |
| Compliance | Policy Engine, governance reports | Validate standard conformance |
| Documentation | CEMI, CIMP, module docs, runbooks | Validate canonical references |
| Certification | RC evidence and final readiness | Validate Release Candidate criteria |

## Stage Transition Rule

A stage may start only when blocking dependencies from earlier stages are
complete or formally accepted as non-blocking risks.
