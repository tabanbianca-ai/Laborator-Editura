# Glossary Management

## Purpose

Glossary Management defines how specialized terminology is grouped, governed,
and applied during translation.

## Glossary Levels

The official glossary hierarchy is:

```text
Project Glossary
  -> Platform Glossary
  -> Personal Glossary
```

Personal glossary entries are optional suggestions only.

## Current Implementation Baseline

Current implementation represents glossary behavior through the Terminology
module:

- `GlossaryScope`: `PROJECT`, `PLATFORM`, `PERSONAL`.
- Project linguistic source priority.
- Terminology audit actions for glossary creation, updates, conflicts, source
  priority changes, and confidence recalculation.

## Supported Glossary Examples

- Spiritism.
- Editorial.
- Children's literature.
- Technical.
- Legal.
- Philosophy.
- Medicine.

## Term Metadata

Glossary terms should preserve:

- Source term.
- Target term or approved translation.
- Definition.
- Notes.
- Status.
- Sources.
- Domain.
- Language.
- Project reference.
- Source authority.
- Human approval metadata.

## Priority Rules

Default consultation order:

1. Official normative source.
2. Project glossary.
3. Specialized glossary.
4. Translation Memory.
5. Bilingual dictionary.
6. Explanatory dictionary.
7. Corpus/examples.

Validated terminology remains above Translation Memory and AI suggestions.

## Current Gaps

- Dedicated glossary entity records are not fully separate from terminology
  term records.
- Glossary import/export workflow is not specified yet.
- Visual conflict review workflow is not fully implemented.
- Drag-and-drop source priority is represented in metadata and API, but richer
  UI behavior remains future work.
