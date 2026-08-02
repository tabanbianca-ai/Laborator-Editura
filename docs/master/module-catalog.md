# CEMI Module Catalog

## Document Control

| Field | Value |
| --- | --- |
| Identifier | CODEX-CEMI-MODULE-CATALOG |
| Version | 1.0.0 |
| Status | Official master catalog |
| Owner | Codex Enterprise Governance |
| Canonical source | `docs/codex/module-catalog.md` |

## Purpose

This document gives the master navigation view for platform modules, runtime
services, AI agents, and workflow areas. Canonical module definitions remain in
`docs/codex/module-catalog.md` and `docs/modules`.

## Phase II Fundamental Modules

| Module | Name | Canonical overview | Primary runtime alignment |
| --- | --- | --- | --- |
| 1 | Library | `docs/modules/library/library-overview.md` | `apps/api/src/modules/library` |
| 2 | Translation | `docs/modules/translation/translation-overview.md` | `apps/api/src/modules/translations`, `apps/api/src/modules/translation-memory` |
| 3 | Proofreading and Editorial Review | `docs/modules/editorial-review/editorial-review-overview.md` | `apps/api/src/modules/editorial-decisions`, `apps/api/src/modules/qa`, `apps/api/src/modules/semantic-fidelity` |
| 4 | Publishing | `docs/modules/publishing/publishing-overview.md` | `apps/api/src/modules/layout-publishing`, `apps/api/src/modules/export`, `apps/api/src/modules/public-portal` |
| 5 | Rights and Provenance | `docs/modules/rights/rights-overview.md` | `apps/api/src/modules/rights-provenance` |
| 6 | Magazine | `docs/modules/magazine/magazine-overview.md` | Publishing, media, and public portal runtime modules |
| 7 | AI Orchestration and Editorial Agents | `docs/modules/ai-orchestration/ai-orchestration-overview.md` | `apps/api/src/modules/ai-governance`, `apps/api/src/modules/marketplace`, `apps/api/src/modules/policy-engine` |
| 8 | Audio and Narration | `docs/modules/audio/audio-overview.md` | `apps/api/src/modules/multimedia-creation` |
| 9 | Video and Multimedia | `docs/modules/video/video-overview.md` | `apps/api/src/modules/multimedia-creation`, `apps/api/src/modules/media-localization` |
| 10 | Workflow Engine and Business Process Automation | `docs/modules/workflow/workflow-overview.md` | `apps/api/src/modules/workflow`, `apps/api/src/modules/scheduling` |
| 11 | Notification and Communication | `docs/modules/notifications/notifications-overview.md` | Planned or integrated through collaboration and scheduling foundations |
| 12 | Identity, Access Management and Security | `docs/modules/iam/iam-overview.md` | `apps/api/src/modules/auth`, `apps/api/src/modules/security`, `apps/api/src/modules/security-governance` |
| 13 | Observability, Monitoring and Audit | `docs/modules/observability/observability-overview.md` | `apps/api/src/modules/observability` |
| 14 | Backup, Disaster Recovery and Business Continuity | `docs/modules/backup/backup-overview.md` | `apps/api/src/modules/backup-governance`, infrastructure backup scripts |
| 15 | Search, Indexing and Knowledge Graph | `docs/modules/search/search-overview.md` | Research and lexicographic foundations |
| 16 | Integration, API Gateway and External Connectors | `docs/modules/integration/integration-overview.md` | `apps/api/src/modules/gateway` |
| 17 | Configuration, Feature Flags and Platform Administration | `docs/modules/configuration/configuration-overview.md` | `apps/api/src/modules/enterprise-admin`, `apps/api/src/modules/workspace` |
| 18 | Data Governance, Metadata and Master Data Management | `docs/modules/data-governance/data-governance-overview.md` | `packages/shared`, `packages/db` |
| 19 | Accessibility, Localization and Inclusive Experience | `docs/modules/accessibility/accessibility-overview.md` | `apps/web`, shared language policy |
| 20 | Analytics, Business Intelligence and Decision Support | `docs/modules/analytics/analytics-overview.md` | Observability and reporting foundations |
| 21 | AI Governance, Model Management and Responsible AI | `docs/modules/ai-governance/ai-governance-overview.md` | `apps/api/src/modules/ai-governance` |
| 22 | DevSecOps, CI/CD, Release and Platform Operations | `docs/modules/devsecops/devsecops-overview.md` | Infrastructure, CI, deployment docs |
| 23 | Quality Assurance, Testing and Validation | `docs/modules/quality-assurance/qa-overview.md` | `apps/api/src/modules/qa`, quality docs |
| 24 | Enterprise Architecture, Portfolio and Strategic Governance | `docs/modules/enterprise-architecture/architecture-overview.md` | Architecture and Codex governance docs |
| 25 | Compliance, Legal Governance and Risk Management | `docs/modules/compliance/compliance-overview.md` | `apps/api/src/modules/policy-engine`, `apps/api/src/modules/security-governance` |

## Runtime API Modules

| Runtime group | API module directories |
| --- | --- |
| Identity and security | `auth`, `security`, `security-governance`, `enterprise-admin` |
| Editorial core | `projects`, `documents`, `segments`, `translations`, `translation-memory`, `terminology`, `workflow`, `export` |
| Quality and review | `qa`, `semantic-fidelity`, `editorial-decisions`, `rights-provenance` |
| Authoring and knowledge | `author-studio`, `research`, `lexicographic`, `library` |
| Publishing and distribution | `layout-publishing`, `public-portal`, `commerce`, `marketplace` |
| Media | `multimedia-creation`, `media-localization` |
| Collaboration and scheduling | `collaboration`, `scheduling`, `workspace` |
| Operations and governance | `backup-governance`, `gateway`, `launch-essentials`, `observability`, `platform-engineering`, `policy-engine`, `ai-governance` |

## AI Agent Catalog

The canonical AI agent governance is defined in `AGENTS.md` and AI governance
documents. CEMI recognizes the following principal AI agents as the v1.0
baseline:

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

## Workflow Catalog

| Workflow | Canonical reference |
| --- | --- |
| Editorial Production Pipeline | `docs/PHASE_7_STEP_16_PUBLISHING_PREFLIGHT_DISTRIBUTION_REPORT.md` |
| MVP workflow | `SPEC.md`, `ROADMAP.md`, `docs/workflow/workflow-architecture.md` |
| Publishing workflow | `docs/modules/publishing/publishing-overview.md`, `docs/standards/publishing-distribution/overview.md` |
| Rights and provenance validation | `docs/modules/rights/rights-overview.md`, `docs/standards/rights-provenance/overview.md` |
| Backup and recovery workflow | `docs/modules/backup/backup-overview.md`, `docs/devops/backup-and-recovery.md` |
| Quality validation workflow | `docs/quality/quality-gates.md`, `docs/standards/testing-validation/overview.md` |

## Maintenance Rule

Do not create a parallel module definition here. Register modules here, then
link to the canonical module owner document.
