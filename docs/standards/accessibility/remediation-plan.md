# Canonical Accessibility Remediation Plan

## Purpose

This plan defines a safe, incremental path for aligning interfaces,
components, documents, publications, media, profiles, validation, and audit
with Standard 12.

It is a documentation and governance plan. It does not authorize runtime
behavior changes by itself.

## Remediation Principles

- Preserve existing functionality.
- Preserve history, approvals, localization resources, and accessibility
  evidence.
- Do not delete validated behavior during baseline audit.
- Fix accessibility in canonical reusable components whenever possible.
- Do not create isolated accessible variants for a single client.
- Combine automated validation with human validation.
- Keep AI advisory.
- Keep release gates enforceable.
- Audit decisions, waivers, and approvals.

## Phase 1 - Activate Standard 12

Actions:

1. Adopt `docs/standards/accessibility/overview.md` as the canonical
   accessibility and inclusive experience entry point.
2. Reference Standard 12 from `SPEC.md`, `ROADMAP.md`, `AGENTS.md`, the
   Manifest, and Codex canonical catalogs.
3. Treat current Accessibility Module, UI Governance, Testing Standard, and
   Localization Standard documents as local operational guidance.
4. Require future accessibility work to cite Standard 12.

Exit criteria:

- Standard 12 is referenced by central governance documents.
- No runtime changes are required.

## Phase 2 - Inventory

Actions:

1. Inventory interfaces and components.
2. Identify critical user journeys.
3. Inventory forms and validation messages.
4. Inventory images and missing alternatives.
5. Inventory PDF and EPUB outputs.
6. Inventory audio/video captions, transcripts, and descriptions.
7. Inventory accessibility preferences and profiles.
8. Identify duplicate or divergent implementations.

Exit criteria:

- Accessibility inventory, critical journey matrix, issue register, and
  duplication analysis exist.

## Phase 3 - Component Contracts

Actions:

1. Define accessibility contracts for every shared component.
2. Add keyboard and focus expectations.
3. Add screen reader behavior expectations.
4. Add contrast and state requirements.
5. Add test evidence requirements.

Exit criteria:

- Canonical component accessibility contracts are ready before runtime
  remediation.

## Phase 4 - Validation Tooling Plan

Actions:

1. Select automated WCAG validation approach.
2. Select PDF/UA validation approach where needed.
3. Select EPUB Accessibility validation approach.
4. Define caption and transcript validation checks.
5. Define manual screen reader and keyboard review checklists.
6. Map validation evidence to Standard 10 quality gates.

Exit criteria:

- Tooling and manual validation plan is documented before CI or runtime
  changes.

## Phase 5 - Controlled Remediation

Actions require separate implementation approval:

1. Fix critical keyboard and focus issues.
2. Fix component-level accessibility gaps.
3. Add missing labels and error associations.
4. Add image classification and alternative text workflow.
5. Add PDF and EPUB accessibility validation.
6. Add audio/video accessibility validation.
7. Add profile preference implementation where approved.
8. Add CI accessibility gates where approved.

Exit criteria:

- Remediation is implemented through approved scoped phases with evidence.

## Phase 6 - Continuous Accessibility Governance

Actions:

1. Review accessibility evidence for every release.
2. Review waivers and expiration dates.
3. Review critical journeys after major UI changes.
4. Review PDF, EPUB, audio, and video accessibility outputs.
5. Review AI-generated accessibility content.

Exit criteria:

- Accessibility governance becomes continuous and release-blocking where
  required.

## Non-Goals

This plan does not authorize:

- UI redesign.
- New runtime validators.
- Database migrations.
- API changes.
- Docker or staging changes.
- Removing existing components.

