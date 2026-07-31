# Canonical Naming and Versioning Compliance Audit

## Document Control

- Title: Canonical Naming and Versioning Compliance Audit.
- Identifier: STANDARD-01-COMPLIANCE-AUDIT.
- Version: 1.0.0.
- Status: Active specification.
- Owner: Platform Architecture.
- Reviewers: Engineering Governance, Documentation Governance, Data
  Governance, Quality Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/standards/naming-versioning/overview.md`.
- References: `docs/standards/naming-versioning/migration-plan.md`,
  `docs/frameworks/quality-governance/compliance-audit.md`.
- Change history:
  - 1.0.0: Initial baseline audit.

## Purpose

This document records the Canonical Naming and Versioning Baseline Audit
required by Standard 01.

## Audit Objectives

The baseline audit evaluates:

1. Artifact inventory.
2. Naming convention compliance.
3. UUID coverage.
4. Version coverage.
5. Metadata coverage.
6. Duplicate names.
7. Artifacts without versioning.
8. Standardization plan.

## Inventory Summary

Inventory method:

- Documentation inventory was produced from `find docs -type f`.
- API module inventory was produced from `find apps/api/src/modules -mindepth
  1 -maxdepth 1 -type d`.
- Web component inventory was produced from `find apps/web/components -type f`.
- Web route inventory was produced from `find apps/web/app -type f`.
- Database migration inventory was produced from `find packages/db/migrations
  -type f`.

Baseline counts after Standard 01 registration:

| Artifact Area | Count |
| --- | ---: |
| Documentation files under `docs` | 547 |
| Documented module areas under `docs/modules` | 25 |
| Framework areas under `docs/frameworks` | 8 |
| Canonical standard areas under `docs/standards` | 1 |
| API runtime module folders | 36 |
| Web component source files | 62 |
| Web route source files | 57 |
| Database migration files | 9 |
| Workspace packages | 2 |
| Applications | 3 |

## Naming Validation

Current strengths:

- Documentation paths generally use lowercase kebab-case.
- API module folders generally use lowercase kebab-case.
- Database migration files are isolated under the database package.
- TypeScript code generally uses established TypeScript naming patterns.
- Documentation and implementation-facing artifacts are predominantly in
  English.

Current gaps:

- Not every artifact has an explicit canonical name separate from its path or
  class name.
- Some existing runtime and documentation names predate this standard.
- Existing API paths may not all use explicit `/api/v1` public versioning.
- Existing validated plural database table names may differ from future
  singular table naming standards and must be preserved unless migrated.

## UUID Coverage

Current assessment: Partial.

Findings:

- Runtime data records may use identifiers according to existing module
  behavior.
- Documentation, module, framework, AI, prompt, event, and configuration
  artifacts do not yet consistently include UUID metadata.
- Standard 01 introduces UUID metadata as a governance requirement for
  canonical records, but does not authorize automatic backfill by itself.

## Version Coverage

Current assessment: Partial to Managed.

Findings:

- Packages and some schemas have version-related metadata.
- Documentation versions are present in newer framework and standard docs.
- Older documents do not consistently use Semantic Versioning.
- API, prompt, AI model profile, event, and configuration versioning require
  incremental standardization.

## Metadata Compliance

Current assessment: Partial.

Findings:

- Newer framework documents include document control metadata.
- Older documents may not include owner, reviewers, approval, dependencies,
  references, and change history.
- Runtime artifacts may not expose required governance metadata consistently.

## Duplication Analysis

Known duplication risks:

- Similar module names between documentation modules and runtime modules.
- Repeated governance concepts across `SPEC.md`, `AGENTS.md`, `ROADMAP.md`,
  frameworks, and module docs.
- Multiple quality, security, AI, and documentation terms repeated across
  different governance layers.

Required action:

- Preserve existing paths.
- Assign canonical artifact names.
- Add cross-references instead of redefining concepts.
- Record aliases and deprecated names when names are consolidated.

## Lifecycle Review

Current assessment: Initial to Managed.

Findings:

- Newer documents define status metadata.
- Release and readiness documents preserve lifecycle evidence.
- A single lifecycle state model is not yet applied uniformly to all artifact
  families.

## Gap Assessment

Priority gaps:

- Canonical artifact registry not yet implemented.
- UUID metadata not consistently present.
- Semantic Versioning not consistently present across all artifact families.
- Metadata standard not yet applied to older documents and runtime artifacts.
- API versioning policy needs compatibility mapping for existing endpoints.
- Event naming and event versioning need a canonical registry.
- AI prompt and model profile versioning need complete registry coverage.

## Compliance Rating

Current baseline rating: Partially compliant.

Rationale:

- Naming patterns are mostly disciplined.
- Versioning exists in parts of the repository.
- New standards now define the missing canonical rules.
- Full compliance requires incremental metadata normalization, registry
  creation, and non-disruptive migration.
