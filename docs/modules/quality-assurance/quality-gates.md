# Quality Assurance Quality Gates

Quality gates are mandatory validation checkpoints that determine whether a
change, release candidate, deployment, publication workflow, or operational
process may advance.

## Core Rule

No version may be promoted when:

- Mandatory tests are incomplete.
- Critical vulnerabilities remain unresolved.
- Minimum coverage thresholds are not met.
- AI validation fails.
- Accessibility validation fails.
- Required manual approvals are missing.
- Critical or blocking defects remain open.

## Gate Categories

Recommended gate categories:

- Pull request gate.
- Main branch gate.
- Release candidate gate.
- Staging deployment gate.
- Production deployment gate.
- Publication artifact gate.
- AI model or prompt promotion gate.
- Accessibility release gate.
- Security release gate.

## Current Gate Baseline

The current CI workflow provides a practical gate baseline:

- Repository and infrastructure validation.
- MVP contract validation.
- Typecheck, lint, tests, build, and dependency audit when dependencies are
  available.
- Filesystem vulnerability scan.
- Staging deployment and operations workflows.

The current baseline does not yet persist gate definitions, gate evaluations,
coverage snapshots, or release approvals as first-class QA records.

## Mandatory Gate Inputs

Each quality gate should evaluate:

- Required test suites.
- Required manual validations.
- Coverage thresholds.
- Security scan status.
- Accessibility validation status.
- AI validation status.
- Open defects by severity.
- Evidence completeness.
- Approval status.

## Coverage Thresholds

Coverage dimensions:

- Code coverage.
- API coverage.
- Workflow coverage.
- UI coverage.
- AI coverage.
- Accessibility coverage.
- Regression coverage.

Thresholds are configurable through the Configuration module and may vary by
module, environment, risk level, and release type.

## Gate Outcomes

Gate outcomes:

- `PASSED`.
- `FAILED`.
- `WARNING`.
- `MANUAL_REVIEW_REQUIRED`.
- `WAIVED`.

Rules:

- `FAILED` blocks promotion.
- `MANUAL_REVIEW_REQUIRED` blocks automation until authorized review.
- `WAIVED` requires authorized human approval, justification, expiration, and
  audit evidence.

## Human Final Authority

AI may summarize gate status, identify risks, and recommend remediation. AI
may not approve a release, waive a failure, hide a failed result, or bypass a
gate.

## Audit

Quality gate audit must record:

- Gate definition version.
- Inputs.
- Evaluation result.
- Blocking issues.
- Approver when applicable.
- Waiver details when applicable.
- Release or deployment target.
- Evidence references.
