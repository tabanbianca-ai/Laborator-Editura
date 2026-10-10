#!/usr/bin/env node
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";

import {
  normalizeSnapshot,
  readRuntimeDatabase,
  restoreRuntimeDatabase,
  validateBackup
} from "../../../packages/db/scripts/runtime-backup-lib.mjs";
import { loadStagingEnv } from "./staging-env.mjs";

loadStagingEnv();

const configuredBackupPath = process.env.STAGING_BACKUP_FILE;
const configuredRestoreDbPath = process.env.STAGING_RESTORE_DB_PATH;
const activeDbPath = process.env.LABORATOR_RUNTIME_DB_PATH;
const mode =
  process.env.STAGING_RESTORE_MODE ?? process.env.STAGING_BACKUP_MODE ?? "local";
const keepOutput = process.env.STAGING_KEEP_RESTORE_OUTPUT === "true";

try {
  if (!configuredBackupPath) {
    throw new Error("STAGING_BACKUP_FILE is required.");
  }

  if (mode !== "local" && mode !== "docker") {
    throw new Error("STAGING_RESTORE_MODE must be local or docker.");
  }

  assertIsolatedTarget(activeDbPath, configuredRestoreDbPath);

  const restoreRoot = createRestoreRoot(configuredRestoreDbPath);
  const restoreDbPath = join(
    restoreRoot,
    basename(configuredRestoreDbPath ?? "runtime-db.json")
  );
  const activeSnapshot = snapshotFile(activeDbPath);

  try {
    const backupPath =
      mode === "docker"
        ? copyBackupFromContainer(configuredBackupPath, restoreRoot)
        : resolve(configuredBackupPath);

    const backup = readAndValidateBackup(backupPath);
    restoreRuntimeDatabase({ dbPath: restoreDbPath, backupPath });

    const restored = readRuntimeDatabase(restoreDbPath);
    const expected = normalizeSnapshot(backup.data);

    if (!isDeepStrictEqual(restored, expected)) {
      throw new Error(
        "Restored runtime database does not match the validated backup payload."
      );
    }

    assertFileUnchanged(activeDbPath, activeSnapshot);

    console.log(
      JSON.stringify(
        {
          status: "ok",
          action: "isolated-restore-dry-run",
          mode,
          backupPath: configuredBackupPath,
          restoreDbPath,
          outputRetained: keepOutput,
          schemaVersion: backup.metadata.schemaVersion,
          tables: backup.metadata.tables.length,
          workflow: {
            states: restored.workflow_states.length,
            transitions: restored.workflow_transitions.length,
            auditEvents: restored.workflow_audit_events.length,
            persistenceVerified: true
          },
          recoveryConsistency: "verified",
          activeRuntimeDatabase: activeSnapshot?.exists ? "unchanged" : "not-present"
        },
        null,
        2
      )
    );
  } finally {
    if (!keepOutput) {
      rmSync(restoreRoot, { recursive: true, force: true });
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function createRestoreRoot(requestedPath) {
  const parent = requestedPath ? dirname(resolve(requestedPath)) : tmpdir();
  mkdirSync(parent, { recursive: true });
  return mkdtempSync(join(parent, "laborator-isolated-restore-"));
}

function assertIsolatedTarget(runtimeDbPath, requestedPath) {
  if (!runtimeDbPath) {
    return;
  }

  const active = canonicalPath(runtimeDbPath);
  const activeStorageDirectory = dirname(active);
  const requested = requestedPath ? canonicalPath(requestedPath) : undefined;
  const restoreParent = requested ? dirname(requested) : canonicalPath(tmpdir());

  if (
    requested === active ||
    restoreParent === activeStorageDirectory ||
    isPathWithin(restoreParent, activeStorageDirectory)
  ) {
    throw new Error(
      "Restore dry-run target must be outside the active runtime database storage directory."
    );
  }
}

function canonicalPath(path) {
  const absolute = resolve(path);

  if (existsSync(absolute)) {
    return realpathSync(absolute);
  }

  const missingSegments = [];
  let existingAncestor = absolute;

  while (!existsSync(existingAncestor)) {
    const parent = dirname(existingAncestor);

    if (parent === existingAncestor) {
      return absolute;
    }

    missingSegments.unshift(basename(existingAncestor));
    existingAncestor = parent;
  }

  return join(realpathSync(existingAncestor), ...missingSegments);
}

function isPathWithin(candidate, parent) {
  const pathFromParent = relative(parent, candidate);
  return (
    pathFromParent !== "" &&
    !pathFromParent.startsWith("..") &&
    !isAbsolute(pathFromParent)
  );
}

function snapshotFile(path) {
  if (!path) {
    return undefined;
  }

  const absolute = resolve(path);

  if (!existsSync(absolute)) {
    return { path: absolute, exists: false };
  }

  return {
    path: canonicalPath(absolute),
    exists: true,
    sha256: sha256(absolute)
  };
}

function assertFileUnchanged(path, before) {
  if (!before || !path) {
    return;
  }

  const absolute = resolve(path);

  if (before.exists !== existsSync(absolute)) {
    throw new Error("Active runtime database existence changed during restore dry-run.");
  }

  if (
    before.exists &&
    (canonicalPath(absolute) !== before.path || sha256(absolute) !== before.sha256)
  ) {
    throw new Error("Active runtime database changed during restore dry-run.");
  }
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function readAndValidateBackup(path) {
  let backup;

  try {
    backup = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(
      `Unable to read runtime database backup: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const validation = validateBackup(backup);

  if (!validation.valid) {
    throw new Error(`Invalid runtime database backup: ${validation.issues.join("; ")}`);
  }

  return backup;
}

function copyBackupFromContainer(containerPath, restoreRoot) {
  const envFile = process.env.STAGING_ENV_FILE ?? "deploy/staging/.env.staging";
  const composeFile =
    process.env.STAGING_COMPOSE_FILE ?? "deploy/staging/docker-compose.staging.yml";
  const localBackupPath = join(restoreRoot, "runtime-db-backup.json");
  const result = spawnSync(
    "docker",
    [
      "compose",
      "--env-file",
      envFile,
      "-f",
      composeFile,
      "cp",
      `api:${containerPath}`,
      localBackupPath
    ],
    { encoding: "utf8" }
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `Unable to copy backup from the API container: ${result.stderr || result.stdout || "unknown error"}`
    );
  }

  return localBackupPath;
}
