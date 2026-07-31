# Prompt Registry

## Purpose

The Prompt Registry is the authoritative source for prompt templates, prompt
versions, variables, output schemas, evaluation metrics, approval status, and
production usage.

Production prompts must not be embedded directly in functional modules.

## Prompt as Code

Prompts are governed artifacts.

Rules:

- Prompts must be versioned.
- Prompt versions are immutable.
- Changes create new versions.
- Prompt usage must be traceable.
- Prompt outputs must have expected schemas.
- Prompt risk must be reviewed.
- High-risk prompts require human approval before production use.

## Prompt Record

Each prompt must include:

- UUID.
- Title.
- Purpose.
- Domain.
- Owner.
- Template.
- Variables.
- Output schema.
- Evaluation metrics.
- Applicable agents.
- Applicable models.
- Applicable languages.
- Risk level.
- Approval status.
- Version.
- Created by.
- Created at.
- Approved by where required.
- Approved at where required.

## Prompt Version Record

Each prompt version must include:

- Prompt version id.
- Prompt id.
- Version.
- Template snapshot.
- Variable schema.
- Output schema.
- Evaluation status.
- Approval status.
- Model compatibility.
- Agent compatibility.
- Created by.
- Created at.
- Approved by where required.
- Approved at where required.

## Prompt Lifecycle

Statuses:

- `DRAFT`.
- `UNDER_EVALUATION`.
- `UNDER_REVIEW`.
- `APPROVED`.
- `ACTIVE`.
- `SUSPENDED`.
- `ARCHIVED`.

Only `ACTIVE` prompt versions may be used in production execution.

## Prompt Execution Metadata

Every AI execution must record:

- Prompt id.
- Prompt version.
- Prompt status at execution time.
- Template variables.
- Context version or context hash.
- Model id.
- Model version.
- Provider.
- Parameters.
- Actor.
- Organization.
- Workflow.
- Cost.
- Token usage.
- Output schema validation result.
- Audit event reference.

## Prompt Governance Rules

- Prompts must be written as internal technical artifacts in English.
- User-facing AI output must use Platform Language.
- Prompts must not contain secrets.
- Prompts must not bypass authorization, workflow, rights, policy, or human
  approval.
- Prompts must not instruct AI to approve, publish, grant rights, alter
  security, change governance, or hide risk.
- Prompts must include output schema expectations.
- Prompts must support deterministic audit where possible.

## Current Baseline Assessment

Strengths:

- Prompt management rules exist in `docs/ai/prompt-management.md`.
- AI Governance prompt registry documentation exists.
- AI Orchestration documents prompt builder responsibilities.

Gaps:

- No runtime prompt registry exists.
- No prompt version persistence exists.
- No prompt approval workflow exists.
- No prompt evaluation records exist.
- No prompt-to-agent runtime binding exists.
- No prompt execution reproducibility record is fully implemented.

## Standardization Plan

1. Use this document as the canonical prompt registry requirement.
2. Inventory all documentation-level prompts and AI instructions.
3. Identify production-critical prompts.
4. Define prompt version schema.
5. Define prompt approval workflow.
6. Define prompt evaluation metrics.
7. Implement runtime registry only in a future approved phase.
