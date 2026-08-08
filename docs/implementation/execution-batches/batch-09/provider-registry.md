# Provider Registry

The Provider Registry records provider metadata, supported models, data processing terms, region, retention policy, availability status, rate limits, currency, and owner.

Provider credentials are secret references only.

Fallback is allowed only to explicitly approved compatible providers. No fallback is allowed when data policy, rights, language, modality, or kill switch state disallows the target provider.

Every provider change, fallback activation, and recovery must be audited.

