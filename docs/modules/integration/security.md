# Integration Security

## Purpose

Integration security protects APIs, connectors, webhooks, credentials,
provider access, tenant data, and interoperability boundaries.

## Security Responsibilities

The module must enforce:

- Central authentication through IAM.
- Authorization through IAM, permissions, policies, and Need-to-Know.
- API key scope validation.
- Secret hashing or approved secret references.
- OAuth integration policy.
- Webhook signing.
- Replay protection.
- Rate limiting.
- Request validation.
- Safe error responses.
- Audit for state-changing actions.
- Observability without leaking secrets.

## Current Repository Baseline

Current security foundations include:

- Server-derived request context.
- Global request authentication for protected routes.
- Rate limiting middleware.
- Security headers middleware.
- Environment secret validation.
- API key secret hashing in Gateway.
- Webhook secret hashing in Gateway.
- Human Final Authority fields.
- AI-initiated provider, webhook, and API secret activation rejection.
- Runtime backup of integration security metadata.

## Secret Rules

- Secrets must not be hardcoded.
- Secrets must not be logged.
- Secrets must not be exposed in API responses after creation.
- Secrets must not be included in client bundles.
- Secrets must not be indexed or exported.
- Secrets should be stored through Secret Vault or approved external vault
  integration when real providers are activated.

## OAuth Rules

OAuth integration must define:

- Provider.
- Client metadata.
- Redirect URI policy.
- Scope allowlist.
- Token storage policy.
- Refresh policy.
- Revocation behavior.
- Audit events.

OAuth runtime is not implemented yet.

## AI Rules

AI may:

- Suggest connector configuration.
- Summarize integration status.
- Detect risk.
- Recommend scopes.

AI may not:

- Create active secrets automatically.
- Enable providers automatically.
- Disable providers automatically.
- Bypass rate limits.
- Expand scopes.
- Modify security policy.

## Current Gaps

- Full encrypted secret lifecycle is not implemented.
- OAuth runtime is not implemented.
- API key runtime authentication for external consumers is not fully modeled.
- Webhook signature verification is not implemented.
- Distributed rate limiting is not implemented.
