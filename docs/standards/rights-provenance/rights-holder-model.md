# Canonical Rights Holder Model

## Purpose

This document defines rights holder identity under Standard 13.

## Canonical Rights Holder Fields

Every rights holder record must preserve:

| Field | Description |
| --- | --- |
| `id` | Stable rights holder identifier |
| `person_or_organization_type` | Person, publisher, organization, estate, institution, agency, platform, or other holder type |
| `canonical_name` | Canonical holder name |
| `alternative_names` | Known aliases and historical names |
| `contact_information` | Authorized contact metadata |
| `jurisdiction` | Governing jurisdiction |
| `represented_by` | Agent, estate, agency, or legal representative |
| `verification_status` | Verification status |
| `source` | Evidence source for holder identity |
| `version` | Holder record version |
| `audit_information` | Audit linkage |

## Separation Rules

The rights holder must be distinguished from:

- Author.
- Translator.
- Editor.
- File owner.
- Uploader.
- Publisher.
- Contributor.
- AI agent.

One person may have several roles, but roles must not be collapsed into a
single rights assumption.

## Verification Rules

Rights holder verification must preserve:

- Source authority.
- Evidence.
- Jurisdiction.
- Representative authority where applicable.
- Date of verification.
- Reviewer.
- Change history.

## AI Rules

AI may suggest possible rights holder matches or identify inconsistencies.

AI may not definitively validate legal identity or grant rights holder
authority.

