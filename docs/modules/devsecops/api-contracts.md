# DevSecOps API Contracts

## Purpose

This document defines the target API contract surface for the DevSecOps,
CI/CD, Release and Platform Operations Module.

These contracts are documentation-only until an implementation phase is
explicitly scheduled.

## API Rules

- DevSecOps APIs are authenticated.
- DevSecOps APIs are versioned.
- IAM and Need-to-Know visibility apply server-side.
- Production-impacting operations require explicit authorization.
- Secrets must never be returned.
- Destructive operations require confirmation and audit.
- Manual production operations outside approved emergency procedure are not
  allowed.

## Builds

### List Builds

`GET /devops/builds`

Returns build records visible to the authenticated actor.

### Create Build

`POST /devops/builds`

Creates or records a build execution.

Request fields:

- `sourceCommit`.
- `pipelineId`.
- `buildNumber`.
- `version`.
- `metadata`.

## Releases

### List Releases

`GET /devops/releases`

Returns governed releases.

### Create Release

`POST /devops/releases`

Creates a release candidate.

Request fields:

- `semanticVersion`.
- `releaseNotes`.
- `deploymentPlan`.
- `rollbackPlan`.
- `artifactRefs`.

## Deployments

### List Deployments

`GET /devops/deployments`

Returns deployment records visible to the actor.

### Create Deployment

`POST /devops/deployments`

Creates or records a deployment.

Request fields:

- `releaseId`.
- `environmentId`.
- `artifactRefs`.
- `deploymentPlan`.
- `approvalRef`.

## Rollback

### Execute Rollback

`POST /devops/rollback`

Executes or records an authorized rollback.

Request fields:

- `deploymentId`.
- `targetReleaseId`.
- `targetCommit`.
- `reason`.
- `confirmation`.

## Artifacts

### List Artifacts

`GET /devops/artifacts`

Returns artifact metadata visible to the actor.

## Current Repository Baseline

No runtime `/devops/*` API exists yet. Current DevSecOps actions are handled
through GitHub Actions, scripts, Docker Compose, infrastructure runbooks, and
manual workflow dispatch with environment secrets.

## Error Handling

DevSecOps APIs should return safe errors:

- `401` when authenticated context is missing.
- `403` when the actor lacks permission.
- `404` when a visible resource does not exist.
- `409` when a release, deployment, or rollback conflict exists.
- `422` when required approval, artifact, environment, or confirmation data
  is invalid.

Errors must not expose secrets or restricted infrastructure metadata.
