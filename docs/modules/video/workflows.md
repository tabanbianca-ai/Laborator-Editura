# Video and Multimedia Workflows

## Purpose

This document defines official workflows for video projects, asset selection,
timeline editing, synchronization, captions, rendering, review, and
publication handoff.

## Video Project Workflow

```text
Video Project Created
  -> Asset Selection
  -> Timeline Editing
  -> Audio Synchronization
  -> Caption Generation
  -> Rendering
  -> Quality Review
  -> Publishing Handoff
```

## Timeline Editing Workflow

```text
Source Content Selected
  -> Scenes Created
  -> Assets Linked
  -> Tracks Ordered
  -> Timing Adjusted
  -> Timeline Version Created
```

Timeline editing must not modify source Library content or original media
assets.

## Preview Video Workflow

```text
Draft Timeline
  -> Preview Render
  -> Draft Video Asset
  -> Review Preview
```

Preview videos must be marked draft-only and must never be published.

## Official Video Workflow

```text
Approved Text and Timeline
  -> Rights Validation
  -> Audio and Caption Synchronization
  -> Official Render
  -> Quality Review
  -> Publishing Handoff
```

Official video requires approved source content, approved assets, rights,
workflow approval, and Publishing handoff.

## Caption Workflow

```text
Source Text or Transcript
  -> Caption Draft
  -> Timing Alignment
  -> Language Review
  -> Accessibility Review
  -> Caption Track Version
```

Caption tracks may be manual, generated, or imported, but official captions
require review.

## Rendering Workflow

```text
Timeline Version
  -> Render Validation
  -> Rendering Queue
  -> Encoder
  -> Video Asset Version
  -> Render Audit
```

Rendering must be asynchronous and traceable.

## Current Workflow Baseline

The current frontend Editorial Pipeline already models preview video and
official video gating. Backend multimedia modules support video project
metadata, video assets, subtitle assets, and export records, but no dedicated
video workflow runtime exists.

## Blocking Rules

Video publication must be blocked when:

- Source content is not approved.
- Rights are missing.
- Asset provenance is incomplete.
- Caption/accessibility review is incomplete.
- Timeline review is incomplete.
- Rendering failed.
- Workflow approval is missing.
- Publishing handoff is unavailable.

