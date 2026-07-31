# Integration Monitoring

## Purpose

Integration Monitoring tracks availability, latency, errors, throughput,
synchronization health, webhook failures, queue health, contract violations,
and provider health.

## Monitoring Targets

Monitoring must track:

- API availability.
- API latency.
- API error rate.
- API throughput.
- Authentication failures.
- Authorization failures.
- Rate limit events.
- Synchronization runs.
- Synchronization failures.
- Webhook delivery attempts.
- Webhook failures.
- Queue depth.
- Dead-letter queue size.
- Message processing latency.
- Connector status.
- Provider status.
- Contract violations.
- Schema validation failures.

## Required Telemetry

Integration telemetry should include:

- Correlation id.
- Causation id where applicable.
- Request id.
- Organization id where applicable.
- Connector id where applicable.
- API route or event name.
- Version.
- Status.
- Duration.
- Retry count.
- Error code.
- Safe error message.
- Timestamp.

## Current Baseline

Current observability foundations include:

- Observability module for metrics, logs, traces, and agent executions.
- Gateway route registry metadata.
- Webhook delivery logs.
- Integration audit events.
- Gateway audit events.
- Staging health checks.
- Infrastructure monitoring scripts.

## Alerting

Future alerting should cover:

- API outage.
- Connector outage.
- Webhook failure threshold.
- Queue backlog.
- Dead-letter growth.
- Contract validation failures.
- Provider degradation.
- Authentication anomaly.
- Rate limit abuse.

## Contract Violation Monitoring

Contract violations must record:

- Contract id.
- Version.
- Violating request or event.
- Producer or caller.
- Validation error.
- Correlation id.
- Timestamp.
- Severity.
- Remediation owner.

## Current Gaps

- Queue monitoring is not implemented because broker runtime is not present.
- Contract violation runtime reporting is not centralized.
- External provider health polling is mostly metadata-based.
- Integration dashboard is not fully implemented.

## Standardization Plan

1. Link route registry to observability records.
2. Link webhook delivery logs to integration health.
3. Define contract violation record.
4. Define connector health checks.
5. Add queue metrics when broker runtime is implemented.
6. Add integration health dashboard in a future approved phase.
