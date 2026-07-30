# DevSecOps Domain Model

## Purpose

This document defines the conceptual domain model for the DevSecOps, CI/CD,
Release and Platform Operations Module.

The model is technology-independent and describes the entities required for
source control, build automation, release management, deployment, rollback,
Infrastructure as Code, secrets, artifacts, operational runbooks, incidents,
and audit.

## Aggregate Ownership

DevSecOps owns:

- Repository.
- Branch Policy.
- Pull Request Policy.
- Pipeline Definition.
- Pipeline Run.
- Build.
- Build Stage.
- Security Scan.
- Artifact.
- Release.
- Release Approval.
- Environment.
- Deployment.
- Rollback.
- Infrastructure Definition.
- Infrastructure Change.
- Secret Reference.
- Operational Runbook.
- Platform Operation.
- Incident Record.
- DevSecOps Audit Event.

DevSecOps does not own application domain records, editorial workflow state,
business audit source records, or runtime content data.

## Repository

Represents a source control repository.

Fields:

- `repositoryId`.
- `name`.
- `url`.
- `defaultBranch`.
- `branchStrategy`.
- `protectedBranches`.
- `reviewPolicy`.
- `mergePolicy`.
- `createdAt`.
- `updatedAt`.

## Branch Policy

Represents source control rules.

Fields:

- `branchPolicyId`.
- `repositoryId`.
- `branchPattern`.
- `requiredReviews`.
- `requiredStatusChecks`.
- `signedCommitsRequired`.
- `linearHistoryRequired`.
- `forcePushAllowed`.
- `createdAt`.
- `updatedAt`.

## Pipeline Definition

Represents a CI or CD pipeline definition.

Fields:

- `pipelineId`.
- `name`.
- `pipelineType`.
- `trigger`.
- `stages`.
- `requiredApprovals`.
- `environmentScope`.
- `sourceFileRef`.
- `createdAt`.
- `updatedAt`.

Pipeline types:

- `CI`.
- `CD`.
- `OPERATIONS`.
- `SECURITY`.
- `BACKUP`.
- `ROLLBACK`.

## Pipeline Run

Represents one pipeline execution.

Fields:

- `pipelineRunId`.
- `pipelineId`.
- `triggeredBy`.
- `sourceCommit`.
- `status`.
- `startedAt`.
- `completedAt`.
- `durationMs`.
- `logsRef`.
- `artifacts`.
- `auditRefs`.

Statuses:

- `PENDING`.
- `RUNNING`.
- `SUCCEEDED`.
- `FAILED`.
- `CANCELLED`.
- `APPROVAL_REQUIRED`.

## Build

Represents a build execution.

Fields:

- `buildId`.
- `pipelineRunId`.
- `sourceCommit`.
- `buildNumber`.
- `version`.
- `status`.
- `dependencies`.
- `securityStatus`.
- `startedAt`.
- `completedAt`.

## Artifact

Represents an immutable build artifact.

Fields:

- `artifactId`.
- `version`.
- `checksum`.
- `buildNumber`.
- `sourceCommit`.
- `dependencies`.
- `securityStatus`.
- `publicationStatus`.
- `registryRef`.
- `createdAt`.

## Release

Represents a governed release.

Fields:

- `releaseId`.
- `semanticVersion`.
- `releaseNotes`.
- `deploymentPlan`.
- `rollbackPlan`.
- `approvalHistory`.
- `deploymentStatus`.
- `artifactRefs`.
- `createdBy`.
- `createdAt`.

## Environment

Represents a controlled runtime environment.

Fields:

- `environmentId`.
- `name`.
- `environmentType`.
- `approvalRequired`.
- `configurationRefs`.
- `secretRefs`.
- `deploymentPolicy`.
- `createdAt`.
- `updatedAt`.

Environment types:

- `DEVELOPMENT`.
- `TESTING`.
- `STAGING`.
- `PRODUCTION`.

## Deployment

Represents a deployment operation.

Fields:

- `deploymentId`.
- `releaseId`.
- `environmentId`.
- `sourceCommit`.
- `artifactRefs`.
- `deploymentPlan`.
- `status`.
- `startedBy`.
- `approvedBy`.
- `startedAt`.
- `completedAt`.
- `verificationStatus`.

## Rollback

Represents a rollback operation.

Fields:

- `rollbackId`.
- `deploymentId`.
- `targetReleaseId`.
- `targetCommit`.
- `reason`.
- `approvedBy`.
- `executedBy`.
- `executedAt`.
- `verificationStatus`.

## Infrastructure Definition

Represents versioned Infrastructure as Code.

Fields:

- `infrastructureDefinitionId`.
- `type`.
- `sourceRef`.
- `version`.
- `checksum`.
- `environmentScope`.
- `validatedAt`.
- `createdAt`.

Infrastructure types:

- `DOCKER`.
- `DOCKER_COMPOSE`.
- `KUBERNETES`.
- `HELM`.
- `TERRAFORM`.
- `ANSIBLE`.
- `GITOPS_MANIFEST`.
- `NGINX`.
- `SYSTEMD`.

## Secret Reference

Represents metadata for a secret managed outside source code.

Fields:

- `secretRefId`.
- `name`.
- `secretType`.
- `provider`.
- `environmentScope`.
- `rotationPolicy`.
- `lastRotatedAt`.
- `auditRefs`.

Secret values must not be stored in source code or returned through DevSecOps
APIs.

## DevSecOps Audit Event

Represents an immutable operational audit event.

Fields:

- `auditEventId`.
- `actorId`.
- `organizationId`.
- `action`.
- `resourceType`.
- `resourceId`.
- `sourceCommit`.
- `environment`.
- `beforeState`.
- `afterState`.
- `createdAt`.
