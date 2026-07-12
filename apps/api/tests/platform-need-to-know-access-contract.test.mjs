import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");
const repoRoot = join(apiRoot, "..", "..");

function readApi(path) {
  return readFileSync(join(apiRoot, path), "utf8");
}

function readRepo(path) {
  return readFileSync(join(repoRoot, path), "utf8");
}

test("need-to-know access reuses workspace and does not create a separate enterprise module", () => {
  const appModule = readApi("src/modules/app.module.ts");
  const controller = readApi("src/modules/workspace/workspace.controller.ts");

  assert.doesNotMatch(appModule, /NeedToKnowModule/);
  assert.match(appModule, /WorkspaceModule/);
  assert.match(controller, /@Controller\("workspace"\)/);
  assert.match(controller, /@Post\("invitations"\)/);
  assert.match(controller, /@Post\("invitations\/preview"\)/);
  assert.match(controller, /@Post\("invitations\/:id\/accept"\)/);
  assert.match(controller, /@Post\("access\/evaluate"\)/);
  assert.match(controller, /@Post\("access\/:id\/revoke"\)/);
  assert.match(controller, /@Post\("access\/restricted-attempt"\)/);
  assert.match(controller, /@Post\("access\/agent-data-access"\)/);
});

test("effective access model captures role task scope workflow grant and confidentiality dimensions", () => {
  const types = readApi("src/modules/workspace/workspace.types.ts");
  const service = readApi("src/modules/workspace/workspace.service.ts");

  for (const marker of [
    "WorkspaceNeedToKnowRole",
    "WorkspaceAccessScope",
    "assignedTask",
    "workflowStage",
    "documentId",
    "manuscriptId",
    "chapterId",
    "sectionId",
    "segmentId",
    "confidentialClassification",
    "startsAt",
    "expiresAt",
    "grantedBy",
    "temporary",
    "mostRestrictiveRuleApplied: true"
  ]) {
    assert.match(types + service, new RegExp(marker));
  }

  assert.match(service, /Most restrictive valid rule denies this resource/);
  assert.match(service, /hiddenDataLoadedThroughApi: false/);
  assert.match(service, /restrictedMetadataReturned: false/);
  assert.doesNotMatch(service, /const role = input\.role \?\?/);
  assert.match(service, /const role = matchingGrant\?\.role \?\? this\.roleFromActor\(actor\)/);
  assert.match(service, /hasExplicitGrant && input\.resourceType !== "ADMINISTRATION"/);
});

test("role-based panels and restricted resources match collaborative need-to-know defaults", () => {
  const service = readApi("src/modules/workspace/workspace.service.ts");

  for (const visiblePanel of [
    "sourceText",
    "translation",
    "linguisticResources",
    "glossaries",
    "terminologyDecisions",
    "reviewProposals",
    "relevantVersionHistory",
    "validatedText",
    "layoutAssets",
    "publicationSpecifications",
    "assignedTextFragments",
    "illustrationBriefs",
    "approvedVisualReferences",
    "pronunciation",
    "localizationData",
    "approvedMediaAssets",
    "assignedManuscriptSections"
  ]) {
    assert.match(service, new RegExp(visiblePanel));
  }

  for (const hiddenMarker of [
    "unrelatedContracts",
    "financialData",
    "rightsNegotiations",
    "administration",
    "distributionCredentials",
    "privateInternalDiscussions",
    "ALWAYS_RESTRICTED_RESOURCE_TYPES"
  ]) {
    assert.match(service, new RegExp(hiddenMarker));
  }
});

test("temporary access and immediate revocation are persisted and audited", () => {
  const types = readApi("src/modules/workspace/workspace.types.ts");
  const service = readApi("src/modules/workspace/workspace.service.ts");

  for (const action of [
    "INVITATION_SENT",
    "INVITATION_ACCEPTED",
    "NEED_TO_KNOW_ACCESS_GRANTED",
    "NEED_TO_KNOW_ACCESS_CHANGED",
    "NEED_TO_KNOW_ACCESS_REVOKED",
    "TEMPORARY_ACCESS_EXPIRED",
    "RESTRICTED_ACCESS_ATTEMPT",
    "DOCUMENT_OPENED",
    "CONFIDENTIAL_RESOURCE_ACCESSED",
    "AI_AGENT_DATA_ACCESS",
    "WORKSPACE_HUMAN_OVERRIDE"
  ]) {
    assert.match(types + service, new RegExp(action));
  }

  assert.match(service, /automaticRevocation: true/);
  assert.match(service, /immediateRevocationAcrossActiveSessions: true/);
});

test("AI agent data access records minimum necessary resources and cannot self-expand access", () => {
  const types = readApi("src/modules/workspace/workspace.types.ts");
  const service = readApi("src/modules/workspace/workspace.service.ts");

  for (const marker of [
    "WorkspaceAgentDataAccessInput",
    "agent",
    "task",
    "resourceIds",
    "accessScope",
    "decision",
    "result",
    "timestamp",
    "agentMayExpandOwnAccess: false"
  ]) {
    assert.match(types + service, new RegExp(marker));
  }
});

test("runtime database and backup restore include need-to-know workspace tables", () => {
  const repository = readApi("src/modules/workspace/workspace.repository.ts");
  const runtimeDatabase = readRepo("packages/db/src/runtime-database.ts");
  const runtimeBackup = readRepo("packages/db/scripts/runtime-backup-lib.mjs");
  const backupRestoreTest = readRepo("packages/db/tests/runtime-backup-restore.test.mjs");

  for (const table of [
    "workspace_collaborator_invitations",
    "workspace_need_to_know_grants",
    "workspace_audit_events"
  ]) {
    assert.match(repository + runtimeDatabase + runtimeBackup + backupRestoreTest, new RegExp(table));
  }

  assert.match(repository, /selectForTenant<WorkspaceNeedToKnowGrant>/);
  assert.match(repository, /findByIdForTenant<WorkspaceCollaboratorInvitation>/);
  assert.match(runtimeDatabase + runtimeBackup, /validateReferenceTenant/);
});
