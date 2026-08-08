export type DataClassification = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";

export type CanonicalEntityName =
  | "Identity"
  | "Organization"
  | "Project"
  | "Manuscript"
  | "Work"
  | "Edition"
  | "Translation"
  | "Revision"
  | "Publication"
  | "MagazineIssue"
  | "Article"
  | "DigitalAsset"
  | "RightsRecord"
  | "Contract"
  | "Workflow"
  | "Task"
  | "Notification"
  | "AuditRecord"
  | "LocalizationResource"
  | "AIAsset";

export type OrganizationScope = "GLOBAL" | "ORGANIZATION_REQUIRED" | "OPTIONAL_PUBLIC_READ";

export type ProjectScope = "NONE" | "OPTIONAL" | "REQUIRED";

export type CanonicalLifecycleState =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "APPROVED"
  | "PUBLISHED"
  | "SUSPENDED"
  | "ARCHIVED"
  | "DELETED";

export type ApiVisibility = "PUBLIC" | "AUTHENTICATED" | "INTERNAL" | "ADMINISTRATIVE" | "DEPRECATED" | "UNKNOWN";

export type EventDeliverySemantics = "AT_LEAST_ONCE" | "EXACTLY_ONCE_NOT_GUARANTEED" | "BEST_EFFORT_METADATA_ONLY";

export type ImportExportFormat = "JSON" | "JSON_MASTER" | "PDF" | "DOCX" | "TXT" | "EPUB" | "MOBI" | "CSV" | "BINARY_ASSET";

export const CANONICAL_ENTITY_NAMES = [
  "Identity",
  "Organization",
  "Project",
  "Manuscript",
  "Work",
  "Edition",
  "Translation",
  "Revision",
  "Publication",
  "MagazineIssue",
  "Article",
  "DigitalAsset",
  "RightsRecord",
  "Contract",
  "Workflow",
  "Task",
  "Notification",
  "AuditRecord",
  "LocalizationResource",
  "AIAsset"
] as const satisfies readonly CanonicalEntityName[];

export const DATA_CLASSIFICATIONS = [
  "PUBLIC",
  "INTERNAL",
  "CONFIDENTIAL",
  "RESTRICTED"
] as const satisfies readonly DataClassification[];

export const CANONICAL_METADATA_FIELD_NAMES = [
  "id",
  "version",
  "status",
  "organization_id",
  "project_id",
  "created_at",
  "created_by",
  "updated_at",
  "updated_by",
  "deleted_at",
  "deleted_by",
  "correlation_id",
  "metadata"
] as const;

export const CANONICAL_API_VERSION = "v1";
export const CANONICAL_EVENT_VERSION = "1.0.0";
export const CANONICAL_SCHEMA_VERSION = "1.0.0";

export interface CanonicalMetadata {
  id: string;
  version?: number;
  status?: string;
  organization_id?: string;
  project_id?: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  deleted_at?: string;
  deleted_by?: string;
  correlation_id?: string;
  metadata?: Record<string, unknown>;
}

export interface CanonicalEntityDefinition {
  entity_id: string;
  canonical_name: CanonicalEntityName;
  owning_module: string;
  description: string;
  primary_identifier: string;
  organization_scope: OrganizationScope;
  project_scope: ProjectScope;
  classification: DataClassification;
  lifecycle: string[];
  schema_version: string;
  relationships: string[];
  public_contracts: string[];
  retention_policy: string;
  audit_requirements: string[];
  aliases?: string[];
}

export interface DataOwnershipRule {
  data_domain: string;
  canonical_entity: CanonicalEntityName;
  owning_module: string;
  write_authority: string;
  read_interfaces: string[];
  events_published: string[];
  retention_owner: string;
  security_owner: string;
  backup_tier: "TIER_0" | "TIER_1" | "TIER_2" | "TIER_3";
}

