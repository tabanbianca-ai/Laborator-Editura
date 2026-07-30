# Accessibility Gap Analysis

## Purpose

This document compares the current repository baseline with the official
Accessibility, Localization and Inclusive Experience Module specification.

## Executive Summary

The repository has strong frontend accessibility and i18n foundations,
including documented WCAG 2.2 AA targets, skip links, semantic layout,
localized navigation, shared UI primitives, platform language support, and
Media Localization metadata for captions, subtitles, voice tracks, dubbing,
and localized media.

The target architecture requires these foundations to become a centralized
Accessibility and Localization platform with profile management, versioned
localization resources, automated validation, document accessibility
validation, caption/transcript services, media accessibility metadata, and
auditable compliance reporting.

## Current Accessibility Landscape

Current strengths:

- Frontend architecture targets WCAG 2.2 AA.
- AppShell has a skip link and main content region.
- Sidebar navigation uses `aria-current` and localized labels.
- Shared UI primitives exist for common controls and states.
- Several pages use semantic sections and `aria-label`.
- CSS includes focus-visible styling.
- Tests cover i18n, navigation, launch readiness, and route shells.
- Release documentation calls out manual accessibility validation.

## Current Localization Landscape

Current strengths:

- Platform Language is separated from content languages.
- `apps/web/lib/ui-i18n.ts` supports seven initial UI languages.
- Navigation, dashboard, pipeline, roles, workflow labels, and several
  workspace labels use i18n.
- Workspace preferences provide Platform Language metadata.

Current gaps:

- Some visible text, ARIA labels, placeholders, and dynamic progress labels are
  still hardcoded.
- Translation completeness is not centrally enforced.
- No runtime Localization Resource Registry exists.
- Locale-specific formatting is not centrally governed across every module.

## Standards Compliance Analysis

Current status:

- WCAG 2.2 AA is documented as target.
- WAI-ARIA usage exists in UI components and routes.
- EPUB Accessibility and PDF/UA are documented targets through this module,
  but not yet validated by automated tooling.
- WebVTT and SRT are target formats; Media Localization has subtitle metadata
  foundations.

Gaps:

- No automated WCAG engine configured.
- No PDF/UA validation configured.
- No EPUB Accessibility validation configured.
- No accessibility compliance report entity exists.

## Media Accessibility Evaluation

Current strengths:

- Media Localization supports subtitle tracks, voice tracks, dubbing tracks,
  localized videos, localized audio, timing metadata, caption styles, and
  localization QA evidence.
- Audio and Video planning includes synchronization, captions, narration, and
  media assets.

Gaps:

- No centralized Caption Service.
- No centralized Transcript Service.
- No centralized Audio Description Service.
- No automatic validation for audio/video accessibility output.
- Sign language metadata remains optional future work.

## Performance Review

Accessibility validation, caption generation, transcript generation, and media
validation may be expensive. Target implementation should use background
processing, caching, and incremental validation.

Current repository has no dedicated asynchronous Accessibility job system.

## Risk Register

| Risk | Impact | Priority |
| --- | --- | --- |
| Incomplete WCAG audit | UI blockers may remain undetected | High |
| Hardcoded visible/ARIA strings | Mixed-language or inaccessible UI | High |
| Missing document accessibility validation | Inaccessible EPUB/PDF outputs | High |
| Missing transcript/caption service | Multimedia accessibility incomplete | High |
| No centralized profile model | Accessibility preferences stay fragmented | Medium |
| No translation completeness governance | Inconsistent localized experience | Medium |
| No accessibility compliance event stream | Weak auditability | Medium |

## Prioritized Remediation Backlog

1. Complete route-level UI accessibility inventory.
2. Complete hardcoded UI and ARIA label inventory.
3. Define Accessibility Profile contracts.
4. Define Localization Resource Registry.
5. Define WCAG 2.2 AA validation workflow.
6. Define EPUB and PDF/UA validation workflow.
7. Define Caption and Transcript contracts.
8. Define Audio Description and Alternative Text contracts.
9. Integrate accessibility preflight with Publishing and Distribution.
10. Add accessibility audit events and observability metrics.
