# Canonical API, Event and Integration Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 03:
Canonical API, Event and Integration.

It is a documentation and governance audit. It does not change runtime APIs,
events, webhooks, connectors, Docker, database schema, or UI behavior.

## Audit Date

2026-07-31.

## Baseline Inventory

| Area | Current count or evidence |
| --- | --- |
| API module folders | 36 module folders under `apps/api/src/modules` |
| API controllers | 36 `*.controller.ts` files under `apps/api/src` |
| Module API contract documents | 25 `docs/modules/*/api-contracts.md` files |
| Module event documents | 25 `docs/modules/*/events.md` files |
| Integration and backend API/event docs | 13 documents across `docs/integration`, `docs/backend`, `docs/frameworks/enterprise-integration`, and `docs/codex` |
| Canonical standards before Standard 03 | Standard 01 and Standard 02 |
| Canonical standards after Standard 03 | Standard 01, Standard 02, and Standard 03 |

## API Inventory Summary

Current controller namespaces include:

- Auth.
- Projects.
- Documents.
- Segments.
- Translations.
- Translation Memory.
- Terminology.
- QA.
- Semantic Fidelity.
- Workflow.
- Export.
- Author Studio.
- Rights and Provenance.
- Library.
- Research.
- Collaboration and Community.
- Public Portal and public read endpoints.
- Commerce.
- Layout Publishing.
- Multimedia Creation.
- Media Localization.
- Scheduling.
- Platform Engineering.
- AI Governance.
- Gateway.
- Observability.
- Security Governance.
- Backup Governance.
- Policy Engine.
- Enterprise Administration.
- Marketplace.
- Workspace.
- Launch Essentials.
- Health.

## Event Inventory Summary

Current event documentation covers:

- Project and document events.
- Translation events.
- Translation Memory events.
- Terminology events.
- Semantic Fidelity events.
- Workflow events.
- Publishing and distribution events.
- Audio, video, subtitle, and media localization events.
- Integration and webhook events.
- Security and governance events.
- AI execution and provider events.
- Module-specific events in 25 module documentation folders.

The current event layer is primarily documented and audit-oriented. A unified
runtime event bus, schema registry, consumer registry, and dead-letter runtime
are not yet implemented.

## Contract Validation

Current strengths:

- API contract standards already exist in `docs/integration/api-contracts.md`
  and `docs/backend/api-standards.md`.
- API Gateway metadata foundations exist.
- API key, scope, expiration, revocation, secret hashing, and audit metadata
  foundations exist.
- Event catalog documentation already exists.
- Webhook metadata and delivery log foundations exist.
- Observability and audit modules exist as runtime foundations.

Current gaps:

- OpenAPI specifications are not complete for every stable endpoint.
- Public URL versioning is documented but not uniformly implemented in route
  paths.
- API lifecycle states are not uniformly tracked per route.
- Contract compatibility matrices are not complete for all stable APIs.
- Event schema registry is not machine-readable.
- Webhook dispatch and inbound verification are not fully implemented.
- External provider adapters remain metadata-only or placeholder-only in many
  areas.

## Version Verification

Compliant baseline:

- Standard 01 requires Semantic Versioning for governed artifacts.
- Standard 02 requires schema evolution and traceability for canonical data.
- Integration documentation defines target API versioning with `/api/v1`.
- Gateway route registry metadata uses API version metadata in the current
  architecture.

Required improvements:

- Add explicit version metadata to every stable API contract.
- Add explicit event version metadata to every event contract.
- Add compatibility matrix entries for public and partner-facing contracts.
- Add deprecation policies for stable external contracts.

## Compatibility Assessment

Existing validated routes and event names must not be renamed or broken by
Standard 03. The safe path is:

1. Inventory current contracts.
2. Map current contracts to canonical names and versions.
3. Add aliases or compatibility mappings where names differ.
4. Introduce versioned public routes only through approved migration phases.
5. Preserve existing tests until compatibility coverage is added.

## Observability Review

Target Standard 03 observability requires:

- Request ID.
- Correlation ID.
- Trace ID when available.
- Metrics.
- Structured logs.
- Audit records for state-changing or governance-relevant actions.

Current observability foundations exist, but standard coverage must be
validated per route, event family, webhook, and external provider operation.

## Duplicate Contract Risks

Potential duplicate or overlapping definitions exist across:

- `docs/backend/api-standards.md`.
- `docs/integration/api-contracts.md`.
- `docs/frameworks/enterprise-integration/api-governance.md`.
- `docs/codex/api-contracts.md`.
- `docs/integration/event-catalog.md`.
- `docs/frameworks/enterprise-integration/event-governance.md`.
- `docs/codex/events.md`.
- Module-level `api-contracts.md` and `events.md`.

Standard 03 becomes the canonical owner for API, event, webhook, external
integration, and service contract rules. Existing documents remain local
applications, inventories, or baseline catalogs and must reference Standard
03 instead of creating conflicting rules.

## Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| API standards exist | Partially compliant | Canonical standard now added; OpenAPI coverage remains incremental |
| Event standards exist | Partially compliant | Catalogs exist; runtime registry not implemented |
| Contract versioning | Partially compliant | SemVer required; per-contract matrices incomplete |
| Webhook governance | Partially compliant | Metadata exists; runtime dispatch needs future phase |
| External integration governance | Partially compliant | Provider registry metadata exists; provider adapters future |
| Observability | Partially compliant | Foundations exist; route-level coverage audit needed |
| Security | Mostly compliant baseline | Server-derived identity rules exist; per-interface audit remains required |
| Documentation as code | Compliant baseline | Docs are present and now tied to Standard 03 |

## Immediate Standardization Priorities

1. Treat Standard 03 as canonical owner for interface rules.
2. Preserve existing validated route behavior.
3. Build an API inventory mapped to controller namespaces, owners, versions,
   authentication, permissions, response contracts, and audit effects.
4. Build an event registry mapped to event owner, version, payload schema,
   producer, consumer, retention, retry, and audit relationship.
5. Align webhook and external provider metadata with this standard.
6. Add OpenAPI and compatibility matrices incrementally for stable public and
   partner-facing APIs.

