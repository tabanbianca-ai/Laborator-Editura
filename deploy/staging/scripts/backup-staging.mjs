#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { loadStagingEnv } from "./staging-env.mjs";

loadStagingEnv();

const dbPath = process.env.LABORATOR_RUNTIME_DB_PATH;
const backupDir = process.env.STAGING_BACKUP_DIR ?? "backups/staging";
const mode = process.env.STAGING_BACKUP_MODE ?? "local";

if (!dbPath) {
  console.error("LABORATOR_RUNTIME_DB_PATH is required.");
  process.exit(1);
}

const timestamp = new Date().toISOString().replaceAll(":", "-").replace(/\.\d{3}Z$/, "Z");
const outPath = process.env.STAGING_BACKUP_FILE ?? join(backupDir, `runtime-db-${timestamp}.json`);

const result =
  mode === "docker"
    ? runDockerBackup(dbPath, outPath)
    : runLocalBackup(dbPath, outPath, backupDir);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exitCode = result.status ?? 1;

function runLocalBackup(runtimeDbPath, outputPath, outputDir) {
  mkdirSync(outputDir, { recursive: true });

  return spawnSync(process.execPath, [
    "packages/db/scripts/backup-runtime-db.mjs",
    "--db",
    runtimeDbPath,
    "--out",
    outputPath
  ], {
    stdio: "inherit"
  });
}

function runDockerBackup(runtimeDbPath, outputPath) {
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
    "packages/db/scripts/backup-runtime-db.mjs",
    "--db",
    runtimeDbPath,
    "--out",
    outputPath
  ], {
    stdio: "inherit"
  });
}
