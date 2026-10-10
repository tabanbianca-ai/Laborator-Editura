import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  TABLE_NAMES,
  createBackup
} from "../../../packages/db/scripts/runtime-backup-lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const backupScript = join(
  repositoryRoot,
  "deploy",
  "staging",
  "scripts",
  "backup-staging.mjs"
);
const restoreScript = join(
  repositoryRoot,
  "deploy",
  "staging",
  "scripts",
  "restore-dry-run.mjs"
);

test("staging backup output restores through the isolated dry-run contract", () => {
  const fixture = createFixture({ writeBackup: false });

  try {
    const backup = spawnSync(process.execPath, [backupScript], {
      cwd: repositoryRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        STAGING_ENV_FILE: join(fixture.root, "missing.env"),
        STAGING_BACKUP_MODE: "local",
        STAGING_BACKUP_FILE: fixture.backupPath,
        STAGING_BACKUP_DIR: dirname(fixture.backupPath),
        LABORATOR_RUNTIME_DB_PATH: fixture.activeDbPath
      }
    });

    assert.equal(backup.status, 0, backup.stderr || backup.stdout);

    const restore = runRestore(fixture);
    assert.equal(restore.status, 0, restore.stderr || restore.stdout);
    assert.equal(JSON.parse(restore.stdout).recoveryConsistency, "verified");
  } finally {
    fixture.cleanup();
  }
});

test("staging restore dry-run restores and verifies workflow data in isolation", () => {
  const fixture = createFixture();

  try {
    const before = readFileSync(fixture.activeDbPath);
    const result = runRestore(fixture, { STAGING_KEEP_RESTORE_OUTPUT: "true" });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const report = JSON.parse(result.stdout);

    assert.equal(report.status, "ok");
    assert.equal(report.action, "isolated-restore-dry-run");
    assert.equal(report.recoveryConsistency, "verified");
    assert.equal(report.activeRuntimeDatabase, "unchanged");
    assert.deepEqual(report.workflow, {
      states: 1,
      transitions: 1,
      auditEvents: 1,
      persistenceVerified: true
    });
    assert.notEqual(report.restoreDbPath, fixture.activeDbPath);
    assert.equal(existsSync(report.restoreDbPath), true);
    assert.deepEqual(readFileSync(fixture.activeDbPath), before);

    const restored = JSON.parse(readFileSync(report.restoreDbPath, "utf8"));
    assert.deepEqual(restored.workflow_states, fixture.snapshot.workflow_states);
    assert.deepEqual(
      restored.workflow_transitions,
      fixture.snapshot.workflow_transitions
    );
    assert.deepEqual(
      restored.workflow_audit_events,
      fixture.snapshot.workflow_audit_events
    );
  } finally {
    fixture.cleanup();
  }
});

test("staging restore dry-run rejects the active runtime database as its configured target", () => {
  const fixture = createFixture();

  try {
    const before = readFileSync(fixture.activeDbPath);
    const result = runRestore(fixture, { STAGING_RESTORE_DB_PATH: fixture.activeDbPath });

    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /must be outside the active runtime database storage directory/
    );
    assert.deepEqual(readFileSync(fixture.activeDbPath), before);
  } finally {
    fixture.cleanup();
  }
});

test("staging restore dry-run rejects every target inside active runtime storage before writing", () => {
  const fixture = createFixture();

  try {
    const activeDirectory = dirname(fixture.activeDbPath);
    const beforeEntries = readdirSync(activeDirectory);
    const result = runRestore(fixture, {
      STAGING_RESTORE_DB_PATH: join(activeDirectory, "isolated", "runtime-db.json")
    });

    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /must be outside the active runtime database storage directory/
    );
    assert.deepEqual(readdirSync(activeDirectory), beforeEntries);
  } finally {
    fixture.cleanup();
  }
});

test("staging restore dry-run rejects an invalid backup without changing active data", () => {
  const fixture = createFixture();

  try {
    const before = readFileSync(fixture.activeDbPath);
    const invalid = createBackup(fixture.snapshot);
    invalid.metadata.schemaVersion = "unsupported";
    writeJson(fixture.backupPath, invalid);

    const result = runRestore(fixture);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Invalid runtime database backup/);
    assert.deepEqual(readFileSync(fixture.activeDbPath), before);
  } finally {
    fixture.cleanup();
  }
});

function runRestore(fixture, overrides = {}) {
  return spawnSync(process.execPath, [restoreScript], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      STAGING_ENV_FILE: join(fixture.root, "missing.env"),
      STAGING_BACKUP_MODE: "local",
      STAGING_BACKUP_FILE: fixture.backupPath,
      STAGING_RESTORE_DB_PATH: fixture.restoreDbPath,
      LABORATOR_RUNTIME_DB_PATH: fixture.activeDbPath,
      ...overrides
    }
  });
}

function createFixture({ writeBackup = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "laborator-staging-restore-test-"));
  const activeDbPath = join(root, "active", "runtime-db.json");
  const backupPath = join(root, "backups", "runtime-db-backup.json");
  const restoreDbPath = join(root, "restore", "runtime-db.json");
  const snapshot = sampleSnapshot();

  writeJson(activeDbPath, snapshot);
  if (writeBackup) {
    writeJson(backupPath, createBackup(snapshot));
  }

  return {
    root,
    activeDbPath,
    backupPath,
    restoreDbPath,
    snapshot,
    cleanup() {
      rmSync(root, { recursive: true, force: true });
    }
  };
}

function sampleSnapshot() {
  const snapshot = Object.fromEntries(TABLE_NAMES.map((tableName) => [tableName, []]));
  const organizationId = "org-restore-test";
  const projectId = "project-restore-test";
  const documentId = "document-restore-test";

  snapshot.organizations.push({ id: organizationId, name: "Restore Test Organization" });
  snapshot.projects.push({
    id: projectId,
    organizationId,
    title: "Restore Test Project"
  });
  snapshot.documents.push({
    id: documentId,
    organizationId,
    projectId,
    title: "Restore Test Document"
  });
  snapshot.workflow_states.push({
    id: "workflow-state-restore-test",
    organizationId,
    projectId,
    documentId,
    status: "IN_REVIEW"
  });
  snapshot.workflow_transitions.push({
    id: "workflow-transition-restore-test",
    organizationId,
    projectId,
    documentId,
    fromStatus: "DRAFT",
    toStatus: "IN_REVIEW"
  });
  snapshot.workflow_audit_events.push({
    id: "workflow-audit-restore-test",
    organizationId,
    projectId,
    documentId,
    action: "WORKFLOW_TRANSITIONED"
  });

  return snapshot;
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
