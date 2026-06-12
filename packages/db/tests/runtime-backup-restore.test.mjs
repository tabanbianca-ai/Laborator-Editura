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
    "translation_memory_entries",
    "terminology_terms",
    "qa_reports",
    "qa_issues",
    "semantic_fidelity_reports",
    "semantic_fidelity_issues",
    "workflow_states"
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
    { id: "user-b", email: "b@example.com", displayName: "User B", createdAt: "2026-01-01T00:00:03.000Z" }
  );
  snapshot.user_roles.push(
    { id: "role-a", organizationId: "org-a", userId: "user-a", role: "TRANSLATOR", createdAt: "2026-01-01T00:00:04.000Z" },
    { id: "role-b", organizationId: "org-b", userId: "user-b", role: "REVIEWER", createdAt: "2026-01-01T00:00:05.000Z" }
  );
  snapshot.auth_sessions.push(
    { id: "session-a", organizationId: "org-a", userId: "user-a", token: "token-a", roles: ["TRANSLATOR"], createdAt: "2026-01-01T00:00:06.000Z" }
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

  return snapshot;
}
