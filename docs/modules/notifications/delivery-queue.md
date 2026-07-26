# Notification Delivery Queue

## Purpose

The Delivery Queue processes notification delivery asynchronously and supports
retry, backoff, dead letter handling, idempotency, monitoring, and audit.

## Queue Model

The module should model:

- Delivery queue.
- Retry queue.
- Dead letter queue.
- Priority queues.
- Scheduled delivery queue.

Each delivery must have an idempotency key so retries do not duplicate side
effects.

## Queue Item Lifecycle

```text
CREATED
  -> QUEUED
  -> PROCESSING
  -> SENT
  -> DELIVERED
```

Failure lifecycle:

```text
PROCESSING
  -> FAILED
  -> RETRY_SCHEDULED
  -> QUEUED
```

Terminal failure:

```text
FAILED
  -> DEAD_LETTERED
```

## Retry Policy

Retry policies must define:

- Maximum attempts.
- Backoff strategy.
- Backoff seconds.
- Retryable error categories.
- Non-retryable error categories.
- Dead letter threshold.
- Alert threshold.

Retries must not resend notifications after they are confirmed delivered.

## Delivery Tracking

Each delivery must preserve:

- Notification ID.
- Delivery ID.
- Channel.
- Adapter.
- Attempt count.
- Last attempt timestamp.
- Delivery status.
- Confirmation timestamp.
- Safe provider response metadata.
- Safe error message.
- Correlation ID.

## Current Repository Baseline

Current related foundations:

- Gateway stores webhook delivery logs.
- Scheduling stores reminders but not notification delivery work.
- Observability can store generic metrics, logs, and traces.

Gaps:

- No centralized notification queue exists.
- No retry queue or dead letter queue exists.
- No notification-specific delivery metrics exist.
- No worker model for email, push, in-app, or webhook dispatch exists.

## Performance Requirements

The target architecture must support:

- Millions of notifications.
- Multiple queues.
- Distributed workers.
- Horizontal scaling.
- Real-time delivery monitoring.
- Automatic retry.
- Dead letter review.
- Backpressure handling.

## Audit Requirements

Audit must record:

- Notification queued.
- Delivery processing started.
- Delivery sent.
- Delivery confirmed.
- Delivery failed.
- Retry scheduled.
- Dead lettered.
- Manual retry requested.
