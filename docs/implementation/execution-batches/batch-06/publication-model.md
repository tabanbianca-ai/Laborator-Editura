# Publication Model

`CanonicalPublication` represents an approved edition prepared for one or more
publication outputs.

Required source snapshot:

- `canonicalWorkId`
- `canonicalEditionId`
- `approvedMasterDocumentVersionId`
- `approvedMetadataVersionId`
- `validatedRightsRecordId`
- `publicationConfigurationId`

Publication approval is separate from public visibility. An approved
publication package may still be private, withheld, or staged for a later
distribution batch.

The publication links back to the Unified Library through
`libraryPublicationId` when available.

