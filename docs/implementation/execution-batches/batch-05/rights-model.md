# Rights Model

The rights record evaluates rights by exact language, territory, format, channel, commercial use,
AI processing permission, and validity period. The platform must never infer broad rights from a generic
authorization.

Canonical fields:

- `rights_record_id`
- `organization_id`
- `resource_type`
- `resource_id`
- `rights_holder_id`
- `rights_type`
- `authorization_basis`
- `languages`
- `territories`
- `formats`
- `distribution_channels`
- `commercial_use`
- `adaptation_allowed`
- `ai_processing_allowed`
- `valid_from`
- `valid_until`
- `restrictions`
- `verification_status`
- `verified_by`
- `verified_at`
- `evidence`

Statuses:

- `DRAFT`
- `UNDER_REVIEW`
- `INFORMATION_MISSING`
- `VALIDATED`
- `VALIDATED_WITH_RESTRICTIONS`
- `EXPIRED`
- `REVOKED`
- `REJECTED`
- `ARCHIVED`

Rules:

- Public publication requires `VALIDATED` or `VALIDATED_WITH_RESTRICTIONS` after restriction evaluation.
- Missing or ambiguous rights block public publication.
- AI usage requires `ai_processing_allowed`.
- Rights are evaluated separately for language, territory, format, distribution channel, commercial use, and validity.
