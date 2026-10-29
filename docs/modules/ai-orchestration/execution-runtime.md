# Controlled Execution Runtime (GAP-02.3 / GAP-02.4.2 / GAP-02.4.3)

## Scope and Availability

The runtime reuses GAP-02.1 identities and GAP-02.2 configuration versions.
It supports the existing 18 principals and six subagents without adding agents.
Eight deterministic local handlers are implemented: Quality plus Coordinator,
Projects, Manuscripts, Documentation, Planning & Coordination, Terminology &
Lexicography, and Semantic Fidelity. Their exact
capabilities and limitations are listed in the [capability matrix](agent-capability-matrix.md).
The other 16 identities remain unavailable, including paid Translation. Every tenant activation requires
explicit human configuration approval; no agent is enabled by installing this code.
These handlers produce advisory reports and never editorial approval or model output.
Segment-specific requests, evidence revocation, the composite recovery constraint,
and the mandatory paid-translation block are defined in the
[linguistic contract](linguistic-handler-contract.md).

The existing Quality allowlist entry remains compatible:

```json
{
  "capabilityId": "quality.metadata",
  "operationId": "quality.validate-metadata",
  "handlerKey": "quality.metadata.v1",
  "inputSchemaRef": "quality.metadata.input.v1",
  "outputSchemaRef": "quality.metadata.output.v1",
  "requiredPermissions": ["document.read"]
}
```

Handler validation is captured by the server during human approval of a draft.
Previously active configurations have no validation receipt and do not become
executable when new code is installed. Create, approve, and activate a new version.
API data cannot register handlers, upload code, provide execution URLs, change
identity, grant permissions, or declare a binding validated.

## API and Lifecycle

- `POST /ai/tasks`: create a task with `agentId`, `operationId`, `projectId`,
  a descriptor-specific `resource` (or legacy Quality `documentId`), and
  `idempotencyKey`. Unknown fields are rejected. See [handler contract](local-handler-contract.md).
- `GET /ai/tasks/:id`: owner or same-tenant administrator reads task status after
  fresh resource and secondary-source authorization.
- `POST /ai/tasks/:id/run`: owner schedules a CREATED task; returns HTTP 202.
- `POST /ai/tasks/:id/cancel`: owner or same-tenant administrator cancels a
  nonterminal task. Running handlers receive an abort signal; cancelled results
  are not returned or persisted.

Transitions are CREATED -> AUTHORIZED -> RUNNING -> COMPLETED or FAILED.
Authorization denial produces BLOCKED; cancellation produces CANCELLED.
Terminal tasks cannot run again. Reuse of an idempotency key returns the same
task for the same request/version, or 409 if the request differs.
Tasks pin registry ID, canonical identity, active version, configuration digest,
binding, initiating user, tenant, and an independently generated correlation ID.
Original content is never supplied in task request bodies.

Before invocation the runtime checks human activation, server validation receipt,
current configuration digest, exact binding, RBAC permissions, document/project
ownership, Workspace Need-to-Know access, Workflow status, AI Governance cost
authorization, applicable budgets, quotas, and agent/operation kill switches.
Configuration and kill switches are rechecked after asynchronous authorization.
Module-owned adapters load authorized resources through their existing services.
Restricted classification is used conservatively. Quality requires a nonblocked
document workflow; the new read-only reports may analyze resources before workflow
creation. Missing resource access always fails closed.

## Persistence and Audit

Existing `ai_execution_records` and `ai_operational_audit_events` are reused.
Every persisted lifecycle change appends an event. Existing usage accounting
stores execution/correlation references, outcome, cost, and tokens. The current
local handlers consume zero provider tokens and cost EUR 0; no estimated
external-provider billing is represented as actual usage.
Audit contains IDs and safe failure codes, not manuscript content or raw errors.
Cancellation records the requesting actor, including administrative cancellation.
Backup/restore retains execution records and validates their configuration references.

Migration `0011_ai_execution_runtime_v1.sql` adds validation receipts and SQL
execution/audit foundations with tenant RLS, version linkage, idempotency uniqueness,
immutable request identity, legal transitions, terminal protection, and append-only
audit. Deployment and migration application are outside this task.

## Concurrency and Recovery Limits

The existing file-backed database is retained. Exclusive filesystem locks serialize
runtime execution against the same database path across local processes and guard
runtime task writes. Locks use exclusive creation with mode 0600. No user input is
used as a filesystem path. The execution lock covers authorization, invocation,
and accounting; a busy runtime refuses another execution rather than spending twice.
This intentionally limits throughput to one runtime task at a time.

The background scheduler uses the application event loop, not a durable distributed
queue. Crashes leave task evidence and possibly a stale lock; neither is silently
replayed. Recovery requires operator verification and separate authorization.
CREATED tasks can be requested again; RUNNING/AUTHORIZED tasks cannot be restarted.
The abort deadline is five seconds and is cooperative for trusted local handlers.
No arbitrary/untrusted code is eligible for this execution model.

Filesystem snapshot mutation and audit append are separate existing storage writes,
not a database transaction. A storage failure can leave incomplete evidence and
requires reconciliation; the runtime must not retry or report success in that case.
Runtime locks do not turn unrelated legacy API writes into transactional operations.
Paid/provider-backed handlers require validated estimates, reservations, provider
authorization, and reconciliation before they can be allowlisted. They are unavailable
in this increment. Existing legacy translation provider APIs remain unchanged.

## Validation

Behavioral tests use temporary file-backed databases and exercise lifecycle,
tenant/RBAC/Need-to-Know/workflow denial, human activation, invalid bindings,
quotas/budgets, cancellation, idempotency, failures, kill switches, stale versions,
lock exclusion, sanitized evidence, and backup/restore. SQL checks are static;
PostgreSQL application requires an isolated database in a later validation environment.
