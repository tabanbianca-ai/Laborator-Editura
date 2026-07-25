# Background Jobs

## Purpose

Background jobs handle long-running or retryable backend operations outside
the synchronous HTTP request path.

## Target Job Types

Background jobs are required for:

- PDF generation.
- EPUB generation.
- Audio processing.
- Video processing.
- Imports.
- Exports.
- Notifications.
- Backups.
- Long AI tasks.
- Indexing.
- Maintenance.

## Required Job Metadata

Every job must record:

- `id`.
- `organizationId` or workspace scope.
- `type`.
- `status`.
- `progress`.
- `attempts`.
- `lastError`.
- `initiatedBy`.
- `createdAt`.
- `startedAt`.
- `completedAt`.
- `correlationId`.

## Required Job States

- `Pending`.
- `Queued`.
- `Running`.
- `Completed`.
- `Failed`.
- `Cancelled`.
- `RetryScheduled`.

## Current Baseline

The repository includes planning and metadata foundations for long operations:

- `backup-governance` records backup jobs and restore events.
- `platform-engineering` records optimization, upgrade, backup, restore, and
  healing plans.
- `scheduling` records tasks, events, reminders, and agent run schedules.
- `observability` records agent execution metadata.
- `layout-publishing`, `multimedia-creation`, and `media-localization` record
  export and media project metadata.

There is not yet one central recoverable job runner or queue implementation.

## Scheduling Rules

Scheduled tasks must use centralized infrastructure. Scattered timers inside
module services are not allowed.

## Acceptance Criteria

- Long operations are not performed inside synchronous HTTP handlers once real
  processing is implemented.
- Jobs are recoverable after restart.
- Job status is queryable.
- Failed jobs preserve diagnostics and can be retried safely.
- Background jobs preserve actor and workspace context.
