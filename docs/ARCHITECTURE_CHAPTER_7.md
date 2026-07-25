# Laborator Editura Official Platform Architecture

Chapter 7 - Integrations and AI Agent Architecture.

Official architecture document.

Version: 1.0.

## 1. Purpose

This document defines the official integration and AI agent architecture for
the Laborator Editura platform.

Objectives:

- Define a single AI integration model for the entire platform.
- Separate business modules from external AI provider implementations.
- Ensure all modules reuse the same AI orchestration infrastructure.
- Provide full traceability, auditability, observability, and cost control for
  AI usage.
- Allow providers to be replaced or added without changing functional modules.

This document is an architecture standard. It does not authorize immediate
provider SDK integration, API changes, database changes, UI changes, Docker
changes, or replacement of validated Phase 7 Step 16 behavior.

## 2. Fundamental Principles

AI and external integrations must follow these principles:

- AI Provider Agnostic.
- AI Orchestration First.
- Human in the Loop.
- Audit by Default.
- Prompt Versioning.
- Security by Design.
- Privacy by Design.
- Cost Awareness.
- Observability.
- Extensibility.

No functional module may communicate directly with an external AI provider.

## 3. General AI Architecture

The mandatory AI execution flow is:

```text
Calling Module
  -> AI Orchestration Service
  -> Capability Router
  -> Provider Adapter
  -> External AI Provider
  -> Normalized Response
  -> Audit + Versioning + Approval
  -> Calling Module
```

Examples of calling modules:

- Translation.
- Review.
- Terminology.
- Lexicographic Intelligence.
- Semantic Fidelity.
- Research.
- Layout and Publishing.
- Multimedia.
- Media Localization.
- Public Portal.
- Administration.
- Quality Agent.

Each module describes what capability it needs. The orchestration layer decides
which provider and model may satisfy the request.

## 4. AI Orchestration Service

The AI Orchestration Service is the only approved runtime boundary between the
platform and AI providers.

Responsibilities:

- Provider authentication.
- Provider selection.
- Model selection.
- Capability routing.
- Request normalization.
- Response normalization.
- Prompt lookup and prompt version resolution.
- Context assembly.
- Tenant-aware and role-aware access checks.
- Sensitive data filtering.
- Usage limits.
- Budget checks.
- Retry handling.
- Provider failover.
- Circuit breaker coordination.
- Cost estimation.
- Audit event creation.
- Metrics and traces.
- Background execution coordination.

Functional modules must not duplicate these responsibilities.

## 5. Capability Catalog

AI requests are expressed as platform capabilities, not provider-specific
methods.

Approved capability families:

- Text Generation.
- Translation.
- Proofreading.
- Terminology Validation.
- Semantic Analysis.
- Summarization.
- Classification.
- OCR.
- Image Generation.
- Image Editing.
- Illustration Assistance.
- Speech-to-Text.
- Text-to-Speech.
- Voice Cloning.
- Audio Enhancement.
- Video Generation.
- Video Editing.
- Metadata Extraction.
- Embedding Generation.
- Recommendation.
- Workflow Assistance.

The capability catalog is documented in
`docs/ai/capability-catalog.md`.

## 6. Provider Adapter Architecture

Providers are integrated only through adapters that implement the same public
contract.

Supported provider categories:

- OpenAI.
- Google AI.
- Anthropic.
- ElevenLabs.
- Azure AI.
- Ollama.
- Local providers.
- Future providers.

An adapter must expose:

- Provider identity.
- Supported capabilities.
- Supported models.
- Health status.
- Request normalization.
- Response normalization.
- Cost estimation metadata.
- Error normalization.
- Retry compatibility.
- Privacy and data handling metadata.

The provider registry is documented in
`docs/ai/provider-registry.md`.

## 7. Capability Router

The Capability Router selects the provider and model for each request.

Routing decisions may use:

- Requested capability.
- Source and target language.
- Content type.
- Project domain.
- Privacy policy.
- Provider availability.
- Model suitability.
- Cost.
- Latency.
- Subscription or quota limits.
- Organization policy.
- Human approval requirements.

Routing policies must be versioned and auditable.

## 8. Prompt Management

Prompts must be centralized and versioned.

No production prompt may be embedded directly inside a functional module.

Each prompt must store:

- Prompt ID.
- Version.
- Name.
- Author or owner.
- Description.
- Capability.
- Language.
- Input contract.
- Output contract.
- Status.
- Created date.
- Updated date.
- Approval metadata when required.

Prompt management is documented in
`docs/ai/prompt-management.md`.

## 9. Context Management

The AI Orchestration Service builds the execution context for AI requests.

Context may include:

- Organization.
- Workspace.
- Project.
- Manuscript.
- Document.
- Segment.
- Original Language.
- Authoring Language.
- Target Language.
- Platform Language.
- Glossary.
- Terminology.
- Translation Memory.
- Lexicographic evidence.
- Semantic Fidelity findings.
- Style guides.
- Rights and provenance metadata.
- User permissions.
- Need-to-Know scope.

Only the minimum necessary context may be sent to the provider.

## 10. Human in the Loop

AI may assist, recommend, explain, draft, summarize, classify, and validate.

AI must not:

- Approve editorial decisions automatically.
- Publish automatically.
- Grant rights.
- Bypass workflow gates.
- Modify security.
- Change governance.
- Replace authorized human responsibility.

The mandatory approval flow is:

```text
AI Result
  -> Human Review
  -> Authorized Approval or Rejection
  -> Versioned and Audited Platform State
```

Documented exceptions must be explicitly approved by the project owner.

