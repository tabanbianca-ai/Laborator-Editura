import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  BACKUP_FORMAT,
  SCHEMA_VERSION,
  TABLE_NAMES,
  createBackup,
  normalizeSnapshot
} from "../scripts/runtime-backup-lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");
const backupScript = join(packageRoot, "scripts", "backup-runtime-db.mjs");
const restoreScript = join(packageRoot, "scripts", "restore-runtime-db.mjs");

test("runtime backup file is generated as deterministic JSON", () => {
  const dir = mkdtempSync(join(tmpdir(), "laborator-backup-"));
  const dbPath = join(dir, "runtime-db.json");
  const firstBackupPath = join(dir, "backup-1.json");
  const secondBackupPath = join(dir, "backup-2.json");

  writeJson(dbPath, sampleSnapshot());

  runScript(backupScript, ["--db", dbPath, "--out", firstBackupPath]);
  runScript(backupScript, ["--db", dbPath, "--out", secondBackupPath]);

  assert.equal(existsSync(firstBackupPath), true);
  assert.equal(readFileSync(firstBackupPath, "utf8"), readFileSync(secondBackupPath, "utf8"));

  const backup = JSON.parse(readFileSync(firstBackupPath, "utf8"));
  assert.equal(backup.metadata.format, BACKUP_FORMAT);
  assert.equal(backup.metadata.schemaVersion, SCHEMA_VERSION);
  assert.deepEqual(backup.metadata.tables, TABLE_NAMES);
});

