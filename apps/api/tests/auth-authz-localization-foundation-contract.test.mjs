import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "auth");
const dbRoot = join(__dirname, "..", "..", "..", "packages", "db");

function readAuth(fileName) {
  return readFileSync(join(moduleDir, fileName), "utf8");
}

function readDb(path) {
  return readFileSync(join(dbRoot, path), "utf8");
}

test("auth controller exposes complete centralized authentication endpoints", () => {
  const controller = readAuth("auth.controller.ts");

  for (const endpoint of [
    '@Post("login")',
    '@Post("logout")',
    '@Get("session")',
    '@Post("session/refresh")',
    '@Post("password/reset")',
    '@Post("password/change")',
    '@Post("email/verify")',
    '@Get("sessions")',
    '@Post("sessions/:sessionId/revoke")',
    '@Get("profile")'
  ]) {
    assert.match(controller, new RegExp(endpoint.replace(/[()]/g, "\\$&")));
  }

  assert.match(controller, /readBearerToken/);
  assert.match(controller, /CurrentActor/);
});

test("official roles are typed in English and mapped through RBAC", () => {
  const types = readAuth("auth.types.ts");
  const requestContext = readAuth("request-context.types.ts");

  for (const role of [
    "ADMIN",
    "EDITOR",
    "TRANSLATOR",
    "PROOFREADER",
    "DESIGNER",
    "NARRATOR",
    "AUTHOR",
    "COLLABORATOR",
    "READER",
    "GUEST"
  ]) {
    assert.match(types, new RegExp(`"${role}"`));
  }

  assert.match(requestContext, /permissionsForRoles/);
  assert.match(requestContext, /role === "EDITOR"/);
  assert.match(requestContext, /role === "PROOFREADER"/);
  assert.match(requestContext, /role === "NARRATOR"/);
});

test("auth service manages passwords sessions email verification and activity audit without client identity", () => {
  const service = readAuth("auth.service.ts");
  const repository = readAuth("auth.repository.ts");

  for (const symbol of [
    "requestPasswordReset",
    "completePasswordReset",
    "changePassword",
    "verifyEmail",
    "listActiveSessions",
    "revokeSession",
    "refreshSession",
    "auditActivity",
    "hashPassword",
    "verifyPassword"
  ]) {
    assert.match(service, new RegExp(symbol));
  }

  assert.match(service, /scryptSync/);
  assert.match(service, /timingSafeEqual/);
  assert.match(repository, /auth_credentials/);
  assert.match(repository, /auth_password_reset_requests/);
  assert.match(repository, /auth_email_verification_requests/);
  assert.match(repository, /auth_activity_events/);
  assert.doesNotMatch(service + repository, /x-user-id|x-organization-id|x-user-roles/);
});

test("request middleware protects modules and keeps only explicit auth health public routes", () => {
  const middleware = readAuth("request-context.middleware.ts");

  assert.match(middleware, /routePath === "\/auth\/login"/);
  assert.match(middleware, /routePath === "\/auth\/password\/reset"/);
  assert.match(middleware, /routePath === "\/auth\/email\/verify"/);
  assert.match(middleware, /isHealthRoute/);
  assert.match(middleware, /Valid authenticated context is required/);
});

test("runtime backup includes auth credentials reset verification and activity state", () => {
  const runtimeDatabase = readDb("src/runtime-database.ts");
  const backupLib = readDb("scripts/runtime-backup-lib.mjs");

  for (const tableName of [
    "auth_credentials",
    "auth_password_reset_requests",
    "auth_email_verification_requests",
    "auth_activity_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(backupLib, new RegExp(`"${tableName}"`));
  }
});
