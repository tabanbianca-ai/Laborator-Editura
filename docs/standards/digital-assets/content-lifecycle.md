# Content Lifecycle Standard

## Purpose

This document defines the canonical lifecycle for documents, editorial
content, digital assets, publication artifacts, and archived content.

## Canonical Lifecycle

Editorial content follows:

```text
Idea
  -> Draft
  -> Translation
  -> Editorial Review
  -> Technical Review
  -> Approval
  -> Publication
  -> Distribution
  -> Archived
```

Not every asset passes through every state. Assets must still map local
workflow states to the canonical lifecycle.

## Lifecycle States

Canonical lifecycle states:

- `IDEA`.
- `DRAFT`.
- `IN_TRANSLATION`.
- `IN_EDITORIAL_REVIEW`.
- `IN_TECHNICAL_REVIEW`.
- `APPROVED`.
- `PUBLISHED`.
- `DISTRIBUTED`.
- `ARCHIVED`.
- `RESTORED`.

Specialized module states may exist only when they map to canonical lifecycle
states and preserve auditability.

## State Rules

- Draft content may change.
- Translation state must preserve source and target alignment.
- Editorial review must preserve proposals, comments, decisions, and version
  history.
- Technical review must include export, preflight, accessibility, and
  distribution readiness checks where applicable.
- Approval requires authorized human decision.
- Publication must preserve final approved source version.
- Distribution must preserve channel, artifact, date, status, and audit.
- Archive must preserve retrieval and restoration metadata.

## Human Final Authority

AI may suggest, summarize, detect blockers, prepare drafts, and validate
readiness.

AI must not:

- Approve content.
- Publish content.
- Grant rights.
- Change provenance.
- Delete history.
- Bypass workflow.

## Version History

Version records must preserve:

- Version identifier.
- Previous version.
- Change summary.
- Actor.
- Timestamp.
- Approval status.
- Affected derivatives.
- Restoration capability where applicable.

## Lifecycle Audit

Audit must record:

- Lifecycle state changed.
- Content created.
- Content updated.
- Content reviewed.
- Content approved.
- Content published.
- Content distributed.
- Content archived.
- Content restored.
- Approved exception.

