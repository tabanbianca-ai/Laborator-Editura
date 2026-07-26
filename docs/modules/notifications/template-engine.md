# Notification Template Engine

## Purpose

The Template Engine renders localized, versioned notification messages for
supported channels.

All user-facing communication text must come from templates and localization
resources. Modules must not hardcode outbound messages.

## Template First Rule

Every notification must reference:

- Template key.
- Template version.
- Locale.
- Channel.
- Rendering variables.
- Source event.

If no active template exists for a non-critical notification, the notification
must fail safely and create an audit event. Critical platform messages require
approved fallback templates.

## Localization

Template locale selection uses this order:

1. Recipient notification preference locale.
2. Recipient Platform Language.
3. Organization default Platform Language.
4. Approved fallback locale.

Changing Platform Language must not change manuscript content, original
language, authoring language, or target language.

## Template Variables

Variables must be declared before a template version is activated.

Examples:

- `projectTitle`.
- `documentTitle`.
- `workflowState`.
- `taskTitle`.
- `dueAt`.
- `approverName`.
- `resourceLink`.

Variable rendering must:

- Escape unsafe output.
- Avoid exposing restricted content.
- Fail if required variables are missing.
- Record rendered template version and variable keys in audit.

## Supported Template Features

Templates may support:

- Subject and body.
- Plain text body.
- HTML body for email when sanitized.
- In-app compact text.
- Push short text.
- Webhook payload mapping.
- Simple conditions.
- Branding profile references.
- Preview before activation.

## Template Versioning

Rules:

- Active versions cannot be overwritten.
- Edits create a new version.
- Historical deliveries keep the template version used.
- Template activation requires authorized human approval.
- AI may draft or suggest template copy, but it may not activate templates.

## Current Repository Baseline

No centralized runtime template engine was identified.

Related foundations:

- Frontend UI i18n exists for application interface text.
- Workspace preferences include language and notification preference metadata.
- Auth, Gateway, Scheduling, and module services contain user-facing or
  operational messages, but these are not yet routed through notification
  templates.

## Gap

The future engine must separate:

- UI localization dictionaries.
- Notification templates.
- Platform terminology.
- Domain content.
- External webhook payload mapping.

These should converge on shared localization and terminology governance
without duplicating user-facing strings.
