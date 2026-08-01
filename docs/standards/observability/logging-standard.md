# Canonical Logging Standard

## Purpose

This document defines canonical logging categories, structured log fields,
severity levels, redaction rules, source requirements, retention expectations,
and logging audit boundaries.

## Log Categories

Canonical log categories include:

| Category | Examples |
| --- | --- |
| System | Application logs, infrastructure logs, container logs, Kubernetes logs |
| Functional | Workflow logs, editorial logs, publication logs, translation logs |
| AI | Prompt logs, model execution logs, agent logs, RAG logs |
| Security | Authentication logs, authorization logs, security events, vulnerability events |
| Audit | Administrative actions, configuration changes, deployment events, compliance events |

## Canonical Severity Levels

Canonical severity levels are:

- `TRACE`.
- `DEBUG`.
- `INFO`.
- `WARN`.
- `ERROR`.
- `FATAL`.

Existing `CRITICAL` records may be mapped to `FATAL` through a documented
compatibility layer where required.

## Required Structured Log Fields

Every structured log should include:

- `uuid`.
- `timestamp`.
- `severity`.
- `source`.
- `service`.
- `component`.
- `module`.
- `operation`.
- `environment`.
- `requestId`.
- `correlationId`.
- `traceId`.
- `spanId` where applicable.
- `userId` where applicable.
- `serviceAccountId` where applicable.
- `agentId` where applicable.
- `organizationId` where applicable.
- `projectId` where applicable.
- `documentId` where applicable.
- `requestPath` where applicable.
- `result`.
- `durationMs` where applicable.
- `message`.
- `metadata`.

## Logging Sources

Required logging sources include:

- API requests.
- Backend services.
- Frontend server-side rendering where applicable.
- Background jobs.
- Workflow transitions.
- AI executions.
- Rendering and export jobs.
- Notification delivery attempts.
- Backup and restore jobs.
- Security events.
- Gateway and integration actions.
- Infrastructure validation scripts.
- Deployment and rollback scripts.

## Redaction Rules

Logs must not contain:

- Passwords.
- Access tokens.
- Refresh tokens.
- API keys.
- Webhook secrets.
- MFA secrets.
- Recovery codes.
- Provider credentials.
- Private keys.
- Full confidential manuscript content.
- Full private user notes.
- Unnecessary personal data.

Logs should use safe identifiers, references, classifications, and summaries
instead of raw sensitive data.

## Tenant Safety

Logs must preserve tenant isolation.

Rules:

- Organization and workspace identifiers may be recorded for authorized
  diagnostics.
- Tenant data must not leak across log views.
- Need-to-Know rules apply to log access.
- AI agents must receive only minimum necessary log excerpts.

## Audit Boundary

Logs explain system behavior and diagnostics.

Logs do not prove authorization, replace business audit, or replace security
audit.

Every governance-relevant state-changing action must create a domain audit
event in addition to logs.

## Logging Audit

Audit must record:

- Logging policy changed.
- Log retention policy changed.
- Log access granted.
- Restricted log accessed.
- Log export created.
- Log redaction failure detected.
- Log collection disabled or restored.
- Protected log exception approved.
