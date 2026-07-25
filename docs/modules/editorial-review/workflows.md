# Editorial Review Workflows

## Purpose

This document defines how proofreading and editorial review move through the
existing Workflow Engine without duplicating workflow state ownership.

## Target Review Workflow

```text
PENDING_REVIEW
  -> IN_REVIEW
  -> CORRECTIONS_REQUIRED
  -> REVISED
  -> APPROVED
  -> READY_FOR_PUBLISHING
```

## Current Workflow Mapping

Current document and segment statuses include:

- `DRAFT`.
- `IN_TRANSLATION`.
- `IN_QA`.
- `IN_SEMANTIC_REVIEW`.
- `IN_REVIEW`.
- `APPROVED`.
- `READY_FOR_EXPORT`.
- `EXPORTED`.
- `BLOCKED`.

Target mapping:

| Editorial Review status | Current Workflow mapping |
| --- | --- |
| `PENDING_REVIEW` | `IN_SEMANTIC_REVIEW` completed or document ready for `IN_REVIEW` |
| `IN_REVIEW` | `IN_REVIEW` |
| `CORRECTIONS_REQUIRED` | `BLOCKED` with review reason or review-specific observation state |
| `REVISED` | `IN_REVIEW` after corrections are applied |
| `APPROVED` | `APPROVED` |
| `READY_FOR_PUBLISHING` | Downstream Publishing/Export readiness state |

## Blocking Rules

Editorial Review must respect existing gates:

- Cannot move to review with unresolved High or Critical QA issues.
- Cannot approve with unresolved High or Critical Semantic Fidelity issues.
- Cannot publish with rejected terminology or unresolved High/Critical
  terminology issues.
- Cannot publish without required rights and provenance checks.
- Cannot bypass Phase 7 Step 16 final preflight and distribution readiness.

## Human Final Authority

Only authorized human roles may approve a review or accept publication-blocking
warnings.

AI may:

- Summarize blockers.
- Suggest corrections.
- Explain issues.
- Recommend next action.

AI may not:

- Approve review.
- Apply corrections without human acceptance.
- Mark ready for publishing.
- Publish.

## Workflow Assessment

The Workflow Engine is already the correct owner for generic transitions.
Editorial Review should add review-specific state and observations without
creating a competing workflow engine.

## Gaps

- Review-specific `CORRECTIONS_REQUIRED` and `REVISED` states are not yet
  first-class workflow states.
- Review approval is available through workflow/document actions, but a
  canonical review aggregate approval is not implemented.
- Request changes is currently a frontend placeholder where a canonical review
  endpoint should later exist.
