# Workflow Approval Engine

## Purpose

The Approval Engine coordinates human approval requirements across workflow
instances.

It centralizes approval orchestration while preserving module-owned domain
validation and Human Final Authority.

## Supported Approval Types

The engine must support:

- Individual approval.
- Multiple approval.
- Sequential approval.
- Parallel approval.
- Conditional approval.
- Veto approval.
- Override request.

## Current Repository Baseline

Current approvals are distributed:

- Workflow approves documents and export gates.
- Editorial Decisions require human approval.
- Publishing release approval exists in publication-related modules.
- Rights and Provenance records translation and publishing authorization.
- Multimedia and Media Localization require authorized human approval.
- Marketplace enable/disable requires admin approval.
- Policy exceptions require human approval.
- Scheduling tasks/events require human confirmation.

Human Final Authority is consistently represented, but approval orchestration
is not yet centralized.

## Approval Record

Each approval should include:

- `approvalId`.
- `workflowInstanceId`.
- `stateId`.
- `approvalType`.
- `requiredApprovers`.
- `requiredRoles`.
- `minimumApprovals`.
- `vetoRoles`.
- `status`.
- `grantedApprovals`.
- `rejections`.
- `createdAt`.
- `completedAt`.

Statuses:

- `PENDING`.
- `APPROVED`.
- `REJECTED`.
- `VETOED`.
- `EXPIRED`.
- `CANCELLED`.

## Human Final Authority

AI may:

- Summarize approval context.
- Explain blockers.
- Suggest next action.
- Prepare decision evidence.

AI may not:

- Grant approval.
- Reject approval.
- Veto approval.
- Override approval.
- Publish.
- Grant rights.
- Modify permissions.
- Bypass workflow.

## Approval Gates

Approval gates may include:

- Editorial approval.
- Rights approval.
- Publication approval.
- Audio approval.
- Video approval.
- Magazine issue approval.
- Quality preflight approval.
- Distribution approval.

## Audit Requirements

Audit must record:

- Approval requested.
- Approval granted.
- Approval rejected.
- Approval vetoed.
- Approval expired.
- Override requested.
- Override accepted.
- Override rejected.

