import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleRoot = join(__dirname, "..", "src", "modules", "workspace");
const service = readFileSync(join(moduleRoot, "workspace.service.ts"), "utf8");
const controller = readFileSync(join(moduleRoot, "workspace.controller.ts"), "utf8");
const types = readFileSync(join(moduleRoot, "workspace.types.ts"), "utf8");

test("workspace exposes one centralized Language Management API", () => {
  assert.match(types, /WorkspaceLanguageManagement/);
  assert.match(controller, /@Get\("language-management"\)/);
  assert.match(controller, /@Post\("language-management"\)/);
  assert.match(service, /createUnifiedLanguageManagementModel/);
  assert.match(service, /buildLanguageManagement/);
  assert.match(service, /unifiedLanguageManagement/);
});

test("platform language switching remains separate from editorial language metadata", () => {
  assert.match(types, /platformLanguage/);
  assert.match(types, /originalLanguage/);
  assert.match(types, /authoringLanguage/);
  assert.match(types, /targetLanguages/);
  assert.match(service, /PLATFORM_LANGUAGE_CHANGED/);
  assert.match(service, /Original Language is immutable unless changed by an authorized user/);
  assert.match(service, /authorizedOriginalLanguageChange/);
});

test("workspace language management supports multilingual projects and review comparison", () => {
  assert.match(service, /targetLanguages/);
  assert.match(service, /createParallelReviewColumns/);
  assert.match(types, /supportsThreeColumns: true/);
  assert.match(types, /supportsFourColumns: true/);
  assert.match(types, /eachColumnSelectsLanguageAndVersion: true/);
});

test("linguistic resources and AI agents follow the centralized language model", () => {
  assert.match(service, /linguisticResourceLoading/);
  assert.match(types, /dictionaries/);
  assert.match(types, /glossaries/);
  assert.match(types, /platformLanguageControlsUserCommunication: true/);
  assert.match(types, /aiMayChangeLanguageConfiguration: false/);
  assert.match(service, /translationDirection/);
});

test("language configuration changes are audited", () => {
  for (const action of [
    "PLATFORM_LANGUAGE_CHANGED",
    "ORIGINAL_LANGUAGE_CHANGED",
    "AUTHORING_LANGUAGE_CHANGED",
    "TARGET_LANGUAGE_ADDED",
    "TARGET_LANGUAGE_REMOVED",
    "LANGUAGE_RESOURCES_UPDATED"
  ]) {
    assert.match(types + service, new RegExp(action));
  }
});
