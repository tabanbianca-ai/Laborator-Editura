# AI Model Router

## Purpose

The Model Router selects the provider and model for each AI task without
coupling functional modules to any external AI provider.

The router protects provider independence, cost control, fallback behavior,
policy compliance, and observability.

## Routing Inputs

Routing decisions may use:

- Capability.
- Agent.
- Task complexity.
- Content type.
- Source language.
- Target language.
- Platform Language.
- Required quality.
- Latency target.
- Cost target.
- Privacy classification.
- Provider availability.
- Organization policy.
- Subscription entitlements.
- Quotas.
- Budget status.
- Manual model selection permissions.

## Current Repository Baseline

AI Governance currently models:

- OpenAI as primary provider metadata.
- Anthropic as fallback provider metadata.
- Provider statuses.
- Fallback activation and recovery audit events.
- Automatic model selection as default.
- Manual model selection as role and subscription gated.
- Usage records, budgets, quotas, cost policies, and override requests.

No runtime provider adapter layer or model router was identified. The current
implementation does not contain real provider SDK calls.

## Provider Independence

Functional modules must request capabilities, not providers.

Allowed:

```text
request capability: TRANSLATION_PROPOSAL
```

Not allowed:

```text
call OpenAI translation model directly
```

## Fallback Policy

Default v1.0 provider policy:

- Primary provider: OpenAI.
- Fallback provider: Anthropic.

Fallback may activate on:

- Timeout.
- Unavailable service.
- API error.
- Configured outage.

Recovery to primary may occur when primary health returns. Every provider
switch and recovery must be audited.

## Route Record

Each route selection should record:

- `routeId`.
- `aiTaskId`.
- `providerId`.
- `modelId`.
- `routingPolicyVersion`.
- `selectionReason`.
- `fallbackProviderId`.
- `costEstimate`.
- `latencyTarget`.
- `qualityTarget`.
- `selectedAt`.

## Cost and Quota Rules

Before execution, the router must check:

- User budget.
- Project budget.
- Organization budget.
- Agent budget.
- Monthly limits.
- Per-run limits.
- Subscription entitlement.
- Platform Creator exception.

Limits must never delete data. They may block only the restricted AI action.

## Future Implementation Path

1. Define provider adapter contracts.
2. Define routing policy contracts.
3. Connect AI Governance provider state to route selection.
4. Add deterministic route selection tests.
5. Add fallback and recovery audit.
6. Add provider SDK adapters only after contracts are validated.

