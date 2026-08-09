import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");

function readSource(fileName) {
  return readFileSync(join(packageRoot, "src", fileName), "utf8");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

test("configuration validation foundation rejects weak or missing critical secrets safely", () => {
  const source = readSource("configuration.ts");

  for (const symbol of [
    "ConfigurationValidationError",
    "validateRuntimeConfiguration",
    "assertRuntimeConfiguration",
    "createCoreConfigurationSchema",
    "CONFIG_REQUIRED",
    "CONFIG_WEAK_SECRET",
    "formatConfigurationValidationIssues"
  ]) {
    assert.match(source, new RegExp(symbol));
  }

  assert.doesNotMatch(source, /rawValue.*message/u);
  assert.match(source, /LABORATOR_SESSION_SECRET/);
  assert.match(source, /LABORATOR_AUTH_LOGIN_SECRET/);
});

test("structured logging foundation defines canonical fields and redacts sensitive metadata", () => {
  const source = readSource("structured-logging.ts");

  for (const field of [
    "timestamp",
    "severity",
    "service",
    "module",
    "environment",
    "event_name",
    "correlation_id",
    "trace_id",
    "span_id",
    "actor_id",
    "organization_id",
    "resource_id",
    "message",
    "metadata"
  ]) {
    assert.match(source, new RegExp(field));
  }

  for (const level of ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"]) {
    assert.match(source, new RegExp(`"${level}"`));
  }

  assert.match(source, /redactSensitiveMetadata/);
  assert.match(source, /\[REDACTED\]/);
  assert.match(source, /correlationId/);
});

test("common error model exposes safe localized error payload fields", () => {
  const source = readSource("errors.ts");

  for (const category of [
    "VALIDATION",
    "AUTHENTICATION",
    "AUTHORIZATION",
    "NOT_FOUND",
    "CONFLICT",
    "RATE_LIMIT",
    "DEPENDENCY",
    "CONFIGURATION",
    "INTERNAL"
  ]) {
    assert.match(source, new RegExp(`"${category}"`));
  }

  for (const field of [
    "error_code",
    "category",
    "http_status",
    "message_key",
    "correlation_id",
    "details",
    "retryable",
    "timestamp"
  ]) {
    assert.match(source, new RegExp(field));
  }

  assert.match(source, /createSafeUserErrorPayload/);
});

test("localization foundation contains seven official platform languages and complete common keys", () => {
  const source = readSource("localization.ts");
  const localesRoot = join(packageRoot, "locales");
  const localeDirectories = readdirSync(localesRoot).sort();
  const requiredLocales = [
    "de-DE",
    "en-GB",
    "en-US",
    "es-ES",
    "fr-FR",
    "it-IT",
    "pt-BR",
    "pt-PT",
    "ro-RO"
  ];
  const requiredKeys = [
    "action.cancel",
    "action.confirm",
    "action.continue",
    "action.save",
    "auth.login",
    "auth.logout",
    "auth.resetPassword",
    "common.empty",
    "common.error",
    "common.loading",
    "health.liveness",
    "health.readiness",
    "health.startup",
    "navigation.dashboard",
    "navigation.pipeline"
  ];

  assert.deepEqual(localeDirectories, requiredLocales);

  for (const locale of requiredLocales) {
    const messages = readJson(join(localesRoot, locale, "common.json"));
    for (const key of requiredKeys) {
      assert.equal(typeof messages[key], "string", `${locale} missing ${key}`);
      assert.ok(messages[key].length > 0, `${locale} empty ${key}`);
    }
  }

  for (const language of ["ro", "en", "es", "fr", "pt", "it", "de"]) {
    assert.match(source, new RegExp(`"${language}"`));
  }

  assert.match(source, /PRIMARY_UI_LOCALE/);
  assert.match(source, /FALLBACK_UI_LOCALE/);
  assert.match(source, /validateLocalizationCatalog/);
});
