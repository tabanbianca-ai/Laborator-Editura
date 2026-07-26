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

## Gap Summary

Strengths:

- Governance profiles exist.
- Principal agents and subagents are explicitly modeled.
- Human final authority is represented.
- Marketplace can store agent metadata.

Gaps:

- No canonical AI Orchestration Agent Registry API exists yet.
- No runtime registry-to-execution binding exists yet.
- No chain execution runtime exists yet.
- No prompt or model routing policy is linked directly to each agent runtime.

