# Canonical Accessible Component Standard

## Purpose

This document defines the accessibility contract for every official Design
System component under Standard 12.

## Canonical Component Accessibility Fields

Every official component must document:

| Field | Description |
| --- | --- |
| `component_id` | Stable component identifier |
| `semantic_role` | Native or ARIA role |
| `accessible_name` | Source and rules for accessible name |
| `keyboard_behavior` | Required keyboard interactions |
| `focus_behavior` | Focus entry, focus order, visible focus, and escape behavior |
| `screen_reader_behavior` | Announcements and state changes |
| `contrast_requirements` | Text, icon, border, and state contrast requirements |
| `error_behavior` | Error state semantics and announcements |
| `supported_states` | Disabled, loading, selected, expanded, pressed, invalid, or other states |
| `accessibility_tests` | Required automated and manual tests |

## Publication Rule

Non-compliant components cannot be published to the official component
library.

Accessibility fixes must be made in the canonical reusable component rather
than as isolated patches in one application.

## Component Families

The standard applies to:

- Buttons.
- Links.
- Inputs.
- Selects.
- Textareas.
- Checkboxes.
- Radios.
- Switches.
- Tabs.
- Modals.
- Tables.
- Cards.
- Empty, loading, and error states.
- Navigation.
- Toolbars.
- Media controls.
- Reader controls.

## Prohibited Patterns

- Click-only controls.
- Visual-only state changes.
- Unlabeled icons.
- Placeholder-only labels.
- Focus removed without replacement.
- Hidden interactive elements in the tab order.
- Custom controls that duplicate native controls without equivalent semantics.

