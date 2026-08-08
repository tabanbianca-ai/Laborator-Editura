# Prompt Injection Protection

Retrieved documents and user-provided content must be treated as untrusted data.

Prompt injection protection must detect attempts to override system instructions, reveal secrets, bypass policy, ignore previous instructions, or execute unapproved tools.

Detected prompt injection blocks or quarantines the execution according to risk and policy.

Provider responses must be schema-validated before persistence when deterministic output is required.

