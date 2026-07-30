# Quality Assurance Test Automation

Test Automation defines how automated validations are organized, executed,
reported, and connected to quality gates.

## Automation Types

The platform automation strategy covers:

- Unit tests.
- Integration tests.
- Contract tests.
- API tests.
- UI tests.
- End-to-end tests.
- Regression tests.
- Security checks.
- Accessibility checks.
- Performance checks.
- AI validation checks.

## Current Automated Test Inventory

Current executable tests include:

- API contract and integration tests in `apps/api/tests`.
- Web contract tests in `apps/web/tests`.
- Runtime database, migration, and backup tests in `packages/db/tests`.
- Shared JSON Master and language policy tests in `packages/shared/tests`.

Representative API test areas include:

- Authentication and authorization.
- MVP end-to-end integration.
- Foundation persistence.
- Translation Memory.
- Terminology.
- QA Engine.
- Semantic Fidelity.
- Workflow.
- Rights and provenance.
- Publishing workflow and preflight.
- AI governance.
- Observability.
- Backup governance.
- Need-to-Know access.
- Unified language management.

Representative Web test areas include:

- Frontend shell.
- Core module screens.
- Editorial pipeline.
- Translation workspace.
- Review workspace.
- Publishing workspace.
- Distribution center.
- Rights and provenance workspace.
- UI internationalization.
- Launch readiness polish.

## CI Integration

The current CI workflow validates:

- Committed secret scan.
- Shell syntax.
- Docker Compose configuration.
- Nginx template validation.
- API contract and integration tests.
- Runtime database and backup tests.
- Shared JSON Master tests.
- Fixture JSON validation.
- Dependency-aware typecheck, lint, test, build, and audit.
- Trivy filesystem vulnerability scan.

Typecheck, lint, test, build, and audit run when dependencies are available.
Contract tests remain required even when dependency installation is skipped.

## Automation Requirements

Automated tests should be:

- Deterministic.
- Repeatable.
- Environment-aware.
- Fast enough for CI when possible.
- Traceable to module requirements.
- Auditable through execution metadata.
- Safe for tenant isolation and sensitive data.

## Test Pyramid

Recommended order:

1. Unit tests for pure business rules and helpers.
2. Contract tests for module APIs and DTOs.
3. Integration tests for module boundaries and persistence.
4. End-to-end tests for critical user workflows.
5. Manual validation for high-risk editorial and accessibility scenarios.

## Regression Strategy

Regression suites should cover:

- MVP editorial workflow.
- Authentication and authorization.
- Tenant isolation.
- Translation and QA.
- Semantic Fidelity.
- Workflow approvals.
- Publishing and export.
- Rights and provenance.
- Backup and restore.
- AI governance constraints.

## Gaps

The repository does not yet include:

- Central test plan registry.
- Central test case registry.
- Central defect registry.
- Coverage snapshots recorded as platform entities.
- Quality gate runtime records.
- Full browser-driven E2E tests.
- Load and stress automation.
- Centralized AI benchmark suite.
- Formal release validation evidence store.

## Migration Guidance

Future automation implementation should preserve existing tests, then register
them as managed suites in the Quality Assurance module instead of replacing
them.
