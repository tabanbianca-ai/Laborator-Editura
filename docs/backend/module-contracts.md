# Module Contracts

## Purpose

Module contracts define how backend modules communicate without exposing
private implementation details.

## Target Public Contract Types

Each module may expose:

- Commands.
- Queries.
- Events.
- DTOs.
- Ports.
- Read model contracts.

The module must not expose:

- Private persistence entities.
- Runtime database table access.
- Internal helper functions not intended for integration.
- Framework-specific implementation details.

## Current Baseline

The current backend primarily communicates through imported service classes and
shared TypeScript interfaces.

Examples:

- `TranslationsService` uses Segment, Lexicographic, Translation Memory,
  Terminology, QA, and Semantic Fidelity services.
- `WorkflowService` uses QA and Semantic Fidelity services for blocking
  rules.
- `LayoutPublishingService` uses Export, Library, Rights & Provenance, and
  Workflow services.
- `MediaLocalizationService` imports Translation, Lexicographic, Terminology,
  Semantic Fidelity, Layout Publishing, and Multimedia modules.
- Controllers import `CurrentActor` and `AuthenticatedRequestContext` from the
  Auth module.

This keeps behavior inside the modular monolith, but it is not yet a strict
public-contract model.

## Contract Boundary Rules

- A module may import another module only through its exported public provider
  or contract.
- Cross-module reads must use a query contract or read model.
- Cross-module writes must use a command contract.
- Cross-module notifications must use versioned events when asynchronous.
- Private repositories must not be imported by other modules.
- Table names owned by one module must not be used by another module except
  through an approved shared persistence component.

## Contract Documentation Template

Each contract must document:

- Contract name.
- Owner module.
- Type: command, query, event, DTO, port, or read model.
- Inputs.
- Outputs.
- Required actor context.
- Required permissions.
- Side effects.
- Errors.
- Version.
- Compatibility notes.

## Acceptance Criteria

- Module dependencies are visible and intentional.
- Public contracts are versioned when consumed outside the module.
- Internal domain objects are not used as external contracts.
- Contract tests cover cross-module behavior.
