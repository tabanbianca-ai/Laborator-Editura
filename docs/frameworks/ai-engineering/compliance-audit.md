# AI Compliance Audit

## Purpose

AI Compliance Audit defines how Framework 04 conformity is measured for AI
agents, prompts, models, providers, RAG pipelines, knowledge bases, evaluation
records, cost records, and automation workflows.

## Audit Scope

Audit must cover:

- AI executions.
- Agent registry changes.
- Prompt creation and versioning.
- Prompt approval.
- Prompt usage.
- Model registration.
- Model approval.
- Model activation, deprecation, and retirement.
- Provider status changes.
- Provider fallback activation and recovery.
- RAG source consultation.
- Knowledge base updates.
- Evaluation and benchmark results.
- Cost estimates.
- Actual costs where available.
- Quota warnings.
- Budget blocks.
- Human approvals.
- Human rejections.
- Exceptions.

## Execution Audit Record

Every AI execution should preserve:

- Execution id.
- Actor.
- Organization.
- Agent id.
- Capability.
- Prompt id.
- Prompt version.
- Model id.
- Model version.
- Provider.
- Context references.
- Context hash where applicable.
- Input classification.
- Output reference.
- Token usage.
- Estimated cost.
- Actual cost where available.
- Evaluation status.
- Human approval requirement.
- Human approval result where applicable.
- Timestamp.

## Compliance Criteria

An AI workflow is compliant when it:

- Uses registered agents.
- Uses approved prompt versions where required.
- Uses approved models where required.
- Preserves provider and model metadata.
- Preserves cost and token usage metadata.
- Uses minimum necessary context.
- Respects Need-to-Know access.
- Preserves citations for retrieved context.
- Is explainable.
- Is evaluated periodically.
- Keeps humans in control of critical actions.
- Preserves audit trail.

## Baseline Compliance Assessment

Strengths:

- AI Governance, Marketplace, Observability, and Policy foundations exist.
- Human Final Authority is explicit.
- Cost governance is implemented as metadata foundation.
- Provider fallback policy is documented.
- Direct provider coupling risk is low.

Gaps:

- Prompt registry runtime is missing.
- Model registry runtime is missing.
- RAG runtime is missing.
- Evaluation runtime is missing.
- AI execution reproducibility record is not complete.
- AI compliance reporting is not yet centralized.

## Exception Handling

AI governance exceptions require:

- Exception id.
- Affected agent, prompt, model, provider, or workflow.
- Reason.
- Risk assessment.
- Approval authority.
- Expiration where temporary.
- Remediation plan.
- Audit trail.

Exceptions may not permit AI to:

- Publish automatically.
- Approve automatically.
- Grant rights.
- Bypass workflow.
- Modify security.
- Change governance.
- Hide evidence.
- Delete or alter audit history.

## Reporting

Future AI compliance reports should include:

- Registered agents.
- Active prompts.
- Active models.
- Provider status.
- RAG source usage.
- Evaluation coverage.
- Cost summary.
- Quota warnings.
- Human approval outcomes.
- Policy violations.
- Exceptions.
- Remediation status.
