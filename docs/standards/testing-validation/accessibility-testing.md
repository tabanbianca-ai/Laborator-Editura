# Canonical Accessibility and Localization Testing Standard

## Purpose

This document defines mandatory accessibility and localization validation for
the platform interface, publication outputs, reader experiences, and
editorial workflows.

## Accessibility Scope

Accessibility testing must cover:

- Semantic headings.
- Keyboard navigation.
- Focus states.
- Button labels.
- Form labels.
- Error messages.
- Table accessibility.
- Color contrast.
- Screen reader compatibility.
- Responsive desktop, tablet, and mobile layouts.
- Touch interactions.
- Accessible publication metadata.
- PDF, EPUB, audio, video, and magazine output accessibility where relevant.

## Localization Scope

For the primary platform languages:

- Romanian.
- English.
- Spanish.
- French.
- Portuguese.
- Italian.
- German.

Localization testing must verify:

- No untranslated keys.
- No terms from another language in the active interface.
- Regional formatting.
- Pluralization.
- Error messages.
- Navigation.
- Text truncation.
- Screen reader compatibility.

Code, identifiers, and technical contracts remain in English. User-facing
text must appear only in the selected Platform Language.

## Accessibility Evidence

Evidence may include:

- Automated scan results.
- Manual keyboard testing notes.
- Screen reader testing notes.
- Screenshots.
- Responsive viewport evidence.
- Contrast reports.
- Publication output validation.
- Human approval.

## Localization Evidence

Evidence may include:

- Dictionary coverage report.
- Missing key report.
- Mixed-language scan.
- Regional formatting test result.
- Screenshots.
- Manual review notes.
- Screen reader review.

## Blocking Rules

Accessibility or localization issues block release when they:

- Prevent core navigation.
- Prevent authentication.
- Prevent editorial workflow use.
- Hide or corrupt critical actions.
- Expose the wrong Platform Language.
- Break screen reader use for critical flows.
- Produce inaccessible required publication outputs.

## Audit

Audit must record:

- Accessibility test executed.
- Localization test executed.
- Missing translation detected.
- Mixed-language UI detected.
- Accessibility blocker detected.
- Accessibility waiver requested.
- Accessibility waiver approved or rejected.
- Accessibility gate passed or failed.
