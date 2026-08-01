# Canonical Localization Consolidation Plan

## Purpose

This plan defines a safe, incremental path for aligning internationalization,
localization, terminology, regional formatting, multimedia localization, and
localized user messages with Standard 11.

It is a documentation and governance plan. It does not authorize runtime
behavior changes by itself.

## Migration Principles

- Preserve existing translations and history.
- Do not delete or overwrite conflicting variants silently.
- Preserve provenance, approvals, and dependencies.
- Keep technical implementation in English.
- Keep user-facing text externalized.
- Keep web, PWA, tablet, and future mobile resources aligned.
- Keep AI advisory.
- Preserve accessibility and regional formatting.
- Audit all terminology and localization governance actions.

## Phase 1 - Activate Standard 11

Actions:

1. Adopt `docs/standards/localization/overview.md` as the canonical
   internationalization, localization, and terminology entry point.
2. Reference Standard 11 from `SPEC.md`, `ROADMAP.md`, `AGENTS.md`, the
   Manifest, and Codex canonical catalogs.
3. Treat current UI Governance, Accessibility, Configuration Localization,
   Language Policy, and Terminology documents as local operational guidance.
4. Require future localization work to cite Standard 11.

Exit criteria:

- Standard 11 is referenced by central governance documents.
- No runtime changes are required.

## Phase 2 - Resource Inventory

Actions:

1. Inventory user-facing strings in frontend applications.
2. Inventory backend-generated user messages.
3. Inventory notification templates.
4. Inventory document generators.
5. Inventory multimedia localization assets.
6. Inventory current localization keys and language coverage.

Exit criteria:

- Resource inventory classifies hardcoded strings, localized strings, keys,
  error messages, media text, and metadata.

## Phase 3 - Canonical Resource Layout

Actions:

1. Design the canonical `locales/{language}/{namespace}.json` resource
   layout.
2. Map current inline resources to canonical namespaces.
3. Preserve current keys and values during migration.
4. Identify duplicate, divergent, missing, unused, or ambiguous keys.
5. Define compatibility rules for published keys.

Exit criteria:

- A migration-ready map exists from current resources to canonical files.

## Phase 4 - Terminology Catalog

Actions:

1. Inventory platform-specific UI terms.
2. Compare general UI terms against authoritative localized terminology
   sources.
3. Create terminology records only for specialized or ambiguous platform
   terms.
4. Mark conflicts for human review.
5. Link terminology records to localization keys.

Exit criteria:

- Interface terminology catalog exists with status, source, version, owner,
  and approval history.

## Phase 5 - Regional and Accessibility Validation

Actions:

1. Validate date, time, number, currency, unit, pluralization, sorting, and
   text direction behavior.
2. Validate mobile and tablet text length.
3. Validate accessibility text, labels, and assistive technology output.
4. Validate images and multimedia text localization.
5. Add release-gate mappings under Standard 10.

Exit criteria:

- Regional and accessibility localization checks are documented and mapped to
  release gates.

## Phase 6 - Controlled Implementation

Actions require separate implementation approval:

1. Move or generate canonical resource files.
2. Add missing-key and unused-key checks.
3. Add mixed-language scans.
4. Add backend error localization mapping.
5. Add localization audit events.
6. Add CI localization validation when approved.

Exit criteria:

- Runtime changes are implemented only through approved scoped phases.

## Non-Goals

This plan does not authorize:

- Deleting existing translations.
- Replacing current runtime localization behavior immediately.
- Database migrations.
- API changes.
- UI redesign.
- Docker or staging changes.