export interface LifecycleDefinition {
  lifecycle_definition_id: string;
  entity_type: CanonicalEntityName;
  state: CanonicalLifecycleState;
  allowed_transitions: CanonicalLifecycleState[];
  required_permissions: string[];
  required_validations: string[];
  terminal_state: boolean;
  audit_policy: "ALWAYS" | "CRITICAL_ONLY" | "METADATA_ONLY";
}

export interface ReferentialIntegrityRule {
  rule_id: string;
  parent_entity: CanonicalEntityName;
  child_entity: CanonicalEntityName;
  relationship: string;
  organization_scope_required: boolean;
  orphan_policy: "REJECT" | "REPORT" | "QUARANTINE";
  delete_policy: "RESTRICT" | "SOFT_DELETE_CHILDREN" | "ARCHIVE_CHILDREN";
}

export interface MigrationManifest {
  migration_id: string;
  description: string;
  affected_entities: CanonicalEntityName[];
  source_version: string;
  target_version: string;
  forward_steps: string[];
  rollback_steps: string[];
  data_transformation: string;
  validation_queries: string[];
  estimated_duration: string;
  locking_risk: "LOW" | "MEDIUM" | "HIGH";
  backup_requirement: string;
  owner: string;
}

export interface ApiSuccessEnvelope<TData = unknown> {
  request_id: string;
  timestamp: string;
  data: TData;
  metadata?: Record<string, unknown>;
  links?: Record<string, string>;
}

export interface ApiErrorEnvelope {
  request_id: string;
  timestamp: string;
  error: {
    code: string;
    message_key: string;
    correlation_id: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiEndpointContract {
  api_id: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  version: string;
  owning_module: string;
  authentication: "PUBLIC" | "REQUIRED" | "SERVICE";
  required_permissions: string[];
  request_schema: string;
  response_schema: string;
  error_contract: string;
  organization_scope: OrganizationScope;
  status: ApiVisibility;
  consumers: string[];
  repository_path: string;
}

export interface CanonicalEventEnvelope<TPayload = unknown> {
  event_id: string;
  event_name: string;
  event_version: string;
  occurred_at: string;
  producer: string;
  organization_id?: string;
  actor_id?: string;
  correlation_id: string;
  causation_id?: string;
  subject_type: CanonicalEntityName;
  subject_id: string;
  payload: TPayload;
  metadata?: Record<string, unknown>;
}

export interface EventContract {
  event_name: string;
  event_version: string;
  producer: string;
  consumers: string[];
  subject_type: CanonicalEntityName;
  delivery_semantics: EventDeliverySemantics;
  idempotency_key: string;
  schema_reference: string;
}

export interface ImportExportContract {
  contract_id: string;
  format: ImportExportFormat;
  schema_version: string;
  encoding: "UTF-8" | "BINARY";
  source: string;
  target: string;
  organization_scope: OrganizationScope;
  validation_rules: string[];
  error_policy: string;
  partial_success_policy: "NOT_ALLOWED" | "EXPLICIT_RECORD_LEVEL";
  idempotency: string;
  audit_policy: string;
}

export interface RetentionPolicyDefinition {
  classification: DataClassification;
  retention_period: string;
  archive_policy: string;
  soft_delete_policy: string;
  hard_delete_policy: string;
  legal_hold_support: boolean;
  backup_tier: DataOwnershipRule["backup_tier"];
  data_owner: string;
}

export function validateCanonicalMetadata(metadata: CanonicalMetadata): string[] {
  const issues: string[] = [];

  if (!metadata.id) {
    issues.push("id is required");
  }

  if (!metadata.created_at || Number.isNaN(Date.parse(metadata.created_at))) {
    issues.push("created_at must be a valid UTC timestamp");
  }

  if (metadata.updated_at !== undefined && Number.isNaN(Date.parse(metadata.updated_at))) {
    issues.push("updated_at must be a valid UTC timestamp");
  }

  if (metadata.deleted_at !== undefined && !metadata.deleted_by) {
    issues.push("deleted_by is required when deleted_at is present");
  }

  return issues;
}
