# Magazine Migration Plan

## Purpose

This document defines the incremental path from the current implementation to
the official Magazine Module Architecture.

## Migration Principles

- Additive first.
- Preserve current `/magazine` and `/magazine/[issueId]` frontend behavior.
- Preserve Library as the source of truth for articles and assets.
- Preserve Translation, Editorial Review, Rights, Publishing, and Workflow
  ownership.
- Preserve Phase 7 Step 16 behavior.
- Preserve backup/restore compatibility.
- Do not duplicate article content across issues.

## Phase 1 - Baseline Mapping

Objectives:

- Map Project `MAGAZINE`, document article types, Library publication records,
  Layout Publishing magazine plans, Rights warnings, Public Portal metadata,
  and Magazine Digital Experience read models into the target Magazine model.

Deliverables:

- Mapping table.
- Ownership boundary review.
- Contract test inventory.

## Phase 2 - Magazine Aggregate

Objectives:

- Add canonical `Magazine` records.
- Link to Library publication identity and existing Project records when
  applicable.

Deliverables:

- Magazine model.
- Status model.
- Audit events.

## Phase 3 - Volumes and Issues

Objectives:

- Add `MagazineVolume` and `MagazineIssue`.
- Preserve annual/periodic organization.
- Add issue versioning and archive state.

Deliverables:

- Volume model.
- Issue model.
- Issue version model.
- Archive state.

## Phase 4 - Sections and Article Assignments

Objectives:

- Add configurable sections/rubrics.
- Add article assignment records that reference Library Items.
- Support ordering and reuse without content duplication.

Deliverables:

- Section model.
- Article assignment model.
- Reuse tests.

## Phase 5 - Translation and Review Integration

Objectives:

- Link issue/article assignments to Translation and Editorial Review states.
- Require article approval before issue publication.

Deliverables:

- Translation status mapping.
- Review status mapping.
- Workflow gate tests.

## Phase 6 - Layout Integration

Objectives:

- Link issues to Layout Publishing plans.
- Store issue-specific section/article placement metadata.

Deliverables:

- Layout relationship model.
- Placement metadata.
- Layout audit events.

## Phase 7 - Publishing Handoff

Objectives:

- Create canonical issue-to-Publishing handoff.
- Preserve Publishing as the official release mechanism.
- Preserve Phase 7 Step 16 preflight/distribution behavior.

Deliverables:

- Publishing handoff contract.
- Issue publication readiness tests.
- Archive/withdrawal mapping.

## Phase 8 - APIs and Events

Objectives:

- Add canonical Magazine APIs and domain events.
- Preserve existing frontend read paths until migration.

Deliverables:

- `POST /magazines`.
- `POST /issues`.
- `POST /articles`.
- `POST /issues/{id}/publish`.
- `GET /issues`.
- `GET /articles`.
- `POST /issues/search`.
- Magazine event catalog.

## Phase 9 - Search and Performance

Objectives:

- Support hundreds of magazines, thousands of issues, and hundreds of
  thousands of articles.
- Add full-text search and indexing plans.
- Plan parallel publication generation.

Deliverables:

- Indexing plan.
- Search API.
- Performance baseline.

## Next Recommended Module

Module 7 - AI Orchestration and Editorial Agents Module Architecture is now
documented as the next Phase II specification after Magazine.

Module 8 - Audio and Narration Module Architecture is now documented after AI
Orchestration.

Module 9 - Video and Multimedia Module Architecture is now documented after
Audio and Narration.

Module 10 - Workflow Engine and Business Process Automation Module
Architecture is now documented after Video and Multimedia.

Module 11 - Notification and Communication Module Architecture is now
documented after Workflow Engine and Business Process Automation.

Module 12 - Identity, Access Management and Security Module Architecture is
now documented after Notification and Communication.

Module 13 - Observability, Monitoring and Audit Module Architecture is now
documented after Identity, Access Management and Security.

Module 14 - Backup, Disaster Recovery and Business Continuity Module
Architecture is now documented after Observability, Monitoring and Audit.

Module 15 - Search, Indexing and Knowledge Graph Module Architecture is now
documented after Backup, Disaster Recovery and Business Continuity.

Module 16 - Integration, API Gateway and External Connectors Module
Architecture is now documented after Search, Indexing and Knowledge Graph.

Module 17 - Configuration, Feature Flags and Platform Administration Module
Architecture is now documented after Integration, API Gateway and External
Connectors.

Module 18 - Data Governance, Metadata and Master Data Management Module
Architecture is now documented after Configuration, Feature Flags and Platform
Administration.

Module 19 - Accessibility, Localization and Inclusive Experience Module
Architecture is now documented after Data Governance, Metadata and Master Data
Management.

Module 20 - Analytics, Business Intelligence and Decision Support Module
Architecture is now documented after Accessibility, Localization and Inclusive
Experience.

Module 21 - AI Governance, Model Management and Responsible AI Module
Architecture is now documented after Analytics, Business Intelligence and
Decision Support.

Module 22 - DevSecOps, CI/CD, Release and Platform Operations Module
Architecture is now documented after AI Governance, Model Management and
Responsible AI.

Module 23 - Quality Assurance, Testing and Validation Module Architecture is
now documented after DevSecOps, CI/CD, Release and Platform Operations.

Module 24 - Enterprise Architecture, Portfolio and Strategic Governance
Module Architecture is now documented after Quality Assurance, Testing and
Validation.

Module 25 - Compliance, Legal Governance and Risk Management Module
Architecture is now documented after Enterprise Architecture, Portfolio and
Strategic Governance.

With Module 25, the fundamental Phase II architecture covers the full
enterprise chain: editorial capabilities, infrastructure, AI, operations,
governance, quality, strategy, and compliance.

Phase III Module 26 - Enterprise Meta-Architecture and Codex Governance
Framework is now documented as the supreme Codex governance layer. Future
capabilities are specialized extensions unless explicitly approved through
Codex Governance as fundamental architecture.
