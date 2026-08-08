# Prompt Registry

The Prompt Registry stores versioned prompt definitions, purpose, system instruction reference, input schema, output schema, supported models, language policy, constraints, evaluation profile, risk level, status, and version.

No production AI operation may use unversioned prompt strings.

Prompt output should be structured and schema-validated when deterministic behavior is required.

Malformed structured output is not persisted as canonical data.

