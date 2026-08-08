# Distribution Model

`CanonicalDistribution` represents one approved publication package sent or
made available through one channel, language, territory, and format.

Required fields:

- distribution id
- organization id
- publication id
- publication package id
- publication version
- channel id
- language
- territory
- format
- status
- external channel product id when available
- synchronization timestamps

States:

- NOT_READY
- READY
- SUBMITTING
- SUBMITTED
- UNDER_REVIEW
- ACCEPTED
- REJECTED
- AVAILABLE
- SUSPENDED
- WITHDRAWING
- WITHDRAWN
- FAILED

