# Article Management

## Purpose

Article Management defines how articles are used inside magazine issues while
remaining independent Library Items.

## Article Rule

Every magazine article must be a Library Item.

An article may exist:

- Before a magazine issue is planned.
- After publication.
- In multiple editions.
- In multiple languages.
- In multiple issues or publications when rights permit.

## Article Metadata

Each article should preserve:

- Article id.
- Library Item id.
- Title.
- Subtitle.
- Authors.
- Translators.
- Category or section.
- Keywords.
- Language.
- Summary.
- Main image.
- Rights references.
- Date.
- Translation refs.
- Review refs.
- Version refs.

## Current Baseline

Current support includes:

- Library item type `ARTICLE`.
- Library publication type `MAGAZINE`.
- Author Studio manuscript type `MAGAZINE_ARTICLE`.
- Project origin `MAGAZINE_ARTICLE`.
- Documents with article-like document types consumed by Magazine Digital
  Experience.
- Translation Workspace, Review Workspace, Rights Workspace, and Publishing
  Workspace integrations for document/article-level work.

## Reuse Rule

Article reuse must use references, not duplicated content.

Article placement in a magazine issue should be stored as assignment metadata
that references the Library Item and relevant document/version.

## Translation Integration

Articles may have:

- Original version.
- One or more translations.

Each translation follows the Translation Module.

## Editorial Review Integration

Every article must be approved before issue publication.

There are no exceptions.

## Current Gaps

- Magazine-specific article assignment records do not exist.
- Reuse across multiple issues is not yet modeled.
- Section/category assignment is not canonical.
- Article-level issue ordering is inferred rather than persisted.
- Article reuse rights are not evaluated as a magazine-specific operation.
