# Accessibility API Contracts

## Purpose

This document defines the target API contract surface for the Accessibility,
Localization and Inclusive Experience Module.

The current repository does not yet expose these endpoints as a dedicated
Accessibility module. These contracts are implementation targets for a future
additive phase.

## Contract Rules

- Administrative endpoints require authenticated server-derived request
  context.
- Permissions are enforced through IAM, RBAC, Need-to-Know, Configuration, and
  Data Governance classification.
- APIs are versioned.
- Mutations are auditable.
- AI suggestions cannot approve accessibility compliance or publication.

## Accessibility Profiles

```http
GET /accessibility/profiles
POST /accessibility/profiles
GET /accessibility/profiles/:id
POST /accessibility/profiles/:id/activate
```

## Localization Resources

```http
GET /localization/resources
POST /localization/resources
GET /localization/resources/:id
POST /localization/resources/:id/publish
```

## Captions

```http
GET /captions
POST /captions
GET /captions/:id
POST /captions/:id/validate
```

## Transcripts

```http
GET /transcripts
POST /transcripts
GET /transcripts/:id
POST /transcripts/:id/validate
```

## Audio Descriptions

```http
GET /audio-descriptions
POST /audio-descriptions
GET /audio-descriptions/:id
```

## Validation

```http
POST /accessibility/validate
GET /accessibility/validation-reports
GET /accessibility/validation-reports/:id
```

## Current Related APIs

Existing related surfaces are distributed across:

- Workspace preferences.
- Media Localization projects and assets.
- Multimedia Creation projects and assets.
- Publishing and Export.
- Library and Public Portal.
- Configuration.
- Data Governance.
- Observability.
