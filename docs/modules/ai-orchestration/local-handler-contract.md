# GAP-02.4.2 Local Handler Contract

## Server-Owned Descriptors

`AiHandlerRegistry` combines the existing Quality descriptor with adapters exported
by Projects, Author Studio, Research, and Scheduling. These modules never import
AiGovernanceModule; their shared contract imports only types and Zod schemas.
The registry validates descriptors at Nest module initialization and lookup.
No API can register an adapter, load a module, evaluate code, or mark a binding valid.

Every descriptor declares canonical `agentId`, handler `id`, handler `version`,
`capabilityId`, `operationId`, schema references and actual Zod input/output schemas,
required canonical permissions, resource scope, classification, workflow requirements,
allowed workflow states, timeout, cost estimate/currency, and advisory capability flags.
Handler IDs end in `.v1`; the handler version is separate from configuration and
governance versions. Duplicate IDs or agent/operation pairs, noncanonical identities,
unrecognized permissions, invalid schemas, nonzero costs, or external-processing
flags fail closed. All current descriptors use RESTRICTED classification and a
cooperative timeout of 5000 ms. They consume zero provider tokens and cost EUR 0.

## Request and Result

```json
{
  "agentId": "projects-agent",
  "operationId": "projects.readiness",
  "projectId": "project-id",
  "resource": { "type": "PROJECT", "id": "project-id" },
  "idempotencyKey": "user-request-key"
}
```

Supported resource types are PROJECT, DOCUMENT, MANUSCRIPT, and LINGUISTIC_SOURCE.
Documentation uses LINGUISTIC_SOURCE for the authorized Research source; the adapter
resolves this through ResearchService, not a client-selected repository.
The descriptor must accept the exact scope. PROJECT IDs must match projectId.
Manuscripts must belong to that project. Research sources must contain an existing
TRANSLATION ecosystem reference whose entityId is the project ID; sources without
this explicit association are denied. This increment does not infer or repair links.

Legacy Quality requests with documentId remain valid. Explicit DOCUMENT resource
requests normalize to the same legacy idempotency payload. Conflicting resource
and documentId values, content text, actor fields, handler code, or arbitrary input
are rejected. No endpoint or lifecycle state is replaced.

Reports contain `readiness`, safe issue codes, `humanApprovalRequired: true`, bounded
integer metrics, optional stage/dependency plans, and resource/version provenance.
Each new handler requires its own metrics and nonempty provenance; planning also
requires a plan. Outputs are schema-validated before persistence. Manuscript text,
private notes, raw source content, and calendar titles are not included.
READY means only that the implemented checks found no issues. It is never an
editorial approval, legal authorization, quality certification, or permission grant.

## Authorization and Immutability

Existing human approval and active configuration rules remain mandatory.
Adding code does not activate an agent or rewrite any tenant's configuration.
The binding must match a descriptor and have a server validation receipt recorded
during explicit human configuration approval. Required descriptor permissions are
checked independently of the permissions named in the binding.

Runtime execution and report retrieval enforce tenant, canonical RBAC, RESTRICTED
Need-to-Know access, and module-owned resource authorization. Documentation checks
each dictionary reference separately and rechecks secondary-source grants on report
retrieval. Scheduling limits non-administrators to their own project tasks/events.
Author Studio retains its author/reviewer access rules. Fresh authorization runs
before saving results; revoked access withholds them. Repeated task creation never
returns a prior result without a separate authorized GET.

The existing Quality handler still requires a nonblocked document workflow state.
The five advisory handlers do not advance workflow and may analyze resources before
a document workflow exists. Coordinator reads active definition availability and
the project's editorial stage order. It reports blockers, never clears them.
Budget, quota, kill-switch, immutable configuration, task state, cancellation,
correlation, and audit mechanisms remain in the existing runtime.

## Read-Only Domain Adapters

- Projects: existing readiness validator plus required identity/language checks.
- Manuscripts: sections, parent cycles, missing parents/drafts, complete version
  sequences, duplicate versions, ownership references, and text-count integrity.
- Documentation: citation/author/language completeness and authorized enabled
  linguistic reference metadata; no dictionary content ingestion or web crawling.
- Coordinator: stage dependency plan with scheduling and workflow definition blockers.
- Planning: visible tasks/dependencies, cycles, pending overdue tasks, and invalid
  event windows. It creates no child tasks or calendar entries.

Only task records, usage, and audit evidence are written. Projects, manuscripts,
source text, research records, workflow states, calendar entries, and approvals are
unchanged. Manuscript draft-history reads and scoped agenda reads are additive service
methods; existing controller/service behavior remains compatible.

## Storage and Operational Limits

Migration 0012 makes documentId optional and adds an immutable resource reference.
Legacy document tasks remain valid. SQL constraints require complete type/id fields
and matching document references. Existing terminal/audit/RLS guards remain in place.
Both runtime and script backup validators reject missing or cross-tenant resources.

The existing single-execution lock, local event-loop scheduler, cooperative deadlines,
stale-lock recovery limitations, and separate snapshot/audit writes remain unchanged.
There are no external providers, financial reservations, distributed queues, child
task execution, automatic activation, automatic repairs, or editorial decisions.
Analyses are bounded: 200 sections, 200 drafts per section, 1000 provenance entries,
200 agenda tasks/events, and 200 candidate dictionaries; oversized inputs fail.
Source versions and timestamps are recorded as evidence, not a transactionally
consistent snapshot across modules. PostgreSQL migration execution requires a
separate isolated database validation environment.
