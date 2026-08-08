# Migration Plan

No destructive migration is introduced in Batch 04.

## Expand-Migrate-Contract Strategy

1. Expand: add optional canonical editorial fields and JSON Master extension points.
2. Migrate: map existing Projects, Author Studio, Documents, Segments, Translations, TM, Terminology,
   QA, Workflow, Collaboration, and Editorial Decisions records into canonical views.
3. Contract: only after compatibility tests and explicit approval, enforce stricter runtime fields.

## Current Change

- Shared TypeScript contracts were added.
- JSON Master optional fields were added.
- No runtime table rename or destructive schema change was made.

## Future Candidate Tables

If a physical master-document implementation is approved later, candidate tables are:

- `master_documents`
- `master_document_versions`
- `editorial_comments`
- `editorial_suggestions`
- `correction_findings`
- `editorial_approvals`

These are not added in this batch to avoid duplicating existing module persistence.
