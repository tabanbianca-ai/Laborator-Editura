import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "gateway");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
const runtimeDatabase = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "src", "runtime-database.ts"),
  "utf8"
);
const runtimeBackup = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "scripts", "runtime-backup-lib.mjs"),
  "utf8"
);
const backupRestoreTest = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "tests", "runtime-backup-restore.test.mjs"),
  "utf8"
);

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("gateway module is registered with API gateway integration and webhook endpoints", () => {
  const controller = readSource("gateway.controller.ts");
  const moduleSource = readSource("gateway.module.ts");

  assert.match(appModule, /GatewayModule/);
  assert.match(moduleSource, /DatabaseGatewayRepository/);
  assert.match(moduleSource, /GatewayService/);
  assert.match(controller, /@Controller\("gateway"\)/);
  assert.match(controller, /@Get\("health"\)/);
  assert.match(controller, /@Get\("routes"\)/);
  assert.match(controller, /@Get\("modules"\)/);
  assert.match(controller, /@Post\("api-keys"\)/);
  assert.match(controller, /@Post\("api-keys\/:id\/revoke"\)/);
  assert.match(controller, /@Get\("api-keys"\)/);
  assert.match(controller, /@Controller\("integrations"\)/);
  assert.match(controller, /@Post\(":id\/enable"\)/);
  assert.match(controller, /@Post\(":id\/disable"\)/);
  assert.match(controller, /@Controller\("webhooks"\)/);
  assert.match(controller, /CurrentActor/);
});

test("gateway route registry covers versioning tracing correlation rate-limit and tenant metadata", () => {
  const service = readSource("gateway.service.ts");
  const types = readSource("gateway.types.ts");

  for (const route of [
    "/gateway/health",
    "/gateway/routes",
    "/gateway/modules",
    "/gateway/api-keys",
    "/integrations",
    "/webhooks"
  ]) {
    assert.match(service, new RegExp(route.replaceAll("/", "\\/")));
  }

  assert.match(types, /apiVersion: "v1"/);
  assert.match(types, /tenantAware: true/);
  assert.match(types, /rateLimitPolicy/);
  assert.match(types, /tracingEnabled: true/);
  assert.match(types, /correlationIdRequired: true/);
  assert.match(service, /requestTracing: "enabled"/);
  assert.match(service, /correlationIds: "enabled"/);
  assert.match(service, /rateLimitingMetadata: "configured"/);
});

test("API keys support scopes expiration usage metadata secret hashing revoke and audit", () => {
  const service = readSource("gateway.service.ts");
  const repository = readSource("gateway.repository.ts");
  const types = readSource("gateway.types.ts");

  for (const scope of [
    "gateway:read",
    "gateway:write",
    "integration:read",
    "integration:write",
    "webhook:read",
    "webhook:write"
  ]) {
    assert.match(types, new RegExp(`"${scope}"`));
  }

  assert.match(types, /expiresAt\?: string/);
  assert.match(types, /usageMetadata/);
  assert.match(types, /status: GatewayApiKeyStatus/);
  assert.match(service, /createApiKey/);
  assert.match(service, /revokeApiKey/);
  assert.match(service, /listApiKeys/);
  assert.match(service, /createHash\("sha256"\)/);
  assert.match(service, /secretHash: this\.hashSecret\(secret\)/);
  assert.match(service, /toApiKeyView/);
  assert.match(service, /secret,/);
  assert.match(service, /status: "REVOKED"/);
  assert.match(service, /API_KEY_CREATED/);
  assert.match(service, /API_KEY_REVOKED/);
  assert.match(repository, /gateway_api_keys/);
  assert.match(repository, /gateway_audit_events/);
});

