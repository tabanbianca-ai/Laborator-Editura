# Canonical Contracts and Licenses Standard

## Purpose

This document defines contract and license records under Standard 13.

## Canonical Contract or License Fields

Every contract or license must define:

| Field | Description |
| --- | --- |
| `id` | Stable record identifier |
| `document_id` | Source document or file reference |
| `contract_type` | Contract, license, permission, declaration, consent, internal authorization, or other type |
| `parties` | Parties involved |
| `covered_resources` | Resources covered by the instrument |
| `granted_rights` | Rights explicitly granted |
| `excluded_rights` | Rights explicitly excluded |
| `languages` | Languages covered |
| `territories` | Territories covered |
| `formats` | Formats covered |
| `channels` | Channels covered |
| `commercial_terms` | Commercial or non-commercial terms |
| `valid_from` | Start of validity |
| `valid_until` | End of validity |
| `renewal_terms` | Renewal rules |
| `termination_terms` | Termination rules |
| `restrictions` | Usage restrictions |
| `signature_status` | Signature or acceptance state |
| `verification_status` | Verification state |
| `owner` | Internal record owner |
| `version` | Version |

The contract file does not replace structured data needed for automated
verification.

## Versioning Rules

- Contracts and licenses must be versioned.
- Amendments must create new versions or linked amendment records.
- Previous versions remain auditable.
- Expiration and revocation do not delete history.

## Evidence Rules

Evidence must preserve:

- Source file or reference.
- Signature or acceptance status.
- Parties.
- Extracted structured terms.
- Reviewer.
- Verification date.
- Audit reference.

## AI Rules

AI may summarize, extract, or flag missing license and contract information.

AI may not provide final legal interpretation, grant rights, or approve
contracts.

