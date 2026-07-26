# Notification and Communication API Contracts

## Purpose

This document defines current related APIs and target API contracts for the
Notification and Communication Module.

All APIs are versioned and must enforce authenticated, server-derived request
context unless explicitly approved as public.

## Current Related APIs

Gateway:

- `POST /webhooks`.
- `GET /webhooks`.
- `POST /webhooks/:id/enable`.
- `POST /webhooks/:id/disable`.
- `GET /gateway/routes`.

Scheduling:

- `POST /scheduling/reminders`.
- `GET /scheduling/agenda`.

Workspace:

- `GET /workspace/preferences`.
- `POST /workspace/preferences`.

Auth:

- Password reset and email verification request records exist, but message
  delivery is not centralized.

## Target Notification APIs

### Create Notification

```http
POST /notifications
```

Creates a notification request from an application event or authorized module
request.

### Get Notification

```http
GET /notifications/{id}
```

Returns notification metadata for an authorized recipient or administrator.

### Send Notification

```http
POST /notifications/send
```

Queues rendering and delivery for an existing notification.

### List Templates

```http
GET /notification-templates
```

Lists templates visible to authorized administrators.

### Create Template

```http
POST /notification-templates
```

Creates a draft template.

### Create Template Version

```http
POST /notification-templates/{id}/versions
```

Creates a new template version.

### Activate Template Version

```http
POST /notification-templates/{id}/versions/{version}/activate
```

Requires authorized human approval.

### Preferences

```http
GET /notification-preferences
POST /notification-preferences
```

Reads and updates user preferences.

### Delivery Status

```http
GET /delivery-status
GET /delivery-status/{id}
```

Returns delivery metadata.

## Target Webhook Dispatch APIs

Gateway webhook registration APIs remain compatible.

Future notification dispatch APIs may include:

```http
GET /notification-webhooks/deliveries
POST /notification-webhooks/deliveries/{id}/retry
```

## API Rules

- Controllers must not contain business logic.
- API access must use server-derived authenticated context.
- Tenant isolation and Need-to-Know filtering are mandatory.
- User preference APIs may only update the current user's preferences unless
  an authorized administrator is acting under explicit policy.
- Template activation requires authorized human approval.
- AI may draft templates or recommend routing rules but may not activate
  templates, enable channels, or override preferences.
- External payloads must be redacted when the recipient channel is not
  authorized to receive restricted content.

## Compatibility Rule

Existing Gateway, Scheduling, Workspace, Auth, Workflow, Publishing,
Distribution, and Phase 7 Step 16 APIs must remain compatible during
incremental migration.
