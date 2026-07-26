# Magazine Workflows

## Purpose

Magazine workflows define how issues and articles move through proposal,
draft, translation, review, layout, publication, and archive while reusing the
Workflow Engine.

## Article Workflow

```text
PROPOSAL
  -> DRAFT
  -> TRANSLATION
  -> EDITORIAL_REVIEW
  -> APPROVED
  -> LAYOUT
  -> PUBLISHED
```

## Issue Workflow

```text
ISSUE_CREATED
  -> ARTICLES_ASSIGNED
  -> TRANSLATION
  -> REVIEW
  -> LAYOUT
  -> PUBLICATION
  -> ARCHIVE
```

## Current Baseline

Current behavior uses:

- Project editorial process stages.
- Document statuses.
- Translation Workflow.
- Review Workspace.
- Layout Publishing plans.
- Publishing preflight.
- Distribution Center readiness.
- Magazine Digital Experience readiness states.

## Workflow Rules

- Every issue must contain Library-referenced articles.
- Every article must be approved before issue publication.
- Translation uses Translation Module.
- Review uses Editorial Review Module.
- Rights validation uses Rights and Provenance.
- Layout uses Layout Publishing.
- Official publication uses Publishing Module.
- Archive must preserve issue history.

## Current Gaps

- Issue workflow states are not first-class.
- Article assignment workflow is not first-class.
- Issue archive state is not modeled.
- Workflow Engine does not yet have a magazine-specific workflow definition.
- Magazine Digital Experience statuses are frontend readiness states, not
  canonical workflow records.
