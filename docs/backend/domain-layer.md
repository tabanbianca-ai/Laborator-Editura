# Domain Layer

## Purpose

The domain layer owns editorial business meaning. It must remain independent
from NestJS, HTTP, persistence, provider SDKs, filesystem implementations, and
external services.

## Target Contents

Each mature module should define:

- Aggregates.
- Entities.
- Value objects.
- Domain policies.
- Domain services.
- Domain events.
- Invariants.
- Error types for domain rule violations.

## Domain Independence Rules

Domain code must not import:

- `@nestjs/*`.
- Runtime database implementations.
- HTTP clients.
- Provider clients.
- Filesystem APIs.
- Environment configuration loaders.

Domain code may define interfaces or ports that outer layers implement.

## Current Baseline

The repository currently stores most domain shapes in module `*.types.ts`
files and most business decisions in `*.service.ts` files.

Examples:

- Terminology statuses and governance rules are typed in
  `terminology.types.ts` and helper utilities.
- Workflow statuses and transition rules are typed in `workflow.types.ts` and
  enforced in `workflow.service.ts`.
- Publishing states and final preflight data are typed in
  `layout-publishing.types.ts` and coordinated by
  `LayoutPublishingService`.
- Library lifecycle statuses and publication records are typed in
  `library.types.ts` and coordinated by `LibraryService`.

This establishes strong typed contracts but does not yet separate domain
objects from application orchestration.

## Required Migration Direction

Future migration should:

1. Extract pure domain policies first.
2. Move invariant checks into framework-independent functions or domain
   classes.
3. Keep service behavior stable while introducing domain objects.
4. Preserve public API responses.
5. Add unit tests for domain rules before moving code.

## Domain Rule Examples

- Validated terminology has priority over Translation Memory and AI
  suggestions.
- AI may recommend but cannot approve.
- Official published editions are immutable.
- Critical preflight errors block publication.
- Need-to-Know restrictions must not be bypassed by module-specific logic.
- Original language is immutable unless changed by an authorized user.

## Acceptance Criteria

- Domain rules can be tested without NestJS.
- Domain rules are not duplicated in controllers.
- Repositories do not contain domain decisions.
- Domain events describe facts in past tense.
- Domain code remains reusable if a module is extracted later.
