import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "workflow");

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("workflow controller exposes MVP API endpoints", () => {
  const source = readSource("workflow.controller.ts");

  assert.match(source, /@Post\("start"\)/);
  assert.match(source, /@Get\("status"\)/);
  assert.match(source, /@Post\("advance"\)/);
  assert.match(source, /@Post\("block"\)/);
  assert.match(source, /@Post\("unblock"\)/);
  assert.match(source, /@Post\("approve"\)/);
  assert.match(source, /@Post\("ready-for-export"\)/);
  assert.match(source, /@Post\("exported"\)/);
  assert.match(source, /CurrentActor/);
  assert.doesNotMatch(source, /x-user-id/);
  assert.doesNotMatch(source, /x-organization-id/);
  assert.doesNotMatch(source, /x-user-roles/);
});

test("workflow types include required statuses and document segment scope", () => {
  const source = readSource("workflow.types.ts");

  for (const status of [
    "DRAFT",
    "IN_TRANSLATION",
    "IN_QA",
    "IN_SEMANTIC_REVIEW",
    "IN_REVIEW",
    "APPROVED",
    "READY_FOR_EXPORT",
    "EXPORTED",
    "BLOCKED"
  ]) {
    assert.match(source, new RegExp(`"${status}"`));
  }

  assert.match(source, /"DOCUMENT"/);
  assert.match(source, /"SEGMENT"/);
});

test("workflow service defines required transition order", () => {
  const source = readSource("workflow.service.ts");

  for (const transition of [
    /DRAFT: "IN_TRANSLATION"/,
    /IN_TRANSLATION: "IN_QA"/,
    /IN_QA: "IN_SEMANTIC_REVIEW"/,
    /IN_SEMANTIC_REVIEW: "IN_REVIEW"/,
    /IN_REVIEW: "APPROVED"/,
    /APPROVED: "READY_FOR_EXPORT"/,
    /READY_FOR_EXPORT: "EXPORTED"/
  ]) {
    assert.match(source, transition);
  }
});

test("workflow service enforces QA and semantic blocking rules", () => {
  const source = readSource("workflow.service.ts");

  assert.match(source, /qaService\.listIssues/);
  assert.match(source, /Cannot move to IN_REVIEW if QA has unresolved HIGH or CRITICAL issues/);
  assert.match(source, /semanticFidelityService\.listIssues/);
  assert.match(source, /Cannot move to APPROVED if Semantic Fidelity has unresolved HIGH or CRITICAL issues/);
  assert.match(source, /\["HIGH", "CRITICAL"\]/);
});

test("workflow service enforces export gates", () => {
  const source = readSource("workflow.service.ts");

  assert.match(source, /Cannot move to READY_FOR_EXPORT unless document is APPROVED/);
  assert.match(source, /Cannot export unless status is READY_FOR_EXPORT/);
  assert.match(source, /assertDocumentWorkflow/);
});

test("workflow service preserves human final authority", () => {
  const source = readSource("workflow.service.ts");

  assert.match(source, /AI may suggest and validation engines may check, but only authorized human roles can approve/);
  assert.match(source, /HUMAN_APPROVAL_ROLES/);
  assert.match(source, /"ADMIN"/);
  assert.match(source, /"REVIEWER"/);
  assert.match(source, /assertAuthorizedHuman/);
});

test("workflow service records audit events for transitions and approvals", () => {
  const source = readSource("workflow.service.ts");

  for (const action of [
    "WORKFLOW_STARTED",
    "WORKFLOW_ADVANCED",
    "WORKFLOW_BLOCKED",
    "WORKFLOW_UNBLOCKED",
    "DOCUMENT_APPROVED",
    "READY_FOR_EXPORT",
    "DOCUMENT_EXPORTED"
  ]) {
    assert.match(source, new RegExp(`"${action}"`));
  }

  assert.match(source, /appendTransition/);
  assert.match(source, /appendAuditEvent/);
});

test("workflow module imports QA and Semantic Fidelity modules", () => {
  const source = readSource("workflow.module.ts");

  assert.match(source, /QaModule/);
  assert.match(source, /SemanticFidelityModule/);
});

test("workflow fixtures include required fields", () => {
  const fixtureDir = join(__dirname, "..", "fixtures");
  const startFixture = JSON.parse(readFileSync(join(fixtureDir, "workflow-v1.start.json"), "utf8"));
  const advanceFixture = JSON.parse(readFileSync(join(fixtureDir, "workflow-v1.advance.json"), "utf8"));
  const segmentFixture = JSON.parse(
    readFileSync(join(fixtureDir, "workflow-v1.segment-start.json"), "utf8")
  );

  assert.equal(typeof startFixture.documentId, "string");
  assert.equal(startFixture.scope, "DOCUMENT");
  assert.equal(typeof advanceFixture.toStatus, "string");
  assert.equal(typeof segmentFixture.segmentId, "string");
  assert.equal(segmentFixture.scope, "SEGMENT");
});
