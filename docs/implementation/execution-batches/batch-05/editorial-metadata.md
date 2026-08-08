# Editorial Metadata

Canonical editorial metadata is versioned and attached to Work, Edition, Publication, or Library Record.

Supported fields include:

- `title`
- `subtitle`
- `alternative_titles`
- `author`
- `translator`
- `editor`
- `proofreader`
- `illustrator`
- `narrator`
- `language`
- `original_language`
- `edition`
- `original_edition`
- `first_edition_year`
- `publisher`
- `publication_place`
- `publication_date`
- `isbn`
- `issn`
- `doi`
- `subjects`
- `keywords`
- `description`
- `series`
- `volume`
- `rights`
- `license`
- `accessibility`

## Multilingual Metadata

Localizable metadata values may be represented by language:

```json
{
  "title": {
    "ro": "Titlu",
    "fr": "Titre",
    "es": "Titulo"
  }
}
```

The publication content language, UI language, and metadata display language are separate.
Changing Platform Language must not change publication-language metadata.

## Metadata History

Every meaningful metadata change preserves:

- `metadata_version`
- `changed_fields`
- `previous_values`
- `new_values`
- `changed_by`
- `changed_at`
- `reason`
