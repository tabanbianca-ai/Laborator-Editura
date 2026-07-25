# Quality Gap Analysis

## Purpose

This document records the Chapter 14 Quality and Testing Baseline Audit gaps.

Each gap includes:

- Gap ID.
- Area.
- Current State.
- Required State.
- Risk.
- Affected Components.
- Dependencies.
- Recommended Action.
- Migration Phase.
- Acceptance Criteria.

## Gaps

### QA-GAP-001

Area: Pure unit and domain tests.

Current State: The repository has broad contract tests, but pure unit/domain
tests are not yet clearly separated for many business rules.

Required State: Critical domain rules have direct unit/domain tests without
NestJS, database, network, AI, or filesystem dependencies.

Risk: High.

Affected Components: Workflow, Terminology, Semantic Fidelity, Rights,
Publishing, Library, Language Policy, Need-to-Know, Human Final Authority.

Dependencies: Chapter 12 domain extraction.

Recommended Action: Add domain tests as pure policies are extracted from
services.

Migration Phase: Phase 2 - domain test expansion.

Acceptance Criteria: Critical rules can fail independently of API contract
tests.

### QA-GAP-002

Area: Coverage reporting.

Current State: Automated tests exist, but formal coverage reports and trend
tracking are not configured.

Required State: CI records unit, domain, application, integration, and
frontend coverage trends.

Risk: Medium.

Affected Components: API, Web, DB, Shared.

Dependencies: Coverage tool selection.

Recommended Action: Add baseline coverage reporting before enforcing
thresholds.

Migration Phase: Phase 3 - coverage baseline.

Acceptance Criteria: Coverage reports are generated and archived in CI.

### QA-GAP-003

Area: End-to-end browser automation.

Current State: Frontend contract tests validate screens and workspaces, but a
full browser-based E2E suite is not yet formalized.

Required State: Critical user journeys run through browser automation in
staging or controlled test environments.

Risk: Medium.

Affected Components: Auth, Pipeline, Author Studio, Translation, Review,
Publishing, Library, Rights, Distribution.

Dependencies: Test environment, seeded data, browser test runner.

Recommended Action: Add a small deterministic E2E smoke suite after API/UI
contracts stabilize.

Migration Phase: Phase 5 - E2E smoke suite.

Acceptance Criteria: Critical editorial production journey is tested through
the browser.

### QA-GAP-004

Area: Accessibility automation.

Current State: Accessibility requirements exist and UI tests cover structure,
but automated WCAG checks are not yet configured.

Required State: Main routes have automated accessibility checks and manual
release checklist coverage.

Risk: Medium.

Affected Components: Web app routes and Design System.

Dependencies: Accessibility test tooling.

Recommended Action: Add automated checks for main routes and a manual release
checklist.

Migration Phase: Phase 6 - accessibility validation.

Acceptance Criteria: Critical accessibility failures block release.

### QA-GAP-005

Area: Performance benchmarks.

Current State: Build and test steps run in CI, but formal performance
thresholds are not defined.

Required State: Critical latency, build, backup/restore, and workflow
performance are measured and trended.

Risk: Medium.

Affected Components: API, Web, Backup, Workflow, AI, Export.

Dependencies: Observability, benchmark fixtures.

Recommended Action: Define baseline measurements before enforcing thresholds.

Migration Phase: Phase 7 - performance baseline.

Acceptance Criteria: Performance regressions are visible before release.

### QA-GAP-006

Area: AI deterministic evaluation.

Current State: AI governance and agent workflows are tested through metadata
and deterministic contract tests, but golden prompt/evaluation fixtures are
not complete.

Required State: AI prompts, versions, evidence, fallback, costs, and
non-authoritative behavior have deterministic evaluation suites.

Risk: High.

Affected Components: AI Governance, Editorial Decisions, Translation,
Semantic Fidelity, Lexicographic, Multimedia, Media Localization.

Dependencies: Prompt registry and provider adapter maturity.

Recommended Action: Add golden fixtures and provider fallback simulations
before real provider activation.

Migration Phase: Phase 4 - AI validation hardening.

Acceptance Criteria: AI cannot regress into auto-approval or provider-specific
coupling silently.

### QA-GAP-007

Area: Flaky test management.

Current State: CI runs deterministic Node tests; formal flaky test tracking is
not documented as implemented.

Required State: Flaky tests are tracked, owned, and resolved with deadlines.

Risk: Low.

Affected Components: All test suites.

Dependencies: CI reporting.

Recommended Action: Add flaky test policy and reporting after suite duration
is measured.

Migration Phase: Phase 8 - quality observability.

Acceptance Criteria: Flaky tests cannot remain invisible.

### QA-GAP-008

Area: Release quality dashboard.

Current State: Release and staging reports exist, but a unified quality
dashboard artifact is not yet generated automatically.

Required State: Release quality status summarizes gates, coverage, defects,
security, accessibility, performance, and smoke results.

Risk: Low.

Affected Components: CI/CD, Release documentation, Operations.

Dependencies: Coverage, accessibility, performance, and E2E signals.

Recommended Action: Generate a release quality report once baseline signals
exist.

Migration Phase: Phase 9 - release quality reporting.

Acceptance Criteria: Release approval has one quality summary.
