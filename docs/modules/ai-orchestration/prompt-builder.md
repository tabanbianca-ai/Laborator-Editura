# AI Prompt Builder

## Purpose

The Prompt Builder generates the exact prompt package for each AI execution.

Prompts are internal technical artifacts. They must be centralized,
versioned, auditable, and selected through AI Orchestration.

## Prompt Inputs

Prompt generation depends on:

- Capability type.
- Agent.
- Task type.
- Project rules.
- Platform Language.
- Original Language.
- Authoring Language.
- Target Language.
- Domain.
- Style rules.
- Glossaries.
- Terminology.
- Context package.
- Expected output contract.
- Human review requirement.

## Prompt Record

Each prompt record must include:

- `promptId`.
- `version`.
- `name`.
- `description`.
- `capabilityId`.
- `agentId`.
- `language`.
- `inputContract`.
- `outputContract`.
- `systemInstructions`.
- `template`.
- `variables`.
- `status`.
- `approvedBy`.
- `approvedAt`.
- `createdAt`.
- `updatedAt`.

Statuses:

- `DRAFT`.
- `UNDER_REVIEW`.
- `ACTIVE`.
- `SUSPENDED`.
- `ARCHIVED`.

Only `ACTIVE` prompts may be used for production AI execution.

## Current Repository Baseline

`docs/ai/prompt-management.md` defines prompt governance and versioning
requirements.

No central runtime prompt registry or prompt builder was identified in the
current source. Some modules contain deterministic advisory logic and
metadata, but no production provider prompts are embedded as direct external
AI calls.

## Prompt Versioning Rules

- Prompts cannot be overwritten.
- Each change creates a new version.
- Each AI execution records the prompt ID and prompt version.
- Suspended or archived prompts must not be used for new production tasks.
- Prompt output contracts must be validated by the AI Validation Engine.

## Governance Rules

Prompts must not:

- Contain secrets.
- Instruct AI to approve.
- Instruct AI to publish.
- Instruct AI to grant rights.
- Instruct AI to bypass workflow.
- Instruct AI to modify security or governance.
- Request unauthorized context.
- Contradict Human Final Authority.

## Audit Requirements

Audit must record:

- Prompt generated.
- Prompt version selected.
- Prompt preview requested.
- Prompt status changed.
- Prompt approval.
- Prompt suspension.
- Prompt execution reference.

## Future Implementation Path

Initial runtime work should add:

1. Prompt contract types.
2. Prompt preview endpoint.
3. Prompt version storage.
4. Prompt audit events.
5. One non-provider preview path for validation.
6. Production execution only after context, routing, validation, and audit are
   ready.

