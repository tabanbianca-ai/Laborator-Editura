import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export const RUNTIME_DATABASE_BACKUP_FORMAT = "laborator-runtime-database-backup";
export const RUNTIME_DATABASE_SCHEMA_VERSION = "1.0";

const TABLE_NAMES = [
  "organizations",
  "users",
  "user_roles",
  "auth_sessions",
  "auth_credentials",
  "auth_login_attempts",
  "auth_password_reset_requests",
  "auth_email_verification_requests",
  "auth_activity_events",
  "auth_security_events",
  "auth_identities",
  "auth_role_assignments",
  "auth_permissions",
  "auth_service_accounts",
  "auth_delegation_sessions",
  "auth_privileged_operation_policies",
  "auth_security_audit_events",
  "gateway_api_keys",
  "gateway_route_registry",
  "integration_providers",
  "integration_audit_events",
  "webhooks",
  "webhook_delivery_logs",
  "gateway_audit_events",
  "observability_metrics",
  "observability_logs",
  "observability_traces",
  "observability_agent_executions",
  "observability_audit_events",
  "security_policies",
  "security_access_reviews",
  "security_session_events",
  "security_api_key_events",
  "security_policy_violations",
  "security_audit_events",
  "backup_jobs",
  "backup_restore_events",
  "backup_retention_policies",
  "disaster_recovery_plans",
  "preservation_records",
  "backup_audit_events",
  "ai_provider_statuses",
  "ai_usage_records",
  "ai_budgets",
  "ai_quotas",
  "ai_cost_policies",
  "ai_budget_override_requests",
  "ai_cost_audit_events",
  "policy_definitions",
  "policy_evaluations",
  "policy_exception_requests",
  "policy_audit_events",
  "compliance_records",
  "admin_organizations",
  "admin_teams",
  "admin_users",
  "admin_roles",
  "admin_permissions",
  "admin_memberships",
  "admin_invitations",
  "admin_audit_events",
  "marketplace_agents",
  "marketplace_extensions",
  "marketplace_installs",
  "marketplace_audit_events",
  "workspace_layouts",
  "workspace_navigation_items",
  "workspace_widgets",
  "workspace_preferences",
  "workspace_collaborator_invitations",
  "workspace_need_to_know_grants",
  "workspace_audit_events",
  "launch_mfa_records",
  "launch_gdpr_consents",
  "launch_gdpr_requests",
  "launch_secret_vault_entries",
  "launch_essentials_audit_events",
  "rights_collaboration_agreements",
  "rights_translation_authorizations",
  "rights_publishing_authorizations",
  "rights_provenance_records",
  "rights_audit_events",
  "organization_founder_protection",
  "founder_ownership_transfers",
  "projects",
  "project_dossiers",
  "project_dossier_items",
  "documents",
  "document_segments",
  "segment_translations",
  "export_artifacts",
  "foundation_audit_events",
  "translation_memory_entries",
  "translation_memory_audit_events",
  "linguistic_source_priorities",
  "terminology_terms",
  "terminology_audit_events",
  "qa_reports",
  "qa_issues",
  "qa_audit_events",
  "semantic_fidelity_reports",
  "semantic_fidelity_issues",
  "semantic_fidelity_audit_events",
  "workflow_states",
  "workflow_transitions",
  "workflow_audit_events",
  "lexicographic_sources",
  "lexicographic_entries",
  "lexicographic_decisions",
  "lexicographic_audit_events",
  "editorial_decisions",
  "editorial_decision_audit_events",
  "layout_publication_plans",
  "layout_publishing_preflight_results",
  "layout_publishing_records",
  "layout_publishing_distribution_records",
  "layout_publication_audit_events",
  "publishing_publications",
  "publishing_builds",
  "publishing_publication_profiles",
  "publishing_layout_profiles",
  "publishing_typography_profiles",
  "publishing_font_registry",
  "publishing_style_mappings",
  "publishing_generated_assets",
  "publishing_image_derivatives",
  "publishing_covers",
  "publishing_validation_reports",
  "publishing_publication_packages",
  "publishing_approvals",
  "publishing_build_jobs",
  "publishing_observability_metrics",
  "publishing_audit_events",
  "media_localization_projects",
  "media_localization_assets",
  "media_localization_audit_events",
  "multimedia_projects",
  "multimedia_assets",
  "multimedia_audit_events",
  "platform_engineering_plans",
  "platform_engineering_audit_events",
  "agent_coordination_runs",
  "commerce_editions",
  "commerce_distribution_channels",
  "commerce_print_profiles",
  "commerce_audit_events",
  "library_works",
  "library_original_editions",
  "library_canonical_editions",
  "library_resource_relationships",
  "library_contributors",
  "library_edition_contributors",
  "library_rights_records",
  "library_provenance_records",
  "library_digital_assets",
  "library_records",
  "library_reservations",
  "library_metadata_history",
  "library_search_index",
  "library_duplicate_reviews",
  "library_items",
  "library_publications",
  "library_publication_editions",
  "library_publication_versions",
  "library_publication_files",
  "library_view_preferences",
  "library_reading_progress",
  "library_bookmarks",
  "library_highlights",
  "library_notes",
  "library_access_events",
  "library_audit_events",
  "author_manuscripts",
  "author_manuscript_sections",
  "author_drafts",
  "author_notes",
  "author_submission_events",
  "author_studio_audit_events",
  "research_sources",
  "research_notes",
  "research_entities",
  "research_relationships",
  "research_collections",
  "research_collection_items",
  "research_audit_events",
  "collaboration_threads",
  "collaboration_comments",
  "community_reviews",
  "community_comments",
  "community_flags",
  "community_moderation_events",
  "collaboration_audit_events",
  "public_catalog_items",
  "public_distribution_records",
  "public_access_records",
  "public_portal_audit_events",
  "distribution_records",
  "distribution_channels",
  "distribution_readiness_results",
  "public_catalog_projections",
  "public_slugs",
  "digital_reader_capabilities",
  "reader_reading_progress",
  "reader_annotations",
  "reader_library_entries",
  "commerce_products",
  "commerce_offers",
  "commerce_tax_profiles",
  "commerce_orders",
  "commerce_order_items",
  "commerce_payments",
  "commerce_payment_webhook_events",
  "commerce_entitlements",
  "commerce_download_authorizations",
  "commerce_promotions",
  "commerce_refunds",
  "distribution_external_mappings",
  "distribution_sync_records",
  "distribution_reconciliation_jobs",
  "publication_withdrawal_requests",
  "publication_superseding_records",
  "public_app_analytics_events",
  "distribution_audit_events",
  "audio_productions",
  "audio_profiles",
  "narrator_profiles",
  "ssml_documents",
  "pronunciation_entries",
  "audio_segments",
  "audio_assemblies",
  "audio_outputs",
  "audio_transcripts",
  "video_productions",
  "video_profiles",
  "video_scenes",
  "multimedia_subtitle_tracks",
  "audio_descriptions",
  "video_builds",
  "multimedia_manifests",
  "children_profiles",
  "children_age_classifications",
  "illustration_assets",
  "ai_illustration_generations",
  "visual_identity_profiles",
  "character_registry",
  "localized_text_layers",
  "localized_image_derivatives",
  "text_audio_sync_segments",
  "multimedia_accessibility_reports",
  "multimedia_rights_validations",
  "music_sound_assets",
  "multimedia_packages",
  "multimedia_build_jobs",
  "multimedia_cost_records",
  "multimedia_observability_metrics",
  "multimedia_production_audit_events",
  "legacy_multimedia_resources",
  "scheduling_tasks",
  "scheduling_events",
  "scheduling_reminders",
  "scheduling_agent_runs",
  "scheduling_audit_events"
] as const;

