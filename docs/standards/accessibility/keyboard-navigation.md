# Canonical Keyboard Navigation Standard

## Purpose

This document defines keyboard and focus management rules for Standard 12.

## Core Rules

Every critical interface must be operable without a mouse.

Keyboard navigation must provide:

- Logical tab order.
- Visible focus indicators.
- Predictable activation.
- Escape paths from modal or overlay contexts.
- No unintended focus traps.
- Focus restoration after dialogs close.
- Skip links or equivalent bypass navigation.
- Keyboard operation for menus, tabs, tables, readers, media controls, and
  toolbars.

## Focus Management

Focus must:

- Move to new modal dialogs when opened.
- Return to the invoking control when a modal closes.
- Move to error summaries when form validation fails where summaries are
  present.
- Avoid jumping unexpectedly during async loading.
- Remain visible across themes and contrast modes.

## Keyboard Validation

Keyboard testing must include:

- Tab.
- Shift+Tab.
- Enter.
- Space.
- Escape.
- Arrow keys where pattern requires them.
- Home and End where pattern requires them.

## Critical Failure Conditions

Keyboard navigation fails when:

- A critical action cannot be reached.
- A critical action cannot be activated.
- Focus becomes trapped.
- Focus disappears.
- Content updates without accessible notification.
- Keyboard order conflicts with visual and semantic order.

