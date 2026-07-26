# Canonical Data Model

## Purpose

The Canonical Data Model defines shared platform entities independently from
UI components, physical database tables, publication formats, external
providers, and module-specific implementation details.

## Canonical Entity Pattern

Every canonical entity should include:

- `id`.
- `entityType`.
- `canonicalIdentifier`.
- `schemaId`.
- `schemaVersion`.
- `status`.
- `version`.
- `sourceSystem`.
- `ownerId`.
- `stewardId`.
- `provenance`.
- `classification`.
- `qualityStatus`.
- `createdAt`.
- `updatedAt`.
- `effectiveFrom`.
- `effectiveUntil`.

## Example

```json
{
  "id": "work_01JABC123",
  "entityType": "WORK",
  "canonicalIdentifier": "work_01JABC123",
  "canonicalTitle": "Example Work",
  "originalLanguage": "fr",
  "firstPublicationYear": 1864,
  "contributors": [
    {
      "personId": "person_01JXYZ456",
      "role": "AUTHOR"
    }
  ],
  "rightsRecordId": "rights_01JRIGHTS1",
  "metadataSchemaVersion": "1.0.0",
  "status": "ACTIVE",
  "provenance": {
    "sourceType": "MANUAL_IMPORT",
    "sourceReference": "source_01JSRC123"
  }
}
```

## Canonical Domains

### Identity Master Data

Canonical entities:

- Person.
- Organization.
- Team.
- Role.
- Contributor.
- Author.
- Translator.
- Editor.
- Proofreader.
- Designer.
- Narrator.

IAM remains authoritative for identity and access. MDM governs editorial
relationships and shared metadata.

### Editorial Master Data

Canonical entities:

- Work.
- Edition.
- Publication.
- Manuscript.
- Chapter.
- Section.
- Paragraph.
- Segment.
- Annotation.
- Citation.
- Footnote.
- BibliographicReference.

### Translation Master Data

Canonical entities:

- SourceLanguage.
- TargetLanguage.
- TranslationProject.
- TranslationSegment.
- TranslationMemoryEntry.
- GlossaryEntry.
- TerminologyDecision.
- FalseFriend.
- DoctrinalTerm.
- ValidationStatus.

### Rights Master Data

Canonical entities:

- RightsHolder.
- Contract.
- License.
- Territory.
- LanguageRight.
- PublicationRight.
- TranslationRight.
- MediaRight.
- Restriction.

Rights and Provenance remains authoritative for functional rights decisions.
MDM publishes canonical references and shared metadata.

### Publication Master Data

Canonical entities:

- ISBN.
- ISSN.
- DOI.
- Title.
- Subtitle.
- ContributorCredit.
- EditionNumber.
- PublicationDate.
- Publisher.
- Format.
- Dimensions.
- DistributionChannel.
- AccessibilityMetadata.

### Media Master Data

Canonical entities:

- ImageAsset.
- Illustration.
- AudioAsset.
- VideoAsset.
- Transcript.
- Subtitle.
- Caption.
- VoiceProfile.
- RenderingProfile.
- AccessibilityAlternative.

### Reference Data

Canonical reference sets:

- Languages.
- Countries.
- Currencies.
- Timezones.
- EditorialFormats.
- PrintSizes.
- PublicationTypes.
- WorkflowStatuses.
- Categories.
- Genres.
- RightsTypes.
- ClassificationLevels.

## Identifier Strategy

Canonical identifiers should be:

- Stable.
- Globally unique within the platform.
- Opaque.
- Type-prefixed where useful.
- Never reused.
- Mapped to legacy and module-specific identifiers through explicit mapping
  records.

Existing identifiers must be preserved. Migration must create mappings rather
than silently replacing identifiers.

## JSON Master Relationship

JSON Master remains the structured editorial master format for publication
content and generated outputs. Data Governance defines canonical identifiers,
schemas, metadata, lineage, classification, and quality policy around JSON
Master records.

Derived files must reference:

- Master record.
- Master version.
- Generator version.
- Configuration profile.
- Generation timestamp.
