# AI Testing

## Purpose

AI testing validates the whole AI workflow, not only generated text.

## Required AI Test Areas

- Prompt identity.
- Prompt version.
- Provider selection.
- Provider fallback.
- Cost estimate.
- Token metadata.
- Evidence sources.
- Human approval gates.
- Audit trail.
- Reproducibility metadata.
- Safety limits.
- Non-authoritative AI behavior where required.
- No AI auto-approval.

## Current Baseline

Current AI-related tests include:

- AI Governance.
- AI Agent Governance.
- AI Agent Roles and Subagents.
- AI Agent Functional Editorial Workflows.
- Editorial Decision Agent.
- Lexicographic integration.
- Semantic Fidelity.
- Media Localization.
- Multimedia Creation.
- Platform Engineering.
- Scheduling.
- Marketplace Agent Registry.
- AI Providers and Cost Management UI.

## AI Testing Rules

- AI tests should be deterministic when possible.
- Provider calls must be mocked or adapter-based unless an explicitly approved
  external integration test is running.
- Human Final Authority must be tested for every AI approval boundary.
- AI outputs must preserve evidence, confidence, rationale, and audit
  metadata.
- AI must not overwrite validated terminology or human-approved decisions.

## Required Future Coverage

- Golden prompt/version fixtures.
- Provider fallback simulation.
- Cost threshold simulation.
- Regression tests for unsafe auto-approval.
- Evaluation suites for semantic fidelity and terminology quality.

## Acceptance Criteria

- AI workflow tests are reproducible.
- Provider outages do not bypass governance.
- AI cannot approve, publish, grant rights, revoke access, or override humans.
