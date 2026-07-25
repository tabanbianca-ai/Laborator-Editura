# Quality Migration Plan

## Purpose

This plan defines how the testing strategy should evolve toward Chapter 14
without breaking validated platform behavior.

No implementation is authorized by this plan alone. Each phase requires
approval before test architecture or release gate changes.

## Principles

- Prefer deterministic tests.
- Prefer the smallest test layer that proves behavior.
- Avoid duplicate low-value tests.
- Add regression tests for real defects.
- Keep CI fast enough for normal development.
- Make release gates strict for Critical and High risks.
- Preserve validated Phase 7 Step 16 behavior.

## Phase 0 - Baseline Complete

Status: Documentation complete.

Deliverables:

- Testing strategy.
- Test pyramid.
- Test catalog.
- Quality Gates.
- Coverage policy.
- Security testing.
- Accessibility testing.
- Performance testing.
- AI testing.
- Regression policy.
- Gap analysis.
- Migration plan.

Acceptance Criteria:

- Baseline documents exist.
- Existing tests are inventoried.
- No runtime behavior changed.

## Phase 1 - Test Catalog Automation

Goal: Keep test inventory current automatically.

Tasks:

- Add a script or CI report that counts tests by workspace.
- Classify tests by naming convention.
- Report new/removed tests in release quality summaries.

Acceptance Criteria:

- Test catalog can be refreshed without manual counting.

## Phase 2 - Domain Test Expansion

Goal: Add pure tests for critical rules.

Initial target rules:

- Human Final Authority.
- Validated terminology priority.
- Workflow blocking gates.
- Publishing preflight blocking.
- Rights and provenance warnings.
- Language policy.
- Need-to-Know access.
- Library lifecycle transitions.

Acceptance Criteria:

- Critical domain rules are tested without full infrastructure.

## Phase 3 - Coverage Baseline

Goal: Measure coverage before enforcing thresholds.

Tasks:

- Select coverage tooling.
- Generate API, Web, DB, and Shared coverage.
- Publish reports in CI.
- Identify high-risk untested areas.

Acceptance Criteria:

- Baseline coverage report exists and is reviewed.

## Phase 4 - AI Validation Hardening

Goal: Make AI workflows reproducible and provider-safe.

Tasks:

- Add golden prompt and response metadata fixtures.
- Simulate provider fallback.
- Verify audit and cost metadata.
- Verify no AI auto-approval.
- Verify non-authoritative evidence behavior.

Acceptance Criteria:

- AI workflow regressions fail deterministic tests.

## Phase 5 - End-to-End Smoke Suite

Goal: Add a small browser E2E suite for the critical editorial path.

Critical flow:

```text
Authenticate
  -> Create project
  -> Create manuscript
  -> Translate
  -> Review
  -> Validate
  -> Publish
  -> Library
```

Acceptance Criteria:

- E2E smoke tests run against controlled seeded data.

## Phase 6 - Accessibility Validation

Goal: Add accessibility gates for main routes.

Tasks:

- Add automated accessibility checks.
- Add keyboard navigation checks.
- Add manual WCAG release checklist.
- Add regression tests for accessibility bugs.

Acceptance Criteria:

- Critical accessibility failures block release.

## Phase 7 - Performance Baseline

Goal: Measure critical performance without making normal CI flaky.

Tasks:

- Track test duration.
- Track build duration.
- Track API smoke latency.
- Track backup/restore duration.
- Track selected workflow timing.

Acceptance Criteria:

- Performance regressions are visible and classified.

## Phase 8 - Quality Observability

Goal: Monitor quality health over time.

Tasks:

- Track flaky tests.
- Track success rate.
- Track regression count.
- Track defect severity trends.
- Track gate failures by category.

Acceptance Criteria:

- Quality degradation is visible before release.

## Phase 9 - Release Quality Reporting

Goal: Produce one quality summary for release approval.

Report includes:

- Test results.
- Coverage trend.
- Security checks.
- Accessibility checks.
- Performance checks.
- Open defects.
- Regression tests added.
- Smoke test result.
- Go/No-Go recommendation.

Acceptance Criteria:

- Release approval references one generated quality status report.

## Approval Checkpoint

Implementation must stop after this migration plan until the project owner
approves a specific quality phase or bounded test improvement.
