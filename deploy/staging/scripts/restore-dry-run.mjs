#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { loadStagingEnv } from "./staging-env.mjs";

loadStagingEnv();

const backupPath = process.env.STAGING_BACKUP_FILE;
const restoreDbPath = process.env.STAGING_RESTORE_DB_PATH;
const mode = process.env.STAGING_BACKUP_MODE ?? "local";

if (!backupPath) {
  console.error("STAGING_BACKUP_FILE is required.");
  process.exit(1);
}

if (!restoreDbPath) {
  console.error("STAGING_RESTORE_DB_PATH is required.");
  process.exit(1);
}

const result =
  mode === "docker"
    ? runDockerRestore(backupPath, restoreDbPath)
    : runLocalRestore(backupPath, restoreDbPath);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exitCode = result.status ?? 1;

function runLocalRestore(inputBackupPath, targetDbPath) {
  mkdirSync(dirname(targetDbPath), { recursive: true });

  return spawnSync(process.execPath, [
    "packages/db/scripts/restore-runtime-db.mjs",
    "--db",
    targetDbPath,
    "--in",
    inputBackupPath
  ], {
    stdio: "inherit"
  });
}

function runDockerRestore(inputBackupPath, targetDbPath) {
  const envFile = process.env.STAGING_ENV_FILE ?? "deploy/staging/.env.staging";
  const composeFile = process.env.STAGING_COMPOSE_FILE ?? "deploy/staging/docker-compose.staging.yml";

  return spawnSync("docker", [
    "compose",
    "--env-file",
    envFile,
    "-f",
    composeFile,
    "exec",
    "-T",
    "api",
    "node",
    "packages/db/scripts/restore-runtime-db.mjs",
    "--db",
    targetDbPath,
    "--in",
    inputBackupPath
  ], {
    stdio: "inherit"
  });
}
