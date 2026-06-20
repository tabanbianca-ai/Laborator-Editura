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
    { id: "document-a", organizationId: "org-a", projectId: "project-a", title: "Document A", sourceLanguage: "es", targetLanguage: "ro", documentType: "text", status: "DRAFT", createdBy: "user-a", createdAt: "2026-01-01T00:02:00.000Z", updatedAt: "2026-01-01T00:02:00.000Z" },
    { id: "document-b", organizationId: "org-b", projectId: "project-b", title: "Document B", sourceLanguage: "en", targetLanguage: "ro", documentType: "text", status: "DRAFT", createdBy: "user-b", createdAt: "2026-01-01T00:02:01.000Z", updatedAt: "2026-01-01T00:02:01.000Z" }
  );
  snapshot.document_segments.push(
    { id: "segment-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", sourceText: "El espiritu.", sourceLanguage: "es", targetLanguage: "ro", order: 1, status: "TRANSLATED", createdBy: "user-a", createdAt: "2026-01-01T00:03:00.000Z", updatedAt: "2026-01-01T00:03:00.000Z" },
    { id: "segment-b", organizationId: "org-b", projectId: "project-b", documentId: "document-b", sourceText: "The spirit.", sourceLanguage: "en", targetLanguage: "ro", order: 1, status: "NEW", createdBy: "user-b", createdAt: "2026-01-01T00:03:01.000Z", updatedAt: "2026-01-01T00:03:01.000Z" }
  );
  snapshot.segment_translations.push(
    { id: "translation-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", segmentId: "segment-a", sourceText: "El espiritu.", targetText: "Spiritul.", sourceLanguage: "es", targetLanguage: "ro", status: "VALIDATED", createdBy: "user-a", createdAt: "2026-01-01T00:04:00.000Z", updatedAt: "2026-01-01T00:04:00.000Z" }
  );
  snapshot.export_artifacts.push(
    { id: "export-a", organizationId: "org-a", projectId: "project-a", documentId: "document-a", format: "JSON_MASTER", artifact: { formatVersion: "1.0" }, createdBy: "user-a", createdAt: "2026-01-01T00:05:00.000Z" }
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
