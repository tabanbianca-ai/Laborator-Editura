# Editorial Profiles

Editorial profiles are configurable rule bundles, not independent engines.

## Supported Profiles

- `GENERAL_ROMANIAN`
- `LITERARY`
- `ACADEMIC`
- `CHILDREN`
- `SPIRITIST`
- `KARDECIAN`
- `CUSTOM`

## Profile Capabilities

Profiles may define:

- terminology;
- stylistic level;
- active rules;
- mandatory rules;
- repetition tolerance;
- capitalization conventions;
- quote conventions;
- punctuation conventions;
- specialized terms.

## Rules

- Project-specific terms belong to the profile or terminology registry, not hardcoded code paths.
- Profiles may affect checks and suggestions, but do not bypass human final authority.
- Profile changes must be audited when runtime support is added.
