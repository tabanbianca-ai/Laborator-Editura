# Manuscript Import Pipeline

The canonical import preview contract is `ManuscriptImportPreview`.

## Supported v1.0 Inputs

- DOCX
- TXT
- Markdown
- HTML
- JSON Master
- PDF as an unsafe/low-confidence source only

## Pipeline

1. Upload
2. Virus / file validation
3. Format detection
4. Content extraction
5. Structure analysis
6. Preview
7. Human confirmation
8. Canonical Master creation

## Rules

- Import preview does not overwrite existing canonical content.
- Human confirmation is required before master creation or replacement.
- PDF must not be trusted as structured editorial source without review.
- Organization and project context must be server-derived.
- Import failures must use stable API errors and leave no partial canonical master.

## Current Implementation Mapping

- Author Studio supports manuscript and section creation.
- Documents and segments support canonical editable text records.
- JSON Master validation exists in `packages/shared/src/json-master-format`.
- Full upload processing remains a future implementation step.
