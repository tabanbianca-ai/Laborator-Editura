# AI Cost Management

## Purpose

AI Cost Management governs and audits the financial and resource consumption
of AI across users, projects, agents, models, providers, and organizations.

## Monitored Costs

The module must monitor:

- Cost per project.
- Cost per user.
- Cost per agent.
- Cost per model.
- Cost per organization.
- Monthly cost.
- Cost per provider.
- Token consumption.
- Image consumption.
- Audio consumption.
- Video or media generation consumption.

## Current Repository Baseline

Current implementation:

- `/ai-governance/usage` records AI usage.
- `/ai-governance/cost-summary` summarizes consumption.
- `/ai-governance/budgets` manages budget metadata.
- `/ai-governance/quotas` manages quota metadata.
- `/ai-governance/policies` manages cost policy metadata.
- `/ai-governance/override-requests` records human override requests.
- OpenAI is modeled as primary provider metadata.
- Anthropic is modeled as fallback provider metadata.
- Platform Creator unlimited behavior is represented in cost summary metadata.
- Budget warnings and exceeded limits are audited.

## Usage Record

Each usage record must preserve:

- `usageRecordId`.
- `agentName`.
- `executionType`.
- `projectId`.
- `documentId`.
- `userId`.
- `organizationId`.
- `provider`.
- `model`.
- `inputTokens`.
- `outputTokens`.
- `totalTokens`.
- `estimatedCost`.
- `actualCost`.
- `currency`.
- `status`.
- `createdAt`.

## Budgets

Budgets may be scoped by:

- Organization.
- Project.
- User.
- Agent.
- Month.
- Run.

## Quotas

Quotas may define:

- Maximum tokens per run.
- Maximum cost per run.
- Maximum runs per day.
- Maximum runs per month.
- Agent-specific limits.
- Project-specific limits.

## Warning Thresholds

Standard warning thresholds:

- 80 percent.
- 90 percent.
- 100 percent.

Limit reached behavior:

- Never delete data.
- Block only the restricted AI action.
- Allow waiting until quota reset.
- Allow authorized subscription or budget changes.

## Provider Fallback Cost Rules

- Provider fallback may change cost profile.
- Fallback activation must be audited.
- Fallback recovery must be audited.
- Cost estimate must identify provider and model.

## AI Rules

AI may:

- Estimate cost.
- Suggest optimizations.
- Warn about budget risk.
- Recommend quota changes.

AI may not:

- Approve its own budget increase.
- Bypass hard limits.
- Alter cost history.
- Delete usage records.
