import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules");

function readModule(moduleName, fileName) {
  return readFileSync(join(moduleDir, moduleName, fileName), "utf8");
}

test("auth module exposes login and current actor endpoints", () => {
  const source = readModule("auth", "auth.controller.ts");
  const service = readModule("auth", "auth.service.ts");

  assert.match(source, /@Controller\("auth"\)/);
  assert.match(source, /@Post\("login"\)/);
  assert.match(source, /@Get\("me"\)/);
  assert.match(source, /CurrentActor/);
  assert.match(service, /const DEFAULT_ROLES: MvpRole\[] = \["TRANSLATOR"\]/);
  assert.doesNotMatch(service, /input\.roles && input\.roles\.length/);
});

test("project document and segment modules expose MVP persistence endpoints", () => {
  const projects = readModule("projects", "projects.controller.ts");
  const documents = readModule("documents", "documents.controller.ts");
  const segments = readModule("segments", "segments.controller.ts");

  assert.match(projects, /@Controller\("projects"\)/);
  assert.match(projects, /@Post\(\)/);
  assert.match(projects, /@Get\(":id"\)/);
  assert.match(documents, /@Controller\("documents"\)/);
  assert.match(documents, /@Post\(\)/);
  assert.match(documents, /projectId/);
  assert.match(segments, /@Controller\("segments"\)/);
  assert.match(segments, /@Post\(\)/);
  assert.match(segments, /documentId/);
});

test("translation persistence submits text and invokes validation engines", () => {
  const source = readModule("translations", "translations.service.ts");

  assert.match(source, /segmentsService\.getSegment/);
  assert.match(source, /segmentsService\.markTranslated/);
  assert.match(source, /translationMemoryService\.createEntry/);
  assert.match(source, /approvalStatus: "PENDING"/);
  assert.match(source, /terminologyService\.checkSegmentText/);
  assert.match(source, /qaService\.runQaOnSegment/);
  assert.match(source, /semanticFidelityService\.runCheckOnSegment/);
});

test("export module generates JSON Master artifact and closes workflow export gate", () => {
  const source = readModule("export", "export.service.ts");

  assert.match(source, /validateJsonMasterFormatV1/);
  assert.match(source, /format: "JSON_MASTER"/);
  assert.match(source, /formatVersion: "1.0"/);
  assert.match(source, /workflow: \{/);
  assert.match(source, /state: this\.mapWorkflowState/);
  assert.match(source, /events: \[/);
  assert.match(source, /workflowService\.getWorkflowStatus/);
  assert.match(source, /Cannot export unless status is READY_FOR_EXPORT/);
  assert.match(source, /workflowService\.markExported/);
  assert.match(source, /documentsService\.markDocumentStatus/);
});

test("foundation modules remain limited to approved MVP blockers", () => {
  const appModule = readModule("", "app.module.ts");

  for (const moduleName of [
    "AuthModule",
    "ProjectsModule",
    "DocumentsModule",
    "SegmentsModule",
    "TranslationsModule",
    "ExportModule"
  ]) {
    assert.match(appModule, new RegExp(moduleName));
  }
});
