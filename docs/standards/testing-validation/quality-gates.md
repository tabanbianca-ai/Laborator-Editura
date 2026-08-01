# Canonical Quality Gates Standard

## Purpose

This document defines mandatory quality gates, release thresholds, defect
severity, gate outcomes, waiver rules, and release approval constraints.

## Minimum Release Thresholds

Every release must meet at least:

- All critical tests passed.
- No open critical vulnerability.
- No known data loss risk.
- No unapproved contract incompatibility.
- Mandatory regression tests passed.
- Mandatory accessibility validations passed.
- Migrations tested and reversible.
- Rollback plan validated.
- Documentation updated.
- Traceability complete.

Numeric thresholds are centrally configurable and may vary by module and risk
level.

## Release Gate Sequence

The canonical release gate sequence is:

```text
Code Validation
  -> Contract Validation
  -> Security Validation
  -> Data Migration Validation
  -> Accessibility Validation
  -> AI Validation
  -> Regression Validation
  -> Release Approval
```

Any blocking failure stops automatic promotion.

## Gate Inputs

Each quality gate must evaluate:

- Required test suites.
- Required manual validations.
- Coverage thresholds.
- Security scan status.
- Accessibility validation status.
- AI validation status.
- Migration validation status.
- Backup/restore validation status.
- Open defects by severity.
- Evidence completeness.
- Approval status.

## Gate Outcomes

Allowed gate outcomes:

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

## Defect Severity

Canonical defect severities:

- `CRITICAL`.
- `HIGH`.
- `MEDIUM`.
- `LOW`.
- `INFORMATIONAL`.

`CRITICAL` blocks publication or safe platform use.

`HIGH` affects important functionality and requires remediation before
release unless an approved waiver exists.

`MEDIUM` and `LOW` may be planned later only when risk is documented and
formally accepted.

## Gate Bypass Rule

Quality gates must not be bypassed.

Exceptions require:

- Authorized human approval.
- Justification.
- Risk assessment.
- Expiration date.
- Evidence reference.
- Audit event.

AI may summarize gate status and recommend remediation, but it must not
approve a release, waive a failure, hide a failed result, or bypass a gate.

## Audit

Audit must record:

- Gate definition created.
- Gate definition versioned.
- Gate evaluated.
- Gate passed.
- Gate failed.
- Gate warning raised.
- Gate waiver requested.
- Gate waiver approved or rejected.
- Release approved.
- Release blocked.
