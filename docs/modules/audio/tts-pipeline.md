# Text-to-Speech Pipeline

## Purpose

The TTS Pipeline defines how authoritative text is transformed into draft or
official audio through provider-independent orchestration.

TTS execution must pass through AI Orchestration. Functional modules must not
call TTS providers directly.

## Pipeline

```text
Library Text
  -> Text Normalization
  -> Pronunciation Resolution
  -> SSML Generation
  -> Voice Profile
  -> AI Orchestration
  -> TTS Provider Adapter
  -> Audio Asset
  -> Validation
  -> Synchronization
```

## Pipeline Stages

### Text Normalization

Normalizes:

- Chapter headings.
- Footnotes.
- Abbreviations.
- Numbers.
- Dates.
- Special symbols.
- Quotes.
- Language-specific punctuation.

### Pronunciation Resolution

Uses:

- Project pronunciation dictionary.
- Voice profile pronunciation dictionary.
- Language rules.
- Terminology and lexicographic evidence.
- Human-approved overrides.

### SSML Generation

SSML should include:

- Pauses.
- Emphasis.
- Pronunciation hints.
- Paragraph boundaries.
- Section boundaries.
- Voice switching when multi-voice narration is enabled.

### Provider Execution

Provider execution must be routed through:

- AI Orchestration.
- Model Router.
- Provider Adapter.
- AI Governance cost checks.
- Observability.
- Audit.

## Current Repository Baseline

Current foundations:

- AI Architecture documents provider-independent AI orchestration.
- AI Governance models OpenAI primary and Anthropic fallback metadata.
- Multimedia Creation stores `providerIntegrationStatus: "PLACEHOLDER_ONLY"`.
- Audio Agent governance includes preview narration support and voice profile
  suggestions.

Missing runtime elements:

- No TTS provider adapter.
- No text normalization pipeline.
- No SSML generator.
- No pronunciation dictionary runtime.
- No TTS run record.
- No TTS cost and token/unit usage linked to audio generation.

## Output Rules

TTS output must:

- Create a new audio asset version.
- Preserve source text version.
- Preserve voice profile version.
- Preserve provider and model metadata.
- Preserve estimated cost.
- Preserve generation duration.
- Preserve validation status.
- Preserve audit record references.

## Preview and Official Generation

Preview generation:

- Can use draft text.
- Must be clearly marked draft-only.
- Must not be published.

Official generation:

- Requires approved text.
- Requires voice rights.
- Requires publication rights.
- Requires workflow approval.
- Must be published only through Publishing.

