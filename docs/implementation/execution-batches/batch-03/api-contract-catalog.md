# API Contract Catalog

The canonical REST envelopes are `ApiSuccessEnvelope` and `ApiErrorEnvelope` in
`packages/shared/src/canonical-data.ts`.

## Success Envelope

```json
{
  "request_id": "string",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "data": {},
  "metadata": {},
  "links": {}
}
```

## Error Envelope

```json
{
  "request_id": "string",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "error": {
    "code": "string",
    "message_key": "string",
    "correlation_id": "string",
    "details": {}
  }
}
```

## Version Policy

- Current public/shared contract version: `v1`.
- Additive fields must be optional or safe.
- Breaking changes require a major version and deprecation plan.
- Existing route compatibility is preserved.

## Known Gap

Not every controller currently wraps responses in the canonical envelope.
Batch 03 defines the reusable contract and inventories the gap; conversion must
be incremental to avoid breaking existing consumers.

