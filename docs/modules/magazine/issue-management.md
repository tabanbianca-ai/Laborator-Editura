# Issue Management

## Purpose

Issue Management defines how magazine numbers are planned, assembled,
versioned, reviewed, published, and archived.

## Target Issue Lifecycle

```text
ISSUE_CREATED
  -> ARTICLES_ASSIGNED
  -> TRANSLATION
  -> REVIEW
  -> LAYOUT
  -> PUBLICATION
  -> ARCHIVE
```

## Issue Fields

Each issue should preserve:

- Magazine reference.
- Volume reference.
- Issue number.
- Title.
- Date.
- Language metadata.
- Sections.
- Article assignments.
- Cover reference.
- Layout reference.
- Publishing reference.
- Workflow state.
- Version.
- Audit history.

## Current Baseline

Current issue-like behavior is inferred from:

- Projects with publication type `MAGAZINE`.
- Documents with `MAGAZINE`, `MAGAZINE_ARTICLE`, or `ARTICLE` document types.
- `/magazine/[issueId]` frontend route using project id as issue id.
- Magazine Digital Experience issue summaries.
- Rights warnings aggregated from issue documents.
- Flipbook readiness derived from document approval/export status.

## Target Behavior

The canonical Magazine Module should:

- Create issues under a magazine.
- Assign articles to issues and sections.
- Reorder articles without changing article content.
- Track issue version.
- Track issue status.
- Link issue layout plan.
- Link issue publication record.
- Preserve archive history.

## Current Gaps

- No backend `MagazineIssue` entity exists.
- Issue identity currently maps to projects in the frontend read model.
- Issue versioning is not first-class.
- Issue archive state is not modeled.
- Article assignment and ordering are not persisted as magazine-specific
  records.

## Integration Rule

Issue publication must be delegated to Publishing. The Magazine Module
prepares structure and content references only.
