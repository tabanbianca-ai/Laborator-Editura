# Duplicate Consolidation

Duplicate detection is advisory until authorized human confirmation.

Statuses:

- `POSSIBLE_DUPLICATE`
- `CONFIRMED_DUPLICATE`
- `RELATED_NOT_DUPLICATE`

Comparison signals:

- Title.
- Author.
- Language.
- ISBN.
- Edition.
- Checksum.
- Provenance.

Rules:

- No automatic merge based only on title.
- Controlled merge preserves historical identifiers.
- Internal redirects are created.
- Assets are preserved.
- Relationships are preserved.
- Rights, provenance, approvals, and audit history are preserved.
- Merge must be reversible through audit and redirect history where possible.
