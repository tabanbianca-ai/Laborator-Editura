# Accessibility Profiles

## Purpose

Accessibility Profiles configure interaction and presentation preferences for
different accessibility needs without changing source content.

## Default Profiles

Recommended profiles:

- Default.
- Low Vision.
- Blind.
- Color Blind.
- Dyslexia.
- Motor Impairment.
- Hearing Impairment.
- Senior Mode.
- Child Mode.

## Profile Settings

Profiles may configure:

- Font size.
- Line height.
- Text spacing.
- Contrast.
- Color theme.
- Motion reduction.
- Focus style.
- Keyboard behavior.
- Captions by default.
- Transcript visibility.
- Audio description preference.
- Reading speed.
- Simplified interface hints.

## Current Repository Baseline

The repository has:

- Workspace preferences.
- Platform Language preferences.
- CSS focus styles.
- Responsive layouts.
- Shared UI primitives.
- Accessible route shells.

There is no dedicated Accessibility Profile runtime store yet.

## Rules

- Profiles adjust presentation and interaction, not source content.
- Profiles must respect user privacy.
- Profiles must be portable across routes.
- Profile changes are auditable when organization-managed.
- User-specific profile choices should remain private unless explicitly shared
  by policy.
- AI may suggest profile recommendations but must not force accessibility
  changes for users.
