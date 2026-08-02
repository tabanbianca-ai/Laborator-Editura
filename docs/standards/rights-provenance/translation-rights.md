# Canonical Translation Rights Standard

## Purpose

This document defines translation rights requirements under Standard 13.

## Required Translation Fields

Every translation must preserve:

| Field | Description |
| --- | --- |
| `source_work_id` | Original work identifier |
| `source_edition_id` | Source edition identifier |
| `source_language` | Source language |
| `target_language` | Target translation language |
| `translator_id` | Translator identity |
| `translation_right_record_id` | Translation rights record |
| `translation_contract_id` | Translation contract reference |
| `territories` | Authorized territories |
| `formats` | Authorized formats |
| `approval_status` | Approval status |
| `publication_restrictions` | Restrictions on publication |

## Separation Rules

The platform must distinguish:

- Rights over the original work.
- Translation right.
- Translator rights over the translation.
- Publishing rights for the resulting edition.

## Blocking Rules

Translation or publication must be blocked when:

- Translation right is missing.
- Target language is not authorized.
- Territory is not authorized.
- Format is not authorized.
- Translator rights or contract status is unclear.
- Publication restrictions are unresolved.

AI may assist with risk detection but may not authorize translation rights.

