# DevSecOps Events

## Purpose

DevSecOps events define the official event vocabulary for builds, security
scans, artifacts, releases, deployments, rollback, infrastructure changes, and
secret rotation.

Events must be typed, auditable, traceable to source commits, and compatible
with Observability, Analytics, Notifications, and Backup.

## Official Events

### BuildStarted

Emitted when a build starts.

Payload:

- `buildId`.
- `pipelineRunId`.
- `sourceCommit`.
- `buildNumber`.
- `startedBy`.
- `startedAt`.

### BuildSucceeded

Emitted when a build succeeds.

Payload:

- `buildId`.
- `sourceCommit`.
- `durationMs`.
- `artifactRefs`.
- `completedAt`.

### BuildFailed

Emitted when a build fails.

Payload:

- `buildId`.
- `sourceCommit`.
- `failedStage`.
- `errorSummary`.
- `completedAt`.

### SecurityScanCompleted

Emitted when a security scan completes.

Payload:

- `scanId`.
- `pipelineRunId`.
- `sourceCommit`.
- `status`.
- `findingsSummary`.
- `completedAt`.

### ArtifactPublished

Emitted when an immutable artifact is published.

Payload:

- `artifactId`.
- `version`.
- `checksum`.
- `sourceCommit`.
- `registryRef`.
- `publishedAt`.

### ReleaseCreated

Emitted when a release candidate is created.

Payload:

- `releaseId`.
- `semanticVersion`.
- `sourceCommit`.
- `artifactRefs`.
- `createdBy`.
- `createdAt`.

### DeploymentStarted

Emitted when deployment starts.

Payload:

- `deploymentId`.
- `releaseId`.
- `environment`.
- `sourceCommit`.
- `startedBy`.
- `startedAt`.

### DeploymentSucceeded

Emitted when deployment succeeds.

Payload:

- `deploymentId`.
- `releaseId`.
- `environment`.
- `verificationStatus`.
- `completedAt`.

### DeploymentFailed

Emitted when deployment fails.

Payload:

- `deploymentId`.
- `releaseId`.
- `environment`.
- `errorSummary`.
- `completedAt`.

### RollbackExecuted

Emitted when a rollback is executed.

Payload:

- `rollbackId`.
- `deploymentId`.
- `targetReleaseId`.
- `targetCommit`.
- `reason`.
- `executedBy`.
- `executedAt`.

### InfrastructureChanged

Emitted when infrastructure-as-code changes are applied.

Payload:

- `infrastructureChangeId`.
- `sourceCommit`.
- `environment`.
- `changeSummary`.
- `approvedBy`.
- `appliedAt`.

### SecretRotated

Emitted when a secret is rotated.

Payload:

- `secretRefId`.
- `secretType`.
- `environmentScope`.
- `rotatedBy`.
- `rotatedAt`.

## Event Rules

- Events must include source commit where applicable.
- Events must include actor identity or service identity.
- Events must not include secret values.
- Deployment and rollback events must include environment scope.
- Production-impacting events must be auditable.
- Events must be usable by Observability, Analytics, Notifications, and audit
  review.
