# Quality Assurance Gap Analysis

## 1. Executive Summary

Laborator Editura already has broad executable validation coverage through
API, Web, runtime database, backup, and shared package tests. CI also validates
repository hygiene, infrastructure syntax, secret scanning, Docker Compose
configuration, Nginx templates, contract tests, dependency-aware typecheck,
lint, build, audit, and Trivy scanning.

The main gap is not absence of tests. The main gap is absence of a centralized
Quality Assurance module that records test plans, test cases, executions,
defects, coverage snapshots, quality gate evaluations, manual evidence, and
release validation records as governed, auditable platform entities.

## 2. Current Testing Strategy

Current strategy is contract-test heavy and repository-centered:

- `apps/api/tests/*.test.mjs` validates backend modules, contracts, security
  constraints, workflow behavior, governance, and editorial domain rules.
- `apps/web/tests/*.test.mjs` validates frontend routes, screens,
  localization, workspace behavior, and launch readiness UI expectations.
- `packages/db/tests/*.test.mjs` validates runtime database, migrations, and
  backup/restore behavior.
- `packages/shared/tests/*.test.mjs` validates shared JSON Master and language
  policy contracts.
- `.github/workflows/ci.yml` runs repository validation, MVP validation,
  dependency-aware typecheck/lint/test/build/audit, and vulnerability scan.

Existing `docs/quality` documents define earlier quality strategy, test
pyramid, quality gates, and migration guidance.

## 3. Test Coverage Assessment

Strong coverage exists for:

- Authentication and authorization.
- Tenant isolation.
- Founder protection.
- MVP end-to-end integration.
- Translation Memory.
- Terminology.
- QA Engine.
- Semantic Fidelity.
- Workflow.
- Rights and provenance.
- Publishing workflow and preflight.
- AI governance.
- Observability.
- Backup and restore.
- Language policy and localization.
- Workspace and frontend shell contracts.

Partial or missing coverage:

- Full browser-driven E2E tests.
- Formal code coverage reporting.
- Manual test evidence records.
- Load, stress, and soak tests.
- PDF/UA and EPUB Accessibility automated validation.
- Formal AI benchmark suites.
- Traceability between requirements, tests, defects, and releases.

## 4. Quality Gates Review

Existing CI provides practical gates:

- Secret scan.
- Shell syntax validation.
- Docker Compose validation.
- Nginx template validation.
- API contract tests.
- Runtime DB and backup tests.
- Shared package tests.
- Fixture JSON validation.
- Dependency-aware typecheck, lint, tests, build, and audit.
- Trivy filesystem vulnerability scan.

Missing gate capabilities:

- Runtime quality gate registry.
- Configurable gate definitions as platform records.
- Coverage threshold enforcement as QA records.
- Manual release approval evidence linked to gates.
- Gate waiver workflow.
- Formal quality gate event publication.

## 5. Automation Assessment

Automation is strong for deterministic contract tests and CI validation.

Strengths:

- Fast Node test runner suites.
- Broad API module contracts.
- Web screen contract tests.
- Runtime database backup/restore tests.
- CI integration.
- Infrastructure validators.

Risks:

- Automation is not centrally cataloged.
- There is no platform test case registry.
- Manual validation is not captured as structured evidence.
- Browser rendering and accessibility automation are limited.
- Performance automation is not yet formalized.

## 6. Security & Performance Validation

Security baseline:

- Auth and RBAC tests.
- Need-to-Know access tests.
- Security hardening tests.
- Secret scan.
- Trivy scan.
- Dependency audit when dependencies are available.

Performance baseline:

- Health checks and staging smoke tests exist.
- No formal load, stress, soak, or benchmark suites are present.

Priority improvement:

- Add formal performance profiles for API, export, backup, search, AI
  orchestration, and media workflows.

## 7. AI Validation Review

Current AI validation is governance-focused:

- AI cannot approve automatically.
- AI cannot self-enable.
- AI cost governance is represented.
- AI agent roles and subagents are contract-tested.
- Editorial AI workflows are tested at contract level.

Gaps:

- No model benchmark registry.
- No prompt regression suite.
- No stored reproducibility snapshots.
- No centralized AI quality scoring.
- No formal red-team AI validation set.

## 8. Integration Assessment

Quality Assurance must integrate with:

- DevSecOps for CI/CD and release promotion.
- Workflow for quality gate and approval state.
- IAM for QA roles and permissions.
- Configuration for thresholds.
- Observability for execution diagnostics.
- Analytics for quality reports.
- AI Governance for model and prompt validation.
- Accessibility for inclusive experience evidence.
- Data Governance for traceability.

Current integrations are mostly documentation and CI/script level, not runtime
QA entity integrations.

## 9. Identified Gaps

1. No centralized test plan registry.
2. No centralized test case registry.
3. No structured manual validation evidence store.
4. No defect lifecycle owned by QA.
5. No runtime quality gate entity model.
6. No formal coverage snapshot records.
7. No requirement-test-defect-release traceability graph.
8. No formal load/stress/soak automation.
9. No automated accessibility scanner integration.
10. No AI benchmark and prompt regression registry.
11. No QA event contracts implemented at runtime.
12. No QA API implementation for test plans, cases, defects, and gates.

## 10. Prioritized Remediation Backlog

Critical:

- Preserve existing CI and contract tests as mandatory gates.
- Prevent release workflows from bypassing validation evidence.

High:

- Add QA domain records for test plans, test cases, executions, defects, and
  quality gate evaluations.
- Add requirement-test-defect traceability.
- Add manual validation evidence records.
- Add release validation records.

Medium:

- Add coverage snapshots and threshold policies.
- Add formal accessibility validation automation.
- Add load and stress test profiles.
- Add AI benchmark and prompt regression records.

Low:

- Add richer QA dashboards.
- Add cross-release quality trend analytics.
- Add long-term quality health forecasting.

## 11. Migration Strategy

Phase 0: Documentation baseline.

- Add Module 23 specification documents.
- Preserve existing `docs/quality` material.
- Preserve existing tests and CI behavior.

Phase 1: Inventory and registry.

- Register existing test suites as QA-managed suites.
- Map test files to modules and requirements.
- Define defect and evidence records.

Phase 2: Quality gate runtime records.

- Persist quality gate definitions and evaluations.
- Link CI outcomes to gate evidence.
- Add waiver and manual review workflow.

Phase 3: Coverage and traceability.

- Capture coverage snapshots.
- Link requirements, test cases, defects, executions, and releases.

Phase 4: Specialized validation.

- Add performance, accessibility, security, and AI validation suites.
- Publish QA events.
- Feed Analytics and Observability.

## 12. Success Metrics

Success is measured by:

- Percentage of requirements linked to test cases.
- Percentage of mandatory tests automated.
- Quality gate pass/fail trend.
- Open defects by severity.
- Mean time to defect resolution.
- Regression suite stability.
- Coverage threshold compliance.
- Accessibility validation pass rate.
- Security vulnerability closure rate.
- AI validation compliance rate.
- Release candidates with complete evidence.
- Number of unauthorized validation bypasses, expected to remain zero.
