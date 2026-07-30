# Quality Assurance Test Management

Test Management governs how Laborator Editura plans tests, maps requirements
to validation evidence, coordinates manual and automated execution, and tracks
defects until resolution.

## Planning Workflow

```text
Requirement
  -> Test Planning
  -> Test Case Definition
  -> Implementation
  -> Automated Testing
  -> Manual Validation
  -> Quality Gate
  -> Release Approval
```

## Test Plan Requirements

Each test plan should define:

- Scope.
- Owner.
- Objectives.
- Environment.
- Schedule.
- Acceptance criteria.
- Required test suites.
- Manual evidence requirements.
- Quality gates.
- Defect severity rules.

## Test Case Requirements

Each test case should define:

- Category.
- Preconditions.
- Execution steps.
- Expected result.
- Priority.
- Risk level.
- Automation status.
- Requirement reference.
- Evidence requirement.

## Current Repository Baseline

The current repository uses executable contract tests as the primary source of
test management evidence:

- API behavior is covered through `apps/api/tests/*.test.mjs`.
- Web behavior is covered through `apps/web/tests/*.test.mjs`.
- Runtime database behavior is covered through `packages/db/tests/*.test.mjs`.
- Shared schema behavior is covered through `packages/shared/tests/*.test.mjs`.
- MVP and production readiness validation are documented through checklist and
  release preparation documents.

This baseline is pragmatic and effective for the current implementation. It
does not yet provide a central test plan registry, defect lifecycle, test case
catalog, manual evidence repository, or requirement-test-defect traceability
records.

## Requirement Traceability

Every requirement should be traceable through:

- Specification reference.
- Owning module.
- Test plan.
- Test case.
- Test execution.
- Evidence.
- Defect when failed.
- Release decision.

Future implementation should map test cases to:

- `SPEC.md`.
- `ROADMAP.md`.
- Module specification documents.
- Architecture chapters.
- Contract tests.
- CI workflow runs.
- Manual release evidence.

## Defect Lifecycle

Recommended defect statuses:

- `OPEN`.
- `TRIAGED`.
- `IN_PROGRESS`.
- `FIXED`.
- `VERIFIED`.
- `REOPENED`.
- `WAIVED`.
- `CLOSED`.

Rules:

- Critical defects block release.
- Waivers require authorized approval and expiration where applicable.
- Defect ownership must be explicit.
- Resolution evidence must be attached before closure.

## Roles

Quality Assurance roles:

- QA Administrator.
- QA Engineer.
- Test Automation Engineer.
- Developer.
- Product Owner.
- Release Manager.
- Security Tester.
- Accessibility Tester.
- AI Validator.
- Auditor.

Permissions are managed exclusively through IAM and Need-to-Know access.

## Manual Validation

Manual validation remains required for:

- Editorial user experience.
- Accessibility assistive technology checks.
- Release readiness sign-off.
- AI output acceptability.
- Publication artifact review.
- Rights-sensitive publishing decisions.

Manual evidence should include:

- Reviewer.
- Date and time.
- Environment.
- Scope.
- Observed result.
- Evidence attachments.
- Decision.

## Audit Requirements

Audit must cover:

- Test plans.
- Test cases.
- Executions.
- Results.
- Defects.
- Approvals.
- Acceptance criteria changes.
- Evidence changes.
- Release validation decisions.
