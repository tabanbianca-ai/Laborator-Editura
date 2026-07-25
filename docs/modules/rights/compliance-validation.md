# Compliance Validation

## Purpose

Compliance Validation determines whether an editorial resource can be
translated, adapted, published, distributed, printed, converted to audio,
converted to video, or reused.

## Validation Inputs

The validation engine should evaluate:

- Rights records.
- Provenance records.
- License records.
- Contract records.
- Rights holder state.
- Jurisdiction.
- Territory.
- Language.
- Format.
- Expiration date.
- Embargo date.
- Usage restrictions.
- Workflow state.

## Supported Restrictions

Examples:

- Internal use only.
- No digital distribution.
- No printing.
- No audiobook.
- No translation.
- Limited geographic distribution.
- Embargo until a defined date.
- No commercial distribution.
- No adaptation.

## Current Baseline

Current validation foundations include:

- Translation authorization warnings.
- Publishing authorization warnings.
- Expiration warning for translation authorization.
- Publishing workspace and Distribution Center rights warnings.
- Publishing preflight rights validation.
- Phase 7 Step 16 rights/provenance blocking behavior.

## Target Validation Verdict

Each validation should return:

- `allowed`.
- `blocked`.
- `warnings`.
- `requiredRights`.
- `missingRights`.
- `expiredRights`.
- `conflictingRestrictions`.
- `contractRefs`.
- `licenseRefs`.
- `provenanceRefs`.
- `auditReference`.

## Blocking Rules

Publication must be blocked when:

- Required rights are missing.
- Contract is invalid or expired.
- License is expired.
- Requested format is not allowed.
- Requested territory is not allowed.
- Requested language is not allowed.
- Provenance is missing or invalid.
- Rights restrictions conflict with the intended action.

## Current Gaps

- There is no canonical validation endpoint such as
  `POST /rights/{id}/verify`.
- Validation is warning-based and partially client-side for workspace display.
- License and contract validation are not first-class.
- Territory, language, and format compatibility checks need a generalized
  rules model.
- Asynchronous expiration checks are not implemented.

## Compliance Rule

All compliance decisions must be reusable by Library, Translation, Publishing,
Audio, Video, Public Portal, Commerce, and Quality Agent through public Rights
contracts.