test("runtime restore recreates all approved MVP data tables", () => {
  const dir = mkdtempSync(join(tmpdir(), "laborator-restore-"));
  const dbPath = join(dir, "runtime-db.json");
  const restoredDbPath = join(dir, "runtime-db-restored.json");
  const backupPath = join(dir, "backup.json");
  const snapshot = sampleSnapshot();

  writeJson(dbPath, snapshot);
  runScript(backupScript, ["--db", dbPath, "--out", backupPath]);
  runScript(restoreScript, ["--db", restoredDbPath, "--in", backupPath]);

  const expected = createBackup(snapshot).data;
  const restored = normalizeSnapshot(JSON.parse(readFileSync(restoredDbPath, "utf8")));

  assert.deepEqual(restored, expected);

  for (const tableName of [
    "projects",
    "documents",
    "document_segments",
    "segment_translations",
    "export_artifacts",
    "foundation_audit_events",
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
    "translation_memory_entries",
    "terminology_terms",
    "qa_reports",
    "qa_issues",
    "semantic_fidelity_reports",
    "semantic_fidelity_issues",
    "workflow_states",
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
    assert.ok(restored[tableName].length > 0, `${tableName} should be restored`);
  }
});

test("runtime restore rejects invalid backups before applying them", () => {
  const dir = mkdtempSync(join(tmpdir(), "laborator-invalid-"));
  const dbPath = join(dir, "runtime-db.json");
  const invalidBackupPath = join(dir, "invalid-backup.json");
  const originalSnapshot = sampleSnapshot();
  const invalidBackup = createBackup(sampleSnapshot());

  invalidBackup.metadata.schemaVersion = "0.0";
  invalidBackup.data.projects[0].organizationId = "missing-org";

  writeJson(dbPath, originalSnapshot);
  writeJson(invalidBackupPath, invalidBackup);

  const result = spawnSync(process.execPath, [
    restoreScript,
    "--db",
    dbPath,
    "--in",
    invalidBackupPath
  ], {
    encoding: "utf8"
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Invalid runtime database backup/);
  assert.deepEqual(normalizeSnapshot(JSON.parse(readFileSync(dbPath, "utf8"))), createBackup(originalSnapshot).data);
});

test("runtime restore preserves tenant boundaries", () => {
  const dir = mkdtempSync(join(tmpdir(), "laborator-tenants-"));
  const dbPath = join(dir, "runtime-db.json");
  const restoredDbPath = join(dir, "runtime-db-restored.json");
  const backupPath = join(dir, "backup.json");

  writeJson(dbPath, sampleSnapshot());
  runScript(backupScript, ["--db", dbPath, "--out", backupPath]);
  runScript(restoreScript, ["--db", restoredDbPath, "--in", backupPath]);

  const restored = normalizeSnapshot(JSON.parse(readFileSync(restoredDbPath, "utf8")));
  const orgAProjects = restored.projects.filter((project) => project.organizationId === "org-a");
  const orgBProjects = restored.projects.filter((project) => project.organizationId === "org-b");

  assert.deepEqual(orgAProjects.map((project) => project.id), ["project-a"]);
  assert.deepEqual(orgBProjects.map((project) => project.id), ["project-b"]);
  assert.equal(
    restored.documents.every((document) => {
      const project = restored.projects.find((candidate) => candidate.id === document.projectId);
      return project && project.organizationId === document.organizationId;
    }),
    true
  );
});

function runScript(scriptPath, args) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sampleSnapshot() {
  const snapshot = TABLE_NAMES.reduce((tables, tableName) => {
    tables[tableName] = [];
    return tables;
  }, {});

  snapshot.organizations.push(
    { id: "org-a", name: "Tenant A", createdAt: "2026-01-01T00:00:00.000Z" },
    { id: "org-b", name: "Tenant B", createdAt: "2026-01-01T00:00:01.000Z" }
  );
  snapshot.users.push(
    { id: "user-a", email: "a@example.com", displayName: "User A", createdAt: "2026-01-01T00:00:02.000Z" },
    { id: "user-b", email: "b@example.com", displayName: "User B", createdAt: "2026-01-01T00:00:03.000Z" },
    { id: "user-c", email: "c@example.com", displayName: "User C", createdAt: "2026-01-01T00:00:03.500Z" }
  );
  snapshot.user_roles.push(
    { id: "role-a", organizationId: "org-a", userId: "user-a", role: "TRANSLATOR", createdAt: "2026-01-01T00:00:04.000Z" },
    { id: "role-c", organizationId: "org-a", userId: "user-c", role: "TRANSLATOR", createdAt: "2026-01-01T00:00:04.500Z" },
    { id: "role-b", organizationId: "org-b", userId: "user-b", role: "REVIEWER", createdAt: "2026-01-01T00:00:05.000Z" }
  );
  snapshot.auth_sessions.push(
    { id: "session-a", organizationId: "org-a", userId: "user-a", token: "token-a", roles: ["TRANSLATOR"], createdAt: "2026-01-01T00:00:06.000Z", expiresAt: "2026-01-01T08:00:06.000Z", lastSeenAt: "2026-01-01T00:00:06.000Z" }
  );
  snapshot.auth_login_attempts.push(
    { id: "login-attempt-a", email: "a@example.com", failureCount: 1, createdAt: "2026-01-01T00:00:06.100Z", updatedAt: "2026-01-01T00:00:06.100Z" }
  );
  snapshot.auth_security_events.push(
    { id: "security-event-a", organizationId: "org-a", userId: "user-a", email: "a@example.com", eventType: "LOGIN_FAILED", message: "Invalid login credentials.", createdAt: "2026-01-01T00:00:06.200Z" }
  );
  snapshot.gateway_route_registry.push(
    { id: "gateway-route-a", organizationId: "org-a", moduleName: "Gateway", routePath: "/gateway/health", method: "GET", apiVersion: "v1", tenantAware: true, rateLimitPolicy: "standard-read", tracingEnabled: true, correlationIdRequired: true, createdAt: "2026-01-01T00:00:06.300Z" }
  );
  snapshot.gateway_api_keys.push(
    { id: "gateway-key-a", organizationId: "org-a", name: "Closed beta integration key", keyPrefix: "led_preview", secretHash: "hashed-secret-placeholder", scopes: ["gateway:read", "integration:read"], expiresAt: "2026-02-01T00:00:00.000Z", status: "ACTIVE", usageMetadata: { createdFromGateway: true, lastUsedAt: "2026-01-01T00:00:06.400Z", usageCount: 1 }, humanApprovalRequired: true, aiSuggested: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:06.400Z" }
  );
  snapshot.integration_providers.push(
    { id: "integration-a", organizationId: "org-a", providerType: "OPENAI", displayName: "OpenAI metadata placeholder", status: "CONFIGURED", configurationMetadata: { configuredFor: "metadata-only" }, scopes: ["model:read"], humanApprovalRequired: true, aiSuggested: false, externalConnectionEnabled: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:06.500Z", updatedAt: "2026-01-01T00:00:06.600Z", enabledBy: "user-a", enabledAt: "2026-01-01T00:00:06.600Z" }
  );
  snapshot.webhooks.push(
    { id: "webhook-a", organizationId: "org-a", eventName: "document.approved", targetUrl: "https://example.test/webhook", secretHash: "hashed-webhook-secret-placeholder", enabled: true, retryPolicy: { maxAttempts: 3, backoffSeconds: 30 }, humanApprovalRequired: true, aiSuggested: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:06.700Z", updatedAt: "2026-01-01T00:00:06.800Z" }
  );
  snapshot.webhook_delivery_logs.push(
    { id: "webhook-delivery-a", organizationId: "org-a", webhookId: "webhook-a", eventName: "document.approved", status: "DELIVERED", attempt: 1, responseStatus: 200, createdAt: "2026-01-01T00:00:06.900Z" }
  );
  snapshot.gateway_audit_events.push(
    { id: "gateway-audit-a", organizationId: "org-a", apiKeyId: "gateway-key-a", action: "API_KEY_CREATED", actorId: "user-a", humanFinalAuthority: true, afterState: { id: "gateway-key-a" }, createdAt: "2026-01-01T00:00:06.410Z" },
    { id: "gateway-audit-b", organizationId: "org-a", webhookId: "webhook-a", action: "WEBHOOK_DELIVERY_LOG_RECORDED", actorId: "user-a", humanFinalAuthority: true, afterState: { id: "webhook-delivery-a" }, createdAt: "2026-01-01T00:00:06.910Z" }
  );
  snapshot.integration_audit_events.push(
    { id: "integration-audit-a", organizationId: "org-a", integrationProviderId: "integration-a", action: "INTEGRATION_ENABLED", actorId: "user-a", humanFinalAuthority: true, afterState: { id: "integration-a" }, createdAt: "2026-01-01T00:00:06.610Z" }
  );
  snapshot.observability_metrics.push(
    { id: "observability-metric-a", organizationId: "org-a", metricName: "api.uptime", metricType: "GAUGE", moduleName: "api", value: 3600, unit: "seconds", requestCount: 10, errorCount: 0, latencyMs: 42, runtimeDatabaseStatus: "AVAILABLE", backupStatus: "CONFIGURED", metadata: { moduleHealth: "READY" }, createdBy: "user-a", recordedAt: "2026-01-01T00:00:06.920Z" }
  );
  snapshot.observability_logs.push(
    { id: "observability-log-a", organizationId: "org-a", severity: "INFO", moduleName: "observability", correlationId: "corr-a", actorId: "user-a", requestPath: "/observability/health", message: "Health dashboard checked.", metadata: { structured: true }, createdAt: "2026-01-01T00:00:06.930Z" }
  );
  snapshot.observability_traces.push(
    { id: "observability-trace-a", organizationId: "org-a", traceId: "trace-a", correlationId: "corr-a", spanName: "observability.health", moduleName: "observability", durationMs: 7, status: "OK", parentSpanId: "parent-placeholder", metadata: { parentSpanPlaceholder: true }, createdAt: "2026-01-01T00:00:06.940Z" }
  );
  snapshot.observability_agent_executions.push(
    { id: "observability-agent-a", organizationId: "org-a", agentName: "Semantic Fidelity Engine", executionType: "SEGMENT_CHECK", projectId: "project-a", documentId: "document-a", status: "SUCCEEDED", durationMs: 30, estimatedCost: 0, tokenUsageMetadata: { provider: "none", totalTokens: 0 }, dependencies: ["terminology", "lexicographic"], auditLink: "semantic-audit-a", humanFinalAuthority: true, aiMayDiagnose: true, aiMaySummarizeIncidents: true, aiMaySuggestRemediation: true, aiMayAutoExecuteInfrastructureActions: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:06.950Z", metadata: { workflowVisibility: true } }
  );
  snapshot.observability_audit_events.push(
    { id: "observability-audit-a", organizationId: "org-a", action: "OBSERVABILITY_METRIC_RECORDED", actorId: "user-a", metricId: "observability-metric-a", afterState: { id: "observability-metric-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:06.921Z" },
    { id: "observability-audit-b", organizationId: "org-a", action: "OBSERVABILITY_LOG_RECORDED", actorId: "user-a", logId: "observability-log-a", afterState: { id: "observability-log-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:06.931Z" },
    { id: "observability-audit-c", organizationId: "org-a", action: "OBSERVABILITY_TRACE_RECORDED", actorId: "user-a", traceId: "observability-trace-a", afterState: { id: "observability-trace-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:06.941Z" },
    { id: "observability-audit-d", organizationId: "org-a", action: "OBSERVABILITY_AGENT_EXECUTION_RECORDED", actorId: "user-a", agentExecutionId: "observability-agent-a", afterState: { id: "observability-agent-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:06.951Z" }
  );
  snapshot.security_policies.push(
    { id: "security-policy-a", organizationId: "org-a", policyType: "API_KEY", name: "Closed beta API key governance", description: "Metadata-only API key governance policy.", status: "ACTIVE", passwordLoginPolicy: { minLength: 12, requireComplexity: true, failedLoginThreshold: 5, lockoutMinutes: 15 }, sessionDurationPolicy: { maxSessionMinutes: 480, idleTimeoutMinutes: 60, refreshTokenRotation: true }, apiKeyPolicy: { maxLifetimeDays: 90, allowedScopes: ["gateway:read"], requireExpiration: true, revokeOnSuspiciousUse: true }, webhookSecurityPolicy: { requireSecretHashing: true, requireHttpsTargets: true, maxRetryAttempts: 3 }, allowedDomains: ["laborator.example"], ipAllowlist: ["203.0.113.10"], ipBlocklist: ["198.51.100.20"], mfaRequirementPlaceholder: true, rolePermissionMatrix: { ADMIN: ["security:governance"], REVIEWER: ["read"] }, organizationAccessPolicy: { adminOnly: true }, tenantIsolationChecks: ["server-derived-organization-context"], humanApprovalRequired: true, aiMayDetectRisks: true, aiMaySuggestPolicyChanges: true, aiMayChangePolicyAutomatically: false, aiSuggested: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:06.960Z", updatedAt: "2026-01-01T00:00:06.960Z", metadata: { externalSsoIntegration: "NOT_CONFIGURED" } }
  );
  snapshot.security_access_reviews.push(
    { id: "security-access-review-a", organizationId: "org-a", reviewName: "Closed beta admin access review", reviewedUserId: "user-a", reviewedRoles: ["ADMIN"], reviewedPermissions: ["review:approve"], rolePermissionMatrix: { ADMIN: ["security:governance"] }, accessFindings: ["No cross-tenant access detected."], tenantIsolationChecks: ["tenant-isolation-reviewed"], status: "PENDING_HUMAN_REVIEW", humanApprovalRequired: true, aiMaySummarizeAccessReviews: true, aiMayApproveAccessReviewAutomatically: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:06.970Z", updatedAt: "2026-01-01T00:00:06.970Z", metadata: { externalSsoIntegration: "NOT_CONFIGURED" } }
  );
  snapshot.security_session_events.push(
    { id: "security-session-event-a", organizationId: "org-a", sessionId: "session-a", userId: "user-a", eventType: "SESSION_REVOCATION_RECORDED", activeSessionMetadata: { ip: "203.0.113.10" }, suspiciousFlags: ["manual-review"], lastSeenAt: "2026-01-01T00:00:06.980Z", revocationRecorded: true, revocationReason: "Metadata-only revocation record.", enforcementMode: "METADATA_ONLY", message: "Metadata-only revocation record.", severity: "HIGH", createdBy: "user-a", createdAt: "2026-01-01T00:00:06.980Z", metadata: { existingAuthSessionNotModified: true } }
  );
  snapshot.security_api_key_events.push(
    { id: "security-api-key-event-a", organizationId: "org-a", apiKeyId: "gateway-key-a", eventType: "API_KEY_SCOPE_DENIED", usagePolicyMetadata: { requestCount: 1 }, scopeValidationMetadata: { requestedScope: "admin:write", allowed: false }, expirationPolicyMetadata: { expiresAt: "2026-02-01T00:00:00.000Z" }, revocationAuditMetadata: { revoked: false }, message: "API key scope denied.", severity: "MEDIUM", createdBy: "user-a", createdAt: "2026-01-01T00:00:06.990Z", metadata: { enforcementMode: "METADATA_ONLY" } }
  );
  snapshot.security_policy_violations.push(
    { id: "security-policy-violation-a", organizationId: "org-a", policyId: "security-policy-a", eventType: "POLICY_VIOLATION", violationType: "IP_BLOCKLIST_MATCH", message: "Request matched IP blocklist metadata.", severity: "HIGH", requestPath: "/gateway/api-keys", userId: "user-a", suspiciousActivityMetadata: { ip: "198.51.100.20" }, enforcementMode: "METADATA_ONLY", resolved: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.000Z", metadata: { noAutomaticUserBlock: true } }
  );
  snapshot.security_audit_events.push(
    { id: "security-audit-a", organizationId: "org-a", action: "SECURITY_POLICY_CREATED", actorId: "user-a", policyId: "security-policy-a", afterState: { id: "security-policy-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:06.961Z" },
    { id: "security-audit-b", organizationId: "org-a", action: "SECURITY_ACCESS_REVIEW_CREATED", actorId: "user-a", accessReviewId: "security-access-review-a", afterState: { id: "security-access-review-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:06.971Z" },
    { id: "security-audit-c", organizationId: "org-a", action: "SECURITY_SESSION_REVOCATION_RECORDED", actorId: "user-a", sessionEventId: "security-session-event-a", afterState: { id: "security-session-event-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:06.981Z" },
    { id: "security-audit-d", organizationId: "org-a", action: "SECURITY_API_KEY_EVENT_RECORDED", actorId: "user-a", apiKeyEventId: "security-api-key-event-a", afterState: { id: "security-api-key-event-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:06.991Z" },
    { id: "security-audit-e", organizationId: "org-a", action: "SECURITY_POLICY_VIOLATION_RECORDED", actorId: "user-a", policyViolationId: "security-policy-violation-a", afterState: { id: "security-policy-violation-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.001Z" }
  );
  snapshot.backup_jobs.push(
    { id: "backup-job-a", organizationId: "org-a", jobType: "FULL", status: "COMPLETED", startedAt: "2026-01-01T00:00:07.010Z", completedAt: "2026-01-01T00:00:17.010Z", durationMs: 10000, sizeBytes: 2048, checksum: "sha256-demo", initiatedBy: "user-a", backupScope: ["projects", "translations", "terminology", "entire_organization"], storageProvider: "RUNTIME_METADATA_ONLY", cloudProviderIntegration: "NOT_CONFIGURED", immutable: true, noPermanentDeletion: true, humanApprovalRequired: true, aiSuggested: false, createdAt: "2026-01-01T00:00:07.010Z", updatedAt: "2026-01-01T00:00:17.010Z", metadata: { realCloudBackupProviderConnected: false } }
  );
  snapshot.backup_restore_events.push(
    { id: "backup-restore-a", organizationId: "org-a", backupJobId: "backup-job-a", restoreStatus: "REQUESTED", requestedBy: "user-a", requestedAt: "2026-01-01T00:00:18.010Z", restorationProcedures: ["validate backup", "metadata-only dry run"], humanApprovalRequired: true, aiInitiated: false, realRestoreExecuted: false, metadata: { noRuntimeRestoreExecuted: true } }
  );
  snapshot.backup_retention_policies.push(
    { id: "backup-retention-a", organizationId: "org-a", name: "Long-term preservation retention", retentionMode: "RETAIN_N_YEARS", retainYears: 10, archiveMetadataForever: true, immutableBackups: true, auditRetention: "PERMANENT", noPermanentDeletion: true, appliesToScopes: ["books", "author_studio", "terminology", "entire_organization"], humanApprovalRequired: true, aiSuggested: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.020Z", updatedAt: "2026-01-01T00:00:07.020Z", metadata: { permanentDeletionDisabled: true } }
  );
  snapshot.disaster_recovery_plans.push(
    { id: "disaster-recovery-a", organizationId: "org-a", name: "Closed beta DR plan", recoveryPointObjective: "24h", recoveryTimeObjective: "4h", recoveryStrategy: "Restore runtime database backup after validation.", priority: "HIGH", failoverNotes: ["manual failover only"], restorationProcedures: ["verify checksum", "restore in staging first"], cloudProviderIntegration: "NOT_CONFIGURED", humanApprovalRequired: true, aiSuggested: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.030Z", updatedAt: "2026-01-01T00:00:07.030Z", metadata: { noAutomaticFailover: true } }
  );
  snapshot.preservation_records.push(
    { id: "preservation-a", organizationId: "org-a", recordType: "AUDIT_PERMANENCE", entityType: "organization", entityId: "org-a", preservationScope: ["books", "entire_organization"], historicalEditions: ["edition-a"], originalSourcePreservation: true, allManuscriptVersions: true, glossaryVersions: true, auditPermanence: true, noPermanentDeletion: true, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.040Z", metadata: { archival: "permanent" } }
  );
  snapshot.backup_audit_events.push(
    { id: "backup-audit-a", organizationId: "org-a", action: "BACKUP_JOB_CREATED", actorId: "user-a", backupJobId: "backup-job-a", afterState: { id: "backup-job-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.011Z" },
    { id: "backup-audit-b", organizationId: "org-a", action: "BACKUP_RETENTION_POLICY_CREATED", actorId: "user-a", retentionPolicyId: "backup-retention-a", afterState: { id: "backup-retention-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.021Z" },
    { id: "backup-audit-c", organizationId: "org-a", action: "DISASTER_RECOVERY_PLAN_CREATED", actorId: "user-a", disasterRecoveryPlanId: "disaster-recovery-a", afterState: { id: "disaster-recovery-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.031Z" },
    { id: "backup-audit-d", organizationId: "org-a", action: "PRESERVATION_RECORD_CREATED", actorId: "user-a", preservationRecordId: "preservation-a", afterState: { id: "preservation-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.041Z" },
    { id: "backup-audit-e", organizationId: "org-a", action: "BACKUP_RESTORE_EVENT_RECORDED", actorId: "user-a", backupJobId: "backup-job-a", restoreEventId: "backup-restore-a", afterState: { id: "backup-restore-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:18.011Z" }
  );
  snapshot.ai_usage_records.push(
    { id: "ai-usage-a", organizationId: "org-a", agentName: "Translation AI", executionType: "SEGMENT_TRANSLATION_ASSIST", projectId: "project-a", documentId: "document-a", userId: "user-a", providerMetadata: { provider: "metadata-only", model: "placeholder" }, inputTokens: 100, outputTokens: 50, totalTokens: 150, estimatedCost: 0.03, currency: "EUR", status: "SUCCEEDED", costPolicyEvaluation: { softLimitWarning: false, hardLimitReached: false, approvalRequiredOverThreshold: false }, externalBillingIntegration: "NOT_CONFIGURED", createdAt: "2026-01-01T00:00:07.050Z", metadata: { providerCostApiConnected: false } }
  );
  snapshot.ai_budgets.push(
    { id: "ai-budget-a", organizationId: "org-a", budgetScope: "PROJECT", scopeRef: "project-a", agentName: "Translation AI", monthlyBudget: 100, perRunLimit: 1, amount: 100, currency: "EUR", period: "MONTHLY", startsAt: "2026-01-01T00:00:00.000Z", endsAt: "2026-01-31T23:59:59.000Z", humanApprovalRequired: true, aiSuggested: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.060Z", updatedAt: "2026-01-01T00:00:07.060Z", metadata: { budgetGovernance: "metadata-only" } }
  );
  snapshot.ai_quotas.push(
    { id: "ai-quota-a", organizationId: "org-a", quotaScope: "AGENT", scopeRef: "Translation AI", agentName: "Translation AI", maxTokensPerRun: 2000, maxCostPerRun: 1, maxRunsPerDay: 100, maxRunsPerMonth: 2000, projectSpecific: false, agentSpecific: true, humanApprovalRequired: true, aiSuggested: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.070Z", updatedAt: "2026-01-01T00:00:07.070Z", metadata: { quotaGovernance: "metadata-only" } }
  );
  snapshot.ai_cost_policies.push(
    { id: "ai-policy-a", organizationId: "org-a", name: "Closed beta AI cost policy", status: "ACTIVE", softLimitWarningThreshold: 0.5, hardLimitMetadata: { maxCostPerRun: 2 }, approvalRequiredOverThreshold: 1, humanOverrideAllowed: true, aiMayEstimateCost: true, aiMaySuggestOptimizations: true, aiMayWarnBudgetRisk: true, aiMayRecommendQuotaChanges: true, aiCannotApproveOwnBudgetIncrease: true, aiCannotBypassHardLimits: true, aiCannotAlterCostHistory: true, aiCannotDeleteUsageRecords: true, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.080Z", updatedAt: "2026-01-01T00:00:07.080Z", metadata: { externalBillingIntegration: "NOT_CONFIGURED" } }
  );
  snapshot.ai_budget_override_requests.push(
    { id: "ai-override-a", organizationId: "org-a", requestedBy: "user-a", requestedForUserId: "user-a", budgetId: "ai-budget-a", quotaId: "ai-quota-a", agentName: "Translation AI", reason: "Closed beta evaluation burst.", requestedAmount: 25, requestedCurrency: "EUR", status: "APPROVED", aiInitiated: false, aiSelfApprovalAttempt: false, humanApprovalRequired: true, approvedBy: "user-a", approvedAt: "2026-01-01T00:00:07.100Z", createdAt: "2026-01-01T00:00:07.090Z", updatedAt: "2026-01-01T00:00:07.100Z", metadata: { finalAuthority: "AUTHORIZED_HUMAN" } }
  );
  snapshot.ai_cost_audit_events.push(
    { id: "ai-audit-a", organizationId: "org-a", action: "AI_USAGE_RECORDED", actorId: "user-a", usageRecordId: "ai-usage-a", afterState: { id: "ai-usage-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.051Z" },
    { id: "ai-audit-b", organizationId: "org-a", action: "AI_BUDGET_CREATED", actorId: "user-a", budgetId: "ai-budget-a", afterState: { id: "ai-budget-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.061Z" },
    { id: "ai-audit-c", organizationId: "org-a", action: "AI_QUOTA_CREATED", actorId: "user-a", quotaId: "ai-quota-a", afterState: { id: "ai-quota-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.071Z" },
    { id: "ai-audit-d", organizationId: "org-a", action: "AI_COST_POLICY_CREATED", actorId: "user-a", policyId: "ai-policy-a", afterState: { id: "ai-policy-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.081Z" },
    { id: "ai-audit-e", organizationId: "org-a", action: "AI_BUDGET_OVERRIDE_REQUEST_CREATED", actorId: "user-a", overrideRequestId: "ai-override-a", afterState: { id: "ai-override-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.091Z" },
    { id: "ai-audit-f", organizationId: "org-a", action: "AI_BUDGET_OVERRIDE_APPROVED", actorId: "user-a", overrideRequestId: "ai-override-a", afterState: { id: "ai-override-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.101Z" }
  );
  snapshot.policy_definitions.push(
    { id: "policy-a", organizationId: "org-a", name: "Human final authority baseline", category: "AI_GOVERNANCE", description: "Central compliance baseline for closed beta.", version: "1.0.0", status: "ACTIVE", effectiveFrom: "2026-01-01T00:00:07.110Z", createdBy: "user-a", approvedBy: "user-a", approvedAt: "2026-01-01T00:00:07.110Z", humanApprovalRequired: true, aiMaySuggest: true, aiMayEnforce: false, complianceRules: { humanFinalAuthorityMandatory: true, noPermanentDeletion: true, originalSourcePreservationMandatory: true, auditTrailMandatory: true, versionHistoryMandatory: true, aiCannotApprovePublications: true, aiCannotApproveBudgets: true, aiCannotRevokeUsersAutomatically: true, aiCannotAlterCitationsAutomatically: true, aiCannotModifyValidatedResearch: true }, createdAt: "2026-01-01T00:00:07.110Z", updatedAt: "2026-01-01T00:00:07.110Z", metadata: { externalComplianceProvider: "NOT_CONFIGURED" } }
  );
  snapshot.policy_evaluations.push(
    { id: "policy-evaluation-a", organizationId: "org-a", policyId: "policy-a", scope: "AI_EXECUTION", aiExecutionId: "observability-agent-a", status: "COMPLIANT", findings: [], evaluatedRules: { humanFinalAuthorityMandatory: true, noPermanentDeletion: true, originalSourcePreservationMandatory: true, auditTrailMandatory: true, versionHistoryMandatory: true, aiCannotApprovePublications: true, aiCannotApproveBudgets: true, aiCannotRevokeUsersAutomatically: true, aiCannotAlterCitationsAutomatically: true, aiCannotModifyValidatedResearch: true }, humanFinalAuthorityRequired: true, aiMaySummarizeCompliance: true, aiMayDetectRisks: true, aiMayEnforce: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.120Z", metadata: { metadataOnly: true } }
  );
  snapshot.policy_exception_requests.push(
    { id: "policy-exception-a", organizationId: "org-a", policyId: "policy-a", evaluationId: "policy-evaluation-a", justification: "Temporary closed beta exception for manual review.", status: "APPROVED", requestedBy: "user-a", approver: "user-a", approvedAt: "2026-01-01T00:00:07.140Z", expirationDate: "2026-02-01T00:00:00.000Z", humanApprovalRequired: true, aiRequested: false, aiApprovalAttempt: false, createdAt: "2026-01-01T00:00:07.130Z", updatedAt: "2026-01-01T00:00:07.140Z", metadata: { finalAuthority: "AUTHORIZED_HUMAN" } }
  );
  snapshot.compliance_records.push(
    { id: "compliance-record-a", organizationId: "org-a", evaluationId: "policy-evaluation-a", policyId: "policy-a", scope: "AI_EXECUTION", status: "COMPLIANT", findings: [], humanFinalAuthorityRequired: true, auditTrailRequired: true, versionHistoryRequired: true, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.121Z", metadata: { externalComplianceProvider: "NOT_CONFIGURED" } }
  );
  snapshot.policy_audit_events.push(
    { id: "policy-audit-a", organizationId: "org-a", action: "POLICY_ACTIVATED", actorId: "user-a", policyId: "policy-a", afterState: { id: "policy-a" }, createdAt: "2026-01-01T00:00:07.111Z" },
    { id: "policy-audit-b", organizationId: "org-a", action: "POLICY_EVALUATED", actorId: "user-a", evaluationId: "policy-evaluation-a", afterState: { id: "policy-evaluation-a" }, createdAt: "2026-01-01T00:00:07.122Z" },
    { id: "policy-audit-c", organizationId: "org-a", action: "COMPLIANCE_RECORD_CREATED", actorId: "user-a", evaluationId: "policy-evaluation-a", complianceRecordId: "compliance-record-a", afterState: { id: "compliance-record-a" }, createdAt: "2026-01-01T00:00:07.123Z" },
    { id: "policy-audit-d", organizationId: "org-a", action: "POLICY_EXCEPTION_APPROVED", actorId: "user-a", exceptionRequestId: "policy-exception-a", afterState: { id: "policy-exception-a" }, createdAt: "2026-01-01T00:00:07.141Z" }
  );
  snapshot.admin_organizations.push(
    { id: "admin-organization-a", organizationId: "org-a", organizationName: "Closed Beta Organization", organizationType: "PERSOANA_FIZICA", workspaces: [], environments: [], projects: [], teams: ["Echipa Revizie"], departments: [], projectIds: [], teamIds: ["team-editorial"], departmentIds: [], status: "ACTIVE", active: true, suspended: false, archived: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.140Z", updatedAt: "2026-01-01T00:00:07.140Z", profile: { timezone: "Europe/Madrid", currency: "EUR" }, metadata: { platformCreatorRoleSeparateFromAdministrator: true } }
  );
  snapshot.admin_teams.push(
    { id: "team-editorial", organizationId: "org-a", name: "Echipa Revizie", description: "Default editorial review team.", projectIds: ["project-a"], taskIds: [], documentIds: ["document-a"], workflowResponsibilities: ["review"], status: "ACTIVE", defaultTeam: true, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.141Z", updatedAt: "2026-01-01T00:00:07.141Z", metadata: { createdByDefaultOrganizationSetup: true } }
  );
  snapshot.admin_users.push(
    { id: "admin-user-a", organizationId: "org-a", email: "closed.beta.user@example.test", displayName: "Closed Beta User", status: "ACTIVE", mfaMetadata: { configured: false, provider: "NOT_CONFIGURED" }, lastLoginMetadata: { lastLoginAt: "2026-01-01T00:00:07.145Z" }, organizationMembershipIds: ["admin-membership-a"], teamMembershipIds: ["team-editorial"], createdBy: "user-a", createdAt: "2026-01-01T00:00:07.142Z", updatedAt: "2026-01-01T00:00:07.146Z", metadata: { authBehaviorPreserved: true } }
  );
  snapshot.admin_permissions.push(
    { id: "admin-permission-a", organizationId: "org-a", scope: "ADMIN", key: "admin:manage-users", description: "Manage users and memberships.", moduleName: "enterprise-admin", projectScoped: false, documentScoped: false, adminScoped: true, apiScoped: false, aiScoped: false, createdAt: "2026-01-01T00:00:07.143Z" }
  );
  snapshot.admin_roles.push(
    { id: "admin-role-a", organizationId: "org-a", name: "EDITOR", displayName: "Editor", description: "Editorial administrator.", builtIn: true, custom: false, permissionIds: ["admin-permission-a"], humanApprovalRequired: true, aiSuggested: false, aiMaySuggestPermissions: true, aiMayGrantAdminAutomatically: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.144Z", updatedAt: "2026-01-01T00:00:07.144Z", metadata: { roleManagement: "metadata-only" } }
  );
  snapshot.admin_memberships.push(
    { id: "admin-membership-a", organizationId: "org-a", userId: "admin-user-a", roleId: "admin-role-a", roleName: "EDITOR", workspaceId: "workspace-editorial", environmentId: "staging", projectId: "project-a", teamId: "team-editorial", departmentId: "department-books", memberStatus: "ACTIVE", assignedBy: "user-a", assignedAt: "2026-01-01T00:00:07.146Z", metadata: { humanFinalAuthority: true } }
  );
  snapshot.admin_invitations.push(
    { id: "admin-invitation-a", organizationId: "org-a", email: "invited.member@example.test", roleId: "admin-role-a", roleName: "EDITOR", workspaceId: "workspace-editorial", teamId: "team-editorial", departmentId: "department-books", status: "PENDING", invitedBy: "user-a", expiresAt: "2026-02-01T00:00:00.000Z", createdAt: "2026-01-01T00:00:07.147Z", metadata: { humanFinalAuthority: true } }
  );
  snapshot.admin_audit_events.push(
    { id: "admin-audit-a", organizationId: "org-a", actorId: "user-a", action: "ADMIN_USER_CREATED", userId: "admin-user-a", afterState: { id: "admin-user-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.142Z" },
    { id: "admin-audit-b", organizationId: "org-a", actorId: "user-a", action: "ADMIN_ROLE_CREATED", roleId: "admin-role-a", afterState: { id: "admin-role-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.144Z" },
    { id: "admin-audit-c", organizationId: "org-a", actorId: "user-a", action: "ADMIN_ROLE_ASSIGNED", userId: "admin-user-a", roleId: "admin-role-a", membershipId: "admin-membership-a", afterState: { id: "admin-membership-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.146Z" },
    { id: "admin-audit-d", organizationId: "org-a", actorId: "user-a", action: "ADMIN_INVITATION_CREATED", invitationId: "admin-invitation-a", afterState: { id: "admin-invitation-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.147Z" }
  );
  snapshot.marketplace_agents.push(
    { id: "marketplace-agent-a", organizationId: "org-a", agentName: "Translation AI", category: "TRANSLATION", version: "1.0.0", providerMetadata: { provider: "metadata-only" }, supportedModules: ["translations", "terminology"], permissionsRequired: ["ai:govern"], costGovernanceLink: "ai-policy-a", policyComplianceLink: "policy-a", status: "ACTIVE", visibility: "ORGANIZATION", installMetadata: { adminApprovalRequired: true }, enabledBy: "user-a", enabledAt: "2026-01-01T00:00:07.150Z", governance: { adminApprovalRequired: true, policyEngineComplianceRequired: true, costGovernanceRequired: true, auditTrailMandatory: true, humanFinalAuthorityRequired: true, aiMaySuggest: true, aiMaySummarizeCatalog: true, aiMayDetectRisk: true, aiCannotSelfEnable: true, aiCannotInstallExtensionsAutomatically: true, aiCannotBypassPolicyGovernance: true, aiCannotBypassCostGovernance: true, externalPluginExecution: "NOT_CONFIGURED", paidMarketplace: "NOT_CONFIGURED" }, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.148Z", updatedAt: "2026-01-01T00:00:07.150Z", metadata: { aiSuggested: false } }
  );
  snapshot.marketplace_extensions.push(
    { id: "marketplace-extension-a", organizationId: "org-a", moduleName: "Editorial Export Extension", capabilities: ["export-metadata"], integrationType: "INTERNAL_MODULE", requiredScopes: ["export:read"], tenantAvailability: ["org-a"], status: "ACTIVE", visibility: "ORGANIZATION", installMetadata: { adminApprovalRequired: true }, enabledBy: "user-a", enabledAt: "2026-01-01T00:00:07.153Z", governance: { adminApprovalRequired: true, policyEngineComplianceRequired: true, costGovernanceRequired: true, auditTrailMandatory: true, humanFinalAuthorityRequired: true, aiMaySuggest: true, aiMaySummarizeCatalog: true, aiMayDetectRisk: true, aiCannotSelfEnable: true, aiCannotInstallExtensionsAutomatically: true, aiCannotBypassPolicyGovernance: true, aiCannotBypassCostGovernance: true, externalPluginExecution: "NOT_CONFIGURED", paidMarketplace: "NOT_CONFIGURED" }, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.151Z", updatedAt: "2026-01-01T00:00:07.153Z", metadata: { externalPluginExecution: "NOT_CONFIGURED" } }
  );
  snapshot.marketplace_installs.push(
    { id: "marketplace-install-a", organizationId: "org-a", agentId: "marketplace-agent-a", catalogItemType: "AGENT", status: "ENABLED", enabledBy: "user-a", enabledAt: "2026-01-01T00:00:07.150Z", installMetadata: { policyEngineComplianceRequired: true, costGovernanceRequired: true }, adminApprovalRequired: true, humanFinalAuthorityRequired: true, policyEngineComplianceRequired: true, costGovernanceRequired: true, externalPluginExecution: "NOT_CONFIGURED", createdAt: "2026-01-01T00:00:07.150Z", updatedAt: "2026-01-01T00:00:07.150Z" },
    { id: "marketplace-install-b", organizationId: "org-a", extensionId: "marketplace-extension-a", catalogItemType: "EXTENSION", status: "ENABLED", enabledBy: "user-a", enabledAt: "2026-01-01T00:00:07.153Z", installMetadata: { policyEngineComplianceRequired: true }, adminApprovalRequired: true, humanFinalAuthorityRequired: true, policyEngineComplianceRequired: true, costGovernanceRequired: true, externalPluginExecution: "NOT_CONFIGURED", createdAt: "2026-01-01T00:00:07.153Z", updatedAt: "2026-01-01T00:00:07.153Z" }
  );
  snapshot.marketplace_audit_events.push(
    { id: "marketplace-audit-a", organizationId: "org-a", actorId: "user-a", action: "MARKETPLACE_AGENT_ENABLED", agentId: "marketplace-agent-a", installId: "marketplace-install-a", afterState: { id: "marketplace-agent-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.150Z" },
    { id: "marketplace-audit-b", organizationId: "org-a", actorId: "user-a", action: "MARKETPLACE_EXTENSION_ENABLED", extensionId: "marketplace-extension-a", installId: "marketplace-install-b", afterState: { id: "marketplace-extension-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.153Z" }
  );
  snapshot.workspace_layouts.push(
    { id: "workspace-layout-a", organizationId: "org-a", name: "Unified Enterprise Workspace", defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], dashboardRoute: "/workspace/dashboard", navigationRoute: "/workspace/navigation", visibleModules: ["DASHBOARD", "MY_PROJECTS", "AUTHOR_STUDIO", "TRANSLATION", "LEXICOGRAPHIC", "SEMANTIC_FIDELITY", "RESEARCH_HUB", "LIBRARY", "COMMERCE", "PUBLIC_PORTAL", "COLLABORATION", "MARKETPLACE", "ADMINISTRATION", "SECURITY", "OBSERVABILITY", "BACKUP", "POLICIES"], humanFinalAuthorityRequired: true, aiMaySuggestDashboardLayouts: true, aiMaySuggestWidgets: true, aiMayRecommendShortcuts: true, aiMayAlterPermissions: false, aiMayExposeHiddenModules: false, aiMayChangePolicies: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.154Z", updatedAt: "2026-01-01T00:00:07.154Z", metadata: { backendOnly: true } }
  );
  snapshot.workspace_navigation_items.push(
    { id: "workspace-nav-a", organizationId: "org-a", title: "Dashboard", module: "DASHBOARD", icon: "layout-dashboard", route: "/dashboard", visible: true, order: 1, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE", createdBy: "user-a", createdAt: "2026-01-01T00:00:07.155Z", updatedAt: "2026-01-01T00:00:07.155Z", metadata: { roleBasedNavigation: true } },
    { id: "workspace-nav-b", organizationId: "org-a", title: "Administration", module: "ADMINISTRATION", icon: "shield-user", route: "/admin", visible: true, order: 13, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE", createdBy: "user-a", createdAt: "2026-01-01T00:00:07.156Z", updatedAt: "2026-01-01T00:00:07.156Z", metadata: { roleBasedNavigation: true } }
  );
  snapshot.workspace_widgets.push(
    { id: "workspace-widget-a", organizationId: "org-a", widgetType: "RECENT_PROJECTS", title: "Recent projects", visible: true, order: 1, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], configuration: {}, aiSuggested: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.157Z", updatedAt: "2026-01-01T00:00:07.157Z", metadata: { roleBasedDashboard: true } },
    { id: "workspace-widget-b", organizationId: "org-a", widgetType: "AI_USAGE", title: "AI usage", visible: true, order: 5, size: "SMALL", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false, createdBy: "user-a", createdAt: "2026-01-01T00:00:07.158Z", updatedAt: "2026-01-01T00:00:07.158Z", metadata: { roleBasedDashboard: true } }
  );
  snapshot.workspace_preferences.push(
    { id: "workspace-preferences-a", organizationId: "org-a", userId: "user-a", favoriteModules: ["DASHBOARD", "MY_PROJECTS"], dashboardLayout: { columns: 3 }, collapsedMenus: ["admin"], themeMetadata: { theme: "system" }, language: "ro", notificationPreferences: { inApp: true, email: false }, createdAt: "2026-01-01T00:00:07.159Z", updatedAt: "2026-01-01T00:00:07.159Z", metadata: { aiMayAlterPermissions: false, aiMayExposeHiddenModules: false, aiMayChangePolicies: false } }
  );
  snapshot.workspace_collaborator_invitations.push(
    { id: "workspace-invitation-a", organizationId: "org-a", inviteeEmail: "translator@example.test", inviteeName: "Translator One", projectId: "project-a", role: "TRANSLATOR", permittedTools: ["DASHBOARD", "MY_PROJECTS", "TRANSLATION", "LEXICOGRAPHIC", "COLLABORATION"], accessScope: { projectId: "project-a", documentIds: ["document-a"], chapterIds: ["chapter-a"], sectionIds: ["section-a"], segmentIds: ["segment-a"] }, startsAt: "2026-01-01T00:00:07.159Z", expiresAt: "2026-02-01T00:00:00.000Z", reason: "Assigned translation scope only.", status: "ACCEPTED", sentBy: "user-a", sentAt: "2026-01-01T00:00:07.159Z", acceptedBy: "user-c", acceptedAt: "2026-01-01T00:00:07.159Z", accessGrantId: "workspace-grant-a", preview: { visiblePanels: ["sourceText", "translation", "linguisticResources"], hiddenPanels: ["financialData", "rightsNegotiations", "administration"], permittedActions: ["viewSource", "saveTranslation"], restrictedResourceTypes: ["ADMINISTRATION", "DISTRIBUTION", "RIGHTS_RECORD"], restrictedMetadataReturned: false }, metadata: { hiddenDataLoadedThroughApi: false } }
  );
  snapshot.workspace_need_to_know_grants.push(
    { id: "workspace-grant-a", organizationId: "org-a", userId: "user-c", collaboratorEmail: "translator@example.test", collaboratorName: "Translator One", projectId: "project-a", role: "TRANSLATOR", permittedTools: ["DASHBOARD", "MY_PROJECTS", "TRANSLATION", "LEXICOGRAPHIC", "COLLABORATION"], accessScope: { projectId: "project-a", documentIds: ["document-a"], chapterIds: ["chapter-a"], sectionIds: ["section-a"], segmentIds: ["segment-a"] }, startsAt: "2026-01-01T00:00:07.159Z", expiresAt: "2026-02-01T00:00:00.000Z", reason: "Assigned translation scope only.", grantedBy: "user-a", grantedAt: "2026-01-01T00:00:07.159Z", status: "ACTIVE", temporary: true, confidentialClassification: "INTERNAL", mostRestrictiveRuleApplied: true, metadata: { hiddenDataLoadedThroughApi: false } }
  );
  snapshot.workspace_audit_events.push(
    { id: "workspace-audit-a", organizationId: "org-a", actorId: "user-a", action: "WORKSPACE_LAYOUT_CREATED", layoutId: "workspace-layout-a", afterState: { id: "workspace-layout-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.154Z" },
    { id: "workspace-audit-b", organizationId: "org-a", actorId: "user-a", action: "WORKSPACE_WIDGET_CREATED", widgetId: "workspace-widget-a", afterState: { id: "workspace-widget-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.157Z" },
    { id: "workspace-audit-c", organizationId: "org-a", actorId: "user-a", action: "WORKSPACE_PREFERENCES_SAVED", preferenceId: "workspace-preferences-a", afterState: { id: "workspace-preferences-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.159Z" },
    { id: "workspace-audit-d", organizationId: "org-a", actorId: "user-a", action: "INVITATION_SENT", invitationId: "workspace-invitation-a", projectId: "project-a", afterState: { id: "workspace-invitation-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.159Z" },
    { id: "workspace-audit-e", organizationId: "org-a", actorId: "user-c", action: "NEED_TO_KNOW_ACCESS_GRANTED", accessGrantId: "workspace-grant-a", invitationId: "workspace-invitation-a", projectId: "project-a", afterState: { id: "workspace-grant-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.159Z" }
  );
  snapshot.launch_mfa_records.push(
    { id: "launch-mfa-a", organizationId: "org-a", userId: "user-a", role: "ADMIN", status: "ENABLED", totpSecretPlaceholder: "TOTP_SECRET_PLACEHOLDER", recoveryCodesMetadata: { generated: true, codeCount: 10, lastGeneratedAt: "2026-01-01T00:00:07.160Z", storedAsHashPlaceholder: true }, externalMfaProvider: "NOT_CONFIGURED", enabledBy: "user-a", enabledAt: "2026-01-01T00:00:07.160Z", auditRequired: true, humanFinalAuthorityRequired: true, createdAt: "2026-01-01T00:00:07.160Z", updatedAt: "2026-01-01T00:00:07.160Z" }
  );
  snapshot.launch_gdpr_consents.push(
    { id: "launch-gdpr-consent-a", organizationId: "org-a", userId: "user-a", consentType: "closed_beta_terms", status: "ACCEPTED", acceptedAt: "2026-01-01T00:00:07.161Z", source: "USER_ACTION", auditRequired: true, createdAt: "2026-01-01T00:00:07.161Z", updatedAt: "2026-01-01T00:00:07.161Z" }
  );
  snapshot.launch_gdpr_requests.push(
    { id: "launch-gdpr-request-a", organizationId: "org-a", userId: "user-a", requestType: "PERSONAL_DATA_EXPORT", status: "REQUESTED", requestedAt: "2026-01-01T00:00:07.162Z", exportMetadata: { metadataOnly: true }, noAdvancedRetentionEngine: true, auditRequired: true, humanFinalAuthorityRequired: true, createdAt: "2026-01-01T00:00:07.162Z", updatedAt: "2026-01-01T00:00:07.162Z" }
  );
  snapshot.launch_secret_vault_entries.push(
    { id: "launch-secret-a", organizationId: "org-a", name: "JWT signing secret metadata", secretType: "JWT", encryptedValuePlaceholder: "ENCRYPTED_VALUE_PLACEHOLDER", hashedValuePlaceholder: "HASHED_VALUE_PLACEHOLDER", rotationMetadata: { rotationRequired: true, nextRotationDueAt: "2026-02-01T00:00:00.000Z" }, accessAuditMetadata: { accessCount: 0 }, externalVaultProvider: "NOT_CONFIGURED", createdBy: "user-a", createdAt: "2026-01-01T00:00:07.163Z", updatedAt: "2026-01-01T00:00:07.163Z" }
  );
  snapshot.launch_essentials_audit_events.push(
    { id: "launch-audit-a", organizationId: "org-a", actorId: "user-a", action: "MFA_METADATA_ENABLED", mfaRecordId: "launch-mfa-a", afterState: { id: "launch-mfa-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.160Z" },
    { id: "launch-audit-b", organizationId: "org-a", actorId: "user-a", action: "GDPR_CONSENT_ACCEPTED", gdprConsentId: "launch-gdpr-consent-a", afterState: { id: "launch-gdpr-consent-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.161Z" },
    { id: "launch-audit-c", organizationId: "org-a", actorId: "user-a", action: "SECRET_METADATA_STORED", secretId: "launch-secret-a", afterState: { id: "launch-secret-a" }, humanFinalAuthority: true, createdAt: "2026-01-01T00:00:07.163Z" }
  );
  snapshot.organization_founder_protection.push(
    { id: "founder-a", organizationId: "org-a", founderUserId: "user-a", protectionStatus: "ACTIVE", recoveryEnabled: true, createdAt: "2026-01-01T00:00:07.000Z", updatedAt: "2026-01-01T00:00:07.000Z" }
  );
  snapshot.founder_ownership_transfers.push(
    { id: "founder-transfer-a", organizationId: "org-a", fromFounderUserId: "user-a", toFounderUserId: "user-c", status: "PENDING", requestedBy: "user-a", createdAt: "2026-01-01T00:00:08.000Z", expiresAt: "2026-01-31T00:00:08.000Z" }
  );
  snapshot.projects.push(
    { id: "project-a", organizationId: "org-a", name: "Project A", sourceLanguage: "es", targetLanguages: ["ro"], status: "ACTIVE", createdBy: "user-a", createdAt: "2026-01-01T00:01:00.000Z", updatedAt: "2026-01-01T00:01:00.000Z" },
    { id: "project-b", organizationId: "org-b", name: "Project B", sourceLanguage: "en", targetLanguages: ["ro"], status: "ACTIVE", createdBy: "user-b", createdAt: "2026-01-01T00:01:01.000Z", updatedAt: "2026-01-01T00:01:01.000Z" }
  );
  snapshot.documents.push(
    { id: "document-a", organizationId: "org-a", projectId: "project-a", title: "Document A", sourceLanguage: "es", targetLanguage: "ro", documentType: "text", status: "DRAFT", createdBy: "user-a", createdAt: "2026-01-01T00:02:00.000Z", updatedAt: "2026-01-01T00:02:00.000Z", translatorId: "user-a", translatorName: "Translator A", originalAuthorName: "Author A", translatorAttribution: { translatorId: "user-a", translatorName: "Translator A", originalAuthorName: "Author A", originalAuthorAttributionPreserved: true, visibleInEditorialRecords: true, visibleInPublicationRecords: true } },
    { id: "document-b", organizationId: "org-b", projectId: "project-b", title: "Document B", sourceLanguage: "en", targetLanguage: "ro", documentType: "text", status: "DRAFT", createdBy: "user-b", createdAt: "2026-01-01T00:02:01.000Z", updatedAt: "2026-01-01T00:02:01.000Z" }
  );
  snapshot.document_segments.push(
    { id: "segment-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", sourceText: "El espiritu.", sourceLanguage: "es", targetLanguage: "ro", order: 1, status: "TRANSLATED", createdBy: "user-a", createdAt: "2026-01-01T00:03:00.000Z", updatedAt: "2026-01-01T00:03:00.000Z" },
    { id: "segment-b", organizationId: "org-b", projectId: "project-b", documentId: "document-b", sourceText: "The spirit.", sourceLanguage: "en", targetLanguage: "ro", order: 1, status: "NEW", createdBy: "user-b", createdAt: "2026-01-01T00:03:01.000Z", updatedAt: "2026-01-01T00:03:01.000Z" }
  );
  snapshot.segment_translations.push(
    { id: "translation-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", segmentId: "segment-a", sourceText: "El espiritu.", targetText: "Spiritul.", sourceLanguage: "es", targetLanguage: "ro", status: "VALIDATED", createdBy: "user-a", translatorId: "user-a", translatorName: "Translator A", originalAuthorName: "Author A", createdAt: "2026-01-01T00:04:00.000Z", updatedAt: "2026-01-01T00:04:00.000Z" }
  );
  snapshot.export_artifacts.push(
    { id: "export-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", format: "JSON_MASTER", artifact: { formatVersion: "1.0" }, createdBy: "user-a", createdAt: "2026-01-01T00:05:00.000Z", metadata: { translatorAttribution: [{ translatorId: "user-a", translatorName: "Translator A", originalAuthorName: "Author A", originalAuthorAttributionPreserved: true, visibleInPublicationRecords: true }] } }
  );
  snapshot.rights_collaboration_agreements.push(
    { id: "rights-contract-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", agreementType: "TRANSLATOR", status: "ACCEPTED", collaboratorId: "user-a", collaboratorName: "Translator A", startDate: "2026-01-01", endDate: "2026-12-31", attachedDocumentMetadata: { fileName: "translator-agreement.pdf", reference: "internal-rights-a" }, notes: "Translator collaboration agreement metadata.", createdBy: "user-a", createdAt: "2026-01-01T00:05:10.000Z", updatedAt: "2026-01-01T00:05:10.000Z" }
  );
  snapshot.rights_translation_authorizations.push(
    { id: "rights-translation-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", originalAuthor: "Author A", rightsHolder: "Rights Holder A", translationAuthorized: false, authorizedLanguages: ["ro"], territories: ["EU"], validUntil: "2026-12-31", authorizationDocumentMetadata: { fileName: "translation-authorization.pdf", reference: "internal-rights-b" }, notes: "Translation authorization pending human confirmation.", createdBy: "user-a", createdAt: "2026-01-01T00:05:11.000Z", updatedAt: "2026-01-01T00:05:11.000Z" }
  );
  snapshot.rights_publishing_authorizations.push(
    { id: "rights-publishing-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", publicationAuthorized: false, ebookAllowed: false, printAllowed: false, pdfAllowed: false, mobiAllowed: false, audiobookAllowed: false, videoAllowed: false, commercialDistributionAllowed: false, notes: "Publication rights pending human confirmation.", createdBy: "user-a", createdAt: "2026-01-01T00:05:12.000Z", updatedAt: "2026-01-01T00:05:12.000Z" }
  );
  snapshot.rights_provenance_records.push(
    { id: "rights-provenance-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", originalTitle: "Document A Original", originalLanguage: "es", firstPublicationYear: 1860, originalEdition: "1860 edition", originalPublisher: "Original Publisher", originalSourceReference: "Chapter I", originalAuthor: "Author A", translator: "Translator A", reviewer: "Reviewer A", publisher: "Laboratorul Editurii", publicationHistory: ["Original publication", "Romanian translation preparation"], metadata: { provenancePreserved: true }, createdBy: "user-a", createdAt: "2026-01-01T00:05:13.000Z", updatedAt: "2026-01-01T00:05:13.000Z" }
  );
  snapshot.rights_audit_events.push(
    { id: "rights-audit-a", organizationId: "org-a", action: "COLLABORATION_AGREEMENT_CREATED", actorId: "user-a", collaborationAgreementId: "rights-contract-a", afterState: { id: "rights-contract-a" }, humanFinalAuthorityRequired: true, aiMaySummarizeAgreements: true, aiMayDetectMissingPermissions: true, aiMayApproveAgreements: false, aiMayAuthorizeTranslations: false, aiMayAuthorizePublication: false, aiMayModifyProvenanceAutomatically: false, createdAt: "2026-01-01T00:05:10.000Z" },
    { id: "rights-audit-b", organizationId: "org-a", action: "TRANSLATION_AUTHORIZATION_CREATED", actorId: "user-a", translationAuthorizationId: "rights-translation-a", afterState: { id: "rights-translation-a" }, humanFinalAuthorityRequired: true, aiMaySummarizeAgreements: true, aiMayDetectMissingPermissions: true, aiMayApproveAgreements: false, aiMayAuthorizeTranslations: false, aiMayAuthorizePublication: false, aiMayModifyProvenanceAutomatically: false, createdAt: "2026-01-01T00:05:11.000Z" },
    { id: "rights-audit-c", organizationId: "org-a", action: "PUBLISHING_AUTHORIZATION_CREATED", actorId: "user-a", publishingAuthorizationId: "rights-publishing-a", afterState: { id: "rights-publishing-a" }, humanFinalAuthorityRequired: true, aiMaySummarizeAgreements: true, aiMayDetectMissingPermissions: true, aiMayApproveAgreements: false, aiMayAuthorizeTranslations: false, aiMayAuthorizePublication: false, aiMayModifyProvenanceAutomatically: false, createdAt: "2026-01-01T00:05:12.000Z" },
    { id: "rights-audit-d", organizationId: "org-a", action: "PROVENANCE_RECORD_CREATED", actorId: "user-a", provenanceRecordId: "rights-provenance-a", afterState: { id: "rights-provenance-a" }, humanFinalAuthorityRequired: true, aiMaySummarizeAgreements: true, aiMayDetectMissingPermissions: true, aiMayApproveAgreements: false, aiMayAuthorizeTranslations: false, aiMayAuthorizePublication: false, aiMayModifyProvenanceAutomatically: false, createdAt: "2026-01-01T00:05:13.000Z" }
  );
  snapshot.foundation_audit_events.push(
    { id: "audit-a", organizationId: "org-a", actorId: "user-a", action: "CREATE", entityType: "PROJECT", entityId: "project-a", afterState: { id: "project-a" }, createdAt: "2026-01-01T00:06:00.000Z" }
  );
  snapshot.translation_memory_entries.push(
    { id: "tm-a", organizationId: "org-a", sourceText: "El espiritu.", targetText: "Spiritul.", sourceLanguage: "es", targetLanguage: "ro", confidenceScore: 1, approvalStatus: "APPROVED", origin: "HUMAN", createdBy: "user-a", createdAt: "2026-01-01T00:07:00.000Z", updatedAt: "2026-01-01T00:07:00.000Z" }
  );
  snapshot.translation_memory_audit_events.push(
    { id: "tm-audit-a", organizationId: "org-a", tmEntryId: "tm-a", action: "CREATE", actorId: "user-a", createdAt: "2026-01-01T00:07:01.000Z" }
  );
  snapshot.terminology_terms.push(
    { id: "term-a", organizationId: "org-a", term: "espiritu", language: "es", domain: "spiritism", status: "VALIDATED", createdBy: "user-a", createdAt: "2026-01-01T00:08:00.000Z", updatedAt: "2026-01-01T00:08:00.000Z" }
  );
  snapshot.terminology_audit_events.push(
    { id: "term-audit-a", organizationId: "org-a", terminologyTermId: "term-a", action: "VALIDATE", actorId: "user-a", createdAt: "2026-01-01T00:08:01.000Z" }
  );
  snapshot.qa_reports.push(
    { id: "qa-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", segmentId: "segment-a", scope: "SEGMENT", score: 100, issueCount: 0, createdBy: "user-a", createdAt: "2026-01-01T00:09:00.000Z", updatedAt: "2026-01-01T00:09:00.000Z" }
  );
  snapshot.qa_issues.push(
    { id: "qa-issue-a", organizationId: "org-a", qaReportId: "qa-a", issueType: "PUNCTUATION_MISMATCH", severity: "LOW", message: "Check punctuation", resolved: false, createdAt: "2026-01-01T00:09:01.000Z" }
  );
  snapshot.qa_audit_events.push(
    { id: "qa-audit-a", organizationId: "org-a", qaReportId: "qa-a", action: "QA_RUN", actorId: "user-a", createdAt: "2026-01-01T00:09:02.000Z" }
  );
  snapshot.semantic_fidelity_reports.push(
    { id: "semantic-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", segmentId: "segment-a", scope: "SEGMENT", score: 98, riskLevel: "LOW", issueCount: 0, createdBy: "user-a", createdAt: "2026-01-01T00:10:00.000Z", updatedAt: "2026-01-01T00:10:00.000Z" }
  );
  snapshot.semantic_fidelity_issues.push(
    { id: "semantic-issue-a", organizationId: "org-a", semanticReportId: "semantic-a", issueType: "MEANING_DRIFT", riskLevel: "LOW", message: "Low risk", resolved: false, createdAt: "2026-01-01T00:10:01.000Z" }
  );
  snapshot.semantic_fidelity_audit_events.push(
    { id: "semantic-audit-a", organizationId: "org-a", semanticReportId: "semantic-a", action: "SEMANTIC_CHECK", actorId: "user-a", createdAt: "2026-01-01T00:10:02.000Z" }
  );
  snapshot.workflow_states.push(
    { id: "workflow-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", scope: "DOCUMENT", status: "READY_FOR_EXPORT", createdBy: "user-a", createdAt: "2026-01-01T00:11:00.000Z", updatedAt: "2026-01-01T00:11:00.000Z" }
  );
  snapshot.workflow_transitions.push(
    { id: "workflow-transition-a", organizationId: "org-a", workflowStateId: "workflow-a", projectId: "project-a", documentId: "document-a", scope: "DOCUMENT", toStatus: "READY_FOR_EXPORT", action: "READY_FOR_EXPORT", actorId: "user-a", createdAt: "2026-01-01T00:11:01.000Z" }
  );
  snapshot.workflow_audit_events.push(
    { id: "workflow-audit-a", organizationId: "org-a", workflowStateId: "workflow-a", action: "READY_FOR_EXPORT", actorId: "user-a", createdAt: "2026-01-01T00:11:02.000Z" }
  );
  snapshot.lexicographic_sources.push(
    { id: "lex-source-a", organizationId: "org-a", type: "BILINGUAL_DICTIONARY", title: "Dicționar spaniol-român și român-spaniol", authors: ["Alexandru Calciu", "Zaira Samharadze"], sourceLanguages: ["es"], targetLanguages: ["ro"], authority: "ACADEMIC_DICTIONARY", createdBy: "user-a", createdAt: "2026-01-01T00:12:00.000Z" }
  );
  snapshot.lexicographic_entries.push(
    { id: "lex-entry-a", organizationId: "org-a", sourceId: "lex-source-a", term: "espíritu", normalizedTerm: "espiritu", sourceLanguage: "es", targetLanguage: "ro", senses: [], citations: [], createdBy: "user-a", createdAt: "2026-01-01T00:12:01.000Z" }
  );
  snapshot.lexicographic_decisions.push(
    { id: "lex-decision-a", organizationId: "org-a", term: "espíritu", sourceLanguage: "es", targetLanguage: "ro", selectedAuthority: "ACADEMIC_DICTIONARY", decision: "Use as supporting evidence only.", rationale: "Dictionary evidence is non-authoritative.", priorityRule: ["VALIDATED_PLATFORM_GLOSSARY", "DOCUMENTED_EDITORIAL_DECISION", "SPECIALIZED_DICTIONARY", "ACADEMIC_DICTIONARY", "AI_SUGGESTION"], status: "PENDING_HUMAN_APPROVAL", humanFinalAuthority: true, decidedBy: "user-a", decidedAt: "2026-01-01T00:12:02.000Z" }
  );
  snapshot.lexicographic_audit_events.push(
    { id: "lex-audit-a", organizationId: "org-a", action: "CREATE_ENTRY", actorId: "user-a", entityType: "dictionary_entry", entityId: "lex-entry-a", createdAt: "2026-01-01T00:12:03.000Z" }
  );
  snapshot.editorial_decisions.push(
    { id: "editorial-a", organizationId: "org-a", editorialDecisionId: "editorial-a", sourceText: "El espíritu.", targetText: "Spiritul.", sourceLanguage: "es", targetLanguage: "ro", domain: "spiritism", recommendation: "Follow validated glossary.", alternatives: ["Spiritul."], rationale: "Validated glossary has priority.", confidenceScore: 0.91, evidenceSources: [{ sourceType: "VALIDATED_GLOSSARY", sourceId: "term-a", label: "Validated glossary", priorityRank: 1, authoritative: true, humanFinalAuthority: true }], humanApprovalRequired: true, approvalStatus: "APPROVED", approvedBy: "user-a", approvedAt: "2026-01-01T00:13:01.000Z", auditTrail: [{ action: "RECOMMENDATION_CREATED", actorId: "user-a", at: "2026-01-01T00:13:00.000Z", version: 1 }], version: 1, createdBy: "user-a", createdAt: "2026-01-01T00:13:00.000Z", updatedAt: "2026-01-01T00:13:01.000Z" }
  );
  snapshot.editorial_decision_audit_events.push(
    { id: "editorial-audit-a", organizationId: "org-a", editorialDecisionId: "editorial-a", action: "RECOMMENDATION_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:13:00.000Z" }
  );
  snapshot.layout_publication_plans.push(
    { id: "layout-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", publicationKind: "BOOK", title: "Document A", language: "ro", bookLayout: { chapters: ["chapter-1"], sections: [], footnotes: [], tableOfContents: true, indexes: [], illustrations: [], captions: [], pageTemplates: ["chapter"] }, editorialFinishing: { widowOrphanControl: true, typographyValidation: true, spacing: "STANDARD", kerning: true, margins: "EUROPEAN_STANDARD", bleed: "3mm", pagination: "MANUAL_REVIEW_REQUIRED", printProfiles: ["PDF_X"] }, exportFormats: ["JSON_MASTER", "PDF", "EPUB"], multimedia: { audioChapters: [], synchronizedNarration: false, videoAssets: [], illustrations: [], galleries: [] }, layoutVersion: 1, styleRevision: 1, publicationHistory: [{ id: "layout-history-a", action: "LAYOUT_PLAN_CREATED", actorId: "user-a", at: "2026-01-01T00:14:00.000Z", layoutVersion: 1, styleRevision: 1 }], exportHistory: [], approvalStatus: "PENDING_HUMAN_APPROVAL", humanApprovalRequired: true, createdBy: "user-a", createdAt: "2026-01-01T00:14:00.000Z", updatedAt: "2026-01-01T00:14:00.000Z" }
  );
  snapshot.layout_publication_audit_events.push(
    { id: "layout-audit-a", organizationId: "org-a", layoutPublicationPlanId: "layout-a", action: "LAYOUT_PLAN_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:14:00.000Z" }
  );
  snapshot.media_localization_projects.push(
    { id: "media-localization-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", multimediaProjectId: "media-project-a", layoutPublicationPlanId: "layout-a", title: "Document A localized media", sourceLanguage: "es", targetLanguages: ["ro"], projectKind: "MIXED", imageLocalization: { translatableTextRegions: ["region-title"], translatedTextReplacement: true, preserveIllustrationLayout: true, preserveTypographyStyle: true, localizedImageVersions: ["localized-image-a"] }, subtitleLocalization: { subtitleTracks: ["subtitle-a"], multilingualSubtitles: ["ro"], timingMetadata: { fps: "25" }, captionStyles: ["default"] }, voiceOverDubbing: { voiceTracks: ["voice-a"], dubbingProjects: ["dubbing-a"], narratorProfiles: ["narrator-a"], synchronizationMetadata: { sync: "draft" } }, videoLocalization: { localizedVideos: ["localized-video-a"], localizedCaptions: ["caption-a"], multilingualAudioTracks: ["audio-a"] }, localizationQa: { terminologyValidation: true, lexicographicSupport: true, semanticFidelity: true, editorialDecisionSupport: true, glossaryPrecedence: "VALIDATED_GLOSSARY_OVER_MEDIA_AI", terminologyRefs: ["term-a"], lexicographicRefs: ["lex-entry-a"], semanticReportRefs: ["semantic-a"], editorialDecisionRefs: ["editorial-a"] }, assetIds: ["media-localization-asset-a"], versionHistory: [{ id: "media-localization-version-a", version: 1, createdBy: "user-a", createdAt: "2026-01-01T00:14:30.000Z", notes: "Media localization project created." }], auditTrail: [{ id: "media-localization-trail-a", action: "MEDIA_LOCALIZATION_PROJECT_CREATED", actorId: "user-a", at: "2026-01-01T00:14:30.000Z", version: 1 }], approvalStatus: "PENDING_HUMAN_APPROVAL", humanApprovalRequired: true, providerIntegrationStatus: "PLACEHOLDER_ONLY", createdBy: "user-a", createdAt: "2026-01-01T00:14:30.000Z", updatedAt: "2026-01-01T00:14:30.000Z" }
  );
  snapshot.media_localization_assets.push(
    { id: "media-localization-asset-a", organizationId: "org-a", mediaLocalizationProjectId: "media-localization-a", assetType: "SUBTITLE_TRACK", title: "Romanian subtitles", language: "ro", sourceUri: "media://source.srt", localizedUri: "media://ro.srt", sourceReferences: ["document-a"], timingMetadata: { fps: "25" }, captionStyles: ["default"], synchronizationMetadata: { sync: "draft" }, qaEvidence: { terminologyValidation: true, lexicographicSupport: true, semanticFidelity: true, editorialDecisionSupport: true, glossaryPrecedence: "VALIDATED_GLOSSARY_OVER_MEDIA_AI", terminologyRefs: ["term-a"], lexicographicRefs: ["lex-entry-a"], semanticReportRefs: ["semantic-a"], editorialDecisionRefs: ["editorial-a"] }, versionHistory: [{ id: "media-localization-asset-version-a", version: 1, createdBy: "user-a", createdAt: "2026-01-01T00:14:31.000Z", notes: "Media localization asset created." }], createdBy: "user-a", createdAt: "2026-01-01T00:14:31.000Z", updatedAt: "2026-01-01T00:14:31.000Z" }
  );
  snapshot.media_localization_audit_events.push(
    { id: "media-localization-audit-a", organizationId: "org-a", mediaLocalizationProjectId: "media-localization-a", mediaLocalizationAssetId: "media-localization-asset-a", action: "MEDIA_LOCALIZATION_ASSET_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:14:32.000Z" }
  );
  snapshot.multimedia_projects.push(
    { id: "media-project-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", title: "Document A Trailer", language: "ro", kind: "VIDEO", videoProfile: { bookTrailers: true, educationalVideos: true, reelsShorts: true, subtitleTrackIds: [], narrationSynchronization: true, linkedAssetIds: ["media-asset-a"] }, assetIds: ["media-asset-a"], versionHistory: [{ id: "media-version-a", version: 1, createdBy: "user-a", createdAt: "2026-01-01T00:15:00.000Z", notes: "Multimedia project created." }], exportHistory: [], auditTrail: [{ id: "media-trail-a", action: "MEDIA_PROJECT_CREATED", actorId: "user-a", at: "2026-01-01T00:15:00.000Z", version: 1 }], approvalStatus: "PENDING_HUMAN_APPROVAL", humanApprovalRequired: true, providerIntegrationStatus: "PLACEHOLDER_ONLY", createdBy: "user-a", createdAt: "2026-01-01T00:15:00.000Z", updatedAt: "2026-01-01T00:15:00.000Z" }
  );
  snapshot.multimedia_assets.push(
    { id: "media-asset-a", organizationId: "org-a", multimediaProjectId: "media-project-a", assetType: "VIDEO", title: "Trailer draft", uri: "media://trailer-draft.mp4", language: "ro", sourceReferences: ["document-a"], rights: { license: "internal-beta" }, versionHistory: [{ id: "media-asset-version-a", version: 1, createdBy: "user-a", createdAt: "2026-01-01T00:15:01.000Z", notes: "Media asset created." }], createdBy: "user-a", createdAt: "2026-01-01T00:15:01.000Z", updatedAt: "2026-01-01T00:15:01.000Z" }
  );
  snapshot.multimedia_audit_events.push(
    { id: "media-audit-a", organizationId: "org-a", multimediaProjectId: "media-project-a", multimediaAssetId: "media-asset-a", action: "MEDIA_ASSET_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:15:02.000Z" }
  );
  snapshot.platform_engineering_plans.push(
    { id: "platform-plan-a", organizationId: "org-a", planKind: "OPTIMIZATION", title: "Optimize API runtime", riskLevel: "LOW", optimization: { backendOptimizationRecommendations: ["Review slow endpoints"], databaseIndexOptimizationRecommendations: ["Review project indexes"], cacheRecommendations: ["Evaluate read-through cache"], dockerResourceRecommendations: ["Review memory limits"], aiCostOptimizationRecommendations: ["Batch low-risk prompts"] }, approvalStatus: "PENDING_HUMAN_APPROVAL", humanApprovalRequired: true, executionMode: "PLANNING_ONLY", destructiveActionsExecuted: false, auditTrail: [{ id: "platform-trail-a", action: "OPTIMIZATION_PLAN_CREATED", actorId: "user-a", at: "2026-01-01T00:16:00.000Z", version: 1 }], version: 1, createdBy: "user-a", createdAt: "2026-01-01T00:16:00.000Z", updatedAt: "2026-01-01T00:16:00.000Z" }
  );
  snapshot.agent_coordination_runs.push(
    { id: "agent-run-a", organizationId: "org-a", title: "Coordinate Phase 2 agents", agentExecutionPlans: [{ agentName: "Multimedia Creation Agent", objective: "Prepare media drafts", humanApprovalGate: true }], dependenciesBetweenAgents: ["Layout Publishing Agent before Multimedia Creation Agent"], executionOrder: ["Layout Publishing Agent", "Multimedia Creation Agent"], costEstimates: { multimediaCreation: 0 }, auditTrail: [{ id: "agent-run-trail-a", action: "AGENT_COORDINATION_RUN_CREATED", actorId: "user-a", at: "2026-01-01T00:16:01.000Z", version: 1 }], humanApprovalRequired: true, executionMode: "PLANNING_ONLY", destructiveActionsExecuted: false, createdBy: "user-a", createdAt: "2026-01-01T00:16:01.000Z", updatedAt: "2026-01-01T00:16:01.000Z" }
  );
  snapshot.platform_engineering_audit_events.push(
    { id: "platform-audit-a", organizationId: "org-a", platformEngineeringPlanId: "platform-plan-a", action: "OPTIMIZATION_PLAN_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:16:02.000Z" },
    { id: "platform-audit-b", organizationId: "org-a", agentCoordinationRunId: "agent-run-a", action: "AGENT_COORDINATION_RUN_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:16:03.000Z" }
  );
  snapshot.commerce_editions.push(
    { id: "commerce-edition-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", publicCatalogItemId: "public-item-a", title: "Document A Paperback", language: "ro", editionType: "PAPERBACK", metadata: { isbn: "978-1-23456-789-0", editionNumber: "1", originalEditionReference: "French original", originalLanguage: "fr", firstPublicationYear: 1860 }, printProfile: { id: "commerce-print-profile-a", organizationId: "org-a", commerceEditionId: "commerce-edition-a", region: "EUROPEAN", trimSize: "A5", bleed: "3mm", margins: "20mm", coverSizes: ["front", "back"], spineWidth: "12mm", paperTypes: ["cream"], createdBy: "user-a", createdAt: "2026-01-01T00:16:10.000Z", updatedAt: "2026-01-01T00:16:10.000Z" }, pricing: { price: 19.9, currency: "EUR", stock: 100, availability: "AVAILABLE", royaltyPercentages: { author: 10, publisher: 20 }, distributionChannels: ["public-store"] }, printOnDemand: { provider: "metadata-only", region: "EU", status: "PLANNED", printProfileId: "commerce-print-profile-a" }, distributionChannelIds: ["commerce-channel-a"], availabilityStatus: "AVAILABLE", approvalStatus: "APPROVED", humanApprovalRequired: true, paymentProviderIntegration: "NOT_CONFIGURED", printProviderIntegration: "METADATA_ONLY", auditTrail: [{ id: "commerce-trail-a", action: "COMMERCE_EDITION_APPROVED", actorId: "user-a", at: "2026-01-01T00:16:15.000Z", version: 2 }], version: 2, approvedBy: "user-a", approvedAt: "2026-01-01T00:16:15.000Z", createdBy: "user-a", createdAt: "2026-01-01T00:16:10.000Z", updatedAt: "2026-01-01T00:16:15.000Z" }
  );
  snapshot.commerce_print_profiles.push(
    { id: "commerce-print-profile-a", organizationId: "org-a", commerceEditionId: "commerce-edition-a", region: "EUROPEAN", trimSize: "A5", bleed: "3mm", margins: "20mm", coverSizes: ["front", "back"], spineWidth: "12mm", paperTypes: ["cream"], createdBy: "user-a", createdAt: "2026-01-01T00:16:10.000Z", updatedAt: "2026-01-01T00:16:10.000Z" }
  );
  snapshot.commerce_distribution_channels.push(
    { id: "commerce-channel-a", organizationId: "org-a", commerceEditionId: "commerce-edition-a", channelName: "public-store", channelType: "DIRECT", availability: "AVAILABLE", price: 19.9, currency: "EUR", stock: 100, royaltyPercentages: { author: 10, publisher: 20 }, region: "EU", metadata: { printOnDemand: "metadata-only" }, createdBy: "user-a", createdAt: "2026-01-01T00:16:12.000Z", updatedAt: "2026-01-01T00:16:12.000Z" }
  );
  snapshot.commerce_audit_events.push(
    { id: "commerce-audit-a", organizationId: "org-a", commerceEditionId: "commerce-edition-a", commercePrintProfileId: "commerce-print-profile-a", action: "COMMERCE_EDITION_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:16:10.000Z" },
    { id: "commerce-audit-b", organizationId: "org-a", commerceEditionId: "commerce-edition-a", commerceDistributionChannelId: "commerce-channel-a", action: "COMMERCE_DISTRIBUTION_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:16:12.000Z" }
  );
  snapshot.public_catalog_items.push(
    { id: "public-item-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", layoutPublicationPlanId: "layout-a", multimediaProjectId: "media-project-a", mediaLocalizationProjectId: "media-localization-a", itemType: "BOOK", metadata: { title: "Document A", authors: ["Author A"], translators: [{ translatorId: "user-a", translatorName: "Translator A", originalAuthorAttributionPreserved: true }], language: "ro", edition: "Beta", keywords: ["spiritism"], originalSourceReferences: ["document-a"] }, readerAccess: { onlineReadingAvailable: true, downloadableFormats: ["PDF", "EPUB"], pdfRef: "export-a", epubRef: "export-a", audioChapterRefs: ["media-asset-a"], videoRefs: ["media-asset-a"], localizedMediaRefs: ["media-localization-asset-a"], fileHostingIntegration: "NOT_CONFIGURED" }, rights: { license: "internal-beta", sourceAttribution: "Author A", copyrightStatus: "review_required", usageRestrictions: ["closed-beta"] }, availabilityStatus: "PUBLIC", releaseApprovalStatus: "APPROVED", humanApprovalRequired: true, paymentIntegration: "NOT_CONFIGURED", cdnIntegration: "NOT_CONFIGURED", distributionRecordIds: ["public-distribution-a"], auditTrail: [{ id: "public-trail-a", action: "PUBLIC_RELEASE_APPROVED", actorId: "user-a", at: "2026-01-01T00:16:30.000Z", version: 2 }], version: 2, approvedBy: "user-a", approvedAt: "2026-01-01T00:16:30.000Z", createdBy: "user-a", createdAt: "2026-01-01T00:16:20.000Z", updatedAt: "2026-01-01T00:16:30.000Z" }
  );
  snapshot.public_distribution_records.push(
    { id: "public-distribution-a", organizationId: "org-a", publicCatalogItemId: "public-item-a", publicationChannels: ["public-reader"], availabilityStatus: "PUBLIC", releaseDate: "2026-02-03T00:00:00.000Z", editionStatus: "BETA", languageVariants: ["ro"], printOnDemandMetadata: { profile: "paperback" }, paymentIntegration: "NOT_CONFIGURED", fileHostingIntegration: "NOT_CONFIGURED", createdBy: "user-a", createdAt: "2026-01-01T00:16:25.000Z", updatedAt: "2026-01-01T00:16:25.000Z" }
  );
  snapshot.public_access_records.push(
    { id: "public-access-a", organizationId: "org-a", publicCatalogItemId: "public-item-a", accessType: "ONLINE_READING", format: "HTML", artifactRef: "export-a", fileHostingIntegration: "NOT_CONFIGURED", createdBy: "user-a", createdAt: "2026-01-01T00:16:21.000Z" }
  );
  snapshot.public_portal_audit_events.push(
    { id: "public-audit-a", organizationId: "org-a", publicCatalogItemId: "public-item-a", action: "PUBLIC_CATALOG_ITEM_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:16:20.000Z" },
    { id: "public-audit-b", organizationId: "org-a", publicCatalogItemId: "public-item-a", publicDistributionRecordId: "public-distribution-a", action: "PUBLIC_DISTRIBUTION_RECORD_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:16:25.000Z" }
  );
  snapshot.library_items.push(
    { id: "library-item-a", organizationId: "org-a", userId: "user-a", publicCatalogItemId: "public-item-a", commerceEditionId: "commerce-edition-a", itemType: "BOOK", title: "Document A", language: "ro", sourceReference: "public-item-a", favorite: true, savedAt: "2026-01-01T00:16:40.000Z", lastAccessedAt: "2026-01-01T00:16:45.000Z", createdAt: "2026-01-01T00:16:40.000Z", updatedAt: "2026-01-01T00:16:45.000Z", metadata: { privacy: "private_by_default" } }
  );
  snapshot.library_reading_progress.push(
    { id: "library-progress-a", organizationId: "org-a", userId: "user-a", libraryItemId: "library-item-a", progressPercent: 42, currentChapter: "chapter-1", currentSection: "section-2", position: "page-21", readingSessionId: "session-a", updatedAt: "2026-01-01T00:16:46.000Z" }
  );
  snapshot.library_bookmarks.push(
    { id: "library-bookmark-a", organizationId: "org-a", userId: "user-a", libraryItemId: "library-item-a", chapter: "chapter-1", section: "section-2", position: "page-21", label: "Important passage", createdAt: "2026-01-01T00:16:47.000Z" }
  );
  snapshot.library_highlights.push(
    { id: "library-highlight-a", organizationId: "org-a", userId: "user-a", libraryItemId: "library-item-a", text: "Spiritul progresează", color: "yellow", chapter: "chapter-1", section: "section-2", position: "page-21", note: "Review later", createdAt: "2026-01-01T00:16:48.000Z" }
  );
  snapshot.library_notes.push(
    { id: "library-note-a", organizationId: "org-a", userId: "user-a", libraryItemId: "library-item-a", content: "Personal reading note.", chapter: "chapter-1", section: "section-2", position: "page-22", createdAt: "2026-01-01T00:16:49.000Z", updatedAt: "2026-01-01T00:16:49.000Z" }
  );
  snapshot.library_access_events.push(
    { id: "library-access-a", organizationId: "org-a", userId: "user-a", libraryItemId: "library-item-a", eventType: "OPENED", readingSessionId: "session-a", occurredAt: "2026-01-01T00:16:50.000Z", metadata: { privateReadingHistory: true } }
  );
  snapshot.library_audit_events.push(
    { id: "library-audit-a", organizationId: "org-a", userId: "user-a", libraryItemId: "library-item-a", entityType: "library_item", entityId: "library-item-a", action: "LIBRARY_ITEM_ADDED", actorId: "user-a", createdAt: "2026-01-01T00:16:40.000Z" },
    { id: "library-audit-b", organizationId: "org-a", userId: "user-a", libraryItemId: "library-item-a", entityType: "reading_progress", entityId: "library-progress-a", action: "READING_PROGRESS_UPDATED", actorId: "user-a", createdAt: "2026-01-01T00:16:46.000Z" }
  );
  snapshot.author_manuscripts.push(
    { id: "author-manuscript-a", organizationId: "org-a", authorId: "user-a", projectId: "project-a", documentId: "document-a", title: "Author Studio Draft", subtitle: "Working manuscript", language: "ro", genre: "spiritism", manuscriptType: "BOOK", status: "SUBMITTED", synopsis: "A short manuscript synopsis.", outline: "Chapter 1 -> Chapter 2", stylePreferences: ["clear prose"], authorAttribution: { authorId: "user-a", retained: true }, aiSuggestionsAdvisoryOnly: true, publicExposure: false, humanEditorialApprovalRequired: true, createdAt: "2026-01-01T00:16:51.000Z", updatedAt: "2026-01-01T00:16:54.000Z", submittedAt: "2026-01-01T00:16:54.000Z" }
  );
  snapshot.author_manuscript_sections.push(
    { id: "author-section-a", organizationId: "org-a", manuscriptId: "author-manuscript-a", sectionType: "CHAPTER", title: "Chapter 1", orderIndex: 1, synopsis: "Opening chapter.", outline: "Scene 1", notes: "Author structural note.", createdAt: "2026-01-01T00:16:52.000Z", updatedAt: "2026-01-01T00:16:52.000Z" }
  );
  snapshot.author_drafts.push(
    { id: "author-draft-a", organizationId: "org-a", manuscriptId: "author-manuscript-a", sectionId: "author-section-a", content: "Spiritul progresează prin experiență.", version: 1, autosave: true, autosaveMetadata: { savedAt: "2026-01-01T00:16:53.000Z", source: "AUTOSAVE" }, wordCount: 4, characterCount: 37, aiSuggestionApplied: false, createdBy: "user-a", createdAt: "2026-01-01T00:16:53.000Z" }
  );
  snapshot.author_notes.push(
    { id: "author-note-a", organizationId: "org-a", manuscriptId: "author-manuscript-a", authorId: "user-a", noteType: "PRIVATE_AUTHOR_NOTE", title: "Research", content: "Private author research note.", privateToAuthor: true, createdAt: "2026-01-01T00:16:53.500Z", updatedAt: "2026-01-01T00:16:53.500Z" }
  );
  snapshot.author_submission_events.push(
    { id: "author-submission-a", organizationId: "org-a", manuscriptId: "author-manuscript-a", authorId: "user-a", projectId: "project-a", documentId: "document-a", status: "DOCUMENT_LINKED", workflowStatus: "PENDING_EDITORIAL_WORKFLOW", createOrLinkDocument: "LINK_EXISTING_DOCUMENT", humanEditorialApprovalRequired: true, aiInitiated: false, submittedAt: "2026-01-01T00:16:54.000Z" }
  );
  snapshot.author_studio_audit_events.push(
    { id: "author-audit-a", organizationId: "org-a", manuscriptId: "author-manuscript-a", action: "AUTHOR_MANUSCRIPT_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:16:51.000Z" },
    { id: "author-audit-b", organizationId: "org-a", manuscriptId: "author-manuscript-a", sectionId: "author-section-a", draftId: "author-draft-a", action: "AUTHOR_DRAFT_SAVED", actorId: "user-a", createdAt: "2026-01-01T00:16:53.000Z" },
    { id: "author-audit-c", organizationId: "org-a", manuscriptId: "author-manuscript-a", noteId: "author-note-a", action: "AUTHOR_NOTE_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:16:53.500Z" },
    { id: "author-audit-d", organizationId: "org-a", manuscriptId: "author-manuscript-a", submissionEventId: "author-submission-a", action: "AUTHOR_MANUSCRIPT_SUBMITTED", actorId: "user-a", createdAt: "2026-01-01T00:16:54.000Z" }
  );
  snapshot.research_sources.push(
    { id: "research-source-a", organizationId: "org-a", title: "Le Livre des Esprits", subtitle: "Edition de référence", author: "Allan Kardec", originalAuthor: "Allan Kardec", language: "fr", originalLanguage: "fr", firstPublicationYear: 1860, sourceType: "BOOK", publisher: "Didier", isbn: "optional-isbn", url: "https://example.test/kardec", citation: "Kardec, Allan. Le Livre des Esprits.", tags: ["spiritism", "primary"], notes: "Primary research source.", visibility: "ORGANIZATION", ecosystemReferences: [{ module: "AUTHOR_STUDIO", entityId: "author-manuscript-a", label: "project-a" }], aiPolicy: { summarizeSources: true, extractConcepts: true, suggestRelations: true, buildKnowledgeGraphs: true, suggestBibliography: true, mayModifyOriginalSources: false, mayDeleteValidatedResearch: false, mayApproveEditorialContent: false, mayAlterCitationsAutomatically: false }, humanFinalAuthority: true, createdBy: "user-a", createdAt: "2026-01-01T00:16:54.100Z", updatedAt: "2026-01-01T00:16:54.100Z" }
  );
  snapshot.research_entities.push(
    { id: "research-entity-a", organizationId: "org-a", entityType: "SPIRITUAL_CONCEPT", name: "Spirit", description: "Core spiritist concept.", language: "en", aliases: ["Esprit", "Spiritul"], tags: ["spiritism"], sourceIds: ["research-source-a"], ecosystemReferences: [{ module: "TERMINOLOGY", entityId: "term-a" }], aiSuggested: false, humanFinalAuthority: true, createdBy: "user-a", createdAt: "2026-01-01T00:16:54.200Z", updatedAt: "2026-01-01T00:16:54.200Z" },
    { id: "research-entity-b", organizationId: "org-a", entityType: "CONCEPT", name: "Moral progress", description: "Progress through experience.", language: "en", aliases: ["Progres moral"], tags: ["spiritism"], sourceIds: ["research-source-a"], ecosystemReferences: [{ module: "SEMANTIC_FIDELITY", entityId: "semantic-report-a" }], aiSuggested: true, humanFinalAuthority: true, createdBy: "user-a", createdAt: "2026-01-01T00:16:54.250Z", updatedAt: "2026-01-01T00:16:54.250Z" }
  );
  snapshot.research_notes.push(
    { id: "research-note-a", organizationId: "org-a", sourceId: "research-source-a", projectId: "project-a", manuscriptId: "author-manuscript-a", entityId: "research-entity-a", noteType: "PRIVATE_NOTE", title: "Private reading note", content: "Private notes are never public.", visibility: "PRIVATE", privateToCreator: true, ecosystemReferences: [{ module: "AUTHOR_STUDIO", entityId: "author-manuscript-a" }], createdBy: "user-a", createdAt: "2026-01-01T00:16:54.300Z", updatedAt: "2026-01-01T00:16:54.300Z" }
  );
  snapshot.research_relationships.push(
    { id: "research-relationship-a", organizationId: "org-a", fromEntityId: "research-entity-a", toEntityId: "research-entity-b", relationshipType: "RELATED_ENTITY", description: "Spirit is related to moral progress.", sourceIds: ["research-source-a"], aiSuggested: true, humanFinalAuthority: true, createdBy: "user-a", createdAt: "2026-01-01T00:16:54.400Z" }
  );
  snapshot.research_collections.push(
    { id: "research-collection-a", organizationId: "org-a", name: "Spiritism sources", description: "Shared editorial collection.", visibility: "TEAM", projectId: "project-a", thematicTags: ["spiritism"], sharedEditorialCollection: true, createdBy: "user-a", createdAt: "2026-01-01T00:16:54.500Z", updatedAt: "2026-01-01T00:16:54.500Z" }
  );
  snapshot.research_collection_items.push(
    { id: "research-collection-item-a", organizationId: "org-a", collectionId: "research-collection-a", itemType: "SOURCE", sourceId: "research-source-a", addedBy: "user-a", createdAt: "2026-01-01T00:16:54.600Z" }
  );
  snapshot.research_audit_events.push(
    { id: "research-audit-a", organizationId: "org-a", sourceId: "research-source-a", action: "RESEARCH_SOURCE_CREATED", actorId: "user-a", humanFinalAuthority: true, aiSuggested: false, createdAt: "2026-01-01T00:16:54.100Z" },
    { id: "research-audit-b", organizationId: "org-a", entityId: "research-entity-b", action: "RESEARCH_AI_SUGGESTION_RECORDED", actorId: "user-a", humanFinalAuthority: true, aiSuggested: true, createdAt: "2026-01-01T00:16:54.250Z" },
    { id: "research-audit-c", organizationId: "org-a", relationshipId: "research-relationship-a", action: "RESEARCH_RELATIONSHIP_CREATED", actorId: "user-a", humanFinalAuthority: true, aiSuggested: true, createdAt: "2026-01-01T00:16:54.400Z" },
    { id: "research-audit-d", organizationId: "org-a", collectionId: "research-collection-a", collectionItemId: "research-collection-item-a", action: "RESEARCH_COLLECTION_ITEM_ADDED", actorId: "user-a", humanFinalAuthority: true, aiSuggested: false, createdAt: "2026-01-01T00:16:54.600Z" }
  );
  snapshot.collaboration_threads.push(
    { id: "collab-thread-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", segmentId: "segment-a", targetType: "SEGMENT", title: "Review segment terminology", visibility: "PRIVATE_EDITORIAL", status: "OPEN", mentionsPlaceholder: ["@reviewer"], createdBy: "user-a", createdAt: "2026-01-01T00:16:55.000Z", updatedAt: "2026-01-01T00:16:55.000Z" }
  );
  snapshot.collaboration_comments.push(
    { id: "collab-comment-a", organizationId: "org-a", threadId: "collab-thread-a", authorUserId: "user-a", body: "Reviewer note for internal editorial review.", commentType: "REVIEWER_NOTE", privateEditorial: true, mentionsPlaceholder: ["@editor"], resolved: true, resolvedBy: "user-a", resolvedAt: "2026-01-01T00:16:57.000Z", createdAt: "2026-01-01T00:16:56.000Z", updatedAt: "2026-01-01T00:16:57.000Z" }
  );
  snapshot.community_reviews.push(
    { id: "community-review-a", organizationId: "org-a", publicCatalogItemId: "public-item-a", userId: "user-a", rating: 5, title: "Excellent edition", body: "A clear and careful edition.", moderationStatus: "APPROVED", humanModerationRequired: true, aiModerationSuggestion: "No issue detected.", createdAt: "2026-01-01T00:16:58.000Z", updatedAt: "2026-01-01T00:17:00.000Z", approvedBy: "user-a", approvedAt: "2026-01-01T00:17:00.000Z" }
  );
  snapshot.community_comments.push(
    { id: "community-comment-a", organizationId: "org-a", publicCatalogItemId: "public-item-a", userId: "user-a", body: "Reader discussion comment.", threadTitle: "Public discussion", moderationStatus: "APPROVED", humanModerationRequired: true, aiModerationSuggestion: "No issue detected.", createdAt: "2026-01-01T00:17:01.000Z", updatedAt: "2026-01-01T00:17:03.000Z", approvedBy: "user-a", approvedAt: "2026-01-01T00:17:03.000Z" }
  );
  snapshot.community_flags.push(
    { id: "community-flag-a", organizationId: "org-a", contentType: "REVIEW", communityReviewId: "community-review-a", reason: "Verify source attribution.", reportedByUserId: "user-a", status: "OPEN", createdAt: "2026-01-01T00:17:04.000Z", updatedAt: "2026-01-01T00:17:04.000Z" }
  );
  snapshot.community_moderation_events.push(
    { id: "community-moderation-a", organizationId: "org-a", contentType: "REVIEW", communityReviewId: "community-review-a", action: "CONTENT_APPROVED", actorId: "user-a", aiSuggested: false, humanFinalAuthority: true, createdAt: "2026-01-01T00:17:00.000Z" },
    { id: "community-moderation-b", organizationId: "org-a", contentType: "REVIEW", communityReviewId: "community-review-a", communityFlagId: "community-flag-a", action: "CONTENT_FLAGGED", actorId: "user-a", aiSuggested: false, humanFinalAuthority: true, createdAt: "2026-01-01T00:17:04.000Z" }
  );
  snapshot.collaboration_audit_events.push(
    { id: "collab-audit-a", organizationId: "org-a", threadId: "collab-thread-a", action: "COLLABORATION_THREAD_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:16:55.000Z" },
    { id: "collab-audit-b", organizationId: "org-a", threadId: "collab-thread-a", collaborationCommentId: "collab-comment-a", action: "COLLABORATION_COMMENT_RESOLVED", actorId: "user-a", createdAt: "2026-01-01T00:16:57.000Z" },
    { id: "collab-audit-c", organizationId: "org-a", communityReviewId: "community-review-a", action: "COMMUNITY_CONTENT_APPROVED", actorId: "user-a", createdAt: "2026-01-01T00:17:00.000Z" },
    { id: "collab-audit-d", organizationId: "org-a", communityReviewId: "community-review-a", communityFlagId: "community-flag-a", action: "COMMUNITY_CONTENT_FLAGGED", actorId: "user-a", createdAt: "2026-01-01T00:17:04.000Z" }
  );
  snapshot.scheduling_tasks.push(
    { id: "schedule-task-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", title: "Final review deadline", taskType: "REVIEW_DEADLINE", dueAt: "2026-02-01T10:00:00.000Z", priority: "HIGH", dependencies: ["workflow-a"], conflictDetectionStatus: "PLACEHOLDER_ONLY", conflicts: [], approvalStatus: "PENDING_HUMAN_APPROVAL", humanApprovalRequired: true, externalCalendarIntegration: "NOT_CONFIGURED", auditTrail: [{ id: "schedule-task-trail-a", action: "SCHEDULING_TASK_CREATED", actorId: "user-a", at: "2026-01-01T00:17:00.000Z", version: 1 }], version: 1, createdBy: "user-a", createdAt: "2026-01-01T00:17:00.000Z", updatedAt: "2026-01-01T00:17:00.000Z" }
  );
  snapshot.scheduling_events.push(
    { id: "schedule-event-a", organizationId: "org-a", projectId: "project-a", title: "Publication meeting", eventType: "MEETING", startsAt: "2026-02-02T12:00:00.000Z", participants: ["user-a"], conflictDetectionStatus: "PLACEHOLDER_ONLY", conflicts: [], approvalStatus: "PENDING_HUMAN_APPROVAL", humanApprovalRequired: true, externalCalendarIntegration: "NOT_CONFIGURED", auditTrail: [{ id: "schedule-event-trail-a", action: "SCHEDULING_EVENT_CREATED", actorId: "user-a", at: "2026-01-01T00:17:01.000Z", version: 1 }], version: 1, createdBy: "user-a", createdAt: "2026-01-01T00:17:01.000Z", updatedAt: "2026-01-01T00:17:01.000Z" }
  );
  snapshot.scheduling_agent_runs.push(
    { id: "schedule-agent-run-a", organizationId: "org-a", title: "Run editorial decision agent", agentName: "AI Editorial Decision Agent", scheduledFor: "2026-02-01T09:00:00.000Z", dependenciesBetweenAgents: ["Lexicographic Intelligence Agent"], executionOrder: ["Lexicographic Intelligence Agent", "AI Editorial Decision Agent"], workloadBalancingNotes: ["Avoid overlap with export validation"], taskPriority: "MEDIUM", conflictDetectionStatus: "PLACEHOLDER_ONLY", conflicts: [], approvalStatus: "PENDING_HUMAN_APPROVAL", humanApprovalRequired: true, executionMode: "PLANNING_ONLY", externalCalendarIntegration: "NOT_CONFIGURED", auditTrail: [{ id: "schedule-agent-trail-a", action: "SCHEDULING_AGENT_RUN_CREATED", actorId: "user-a", at: "2026-01-01T00:17:02.000Z", version: 1 }], version: 1, createdBy: "user-a", createdAt: "2026-01-01T00:17:02.000Z", updatedAt: "2026-01-01T00:17:02.000Z" }
  );
  snapshot.scheduling_reminders.push(
    { id: "schedule-reminder-a", organizationId: "org-a", schedulingTaskId: "schedule-task-a", reminderType: "TASK_REMINDER", message: "Review deadline tomorrow.", remindAt: "2026-01-31T10:00:00.000Z", overdueAlert: false, delivered: false, externalCalendarIntegration: "NOT_CONFIGURED", auditTrail: [{ id: "schedule-reminder-trail-a", action: "SCHEDULING_REMINDER_CREATED", actorId: "user-a", at: "2026-01-01T00:17:03.000Z", version: 1 }], createdBy: "user-a", createdAt: "2026-01-01T00:17:03.000Z", updatedAt: "2026-01-01T00:17:03.000Z" }
  );
  snapshot.scheduling_audit_events.push(
    { id: "schedule-audit-a", organizationId: "org-a", schedulingTaskId: "schedule-task-a", action: "SCHEDULING_TASK_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:17:04.000Z" },
    { id: "schedule-audit-b", organizationId: "org-a", schedulingEventId: "schedule-event-a", action: "SCHEDULING_EVENT_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:17:05.000Z" },
    { id: "schedule-audit-c", organizationId: "org-a", schedulingReminderId: "schedule-reminder-a", action: "SCHEDULING_REMINDER_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:17:06.000Z" },
    { id: "schedule-audit-d", organizationId: "org-a", schedulingAgentRunId: "schedule-agent-run-a", action: "SCHEDULING_AGENT_RUN_CREATED", actorId: "user-a", createdAt: "2026-01-01T00:17:07.000Z" }
  );

  return snapshot;
}
