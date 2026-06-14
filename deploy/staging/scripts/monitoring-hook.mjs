#!/usr/bin/env node
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { loadStagingEnv, stripTrailingSlash } from "./staging-env.mjs";

loadStagingEnv();

const apiBase = stripTrailingSlash(
  process.env.API_BASE ?? process.env.API_BASE_URL ?? "http://localhost:3001"
);
const webOrigin = stripTrailingSlash(
  process.env.STAGING_WEB_ORIGIN ?? process.env.WEB_ORIGIN ?? "http://localhost:3000"
);
const runtimeDbPath = process.env.LABORATOR_RUNTIME_DB_PATH;
const backupDir = process.env.STAGING_BACKUP_DIR;

const checks = [
  await probe("api", `${apiBase}/health`),
  await probe("web", webOrigin),
  fileCheck("runtime-db", runtimeDbPath),
  backupCheck("backup-dir", backupDir)
];

const failed = checks.filter((check) => !check.ok);
const degraded = checks.filter((check) => check.severity === "warning" && !check.ok);
const status = failed.length === 0 ? "ok" : degraded.length === failed.length ? "degraded" : "failed";

console.log(JSON.stringify({
  checkedAt: new Date().toISOString(),
  status,
  checks
}, null, 2));

if (status === "failed") {
  process.exitCode = 1;
}

async function probe(name, url) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal
    });

    return {
      name,
      ok: response.ok,
      statusCode: response.status,
      latencyMs: Date.now() - startedAt
    };
  } catch (error) {
    return {
      name,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      latencyMs: Date.now() - startedAt
    };
  } finally {
    clearTimeout(timeout);
  }
}

function fileCheck(name, filePath) {
  if (!filePath) {
    return {
      name,
      ok: false,
      error: "LABORATOR_RUNTIME_DB_PATH is not set"
    };
  }

  if (!existsSync(filePath)) {
    return {
      name,
      ok: false,
      severity: "warning",
      error: "runtime database file does not exist yet"
    };
  }

  const stats = statSync(filePath);

  return {
    name,
    ok: stats.isFile(),
    bytes: stats.size,
    updatedAt: stats.mtime.toISOString()
  };
}

function backupCheck(name, dirPath) {
  if (!dirPath) {
    return {
      name,
      ok: false,
      error: "STAGING_BACKUP_DIR is not set"
    };
  }

  if (!existsSync(dirPath)) {
    return {
      name,
      ok: false,
      severity: "warning",
      error: "backup directory does not exist yet"
    };
  }

  const files = readdirSync(dirPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const path = join(dirPath, file);
      const stats = statSync(path);

      return {
        file,
        bytes: stats.size,
        updatedAt: stats.mtime.toISOString()
      };
    })
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  return {
    name,
    ok: true,
    backupCount: files.length,
    latestBackup: files[0] ?? null
  };
}
