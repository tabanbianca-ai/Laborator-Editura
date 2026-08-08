# TTS Providers

TTS providers are accessed through provider-neutral adapters.

Architecture:

Audio Production Service -> Canonical TTS Contract -> Provider Adapter -> TTS
Provider.

The canonical contract supports:

- `validateVoice`.
- `validateSSML`.
- `synthesizeSegment`.
- `queryJob`.
- `cancelJob`.

Provider-specific logic must not leak into editorial domain models. Supported
provider metadata includes Google, Azure, ElevenLabs, and other approved
providers.

