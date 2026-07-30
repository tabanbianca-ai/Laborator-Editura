# AI Governance API Contracts

## Purpose

This document defines the target API contract surface for the AI Governance,
Model Management and Responsible AI Module.

These contracts are documentation-only for future expansion unless the
endpoint is already implemented.

## API Rules

- All AI Governance APIs are authenticated.
- All APIs are versioned.
- IAM and Need-to-Know visibility apply server-side.
- Sensitive prompts, responses, provider details, and cost records require
  explicit permissions.
- Secrets must never be returned.
- AI cannot approve its own model, prompt, budget, policy, or exception.

## Current Implemented API Baseline

The current API uses the `/ai-governance` route and includes:

- `GET /ai-governance/providers`.
- `POST /ai-governance/providers/:provider/status`.
- `GET /ai-governance/cost-summary`.
- `GET /ai-governance/agents`.
- `GET /ai-governance/usage`.
- `POST /ai-governance/usage`.
- `GET /ai-governance/budgets`.
- `POST /ai-governance/budgets`.
- `GET /ai-governance/quotas`.
- `POST /ai-governance/quotas`.
- `GET /ai-governance/policies`.
- `POST /ai-governance/policies`.
- `POST /ai-governance/override-requests`.
- `POST /ai-governance/override-requests/:id/approve`.
- `POST /ai-governance/override-requests/:id/reject`.
- `GET /ai-governance/audit`.

## Target Compatibility Aliases

The Module 21 specification also reserves the `/ai` route family for future
versioned public contracts:

- `GET /ai/models`.
- `POST /ai/models`.
- `GET /ai/prompts`.
- `POST /ai/prompts`.
- `GET /ai/agents`.
- `POST /ai/agents`.
- `POST /ai/evaluate`.
- `GET /ai/costs`.
- `GET /ai/policies`.

Future implementation must either provide compatible aliases or document a
stable route decision without breaking existing `/ai-governance/*` APIs.

## Model Registry

### List Models

`GET /ai/models`

Returns models visible to the authenticated actor.

### Register Model

`POST /ai/models`

Creates a model registry record.

Request fields:

- `provider`.
- `modelName`.
- `modelVersion`.
- `capabilities`.
- `supportedLanguages`.
- `supportedModalities`.
- `deploymentStatus`.
- `owner`.

## Prompt Registry

### List Prompts

`GET /ai/prompts`

Returns prompt templates visible to the authenticated actor.

### Create Prompt

`POST /ai/prompts`

Creates a prompt template or prompt version draft.

## Agent Registry

### List Agents

`GET /ai/agents`

Returns governed agents and subagents.

### Register Agent

`POST /ai/agents`

Creates or proposes an agent definition.

## Evaluation

### Evaluate

`POST /ai/evaluate`

Runs or records an evaluation for a model, prompt, provider, or agent.

## Costs

### List Costs

`GET /ai/costs`

Returns AI cost records and summaries visible to the authenticated actor.

## Policies

### List Policies

`GET /ai/policies`

Returns AI policies visible to the authenticated actor.

## Error Handling

AI Governance APIs should return safe errors:

- `401` when authenticated context is missing.
- `403` when the actor lacks permission.
- `404` when a visible resource does not exist.
- `409` when a lifecycle, version, policy, or approval conflict exists.
- `422` when model, prompt, policy, or evaluation inputs are invalid.

Errors must not expose secrets, prompt content beyond permissions, or
restricted source context.
