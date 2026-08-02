# Canonical Distribution Model

## Purpose

Distribution is separate from publication.

Publication creates an official edition. Distribution submits that official
edition to owned or external channels through centrally governed connectors.

## Canonical Distribution Fields

Each distribution record must preserve:

- `id`.
- `publicationId`.
- `publicationVersion`.
- `channelId`.
- `channelProductId`.
- `territory`.
- `language`.
- `format`.
- `distributionStatus`.
- `submittedAt`.
- `acceptedAt`.
- `publishedAt`.
- `lastSynchronizedAt`.
- `channelMetadata`.
- `validationResult`.
- `auditInformation`.

## Distribution Statuses

Allowed canonical distribution statuses are:

- `NOT_SUBMITTED`.
- `READY`.
- `SUBMITTING`.
- `SUBMITTED`.
- `UNDER_CHANNEL_REVIEW`.
- `ACCEPTED`.
- `REJECTED`.
- `AVAILABLE`.
- `SUSPENDED`.
- `WITHDRAWING`.
- `WITHDRAWN`.
- `FAILED`.

A channel rejection must not automatically change the official edition state.

## Distribution Channels

Supported distribution channel categories include:

- Platform public library.
- Reader application.
- Owned store.
- Amazon KDP.
- IngramSpark.
- Lulu.
- Blurb.
- Bookstores.
- Print-on-demand services.
- Audio platforms.
- Video platforms.
- Institutional distribution.

Every channel must be administered through a centralized connector.

## Distribution Rules

- Distribution cannot occur before publication approval.
- Distribution cannot bypass rights restrictions.
- Distribution cannot create independent source copies.
- Distribution must reference exact publication version, language, territory,
  format, channel, external product identifier, and synchronization status.
- Distribution history must be preserved after withdrawal.

