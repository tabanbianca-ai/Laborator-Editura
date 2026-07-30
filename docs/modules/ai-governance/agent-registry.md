# AI Agent Registry

## Purpose

The Agent Registry governs AI agents, specialized subagents, responsibilities,
assigned models, prompts, workflows, permissions, policies, monitoring
profiles, limits, and authority.

AI agents are managed platform services. They are not independent actors and
cannot bypass IAM, Need-to-Know, Workflow, Rights, Publishing, or Human Final
Authority.

## Agent Record

Each agent must include:

- `agentId`.
- `name`.
- `purpose`.
- `agentKind`.
- `parentAgentId`.
- `assignedModels`.
- `assignedPrompts`.
- `workflows`.
- `permissions`.
- `policies`.
- `monitoringProfile`.
- `owner`.
- `status`.
- `mission`.
- `responsibilities`.
- `collaboration`.
- `limits`.
- `authority`.

## Current Principal Agents

The current governance profile defines:

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

## Current Specialized Subagents

- Terminology and Lexicography Subagent.
- Semantic Fidelity Subagent.
- Editorial Decision Subagent.
- Planning and Coordination Subagent.
- Media Localization Subagent.
- Platform Engineering Subagent.

## Agent Rules

- Agents may collaborate through the Coordinator Agent.
- Agents may exchange information within authorized context.
- Agents must receive only minimum necessary data.
- Agents must operate within their specialized responsibility.
- Agents must record outputs, evidence, limitations, and audit references.
- Agents cannot expand their own permissions.
- Agents cannot approve, publish, grant rights, or bypass workflow.

## Current Repository Baseline

Current implementation:

- `AI_AGENT_GOVERNANCE_PROFILES` defines agent mission, responsibilities,
  collaboration, limits, authority, status, and version metadata.
- `/ai-governance/agents` exposes agent governance profiles.
- Marketplace metadata can register agents and extensions.
- Observability can record agent execution metadata.

Current gaps:

- Agent definitions are static source metadata, not a managed runtime registry.
- No runtime assignment from agents to approved model and prompt versions.
- No agent lifecycle approval workflow exists.
- No agent-level benchmark history exists.
- No agent-level risk register exists.

## Audit Events

Audit:

- Agent registered.
- Agent updated.
- Agent enabled.
- Agent disabled.
- Agent assigned to model.
- Agent assigned to prompt.
- Agent executed.
- Agent policy changed.
- Agent human review required.

## AI Rules

AI may:

- Suggest agent configuration.
- Summarize agent performance.
- Detect overlapping responsibilities.

AI may not:

- Enable itself.
- Assign itself unauthorized models.
- Change its authority.
- Grant permissions.
