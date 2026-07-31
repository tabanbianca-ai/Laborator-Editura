# Accessibility Migration Plan

## Purpose

This document defines the incremental path from the current repository baseline
to the official Accessibility, Localization and Inclusive Experience Module.

Migration must be additive and must preserve validated Phase 7 Step 16
publishing, final preflight, distribution, Library, Rights, Workflow, IAM,
Observability, Backup, Search, Integration, Configuration, Data Governance,
Notification, AI Orchestration, Security Governance, Policy Engine, audit,
frontend localization, staging deployment, infrastructure behavior, and JSON
Master v1.0 compatibility.

## Constraints

- Do not introduce isolated accessibility implementations inside functional
  modules.
- Do not break existing Platform Language behavior.
- Do not change manuscript, original, authoring, or target languages when UI
  language changes.
- Do not auto-publish inaccessible outputs.
- Do not let AI approve accessibility compliance.
- Do not replace Media Localization Studio; integrate it as a multimedia
  localization provider for captions, subtitles, transcripts, dubbing, and
  localized media metadata.

## Phase 1 - Baseline Inventory

Objective: Inventory localizable resources, visible text, ARIA labels,
accessibility patterns, media accessibility metadata, document generators,
tests, and validation rules.

Dependencies: Existing frontend, i18n, media localization, publishing, export,
and quality documentation.

Activities: Map UI routes, shared components, i18n keys, hardcoded labels,
media metadata, and publication output accessibility requirements.

Risks: Missing dynamically composed labels or route-specific accessibility
states.

Completion criteria: Every main route and shared UI primitive has a documented
accessibility and localization status.

Rollback strategy: Documentation-only rollback by reverting inventory updates.

Data that must not be lost: Existing i18n keys, Platform Language behavior,
release checklist accessibility notes, and media localization metadata.

## Phase 2 - Accessibility Profile Model

Objective: Define Accessibility Profile contracts for UI, document, and media
accessibility preferences.

Dependencies: Workspace preferences and Configuration module.

Activities: Define profile types, settings, privacy rules, organization vs
user scope, and audit requirements.

Risks: Treating accessibility profiles as content changes.

Completion criteria: Profile contracts are approved for Default, Low Vision,
Blind, Color Blind, Dyslexia, Motor Impairment, Hearing Impairment, Senior
Mode, and Child Mode.

Rollback strategy: Keep existing UI behavior and disable profile application.

Data that must not be lost: User preferences, accessibility settings, and
workspace preferences.

## Phase 3 - Localization Resource Registry

Objective: Move UI localization governance toward versioned resources with
translation completeness metadata.

Dependencies: Configuration, Data Governance, and existing `ui-i18n.ts`.

Activities: Define localization resource schema, namespace policy, fallback
policy, review status, and translation completeness reporting.

Risks: Breaking existing translations or fallback behavior.

Completion criteria: Localization resources are mapped for all existing UI
dictionary keys.

Rollback strategy: Keep `ui-i18n.ts` authoritative until registry runtime is
validated.

Data that must not be lost: Existing translations and keys.

## Phase 4 - UI Accessibility Remediation

Objective: Standardize keyboard, focus, screen-reader, dialog, table, form,
error, and status patterns.

Dependencies: Baseline inventory and shared UI primitives.

Activities: Define component contracts, replace hardcoded labels, standardize
live regions, test focus behavior, and validate responsive/touch behavior.

Risks: Visual regressions or keyboard focus traps.

Completion criteria: Main workflows pass keyboard and screen-reader smoke
tests.

Rollback strategy: Component-level rollback preserving previous route
behavior.

Data that must not be lost: UI state, route behavior, form submissions, and
translations.

## Phase 5 - Document Accessibility Validation

Objective: Add accessibility validation contracts for EPUB, PDF, HTML, XML,
and generated publication metadata.

Dependencies: Publishing, Export, JSON Master, Data Governance, and
Configuration.

Activities: Define validation report model, standards metadata, reading order,
alternative text, semantic structure, bookmarks, and artifact references.

Risks: Blocking outputs before remediation tools exist.

Completion criteria: Publishing preflight can represent document
accessibility status.

