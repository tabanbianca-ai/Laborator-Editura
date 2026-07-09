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

test("Project Identity is part of project creation and persisted on projects", () => {
  const types = readSource("src/modules/projects/projects.types.ts");
  const service = readSource("src/modules/projects/projects.service.ts");

  for (const value of [
    "ORIGINAL_CREATION",
    "EXTERNAL_AUTHOR",
    "TRANSLATION",
    "EDITORIAL_COLLABORATION",
    "PUBLIC_DOMAIN_CLASSICAL_WORK",
    "MAGAZINE_ARTICLE",
    "CHILDRENS_BOOK",
    "AUDIO_VIDEO_PROJECT",
    "RIGHTS_OBTAINED",
    "PUBLIC_DOMAIN",
    "RIGHTS_PENDING",
    "RESTRICTED_PUBLICATION"
  ]) {
    assert.match(types, new RegExp(value));
  }

  assert.match(types, /projectIdentity: ProjectIdentityInput/);
  assert.match(types, /projectIdentity\?: ProjectIdentity/);
  assert.match(service, /Project Identity requires projectOrigin and rightsStatus/);
  assert.match(service, /metadata = \{\n\s+\.\.\.\(input\.metadata \?\? \{\}\),\n\s+projectIdentity\n\s+\}/);
  assert.match(service, /projectIdentity,/);
});

test("Project Identity requires original author metadata except for original creation", () => {
  const service = readSource("src/modules/projects/projects.service.ts");

  assert.match(service, /projectOrigin === "ORIGINAL_CREATION"/);
  assert.match(service, /Original author name and originalLanguage are required/);
  assert.match(service, /normalizeIsoLanguage\(originalAuthor\.originalLanguage\)/);
});

test("public domain projects allow publication but keep contribution rights tracking", () => {
  const service = readSource("src/modules/projects/projects.service.ts");

  assert.match(service, /identity\.rightsStatus === "PUBLIC_DOMAIN"/);
  assert.match(service, /identity\.rightsStatus === "CLASSICAL_WORK"/);
  for (const contribution of [
    "translation",
    "editorialAdaptation",
    "illustrations",
    "layout",
    "cover",
    "audiobook",
    "video",
    "otherOriginalContributions"
  ]) {
    assert.match(service, new RegExp(`${contribution}: true`));
  }
  assert.match(service, /originalAuthorRightsRequired: !publicDomain && identity\.projectOrigin !== "ORIGINAL_CREATION"/);
});

test("Project Identity is propagated into JSON Master project metadata", () => {
  const exportService = readSource("src/modules/export/export.service.ts");

  assert.match(exportService, /metadata: project\.metadata/);
});
