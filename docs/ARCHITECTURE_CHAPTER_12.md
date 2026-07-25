# Laborator Editura Official Platform Architecture

Chapter 12 - Backend and Application Services Architecture.

Official architecture document.

Version: 1.0.

## 1. Purpose

This document defines the official backend architecture for the Laborator
Editura platform.

Its purpose is to establish a coherent technical structure for:

- Application services.
- Domain logic.
- APIs.
- Persistence.
- Validation.
- Events.
- Background jobs.
- Cache.
- Security.
- Observability.
- Integration between modules.

The backend must keep business logic, infrastructure, and delivery mechanisms
separated. This document is an architecture standard and baseline audit
instruction. It does not authorize immediate runtime refactoring, database
schema changes, API breaking changes, Docker changes, frontend changes, or
removal of validated Phase 7 Step 16 behavior.

## 2. Fundamental Principles

Backend architecture must respect:

- Domain-Driven Design.
- Clean Architecture.
- Modular Monolith.
- Separation of Concerns.
- Dependency Inversion.
- Explicit Contracts.
- Transactional Consistency.
- Security by Default.
- Observability by Default.
- Testability.
- Idempotency.
- Incremental Evolution.

Business logic must not depend directly on the web framework, database
technology, filesystem, provider SDKs, or external services.

## 3. Architectural Style

The platform initially uses a Modular Monolith.

Each module must maintain:

- Clear functional boundaries.
- Its own domain model.
- Its own application services.
- Explicit public contracts.
- Encapsulated infrastructure.
- Independent tests.

The architecture must allow future extraction of modules into separate services
without redesigning the whole domain.

## 4. General Architecture

Mandatory dependency direction:

```text
API / Delivery Layer
  -> Application Layer
  -> Domain Layer
  -> Ports
  -> Infrastructure Adapters
  -> Database / External Services
```

Dependencies must point toward the domain. Outer layers may depend on inner
contracts. Inner layers must not depend on outer implementations.

## 5. Official Layers

### 5.1 Delivery Layer

Responsible for:

- HTTP controllers.
- Endpoints.
- Request authentication.
- Serialization.
- Deserialization.
- Structural input validation.
- Response codes.
- API documentation.

Controllers must not contain business logic.

### 5.2 Application Layer

Responsible for:

- Use cases.
- Commands.
- Queries.
- Transaction coordination.
- Contextual authorization.
- Calling domain services.
- Publishing events.
- Calling external ports.

Examples:

- `CreateProject`.
- `StartTranslation`.
- `ApprovePublication`.
- `GenerateAudio`.
- `AssignWorkflowTask`.

Application services orchestrate one business operation at a time and return a
defined result.

### 5.3 Domain Layer

Contains:

- Entities.
- Aggregates.
- Value objects.
- Business rules.
- Domain services.
- Domain events.
- Invariants.
- Domain policies.

The domain layer must not import:

- Web framework types.
- ORM implementations.
- HTTP clients.
- AI provider SDKs.
- Filesystem implementations.
- External service clients.

### 5.4 Infrastructure Layer

Implements:

- Repositories.
- Persistence.
- External clients.
- Messaging.
- Cache.
- Storage.
- Email.
- Scheduled jobs.
- Observability adapters.

Infrastructure implements interfaces defined by the inner layers.

## 6. Module Organization

The target structure for each backend module is:

```text
modules/
  translation/
    domain/
    application/
    infrastructure/
    api/
    contracts/
    tests/
```

Existing modules may retain their current file layout until a safe migration
phase is approved. New structural work must move toward the target shape.

No module may access another module's private folders, persistence tables, or
implementation details except through an approved and documented contract.

## 7. Public Module Contracts

Each module exposes only:

- Public commands.
- Public queries.
- Public events.
- Integration interfaces.
- Strictly required public DTOs.

Example:

```text
TranslationModule
  StartTranslationCommand
  GetTranslationStatusQuery
  TranslationCompletedEvent
```

Internal domain entities must not be used as external contracts.

## 8. Use Cases

Every business operation must be represented by an explicit use case.

A use case must:

- Have one concrete responsibility.
- Validate permissions.
- Load the required aggregates.
- Execute business rules.
- Save changes.
- Emit events when applicable.
- Return a defined result.

Generic services with ambiguous responsibilities are not allowed.

## 9. Commands and Queries

The architecture conceptually separates commands from queries.

Commands modify state. Examples:

- `CreateManuscript`.
- `UpdateTranslationSegment`.
- `ApproveReview`.
- `PublishEdition`.

Queries read data without modifying the domain. Examples:

- `GetProjectDetails`.
- `ListLibraryItems`.
- `GetWorkflowTasks`.
- `SearchPublications`.

