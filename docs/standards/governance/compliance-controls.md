# Canonical Compliance Controls Standard

## Purpose

Compliance controls verify that modules, services, documentation,
infrastructure, AI workflows, and editorial processes follow approved
standards, policies, architecture, and risk decisions.

## Required Control Areas

The platform must verify:

- Standard conformance.
- Policy conformance.
- Architecture conformance.
- Documentation completeness.
- Test coverage.
- Rights conformance.
- Accessibility.
- Security.
- Configuration.
- Observability.

## Control Record

Each control should preserve:

- `controlId`.
- Name.
- Category.
- Scope.
- Related policy.
- Related standard.
- Related risk.
- Owner.
- Frequency.
- Evidence.
- Status.
- Last evaluation date.
- Findings.
- Remediation reference.
- Audit information.

## Control Statuses

Allowed control statuses are:

- `NOT_EVALUATED`.
- `PASS`.
- `WARNING`.
- `FAIL`.
- `WAIVED`.
- `MANUAL_REVIEW_REQUIRED`.

## Control Rules

- Controls must be mapped to policies, standards, or risks.
- Failed controls must create findings.
- Waivers must be time-limited and approved.
- Evidence must be retained.
- Automated controls are preferred but do not replace human review where
  Human Final Authority applies.

