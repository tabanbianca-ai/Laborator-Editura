# Application Services

## Purpose

Application services coordinate backend use cases. They execute one business
operation, enforce contextual authorization, call domain rules, persist state,
emit events, and return typed results.

## Target Standard

Each application service operation must define:

- Use case name.
- Command or query input.
- Actor and workspace context.
- Required permissions.
- Loaded aggregates.
- Domain rules invoked.
- Transaction boundary.
- Audit events.
- Domain or integration events.
- Idempotency behavior when applicable.
- Typed result.

## Commands

Commands modify state.

Examples:

- `CreateProject`.
- `CreateManuscript`.
- `SubmitTranslation`.
- `ApprovePublication`.
- `CreateBackupJob`.
- `EnableIntegrationProvider`.

Commands must validate identity, permissions, resource access, preconditions,
and domain invariants before writing.

## Queries

Queries read state.

Examples:

- `GetProject`.
- `ListDocuments`.
- `SearchResearchSources`.
- `GetWorkflowStatus`.
- `ListAuditEvents`.

Queries must preserve tenant and Need-to-Know isolation and must not mutate
state.

## Current Baseline

Current backend services are named `<Module>Service` and usually combine
application orchestration with domain decision logic.

Examples:

- `ProjectsService` creates projects, dossiers, and audit events.
- `TranslationsService` submits translations and coordinates Segment,
  Lexicographic, Translation Memory, Terminology, QA, and Semantic Fidelity.
- `WorkflowService` evaluates transition gates using QA and Semantic Fidelity.
- `LayoutPublishingService` coordinates Library, Rights, Workflow, Export, and
  publication records.
- `AuthService` manages authentication, sessions, account lockout, founder
  protection, profile updates, and auth audit events.

This is functional but should migrate incrementally toward explicit command
and query handlers or clearly separated use-case methods.

## Required Pattern

For new backend operations:

```text
Controller
  -> Application use case method
  -> Domain policy or aggregate method
  -> Repository port
  -> Infrastructure implementation
  -> Audit and events
```

## Acceptance Criteria

- Controllers do not contain business logic.
- A state-changing action maps to an explicit command use case.
- A read action maps to an explicit query use case.
- Authorization is checked inside the use case, not only in middleware.
- Audit and events are emitted from the application layer after state changes.
- Results are typed and do not expose internal domain objects directly.
