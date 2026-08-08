# Audio Production Model

`AudioProduction` is the canonical record for audiobook, TTS, human narration,
hybrid narration, accessible audio, and children's read-aloud production.

Required lineage:

- `workId`.
- `editionId`.
- `masterDocumentVersionId`.
- `publicationId`.
- `sourceBlockIds`.
- `generatorOrCreator`.
- `profileVersion`.
- `rightsRecordIds`.

Supported production types are `HUMAN_NARRATION`, `TTS`, `HYBRID`,
`ACCESSIBLE_AUDIO`, and `CHILDREN_READ_ALOUD`.

Audio production is derived from approved editorial text. It never becomes the
editorial source of truth.

