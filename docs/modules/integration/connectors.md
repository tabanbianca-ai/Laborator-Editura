# External Connectors

## Purpose

External connectors provide standardized, governed access to external systems
without allowing functional modules to call providers directly.

## Connector Categories

Cloud Storage:

- Google Drive.
- Dropbox.
- OneDrive.
- Amazon S3.
- Azure Blob Storage.

Version Control:

- GitHub.
- GitLab.

AI Services:

- OpenAI.
- Azure OpenAI.
- Anthropic.
- Google Gemini.
- Mistral.
- Ollama.

Voice and Audio:

- ElevenLabs.
- Google Cloud TTS.
- Azure Speech.
- Amazon Polly.

OCR:

- Google Vision.
- Azure Vision.
- Tesseract.

Translation:

- DeepL.
- Google Translate.
- Microsoft Translator.

Publishing:

- Amazon KDP.
- IngramSpark.
- Lulu.
- Blurb.

Notifications:

- SendGrid.
- Mailgun.
- Twilio.

Productivity:

- Google Calendar.
- Google Contacts.
- Gmail.

## Current Repository Baseline

Current runtime connector metadata supports:

- Google Drive.
- Dropbox.
- OneDrive.
- OpenAI.
- Anthropic.
- DeepL.
- ElevenLabs.
- Stripe.
- PayPal.
- Amazon S3.
- MinIO.
- Custom providers.

Connector records currently include status, configuration metadata, scopes,
human approval requirement, AI suggestion flag, external connection disabled
flag, and audit history.

No real provider adapter runtime is implemented yet.

## Connector Lifecycle

Target lifecycle:

1. Register provider metadata.
2. Validate configuration.
3. Store secret references through approved secret management.
4. Run connection test.
5. Enable connector by authorized human.
6. Execute provider operations through adapter interface.
7. Monitor health, latency, errors, retries, and cost where applicable.
8. Disable or rotate connector when required.

## Adapter Contract

Every connector adapter should expose:

- Identity.
- Capabilities.
- Configuration validation.
- Health check.
- Request normalization.
- Execution.
- Response normalization.
- Error normalization.
- Retry classification.
- Cost estimate when applicable.
- Observability metadata.
- Audit metadata.

## Connector Rules

- Provider SDK calls must live inside approved adapters only.
- Functional modules must depend on platform connector services, not provider
  SDKs.
- Secrets must never be hardcoded, logged, indexed, exported, or embedded in
  JSON Master.
- AI may suggest connector configuration but must not enable providers or
  create active secrets automatically.
- Connectors must be tenant-scoped and policy-governed.

## Current Gaps

- Adapter interfaces are not implemented.
- Real provider connection tests are not implemented.
- OAuth runtime is not implemented.
- Circuit breaker behavior is not implemented.
- Connector observability is metadata-level only.
