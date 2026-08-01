# Canonical Exception Handling Standard

## Purpose

This document defines required exception handling, retry, timeout,
compensation, rollback, escalation, and human intervention rules for all
workflows.

## Exception Handling Requirement

Every workflow must define an exception policy before activation.

The exception policy must include:

- Retry policy.
- Timeout policy.
- Compensation actions.
- Rollback strategy.
- Escalation rules.
- Human intervention policy.
- Failure classification.
- Audit requirements.

## Retry Policy

Retry policies must define:

- Retryable failures.
- Non-retryable failures.
- Maximum attempts.
- Backoff strategy.
- Idempotency key requirements.
- Final failure behavior.
- Observability metrics.
- Audit event requirements.

Examples of retryable failures:

- Temporary provider outage.
- Timeout.
- Network interruption.
- Temporary lock conflict.

Examples of non-retryable failures:

- Missing permission.
- Missing rights.
- Invalid workflow state.
- Invalid input contract.
- Human rejection.

## Timeout Policy

Timeout policies must define:

- Step timeout.
- Approval timeout where applicable.
- Integration timeout.
- AI execution timeout.
- Notification timeout.
- Escalation target.
- Final status after timeout.

Timeouts must not silently approve or publish anything.

## Compensation Actions

Compensation actions must be documented for workflows where partial execution
can happen.

Examples:

- Mark export as failed if artifact generation fails.
- Revoke a pending distribution record after failed release approval.
- Cancel a scheduled AI task when the parent workflow is cancelled.
- Mark a webhook delivery as failed after final retry.

Compensation must preserve history. It must not delete audit evidence.

## Rollback Strategy

Rollback strategy must define:

- What can be rolled back.
- What cannot be rolled back.
- Required approval.
- Data preservation requirements.
- User-visible status after rollback.
- Audit events.

Published, distributed, archived, or legally relevant records must not be
silently rolled back. They require explicit corrective records.

## Escalation Rules

Escalation rules must define:

- Escalation trigger.
- Escalation role.
- Escalation delay.
- Escalation message.
- Escalation visibility.
- Audit event.

Examples:

- Approval overdue.
- Repeated export failure.
- Preflight blocked.
- Rights missing.
- Integration provider unavailable.
- Budget exceeded.

## Human Intervention Policy

Human intervention is required when:

- A workflow reaches a gate requiring approval.
- Rules conflict.
- Source authorities conflict.
- Rights or provenance are missing.
- Security, access, or Need-to-Know issues occur.
- AI confidence is insufficient for an advisory decision.
- An exception affects publication, access, cost, rights, or governance.

Human intervention must be traceable, attributed, timestamped, and auditable.

## Exception Audit

Audit must record:

- Exception detected.
- Exception classified.
- Retry attempted.
- Retry exhausted.
- Timeout reached.
- Compensation started.
- Compensation completed.
- Rollback requested.
- Rollback approved or rejected.
- Escalation created.
- Human intervention requested.
- Human intervention completed.

## Current Baseline Guidance

Existing modules may have local exception behavior. Future migration must map
each local exception to canonical policies without breaking validated
runtime behavior.
