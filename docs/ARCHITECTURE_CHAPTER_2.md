# Laborator Editura Official Platform Architecture

Chapter 2 - Application Architecture.

Official architecture document.

Version: 1.0.

## 1. Purpose

This document defines the technical application architecture of the Laborator
Editura platform.

It establishes mandatory standards for organizing code, services, components,
and software infrastructure.

All implementations made within the project must follow this architecture.

## 2. Objectives

The application architecture must ensure:

- Modularity.
- Maintainability.
- Extensibility.
- Component reuse.
- Performance.
- Security.
- Testability.
- Observability.
- Module independence.
- Straightforward integration of new capabilities.

## 3. General Principles

The application must be built on the following principles:

- Separation of Concerns.
- Single Responsibility Principle.
- Dependency Injection.
- Composition over Inheritance.
- Convention over Configuration.
- API First.
- Security by Design.
- Localization First.
- Accessibility by Design.

These principles must be respected in all modules.

## 4. Project Structure

The platform uses a modular monorepository.

The canonical responsibility layout is:

```text
apps/
  public-web/
  editorial-app/
  api/
  workers/
packages/
  ui/
  auth/
  permissions/
  i18n/
  database/
  storage/
  notifications/
  ai/
  audit/
  observability/
  configuration/
  shared/
docs/
infrastructure/
scripts/
tests/
```

Current workspace names may map these responsibilities to approved existing
packages and applications. This chapter does not authorize disruptive renaming
or parallel duplicate structures.

Parallel structures must not be created without documented justification and
explicit architecture approval.

## 5. Frontend

The frontend must be organized around reusable components.

The following concerns must be clearly separated:

- Pages.
- Layouts.
- Components.
- Forms.
- Dialogs.
- Hooks.
- Services.
- Translations.
- Iconography.

Component duplication is not allowed.

User-facing text must come from the localization system. Components must not
introduce hardcoded labels, messages, menu text, button text, or notifications.

## 6. Backend

The backend must be organized by modules.

Each module contains, where applicable:

- Controller.
- Service.
- Domain.
- Repository.
- Validation.
- Events.
- DTOs.
- Tests.

Business logic is not allowed in controllers.

Controllers coordinate transport concerns and delegate domain behavior to
services.

## 7. API

The API is the only official access path to platform data.

It must support:

- Consistent endpoints.
- Input validation.
- Standardized responses.
- Versioning.
- Automated documentation where supported.
- Authentication.
- Authorization.
- Rate limiting.

The frontend must not access the database directly.

## 8. Module Structure

Each module must follow the same internal structure.

Recommended structure:

```text
module/
  controllers/
  services/
  domain/
  repositories/
  dto/
  validators/
  events/
  tests/
```

Existing modules may use an approved flat structure when it remains consistent,
typed, testable, and easy to evolve. New modules should converge toward the
standard structure unless the existing local pattern clearly favors a smaller
shape.

## 9. Application State Management

The following state categories must be separated:

- Interface state.
- Session state.
- Data state.
- Local cache.

Unnecessary dependencies between components must not be introduced.

State ownership must remain explicit and predictable.

## 10. Localization

The entire application uses the official i18n system.

Rules:

- No hardcoded user-facing text.
- No mixed-language interface.
- All messages come from translation files or the approved localization system.
- Changing the Platform Language must not require restarting the application.
- Platform Language must not change Original Language, Authoring Language,
  Target Language, manuscript content, or translation content.

## 11. Authentication

Authentication is shared by the entire platform.

The application uses:

- Secure sessions.
- Permission control.
- Role verification.
- Session expiration.
- Authentication logging.

The same authentication, session, role, and permission model serves the public
website, editorial application, and central API.

## 12. Authorization

Permissions are verified exclusively on the server.

The interface may hide visual elements, but effective access decisions are made
only by the backend.

Client-provided identity, role, permission, user, tenant, or organization data
must never be trusted for authorization.

## 13. Configuration

All configuration must be external to code.

The following are not allowed:

- Passwords in code.
- API keys in the repository.
- Hardcoded service URLs.
- Environment-specific configuration directly embedded in the application.

Configuration files and environment variables must be used.

Secrets must never be logged.

## 14. File Management

All files are managed through the storage service.

Functional modules must not access the filesystem directly except through
approved infrastructure abstractions.

Managed files include:

- Documents.
- Images.
- Audio.
- Video.
- Exports.
- Attachments.

## 15. AI Integration

All AI services are accessed through a shared integration layer.

No module may communicate directly with an AI provider.

The shared AI integration layer manages:

- Provider authentication.
- Model selection.
- Logging.
- Usage limits.
- Error handling.
- Provider switching without changing functional modules.

AI agents must respect authentication, authorization, audit, localization,
budget governance, and human final authority.

## 16. Observability

The application must record:

- Logs.
- Metrics.
- Response times.
- Errors.
- AI executions.
- Background processes.

Observability is separate from audit.

Observability explains how the system behaves. Audit proves who did what, when,
and to which resource.

## 17. Audit

All relevant actions must be audited.

Audit records include:

