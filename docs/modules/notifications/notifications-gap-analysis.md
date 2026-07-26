# Notification and Communication Gap Analysis

## Purpose

This document compares the current repository baseline with the official
Notification and Communication Module specification.

## Summary

The repository contains important adjacent foundations but does not yet have a
centralized Notification Engine.

The target architecture requires centralized event-driven communication,
versioned localized templates, preference-aware channel routing, asynchronous
delivery queues, retries, dead letter handling, webhook dispatch, delivery
tracking, observability, and audit.

## Gap Table

| Area | Current baseline | Required target | Risk |
| --- | --- | --- | --- |
| Notification engine | Not implemented | Central Notification Engine | High |
| Templates | UI i18n only | Versioned notification templates | High |
| Channel routing | Not implemented | Preference-aware router | High |
| In-app notifications | Not centralized | Tenant-scoped in-app notifications | Medium |
| Email | Auth records exist | Central email delivery workflow | High |
| Push notifications | Documented frontend capability | Channel adapter metadata | Medium |
| Webhooks | Gateway registry and logs | Notification-driven dispatch | Medium |
| Queue/retry | Not centralized | Delivery, retry, and DLQ queues | High |
| Preferences | Workspace metadata | Typed notification preferences | Medium |
| Audit | Module-specific audit | Communication audit | Medium |
| Observability | Generic observability exists | Delivery metrics and traces | Medium |

## Current Strengths

- Gateway already models webhook registration, enable/disable, retry policy
  metadata, and delivery logs.
- Webhook documentation exists in `docs/integration/webhooks.md`.
- Scheduling includes reminder records and overdue alert metadata.
- Workspace preferences include notification preference metadata.
- Auth records password reset and email verification requests.
- Observability supports generic logs, traces, metrics, and agent execution
  records.
- Runtime backup already covers Gateway webhooks, webhook delivery logs,
  Scheduling reminders, Workspace preferences, and audit tables.

## Dispersed Communication Logic

Communication-like behavior exists in:

- Auth password reset and email verification flows.
- Scheduling reminders and overdue alerts.
- Gateway webhooks.
- Workspace notification preference metadata.
- Collaboration comments and moderation activity.
- Workflow, Publishing, Distribution, Rights, and Security audit events.
- Frontend UI messages and loading/error states.

These should be unified incrementally only where they represent outbound
communication rather than domain state or UI rendering.

## Webhook Evaluation

Current webhook support is a strong metadata foundation, but dispatch is not
complete.

Missing capabilities:

- Runtime dispatch worker.
- HMAC signature standard.
- Payload version registry.
- Timeout execution.
- Retry execution.
- Dead letter queue.
- Notification routing to webhook subscriptions.

## Scalability Review

The target module must support:

- Millions of notifications.
- Multiple delivery queues.
- Horizontal delivery workers.
- Backpressure handling.
- Retry isolation per channel.
- Dead letter review.
- Real-time delivery monitoring.
- Delivery metrics and traces.

Current runtime does not yet include notification workers, queue isolation, or
notification-specific observability.

## Risk Evaluation

### Duplicate Communication Risk

If modules continue to add direct email, push, webhook, or external messaging
logic, communication behavior will fragment and audit will become incomplete.

### Privacy Risk

External channels can leak restricted content unless Need-to-Know and redaction
rules are enforced before rendering.

### Localization Risk

Notification templates must use recipient locale and platform localization
rules. Hardcoded communication text would violate development conventions.

### Delivery Reliability Risk

Without queues, retries, and DLQ handling, critical notifications can be lost
or duplicated.

### Workflow Dependency Risk

Workflow Engine should request notifications, but it must not become the
delivery system.

## Acceptance Gaps

The module is incomplete until:

- Notification records are centralized.
- Templates are versioned and localized.
- User preferences are typed and enforced.
- Channel router exists.
- Queue, retry, and DLQ behavior exists.
- Webhook dispatch is integrated with Notification Engine.
- Delivery status is traceable.
- Communication audit is complete.
