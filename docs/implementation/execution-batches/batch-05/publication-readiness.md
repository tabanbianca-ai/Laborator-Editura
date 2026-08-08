# Publication Readiness

Publication readiness is derived, not a manually edited boolean.

Statuses:

- `NOT_READY`
- `MISSING_METADATA`
- `MISSING_RIGHTS`
- `MISSING_PROVENANCE`
- `MISSING_ACCESSIBILITY`
- `MISSING_APPROVAL`
- `READY_FOR_PUBLICATION`
- `BLOCKED`

Inputs:

- Required metadata completeness.
- Rights validation and restrictions.
- Provenance validation.
- Accessibility metadata.
- Human editorial approval.
- Explicit blockers.

Rules:

- Public resources cannot bypass rights verification.
- `VALIDATED` or `VALIDATED_WITH_RESTRICTIONS` rights are required for public publication.
- Restrictions must be evaluated before public actions.
- Public-domain status must be verified before readiness can rely on it.
