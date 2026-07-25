# Comments and Review

## Purpose

Comments and review observations allow reviewers, proofreaders, editors,
translators, and authorized collaborators to discuss issues without
destructively changing editorial text.

## Current Baseline

The current `collaboration` backend module supports:

- Internal threads.
- Private editorial threads.
- Project, document, segment, editorial feedback, and reviewer note targets.
- Comments.
- Reviewer notes.
- Mention placeholders.
- Comment resolution.
- Audit events.

The Review Workspace frontend supports:

- Source and translation comparison.
- Semantic fidelity summary.
- Terminology and glossary validation.
- Lexicographic references.
- Editorial recommendation panels.
- Issue list.
- Human approval action.
- Request changes placeholder.
- Translator and reviewer attribution.

## Target Comment Types

Editorial Review should support:

- Comment.
- Suggestion.
- Question.
- Change request.
- Reviewer note.
- Proofreading note.
- Terminology note.
- Doctrinal note.

## Observation Statuses

Review observations use:

- `OPEN`.
- `IN_PROGRESS`.
- `RESOLVED`.
- `REJECTED`.
- `CLOSED`.

Resolved and rejected observations must preserve rationale and actor metadata.

## Non-Destructive Editing

Reviewers may propose corrections, but text must not change until an
authorized human accepts the proposal.

The original text remains immutable. The current translation remains unchanged
until an accepted proposal creates a new version or controlled update.

## Version and Audit Requirements

Every comment and observation action must preserve:

- Actor.
- Timestamp.
- Target document or segment.
- Previous state.
- New state.
- Rationale when provided.
- AI model/provider metadata when AI assistance was used.

## Gaps

- Current collaboration comments do not yet map directly to a first-class
  `EditorialReview` observation.
- Correction proposal accept/reject state needs persistent backend ownership.
- Real-time comments are not part of the current backend foundation.
- Version comparison between reviewed text states needs a canonical service.
