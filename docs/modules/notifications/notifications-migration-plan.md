# Notification and Communication Migration Plan

## Purpose

This document defines the incremental path from the current repository
baseline to the official Notification and Communication Module.

Migration must be additive and must preserve validated Phase 7 Step 16
publishing, final preflight, distribution, Workflow, Gateway, Scheduling,
Workspace, Auth, Security, audit, and backup behavior.

## Constraints

- Do not duplicate communication engines inside modules.
- Do not move domain decisions into Notification Engine.
- Do not weaken tenant isolation, RBAC, Need-to-Know, or audit.
- Do not bypass user preferences except for policy-defined mandatory messages.
- Do not store secrets in templates or notification payloads.
- Do not expose restricted content through external channels.
- Do not break existing Gateway webhook APIs.
- Do not implement external providers without explicit scheduling.

## Phase 1 - Baseline Mapping

Status: current documentation phase.

Deliverables:

- Inventory existing communication mechanisms.
- Inventory webhook registry and delivery logs.
- Inventory scheduling reminders and workspace preferences.
- Identify scattered communication-like logic.
- Document gaps, risks, and dependencies.

## Phase 2 - Domain Contracts

Define:

- `Notification`.
- `NotificationTemplate`.
- `NotificationTemplateVersion`.
- `NotificationPreference`.
- `NotificationDelivery`.
- `NotificationDeliveryAttempt`.
- `NotificationQueueItem`.
- `NotificationRetryPolicy`.
- `NotificationDeadLetterItem`.
- `CommunicationAuditEvent`.

No runtime migration occurs in this phase.

## Phase 3 - Template Foundation

Add versioned localized template metadata.

Rules:

- Templates start as draft.
- Active template versions are immutable.
- Activation requires authorized human approval.
- AI may draft but may not activate templates.

## Phase 4 - Preference Model

Create typed notification preferences and align existing Workspace preference
metadata.

Rules:

- Current workspace preferences remain compatible.
- Mandatory notifications remain governed by policy.
- Platform Language and recipient preference locale are preserved.

## Phase 5 - Notification Record Foundation

Implement central notification records and delivery metadata without sending
external messages.

Rules:

- Domain modules create notification requests.
- Notification Engine owns rendering and routing metadata.
- Existing module behavior remains unchanged until integration is validated.

## Phase 6 - Channel Router

Implement preference-aware channel selection.

Rules:

- In-app is the baseline channel.
- External channels require configured integrations.
- Need-to-Know redaction applies before external delivery.

## Phase 7 - Delivery Queue and Retry

Introduce asynchronous delivery metadata:

- Delivery queue.
- Retry queue.
- Dead letter queue.
- Idempotency keys.
- Attempt logs.

## Phase 8 - In-App Notifications

Implement authenticated in-app notification delivery.

Rules:

- Tenant-scoped.
- Recipient-scoped.
- Need-to-Know filtered.
- Audited.

## Phase 9 - Email Adapter Metadata

Introduce email delivery adapter abstraction.

Rules:

- Secrets come from Secret Vault or integration metadata.
- Delivery remains template-based.
- Auth password reset and email verification may migrate after compatibility
  tests.

## Phase 10 - Webhook Dispatch Integration

Connect Gateway webhook registry to Notification dispatch.

Rules:

- Preserve existing Gateway APIs.
- Use HMAC signatures.
- Use versioned payload contracts.
- Record delivery attempts and retries.

## Phase 11 - Workflow Adoption

Connect Workflow Engine to Notification Engine for:

- Task assignment.
- Approval requests.
- SLA warnings.
- Escalations.
- Blocked workflow alerts.
- Publication readiness.

## Phase 12 - Observability and Scale

Add:

- Delivery rate metrics.
- Failure rate metrics.
- Queue backlog metrics.
- Retry and DLQ metrics.
- Channel adapter health.
- Correlation tracing.

## Testing Requirements

Each phase requires:

- Contract tests.
- Tenant isolation tests.
- Need-to-Know tests.
- Template version tests.
- Localization tests.
- Preference routing tests.
- Queue retry tests.
- Webhook signature tests.
- Delivery audit tests.
- Backup/restore tests when persistence changes.
- Regression tests for Workflow, Gateway, Scheduling, Auth, and Phase 7 Step
  16 publishing/preflight/distribution.

## Next Recommended Module

Module 12 - Identity, Access Management and Security Module Architecture is
now documented after Notification and Communication.

Module 13 - Observability, Monitoring and Audit Module Architecture is now
documented after Identity, Access Management and Security.

Module 14 - Backup, Disaster Recovery and Business Continuity Module
Architecture is now documented after Observability, Monitoring and Audit.

Module 15 - Search, Indexing and Knowledge Graph Module Architecture is now
documented after Backup, Disaster Recovery and Business Continuity.

Module 16 - Integration, API Gateway and External Connectors Module
Architecture is now documented after Search, Indexing and Knowledge Graph.

Module 17 - Configuration, Feature Flags and Platform Administration Module
Architecture is now documented after Integration, API Gateway and External
Connectors.

Module 18 - Data Governance, Metadata and Master Data Management Module
Architecture is now documented after Configuration, Feature Flags and Platform
Administration.

Module 19 - Accessibility, Localization and Inclusive Experience Module
Architecture is now documented after Data Governance, Metadata and Master Data
Management.

Module 20 - Analytics, Business Intelligence and Decision Support Module
Architecture is now documented after Accessibility, Localization and Inclusive
Experience.

Module 21 - AI Governance, Model Management and Responsible AI Module
Architecture is now documented after Analytics, Business Intelligence and
Decision Support.

Module 22 - DevSecOps, CI/CD, Release and Platform Operations Module
Architecture is now documented after AI Governance, Model Management and
Responsible AI.

The next recommended module specification after DevSecOps, CI/CD, Release
and Platform Operations is Module 23 - Quality Assurance, Testing and
Validation Module Architecture.
