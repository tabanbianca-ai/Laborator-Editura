# License Management

## Purpose

License Management defines how usage permissions, public domain claims,
Creative Commons permissions, proprietary licenses, and internal/custom
licenses are recorded and validated.

## Supported License Types

The target module supports:

- Public Domain.
- All Rights Reserved.
- Creative Commons.
- Proprietary License.
- Internal License.
- Custom License.

Each license must be versioned.

## Target License Entity

Canonical fields:

- `id`.
- `organizationId`.
- `licenseType`.
- `name`.
- `version`.
- `jurisdiction`.
- `licenseTextRef`.
- `rightsGranted`.
- `restrictions`.
- `effectiveFrom`.
- `effectiveUntil`.
- `sourceReference`.
- `validatedBy`.
- `validatedAt`.
- `auditTrail`.

## Current Baseline

License support currently appears as metadata in:

- Library publication records through `license`.
- Public Portal rights metadata through `license`.
- Rights notes and document metadata.

There is no first-class versioned License entity yet.

## License Validation

Before publication or reuse, validation should verify:

- License exists.
- License is valid for the requested format.
- License is valid for the requested language.
- License is valid for the requested territory.
- License is not expired.
- License restrictions do not conflict with the intended action.

## Current Gaps

- Licenses are not first-class versioned records.
- License text/reference handling is not standardized.
- Creative Commons and custom-license rules are not modeled.
- License expiration checks are not centralized.
- License compatibility with audio, video, print, digital, and translation
  uses is not modeled.

## AI Rule

AI may summarize a license or flag missing/expired terms.

AI must not interpret a license as final legal authority, grant rights, or
approve publication.
