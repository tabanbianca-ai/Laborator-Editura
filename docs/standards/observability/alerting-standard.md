# Canonical Alerting Standard

## Purpose

This document defines canonical alert fields, severity, lifecycle, routing,
escalation, suppression, notification, ownership, and audit requirements.

## Canonical Alert Fields

Every alert must define:

| Field | Requirement |
| --- | --- |
| `alertId` | Unique alert identifier. |
| `severity` | Canonical severity. |
| `source` | Source system, service, script, or monitor. |
| `triggerCondition` | Condition that triggered the alert. |
| `escalationPolicy` | Escalation policy reference. |
| `notificationChannels` | Approved delivery channels. |
| `resolutionStatus` | Current alert lifecycle status. |
| `owner` | Accountable owner. |

## Alert Severity

Canonical alert severities:

- `LOW`.
- `MEDIUM`.
- `HIGH`.
- `CRITICAL`.

Severity must be based on impact, urgency, user risk, security risk,
publication risk, compliance risk, and recoverability.

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
- Notification delivery failure.
- Security policy violation.
- Restricted access attempts.
- Publishing or distribution failure.
- Deployment failure.
- TLS or certificate expiry.
- Configuration drift.
- Feature flag expired.

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

## Routing and Escalation

Alert routing must define:

- Owner.
- Primary responder.
- Escalation target.
- Escalation delay.
- Notification channels.
- Business hours or always-on policy.
- Tenant visibility.
- Required audit events.

## Notification Channels

Supported notification channel categories:

- Email.
- In-app notification.
- Webhook.
- Slack.
- Microsoft Teams.

Notification and Communication owns delivery. Observability owns alert
condition evaluation and alert state.

## AI Rules

AI may:

- Diagnose possible causes.
- Summarize incidents.
- Suggest remediation.
- Suggest escalation.
- Detect repeated patterns.

AI may not:

- Hide alerts.
- Delete alerts.
- Suppress critical alerts automatically.
- Execute infrastructure actions automatically.
- Modify security policy automatically.
- Approve incident resolution.

## Alert Audit

Audit must record:

- Alert rule created.
- Alert rule changed.
- Alert triggered.
- Alert routed.
- Alert acknowledged.
- Alert escalated.
- Alert suppressed.
- Alert resolved.
- Alert reopened.
- Alert retention policy changed.
