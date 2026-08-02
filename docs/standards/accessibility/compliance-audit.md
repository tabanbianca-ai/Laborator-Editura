# Canonical Accessibility Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 12:
Canonical Accessibility and Inclusive Experience.

It is a documentation and governance audit. It does not change runtime
behavior, APIs, database schema, Docker, staging, frontend behavior, or
application logic.

## Audit Date

2026-08-01.

## Static Inventory

| Area | Current count or evidence |
| --- | --- |
| Web route/layout/loading/error files | 57 files under `apps/web/app` |
| Web component files | 62 files under `apps/web/components` |
| Accessibility-related UI source matches | 291 matches for forms, controls, ARIA, roles, focus, alt text, and related attributes |
| Accessibility module documents | 12 files under `docs/modules/accessibility` |
| UI Governance accessibility document | `docs/frameworks/ui-governance/accessibility.md` |
| Testing Standard accessibility document | `docs/standards/testing-validation/accessibility-testing.md` |
| Existing target baseline | WCAG 2.2 AA is documented |
| Current automated WCAG engine | Not configured in repository baseline |
| Current PDF/UA validator | Not configured in repository baseline |
| Current EPUB accessibility validator | Not configured in repository baseline |
| Current accessibility compliance report entity | Not present as runtime entity |

## Current Strengths

- Frontend architecture documents target WCAG 2.2 AA.
- The AppShell foundation includes skip-link and semantic content patterns.
- Shared UI primitives exist for common controls and states.
- Several pages use semantic structure and ARIA attributes.
- CSS includes focus-visible styling.
- Accessibility module documentation covers UI, document, audio/video,
  localization, internationalization, profiles, events, APIs, gaps, and
  migration.
- Release and testing documentation already call out accessibility validation
  needs.

## Current Gaps

- Full automated WCAG validation is not configured.
- Full route-level manual accessibility audit is not complete.
- Component-level accessibility contracts are not fully centralized.
- PDF/UA validation is not configured.
- EPUB Accessibility validation is not configured.
- Audio/video transcript, caption, and audio-description validation are not
  centralized.
- Accessibility profile runtime governance is documented but not complete.
- Accessibility compliance evidence is not yet stored as a canonical runtime
  record.
- Accessibility validation is not yet fully integrated into CI/CD release
  gates.

## Critical Journey Baseline

The following journeys require complete accessibility validation before
release certification:

| Journey | Baseline status |
| --- | --- |
| Authentication | Documented, needs full keyboard and screen reader evidence |
| Access recovery | Documented, needs full validation evidence |
| Primary navigation | Foundation exists, needs full route coverage |
| Project creation | Needs full form and error audit |
| Document upload | Needs full validation |
| Translation and proofreading | Needs full editor and segment workflow audit |
| Approval | Needs workflow gate audit |
| Publication | Needs publishing and rights gate audit |
| Purchase and download | Future/public-commerce flow, needs validation when active |
| Book reading | Needs reader accessibility validation |
| Audio and video playback | Needs transcript/caption/control validation |
| Profile administration | Needs form and preference audit |
| Language switching | Needs localization/accessibility joint validation |
| Accessibility preference management | Needs profile implementation and validation |

## Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| UI accessibility | Partial foundation | WCAG target documented; full validation future |
| Component accessibility | Partial foundation | Shared components exist; canonical contracts future |
| Keyboard navigation | Partial foundation | Needs critical-flow manual evidence |
| Forms and errors | Needs inventory | Form-level audit required |
| Images and alt text | Needs inventory | Asset classification and alt text audit required |
| PDF accessibility | Early foundation | PDF/UA tooling not configured |
| EPUB accessibility | Early foundation | EPUB accessibility tooling not configured |
| Audio/video accessibility | Early foundation | Captions/transcripts metadata exist in media modules; validation future |
| Accessibility profiles | Early foundation | Documented, runtime governance future |
| Testing and evidence | Partial foundation | Standard 10 exists; Standard 12 evidence model now defined |

## Baseline Conclusion

The repository has meaningful accessibility foundations and strong
documentation, but Standard 12 requires those foundations to converge into a
single canonical accessibility validation and evidence model.

No existing accessibility behavior should be removed during baseline
standardization. Existing UI components, documentation, localization
resources, and validation notes must be mapped before remediation.

