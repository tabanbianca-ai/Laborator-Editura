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

test("project creation separates Project Identity Publication Type and Project Capabilities", () => {
  const form = readSource("components/projects/project-identity-form.tsx");
  const i18n = readSource("lib/ui-i18n.ts");

  assert.match(form, /projectOriginValues/);
  assert.match(form, /publicationTypeValues/);
  assert.match(form, /capabilityValues/);
  assert.match(form, /name="publicationType"/);
  assert.match(form, /name="capabilities"/);
  assert.match(form, /type="checkbox"/);
  assert.match(form, /capability === "FLIPBOOK" && !flipbookAvailable/);
  assert.match(form, /publicationType === "MAGAZINE"/);

  for (const key of [
    "project.publicationType",
    "project.projectCapabilities",
    "project.capabilityIllustrations",
    "project.capabilityTranslation",
    "project.capabilityAudiobook",
    "project.capabilityVideo",
    "project.capabilityFlipbook",
    "project.capabilityAccessibility"
  ]) {
    assert.match(i18n, new RegExp(key.replace(".", "\\.")));
    assert.match(form, new RegExp(key.replace(".", "\\.")));
  }
});

test("project creation posts publication type and capabilities through the existing Projects API", () => {
  const actions = readSource("lib/projects-actions.ts");
  const api = readSource("lib/projects-documents-api.ts");

  assert.match(api, /ProjectPublicationType/);
  assert.match(api, /ProjectCapability/);
  assert.match(api, /publicationType: ProjectPublicationType/);
  assert.match(api, /capabilities\?: ProjectCapability\[\]/);
  assert.match(actions, /readRequiredString\(formData, "publicationType"\) as ProjectPublicationType/);
  assert.match(actions, /readStringList\(formData, "capabilities"\) as ProjectCapability\[\]/);
  assert.match(actions, /getAll\(fieldName\)/);
});

test("pipeline uses Project Capabilities to activate optional production stages", () => {
  const pipelineClient = readSource("lib/editorial-pipeline-client.ts");
  const projectsPage = readSource("components/pages/projects-page.tsx");
  const projectDetail = readSource("components/pages/project-detail-page.tsx");

  assert.match(pipelineClient, /isProjectCapabilityEnabled/);
  assert.match(pipelineClient, /getProjectPublicationType/);
  assert.match(pipelineClient, /translationEnabled/);
  assert.match(pipelineClient, /illustrationsEnabled/);
  assert.match(pipelineClient, /audiobookEnabled/);
  assert.match(pipelineClient, /videoEnabled/);
  assert.match(pipelineClient, /magazineOutputsEnabled/);
  assert.match(pipelineClient, /accessibilityEnabled/);
  assert.match(pipelineClient, /step\.id === "translation"/);
  assert.match(pipelineClient, /step\.id === "illustration"/);
  assert.match(pipelineClient, /step\.id === "accessibility"/);
  assert.match(projectsPage, /project\.publicationType/);
  assert.match(projectDetail, /project\.capabilities/);
  assert.match(projectDetail, /project\.editorialProcess/);
});
