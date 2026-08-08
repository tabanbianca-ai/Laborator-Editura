# Narrator Registry

Every narrator or voice is registered as a `NarratorProfile`.

Supported narrator types:

- `HUMAN`.
- `SYNTHETIC`.
- `CLONED_VOICE`.

Cloned voices require:

- `voiceCloningAllowed = true`.
- `consentVerified = true`.
- active status.
- applicable usage rights.

Missing consent is a blocking condition. AI agents must not infer or assume
voice consent.

