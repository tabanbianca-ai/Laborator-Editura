# Layout Standards

## Purpose

Layout Standards define how Laborator Editura interfaces adapt across screen
sizes, input methods, accessibility needs, and publication contexts.

## Supported Platforms and Form Factors

The UI must support:

- Windows.
- macOS.
- Linux.
- Android.
- iOS.
- iPadOS.

The UI must support:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

## Layout Principles

- Mobile first.
- Responsive by default.
- Touch support for tablet and mobile.
- Keyboard support for desktop and laptop.
- Stable dimensions for editors, tables, toolbars, and status panels.
- Clear hierarchy without nested cards.
- Content-first pages, not decorative landing pages inside the app.
- No overlapping text or controls.

## Desktop Layout

Desktop layouts may use:

- Persistent sidebar.
- Top navigation.
- Multi-column workspaces.
- Dense tables.
- Split panels.
- Right-side contextual panels.
- Keyboard shortcuts where documented.

Editorial and translation workspaces may use two-column or three-column
layouts when screen width allows.

## Tablet Layout

Tablet layouts should use:

- Two-column editor layouts where practical.
- Collapsible sidebar.
- Larger touch targets.
- Contextual panels that can collapse.
- Clear tab transitions when columns no longer fit.

Tablet layouts must not be treated as small desktop layouts when the workflow
requires focused editing.

## Mobile Layout

Mobile layouts should use:

- Single-column content.
- Tabbed panels for complex workspaces.
- Collapsible navigation.
- Bottom-safe spacing for touch controls.
- Short, clear primary actions.
- Progressive disclosure for secondary metadata.

Mobile must support navigation and review tasks, but long production editing
may remain optimized for tablet and desktop.

## Large Screen Layout

Large screens may use:

- Wider content grids.
- Persistent context panels.
- Multi-document comparison.
- Parallel review columns.

Large screen layouts must maintain readable line length and should not stretch
text indefinitely.

## Accessibility Mode

Accessibility mode must support:

- Strong focus visibility.
- Reduced motion.
- High contrast theme compatibility.
- Larger hit targets where needed.
- Clear headings and landmarks.
- Screen reader compatible content order.

## Print and Export Layout

Print layout is separate from application layout.

Application UI may show print metadata and previews, but book, magazine, PDF,
EPUB, MOBI, flipbook, and print output formatting must be governed by
publishing and layout standards.

## Current Baseline

Current implementation includes:

- AppShell with sidebar and top navigation.
- Responsive route coverage across main workspaces.
- Editor-specific desktop, tablet, and mobile behavior.
- Shared loading, empty, and error state components.

Current gaps:

- Layout tokens are incomplete.
- Large-screen behavior is not fully standardized.
- Accessibility mode is not yet formalized.
- Print layout rules are mostly managed outside the UI governance baseline.
- Responsive visual regression checks are not yet automated.

## Layout Compliance

Every new UI page must define:

- Primary layout.
- Mobile behavior.
- Tablet behavior.
- Desktop behavior.
- Loading state.
- Empty state.
- Error state.
- Accessibility notes.
- Navigation entry or reason for omission.
- Components used.
