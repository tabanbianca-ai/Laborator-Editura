# Quality Assurance Migration Plan

This migration plan introduces the Quality Assurance, Testing and Validation
Module incrementally while preserving all current validated behavior,
including Phase 7 Step 22 standards, existing CI, contract tests, staging
validation, Infrastructure Pack validation, and architecture Chapters 0-22.

## Migration Rules

- Do not remove existing tests.
- Do not weaken existing CI gates.
- Do not replace the existing editorial QA Engine.
- Do not bypass DevSecOps release controls.
- Do not allow AI to approve gates or releases.
- Preserve Human Final Authority.
- Preserve auditability.
- Add runtime QA records only in an explicitly approved implementation phase.

## Phase 0 - Baseline Documentation

Status: Current phase.

Deliverables:

- QA overview.
- Domain model.
- Test management.
- Test automation.
- Quality gates.
- Performance testing.
- Security testing.
- Accessibility testing.
- AI validation.
- API contracts.
- Events.
- Gap analysis.
- Migration plan.

Outcome:

- The platform has an official Module 23 QA architecture and baseline audit.

## Phase 1 - Test Inventory Registry

Objective:

- Register existing test suites and CI validations as QA-managed inventory.

Tasks:

- Inventory `apps/api/tests`.
- Inventory `apps/web/tests`.
- Inventory `packages/db/tests`.
- Inventory `packages/shared/tests`.
- Inventory `.github/workflows`.
- Map tests to modules and requirements.
- Define manual evidence categories.

## Phase 2 - QA Runtime Records

Objective:

- Add first-class records for test plans, test cases, executions, defects,
  coverage snapshots, evidence, and quality gate evaluations.

Tasks:

- Implement additive backend persistence.
- Add authenticated APIs.
- Add audit events.
- Add contract tests.
- Preserve existing QA Engine APIs.

## Phase 3 - Quality Gate Enforcement

Objective:

- Connect QA records to release promotion and publication readiness.

Tasks:

- Define configurable gate rules through Configuration.
- Link CI results to gate evaluations.
- Block promotion on failed mandatory gates.
- Add authorized waiver workflow.
- Feed DevSecOps release records.

## Phase 4 - Specialized Validation

Objective:

- Add deeper performance, accessibility, security, and AI validation.

Tasks:

- Add load and stress profiles.
- Add automated accessibility scanner integration.
- Add PDF/UA and EPUB Accessibility validation.
- Add AI benchmark registry.
- Add prompt regression suites.
- Add security coverage mapping.

## Phase 5 - Reporting and Governance

Objective:

- Make QA evidence visible to release managers, auditors, and authorized
  stakeholders.

Tasks:

- Add quality dashboards through Analytics.
- Publish QA events.
- Correlate QA executions with Observability traces.
- Add long-term trend reports.
- Add quality risk scoring.

## Dependencies

Quality Assurance depends on:

- DevSecOps.
- IAM.
- Configuration.
- Workflow Engine.
- Observability.
- Analytics.
- AI Governance.
- Accessibility.
- Data Governance.
- Integration Gateway.

## Codex Governance Reference

The canonical module sequence, dependency closure, and future-extension rule are
maintained in `docs/codex/module-catalog.md`,
`docs/codex/dependency-registry.md`, and `docs/codex/meta-architecture.md`.

This migration plan owns only the local migration strategy for this module. It
does not redefine the platform module sequence, fundamental architecture
closure, or future-extension approval rule.