## 11. Audit

Every AI execution must produce an audit record.

Required audit fields:

- Organization.
- User.
- Calling module.
- Capability.
- Provider.
- Model.
- Prompt ID.
- Prompt version.
- Routing policy version.
- Context references.
- Duration.
- Estimated cost.
- Actual cost when available.
- Result summary or result reference.
- Errors.
- Approval status.
- Timestamp.

Audit records must not leak secrets or restricted content.

## 12. Versioning

The following AI artifacts must be versioned:

- Prompts.
- Prompt input and output contracts.
- Routing policies.
- Provider configurations.
- AI result references.
- Approval records.
- Human overrides.

AI versioning is separate from editorial document versioning but must be
cross-referenceable from editorial audit records.

## 13. Security and Privacy

AI integration must respect:

- Authentication.
- Authorization.
- Tenant isolation.
- Need-to-Know access.
- Sensitive data filtering.
- Encrypted communications.
- Secure provider credentials.
- Configurable retention.
- Provider data-use policies.
- No secret logging.
- No unrestricted provider access from modules.

Sensitive data must not be sent to external providers unless an explicit
policy allows it.

Security and privacy requirements are documented in
`docs/ai/ai-security.md`.

## 14. Observability

AI execution must be observable across:

- Request count.
- Response time.
- Error rate.
- Retry count.
- Fallback events.
- Circuit breaker state.
- Queue depth.
- Cost.
- Usage by module.
- Usage by provider.
- Usage by capability.
- Usage by project.
- Usage by user.

Observability requirements are documented in
`docs/ai/ai-observability.md`.

## 15. Cost Management

AI cost management must support:

- Budgets.
- Quotas.
- Warning thresholds.
- Per-user tracking.
- Per-project tracking.
- Per-organization tracking.
- Provider-level tracking.
- Capability-level tracking.
- Agent-level tracking.

Reaching a limit must never delete data. It may block only the restricted AI
action until quota reset, budget override, or subscription upgrade.

## 16. Resilience

The AI orchestration layer must support:

- Timeouts.
- Controlled retries.
- Provider failover.
- Circuit breakers.
- Queues for background work.
- Idempotency where required.
- Safe degradation.
- Human-readable failure explanations.

Functional modules must handle AI unavailability without corrupting editorial
state.

## 17. Module Integration Rules

All AI-enabled modules must use the AI Orchestration Service.

Examples:

- Translation uses the Translation capability.
- Review uses Proofreading, Semantic Analysis, and Recommendation.
- Terminology uses Terminology Validation.
- Semantic Fidelity uses Semantic Analysis.
- Children's Books uses Illustration Assistance.
- Audio uses Text-to-Speech, Speech-to-Text, and Audio Enhancement.
- Video uses Video Generation, Video Editing, Speech-to-Text, Text-to-Speech,
  and subtitle-related capabilities.
- Magazine uses Summarization, Classification, Metadata Extraction, and
  Recommendation.
- Research uses Summarization, Classification, Embedding Generation, and
  Metadata Extraction.
- Quality Agent uses validation and readiness capabilities only.

Modules may consume normalized results but may not bind directly to provider
SDKs, provider model names, provider-specific errors, or provider-specific
response shapes.

## 18. Extensibility

Adding a new provider must require only:

1. Implementing a provider adapter.
2. Registering the provider.
3. Configuring supported capabilities and routing rules.
4. Adding security, cost, observability, and audit metadata.
5. Adding tests.

No functional module may require changes solely because a provider is added or
replaced.

## 19. AI Architecture Baseline Audit

Codex must perform an AI Architecture Baseline Audit.

Objectives:

1. Inventory all current AI integrations.
2. Identify direct provider calls.
3. Verify the presence or absence of an orchestration layer.
4. Inventory prompts.
5. Verify audit and versioning coverage.
6. Identify provider dependencies.
7. Propose a unified architecture and migration path.

Required deliverables:

- `docs/ai/ai-architecture.md`.
- `docs/ai/provider-registry.md`.
- `docs/ai/capability-catalog.md`.
- `docs/ai/prompt-management.md`.
- `docs/ai/ai-security.md`.
- `docs/ai/ai-observability.md`.
- `docs/ai/ai-gap-analysis.md`.
- `docs/ai/ai-migration-plan.md`.

## 20. Acceptance Criteria

The AI and integration architecture is compliant when:

- All AI calls pass through AI Orchestration.
- Providers are interchangeable through adapters.
- Capabilities are provider-independent.
- Prompts are centralized and versioned.
- AI results are audited and versioned.
- Costs and usage are monitored.
- Security and privacy policies are enforced.
- Human approval remains mandatory where required.
- Modules have no direct provider coupling.
- Provider changes do not require module rewrites.

## Mandatory Requirement for Codex

Treat this document as the official AI and integration architecture standard
for Laborator Editura.

Codex must inspect the current repository and identify all AI integrations,
provider dependencies, prompt locations, routing logic, security boundaries,
audit coverage, observability support, cost controls, and provider coupling.

Future AI capabilities must be provider-agnostic, auditable, versioned,
observable, secure, and extensible.

No module may depend directly on a specific AI provider.

Validated functionality from Phase 7 - Step 16 must be preserved.

## Recommended Next Architecture Document

After Chapter 7 is validated, the next recommended document is:

- Chapter 8 - Editorial Workflow and Process Engine Architecture.

Chapter 8 should define the official production workflow engine, editorial
states, transitions, approvals, task orchestration, workflow events,
cross-module process integration, and human approval gates.
