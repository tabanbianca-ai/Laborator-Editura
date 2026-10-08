import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const modulesDir = join(__dirname, "..", "src", "modules");

function readModule(moduleName, fileName) {
  return readFileSync(join(modulesDir, moduleName, fileName), "utf8");
}

function readMethod(source, methodName) {
  const method = source.match(
    new RegExp(`async ${methodName}\\([\\s\\S]*?\\n  }(?=\\n\\n  (?:async|private|get))`)
  )?.[0];

  assert.ok(method, `${methodName} must exist`);
  return method;
}

test("projects service defines one tenant-scoped read-only readiness validator", () => {
  const source = readModule("projects", "projects.service.ts");
  const validator = source.match(
    /async assertProjectReadyForEditorialProcessing\([\s\S]*?\n  }\n\n  async listProjects/
  )?.[0];

  assert.ok(validator);
  assert.match(validator, /const project = await this\.getProject\(actor, projectId\)/);
  assert.match(validator, /PROJECT_PUBLICATION_TYPES\.includes\(project\.publicationType\)/);
  assert.match(validator, /PROJECT_EDITORIAL_DOMAINS\.includes\(project\.editorialDomain\)/);
  assert.match(validator, /Array\.isArray\(project\.editorialProcess\)/);
  assert.match(validator, /BASE_EDITORIAL_PROCESS\.filter/);
  assert.match(validator, /gateIndexes\.length !== 1/);
  assert.match(validator, /gateIndex <= previousGateIndex/);
  assert.match(validator, /return project/);
  assert.doesNotMatch(validator, /repository\.(create|update)|this\.audit\(|normalize|repair/i);
});

test("readiness errors preserve the established API conventions", () => {
  const source = readModule("projects", "projects.service.ts");

  assert.match(source, /throw new NotFoundException\("project not found\."\)/);
  assert.match(
    source,
    /Project is not ready for editorial processing: publicationType is missing or unsupported\./
  );
  assert.match(
    source,
    /Project is not ready for editorial processing: editorialDomain is missing or unsupported\./
  );
  assert.match(
    source,
    /Project is not ready for editorial processing: editorialProcess is missing or empty\./
  );
  assert.match(source, /must appear exactly once\./);
  assert.match(source, /mandatory editorial gates are not in canonical order\./);
});

test("mandatory gate requirements are derived from the canonical editorial process", () => {
  const source = readModule("projects", "projects.service.ts");

  for (const gate of ["REVIEW", "EDITORIAL_VALIDATION", "FINAL_APPROVAL"]) {
    assert.match(source, new RegExp(`stage === "${gate}"`));
  }

  assert.match(source, /const mandatoryGates = BASE_EDITORIAL_PROCESS\.filter/);
  assert.doesNotMatch(source, /const MANDATORY_EDITORIAL_GATES/);
});

test("legacy project reads remain independent from readiness enforcement", () => {
  const source = readModule("projects", "projects.service.ts");
  const getProject = source.match(/async getProject\([\s\S]*?\n  }\n\n  async assertProjectReady/)?.[0];
  const listProjects = source.match(/async listProjects\([\s\S]*?\n  }\n\n  async listProjectDossiers/)?.[0];

  assert.ok(getProject);
  assert.ok(listProjects);
  assert.doesNotMatch(getProject, /assertProjectReadyForEditorialProcessing/);
  assert.doesNotMatch(listProjects, /assertProjectReadyForEditorialProcessing/);
});

test("workflow validates project readiness before state lookup or persistence", () => {
  const service = readModule("workflow", "workflow.service.ts");
  const module = readModule("workflow", "workflow.module.ts");
  const startWorkflow = readMethod(service, "startWorkflow");
  const guardIndex = startWorkflow.indexOf("assertProjectReadyForEditorialProcessing");

  assert.ok(guardIndex >= 0);
  assert.ok(guardIndex < startWorkflow.indexOf("findStateByTarget"));
  assert.ok(guardIndex < startWorkflow.indexOf("createState"));
  assert.match(module, /imports: \[ProjectsModule, QaModule, SemanticFidelityModule\]/);
});

test("export and magazine protected boundaries use the canonical validator", () => {
  const exportSource = readModule("export", "export.service.ts");
  const exportDocument = readMethod(exportSource, "exportDocument");
  assert.ok(
    exportDocument.indexOf("assertProjectReadyForEditorialProcessing") <
      exportDocument.indexOf("createArtifact")
  );

  const magazineSource = readModule("magazine-workflow", "magazine-workflow.service.ts");
  for (const methodName of [
    "createIssue",
    "approveFinalIssue",
    "publishIssue",
    "republishIssue",
    "recordDistributionPromotion"
  ]) {
    assert.match(readMethod(magazineSource, methodName), /assertProjectReadyForEditorialProcessing/);
  }

  assert.doesNotMatch(readMethod(magazineSource, "createPublishedRevision"), /assertProjectReadyForEditorialProcessing/);
});

test("layout publishing protects processing, approval, preflight, publication and distribution", () => {
  const service = readModule("layout-publishing", "layout-publishing.service.ts");
  const module = readModule("layout-publishing", "layout-publishing.module.ts");

  for (const methodName of ["createPlan", "approvePublication", "recordExport", "generatePublishingPreflight"]) {
    assert.match(readMethod(service, methodName), /assertProjectReadyForEditorialProcessing/);
  }

  for (const methodName of [
    "preparePublishingRecord",
    "markReadyForPublication",
    "publishOfficialEdition",
    "republishPublication"
  ]) {
    assert.match(readMethod(service, methodName), /assertPreflightProjectReady/);
  }

  for (const methodName of ["recordDistribution", "updateDistributionStatus"]) {
    const method = readMethod(service, methodName);
    assert.match(method, /assertPublishingRecordProjectReady/);
    assert.match(method, /!== "WITHDRAWN"/);
  }

  assert.match(module, /ProjectsModule/);
  assert.doesNotMatch(readMethod(service, "getPlan"), /assertProjectReadyForEditorialProcessing/);
});

test("library guards only published lifecycle and public visibility transitions", () => {
  const service = readModule("library", "library.service.ts");
  const module = readModule("library", "library.module.ts");

  const createPublication = readMethod(service, "createPublication");
  assert.match(createPublication, /input\.lifecycleStatus === "PUBLICAT"/);
  assert.match(createPublication, /input\.visibility === "PUBLIC"/);
  assert.match(readMethod(service, "updatePublicationStatus"), /input\.lifecycleStatus === "PUBLICAT"/);
  assert.match(readMethod(service, "updatePublicationVisibility"), /input\.visibility === "PUBLIC"/);
  assert.match(readMethod(service, "runBulkAction"), /input\.action === "MARK_PUBLIC"/);
  assert.match(readMethod(service, "runBulkAction"), /input\.lifecycleStatus === "PUBLICAT"/);
  assert.doesNotMatch(readMethod(service, "createEdition"), /assertProjectReadyForEditorialProcessing/);
  assert.match(module, /imports: \[ProjectsModule\]/);
});

test("public portal and commerce guard approval without blocking preparation", () => {
  const portalService = readModule("public-portal", "public-portal.service.ts");
  const commerceService = readModule("commerce", "commerce.service.ts");

  assert.match(readMethod(portalService, "approveRelease"), /assertProjectReadyForEditorialProcessing/);
  assert.doesNotMatch(readMethod(portalService, "createCatalogItem"), /assertProjectReadyForEditorialProcessing/);
  assert.doesNotMatch(readMethod(portalService, "createDistributionRecord"), /assertProjectReadyForEditorialProcessing/);

  assert.match(readMethod(commerceService, "approveEdition"), /assertProjectReadyForEditorialProcessing/);
  assert.doesNotMatch(readMethod(commerceService, "createEdition"), /assertProjectReadyForEditorialProcessing/);
  assert.doesNotMatch(readMethod(commerceService, "createDistribution"), /assertProjectReadyForEditorialProcessing/);
});

test("multimedia guards approval and export while media localization guards approval only", () => {
  const multimedia = readModule("multimedia-creation", "multimedia-creation.service.ts");
  const localization = readModule("media-localization", "media-localization.service.ts");

  assert.match(readMethod(multimedia, "approveProject"), /assertProjectReadyForEditorialProcessing/);
  assert.match(readMethod(multimedia, "recordExport"), /assertProjectReadyForEditorialProcessing/);
  assert.doesNotMatch(readMethod(multimedia, "createProject"), /assertProjectReadyForEditorialProcessing/);
  assert.doesNotMatch(readMethod(multimedia, "addAsset"), /assertProjectReadyForEditorialProcessing/);

  assert.match(readMethod(localization, "approveProject"), /assertProjectReadyForEditorialProcessing/);
  assert.doesNotMatch(readMethod(localization, "createProject"), /assertProjectReadyForEditorialProcessing/);
  assert.doesNotMatch(readMethod(localization, "addAsset"), /assertProjectReadyForEditorialProcessing/);
});
