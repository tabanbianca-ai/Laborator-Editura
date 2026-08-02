# Canonical Architecture Exceptions Standard

## Purpose

Architecture exceptions govern temporary, justified deviations from approved
architecture, standards, policies, or implementation rules.

Permanent exceptions are prohibited.

## Required Exception Fields

Each exception must contain:

- Reason.
- Justification.
- Impact assessment.
- Risk assessment.
- Approval duration.
- Elimination plan.
- Owner.
- Architecture approval.
- Audit information.

## Exception Statuses

Allowed exception statuses are:

- `REQUESTED`.
- `UNDER_REVIEW`.
- `APPROVED`.
- `REJECTED`.
- `EXPIRED`.
- `REMEDIATION_IN_PROGRESS`.
- `CLOSED`.

## Exception Rules

- Exceptions must be time-limited.
- Exceptions must have an owner.
- Exceptions must include risk assessment.
- Exceptions must include remediation or elimination plan.
- Exceptions affecting security, rights, publication, data, AI governance, or
  production stability require stricter review.
- Expired exceptions become non-compliance findings.
- AI may draft exception analysis but must not approve exceptions.

