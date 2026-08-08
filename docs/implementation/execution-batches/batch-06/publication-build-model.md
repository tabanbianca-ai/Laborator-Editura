# Publication Build Model

`PublicationBuild` captures a reproducible generation attempt for a specific
publication and exact dependency fingerprint.

Build statuses:

- REQUESTED
- QUEUED
- RUNNING
- COMPLETED
- FAILED
- CANCELLED
- RETRYING

Each build stores:

- source snapshot
- requested formats
- input fingerprint
- dependency fingerprint
- idempotency key
- generated assets
- validation report
- optional package reference

Equivalent builds are detected through the idempotency key and input
fingerprint.

