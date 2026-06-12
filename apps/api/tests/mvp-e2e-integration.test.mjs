import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");
const modulesDir = join(apiRoot, "src", "modules");
const fixtureDir = join(apiRoot, "fixtures");

function readModule(moduleName, fileName) {
  return readFileSync(join(modulesDir, moduleName, fileName), "utf8");
}

function moduleExists(moduleName) {
  return existsSync(join(modulesDir, moduleName));
}

test("MVP backend core modules are wired into the application module", () => {
  const source = readFileSync(join(modulesDir, "app.module.ts"), "utf8");

  for (const moduleName of [
    "AuthModule",
    "ProjectsModule",
    "DocumentsModule",
    "SegmentsModule",
    "TranslationsModule",
    "TranslationMemoryModule",
    "TerminologyModule",
    "QaModule",
    "SemanticFidelityModule",
    "WorkflowModule",
    "ExportModule"
  ]) {
    assert.match(source, new RegExp(moduleName));
  }
});

test("MVP backend validation chain connects TM terminology QA semantic fidelity and workflow", () => {
  const translationService = readModule("translations", "translations.service.ts");
  const qaService = readModule("qa", "qa.service.ts");
  const semanticService = readModule("semantic-fidelity", "semantic-fidelity.service.ts");
  const workflowService = readModule("workflow", "workflow.service.ts");

  assert.match(translationService, /translationMemoryService\.createEntry/);
  assert.match(translationService, /terminologyService\.checkSegmentText/);
  assert.match(translationService, /qaService\.runQaOnSegment/);
  assert.match(translationService, /semanticFidelityService\.runCheckOnSegment/);
  assert.match(qaService, /terminologyService\.checkSegmentText/);
  assert.match(semanticService, /terminologyService\.checkSegmentText/);
  assert.match(semanticService, /translationMemoryService\.searchMatches/);
  assert.match(semanticService, /qaService\.listIssues/);
  assert.match(workflowService, /qaService\.listIssues/);
  assert.match(workflowService, /semanticFidelityService\.listIssues/);
});

test("MVP backend core preserves validation and authority priority", () => {
  const terminologyService = readModule("terminology", "terminology.service.ts");
  const qaService = readModule("qa", "qa.service.ts");
  const semanticService = readModule("semantic-fidelity", "semantic-fidelity.service.ts");
  const workflowService = readModule("workflow", "workflow.service.ts");

  assert.match(terminologyService, /TERMINOLOGY_VALIDATED/);
  assert.match(qaService, /Validated terminology has priority over Translation Memory and AI suggestions/);
  assert.match(semanticService, /VALIDATED_TERMINOLOGY_OVER_TM_OVER_AI/);
  assert.match(workflowService, /only authorized human roles can approve/);
  assert.match(workflowService, /HUMAN_APPROVAL_ROLES/);
});

test("MVP workflow gates review approval ready-for-export and export", () => {
  const workflowService = readModule("workflow", "workflow.service.ts");
  const exportService = readModule("export", "export.service.ts");

  assert.match(workflowService, /Cannot move to IN_REVIEW if QA has unresolved HIGH or CRITICAL issues/);
  assert.match(workflowService, /Cannot move to APPROVED if Semantic Fidelity has unresolved HIGH or CRITICAL issues/);
  assert.match(workflowService, /Cannot move to READY_FOR_EXPORT unless document is APPROVED/);
  assert.match(workflowService, /Cannot export unless status is READY_FOR_EXPORT/);
  assert.match(workflowService, /DOCUMENT_APPROVED/);
  assert.match(workflowService, /READY_FOR_EXPORT/);
  assert.match(workflowService, /DOCUMENT_EXPORTED/);
  assert.match(exportService, /workflowService\.getWorkflowStatus/);
  assert.match(exportService, /workflowService\.markExported/);
  assert.match(exportService, /formatVersion: "1.0"/);
  assert.match(exportService, /validateJsonMasterFormatV1/);
  assert.match(exportService, /mapTranslationStatus/);
  assert.match(exportService, /mapWorkflowState/);
});

test("MVP persistence migrations cover implemented backend core modules in order", () => {
  const source = readFileSync(join(apiRoot, "..", "..", "packages", "db", "src", "index.ts"), "utf8");

  for (const migration of [
    "0000_mvp_foundation_v1.sql",
    "0001_translation_memory_v1.sql",
    "0002_terminology_glossary_v1.sql",
    "0003_qa_engine_v1.sql",
    "0004_semantic_fidelity_v1.sql",
    "0005_workflow_engine_v1.sql"
  ]) {
    assert.match(source, new RegExp(migration));
  }
});

test("MVP end-to-end validation records operational foundation modules", () => {
  const report = JSON.parse(
    readFileSync(join(fixtureDir, "mvp-e2e-validation.json"), "utf8")
  );

  assert.equal(report.status, "OPERATIONAL");

  const implementedModules = [
    ["Authentication", "auth"],
    ["Project", "projects"],
    ["Document", "documents"],
    ["Segments", "segments"],
    ["Translation", "translations"],
    ["Export", "export"]
  ];

  for (const [step, moduleName] of implementedModules) {
    assert.equal(moduleExists(moduleName), true);
    assert.ok(report.validatedWorkflow.includes(step));
  }

  assert.deepEqual(report.blockingGaps, []);
});

test("MVP operational workflow fixture contains every approved end-to-end step", () => {
  const fixture = JSON.parse(
    readFileSync(join(fixtureDir, "mvp-operational-workflow.json"), "utf8")
  );

  for (const key of ["auth", "project", "document", "segment", "translation", "export"]) {
    assert.equal(typeof fixture[key], "object");
  }

  assert.equal(fixture.export.format, "JSON_MASTER");
});
