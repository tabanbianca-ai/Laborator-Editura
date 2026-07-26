# Observability Logging

## Purpose

Logging records structured diagnostic information from services, modules,
workers, scripts, integrations, and future background jobs.

All logs must be structured, tenant-safe, and correlation-aware.

## Severity Levels

Official logging levels:

- `TRACE`.
- `DEBUG`.
- `INFO`.
- `WARN`.
- `ERROR`.
- `FATAL`.

Current runtime severity mapping:

- `DEBUG`.
- `INFO`.
- `WARN`.
- `ERROR`.
- `CRITICAL`.

Future alignment should map `CRITICAL` to `FATAL` or preserve both through a
documented compatibility layer.

## Required Fields

Structured logs should include:

- `timestamp`.
- `level`.
- `service`.
- `module`.
- `operation`.
- `requestId`.
- `correlationId`.
- `traceId`.
- `userId`.
- `organizationId`.
- `workspaceId` when available.
- `requestPath`.
- `result`.
- `durationMs`.
- `message`.
- `metadata`.

## Current Repository Baseline

Implemented foundations:

- Observability module stores structured log records with severity, module,
  correlation ID, actor ID, request path, message, metadata, and timestamp.
- Infrastructure scripts use UTC timestamped `INFO`, `WARNING`, `ERROR`, and
  `SUCCESS` logs.
- Backend observability documentation defines required structured log fields.
- Security and Auth services produce audit and security events.

Current gaps:

- Central request logging middleware is not yet documented as implemented.
- Correlation ID propagation is not yet standardized across every request,
  event, worker, script, and future queue.
- Log aggregation backend is not connected.
- Log retention policy is not fully tied to Backup and Retention governance.

## Redaction Rules

Logs must not contain:

- Passwords.
- Tokens.
- API keys.
- MFA secrets.
- Recovery codes.
- Provider secrets.
- Full confidential manuscript content.
- Full private user notes.
- Unnecessary personal data.

Safe references and IDs should be used instead.

## Logging Sources

Required logging sources:

- API requests.
- Background jobs.
- Workflow transitions.
- AI executions.
- Rendering jobs.
- Notification delivery attempts.
- Backup and restore jobs.
- Security events.
- Gateway and integration actions.
- Infrastructure validation scripts.

## Audit Boundary

Logs explain system behavior. They do not prove authorization or replace
audit records.

Every state-changing action must still create a domain audit event.
