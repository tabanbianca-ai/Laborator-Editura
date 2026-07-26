# Workflow Engine API Contracts

## Purpose

This document defines current and target API contracts for the Workflow Engine
and Business Process Automation Module.

All endpoints require authenticated server-derived request context. Endpoints
must not trust client-provided user, role, permission, or tenant identifiers.

## Current API Baseline

Existing Workflow v1 endpoints:

- `POST /workflow/start`.
- `GET /workflow/status`.
- `POST /workflow/advance`.
- `POST /workflow/block`.
- `POST /workflow/unblock`.
- `POST /workflow/approve`.
- `POST /workflow/ready-for-export`.
- `POST /workflow/exported`.

Existing target examples from the specification:

- `POST /workflows`.
- `GET /workflows`.
- `POST /workflow-instances`.
- `GET /workflow-instances/{id}`.
- `POST /workflow-instances/{id}/transition`.
- `POST /workflow-rules`.
- `GET /tasks`.

## Target Definition APIs

### Create Workflow Definition

```text
POST /workflows
```

Creates a draft workflow definition.

### List Workflow Definitions

```text
GET /workflows
```

Lists workflow definitions visible to the authenticated user.

### Create Workflow Rule

```text
POST /workflow-rules
```

Creates or versions a configurable workflow rule.

## Target Instance APIs

### Start Workflow Instance

```text
POST /workflow-instances
```

Starts a workflow instance from an active workflow version.

### Get Workflow Instance

```text
GET /workflow-instances/{id}
```

Returns instance state, tasks, approvals, deadlines, blockers, and audit
references.

### Transition Workflow Instance

```text
POST /workflow-instances/{id}/transition
```

Executes a validated transition.

## Target Task APIs

### List Tasks

```text
GET /tasks
```

Returns tasks visible to the authenticated user according to role,
assignment, project scope, document scope, Need-to-Know access, and workflow
state.

Recommended future endpoints:

- `POST /tasks/{id}/start`.
- `POST /tasks/{id}/complete`.
- `POST /tasks/{id}/block`.
- `POST /tasks/{id}/reassign`.

## API Rules

- All APIs are versioned.
- All APIs are tenant-scoped.
- All transitions are validated by the state machine.
- Rules must be configurable without code.
- Workflow definitions and versions must be immutable after activation.
- Approval actions require authorized humans.
- AI-triggered actions must route through AI Orchestration.
- Every state-changing API must create audit evidence.

## Compatibility Rule

Existing Workflow v1 APIs must remain stable until additive replacement APIs
are proven and migration adapters are validated.

