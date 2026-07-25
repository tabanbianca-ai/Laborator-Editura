# Laborator Editura Official Platform Architecture

Chapter 3 - Module Architecture.

Official architecture document.

Version: 1.0.

## 1. Purpose

This document defines the standard architecture that all Laborator Editura
platform modules must follow.

No module may use a different structure without a documented and approved
architecture decision.

## 2. Objectives

All modules must be:

- Independent.
- Reusable.
- Extensible.
- Testable.
- Documented.
- Secure.
- Localizable.
- Auditable.

## 3. Modularity Principle

A module is an autonomous functional component.

Each module must have:

- Clear responsibility.
- Well-defined boundaries.
- Public interfaces.
- Its own services.
- Its own rules.
- Its own tests.
- Its own documentation.

## 4. Standard Structure

Each module must be organized according to the following structure:

```text
module-name/
  controllers/
  services/
  domain/
  repositories/
  dto/
  validators/
  events/
  permissions/
  localization/
  tests/
  documentation/
  index
```

Similar modules must not use different structures.

Existing modules that predate this document must not be used as precedent for
new inconsistency. They should converge toward this structure when safely
refactored, unless an approved Architecture Decision Record defines an
exception.

## 5. Controller

The controller:

- Receives requests.
- Validates input at the transport boundary.
- Verifies authentication.
- Verifies authorization.
- Calls services.
- Returns the response.

The controller must not contain business logic.

## 6. Service

The service implements functional logic.

Examples:

- Create.
- Update.
- Delete.
- Approve.
- Publish.
- Import.
- Export.

Services coordinate domain rules, repositories, events, audit, and integration
services.

## 7. Domain

The domain layer contains domain-specific rules.

Examples:

- Editorial validations.
- Publishing rules.
- Translation rules.
- Rights rules.

Domain rules must be isolated from transport concerns and direct infrastructure
concerns.

## 8. Repository

The repository is the only component responsible for data access inside a
module.

Direct database access is not allowed from:

- Controllers.
- UI components.
- AI services.

Repositories must preserve tenant isolation, permissions boundaries, and
runtime persistence contracts.

## 9. DTO

All data exchanged between modules must be transported through well-defined and
typed DTOs.

DTOs must not leak internal persistence details unless explicitly designed as a
public contract.

## 10. Validation

Each module must implement validation for:

- Input data.
- Functional rules.
- Security rules.
- Relationship integrity.

Validation must occur on the server. Client-side validation may improve user
experience, but it does not replace server-side validation.

## 11. Events

Modules emit events when important changes occur.

Examples:

- `ProjectCreated`.
- `TranslationCompleted`.
- `PublicationApproved`.

Other modules react through standardized mechanisms without direct
dependencies.

Events must be typed, auditable when relevant, and documented.

## 12. Permissions

Each module defines its own permissions.

Module permissions integrate with the central RBAC and Need-to-Know access
systems and must be verified exclusively on the server.

UI visibility is not authorization.

## 13. Localization

User-facing text displayed by a module must come exclusively from the official
i18n system.

Hardcoded user-facing text is not allowed.

Module-specific terminology must use the platform terminology dictionary and
must respect the active Platform Language.

## 14. Audit

Important actions must be recorded automatically.

Audit records must include:

- Who acted.
- When the action occurred.
- What happened.
- Which resource was affected.
- The result.

Audit must use the shared platform audit infrastructure.

## 15. Versioning

If a module manages editorial content, it must support:

- Versions.
- Comparison.
- Restoration.
- Complete history.

Historical versions must not be destroyed by ordinary updates.

## 16. AI Integration

Modules must not communicate directly with AI providers.

All AI requests must go through the central AI orchestration service.

AI results:

- Are audited.
- Are versioned when they affect editorial artifacts.
- Respect the user's permissions.
- May require authorized human approval.

AI must not bypass workflow, rights, security, audit, or human final authority.

## 17. Testing

Each module must include:

- Unit tests.
- Integration tests.
- API tests.
- Permission tests.
- Event tests.

Tests must cover successful behavior, failure behavior, authorization, tenant
isolation where applicable, audit events, and important integration contracts.

## 18. Documentation

Each module must document:

- Purpose.
- Responsibilities.
- Dependencies.
- Emitted events.
- Consumed events.
- Permissions.
- Public API.
- Usage examples.

Documentation must remain consistent with `SPEC.md`, `AGENTS.md`, `ROADMAP.md`,
and the architecture chapters.

## 19. Prohibitions

A module must not:

- Directly access another module's database tables.
- Modify another module's data without that module's public services.
- Reuse code by copying it.
- Implement its own authentication system.
- Implement its own permission system.
- Implement its own localization system.
- Implement its own audit system.

These services are shared platform services.

## 20. Mandatory Module Template

All modules, including Library, Translation, Magazine, Audio, Video, Calendar,
and future modules, must follow the same architectural model.

This guarantees:

- Code consistency.
- Simplified maintenance.
- Component reuse.
- Uniform testing.
- Predictable development.

## 21. Initial Module List

The architecture must support implementation of the following modules without
changing the base structure:

- Identity & Access.
- Users.
- Library.
- Workspaces.
- Work Table.
- Translation.
- Proofreading.
- Magazine.
- Children's Books.
- Audio.
- Video.
- Publishing.
- Rights & Provenance.
- Calendar.
- Notifications.
- Administration.
- Audit.
- Observability.
- Backup & Recovery.
- Configuration.

## 22. Acceptance Criteria

A module is considered compliant if it:

- Respects the standard architecture.
- Uses the shared platform services.
- Is fully localizable.
- Respects the authentication and authorization systems.
- Is auditable.
- Is tested.
- Is documented.
- Does not introduce circular dependencies.
- Can be extended without changing the general architecture.

## Mandatory Requirement for Codex

Before implementing a new module, Codex must:

1. Check whether a reusable service already exists in the platform.
2. Follow the standard structure defined in this document.
3. Integrate the module with existing authentication, authorization,
   localization, audit, and observability.
4. Document the module's API and public events.
5. Deliver the appropriate tests.

Any deviation from this architecture must be justified through an approved
Architecture Decision Record before implementation.

## Recommended Next Architecture Document

The next architecture document should be:

- Chapter 4 - Conceptual Data Model.

Chapter 4 should define the main entities, such as User, Project, Manuscript,
Publication, Translation, Version, Rights, and AI Agent, and the relationships
between them without entering physical database design.

This model will serve as the foundation for database schema design and module
implementation.
