# Notification and Communication Workflows

## Purpose

This document defines how communication workflows are coordinated through
Workflow Engine and Notification Engine.

Notification workflows must be centralized and auditable.

## Standard Notification Flow

```text
Application Event
  -> Notification Created
  -> Template Selected
  -> Template Rendered
  -> Preferences Evaluated
  -> Channel Selected
  -> Delivery Queued
  -> Delivery Attempted
  -> Delivered or Retry Scheduled
```

## Retry Flow

```text
Delivery Failed
  -> Retry Policy Evaluated
  -> Retry Scheduled
  -> Delivery Requeued
  -> Delivery Attempted
```

## Dead Letter Flow

```text
Delivery Failed
  -> Retry Limit Reached
  -> Dead Lettered
  -> Administrator Review
  -> Manual Retry or Closure
```

## Webhook Flow

```text
Application Event
  -> Webhook Subscription Matched
  -> Payload Rendered
  -> HMAC Signature Applied
  -> Webhook Delivery Queued
  -> Webhook Delivered or Retried
```

## Preference Flow

```text
Notification Request
  -> Mandatory Policy Check
  -> Recipient Preference Check
  -> Quiet Hours Check
  -> Channel Selection
```

Mandatory security, account recovery, rights, workflow, and compliance
messages may follow policy-defined delivery rules even when optional messages
are disabled.

## Workflow Engine Integration

Workflow Engine owns process orchestration:

- Task reminders.
- Approval requests.
- Escalation notifications.
- SLA breach notifications.
- Publication readiness notifications.
- Blocked workflow notifications.

Notification Engine owns communication execution:

- Template rendering.
- Channel routing.
- Delivery queueing.
- Retry handling.
- Delivery tracking.
- Communication audit.

## Module Integration Rules

- Modules emit events or notification requests.
- Modules must not send email, push, webhooks, or external messages directly.
- Notification Engine must not own domain decisions.
- Workflow Engine must not own message delivery.
- AI Orchestration may prepare summaries, but Notification Engine controls
  delivery through templates and policies.

## Human Final Authority

AI may:

- Draft notification text.
- Suggest recipient groups.
- Summarize incidents.
- Explain delivery failures.

AI may not:

- Activate templates.
- Override user preferences.
- Enable channels.
- Expose restricted content.
- Approve workflow decisions.
- Publish or grant rights.
