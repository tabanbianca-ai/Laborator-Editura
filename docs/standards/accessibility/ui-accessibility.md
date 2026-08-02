# Canonical UI Accessibility Standard

## Purpose

This document defines mandatory accessibility rules for application
interfaces under Standard 12.

## UI Requirements

Every interface must provide:

- Full keyboard navigation.
- Logical focus order.
- Visible focus.
- No focus traps.
- Semantic headings and landmarks.
- Labels for every control.
- Error messages associated with the related fields.
- Clear instructions.
- Sufficient contrast.
- Text resizing support.
- Content reflow at zoom.
- Screen reader compatibility.
- Usability on phone, tablet, laptop, and desktop.

## Semantic Structure

Interfaces must use native semantic HTML wherever possible.

ARIA may supplement semantics only when native elements cannot express the
required behavior.

## Critical Interface Flows

The following flows require complete validation:

- Authentication.
- Access recovery.
- Primary navigation.
- Project creation.
- Document upload.
- Translation and proofreading.
- Approval.
- Publication.
- Purchase and download.
- Book reading.
- Audio and video playback.
- Profile administration.
- Language switching.
- Accessibility preference management.

A critical flow is not compliant if it can be completed only with a mouse.

## Language and Accessibility

Every page, document, and multilingual segment must declare the correct
language.

Screen readers must be able to switch pronunciation when content legitimately
changes language.

Accessible resources must support the v1.0 language families:

- Romanian.
- English.
- Spanish.
- French.
- Portuguese.
- Italian.
- German.

## Motion and Animation

Interfaces must:

- Respect reduced-motion preferences.
- Allow non-essential animations to be stopped.
- Avoid effects that may cause discomfort.
- Provide controls for moving content.
- Avoid dangerous flashing content.
- Avoid transitions that prevent reading.

