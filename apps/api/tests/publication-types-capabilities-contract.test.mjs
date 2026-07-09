import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(apiRoot, path), "utf8");
}

test("projects require one Publication Type and support optional Project Capabilities", () => {
  const types = readSource("src/modules/projects/projects.types.ts");
  const service = readSource("src/modules/projects/projects.service.ts");

  for (const value of [
    "BOOK",
    "CHILDRENS_BOOK",
    "MAGAZINE",
    "POETRY",
    "DICTIONARY",
    "COURSE",
    "AUDIOBOOK",
    "VIDEO"
  ]) {
    assert.match(types, new RegExp(`"${value}"`));
    assert.match(service, new RegExp(`"${value}"`));
  }

  for (const value of [
    "ILLUSTRATIONS",
    "TRANSLATION",
    "AUDIOBOOK",
    "VIDEO",
    "FLIPBOOK",
    "ACCESSIBILITY"
  ]) {
    assert.match(types, new RegExp(`"${value}"`));
    assert.match(service, new RegExp(`"${value}"`));
  }

  assert.match(types, /publicationType: ProjectPublicationType/);
  assert.match(types, /capabilities\?: ProjectCapability\[\]/);
  assert.match(service, /Publication Type is required/);
  assert.match(service, /Unsupported publication type/);
});

test("project capabilities derive the existing editorial process without creating a new module", () => {
  const types = readSource("src/modules/projects/projects.types.ts");
  const service = readSource("src/modules/projects/projects.service.ts");

  assert.match(types, /ProjectEditorialProcessStage/);
  assert.match(types, /editorialProcess: ProjectEditorialProcessStage\[\]/);
  assert.match(service, /BASE_EDITORIAL_PROCESS/);
  assert.match(service, /buildEditorialProcess/);
  assert.match(service, /stages\.push\("ILLUSTRATION"\)/);
  assert.match(service, /stages\.push\("TRANSLATION"\)/);
  assert.match(service, /stages\.push\("ACCESSIBILITY"\)/);
  assert.match(service, /stages\.push\("AUDIOBOOK"\)/);
  assert.match(service, /stages\.push\("VIDEO"\)/);
  assert.match(service, /stages\.push\("FLIPBOOK"\)/);
  assert.doesNotMatch(service, /PublicationTypesModule|ProjectCapabilitiesModule/);
});

test("Flipbook is constrained to Magazine projects and metadata is persisted on projects", () => {
  const service = readSource("src/modules/projects/projects.service.ts");

  assert.match(service, /normalized\.includes\("FLIPBOOK"\) && publicationType !== "MAGAZINE"/);
  assert.match(service, /Flipbook capability is available only for Magazine projects/);
  assert.match(service, /publicationType,/);
  assert.match(service, /capabilities,/);
  assert.match(service, /editorialProcess,/);
});
