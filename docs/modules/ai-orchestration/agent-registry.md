# AI Agent Registry

## Purpose

The Agent Registry defines which editorial AI agents exist, which capabilities
they support, how they collaborate, and which limits apply to each agent.

Agents are reusable platform services. They are not separate enterprise
modules and they do not replace human authority.

## Current Repository Baseline

The current agent baseline is stored in
`apps/api/src/modules/ai-governance/ai-governance.types.ts`.

It defines:

- Principal agent names.
- Specialized subagent names.
- Agent governance profiles.
- Collaboration rules.
- Human final authority restrictions.
- Quality Agent readiness statuses.
- Parallel review interface model.

Marketplace also stores registry-style metadata for agents and extensions in
`apps/api/src/modules/marketplace`.

## Principal Agents

The official principal agents are:

1. Coordinator Agent.
2. Projects Agent.
3. Manuscripts Agent.
4. Documentation Agent.
5. Translation Agent.
6. Review Agent.
7. Layout Agent.
8. Publishing Agent.
9. Distribution Agent.
10. Library Agent.
11. Rights and Provenance Agent.
12. Illustration Agent.
13. Audio Agent.
14. Video Agent.
15. Magazine Agent.
16. Administration Agent.
17. Evolution Agent.
18. Quality Agent.

## Specialized Subagents

Specialized subagents remain scoped under parent agents:

- Terminology and Lexicography Subagent under Translation Agent.
- Semantic Fidelity Subagent under Translation Agent.
- Editorial Decision Subagent under Review Agent.
- Planning and Coordination Subagent under Coordinator Agent.
- Media Localization Subagent under Audio Agent and Video Agent.
- Platform Engineering Subagent under Evolution Agent.

Subagents do not replace parent responsibility. They provide specialized
support inside the parent agent's authority boundary.

## Required Registry Fields

Each future canonical registry record must include:

- `agentId`.
- `name`.
- `kind`.
- `parentAgentIds`.
- `mission`.
- `responsibilities`.
- `collaboration`.
- `limits`.
- `authority`.
- `supportedCapabilities`.
- `supportedModules`.
- `permissionsRequired`.
- `defaultChainIds`.
- `costPolicyId`.
- `policyComplianceId`.
- `enabled`.
- `version`.
- `createdBy`.
- `createdAt`.
- `updatedBy`.
- `updatedAt`.

## Collaboration Rules

Agents may:

- Exchange information.
- Request assistance.
- Reuse results.
- Notify other agents.
- Coordinate through the Coordinator Agent.

There are no communication restrictions between agents, but all access remains
subject to authentication, authorization, Need-to-Know access, tenant
isolation, workflow state, rights restrictions, cost policy, and audit.

## Authority Rules

Every agent has final AI responsibility only within its specialization.

AI agents may not:

- Publish automatically.
- Approve automatically.
- Grant rights.
- Bypass workflow.
- Modify security.
- Change governance.
- Expand their own permissions.
- Access data outside Need-to-Know scope.

Authorized humans always retain final decision authority.

## Canonical Identity Mapping (GAP-02.1)

`ai-agent-identity.ts` projects identities directly from
`AI_AGENT_GOVERNANCE_PROFILES`; it does not maintain another agent registry.
Canonical IDs, names, governance versions, kinds, and parent relationships
remain owned by those profiles. Shared `AiAgentType` values remain compatible
capability classifications, not additional principal identities.

Legacy translation, research, author-studio, scheduling, lexicographic,
semantic, editorial-decision, localization, and platform-engineering names
resolve to their existing specialized identities. `Layout Publishing Agent`
and `Multimedia Creation Agent` resolve to explicit candidate sets because
their historical service boundaries span multiple agents. Callers must choose
the appropriate specialization; the resolver never chooses one silently.

Resolution returns `RESOLVED`, `AMBIGUOUS`, or `UNKNOWN`. No historical usage
records, governance profiles, API responses, or execution behavior are rewritten.
Identity resolution is not authorization or evidence of runtime availability.

## Operational Configuration (GAP-02.2)

GAP-02.3 extends availability for explicitly validated local bindings; see
[Execution Runtime](execution-runtime.md). The GAP-02.2 unavailable baseline
below remains applicable to all configurations without validation receipts.

`AiAgentRegistryService` extends AI Governance using the existing
`ai_agent_registry` tenant table and additive `ai_agent_configuration_versions`.
The catalog is always projected from the 24 governance profiles; GET requests
do not seed or duplicate identities. Legacy aliases use GAP-02.1 resolution.

Human administrators and Platform Creators can create and edit drafts, approve
the exact configuration SHA-256, activate an approved version, and disable an
agent. AI/system/automation roles are denied even when combined with ADMIN.
Approved payloads are frozen. Activated versions are immutable, and a new
version changes only the tenant's active pointer. Disabling preserves history.

Bindings store capability, operation, handler key, input/output schema references,
and required permissions. Configuration accepts no executable code, provider
URLs, authority changes, client identity, or validation flags. Binding keys are
metadata only; they do not grant permissions or enable execution.

All agents currently return `availability.status = UNAVAILABLE`,
`executable = false`, `validatedBindingCount = 0`, and
`reason = EXECUTION_RUNTIME_NOT_IMPLEMENTED`, including activated agents.
A future runtime must validate handlers against a server-owned catalog and
apply IAM, workflow, governance, provider, cost, quota, and consent gates.

Registry changes use existing `ai_cost_audit_events`, accessible through the
unchanged administrative `/ai-governance/audit` endpoint. Runtime backup and
restore include the new version table and tenant reference validation.
Migration `0010_ai_agent_registry_versions_v1.sql` follows 0009 and adds RLS,
tenant-scoped references, version uniqueness, approval checks, and immutability.
It does not modify existing Workflow, Marketplace, or cost-policy APIs.

## Remaining Runtime Gaps

Strengths:

- Governance profiles exist.
- Principal agents and subagents are explicitly modeled.
- Human final authority is represented.
- Marketplace can store agent metadata.

Gaps:

- Operational configuration APIs exist; executable handler validation and
  dispatch remain unavailable.
- No chain execution runtime exists yet.
- No prompt or model routing policy is linked directly to each agent runtime.

