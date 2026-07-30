# AI Prompt Registry

## Purpose

The Prompt Registry is the authoritative source for managed prompt templates
and prompt versions used by AI agents and platform modules.

Functional modules must not maintain independent production prompt
repositories outside AI Governance and AI Orchestration.

## Prompt Template

Each prompt template must include:

- `promptId`.
- `name`.
- `owner`.
- `description`.
- `purpose`.
- `language`.
- `applicableModels`.
- `applicableAgents`.
- `riskLevel`.
- `approvalStatus`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

## Prompt Version

Each prompt version must include:

- `promptVersionId`.
- `promptId`.
- `version`.
- `template`.
- `variables`.
- `language`.
- `applicableModels`.
- `evaluationStatus`.
- `approvalStatus`.
- `approvedBy`.
- `approvedAt`.
- `createdBy`.
- `createdAt`.

Prompt versions are immutable. Any change creates a new version.

## Prompt Lifecycle

Statuses:

- `DRAFT`.
- `UNDER_EVALUATION`.
- `APPROVED`.
- `ACTIVE`.
- `SUSPENDED`.
- `ARCHIVED`.

Lifecycle:

1. Draft prompt created.
2. Variables and risk profile defined.
3. Evaluation run completed.
4. Human approval recorded where required.
5. Prompt version activated.
6. Prompt version used by AI Orchestration.
7. Superseded prompt remains auditable.

## Execution Requirements

Every AI execution must record:

- Prompt ID.
- Prompt version.
- Template variables.
- Context version or context hash.
- Model and model version.
- Provider.
- Parameters.
- Actor.
- Workflow.
- Cost.
- Token usage.

## Current Repository Baseline

Current foundations:

- `docs/ai/prompt-management.md` defines prompt management direction.
- AI Orchestration documents prompt building and prompt version resolution.
- Some module tests verify that AI behavior remains advisory and auditable.

Current gaps:

- No runtime prompt registry exists.
- No prompt version persistence exists.
- No prompt approval workflow exists.
- No prompt evaluation records exist.
- No prompt-to-agent assignment registry exists.

## Audit Events

Audit:

- Prompt created.
- Prompt version created.
- Prompt evaluated.
- Prompt approved.
- Prompt published.
- Prompt updated through new version.
- Prompt suspended.
- Prompt archived.
- Prompt used.

## AI Rules

AI may:

- Suggest prompt improvements.
- Generate draft prompt variants.
- Explain prompt risk.

AI may not:

- Publish prompts automatically.
- Approve prompt versions.
- Use unapproved high-risk prompts.
- Overwrite prompt history.
