# Messaging

## Purpose

Messaging standards define how asynchronous communication, queues, retries,
dead-letter handling, ordering, and message versioning work across the
platform.

## Asynchronous by Default

Cross-module and external workflows that do not require immediate synchronous
response should use asynchronous messaging when runtime infrastructure is
available.

Examples:

- Export generation.
- AI analysis.
- Media rendering.
- Webhook delivery.
- External synchronization.
- Search indexing.
- Analytics ingestion.
- Backup coordination.

## Required Message Fields

Each message must include:

- Message id.
- Message type.
- Message version.
- Producer.
- Intended consumer or topic.
- Organization id where applicable.
- Correlation id.
- Causation id.
- Idempotency key.
- Created at.
- Payload.
- Payload schema version.
- Retry policy.
- Retention policy.
- Data classification.

## Delivery Semantics

Messaging should support:

- Asynchronous messaging.
- Guaranteed delivery where required.
- Dead-letter queues.
- Retry policies.
- Message ordering where required.
- Message versioning.
- Idempotent consumers.

## Retry Safety

Retryable handlers must:

- Use idempotency keys.
- Avoid duplicate side effects.
- Detect already-processed messages.
- Preserve error context.
- Stop retrying on non-retryable errors.

## Dead-Letter Queues

Dead-letter records must preserve:

- Original message.
- Failure reason.
- Attempt count.
- Last error.
- Last attempted at.
- Consumer.
- Correlation id.
- Reprocessing policy.
- Audit reference.

## Ordering

Ordering must be explicit.

If ordering matters, the contract must define:

- Ordering key.
- Expected sequence.
- Out-of-order behavior.
- Duplicate behavior.

## Current Baseline Assessment

Strengths:

- Backend eventing and messaging standards exist.
- Integration event catalog exists.
- Long-running work is documented as future background processing.

Gaps:

- Message broker runtime is not implemented.
- Queue definitions are not implemented.
- Dead-letter queues are not implemented.
- Retry runtime is not implemented.
- Message ordering policy is not implemented.

## Standardization Plan

1. Define message envelope schema.
2. Define retry and dead-letter standards.
3. Identify workflows that should move to asynchronous processing.
4. Select broker only in a future approved implementation phase.
5. Add message observability and audit requirements before runtime rollout.
