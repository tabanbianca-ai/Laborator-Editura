# Agent Registry

## Purpose

The Agent Registry is the canonical inventory of AI agents, subagents,
capabilities, authority boundaries, permissions, supported tasks, approved
models, prompt versions, and lifecycle state.

Agents are governed platform services. They are not independent applications
and they do not replace authorized humans.

## Required Agent Record

Every registered agent must define:

- UUID.
- Name.
- Description.
- Domain.
- Owner.
- Supported tasks.
- Supported modules.
- Permissions.
- Need-to-Know scope.
- Approved models.
- Approved prompt versions.
- Cost policy.
- Evaluation policy.
- Lifecycle state.
- Version.
- Created by.
- Created at.
- Updated by.
- Updated at.

## Agent Governance Profile

Every agent must define:

- Mission.
- Responsibilities.
- Collaboration rules.
- Limits.
- Authority.
- Human approval requirements.
- Audit requirements.
- Explainability requirements.

## Principal Agents

The current principal AI agents are:

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

Approved specialized subagents:

- Terminology and Lexicography Subagent under Translation Agent.
- Semantic Fidelity Subagent under Translation Agent.
- Editorial Decision Subagent under Review Agent.
- Planning and Coordination Subagent under Coordinator Agent.
- Media Localization Subagent under Audio Agent and Video Agent.
- Platform Engineering Subagent under Evolution Agent.

Subagents do not replace parent responsibility. They operate inside parent
authority boundaries.

## Collaboration Rules

Agents may:

- Exchange information.
- Request assistance.
- Reuse results.
- Notify other agents.
- Coordinate through the Coordinator Agent.

Collaboration must still respect:

- Authentication.
- Authorization.
- Tenant isolation.
- Need-to-Know access.
- Workflow state.
- Rights restrictions.
- Cost policy.
- Prompt approval.
- Model approval.
- Audit.

## Authority Rules

AI agents may:

- Suggest.
- Explain.
- Summarize.
- Detect issues.
- Generate drafts.
- Recommend alternatives.
- Coordinate workflows.

AI agents may not:

- Publish automatically.
- Approve automatically.
- Grant rights.
- Bypass workflow.
- Modify security.
- Change governance.
- Expand their own permissions.
- Override validated terminology.
- Override human-approved editorial decisions.
- Access data outside their Need-to-Know scope.

## Lifecycle States

Agent lifecycle states:

- `DRAFT`.
- `UNDER_REVIEW`.
- `APPROVED`.
- `ACTIVE`.
- `SUSPENDED`.
- `DEPRECATED`.
- `ARCHIVED`.

Only `ACTIVE` agents may execute production AI workflows.

## Current Baseline Assessment

Strengths:

- Agent governance profiles are modeled in AI Governance.
- Principal agents and specialized subagents are documented.
- Marketplace stores agent-style metadata.
- Human Final Authority is represented across workflows.

Gaps:

- No canonical runtime Agent Registry API is fully implemented.
- No agent-to-prompt runtime binding is complete.
- No agent-to-model runtime binding is complete.
- No multi-agent execution engine is complete.
- No unified agent evaluation dashboard exists.

## Standardization Plan

1. Treat AI Governance and Marketplace agent metadata as current registry
   foundations.
2. Define one canonical registry model for future runtime implementation.
3. Link agents to approved prompt versions.
4. Link agents to approved model capabilities.
5. Link agents to cost policies and evaluation policies.
6. Add agent execution lineage in a future approved phase.
