# AI Orchestration Workflows

## Purpose

This document defines the standard workflows for AI tasks, agent execution,
agent chains, validation, and human review handoff.

## Standard AI Task Workflow

```text
Task Created
  -> Context Build
  -> Prompt Generation
  -> Model Selection
  -> AI Execution
  -> Validation
  -> Human Review when required
  -> Completed
```

Failure path:

```text
AI Execution
  -> Validation Failed
  -> Retry when policy allows
  -> Human Review or Failed
```

## Agent Chain Workflow

Complex tasks may use multiple agents:

```text
Translation Agent
  -> Terminology and Lexicography Subagent
  -> Semantic Fidelity Subagent
  -> Proofreading or Review Agent
  -> Editorial Decision Subagent
```

Each step receives the previous step's normalized output as input. Each step
also records prompt version, context version, model route, validation report,
cost, duration, and audit evidence.

## Human Review Workflow

```text
AI Recommendation
  -> Validation
  -> Human Review Required
  -> Authorized Human Accepts or Rejects
  -> Version and Audit Recorded
```

The system must not apply AI recommendations automatically when human approval
is required.

## Context Preview Workflow

```text
User requests preview
  -> Permission Check
  -> Context Sources Selected
  -> Sensitive Data Filtered
  -> Context Preview Returned
  -> Audit Recorded
```

No model execution occurs in this workflow.

## Prompt Preview Workflow

```text
User requests prompt preview
  -> Permission Check
  -> Prompt Version Resolved
  -> Context Variables Bound
  -> Preview Returned
  -> Audit Recorded
```

Prompt preview must not call an external provider.

## Provider Fallback Workflow

```text
Primary Provider Selected
  -> Provider Failure Detected
  -> Fallback Policy Evaluated
  -> Fallback Provider Selected
  -> Fallback Audit Recorded
  -> Execution Continues or Fails
```

Recovery:

```text
Primary Provider Healthy
  -> Recovery Policy Evaluated
  -> Primary Provider Reinstated
  -> Recovery Audit Recorded
```

## Current Workflow Baseline

The repository has:

- AI agent governance profiles.
- Deterministic AI workflow tests.
- AI usage and cost governance workflows.
- Observability agent execution records.
- Editorial Decision human approval flow.
- Policy and security governance checks.

The repository does not yet have:

- A central AI task workflow runtime.
- A central agent chain runtime.
- A central prompt preview endpoint.
- A central context preview endpoint.
- Runtime provider execution and fallback adapters.

