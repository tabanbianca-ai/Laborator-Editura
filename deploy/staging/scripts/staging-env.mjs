import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadStagingEnv() {
  const envFile = process.env.STAGING_ENV_FILE ?? "deploy/staging/.env.staging";
  const resolved = resolve(envFile);

  if (!existsSync(resolved)) {
    return {
      loaded: false,
      path: resolved
    };
  }

  const lines = readFileSync(resolved, "utf8").split(/\r?\n/u);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = unquote(rawValue);
  }

  return {
    loaded: true,
    path: resolved
  };
}

export function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

export function stripTrailingSlash(value) {
  return value.replace(/\/$/u, "");
}

function unquote(value) {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