export type RuntimeDatabaseTableName = (typeof TABLE_NAMES)[number];

export interface RuntimeDatabaseRow {
  id: string;
}

export interface TenantRuntimeDatabaseRow extends RuntimeDatabaseRow {
  organizationId: string;
}

export type RuntimeDatabaseSnapshot = Record<RuntimeDatabaseTableName, RuntimeDatabaseRow[]>;

export interface RuntimeDatabaseBackup {
  metadata: {
    format: typeof RUNTIME_DATABASE_BACKUP_FORMAT;
    schemaVersion: typeof RUNTIME_DATABASE_SCHEMA_VERSION;
    source: "runtime-database";
    tables: RuntimeDatabaseTableName[];
  };
  data: RuntimeDatabaseSnapshot;
}

export interface RuntimeDatabaseBackupValidationResult {
  valid: boolean;
  issues: string[];
}

const TENANT_SCOPED_TABLES = new Set<RuntimeDatabaseTableName>([
  "user_roles",
  "auth_sessions",
  "auth_activity_events",
  "auth_identities",
  "auth_role_assignments",
  "auth_service_accounts",
  "auth_delegation_sessions",
  "auth_privileged_operation_policies",
  "auth_security_audit_events",
  "organization_founder_protection",
  "founder_ownership_transfers",
  "gateway_api_keys",
  "gateway_route_registry",
  "integration_providers",
  "integration_audit_events",
  "webhooks",
  "webhook_delivery_logs",
  "gateway_audit_events",
  "observability_metrics",
  "observability_logs",
  "observability_traces",
  "observability_agent_executions",
  "observability_audit_events",
  "security_policies",
  "security_access_reviews",
  "security_session_events",
  "security_api_key_events",
  "security_policy_violations",
  "security_audit_events",
  "backup_jobs",
  "backup_restore_events",
  "backup_retention_policies",
  "disaster_recovery_plans",
  "preservation_records",
  "backup_audit_events",
  "ai_provider_statuses",
  "ai_usage_records",
  "ai_budgets",
  "ai_quotas",
  "ai_cost_policies",
  "ai_budget_override_requests",
  "ai_cost_audit_events",
  "policy_definitions",
  "policy_evaluations",
  "policy_exception_requests",
  "policy_audit_events",
  "compliance_records",
  "admin_organizations",
  "admin_teams",
  "admin_users",
  "admin_roles",
  "admin_permissions",
  "admin_memberships",
  "admin_invitations",
  "admin_audit_events",
  "marketplace_agents",
  "marketplace_extensions",
  "marketplace_installs",
  "marketplace_audit_events",
  "workspace_layouts",
  "workspace_navigation_items",
  "workspace_widgets",
  "workspace_preferences",
  "workspace_collaborator_invitations",
  "workspace_need_to_know_grants",
  "workspace_audit_events",
  "launch_mfa_records",
  "launch_gdpr_consents",
  "launch_gdpr_requests",
  "launch_secret_vault_entries",
  "launch_essentials_audit_events",
  "rights_collaboration_agreements",
  "rights_translation_authorizations",
  "rights_publishing_authorizations",
  "rights_provenance_records",
  "rights_audit_events",
  "projects",
  "project_dossiers",
  "project_dossier_items",
  "documents",
  "document_segments",
  "segment_translations",
  "export_artifacts",
  "foundation_audit_events",
  "translation_memory_entries",
  "translation_memory_audit_events",
  "linguistic_source_priorities",
  "terminology_terms",
  "terminology_audit_events",
  "qa_reports",
  "qa_issues",
  "qa_audit_events",
  "semantic_fidelity_reports",
  "semantic_fidelity_issues",
  "semantic_fidelity_audit_events",
  "workflow_states",
  "workflow_transitions",
  "workflow_audit_events",
  "lexicographic_sources",
  "lexicographic_entries",
  "lexicographic_decisions",
  "lexicographic_audit_events",
  "editorial_decisions",
  "editorial_decision_audit_events",
  "layout_publication_plans",
  "layout_publishing_preflight_results",
  "layout_publishing_records",
  "layout_publishing_distribution_records",
  "layout_publication_audit_events",
  "publishing_publications",
  "publishing_builds",
  "publishing_publication_profiles",
  "publishing_layout_profiles",
  "publishing_typography_profiles",
  "publishing_font_registry",
  "publishing_style_mappings",
  "publishing_generated_assets",
  "publishing_image_derivatives",
  "publishing_covers",
  "publishing_validation_reports",
  "publishing_publication_packages",
  "publishing_approvals",
  "publishing_build_jobs",
  "publishing_observability_metrics",
  "publishing_audit_events",
  "media_localization_projects",
  "media_localization_assets",
  "media_localization_audit_events",
  "multimedia_projects",
  "multimedia_assets",
  "multimedia_audit_events",
  "platform_engineering_plans",
  "platform_engineering_audit_events",
  "agent_coordination_runs",
  "commerce_editions",
  "commerce_distribution_channels",
  "commerce_print_profiles",
  "commerce_audit_events",
  "library_works",
  "library_original_editions",
  "library_canonical_editions",
  "library_resource_relationships",
  "library_contributors",
  "library_edition_contributors",
  "library_rights_records",
  "library_provenance_records",
  "library_digital_assets",
  "library_records",
  "library_reservations",
  "library_metadata_history",
  "library_search_index",
  "library_duplicate_reviews",
  "library_items",
  "library_publications",
  "library_publication_editions",
  "library_publication_versions",
  "library_publication_files",
  "library_view_preferences",
  "library_reading_progress",
  "library_bookmarks",
  "library_highlights",
  "library_notes",
  "library_access_events",
  "library_audit_events",
  "author_manuscripts",
  "author_manuscript_sections",
  "author_drafts",
  "author_notes",
  "author_submission_events",
  "author_studio_audit_events",
  "research_sources",
  "research_notes",
  "research_entities",
  "research_relationships",
  "research_collections",
  "research_collection_items",
  "research_audit_events",
  "collaboration_threads",
  "collaboration_comments",
  "community_reviews",
  "community_comments",
  "community_flags",
  "community_moderation_events",
  "collaboration_audit_events",
  "public_catalog_items",
  "public_distribution_records",
  "public_access_records",
  "public_portal_audit_events",
  "distribution_records",
  "distribution_channels",
  "distribution_readiness_results",
  "public_catalog_projections",
  "public_slugs",
  "digital_reader_capabilities",
  "reader_reading_progress",
  "reader_annotations",
  "reader_library_entries",
  "commerce_products",
  "commerce_offers",
  "commerce_tax_profiles",
  "commerce_orders",
  "commerce_order_items",
  "commerce_payments",
  "commerce_payment_webhook_events",
  "commerce_entitlements",
  "commerce_download_authorizations",
  "commerce_promotions",
  "commerce_refunds",
  "distribution_external_mappings",
  "distribution_sync_records",
  "distribution_reconciliation_jobs",
  "publication_withdrawal_requests",
  "publication_superseding_records",
  "public_app_analytics_events",
  "distribution_audit_events",
  "audio_productions",
  "audio_profiles",
  "narrator_profiles",
  "ssml_documents",
  "pronunciation_entries",
  "audio_segments",
  "audio_assemblies",
  "audio_outputs",
  "audio_transcripts",
  "video_productions",
  "video_profiles",
  "video_scenes",
  "multimedia_subtitle_tracks",
  "audio_descriptions",
  "video_builds",
  "multimedia_manifests",
  "children_profiles",
  "children_age_classifications",
  "illustration_assets",
  "ai_illustration_generations",
  "visual_identity_profiles",
  "character_registry",
  "localized_text_layers",
  "localized_image_derivatives",
  "text_audio_sync_segments",
  "multimedia_accessibility_reports",
  "multimedia_rights_validations",
  "music_sound_assets",
  "multimedia_packages",
  "multimedia_build_jobs",
  "multimedia_cost_records",
  "multimedia_observability_metrics",
  "multimedia_production_audit_events",
  "legacy_multimedia_resources",
  "scheduling_tasks",
  "scheduling_events",
  "scheduling_reminders",
  "scheduling_agent_runs",
  "scheduling_audit_events"
]);

