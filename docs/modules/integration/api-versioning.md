# API Versioning

## Purpose

API versioning preserves backward compatibility while allowing platform APIs,
webhooks, events, and connectors to evolve safely.

## Supported Strategies

The target architecture supports:

- URI versioning.
- Header versioning.
- Semantic versioning.
- Backward compatibility windows.
- Deprecation policy.
- Contract migration notices.

## Current Repository Baseline

Current state:

- Gateway route registry metadata stores `apiVersion: "v1"`.
- Existing controller paths are mostly unversioned from the URL perspective.
- Documentation recommends `/api/v1/{resource}` for stable public APIs.
- Contract tests exist for many module endpoints.

## Versioning Rules

- Stable public and partner APIs must be versioned.
- Internal APIs may remain module-scoped but must have documented contracts.
- Breaking changes require a new version.
- Deprecated versions must remain available during the compatibility window.
- Webhook and event payloads must include event version.
- Documentation, route registry metadata, tests, and OpenAPI or equivalent
  descriptions must align.

## Deprecation Policy

Deprecation metadata should include:

- Deprecated version.
- Replacement version.
- Deprecation date.
- Removal date.
- Migration notes.
- Affected consumers.
- Compatibility tests.
- Owner.

## Current Gaps

- Route metadata is versioned, but URL paths are not globally versioned.
- No central API definition entity exists yet.
- No public API deprecation workflow exists.
- No generated API documentation pipeline exists.
