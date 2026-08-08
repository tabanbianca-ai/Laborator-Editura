# Comments and Suggestions

Comments and tracked suggestions are separate from canonical text until accepted.

## Comments

Canonical fields:

- `comment_id`
- `resource_id`
- `version_id`
- `block_id`
- `author_id`
- `content`
- `status`
- `parent_comment_id`
- `created_at`
- `resolved_at`
- `resolved_by`

Supported behavior:

- general comments;
- selection/block comments;
- replies;
- mentions;
- resolve;
- reopen.

## Suggestions

Operations:

- `INSERT`
- `DELETE`
- `REPLACE`
- `MOVE`
- `FORMAT`

Rules:

- Suggestions preserve author, source version, original text, proposed text, justification, and
  accepted/rejected state.
- Applying a suggestion creates a new versioned change.
- Rejected suggestions remain auditable.

## Current Mapping

- Collaboration provides discussion threads and comments.
- Review workspace supports proposal action placeholders and auditable accept/reject behavior.
