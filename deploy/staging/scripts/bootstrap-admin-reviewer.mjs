#!/usr/bin/env node
import { spawnSync } from "node:child_process";

import { loadStagingEnv, requiredEnv, stripTrailingSlash } from "./staging-env.mjs";
import { assertEqual, assertIncludes, authHeaders, requestJson } from "./staging-http.mjs";

loadStagingEnv();

const apiBase = stripTrailingSlash(requiredEnv("API_BASE"));
const email = requiredEnv("STAGING_REVIEWER_EMAIL");
const displayName = requiredEnv("STAGING_REVIEWER_NAME");
const organizationName = requiredEnv("STAGING_ORGANIZATION_NAME");
const role = requiredEnv("STAGING_BOOTSTRAP_ROLE");
const mode = process.env.STAGING_BACKUP_MODE ?? "local";

if (role !== "ADMIN" && role !== "REVIEWER") {
  throw new Error("STAGING_BOOTSTRAP_ROLE must be ADMIN or REVIEWER.");
}

const firstLogin = await login();
const userId = firstLogin.user.id;
const organizationId = firstLogin.organization.id;

grantRuntimeRole(organizationId, userId, role, mode);

const freshLogin = await login();
const token = freshLogin.session.token;
const me = await requestJson(apiBase, "/auth/me", {
  headers: authHeaders(token)
});
const spoofed = await requestJson(apiBase, "/auth/me", {
  headers: {
    ...authHeaders(token),
    "x-organization-id": "spoofed-org",
    "x-user-id": "spoofed-user",
    "x-user-roles": "ADMIN"
  }
});

assertEqual(me.userId, userId, "fresh session userId");
assertEqual(me.organizationId, organizationId, "fresh session organizationId");
assertEqual(spoofed.userId, userId, "spoofed header userId");
assertEqual(spoofed.organizationId, organizationId, "spoofed header organizationId");
assertIncludes(me.roles, role, "fresh session roles");

console.log(JSON.stringify({
  status: "ok",
  action: "bootstrap-admin-reviewer",
  userId,
  organizationId,
  roles: me.roles,
  spoofedHeadersIgnored: true
}, null, 2));

async function login() {
  const body = {
    displayName,
    email,
    organizationName
  };
  const loginSecret = process.env.LABORATOR_AUTH_LOGIN_SECRET;

  if (loginSecret) {
    body.loginSecret = loginSecret;
  }

  return requestJson(apiBase, "/auth/login", {
    body,
    method: "POST"
  });
}

function grantRuntimeRole(organizationId, userId, role, mode) {
  const dbPath = requiredEnv("LABORATOR_RUNTIME_DB_PATH");
  const args = [
    "deploy/staging/scripts/runtime-role-grant.mjs",
    dbPath,
    organizationId,
    userId,
    role
  ];
  const result =
    mode === "docker"
      ? spawnSync("docker", [
          "compose",
          "--env-file",
          process.env.STAGING_ENV_FILE ?? "deploy/staging/.env.staging",
          "-f",
          process.env.STAGING_COMPOSE_FILE ?? "deploy/staging/docker-compose.staging.yml",
          "exec",
          "-T",
          "api",
          "node",
          ...args
        ], { stdio: "inherit" })
      : spawnSync(process.execPath, args, { stdio: "inherit" });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Role bootstrap failed with status ${result.status ?? "unknown"}.`);
  }
}
