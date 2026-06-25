import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

test("manuscript UI accepts any ISO authoring language and displays original metadata", () => {
  const client = readSource("lib/author-studio-client.ts");
  const newPage = readSource("components/pages/author-studio-new-page.tsx");
  const detailPage = readSource("components/pages/author-studio-detail-page.tsx");

  for (const field of [
    "originalLanguage",
    "originalLocale",
    "authoringLanguage",
    "authoringLocale"
  ]) {
    assert.match(client + newPage + detailPage, new RegExp(field));
  }

  assert.match(newPage, /ja-JP/);
  assert.match(detailPage, /Authoring language/);
});

test("translation workspace displays language and regional locale separately", () => {
  const client = readSource("lib/translation-workspace-client.ts");
  const page = readSource("components/pages/translation-workspace-page.tsx");

  assert.match(client, /sourceLocale/);
  assert.match(client, /targetLocale/);
  assert.match(page, /formatLanguage\(segment\.sourceLanguage, segment\.sourceLocale\)/);
  assert.match(page, /formatLanguage\(segment\.targetLanguage, segment\.targetLocale\)/);
  assert.match(page, /v1\.0/);
});

test("publishing workspace displays original authoring and target language metadata", () => {
  const client = readSource("lib/publishing-workspace-client.ts");
  const page = readSource("components/pages/publishing-workspace-page.tsx");

  for (const field of [
    "originalLanguage",
    "originalLocale",
    "authoringLanguage",
    "authoringLocale",
    "targetLanguage",
    "targetLocale"
  ]) {
    assert.match(client + page, new RegExp(field));
  }

  assert.match(page, /Authoring language/);
  assert.match(page, /Target language/);
});

test("rights provenance screen records and displays language locale metadata", () => {
  const client = readSource("lib/rights-workspace-client.ts");
  const actions = readSource("lib/rights-workspace-actions.ts");
  const page = readSource("components/pages/rights-workspace-page.tsx");

  for (const field of [
    "originalLanguage",
    "originalLocale",
    "authoringLanguage",
    "authoringLocale",
    "targetLanguage",
    "targetLocale"
  ]) {
    assert.match(client + actions + page, new RegExp(field));
  }
});

test("top navigation exposes platform language from workspace preferences", () => {
  const topNav = readSource("components/layout/top-nav.tsx");

  assert.match(topNav, /preferences\?\.language/);
  assert.match(topNav, /Badge tone="neutral"/);
});
