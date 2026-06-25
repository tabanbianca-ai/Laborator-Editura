import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleRoot = join(__dirname, "..", "src", "modules");

function readModule(moduleName, fileName) {
  return readFileSync(join(moduleRoot, moduleName, fileName), "utf8");
}

test("projects and documents validate assisted translation targets through shared v1 policy", () => {
  const projects = readModule("projects", "projects.service.ts");
  const documents = readModule("documents", "documents.service.ts");

  assert.match(projects, /validateTranslationTargetV1/);
  assert.match(documents, /validateTranslationTargetV1/);
  assert.match(projects, /targetLocales/);
  assert.match(documents, /targetLocale/);
  assert.match(projects + documents, /Unsupported translation target|assisted translation/i);
});

test("author studio allows any ISO-compatible authoring language without translation allowlist", () => {
  const service = readModule("author-studio", "author-studio.service.ts");
  const types = readModule("author-studio", "author-studio.types.ts");

  assert.match(service, /validateIsoCompatibleLanguageTag/);
  assert.match(service, /normalizeLanguageLocale/);
  assert.match(types, /authoringLanguage/);
  assert.match(types, /authoringLocale/);
  assert.match(types, /originalLanguage/);
  assert.match(types, /originalLocale/);
  assert.doesNotMatch(service, /validateTranslationTargetV1|SUPPORTED_TRANSLATION_TARGETS_V1/);
});

test("translations preserve regional locale separately from language", () => {
  const service = readModule("translations", "translations.service.ts");
  const types = readModule("translations", "translations.types.ts");

  assert.match(service, /assertTranslationTargetSupported/);
  assert.match(service, /targetLocale: segment\.targetLocale/);
  assert.match(service, /originalLocale: segment\.sourceLocale/);
  assert.match(types, /sourceLocale/);
  assert.match(types, /targetLocale/);
});

test("export public portal commerce and rights provenance carry language metadata forward", () => {
  const exportService = readModule("export", "export.service.ts");
  const publicTypes = readModule("public-portal", "public-portal.types.ts");
  const commerceTypes = readModule("commerce", "commerce.types.ts");
  const rightsTypes = readModule("rights-provenance", "rights-provenance.types.ts");

  for (const field of [
    "originalLanguage",
    "originalLocale",
    "authoringLanguage",
    "authoringLocale",
    "targetLanguage",
    "targetLocale"
  ]) {
    assert.match(exportService, new RegExp(field));
    assert.match(publicTypes + commerceTypes + rightsTypes, new RegExp(field));
  }
});

test("research and library preserve language locale metadata without translation allowlist", () => {
  const researchService = readModule("research", "research.service.ts");
  const researchTypes = readModule("research", "research.types.ts");
  const libraryService = readModule("library", "library.service.ts");
  const libraryTypes = readModule("library", "library.types.ts");

  for (const field of [
    "originalLanguage",
    "originalLocale",
    "authoringLanguage",
    "authoringLocale",
    "targetLanguage",
    "targetLocale"
  ]) {
    assert.match(researchTypes + libraryTypes, new RegExp(field));
    assert.match(researchService + libraryService, new RegExp(field));
  }

  assert.match(researchService + libraryService, /validateIsoCompatibleLanguageTag/);
  assert.doesNotMatch(researchService + libraryService, /validateTranslationTargetV1/);
});

test("workspace preferences expose platformLanguage separately from editorial language metadata", () => {
  const service = readModule("workspace", "workspace.service.ts");
  const types = readModule("workspace", "workspace.types.ts");

  assert.match(service + types, /platformLanguage/);
  assert.match(service, /normalizePlatformLanguage/);
  assert.match(service, /validateIsoCompatibleLanguageTag/);
});
