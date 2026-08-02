# Canonical Dependency Model

## Purpose

The dependency model defines how technical, functional, data, API, event,
workflow, AI, infrastructure, and UI dependencies are declared, governed, and
audited.

## Dependency Requirements

Every dependency must be:

- Explicit.
- Documented.
- Versioned.
- Audited.
- Justified.

## Prohibited Dependency Patterns

The following are prohibited:

- Circular dependencies.
- Direct access to another module's database ownership boundary.
- Use of internal APIs without contract.
- Code reuse by copying.
- Hidden runtime dependencies.
- Undocumented service calls.
- Unversioned integration contracts.

## Dependency Types

Canonical dependency types are:

- `MODULE_DEPENDENCY`.
- `API_DEPENDENCY`.
- `EVENT_DEPENDENCY`.
- `DATA_DEPENDENCY`.
- `WORKFLOW_DEPENDENCY`.
- `AI_DEPENDENCY`.
- `INFRASTRUCTURE_DEPENDENCY`.
- `UI_DEPENDENCY`.
- `SECURITY_DEPENDENCY`.
- `COMPLIANCE_DEPENDENCY`.

## Dependency Record

Each dependency should preserve:

- Dependency ID.
- Provider.
- Consumer.
- Dependency type.
- Contract reference.
- Version.
- Direction.
- Justification.
- Compatibility policy.
- Deprecation policy.
- Risk.
- Owner.
- Audit information.

## Dependency Governance Rules

- Dependency changes require impact analysis.
- Dependencies across ownership boundaries require approved contracts.
- Shared dependency upgrades require compatibility review.
- Dependency cycles must be rejected or recorded as approved temporary
  exceptions with remediation plan.
- AI agents may identify dependencies and risks but must not approve
  dependency exceptions.

