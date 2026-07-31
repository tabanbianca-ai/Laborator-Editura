# AI Cost Management

## Purpose

AI Cost Management governs estimated and actual AI cost, token usage, quotas,
budgets, provider fallback cost impact, and AI execution limits across users,
projects, organizations, agents, models, and providers.

## Cost Awareness Rule

Every AI execution should estimate and record cost where provider metadata
allows it.

AI must not approve its own budget increases, bypass hard limits, alter cost
history, or delete usage records.

## Usage Record

Each usage record must preserve:

- Usage record id.
- Agent name.
- Execution type.
- Project id where applicable.
- Document id where applicable.
- User id.
- Organization id.
- Provider.
- Model.
- Input tokens.
- Output tokens.
- Total tokens.
- Estimated cost.
- Actual cost where available.
- Currency.
- Status.
- Created at.
- Prompt version where available.
- Workflow reference where available.
- Audit event reference.

## Budget Scopes

Budgets may be scoped by:

- Organization.
- Project.
- User.
- Agent.
- Model.
- Provider.
- Month.
- Run.

## Quota Scopes

Quotas may define:

- Maximum tokens per run.
- Maximum cost per run.
- Maximum runs per day.
- Maximum runs per month.
- Agent-specific limits.
- Project-specific limits.
- User-specific limits.
- Organization-specific limits.

## Warning Thresholds

Standard warning thresholds:

- 80 percent.
- 90 percent.
- 100 percent.

Limit reached behavior:

- Never delete data.
- Block only restricted AI actions.
- Allow waiting until quota reset.
- Allow authorized subscription or budget changes.
- Preserve audit trail.

## Provider Fallback Cost Impact

Fallback may change:

- Model.
- Provider.
- Latency.
- Cost.
- Privacy profile.
- Token limits.

Every fallback activation and recovery must be audited and linked to cost
metadata.

## Platform Creator

Platform Creator remains unrestricted by subscription limits but must still
have AI usage recorded for monitoring, testing, governance, and audit.

## Current Baseline Assessment

Strengths:

- AI Governance includes usage records, budgets, quotas, cost policies, and
  override requests.
- OpenAI primary and Anthropic fallback policy is documented.
- Warning thresholds are already established.
- Platform Creator unrestricted behavior is represented.

Gaps:

- Real provider pricing synchronization is not implemented.
- Actual cost ingestion from providers is not implemented.
- Cost forecasts are not yet linked to model evaluation.
- Cross-agent cost optimization recommendations are metadata-only.

## Standardization Plan

1. Keep AI Governance as the current cost foundation.
2. Link usage records to prompt and model versions.
3. Link provider fallback to cost delta reporting.
4. Add cost forecasting in a future approved phase.
5. Add provider pricing synchronization only when external providers are
   implemented.
