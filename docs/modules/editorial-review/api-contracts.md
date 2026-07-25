# Editorial Review API Contracts

## Purpose

This document defines the target API surface for the Proofreading and
Editorial Review Module and maps it to current APIs.

All APIs must be authenticated, tenant-aware, versioned, and protected by IAM,
RBAC, Need-to-Know access, and Workflow gates.

## Target Canonical API

Editorial reviews:

- `POST /editorial-reviews`.
- `GET /editorial-reviews/{id}`.
- `POST /editorial-reviews/search`.

Comments and observations:

- `POST /editorial-reviews/{id}/comments`.
- `POST /editorial-reviews/{id}/observations`.
- `POST /editorial-reviews/{id}/observations/{observationId}/resolve`.
- `POST /editorial-reviews/{id}/observations/{observationId}/reject`.
- `POST /editorial-reviews/{id}/observations/{observationId}/close`.

Corrections:

- `POST /editorial-reviews/{id}/proposals`.
- `POST /editorial-reviews/{id}/proposals/{proposalId}/accept`.
- `POST /editorial-reviews/{id}/proposals/{proposalId}/reject`.

Decisions:

- `POST /editorial-reviews/{id}/approve`.
- `POST /editorial-reviews/{id}/reject`.
- `POST /editorial-reviews/{id}/request-corrections`.

Version comparison:

- `POST /editorial-reviews/{id}/compare`.

## Current API Baseline

Editorial decisions:

- `POST /editorial-decisions/recommendations`.
- `GET /editorial-decisions/recommendations/:id`.
- `POST /editorial-decisions/recommendations/:id/approve`.
- `POST /editorial-decisions/recommendations/:id/reject`.

Collaboration:

- `POST /collaboration/threads`.
- `GET /collaboration/threads/:id`.
- `POST /collaboration/threads/:id/comments`.
- `POST /collaboration/comments/:id/resolve`.

Terminology:

- `POST /terminology/check-segment`.
- Term create, propose, evaluate, under-review, validate, reject, suspend, and
  archive routes.

QA:

- Segment and document QA run routes.
- QA issue list and resolve routes.
- QA score recalculation routes.

Semantic Fidelity:

- Segment and document semantic check routes.
- Semantic issue list and resolve routes.
- Semantic score recalculation routes.

Workflow:

- Workflow status and transition routes.
- Document approval route used by the Review Workspace.

## Contract Rules

- API clients must not send `x-user-id`, `x-organization-id`, or
  `x-user-roles`.
- Identity must come from the authenticated server-derived request context.
- AI recommendations must include human approval state.
- Human approval routes must require authorized roles.
- Editorial Review must not bypass Workflow, Rights, Publishing, or Library
  constraints.

## Gaps

- The canonical `/editorial-reviews` API does not yet exist.
- Current review behavior is spread across existing APIs.
- Versioned public route naming is not yet visible in route paths.
- Review observation search is not yet a canonical endpoint.
