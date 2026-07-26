# Observability Alerting

## Purpose

Alerting detects operational, security, workflow, publishing, AI, notification,
backup, and infrastructure problems and routes them for human review and
response.

Alert delivery must integrate with Notification and Communication.

## Alert Manager Responsibilities

The Alert Manager supports:

- Configurable thresholds.
- Alert rules.
- Deduplication.
- Escalation.
- Acknowledgement.
- Suppression.
- Resolution tracking.
- Policy-based routing.

## Alert Channels

Supported target channels:

- Email.
- In-app notifications.
- Webhook.
- Slack.
- Microsoft Teams.

Notification and Communication owns delivery. Observability owns alert
condition evaluation and alert state.

## Required Alert Families

Alerts must be definable for:

- Service unhealthy.
- Health status changed.
- High error rate.
- High latency.
- Database unavailable.
- Backup failed.
- Restore dry-run failed.
- Disk threshold exceeded.
- AI provider unavailable.
- AI budget threshold exceeded.
- Workflow SLA breached.
- Notification DLQ threshold exceeded.
- Security policy violation.
- Restricted access attempts.
- Publishing/distribution failure.
- Deployment failure.
- TLS/certificate expiry.

## Current Repository Baseline

Current foundations:

- Health endpoints exist.
- Observability metrics/logs/traces exist.
- Infrastructure monitoring scripts exist.
- Notification module architecture now defines delivery channels.
- Security Governance stores policy violations.

Current gaps:

- Alert rules are not yet runtime modeled.
- Alert state and acknowledgement are not yet implemented.
- Alert delivery is not connected to Notification and Communication.
- Deduplication and escalation policies are not yet implemented.

## Alert Lifecycle

```text
Rule Evaluated
  -> Alert Triggered
  -> Alert Routed
  -> Alert Acknowledged
  -> Alert Resolved
```

Suppression lifecycle:

```text
Alert Triggered
  -> Suppressed by Policy
  -> Audit Recorded
```

## Human Final Authority

AI may:

- Diagnose possible causes.
- Summarize incidents.
- Suggest remediation.

AI may not:

- Hide alerts.
- Delete alerts.
- Suppress critical alerts automatically.
- Execute infrastructure actions automatically.
- Modify security policy automatically.
