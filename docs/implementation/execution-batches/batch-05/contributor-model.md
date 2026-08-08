# Contributor Model

Contributors are canonical people or organizations. Their roles in an Edition are modeled separately.

Contributor fields:

- `contributor_id`
- `organization_id`
- `canonical_name`
- `display_name`
- `alternative_names`
- `contributor_type`
- `birth_date`
- `death_date`
- `organization`
- `identifiers`
- `metadata`
- `verification_status`

Edition contributor fields:

- `edition_contributor_id`
- `organization_id`
- `edition_id`
- `contributor_id`
- `role`
- `credit_order`
- `display_credit`

Roles:

- `AUTHOR`
- `TRANSLATOR`
- `EDITOR`
- `PROOFREADER`
- `ILLUSTRATOR`
- `NARRATOR`
- `PREFACE_AUTHOR`
- `ANNOTATOR`
- `DESIGNER`
- `OTHER`

Rules:

- Original author attribution is preserved.
- Translator attribution is preserved separately.
- Display credit may differ from canonical name but must remain traceable.
