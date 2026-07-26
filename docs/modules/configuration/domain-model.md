# Configuration Domain Model

## Purpose

This document defines the canonical domain model for the Configuration,
Feature Flags and Platform Administration Module.

## Aggregate Ownership

Configuration owns governed configuration metadata. It does not own domain
business data, identity source of truth, secret values, external provider
execution, or source module audit records.

| Entity | Owner | Purpose |
| --- | --- | --- |
| `ConfigurationEntry` | Configuration | Versioned configuration key, value reference, scope, type, and status. |
| `ConfigurationVersion` | Configuration | Immutable version snapshot for an entry or configuration set. |
| `ConfigurationSet` | Configuration | Grouped configuration for environment, tenant, project, or module scope. |
| `FeatureFlag` | Configuration | Runtime feature activation policy and rollout metadata. |
| `FeatureFlagEvaluation` | Configuration | Auditable flag evaluation metadata where persistence is required. |
| `EnvironmentDefinition` | Configuration | Development, testing, staging, production, or future environment metadata. |
| `TenantConfiguration` | Configuration | Organization-specific module, language, branding, and security settings. |
| `BrandingProfile` | Configuration | Organization branding and presentation metadata. |
| `LocalizationProfile` | Configuration | Platform language, locale, timezone, currency, and unit settings metadata. |
| `ModuleAdministrationProfile` | Configuration | Module enablement, limits, dependency, and readiness metadata. |
| `ConfigurationAuditEvent` | Configuration | Immutable audit record for configuration and administration actions. |

## ConfigurationEntry

Required fields:

- `id`.
- `organizationId` when tenant-scoped.
- `projectId` when project-scoped.
- `environmentId` when environment-scoped.
- `moduleName` when module-scoped.
- `configurationKey`.
- `value`.
- `dataType`.
- `scope`.
- `version`.
- `status`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Data types:

- `STRING`.
- `NUMBER`.
- `BOOLEAN`.
- `JSON`.
- `SECRET_REFERENCE`.
- `ENUM`.
- `LIST`.

Scopes:

- `GLOBAL`.
- `ENVIRONMENT`.
- `ORGANIZATION`.
- `PROJECT`.
- `MODULE`.
- `USER_PREFERENCE`.

Statuses:

- `DRAFT`.
- `ACTIVE`.
- `SUSPENDED`.
- `ARCHIVED`.

## ConfigurationVersion

Required fields:

- `id`.
- `configurationEntryId`.
- `version`.
- `previousVersion`.
- `value`.
- `changeReason`.
- `approvedBy`.
- `approvedAt`.
- `createdBy`.
- `createdAt`.
- `rollbackSupported`.

Rules:

- Versions are immutable.
- Updates create new versions.
- Rollback creates a new version referencing the restored version.

## FeatureFlag

Required fields:

- `id`.
- `organizationId` when tenant-scoped.
- `name`.
- `description`.
- `enabled`.
- `rolloutStrategy`.
- `targetScope`.
- `activationConditions`.
- `environmentIds`.
- `roleTargets`.
- `userTargets`.
- `organizationTargets`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Rollout strategies:

- `OFF`.
- `ON`.
- `PERCENTAGE`.
- `ORGANIZATION`.
- `ROLE`.
- `USER`.
- `ENVIRONMENT`.
- `SCHEDULED`.

## EnvironmentDefinition

Required fields:

- `id`.
- `name`.
- `type`.
- `configurationSetId`.
- `deploymentPolicy`.
- `monitoringProfile`.
- `databaseIsolation`.
- `secretIsolation`.
- `status`.

Minimum environment types:

- `DEVELOPMENT`.
- `TESTING`.
- `STAGING`.
- `PRODUCTION`.

## TenantConfiguration

Required fields:

- `id`.
- `tenantId`.
- `organizationId`.
- `enabledModules`.
- `languageSettings`.
- `brandingProfileId`.
- `securityProfile`.
- `licenseProfile`.
- `createdAt`.
- `updatedAt`.

## BrandingProfile

Required fields:

- `id`.
- `organizationId`.
- `logo`.
- `colors`.
- `fonts`.
- `favicon`.
- `pdfBranding`.
- `emailTemplates`.
- `organizationName`.
- `domains`.
- `status`.
- `version`.

## LocalizationProfile

Required fields:

- `id`.
- `organizationId`.
- `platformLanguage`.
- `fallbackLanguage`.
- `dateFormat`.
- `timezone`.
- `currency`.
- `measurementUnits`.
- `translationCompleteness`.
- `enabledLanguages`.
- `status`.
- `version`.

## ModuleAdministrationProfile

Required fields:

- `id`.
- `organizationId`.
- `moduleName`.
- `enabled`.
- `dependencies`.
- `limits`.
- `policies`.
- `externalServiceConfigurationRefs`.
- `healthStatus`.
- `version`.

## Audit

Required actions:

- `CONFIGURATION_CREATED`.
- `CONFIGURATION_UPDATED`.
- `CONFIGURATION_ROLLED_BACK`.
- `FEATURE_FLAG_ENABLED`.
- `FEATURE_FLAG_DISABLED`.
- `FEATURE_FLAG_EVALUATED`.
- `ENVIRONMENT_UPDATED`.
- `BRANDING_CHANGED`.
- `LOCALIZATION_UPDATED`.
- `MODULE_ENABLED`.
- `MODULE_DISABLED`.
- `POLICY_CHANGED`.

## Invariants

- IAM is authoritative for administrative authorization.
- Configuration is versioned and auditable.
- Secret values are stored only as approved secret references.
- Production-impacting configuration requires authorized human approval.
- Modules consume configuration through Configuration Service contracts.
- Modules must not create independent configuration stores for shared
  platform concerns.