Distributed CQRS infrastructure is not required in v1.0. The separation must
exist first at application service and contract level.

## 10. Validation

Validation has three official levels.

Input validation checks:

- Types.
- Formats.
- Required fields.
- Limits.
- Structure.

Application validation checks:

- Permissions.
- Resource existence.
- Availability.
- Use case preconditions.

Domain validation checks:

- Invariants.
- Valid transitions.
- Editorial rules.
- Business restrictions.

Domain rules must not be duplicated in controllers.

## 11. Transaction Management

Each state-changing use case must define its transactional boundary.

Rules:

- A transaction protects one coherent business operation.
- Long external calls must not run inside open transactions.
- Aggregates must be modified inside defined boundaries.
- External events must be published safely after transaction commit.

When external event publication must be reliable, an Outbox pattern should be
used.

## 12. Repositories

Repositories represent collections of aggregates.

Examples:

- `ProjectRepository`.
- `PublicationRepository`.
- `TranslationRepository`.
- `WorkflowRepository`.

Repositories:

- Are defined through internal interfaces.
- Are implemented in infrastructure.
- Do not expose ORM or database details.
- Must not become generic unbounded query services.

## 13. Persistence

Persistence must respect the approved logical and physical data models.

Rules:

- The ORM or runtime persistence mechanism does not define the domain.
- Persistence entities may differ from domain entities.
- Migrations are mandatory for persistent schema changes.
- Cross-module relationships must respect data ownership.
- A module may not directly access another module's tables except through an
  approved and documented contract.

## 14. API

APIs must use versioned contracts.

Target format:

```text
/api/v1/projects
/api/v1/translations
/api/v1/publications
```

Each endpoint must define:

- Method.
- Route.
- Authentication.
- Required permission.
- Input.
- Response.
- Errors.
- Idempotency.
- Side effects.

## 15. DTOs

DTOs must be specific to each operation.

Domain entities must not be used as API responses.

DTO categories:

- Request DTO.
- Response DTO.
- Command DTO.
- Query Result DTO.
- Event DTO.

DTOs must avoid exposing internal or sensitive data.

## 16. Error Management

The backend must use a uniform error taxonomy.

Initial categories:

- `ValidationError`.
- `AuthenticationError`.
- `AuthorizationError`.
- `NotFoundError`.
- `ConflictError`.
- `BusinessRuleError`.
- `RateLimitError`.
- `IntegrationError`.
- `InfrastructureError`.

Responses must not reveal:

- Internal stack traces.
- Secrets.
- SQL queries.
- Sensitive data.
- Provider internals.

## 17. Idempotency

Repeatable operations must be idempotent.

This applies especially to:

- Publication.
- Future payments.
- Webhooks.
- Imports.
- AI tasks.
- File generation.
- Background jobs.

Idempotency keys must have defined scope, expiration, and audit.

## 18. Domain Events

Domain events represent facts that happened inside an aggregate.

Examples:

- `ManuscriptCreated`.
- `TranslationApproved`.
- `PublicationReleased`.
- `RightsExpired`.

Events must:

- Use past tense.
- Be immutable.
- Contain sufficient identifiers.
- Avoid unnecessary sensitive data.

## 19. Integration Events

Integration events communicate module or external system changes.

Examples:

- `publication.released.v1`.
- `translation.completed.v1`.
- `workflow.task.assigned.v1`.

Integration events must be:

- Versioned.
- Documented.
- Serializable.
- Backward compatible when practical.

## 20. Messaging

The architecture must support:

- Synchronous execution.
- Asynchronous processing.
- Queues.
- Events.
- Retries.
- Dead Letter Queue.

Messaging must not hide poorly defined dependencies.

## 21. Background Jobs

Background jobs are used for:

- PDF and EPUB generation.
- Audio processing.
- Video processing.
- Imports.
- Exports.
- Notifications.
- Backups.
- Long AI tasks.
- Indexing.
- Maintenance.

Each job must record:

- Type.
- Status.
- Progress.
- Attempts.
- Error.
- Initiating user or process.
- Creation time.
- Completion time.

## 22. Job States

Minimum states:

- `Pending`.
- `Queued`.
- `Running`.
- `Completed`.
- `Failed`.
- `Cancelled`.
- `RetryScheduled`.

Jobs must be recoverable after system restart.

## 23. Scheduled Tasks

Scheduled tasks must be managed through centralized infrastructure.

Scattered timers inside modules are not allowed.

Examples:

- Deadline checks.
- Reminders.
- Controlled cleanup.
- Backups.
- Synchronization.
- Periodic reports.

## 24. Cache

Cache may be used for:

- Reference data.
- Configuration.
- Calculated permissions.
- Frequent read results.
- Public content.
- Metadata.