export class FileBackedRuntimeDatabase {
  constructor(
    private readonly filePath = process.env.LABORATOR_RUNTIME_DB_PATH ??
      join(process.cwd(), ".data", "laborator-runtime-db.json")
  ) {}

  insert<T extends RuntimeDatabaseRow>(tableName: RuntimeDatabaseTableName, row: T): T {
    const snapshot = this.loadSnapshot();
    const table = this.table(snapshot, tableName);

    if (table.some((existing) => existing.id === row.id)) {
      throw new Error(`duplicate id ${row.id} in ${tableName}`);
    }

    table.push(this.clone(row));
    this.persistSnapshot(snapshot);
    return this.clone(row);
  }

  upsert<T extends RuntimeDatabaseRow>(tableName: RuntimeDatabaseTableName, row: T): T {
    const snapshot = this.loadSnapshot();
    const table = this.table(snapshot, tableName);
    const index = table.findIndex((existing) => existing.id === row.id);

    if (index === -1) {
      table.push(this.clone(row));
    } else {
      table[index] = this.clone(row);
    }

    this.persistSnapshot(snapshot);
    return this.clone(row);
  }

  select<T extends RuntimeDatabaseRow>(
    tableName: RuntimeDatabaseTableName,
    predicate?: (row: T) => boolean
  ): T[] {
    const rows = this.table(this.loadSnapshot(), tableName) as T[];
    const selected = predicate ? rows.filter(predicate) : rows;

    return selected.map((row) => this.clone(row));
  }

  selectForTenant<T extends TenantRuntimeDatabaseRow>(
    tableName: RuntimeDatabaseTableName,
    organizationId: string,
    predicate?: (row: T) => boolean
  ): T[] {
    return this.select<T>(
      tableName,
      (row) => row.organizationId === organizationId && (predicate === undefined || predicate(row))
    );
  }

  findById<T extends RuntimeDatabaseRow>(tableName: RuntimeDatabaseTableName, id: string): T | null {
    return this.select<T>(tableName, (row) => row.id === id)[0] ?? null;
  }

  findByIdForTenant<T extends TenantRuntimeDatabaseRow>(
    tableName: RuntimeDatabaseTableName,
    id: string,
    organizationId: string
  ): T | null {
    return this.selectForTenant<T>(tableName, organizationId, (row) => row.id === id)[0] ?? null;
  }

  clear(): void {
    this.persistSnapshot(this.emptySnapshot());
  }

  createBackup(): RuntimeDatabaseBackup {
    return createRuntimeDatabaseBackup(this.loadSnapshot());
  }

  writeBackup(filePath: string): RuntimeDatabaseBackup {
    const backup = this.createBackup();
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, stableStringify(backup), "utf8");
    return backup;
  }

  restoreBackup(backup: unknown): RuntimeDatabaseBackup {
    const validation = validateRuntimeDatabaseBackup(backup);

    if (!validation.valid) {
      throw new Error(`Invalid runtime database backup: ${validation.issues.join("; ")}`);
    }

    const normalized = normalizeBackup(backup as RuntimeDatabaseBackup);
    this.persistSnapshot(normalized.data);
    return normalized;
  }

  restoreBackupFromFile(filePath: string): RuntimeDatabaseBackup {
    return this.restoreBackup(JSON.parse(readFileSync(filePath, "utf8")) as unknown);
  }

  getPath(): string {
    return this.filePath;
  }

  private loadSnapshot(): RuntimeDatabaseSnapshot {
    if (!existsSync(this.filePath)) {
      return this.emptySnapshot();
    }

    const parsed = JSON.parse(readFileSync(this.filePath, "utf8")) as Partial<RuntimeDatabaseSnapshot>;
    const snapshot = this.emptySnapshot();

    for (const tableName of TABLE_NAMES) {
      const rows = parsed[tableName];
      snapshot[tableName] = Array.isArray(rows) ? rows : [];
    }

    return snapshot;
  }

  private persistSnapshot(snapshot: RuntimeDatabaseSnapshot): void {
    mkdirSync(dirname(this.filePath), { recursive: true });

    const temporaryPath = join(
      dirname(this.filePath),
      `${Date.now()}-${Math.random().toString(16).slice(2)}.tmp`
    );

    writeFileSync(temporaryPath, stableStringify(snapshot), "utf8");
    renameSync(temporaryPath, this.filePath);
  }

  private table(
    snapshot: RuntimeDatabaseSnapshot,
    tableName: RuntimeDatabaseTableName
  ): RuntimeDatabaseRow[] {
    return snapshot[tableName];
  }

  private emptySnapshot(): RuntimeDatabaseSnapshot {
    return TABLE_NAMES.reduce((snapshot, tableName) => {
      snapshot[tableName] = [];
      return snapshot;
    }, {} as RuntimeDatabaseSnapshot);
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}

