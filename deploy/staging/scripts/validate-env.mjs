#!/usr/bin/env node
import { loadStagingEnv } from "./staging-env.mjs";

loadStagingEnv();

const required = [
  "WEB_ORIGIN",
  "LABORATOR_RUNTIME_DB_PATH",
  "LABORATOR_SESSION_SECRET",
  "LABORATOR_AUTH_LOGIN_SECRET",
  "STAGING_BACKUP_DIR",
  "STAGING_RESTORE_DB_PATH"
];

const oneOf = [
  ["API_BASE", "API_BASE_URL"],
  ["STAGING_WEB_ORIGIN", "WEB_ORIGIN"]
];

const issues = [];

for (const name of required) {
  if (!process.env[name]) {
    issues.push(`${name} is required`);
  } else if (name.endsWith("_SECRET") && isWeakSecret(process.env[name])) {
    issues.push(`${name} is weak or uses a default/demo value`);
  }
}

for (const group of oneOf) {
  if (!group.some((name) => Boolean(process.env[name]))) {
    issues.push(`one of ${group.join(", ")} is required`);
  }
}

const role = process.env.STAGING_BOOTSTRAP_ROLE;

if (role && role !== "ADMIN" && role !== "REVIEWER") {
  issues.push("STAGING_BOOTSTRAP_ROLE must be ADMIN or REVIEWER");
}

const result = {
  checkedAt: new Date().toISOString(),
  status: issues.length === 0 ? "ok" : "failed",
  issues
};

console.log(JSON.stringify(result, null, 2));

if (issues.length > 0) {
  process.exitCode = 1;
}

function isWeakSecret(value) {
  const trimmed = value.trim();
  const weakPatterns = [/changeme/iu, /default/iu, /demo/iu, /example/iu, /password/iu, /replace/iu, /secret/iu, /test/iu];

  return (
    trimmed.length < 32 ||
    new Set(trimmed).size < 8 ||
    weakPatterns.some((pattern) => pattern.test(trimmed))
  );
}