Cache must never become the official source of data.

Each cache usage must define:

- Key.
- Scope.
- Time to live.
- Invalidation strategy.
- Failure behavior.

## 25. Files and Storage

Modules must not store files directly in database fields unless explicitly
approved.

Files are managed through the common Asset system.

Target flow:

```text
Module
  -> Asset Service
  -> Storage Port
  -> Storage Adapter
```

The domain stores stable Asset references.

## 26. External Integrations

External integrations must use the adapters defined by Chapter 10.

The backend must not contain scattered direct calls to:

- OpenAI.
- ElevenLabs.
- Google.
- Dropbox.
- SMTP.
- External storage.
- Other providers.

## 27. AI Integration

All AI operations must pass through AI Orchestration.

Mandatory flow:

```text
Application Service
  -> AI Orchestration Port
  -> AI Orchestration Module
  -> Provider Adapter
```

Business modules must not know provider models, keys, endpoints, or
provider-specific error payloads.

## 28. Authentication and Authorization

The backend uses only central IAM.

Each use case must verify:

- Identity.
- Workspace.
- Permission.
- Resource access.
- Resource state.
- Applicable policy.

Authorization is not limited to controllers.

## 29. Multi-Tenancy and Workspace Isolation

Every operation must preserve Workspace context.

Rules:

- Queries must filter by Workspace or organization boundary as applicable.
- Writes must validate membership.
- Background jobs must preserve context.
- Events must include the Workspace identifier when needed.
- Cache keys must avoid collisions between Workspaces.

## 30. Audit

Critical use cases must generate audit records.

Audit especially covers:

- Creation.
- Modification.
- Deletion.
- Restoration.
- Approval.
- Rejection.
- Publication.
- Permission changes.
- AI execution.
- Restricted data access.

Audit does not replace technical logging.

## 31. Logging

Logs must be structured.

Minimum recommended fields:

- `timestamp`.
- `level`.
- `service`.
- `module`.
- `operation`.
- `requestId`.
- `correlationId`.
- `userId`.
- `workspaceId`.
- `result`.
- `duration`.

Logs must not contain:

- Passwords.
- Tokens.
- Secrets.
- Complete confidential content.
- Unnecessary personal data.

## 32. Correlation ID

Every request must receive a correlation ID.

The correlation ID must be propagated to:

- Logs.
- Events.
- Jobs.
- External calls.
- Errors.
- Future distributed traces.

## 33. Metrics

The backend must expose metrics for:

- Latency.
- Traffic.
- Errors.
- Database.
- Cache.
- Queues.
- Jobs.
- Integrations.
- AI consumption.
- Module usage.

## 34. Health Checks

The backend must support separate:

- Liveness.
- Readiness.
- Dependency health.

A degraded external dependency must not automatically mark the entire
application as inactive.

## 35. Configuration

Configuration must be:

- Typed.
- Validated at startup.
- Environment separated.
- External to code.
- Secure.

Sensitive configuration is governed by Secret Management.

## 36. Environments

The backend must support at least:

- Local.
- Development.
- Test.
- Staging.
- Production.

Environment differences must come from configuration, not separate code
branches.

## 37. Feature Flags

Incomplete or progressive capabilities must use feature flags.

Each flag must define:

- Name.
- Purpose.
- Owner.
- Scope.
- Status.
- Review date.
- Removal plan.

Feature flags must not become uncontrolled permanent configuration.

## 38. Limits and Protection

The backend must define:

- Size limits.
- Timeouts.
- Rate limits.
- Concurrency limits.
- File limits.
- AI limits.
- Workspace quotas.

Limits must be configurable and auditable.

## 39. Testing

Each module must include:

- Unit tests.
- Application tests.
- Integration tests.
- Contract tests.
- API tests.
- Authorization tests.
- Migration tests.

Domain rules must be testable without launching the full infrastructure.

## 40. Backward Compatibility

Changes must preserve compatibility whenever possible.

Breaking changes require:

- A new contract version.
- Transition period.
- Migration strategy.
- Documentation.
- Controlled deprecation.

## 41. Performance

Optimization must be measurement based.

Avoid:

- N+1 queries.
- Excessive aggregate loading.
- Oversized responses.
- Long transactions.
- Heavy processing inside synchronous requests.
- Unnecessary external calls.

## 42. Security

The backend must apply:

- Strict validation.
- Parameterized queries.
- Injection protection.
- Central access control.
- Secure file handling.
- Rate limiting.
- Secret protection.
- Data minimization.
- Audit.

## 43. Code Conventions

All technical implementation uses English.

Conventions:

- PascalCase for classes and types.
- camelCase for variables and functions.
- Explicit names.
- One primary responsibility per class.
- Dependencies through interfaces for target architecture.
- No business logic in controllers.

## 44. Prohibited Anti-Patterns

The following are not allowed:

- Fat Controllers.
- God Services.
- Direct data access between module databases or tables.
- Domain logic in repositories.
- Direct provider calls from business modules.
- Scattered status strings.
- Frontend-only authorization.
- Transactions around long external calls.
- Silent error suppression.
- Generic unclassified exceptions.
- Duplicated business rules.

## 45. Acceptance Criteria

The backend architecture is compliant when:

- Modules maintain clear boundaries.
- Business logic resides in the domain or application use cases, not
  controllers.
- Use cases coordinate operations explicitly.
- Infrastructure depends on internal contracts.
- APIs use versioned DTOs.
- Security is applied at every layer.
- Long-running processes use recoverable background jobs.
- Events and external operations are reliable and idempotent.
- Critical actions are audited.
- Logs, metrics, traces, and health checks are available.
- Implementation is observable and testable.

## Backend Architecture Baseline Audit

Codex must perform a Backend Architecture Baseline Audit before applying
structural backend changes.

Audit objectives:

1. Inventory the current backend structure.
2. Identify controllers, services, repositories, and models.
3. Detect domain logic located in incorrect layers.
4. Identify dependencies between modules.
5. Locate direct data access to other modules.
6. Inventory endpoints and contracts.
7. Review validation and authorization.
8. Analyze transactions.
9. Inventory events, queues, and jobs.
10. Review cache, configuration, and feature flags.
11. Evaluate logging, metrics, and health checks.
12. Detect direct external provider dependencies.
13. Compare implementation with Chapters 3, 6, 7, 8, 9, and 10.
14. Prepare an incremental plan without breaking validated functionality.

Required deliverables:

- `docs/backend/backend-architecture.md`.
- `docs/backend/application-services.md`.
- `docs/backend/domain-layer.md`.
- `docs/backend/module-contracts.md`.
- `docs/backend/api-standards.md`.
- `docs/backend/error-model.md`.
- `docs/backend/eventing-and-messaging.md`.
- `docs/backend/background-jobs.md`.
- `docs/backend/cache-strategy.md`.
- `docs/backend/transaction-strategy.md`.
- `docs/backend/backend-security.md`.
- `docs/backend/backend-observability.md`.
- `docs/backend/backend-gap-analysis.md`.
- `docs/backend/backend-dependency-map.md`.
- `docs/backend/backend-migration-plan.md`.

## Mandatory Execution Order

Codex must work in this order:

1. Repository inspection.
2. Backend inventory.
3. Dependency mapping.
4. Gap analysis.
5. Risk classification.
6. Migration planning.
7. Approval checkpoint.
8. Incremental implementation.
9. Automated validation.
10. Documentation update.

Codex must not start general backend refactoring before steps 1 through 6 are
complete and approved.

## Implementation Restrictions

Codex must:

- Preserve validated Phase 7 Step 16 functionality.
- Avoid destructive changes.
- Avoid rewriting complete modules without justification.
- Avoid premature microservices.
- Avoid replacing stable technologies without analysis.
- Maintain compatibility with the existing frontend.
- Use migrations for data changes.
- Add tests before modifying critical areas.
- Document any deviation from this chapter.

## Implementation Instruction for Codex

Treat this document as the official Backend and Application Services
architecture standard for Laborator Editura.

Codex must inspect the repository before modifying backend code and identify
the current backend structure, module boundaries, controllers, application
services, domain logic, repositories, persistence models, APIs, validation
rules, authorization controls, transactions, events, background jobs, caches,
configuration mechanisms, observability components, and external provider
dependencies.

Compare the current implementation with this architecture and with previously
approved architecture chapters. Produce the required inventory, dependency
map, gap analysis, risk classification, and incremental migration plan before
implementing structural changes.

Preserve all validated functionality from Phase 7 Step 16. Do not introduce
premature microservices, destructive schema changes, provider-specific
coupling, duplicated business rules, or module-specific security mechanisms.

## Recommended Next Architecture Document

Chapter 13 status:

- Chapter 13 - DevOps, Infrastructure, Deployment, and Recovery Architecture
  has been documented.

Chapter 14 status:

- Chapter 14 - Quality Architecture and Testing Strategy has been documented in
  `docs/ARCHITECTURE_CHAPTER_14.md`.

Chapter 15 status:

- Chapter 15 - Operations, Maintenance, and Platform Evolution Architecture
  has been documented in `docs/ARCHITECTURE_CHAPTER_15.md`.

The high-level architecture series is complete with Chapters 0-15. The next
recommended stage is Phase 2 - Detailed Module Specifications.
