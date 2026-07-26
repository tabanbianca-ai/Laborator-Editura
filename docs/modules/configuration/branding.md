# Branding Configuration

## Purpose

Branding Configuration allows organizations to customize approved visual and
document presentation metadata without changing application code.

## Scope

Branding configuration includes:

- Logo.
- Colors.
- Fonts.
- Favicon.
- PDF branding.
- Email templates.
- Organization name.
- Domains.
- Export artifact presentation metadata.

## Current Repository Baseline

Branding metadata is partially represented in:

- `apps/api/src/modules/enterprise-admin` organization profile metadata,
  including `logoUrl`, `branding`, `timezone`, and `currency`.
- Frontend styling in `apps/web/app/globals.css`.
- UI components and layout shells.
- Publishing and export metadata where author, translator, original source,
  and publication metadata are displayed.

There is no dedicated central Branding Service yet.

## Required Branding Profile

Each branding profile should include:

- `id`.
- `organizationId`.
- `organizationName`.
- `logo`.
- `favicon`.
- `colorPalette`.
- `fontSet`.
- `documentBranding`.
- `emailBranding`.
- `domainConfiguration`.
- `version`.
- `status`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

## Rules

- Branding must be tenant-scoped.
- Branding changes must be versioned and auditable.
- Branding must not override legal provenance, author attribution, translator
  attribution, rights metadata, or required publication metadata.
- Branding assets must be stored through approved asset storage, not embedded
  as hardcoded runtime values.
- UI text remains controlled by localization, not branding.

## Future Migration

The current organization branding metadata can become the initial source for
future `BrandingProfile` records. Frontend and export generators should migrate
incrementally to consume branding through Configuration Service contracts.