export function createRuntimeDatabaseBackup(snapshot: Partial<RuntimeDatabaseSnapshot>): RuntimeDatabaseBackup {
  return {
    metadata: {
      format: RUNTIME_DATABASE_BACKUP_FORMAT,
      schemaVersion: RUNTIME_DATABASE_SCHEMA_VERSION,
      source: "runtime-database",
      tables: [...TABLE_NAMES]
    },
    data: normalizeSnapshot(snapshot)
  };
}

export function validateRuntimeDatabaseBackup(value: unknown): RuntimeDatabaseBackupValidationResult {
  const issues: string[] = [];

  if (!isRecord(value)) {
    return { valid: false, issues: ["backup must be an object"] };
  }

  if (!isRecord(value.metadata)) {
    issues.push("metadata must be an object");
  } else {
    if (value.metadata.format !== RUNTIME_DATABASE_BACKUP_FORMAT) {
      issues.push("metadata.format is not supported");
    }

    if (value.metadata.schemaVersion !== RUNTIME_DATABASE_SCHEMA_VERSION) {
      issues.push("metadata.schemaVersion is not supported");
    }

    if (!Array.isArray(value.metadata.tables)) {
      issues.push("metadata.tables must be an array");
    }
  }

  if (!isRecord(value.data)) {
    issues.push("data must be an object");
  } else {
    validateBackupTables(value.data, issues);
    validateTenantBoundaries(value.data, issues);
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

function validateBackupTables(data: Record<string, unknown>, issues: string[]): void {
  const allowedTables = new Set(TABLE_NAMES);

  for (const tableName of Object.keys(data)) {
    if (!allowedTables.has(tableName as RuntimeDatabaseTableName)) {
      issues.push(`unknown table ${tableName}`);
    }
  }

  for (const tableName of TABLE_NAMES) {
    const rows = data[tableName];

    if (!Array.isArray(rows)) {
      issues.push(`data.${tableName} must be an array`);
      continue;
    }

    for (const row of rows) {
      if (!isRecord(row)) {
        issues.push(`data.${tableName} rows must be objects`);
        continue;
      }

      if (typeof row.id !== "string" || row.id.length === 0) {
        issues.push(`data.${tableName} row id must be a non-empty string`);
      }

      if (
        TENANT_SCOPED_TABLES.has(tableName) &&
        (typeof row.organizationId !== "string" || row.organizationId.length === 0)
      ) {
        issues.push(`data.${tableName} row organizationId must be a non-empty string`);
      }
    }
  }
}

function validateTenantBoundaries(data: Record<string, unknown>, issues: string[]): void {
  const organizationIds = new Set(rowsFor(data, "organizations").map((row) => row.id));

  for (const tableName of TENANT_SCOPED_TABLES) {
    for (const row of rowsFor(data, tableName)) {
      if (typeof row.organizationId === "string" && !organizationIds.has(row.organizationId)) {
        issues.push(`data.${tableName} row ${row.id} references missing organization ${row.organizationId}`);
      }
    }
  }

  validateReferenceTenant(data, issues, "documents", "projectId", "projects");
  validateReferenceTenant(data, issues, "document_segments", "projectId", "projects");
  validateReferenceTenant(data, issues, "document_segments", "documentId", "documents");
  validateReferenceTenant(data, issues, "segment_translations", "projectId", "projects");
  validateReferenceTenant(data, issues, "segment_translations", "documentId", "documents");
  validateReferenceTenant(data, issues, "segment_translations", "segmentId", "document_segments");
  validateReferenceTenant(data, issues, "export_artifacts", "projectId", "projects");
  validateReferenceTenant(data, issues, "export_artifacts", "documentId", "documents");
  validateReferenceTenant(data, issues, "rights_collaboration_agreements", "projectId", "projects");
  validateReferenceTenant(data, issues, "rights_collaboration_agreements", "documentId", "documents");
  validateReferenceTenant(data, issues, "rights_translation_authorizations", "projectId", "projects");
  validateReferenceTenant(data, issues, "rights_translation_authorizations", "documentId", "documents");
  validateReferenceTenant(data, issues, "rights_publishing_authorizations", "projectId", "projects");
  validateReferenceTenant(data, issues, "rights_publishing_authorizations", "documentId", "documents");
  validateReferenceTenant(data, issues, "rights_provenance_records", "projectId", "projects");
  validateReferenceTenant(data, issues, "rights_provenance_records", "documentId", "documents");
  validateReferenceTenant(data, issues, "rights_audit_events", "collaborationAgreementId", "rights_collaboration_agreements");
  validateReferenceTenant(data, issues, "rights_audit_events", "translationAuthorizationId", "rights_translation_authorizations");
  validateReferenceTenant(data, issues, "rights_audit_events", "publishingAuthorizationId", "rights_publishing_authorizations");
  validateReferenceTenant(data, issues, "rights_audit_events", "provenanceRecordId", "rights_provenance_records");
  validateReferenceTenant(data, issues, "webhook_delivery_logs", "webhookId", "webhooks");
  validateReferenceTenant(data, issues, "gateway_audit_events", "apiKeyId", "gateway_api_keys");
  validateReferenceTenant(data, issues, "gateway_audit_events", "webhookId", "webhooks");
  validateReferenceTenant(data, issues, "integration_audit_events", "integrationProviderId", "integration_providers");
  validateReferenceTenant(data, issues, "observability_audit_events", "metricId", "observability_metrics");
  validateReferenceTenant(data, issues, "observability_audit_events", "logId", "observability_logs");
  validateReferenceTenant(data, issues, "observability_audit_events", "traceId", "observability_traces");
  validateReferenceTenant(
    data,
    issues,
    "observability_audit_events",
    "agentExecutionId",
    "observability_agent_executions"
  );
  validateReferenceTenant(data, issues, "security_policy_violations", "policyId", "security_policies");
  validateReferenceTenant(data, issues, "security_audit_events", "policyId", "security_policies");
  validateReferenceTenant(data, issues, "security_audit_events", "accessReviewId", "security_access_reviews");
  validateReferenceTenant(data, issues, "security_audit_events", "sessionEventId", "security_session_events");
  validateReferenceTenant(data, issues, "security_audit_events", "apiKeyEventId", "security_api_key_events");
  validateReferenceTenant(
    data,
    issues,
    "security_audit_events",
    "policyViolationId",
    "security_policy_violations"
  );
  validateReferenceTenant(data, issues, "backup_restore_events", "backupJobId", "backup_jobs");
  validateReferenceTenant(data, issues, "backup_audit_events", "backupJobId", "backup_jobs");
  validateReferenceTenant(data, issues, "backup_audit_events", "restoreEventId", "backup_restore_events");
  validateReferenceTenant(data, issues, "backup_audit_events", "retentionPolicyId", "backup_retention_policies");
  validateReferenceTenant(
    data,
    issues,
    "backup_audit_events",
    "disasterRecoveryPlanId",
    "disaster_recovery_plans"
  );
  validateReferenceTenant(data, issues, "backup_audit_events", "preservationRecordId", "preservation_records");
  validateReferenceTenant(data, issues, "ai_cost_audit_events", "providerStatusId", "ai_provider_statuses");
  validateReferenceTenant(data, issues, "ai_budget_override_requests", "budgetId", "ai_budgets");
  validateReferenceTenant(data, issues, "ai_budget_override_requests", "quotaId", "ai_quotas");
  validateReferenceTenant(data, issues, "ai_cost_audit_events", "usageRecordId", "ai_usage_records");
  validateReferenceTenant(data, issues, "ai_cost_audit_events", "budgetId", "ai_budgets");
  validateReferenceTenant(data, issues, "ai_cost_audit_events", "quotaId", "ai_quotas");
  validateReferenceTenant(data, issues, "ai_cost_audit_events", "policyId", "ai_cost_policies");
  validateReferenceTenant(
    data,
    issues,
    "ai_cost_audit_events",
    "overrideRequestId",
    "ai_budget_override_requests"
  );
  validateReferenceTenant(data, issues, "policy_evaluations", "policyId", "policy_definitions");
  validateReferenceTenant(data, issues, "policy_exception_requests", "policyId", "policy_definitions");
  validateReferenceTenant(data, issues, "policy_exception_requests", "evaluationId", "policy_evaluations");
  validateReferenceTenant(data, issues, "compliance_records", "evaluationId", "policy_evaluations");
  validateReferenceTenant(data, issues, "compliance_records", "policyId", "policy_definitions");
  validateReferenceTenant(data, issues, "policy_audit_events", "policyId", "policy_definitions");
  validateReferenceTenant(data, issues, "policy_audit_events", "evaluationId", "policy_evaluations");
  validateReferenceTenant(
    data,
    issues,
    "policy_audit_events",
    "exceptionRequestId",
    "policy_exception_requests"
  );
  validateReferenceTenant(data, issues, "policy_audit_events", "complianceRecordId", "compliance_records");
  validateReferenceTenant(data, issues, "admin_memberships", "userId", "admin_users");
  validateReferenceTenant(data, issues, "admin_memberships", "roleId", "admin_roles");
  validateReferenceTenant(data, issues, "admin_memberships", "teamId", "admin_teams");
  validateReferenceTenant(data, issues, "admin_invitations", "roleId", "admin_roles");
  validateReferenceTenant(data, issues, "admin_invitations", "teamId", "admin_teams");
  validateReferenceTenant(data, issues, "admin_audit_events", "organizationMetadataId", "admin_organizations");
  validateReferenceTenant(data, issues, "admin_audit_events", "teamId", "admin_teams");
  validateReferenceTenant(data, issues, "admin_audit_events", "userId", "admin_users");
  validateReferenceTenant(data, issues, "admin_audit_events", "roleId", "admin_roles");
  validateReferenceTenant(data, issues, "admin_audit_events", "permissionId", "admin_permissions");
  validateReferenceTenant(data, issues, "admin_audit_events", "membershipId", "admin_memberships");
  validateReferenceTenant(data, issues, "admin_audit_events", "invitationId", "admin_invitations");
  validateReferenceTenant(data, issues, "marketplace_installs", "agentId", "marketplace_agents");
  validateReferenceTenant(data, issues, "marketplace_installs", "extensionId", "marketplace_extensions");
  validateReferenceTenant(data, issues, "marketplace_audit_events", "agentId", "marketplace_agents");
  validateReferenceTenant(data, issues, "marketplace_audit_events", "extensionId", "marketplace_extensions");
  validateReferenceTenant(data, issues, "marketplace_audit_events", "installId", "marketplace_installs");
  validateReferenceTenant(data, issues, "workspace_audit_events", "layoutId", "workspace_layouts");
  validateReferenceTenant(
    data,
    issues,
    "workspace_audit_events",
    "navigationItemId",
    "workspace_navigation_items"
  );
  validateReferenceTenant(data, issues, "workspace_audit_events", "widgetId", "workspace_widgets");
  validateReferenceTenant(data, issues, "workspace_audit_events", "preferenceId", "workspace_preferences");
  validateReferenceTenant(data, issues, "workspace_collaborator_invitations", "projectId", "projects");
  validateReferenceTenant(data, issues, "workspace_need_to_know_grants", "projectId", "projects");
  validateReferenceTenant(
    data,
    issues,
    "workspace_audit_events",
    "invitationId",
    "workspace_collaborator_invitations"
  );
  validateReferenceTenant(
    data,
    issues,
    "workspace_audit_events",
    "accessGrantId",
    "workspace_need_to_know_grants"
  );
  validateReferenceTenant(data, issues, "lexicographic_entries", "sourceId", "lexicographic_sources");
  validateReferenceTenant(
    data,
    issues,
    "editorial_decision_audit_events",
    "editorialDecisionId",
    "editorial_decisions"
  );
  validateReferenceTenant(
    data,
    issues,
    "layout_publication_audit_events",
    "layoutPublicationPlanId",
    "layout_publication_plans"
  );
  validateReferenceTenant(data, issues, "layout_publishing_preflight_results", "publicationId", "library_publications");
  validateReferenceTenant(
    data,
    issues,
    "layout_publishing_preflight_results",
    "editionId",
    "library_publication_editions"
  );
  validateReferenceTenant(
    data,
    issues,
    "layout_publishing_preflight_results",
    "versionId",
    "library_publication_versions"
  );
  validateReferenceTenant(data, issues, "layout_publishing_records", "publicationId", "library_publications");
  validateReferenceTenant(data, issues, "layout_publishing_records", "editionId", "library_publication_editions");
  validateReferenceTenant(data, issues, "layout_publishing_records", "versionId", "library_publication_versions");
  validateReferenceTenant(
    data,
    issues,
    "layout_publishing_records",
    "preflightResultId",
    "layout_publishing_preflight_results"
  );
  validateReferenceTenant(
    data,
    issues,
    "layout_publishing_distribution_records",
    "publishingRecordId",
    "layout_publishing_records"
  );
  validateReferenceTenant(
    data,
    issues,
    "layout_publication_audit_events",
    "preflightResultId",
    "layout_publishing_preflight_results"
  );
  validateReferenceTenant(
    data,
    issues,
    "layout_publication_audit_events",
    "publishingRecordId",
    "layout_publishing_records"
  );
  validateReferenceTenant(
    data,
    issues,
    "layout_publication_audit_events",
    "distributionRecordId",
    "layout_publishing_distribution_records"
  );
  validateReferenceTenant(data, issues, "publishing_publications", "libraryPublicationId", "library_publications");
  validateReferenceTenant(data, issues, "publishing_publications", "projectId", "projects");
  validateReferenceTenant(data, issues, "publishing_publications", "documentId", "documents");
  validateReferenceTenant(data, issues, "publishing_builds", "publicationId", "publishing_publications");
  validateReferenceTenant(
    data,
    issues,
    "publishing_generated_assets",
    "publicationId",
    "publishing_publications"
  );
  validateReferenceTenant(data, issues, "publishing_generated_assets", "buildId", "publishing_builds");
  validateReferenceTenant(data, issues, "publishing_image_derivatives", "imageAssetId", "publishing_generated_assets");
  validateReferenceTenant(data, issues, "publishing_covers", "publicationId", "publishing_publications");
  validateReferenceTenant(
    data,
    issues,
    "publishing_validation_reports",
    "publicationId",
    "publishing_publications"
  );
  validateReferenceTenant(data, issues, "publishing_validation_reports", "buildId", "publishing_builds");
  validateReferenceTenant(
    data,
    issues,
    "publishing_publication_packages",
    "publicationId",
    "publishing_publications"
  );
  validateReferenceTenant(data, issues, "publishing_publication_packages", "buildId", "publishing_builds");
  validateReferenceTenant(data, issues, "publishing_approvals", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "publishing_approvals", "buildId", "publishing_builds");
  validateReferenceTenant(
    data,
    issues,
    "publishing_approvals",
    "validationReportId",
    "publishing_validation_reports"
  );
  validateReferenceTenant(data, issues, "publishing_approvals", "packageId", "publishing_publication_packages");
  validateReferenceTenant(data, issues, "publishing_build_jobs", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "publishing_build_jobs", "buildId", "publishing_builds");
  validateReferenceTenant(
    data,
    issues,
    "publishing_observability_metrics",
    "publicationId",
    "publishing_publications"
  );
  validateReferenceTenant(data, issues, "publishing_observability_metrics", "buildId", "publishing_builds");
  validateReferenceTenant(data, issues, "publishing_audit_events", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "publishing_audit_events", "buildId", "publishing_builds");
  validateReferenceTenant(
    data,
    issues,
    "publishing_audit_events",
    "packageId",
    "publishing_publication_packages"
  );
  validateReferenceTenant(
    data,
    issues,
    "media_localization_assets",
    "mediaLocalizationProjectId",
    "media_localization_projects"
  );
  validateReferenceTenant(
    data,
    issues,
    "media_localization_audit_events",
    "mediaLocalizationProjectId",
    "media_localization_projects"
  );
  validateReferenceTenant(
    data,
    issues,
    "media_localization_audit_events",
    "mediaLocalizationAssetId",
    "media_localization_assets"
  );
  validateReferenceTenant(data, issues, "multimedia_assets", "multimediaProjectId", "multimedia_projects");
  validateReferenceTenant(
    data,
    issues,
    "multimedia_audit_events",
    "multimediaProjectId",
    "multimedia_projects"
  );
  validateReferenceTenant(
    data,
    issues,
    "multimedia_audit_events",
    "multimediaAssetId",
    "multimedia_assets"
  );
  validateReferenceTenant(
    data,
    issues,
    "platform_engineering_audit_events",
    "platformEngineeringPlanId",
    "platform_engineering_plans"
  );
  validateReferenceTenant(
    data,
    issues,
    "platform_engineering_audit_events",
    "agentCoordinationRunId",
    "agent_coordination_runs"
  );
  validateReferenceTenant(
    data,
    issues,
    "commerce_distribution_channels",
    "commerceEditionId",
    "commerce_editions"
  );
  validateReferenceTenant(data, issues, "commerce_print_profiles", "commerceEditionId", "commerce_editions");
  validateReferenceTenant(data, issues, "commerce_audit_events", "commerceEditionId", "commerce_editions");
  validateReferenceTenant(
    data,
    issues,
    "commerce_audit_events",
    "commerceDistributionChannelId",
    "commerce_distribution_channels"
  );
  validateReferenceTenant(
    data,
    issues,
    "commerce_audit_events",
    "commercePrintProfileId",
    "commerce_print_profiles"
  );
  validateReferenceTenant(data, issues, "library_reading_progress", "libraryItemId", "library_items");
  validateReferenceTenant(data, issues, "library_publication_editions", "publicationId", "library_publications");
  validateReferenceTenant(data, issues, "library_publication_versions", "publicationId", "library_publications");
  validateReferenceTenant(data, issues, "library_publication_files", "publicationId", "library_publications");
  validateReferenceTenant(data, issues, "library_audit_events", "publicationId", "library_publications");
  validateReferenceTenant(data, issues, "library_bookmarks", "libraryItemId", "library_items");
  validateReferenceTenant(data, issues, "library_highlights", "libraryItemId", "library_items");
  validateReferenceTenant(data, issues, "library_notes", "libraryItemId", "library_items");
  validateReferenceTenant(data, issues, "library_access_events", "libraryItemId", "library_items");
  validateReferenceTenant(data, issues, "library_audit_events", "libraryItemId", "library_items");
  validateReferenceTenant(data, issues, "author_manuscript_sections", "manuscriptId", "author_manuscripts");
  validateReferenceTenant(data, issues, "author_drafts", "manuscriptId", "author_manuscripts");
  validateReferenceTenant(data, issues, "author_drafts", "sectionId", "author_manuscript_sections");
  validateReferenceTenant(data, issues, "author_notes", "manuscriptId", "author_manuscripts");
  validateReferenceTenant(data, issues, "author_submission_events", "manuscriptId", "author_manuscripts");
  validateReferenceTenant(data, issues, "author_studio_audit_events", "manuscriptId", "author_manuscripts");
  validateReferenceTenant(data, issues, "author_studio_audit_events", "sectionId", "author_manuscript_sections");
  validateReferenceTenant(data, issues, "author_studio_audit_events", "draftId", "author_drafts");
  validateReferenceTenant(data, issues, "author_studio_audit_events", "noteId", "author_notes");
  validateReferenceTenant(
    data,
    issues,
    "author_studio_audit_events",
    "submissionEventId",
    "author_submission_events"
  );
  validateReferenceTenant(data, issues, "research_notes", "sourceId", "research_sources");
  validateReferenceTenant(data, issues, "research_notes", "entityId", "research_entities");
  validateReferenceTenant(data, issues, "research_relationships", "fromEntityId", "research_entities");
  validateReferenceTenant(data, issues, "research_relationships", "toEntityId", "research_entities");
  validateReferenceTenant(data, issues, "research_collection_items", "collectionId", "research_collections");
  validateReferenceTenant(data, issues, "research_collection_items", "sourceId", "research_sources");
  validateReferenceTenant(data, issues, "research_collection_items", "noteId", "research_notes");
  validateReferenceTenant(data, issues, "research_collection_items", "entityId", "research_entities");
  validateReferenceTenant(data, issues, "research_collection_items", "relationshipId", "research_relationships");
  validateReferenceTenant(data, issues, "research_audit_events", "sourceId", "research_sources");
  validateReferenceTenant(data, issues, "research_audit_events", "noteId", "research_notes");
  validateReferenceTenant(data, issues, "research_audit_events", "entityId", "research_entities");
  validateReferenceTenant(data, issues, "research_audit_events", "relationshipId", "research_relationships");
  validateReferenceTenant(data, issues, "research_audit_events", "collectionId", "research_collections");
  validateReferenceTenant(data, issues, "research_audit_events", "collectionItemId", "research_collection_items");
  validateReferenceTenant(data, issues, "collaboration_comments", "threadId", "collaboration_threads");
  validateReferenceTenant(data, issues, "community_flags", "communityReviewId", "community_reviews");
  validateReferenceTenant(data, issues, "community_flags", "communityCommentId", "community_comments");
  validateReferenceTenant(data, issues, "community_moderation_events", "communityReviewId", "community_reviews");
  validateReferenceTenant(data, issues, "community_moderation_events", "communityCommentId", "community_comments");
  validateReferenceTenant(data, issues, "community_moderation_events", "communityFlagId", "community_flags");
  validateReferenceTenant(data, issues, "collaboration_audit_events", "threadId", "collaboration_threads");
  validateReferenceTenant(
    data,
    issues,
    "collaboration_audit_events",
    "collaborationCommentId",
    "collaboration_comments"
  );
  validateReferenceTenant(data, issues, "collaboration_audit_events", "communityReviewId", "community_reviews");
  validateReferenceTenant(data, issues, "collaboration_audit_events", "communityCommentId", "community_comments");
  validateReferenceTenant(data, issues, "collaboration_audit_events", "communityFlagId", "community_flags");
  validateReferenceTenant(
    data,
    issues,
    "public_distribution_records",
    "publicCatalogItemId",
    "public_catalog_items"
  );
  validateReferenceTenant(data, issues, "public_access_records", "publicCatalogItemId", "public_catalog_items");
  validateReferenceTenant(
    data,
    issues,
    "public_portal_audit_events",
    "publicCatalogItemId",
    "public_catalog_items"
  );
  validateReferenceTenant(
    data,
    issues,
    "public_portal_audit_events",
    "publicDistributionRecordId",
    "public_distribution_records"
  );
  validateReferenceTenant(data, issues, "distribution_records", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "distribution_records", "publicationPackageId", "publishing_publication_packages");
  validateReferenceTenant(data, issues, "distribution_records", "channelId", "distribution_channels");
  validateReferenceTenant(data, issues, "distribution_readiness_results", "distributionId", "distribution_records");
  validateReferenceTenant(data, issues, "distribution_readiness_results", "channelId", "distribution_channels");
  validateReferenceTenant(data, issues, "public_catalog_projections", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "reader_reading_progress", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "reader_annotations", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "reader_library_entries", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "reader_library_entries", "entitlementId", "commerce_entitlements");
  validateReferenceTenant(data, issues, "reader_library_entries", "sourceOrderId", "commerce_orders");
  validateReferenceTenant(data, issues, "commerce_products", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "commerce_offers", "productId", "commerce_products");
  validateReferenceTenant(data, issues, "commerce_order_items", "orderId", "commerce_orders");
  validateReferenceTenant(data, issues, "commerce_order_items", "productId", "commerce_products");
  validateReferenceTenant(data, issues, "commerce_order_items", "offerId", "commerce_offers");
  validateReferenceTenant(data, issues, "commerce_order_items", "accessEntitlementId", "commerce_entitlements");
  validateReferenceTenant(data, issues, "commerce_payments", "orderId", "commerce_orders");
  validateReferenceTenant(data, issues, "commerce_payment_webhook_events", "paymentId", "commerce_payments");
  validateReferenceTenant(data, issues, "commerce_entitlements", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "commerce_entitlements", "sourceOrderId", "commerce_orders");
  validateReferenceTenant(data, issues, "commerce_download_authorizations", "entitlementId", "commerce_entitlements");
  validateReferenceTenant(data, issues, "commerce_download_authorizations", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "commerce_promotions", "productId", "commerce_products");
  validateReferenceTenant(data, issues, "commerce_promotions", "offerId", "commerce_offers");
  validateReferenceTenant(data, issues, "commerce_refunds", "paymentId", "commerce_payments");
  validateReferenceTenant(data, issues, "commerce_refunds", "orderId", "commerce_orders");
  validateReferenceTenant(data, issues, "distribution_external_mappings", "distributionId", "distribution_records");
  validateReferenceTenant(data, issues, "distribution_external_mappings", "channelId", "distribution_channels");
  validateReferenceTenant(data, issues, "distribution_sync_records", "distributionId", "distribution_records");
  validateReferenceTenant(
    data,
    issues,
    "distribution_sync_records",
    "externalMappingId",
    "distribution_external_mappings"
  );
  validateReferenceTenant(data, issues, "distribution_reconciliation_jobs", "distributionId", "distribution_records");
  validateReferenceTenant(data, issues, "distribution_reconciliation_jobs", "channelId", "distribution_channels");
  validateReferenceTenant(data, issues, "publication_withdrawal_requests", "publicationId", "publishing_publications");
  validateReferenceTenant(
    data,
    issues,
    "publication_superseding_records",
    "previousPublicationId",
    "publishing_publications"
  );
  validateReferenceTenant(
    data,
    issues,
    "publication_superseding_records",
    "replacementPublicationId",
    "publishing_publications"
  );
  validateReferenceTenant(data, issues, "public_app_analytics_events", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "distribution_audit_events", "distributionId", "distribution_records");
  validateReferenceTenant(data, issues, "distribution_audit_events", "orderId", "commerce_orders");
  validateReferenceTenant(data, issues, "distribution_audit_events", "paymentId", "commerce_payments");
  validateReferenceTenant(data, issues, "distribution_audit_events", "entitlementId", "commerce_entitlements");
  validateReferenceTenant(
    data,
    issues,
    "distribution_audit_events",
    "withdrawalRequestId",
    "publication_withdrawal_requests"
  );
  validateReferenceTenant(data, issues, "audio_productions", "workId", "library_works");
  validateReferenceTenant(data, issues, "audio_productions", "editionId", "library_canonical_editions");
  validateReferenceTenant(data, issues, "audio_productions", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "audio_productions", "narratorProfileId", "narrator_profiles");
  validateReferenceTenant(data, issues, "audio_productions", "audioProfileId", "audio_profiles");
  validateReferenceTenant(data, issues, "audio_segments", "audioProductionId", "audio_productions");
  validateReferenceTenant(data, issues, "audio_segments", "audioAssetId", "library_digital_assets");
  validateReferenceTenant(data, issues, "audio_assemblies", "audioProductionId", "audio_productions");
  validateReferenceTenant(data, issues, "audio_outputs", "audioProductionId", "audio_productions");
  validateReferenceTenant(data, issues, "audio_outputs", "assetId", "library_digital_assets");
  validateReferenceTenant(data, issues, "audio_transcripts", "audioProductionId", "audio_productions");
  validateReferenceTenant(data, issues, "video_productions", "workId", "library_works");
  validateReferenceTenant(data, issues, "video_productions", "editionId", "library_canonical_editions");
  validateReferenceTenant(data, issues, "video_productions", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "video_productions", "videoProfileId", "video_profiles");
  validateReferenceTenant(data, issues, "video_scenes", "videoProductionId", "video_productions");
  validateReferenceTenant(data, issues, "multimedia_subtitle_tracks", "videoProductionId", "video_productions");
  validateReferenceTenant(data, issues, "audio_descriptions", "sceneId", "video_scenes");
  validateReferenceTenant(data, issues, "video_builds", "videoProductionId", "video_productions");
  validateReferenceTenant(data, issues, "multimedia_manifests", "editionId", "library_canonical_editions");
  validateReferenceTenant(data, issues, "children_profiles", "editionId", "library_canonical_editions");
  validateReferenceTenant(data, issues, "illustration_assets", "editionId", "library_canonical_editions");
  validateReferenceTenant(data, issues, "illustration_assets", "rightsRecordId", "library_rights_records");
  validateReferenceTenant(data, issues, "ai_illustration_generations", "illustrationId", "illustration_assets");
  validateReferenceTenant(data, issues, "visual_identity_profiles", "workId", "library_works");
  validateReferenceTenant(data, issues, "character_registry", "workId", "library_works");
  validateReferenceTenant(data, issues, "localized_text_layers", "illustrationId", "illustration_assets");
  validateReferenceTenant(data, issues, "localized_image_derivatives", "illustrationId", "illustration_assets");
  validateReferenceTenant(
    data,
    issues,
    "localized_image_derivatives",
    "localizedTextLayerId",
    "localized_text_layers"
  );
  validateReferenceTenant(data, issues, "text_audio_sync_segments", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "text_audio_sync_segments", "audioSegmentId", "audio_segments");
  validateReferenceTenant(data, issues, "multimedia_accessibility_reports", "assetId", "library_digital_assets");
  validateReferenceTenant(data, issues, "multimedia_rights_validations", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "music_sound_assets", "digitalAssetId", "library_digital_assets");
  validateReferenceTenant(data, issues, "multimedia_packages", "publicationId", "publishing_publications");
  validateReferenceTenant(data, issues, "multimedia_packages", "manifestId", "multimedia_manifests");
  validateReferenceTenant(data, issues, "multimedia_build_jobs", "audioProductionId", "audio_productions");
  validateReferenceTenant(data, issues, "multimedia_build_jobs", "videoProductionId", "video_productions");
  validateReferenceTenant(data, issues, "multimedia_cost_records", "publicationId", "publishing_publications");
  validateReferenceTenant(
    data,
    issues,
    "multimedia_production_audit_events",
    "audioProductionId",
    "audio_productions"
  );
  validateReferenceTenant(
    data,
    issues,
    "multimedia_production_audit_events",
    "videoProductionId",
    "video_productions"
  );
  validateReferenceTenant(
    data,
    issues,
    "multimedia_production_audit_events",
    "illustrationId",
    "illustration_assets"
  );
  validateReferenceTenant(
    data,
    issues,
    "multimedia_production_audit_events",
    "packageId",
    "multimedia_packages"
  );
  validateReferenceTenant(data, issues, "scheduling_reminders", "schedulingTaskId", "scheduling_tasks");
  validateReferenceTenant(data, issues, "scheduling_reminders", "schedulingEventId", "scheduling_events");
  validateReferenceTenant(
    data,
    issues,
    "scheduling_reminders",
    "schedulingAgentRunId",
    "scheduling_agent_runs"
  );
  validateReferenceTenant(data, issues, "scheduling_audit_events", "schedulingTaskId", "scheduling_tasks");
  validateReferenceTenant(data, issues, "scheduling_audit_events", "schedulingEventId", "scheduling_events");
  validateReferenceTenant(
    data,
    issues,
    "scheduling_audit_events",
    "schedulingReminderId",
    "scheduling_reminders"
  );
  validateReferenceTenant(
    data,
    issues,
    "scheduling_audit_events",
    "schedulingAgentRunId",
    "scheduling_agent_runs"
  );
}

function validateReferenceTenant(
  data: Record<string, unknown>,
  issues: string[],
  tableName: RuntimeDatabaseTableName,
  referenceKey: string,
  referenceTableName: RuntimeDatabaseTableName
): void {
  const referenceRows = new Map(rowsFor(data, referenceTableName).map((row) => [row.id, row]));

  for (const row of rowsFor(data, tableName)) {
    const referenceId = row[referenceKey];

    if (typeof referenceId !== "string") {
      continue;
    }

    const referenced = referenceRows.get(referenceId);

    if (!referenced) {
      issues.push(`data.${tableName} row ${row.id} references missing ${referenceTableName} ${referenceId}`);
      continue;
    }

    if (row.organizationId !== referenced.organizationId) {
      issues.push(`data.${tableName} row ${row.id} crosses tenant boundary via ${referenceKey}`);
    }
  }
}

function normalizeBackup(backup: RuntimeDatabaseBackup): RuntimeDatabaseBackup {
  return createRuntimeDatabaseBackup(backup.data);
}

function normalizeSnapshot(snapshot: Partial<RuntimeDatabaseSnapshot>): RuntimeDatabaseSnapshot {
  return TABLE_NAMES.reduce((normalized, tableName) => {
    const rows = snapshot[tableName];
    normalized[tableName] = Array.isArray(rows) ? sortRows(rows.map((row) => sortValue(row) as RuntimeDatabaseRow)) : [];
    return normalized;
  }, {} as RuntimeDatabaseSnapshot);
}

function sortRows(rows: RuntimeDatabaseRow[]): RuntimeDatabaseRow[] {
  return rows.sort((left, right) => rowSortKey(left).localeCompare(rowSortKey(right)));
}

function rowSortKey(row: RuntimeDatabaseRow): string {
  const tenant = isRecord(row) && typeof row.organizationId === "string" ? row.organizationId : "";
  const createdAt = isRecord(row) && typeof row.createdAt === "string" ? row.createdAt : "";
  return `${tenant}:${createdAt}:${row.id}`;
}

function rowsFor(data: Record<string, unknown>, tableName: RuntimeDatabaseTableName): Record<string, unknown>[] {
  const rows = data[tableName];
  return Array.isArray(rows) ? rows.filter(isRecord) : [];
}

function stableStringify(value: unknown): string {
  return `${JSON.stringify(sortValue(value), null, 2)}\n`;
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.keys(value)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = sortValue(value[key]);
      return sorted;
    }, {} as Record<string, unknown>);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

let defaultRuntimeDatabase: FileBackedRuntimeDatabase | undefined;

export function getDefaultRuntimeDatabase(): FileBackedRuntimeDatabase {
  defaultRuntimeDatabase ??= new FileBackedRuntimeDatabase();
  return defaultRuntimeDatabase;
}

export function resetRuntimeDatabaseForTests(filePath = join(tmpdir(), "laborator-runtime-db-test.json")): FileBackedRuntimeDatabase {
  defaultRuntimeDatabase = new FileBackedRuntimeDatabase(filePath);
  defaultRuntimeDatabase.clear();
  return defaultRuntimeDatabase;
}
