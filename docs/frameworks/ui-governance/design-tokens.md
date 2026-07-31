# Design Tokens

## Purpose

Design Tokens are the canonical representation of visual decisions in the
Laborator Editura interface.

Tokens prevent visual drift, make theming possible, improve accessibility, and
ensure that web, mobile, desktop, public, and administrative interfaces share
the same visual language.

## Current Baseline

Current token source:

- `apps/web/lib/design-tokens.ts`.

Current token groups:

- `color`.
- `radius`.
- `spacing`.

Current CSS implementation:

- `apps/web/app/globals.css`.

The current token set is valid as an initial baseline, but it is not complete
enough to govern every UI surface.

## Official Token Categories

The official token registry must support:

- Colors.
- Typography.
- Spacing.
- Margins.
- Iconography.
- Shadows.
- Animations.
- Breakpoints.
- Dimensions.
- Focus states.
- Z-index layers.
- Borders.
- Status colors.
- Severity colors.
- Risk colors.
- Workflow state colors.
- Accessibility mode values.
- Print layout values where relevant.

## Color Tokens

Color tokens must cover:

- Background.
- Surface.
- Elevated surface.
- Text.
- Muted text.
- Border.
- Accent.
- Success.
- Warning.
- Danger.
- Information.
- Neutral.
- Disabled.
- Focus ring.
- Selection.

Rules:

- Components must not define independent palettes.
- Status colors must remain consistent across workflow, QA, semantic risk,
  rights warnings, publishing blockers, and distribution readiness.
- Color cannot be the only carrier of meaning.
- Contrast must meet the accessibility baseline.

## Typography Tokens

Typography tokens must cover:

- Font family.
- Heading sizes.
- Body sizes.
- Caption sizes.
- Label sizes.
- Line heights.
- Font weights.
- Letter spacing.
- Code or metadata text where needed.

Rules:

- UI text must not scale directly with viewport width.
- Compact panels, dashboards, and tables must use appropriately small and
  readable headings.
- Hero-scale type is reserved for true hero or public marketing contexts.

## Spacing and Dimension Tokens

Spacing tokens must cover:

- Page padding.
- Section gaps.
- Panel padding.
- Card padding.
- Table cell padding.
- Form field spacing.
- Toolbar spacing.
- Navigation item spacing.
- Mobile spacing.
- Tablet spacing.
- Desktop spacing.

Dimension tokens must cover:

- Sidebar width.
- Top bar height.
- Control height.
- Icon button size.
- Table density.
- Editor panel minimum widths.
- Mobile tab height.
- Modal widths.

Rules:

- Fixed-format UI such as editors, boards, toolbars, controls, tables, and
  counters must use stable dimensions to avoid layout shift.
- Nested cards must be avoided.

## Radius, Shadow, Border, and Elevation Tokens

Radius tokens must cover:

- Panel radius.
- Control radius.
- Modal radius.
- Small chip radius.

Shadow and elevation tokens must cover:

- None.
- Subtle.
- Floating overlay.
- Modal.

Rules:

- Cards should remain modest and professional.
- Shadows must not be decorative substitutes for layout hierarchy.

## Motion Tokens

Motion tokens must cover:

- Duration.
- Easing.
- Hover transitions.
- Focus transitions.
- Collapse transitions.
- Loading animation timing.

Rules:

- Motion must be subtle.
- Motion must respect reduced-motion preferences.
- Motion must never block task completion.

## Breakpoint Tokens

Breakpoint tokens must cover:

- Mobile.
- Tablet.
- Desktop.
- Large desktop.
- Print.

Rules:

- UI must be mobile first.
- Tablet editor layouts must be optimized rather than simply compressed.
- Desktop layouts may use sidebars, split panels, and dense tables.

## Token Governance

Token changes require:

- Token name.
- Token category.
- Reason.
- Affected components.
- Accessibility impact.
- Theme impact.
- Localization impact if text layout is affected.
- Migration notes.
- Test expectations.

## Baseline Gap

The current token implementation is intentionally small. The next
standardization phase should expand tokens before large UI changes are made,
then migrate repeated literal CSS values into the token registry.
