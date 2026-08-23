import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = join(webRoot, "..", "..");

function readWeb(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

function readRepository(path) {
  return readFileSync(join(repositoryRoot, path), "utf8");
}

const locales = [
  "ro-RO",
  "en-US",
  "en-GB",
  "es-ES",
  "fr-FR",
  "pt-PT",
  "pt-BR",
  "it-IT",
  "de-DE"
];

test("P1-03 exposes one canonical nine-locale registry and full document locale", () => {
  const i18n = readWeb("lib/ui-i18n.ts");
  const layout = readWeb("app/layout.tsx");
  const middleware = readWeb("middleware.ts");

  for (const locale of locales) {
    assert.match(i18n, new RegExp(`"${locale}"`));
    assert.match(middleware, new RegExp(`"${locale}"`));
  }
  assert.match(layout, /<html data-theme=\{theme\} lang=\{language\}>/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /metadata\.description/);
});

test("P1-03 locale routing, fallback, and language switcher fail closed", () => {
  const middleware = readWeb("middleware.ts");
  const switcher = readWeb("components/layout/locale-switcher.tsx");
  const requestLocale = readWeb("lib/request-ui-locale.ts");

  assert.match(middleware, /searchParams\.get\("locale"\)/);
  assert.match(middleware, /localeError", "unsupported"/);
  assert.match(middleware, /httpOnly: true/);
  assert.match(middleware, /sameSite: "lax"/);
  assert.match(requestLocale, /laborator_ui_locale/);
  assert.match(switcher, /UI_LOCALES\.map/);
  assert.match(switcher, /name="locale"/);
});

test("P1-03 browser crawl covers public, protected, authenticated, fallback, and leakage checks", () => {
  const browserTest = readWeb("e2e/localization/p1-03-localization.spec.ts");

  for (const locale of locales) {
    assert.match(browserTest, new RegExp(`"${locale}"`));
  }
  for (const requiredToken of [
    "/login?locale=",
    "/reset-password",
    "/dashboard?locale=",
    "/projects/new",
    "/pipeline",
    "/distribution",
    "localeError=unsupported",
    "P1_03_SESSION_TOKEN",
    'meta[name="description"]',
    "not.toContainText"
  ]) {
    assert.match(
      browserTest,
      new RegExp(requiredToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
  }
});

test("P1-03 workflow is manual, read-only, staging-scoped, and evidence-producing", () => {
  const workflow = readRepository(".github/workflows/p1-03-localization.yml");

  assert.match(workflow, /^on:\n {2}workflow_dispatch:/m);
  assert.match(workflow, /^ {4}environment: staging$/m);
  assert.match(workflow, /P1_03_REQUIRE_AUTH: "true"/);
  assert.match(workflow, /secrets\.P1_03_SESSION_TOKEN/);
  assert.match(workflow, /test:localization/);
  assert.match(workflow, /p1-03-localization-evidence/);
  assert.doesNotMatch(workflow, /\b(?:ssh|scp|docker|deploy)\b/i);
});

test("critical public authentication UI does not hard-code a platform language", () => {
  for (const path of [
    "app/login/page.tsx",
    "app/reset-password/page.tsx",
    "components/pages/auth-login-page.tsx",
    "components/pages/auth-reset-password-page.tsx"
  ]) {
    const source = readWeb(path);
    assert.doesNotMatch(source, /platformLanguage="(?:ro|en|es|fr|pt|it|de)"/);
  }
});
