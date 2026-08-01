# Requirements Traceability Standard

## Purpose

This document defines how requirements, acceptance criteria, test cases,
executions, evidence, defects, versions, and approvals must be linked.

## Mandatory Traceability Chain

Every requirement must be traceable through:

```text
Requirement
  -> Acceptance Criterion
  -> Test Case
  -> Execution
  -> Evidence
  -> Approval
```

No requirement may be declared complete without this traceability chain.

## Requirement Mapping

Each requirement must define:

- Requirement ID.
- Source document.
- Owner.
- Module or scope.
- Acceptance criteria.
- Risk level.
- Test case references.
- Execution references.
- Defect references.
- Implementation version.
- Approval status.

## Acceptance Criteria

Acceptance criteria must be:

- Specific.
- Testable.
- Traceable.
- Versioned.
- Owned.
- Risk-classified.

Ambiguous acceptance criteria must be clarified before release approval.

## Traceability Matrix

The traceability matrix must show:

| Requirement | Acceptance criterion | Test cases | Latest executions | Evidence | Defects | Approval |
| --- | --- | --- | --- | --- | --- | --- |
| Requirement ID | Criterion ID | Test case IDs | Execution IDs and results | Evidence IDs | Defect IDs | Approval state |

## Untested Requirements

Untested requirements must be classified as:

- `MISSING_TEST`.
- `MANUAL_VALIDATION_REQUIRED`.
- `NOT_AUTOMATABLE`.
- `DEFERRED_WITH_APPROVAL`.
- `OUT_OF_SCOPE`.

Untested critical or high-risk requirements block release unless a formal
waiver is approved.

## Regression Traceability

Regression suites must include:

- Previously failed requirements.
- Previously fixed defects.
- Critical workflows.
- Security-sensitive behavior.
- Data migration paths.
- Public release paths.
- AI governance constraints.
- Localization and accessibility baseline behavior.

## Approval

Final approval must verify:

- Required test cases exist.
- Required executions passed.
- Required evidence exists.
- Blocking defects are closed.
- Approved waivers are current and justified.
- Traceability is complete.

AI may summarize traceability but cannot approve traceability completion.

## Audit

Audit must record:

- Requirement mapped to test.
- Acceptance criterion changed.
- Test coverage changed.
- Traceability gap detected.
- Traceability gap accepted.
- Waiver approved.
- Final traceability approval.