Rollback strategy: Run validations as warnings until enforcement is approved.

Data that must not be lost: Export artifacts, publication records, JSON Master
versions, and source metadata.

## Phase 6 - Caption and Transcript Services

Objective: Define centralized caption, subtitle, and transcript services
integrated with Media Localization Studio.

Dependencies: Media Localization, Multimedia Creation, Audio, Video, and
Publishing.

Activities: Define caption tracks, transcripts, formats, timing metadata,
source references, language/locale metadata, validation, and audit.

Risks: Duplicate subtitle metadata between Media Localization and Accessibility.

Completion criteria: Caption and transcript contracts are shared and
non-duplicative.

Rollback strategy: Keep Media Localization metadata authoritative until shared
contracts are validated.

Data that must not be lost: Subtitle tracks, transcripts, timecodes, source
media references, localized media references, and audit trail.

## Phase 7 - Audio Description and Alternative Text

Objective: Define audio description and alternative text governance for visual
and multimedia assets.

Dependencies: Multimedia Creation, Media Localization, Publishing, Library,
and Data Governance.

Activities: Define alt text records, long descriptions, audio description
tracks, source references, review status, and language metadata.

Risks: AI-generated descriptions being treated as approved descriptions.

Completion criteria: Visual assets and videos can reference approved
description metadata.

Rollback strategy: Preserve metadata as draft suggestions until human review.

Data that must not be lost: Source image/video references, existing captions,
description drafts, approvals, and version history.

## Phase 8 - Accessibility Preflight Integration

Objective: Integrate accessibility validation with Publishing, Distribution,
Workflow, and Quality Agent readiness.

Dependencies: Document accessibility, media accessibility, Workflow, and
Publishing.

Activities: Define gate statuses, blocking rules, warnings, report links, and
human override policy.

Risks: Overblocking publication before content remediation is possible.

Completion criteria: Distribution Center can display accessibility readiness
per format and media type.

Rollback strategy: Downgrade new gates to warnings through approved
Configuration policy.

Data that must not be lost: Preflight reports, workflow states, publication
history, rights restrictions, and validation decisions.

## Phase 9 - Observability and Audit

Objective: Track accessibility validations, localization updates, caption and
transcript operations, profile changes, and compliance status.

Dependencies: Observability, Audit, Data Governance, and Configuration.

Activities: Define events, metrics, logs, trace metadata, audit records, and
dashboards.

Risks: Exposing private accessibility preferences or restricted metadata.

Completion criteria: Authorized users can review compliance history without
seeing private user accessibility preferences.

Rollback strategy: Disable dashboards while preserving audit events.

Data that must not be lost: Accessibility events, audit trail, validation
reports, and compliance state.

## Phase 10 - Continuous Compliance

Objective: Establish ongoing accessibility and localization governance.

Dependencies: All previous phases.

Activities: Add scheduled validations, translation completeness checks,
release readiness checks, manual audit workflows, and remediation queues.

Risks: Alert fatigue and false positives.

Completion criteria: Accessibility and localization status are continuously
visible to authorized operators and release owners.

Rollback strategy: Reduce check frequency or severity while retaining history.

Data that must not be lost: Historical validation records, localization
versions, profile versions, and remediation actions.

## Testing Requirements

Each implementation phase requires:

- Keyboard navigation tests.
- Focus visibility tests.
- Screen-reader landmark smoke tests.
- i18n key coverage tests.
- Locale fallback tests.
- Form label and error association tests.
- Table accessibility tests.
- Dialog focus tests.
- Caption and transcript contract tests.
- EPUB/PDF accessibility validation tests when tooling is added.
- Audit tests.
- Backup/restore tests when persistence changes.
- Regression tests for Publishing, Distribution, Media Localization, JSON
  Master, Configuration, Data Governance, and Phase 7 Step 16 behavior.

## Codex Governance Reference

The canonical module sequence, dependency closure, and future-extension rule are
maintained in `docs/codex/module-catalog.md`,
`docs/codex/dependency-registry.md`, and `docs/codex/meta-architecture.md`.

This migration plan owns only the local migration strategy for this module. It
does not redefine the platform module sequence, fundamental architecture
closure, or future-extension approval rule.
