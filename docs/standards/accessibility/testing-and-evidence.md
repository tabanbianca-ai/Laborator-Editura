# Canonical Accessibility Testing and Evidence Standard

## Purpose

This document defines automated and human accessibility validation under
Standard 12.

## Automated Validation

Automated validation includes:

- Static analysis.
- WCAG rules.
- Contrast.
- HTML structure.
- Labels.
- ARIA attributes.
- EPUB metadata.
- PDF structure.
- Missing captions.
- Missing transcripts.

## Human Validation

Human validation includes:

- Keyboard navigation.
- Screen reader use.
- Zoom and reflow.
- Real critical-flow testing.
- Message clarity.
- Alternative text review.
- Audio description review.
- Device testing.

Automated testing is not sufficient for final certification.

## Severity Levels

Accessibility issue severity levels are:

- `BLOCKING`.
- `CRITICAL`.
- `MAJOR`.
- `MINOR`.
- `ADVISORY`.

`BLOCKING` and `CRITICAL` issues block release.

## Waiver Requirements

A waiver requires:

- Justification.
- Impact assessment.
- Remediation deadline.
- Owner.
- Approval.
- Compensating measure.
- Complete audit.

## Quality Gate Chain

Accessibility validation integrates into:

```text
Design Review
  -> Component Tests
  -> Application Tests
  -> Document Validation
  -> Multimedia Validation
  -> Staging Review
  -> Release Gate
```

## Release Blocking Conditions

A release cannot be promoted when:

- A critical flow is inaccessible.
- Blocking violations remain unresolved.
- Required transcripts or captions are missing.
- Documents do not meet the configured accessibility policy.
- Required validation evidence is missing.

## Audit Requirements

Audit must record:

- Evaluations.
- Violations.
- Remediation.
- Waivers.
- Approvals.
- Validated versions.
- Tools used.
- Evidence.
- Profile changes.
- AI-generated alternative text.
- Human validations.

