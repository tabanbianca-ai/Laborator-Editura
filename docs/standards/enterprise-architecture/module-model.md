# Canonical Module Model

## Purpose

The module model defines the required architecture metadata for every module,
service, AI agent, UI module, integration component, and shared component.

## Required Module Fields

Each module must define:

- `uuid`.
- `canonicalIdentifier`.
- `moduleName`.
- `moduleType`.
- `owner`.
- `dependencies`.
- `publicInterfaces`.
- `internalInterfaces`.
- `eventsPublished`.
- `eventsConsumed`.
- `dataOwned`.
- `lifecycle`.
- `version`.
- `status`.
- `auditInformation`.

## Module Types

Canonical module types are:

- `CORE_MODULE`.
- `BUSINESS_MODULE`.
- `EDITORIAL_MODULE`.
- `AI_MODULE`.
- `INFRASTRUCTURE_MODULE`.
- `INTEGRATION_MODULE`.
- `UI_MODULE`.
- `ANALYTICS_MODULE`.
- `SHARED_MODULE`.

## Module Lifecycle

Allowed lifecycle states follow Codex governance:

- `PROPOSED`.
- `DRAFT`.
- `UNDER_REVIEW`.
- `VALIDATED`.
- `APPROVED`.
- `IMPLEMENTED`.
- `OPERATIONAL`.
- `DEPRECATED`.
- `ARCHIVED`.

## Module Compliance Rules

A module is compliant when:

- It follows the canonical module model.
- Its owner is explicit.
- Its dependencies are explicit.
- It introduces no circular dependencies.
- It uses only approved contracts.
- It owns and modifies only its own data.
- It exposes public interfaces through documented contracts.
- It is documented, versioned, testable, and auditable.

## Module Boundary Rules

- Controllers must not own business logic.
- Repositories must be the only module components responsible for data access.
- Modules must not access another module's database tables directly unless an
  approved read model or repository contract exists.
- Copy-paste reuse is prohibited when a shared module, service, package, or
  documented contract is the correct mechanism.
- Shared services must remain shared and must not be duplicated.

