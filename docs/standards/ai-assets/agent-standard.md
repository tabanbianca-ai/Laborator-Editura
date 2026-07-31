# AI Agent Standard

## Purpose

This document defines the canonical structure, responsibilities, permissions,
model access, knowledge access, workflow dependencies, escalation rules, and
audit requirements for AI agents.

## Required Agent Fields

Every AI agent must define:

- `uuid`.
- `canonicalName`.
- `displayName`.
- `agentVersion`.
- `mission`.
- `responsibilities`.
- `limits`.
- `authority`.
- `inputSources`.
- `outputTargets`.
- `permissions`.
- `accessibleKnowledgeBases`.
- `allowedModels`.
- `allowedPromptVersions`.
- `workflowDependencies`.
- `policyDependencies`.
- `costPolicy`.
- `escalationRules`.
- `humanApprovalRequirements`.
- `evaluationRequirements`.
- `auditInformation`.

## Governance Model

Every AI agent must define:

- Mission.
- Responsibilities.
- Collaboration.
- Limits.
- Authority.

Agents may collaborate through approved orchestration, exchange information
within permission boundaries, request assistance, reuse results, notify other
agents, and coordinate execution order.

## Human Final Authority

AI agents may recommend, draft, explain, evaluate, summarize, validate,
coordinate, or report issues when authorized.

AI agents must not:

- Approve automatically.
- Publish automatically.
- Grant rights.
- Grant access.
- Bypass workflow.
- Modify security.
- Change governance.
- Override authorized human decisions.
- Expand their own access.

## Access Rules

AI agents receive minimum necessary data only.

Agent access must respect:

- Server-derived identity.
- Tenant isolation.
- RBAC.
- Need-to-Know access.
- Data classification.
- Rights and provenance.
- Source authority rules.
- Human approval gates.

## Principal Agent Registry

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

Specialized subagents remain scoped under parent agents and do not replace
parent responsibility.

## Evaluation

Agent evaluation should include:

- Task accuracy.
- Policy compliance.
- Output schema compliance.
- Evidence quality.
- Hallucination rate.
- Response consistency.
- Safety score.
- Cost.
- Latency.
- Human review score.

## Audit

Audit must record:

- Agent registered.
- Agent updated.
- Agent activated.
- Agent disabled.
- Agent permissions changed.
- Agent prompt assignment changed.
- Agent model assignment changed.
- Agent knowledge base access changed.
- Agent execution requested.
- Agent execution completed.
- Agent execution blocked.
- Agent escalation requested.
- Human approval recorded.

## Current Baseline

Principal agents, subagents, authority limits, Quality Agent, and AI
collaboration rules are documented in `AGENTS.md`, AI Governance, AI
Orchestration, Marketplace, and Platform Engineering documentation. Runtime
agent governance profiles and marketplace agent metadata exist as foundations,
but a complete runtime agent execution engine is not yet implemented.

