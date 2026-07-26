# Backup API Contracts

## Purpose

This document defines current and target API contracts for the Backup,
Disaster Recovery and Business Continuity Module.

All APIs must be versioned and must enforce authenticated, server-derived
request context unless explicitly approved as public.

## Current APIs

Authenticated backup governance endpoints:

```http
GET  /backup/jobs
POST /backup/jobs

GET  /backup/retention
POST /backup/retention

GET  /backup/recovery-plans
POST /backup/recovery-plans

GET  /backup/preservation

POST /backup/restore/:id

GET  /backup/audit
```

Current behavior:

- Admin or Platform Creator access is required.
- Restore requests are metadata-only.
- AI-initiated restore is rejected.
- AI-initiated retention or DR policy changes are rejected.
- Audit is written for backup job, retention policy, DR plan, preservation
  record, and restore event creation.

## Target APIs From Official Specification

```http
POST /backups
GET  /backups
GET  /backups/{id}

POST /restore
GET  /restore-jobs

POST /recovery-plans
GET  /recovery-plans

POST /backup-policies
```

## Recommended Versioned Module Contracts

```http
GET  /backup/v1/jobs
POST /backup/v1/jobs
GET  /backup/v1/jobs/:id

GET  /backup/v1/repositories
POST /backup/v1/repositories

GET  /backup/v1/policies
POST /backup/v1/policies

GET  /backup/v1/retention
POST /backup/v1/retention

GET  /backup/v1/replication
POST /backup/v1/replication

GET  /backup/v1/restore-jobs
POST /backup/v1/restore-jobs
POST /backup/v1/restore-jobs/:id/approve
POST /backup/v1/restore-jobs/:id/execute

GET  /backup/v1/recovery-plans
POST /backup/v1/recovery-plans
POST /backup/v1/recovery-plans/:id/test

GET  /backup/v1/continuity-plans
POST /backup/v1/continuity-plans

GET  /backup/v1/integrity-checks
POST /backup/v1/integrity-checks

GET  /backup/v1/preservation
GET  /backup/v1/audit
```

Versioned endpoints may be introduced additively. Existing `/backup/*`
endpoints must remain compatible until a formal API migration is approved.

## API Rules

- APIs must not trust client-provided identity, roles, organization IDs, or
  permissions.
- Restore execution requires explicit authorized human approval.
- Backup records and restore records must be tenant-scoped.
- Detailed backup metadata must not reveal secrets.
- Audit APIs must not allow mutation or deletion.
- AI may suggest plans but must not execute backup deletion, restore, failover,
  retention changes, or publication actions.

## Current Contract Gaps

- Dedicated backup repository APIs are not implemented.
- Dedicated replication APIs are not implemented.
- Dedicated continuity plan APIs are not implemented.
- PITR APIs are not implemented.
- Restore execution APIs are intentionally not implemented in runtime.
- Current endpoints are not yet exposed under explicit `/v1` paths.
