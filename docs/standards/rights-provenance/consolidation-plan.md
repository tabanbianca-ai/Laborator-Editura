# Canonical Rights, Licensing and Provenance Consolidation Plan

## Purpose

This plan defines a safe, incremental path for aligning works, assets,
contracts, licenses, permissions, provenance, derivative assets, AI content,
media, voice rights, publication gates, and audit with Standard 13.

It is a documentation and governance plan. It does not authorize runtime
behavior changes by itself.

## Consolidation Principles

- Preserve all existing records, identifiers, files, versions, approvals, and
  audit history.
- Do not perform destructive consolidation during baseline audit.
- Map duplicates and conflicts before proposing canonical records.
- Do not infer rights from ambiguous evidence.
- Block publication by default when rights are unclear.
- Keep rights centralized; no module may create an independent rights system.
- Keep AI advisory.
- Keep Human Final Authority.

## Phase 1 - Activate Standard 13

Actions:

1. Adopt `docs/standards/rights-provenance/overview.md` as the canonical
   rights, licensing, and provenance entry point.
2. Reference Standard 13 from `SPEC.md`, `ROADMAP.md`, `AGENTS.md`, the
   Manifest, and Codex canonical catalogs.
3. Treat current Rights and Provenance, Library, Publishing, Data Governance,
   AI Governance, Workflow, and Compliance documents as local operational
   guidance.
4. Require future rights work to cite Standard 13.

Exit criteria:

- Standard 13 is referenced by central governance documents.
- No runtime changes are required.

## Phase 2 - Inventory

Actions:

1. Inventory works and assets.
2. Identify resources without provenance.
3. Inventory contracts, licenses, permissions, and consent records.
4. Verify rights holders.
5. Evaluate language, territory, format, and channel rights.
6. Identify expired, incomplete, revoked, or ambiguous rights.
7. Verify public-domain declarations.
8. Evaluate translation rights.
9. Verify images, voices, and AI-generated resources.
10. Identify derived assets without source linkage.
11. Verify publication blocking behavior.

Exit criteria:

- Rights inventory, provenance map, contract/license register, public-domain
  assessment, derived-asset map, duplication analysis, and risk register
  exist.

## Phase 3 - Canonical Rights Model

Actions:

1. Map existing translation and publishing authorizations to canonical
   `RightsRecord` concepts.
2. Design first-class rights holder registry.
3. Design generalized rights type mapping.
4. Design versioned license and contract lifecycle records.
5. Design unified restrictions.

Exit criteria:

- Canonical model is ready for an approved implementation phase.

## Phase 4 - Publication Gate Alignment

Actions:

1. Map publishing and distribution warnings to the canonical rights gate.
2. Define reusable rights verification contract.
3. Define expiration and revocation checks.
4. Define withdrawal and impacted-publication review.
5. Link gate results to Workflow, Publishing, Distribution, and Quality.

Exit criteria:

- Publication gate requirements are implementation-ready without changing
  current behavior.

## Phase 5 - Controlled Implementation

Actions require separate implementation approval:

1. Add canonical rights record persistence.
2. Add rights holder registry.
3. Add versioned contract/license lifecycle.
4. Add reusable rights verification service.
5. Add expiration and revocation jobs.
6. Add derivative asset inheritance checks.
7. Add AI content rights metadata enforcement.
8. Add publication gate enforcement where missing.

Exit criteria:

- Runtime changes are implemented through approved scoped phases with tests
  and migration evidence.

## Non-Goals

This plan does not authorize:

- Deleting rights records.
- Legal ERP implementation.
- Digital signature provider integration.
- Billing, invoicing, or royalty implementation.
- Database migrations.
- API changes.
- UI changes.
- Docker or staging changes.

