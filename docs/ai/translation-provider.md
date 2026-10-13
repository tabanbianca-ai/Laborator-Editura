# AI Translation Provider

## Purpose

The translation workspace can request provider-backed translation proposals through the central AI governance layer. A proposal is advisory evidence only. It is never saved, approved, or published automatically.

## Authorization Boundary

External processing is fail-closed and requires both controls below:

1. An administrator enables `AI_EXTERNAL_PROCESSING_ENABLED=true` in the runtime environment.
2. The authenticated user explicitly authorizes the selected segment for each proposal request.

The user must still select **Use proposal** and save the translation. Existing workflow review and human approval gates remain unchanged.

## Provider Configuration

OpenAI is the primary provider when `OPENAI_API_KEY` is configured. Anthropic is an eligible fallback when `ANTHROPIC_API_KEY` is configured. Credentials must be supplied through protected environment configuration and must never be committed or logged.

Supported configuration:

- `AI_EXTERNAL_PROCESSING_ENABLED`
- `AI_PROVIDER_TIMEOUT_MS`
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_TRANSLATION_MODEL`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_BASE_URL`
- `ANTHROPIC_TRANSLATION_MODEL`

The default timeout is 20 seconds and accepts configured values from 1 to 120 seconds. A provider request is attempted at most twice before the next configured provider is considered.

## Data Handling

Only the selected source segment, its language direction, the approved project glossary, relevant validated Translation Memory proposals, and optional editorial domain are sent. The source, glossary, and Translation Memory values are marked as untrusted editorial content in the provider instruction.

Audit records include tenant, user, project, document, segment, provider, model, status, and token metadata. They do not include manuscript text, glossary text, Translation Memory text, credentials, or provider response text.

## Validation

Automated integration tests use deterministic local HTTP response fixtures and do not contact a provider. Live generation requires separately supplied provider credentials and explicit external-processing enablement.
