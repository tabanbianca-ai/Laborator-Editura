# Workflow Scheduler, SLA, and Escalation

## Purpose

The Workflow Scheduler coordinates recurring checks, deadlines, retries,
expirations, escalations, and time-based automation.

It should reuse existing scheduling foundations rather than creating a
parallel calendar system.

## Scheduler Responsibilities

The scheduler supports:

- Recurring processes.
- Periodic checks.
- Expiration handling.
- Retry scheduling.
- Synchronization checks.
- SLA monitoring.
- Escalation triggers.
- Reminder scheduling.

## Current Repository Baseline

Existing scheduling support:

- `apps/api/src/modules/scheduling` stores tasks, events, reminders,
  scheduled agent runs, conflicts metadata, human approval, and audit.
- Scheduling has no external calendar integration configured.
- Workflow does not yet generate scheduler records from workflow definitions.

## SLA Rules

SLA definitions may include:

- Maximum response time.
- Maximum approval time.
- Maximum stage duration.
- Deadline grace period.
- Escalation target.
- Notification schedule.

## Escalation Rules

Escalation may target:

- Responsible user.
- Team lead.
- Editor.
- Publisher.
- Workflow administrator.
- Organization administrator.

Escalation must not grant unauthorized access. Need-to-Know and RBAC remain
mandatory.

## Retry Rules

Retry policy should define:

- Maximum attempts.
- Backoff strategy.
- Idempotency key.
- Error categories.
- Manual intervention threshold.

Automated retries must not duplicate side effects.

## Automation Boundaries

Automation may:

- Create tasks.
- Assign responsible users.
- Send notification requests.
- Request AI execution through AI Orchestration.
- Request artifact generation.
- Archive completed records when policy allows.

Automation may not:

- Approve.
- Publish.
- Grant rights.
- Modify permissions.
- Bypass workflow.
- Delete audit history.

## Audit Requirements

Audit must record:

- Scheduler rule created.
- Scheduler rule executed.
- Retry scheduled.
- Retry completed.
- SLA warning.
- SLA breach.
- Escalation triggered.
- Automation skipped or blocked.