test("integration registry supports approved provider metadata and enable disable lifecycle", () => {
  const service = readSource("gateway.service.ts");
  const repository = readSource("gateway.repository.ts");
  const types = readSource("gateway.types.ts");

  for (const provider of [
    "GOOGLE_DRIVE",
    "DROPBOX",
    "ONEDRIVE",
    "OPENAI",
    "ANTHROPIC",
    "DEEPL",
    "ELEVENLABS",
    "STRIPE",
    "PAYPAL",
    "AMAZON_S3",
    "MINIO",
    "CUSTOM_PROVIDER"
  ]) {
    assert.match(types, new RegExp(`"${provider}"`));
  }

  for (const status of ["NOT_CONFIGURED", "CONFIGURED", "DISABLED"]) {
    assert.match(types, new RegExp(`"${status}"`));
  }

  assert.match(service, /createIntegration/);
  assert.match(service, /enableIntegration/);
  assert.match(service, /disableIntegration/);
  assert.match(service, /externalConnectionEnabled: false/);
  assert.match(service, /INTEGRATION_CREATED/);
  assert.match(service, /INTEGRATION_ENABLED/);
  assert.match(service, /INTEGRATION_DISABLED/);
  assert.match(repository, /integration_providers/);
  assert.match(repository, /integration_audit_events/);
});

test("webhooks support secret hashing retry policy delivery logs enable disable and audit", () => {
  const service = readSource("gateway.service.ts");
  const repository = readSource("gateway.repository.ts");
  const types = readSource("gateway.types.ts");

  assert.match(types, /eventName: string/);
  assert.match(types, /targetUrl: string/);
  assert.match(types, /secretHash: string/);
  assert.match(types, /retryPolicy/);
  assert.match(types, /WebhookDeliveryLog/);
  assert.match(service, /createWebhook/);
  assert.match(service, /enableWebhook/);
  assert.match(service, /disableWebhook/);
  assert.match(service, /recordWebhookDeliveryLog/);
  assert.match(service, /maxAttempts: input\.retryPolicy\?\.maxAttempts \?\? 3/);
  assert.match(service, /backoffSeconds: input\.retryPolicy\?\.backoffSeconds \?\? 30/);
  assert.match(service, /WEBHOOK_CREATED/);
  assert.match(service, /WEBHOOK_ENABLED/);
  assert.match(service, /WEBHOOK_DISABLED/);
  assert.match(service, /WEBHOOK_DELIVERY_LOG_RECORDED/);
  assert.match(repository, /webhooks/);
  assert.match(repository, /webhook_delivery_logs/);
});

test("human final authority is preserved and AI cannot activate secrets or providers", () => {
  const service = readSource("gateway.service.ts");
  const types = readSource("gateway.types.ts");

  assert.match(types, /humanApprovalRequired: true/);
  assert.match(types, /aiSuggested: boolean/);
  assert.match(types, /aiInitiated\?: boolean/);
  assert.match(service, /rejectAiInitiated/);
  assert.match(service, /AI cannot create active API secrets/);
  assert.match(service, /AI cannot create active integration secrets/);
  assert.match(service, /AI cannot enable integrations automatically/);
  assert.match(service, /AI cannot create active webhook secrets/);
  assert.match(service, /humanFinalAuthority: true/);
  assert.doesNotMatch(service, /autoApprove|autoEnable|autoConfigure|provider\.connect|fetch\(|axios/i);
});

test("runtime persistence and backup include gateway integration and webhook data", () => {
  for (const tableName of [
    "gateway_api_keys",
    "gateway_route_registry",
    "integration_providers",
    "integration_audit_events",
    "webhooks",
    "webhook_delivery_logs",
    "gateway_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"webhook_delivery_logs",\s*"webhookId",\s*"webhooks"/);
  assert.match(runtimeBackup, /"integration_audit_events",\s*"integrationProviderId",\s*"integration_providers"/);
  assert.match(backupRestoreTest, /gateway-route-a/);
  assert.match(backupRestoreTest, /gateway-key-a/);
  assert.match(backupRestoreTest, /integration-a/);
  assert.match(backupRestoreTest, /webhook-a/);
});
