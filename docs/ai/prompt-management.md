# AI Prompt Management

## Purpose

Prompt Management defines how prompts are authored, versioned, approved, and
used across the platform.

Production prompts must not be embedded directly inside functional modules.

## Prompt Record

Each prompt must include:

- `promptId`.
- `version`.
- `name`.
- `description`.
- `capability`.
- `language`.
- `author`.
- `ownerModule`.
- `inputContract`.
- `outputContract`.
- `systemInstructions`.
- `template`.
- `variables`.
- `status`.
- `createdAt`.
- `updatedAt`.
- `approvedBy` when required.
- `approvedAt` when required.
- `auditMetadata`.

## Prompt Statuses

Prompt statuses:

- `DRAFT`.
- `UNDER_REVIEW`.
- `ACTIVE`.
- `SUSPENDED`.
- `ARCHIVED`.

Only `ACTIVE` prompts may be used in production AI execution.

## Versioning Rules

Prompts cannot be overwritten.

Every prompt change creates a new version. Previous versions remain auditable
and must be available for execution trace review.

Every AI execution must record:

- Prompt ID.
- Prompt version.
- Prompt status at execution time.
- Capability.
- Calling module.
- Routing policy version.

## Prompt Governance

Prompt governance rules:

- Prompts must be written in English as internal technical artifacts.
- User-facing AI explanations must use Platform Language.
- Prompts must not contain secrets.
- Prompts must not bypass authorization, workflow, or human approval.
- Prompts must not instruct AI to approve, publish, grant rights, alter
  security, or change governance.
- Prompts must specify expected output shape.
- Prompts must support deterministic audit where possible.

## Context Assembly

Prompts receive context from the AI Orchestration Service, not directly from
modules.

Context assembly must observe:

- Tenant isolation.
- Need-to-Know access.
- Role permissions.
- Subscription entitlements.
- Privacy classification.
- Sensitive data filtering.
- Language policy.
- Prompt input contract.

## Prompt Inventory Baseline

The current repository contains AI-related instructions in documentation and
agent governance metadata. A centralized runtime prompt registry was not
identified in the inspected source.

Future prompt implementation must migrate production prompts into the central
prompt management model before external provider execution is enabled.
