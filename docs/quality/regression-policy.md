# Regression Policy

## Purpose

Regression policy prevents fixed defects from returning.

## Rules

- Every confirmed defect must be classified by severity.
- Every code fix must include or update a regression test unless the fix is
  documentation-only or test coverage is impossible for a documented reason.
- Regression tests should target the smallest layer that proves the defect.
- Critical and High defects must include release notes or report updates where
  appropriate.
- Flaky tests must be fixed or quarantined with explicit owner and deadline.

## Defect Record Requirements

Each defect record must document:

- Severity: Critical, High, Medium, or Low.
- Root cause.
- User or system impact.
- Affected modules.
- Fix summary.
- Associated regression test.
- Release affected.
- Verification result.

## Current Baseline

Production readiness reports, staging validation reports, and phase reports
already record defects and validation results. Regression tests have been
added for several prior issues such as auth context security, founder
protection, TypeScript blockers, runtime database behavior, and infrastructure
validation.

## Acceptance Criteria

- Reopened defects are rare and tracked.
- Fixed Critical and High defects cannot recur silently.
- Regression tests run in CI.