- User.
- Date and time.
- Action.
- Affected resource.
- Version.
- Result.

Audit trails must be tamper-resistant according to the capabilities of the
current persistence layer and must remain available for backup and restore.

## 18. Background Processing

Long-running operations must not execute inside the HTTP request lifecycle.

Examples:

- PDF generation.
- EPUB conversion.
- Audio processing.
- Video processing.
- AI analysis.
- Backup.
- Indexing.

These operations must run through dedicated background processing services.

## 19. Testing

The platform must include:

- Unit tests.
- Integration tests.
- End-to-end tests.
- API tests.
- Component tests.

New code without appropriate tests should not be accepted.

Test coverage must scale with risk, module boundaries, and user-facing impact.

## 20. Deployment

The platform must support:

- Automated build.
- Automated testing.
- Automated publishing where approved.
- Controlled rollback.

Deployment configuration must remain separate from business logic.

## 21. Performance

All components must be designed for:

- Low response time.
- Low memory usage.
- Reduced unnecessary requests.
- Resource reuse.

Performance optimization must preserve clarity, modularity, and
maintainability.

## 22. Security

The application must respect:

- Mandatory HTTPS in deployed environments.
- Encryption of sensitive data.
- Protection against common attacks.
- Validation of all inputs.
- Controlled file upload handling.
- Rate limiting.

Security applies to every module and must not be bypassed for convenience.

## 23. Implementation Conventions

All implementations must respect:

- English naming.
- Clear and documented code.
- Reuse of existing components.
- Avoidance of duplication.
- Modularity.
- Compatibility with the architecture documents.

Internal implementation language is English. User-facing text must be
localized.

## 24. Acceptance Criteria

An implementation is considered compliant only if it respects:

- `docs/MANIFEST.md`.
- `docs/DEVELOPMENT_CONVENTIONS.md`.
- `SPEC.md`, Chapter 0 - Fundamental Platform Principles.
- `docs/ARCHITECTURE_CHAPTER_1.md`.
- This document.
- `docs/ARCHITECTURE_CHAPTER_3.md`.
- `docs/ARCHITECTURE_CHAPTER_4.md`.
- `docs/ARCHITECTURE_CHAPTER_5.md`.
- `docs/ARCHITECTURE_CHAPTER_6.md`.
- `docs/ARCHITECTURE_CHAPTER_7.md`.
- `docs/ARCHITECTURE_CHAPTER_8.md`.
- `docs/ARCHITECTURE_CHAPTER_9.md`.
- `docs/ARCHITECTURE_CHAPTER_10.md`.
- `docs/ARCHITECTURE_CHAPTER_11.md`.
- `docs/ARCHITECTURE_CHAPTER_12.md`.
- `docs/ARCHITECTURE_CHAPTER_13.md`.

## Mandatory Requirement for Codex

Before implementing any new capability, Codex must verify that it:

1. Respects the architectural structure defined in this document.
2. Reuses existing components and services.
3. Does not introduce circular dependencies.
4. Does not duplicate functionality that already exists.
5. Is testable, extensible, and documented.

If multiple valid technical solutions exist, Codex must choose the one that
preserves modular architecture, reduces complexity, and supports long-term
platform evolution.

## Recommended Next Architecture Documents

Chapter 9 - Security, Identity, and Governance Architecture is now documented
in `docs/ARCHITECTURE_CHAPTER_9.md` and provides the official IAM, RBAC,
security policy, data classification, audit, and compliance standard.

Chapter 10 - Integration and Interoperability Architecture is now documented
in `docs/ARCHITECTURE_CHAPTER_10.md` and provides the official Integration
Gateway, adapter, API contract, event, webhook, and interoperability standard.

Chapter 11 - Frontend and Design System Architecture is now documented in
`docs/ARCHITECTURE_CHAPTER_11.md` and provides the official frontend,
Design System, i18n, accessibility, responsive, PWA, and frontend API client
standard.

Chapter 12 - Backend and Application Services Architecture is now documented
in `docs/ARCHITECTURE_CHAPTER_12.md` and provides the official backend,
application service, domain, contract, API, validation, transaction, eventing,
background job, cache, security, and observability standard.

Chapter 13 - DevOps, Infrastructure, Deployment, and Recovery Architecture is
now documented in `docs/ARCHITECTURE_CHAPTER_13.md` and provides the official
CI/CD, infrastructure, deployment, environment, secret management, backup,
disaster recovery, operational observability, release, and rollback standard.

After Chapter 13 is validated, the next recommended document is:

1. Chapter 14 - Quality Architecture and Testing Strategy: unit tests,
   integration tests, contract tests, end-to-end tests, performance tests,
   security tests, accessibility tests, release validation, and acceptance
   criteria.

Chapter 7 - Integrations and AI Agent Architecture is now documented in
`docs/ARCHITECTURE_CHAPTER_7.md` and provides the official AI orchestration
and provider integration standard.

Chapter 8 - Workflow Engine and Editorial Process Architecture is now
documented in `docs/ARCHITECTURE_CHAPTER_8.md` and provides the official
workflow and process coordination standard.
