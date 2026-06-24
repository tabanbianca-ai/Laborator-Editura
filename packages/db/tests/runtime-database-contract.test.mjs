import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, "..", "src", "runtime-database.ts"), "utf8");
const indexSource = readFileSync(join(__dirname, "..", "src", "index.ts"), "utf8");
const packageJson = readFileSync(join(__dirname, "..", "package.json"), "utf8");

test("runtime database includes all MVP persistence and validation tables", () => {
  for (const table of [
    "organizations",
    "users",
    "user_roles",
    "auth_sessions",
    "auth_login_attempts",
    "auth_security_events",
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
    "organization_founder_protection",
    "founder_ownership_transfers",
    "projects",
    "documents",
    "document_segments",
    "segment_translations",
    "export_artifacts",
    "foundation_audit_events",
    "translation_memory_entries",
    "translation_memory_audit_events",
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
    "layout_publication_audit_events",
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
    "library_items",
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
    "scheduling_tasks",
    "scheduling_events",
    "scheduling_reminders",
    "scheduling_agent_runs",
    "scheduling_audit_events"
  ]) {
    assert.match(source, new RegExp(`"${table}"`));
  }
});

test("runtime database persists through a file-backed snapshot", () => {
  assert.match(source, /class FileBackedRuntimeDatabase/);
  assert.match(source, /LABORATOR_RUNTIME_DB_PATH/);
  assert.match(source, /readFileSync/);
  assert.match(source, /writeFileSync/);
  assert.match(source, /renameSync/);
  assert.match(source, /JSON\.parse/);
  assert.match(source, /JSON\.stringify/);
});

test("runtime database exposes tenant-scoped access methods for RLS-equivalent repository enforcement", () => {
  assert.match(source, /selectForTenant<T extends TenantRuntimeDatabaseRow>/);
  assert.match(source, /row\.organizationId === organizationId/);
  assert.match(source, /findByIdForTenant<T extends TenantRuntimeDatabaseRow>/);
});

test("runtime database is exported by the db package", () => {
  assert.match(indexSource, /export \* from "\.\/runtime-database\.js"/);
});

test("runtime backup and restore commands are runnable from the db package", () => {
  assert.match(packageJson, /"runtime:backup": "node scripts\/backup-runtime-db\.mjs"/);
  assert.match(packageJson, /"runtime:restore": "node scripts\/restore-runtime-db\.mjs"/);
});

test("runtime database exposes deterministic backup and validated restore helpers", () => {
  assert.match(source, /RUNTIME_DATABASE_BACKUP_FORMAT/);
  assert.match(source, /RUNTIME_DATABASE_SCHEMA_VERSION/);
  assert.match(source, /createBackup\(\)/);
  assert.match(source, /writeBackup\(filePath: string\)/);
  assert.match(source, /restoreBackup\(backup: unknown\)/);
  assert.match(source, /restoreBackupFromFile\(filePath: string\)/);
  assert.match(source, /validateRuntimeDatabaseBackup/);
  assert.match(source, /stableStringify/);
  assert.match(source, /validateTenantBoundaries/);
});
