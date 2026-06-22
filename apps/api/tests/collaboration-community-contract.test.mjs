import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "collaboration");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
const requestContext = readFileSync(
  join(__dirname, "..", "src", "modules", "auth", "request-context.middleware.ts"),
  "utf8"
);
const runtimeDatabase = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "src", "runtime-database.ts"),
  "utf8"
);
const runtimeBackup = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "scripts", "runtime-backup-lib.mjs"),
  "utf8"
);
const backupRestoreTest = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "tests", "runtime-backup-restore.test.mjs"),
  "utf8"
);

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("collaboration and community module is registered with required endpoints", () => {
  const controller = readSource("collaboration.controller.ts");
  const moduleSource = readSource("collaboration.module.ts");

  assert.match(appModule, /CollaborationModule/);
  assert.match(moduleSource, /DatabaseCollaborationRepository/);
  assert.match(moduleSource, /CollaborationService/);
  assert.match(controller, /@Controller\("collaboration"\)/);
  assert.match(controller, /@Post\("threads"\)/);
  assert.match(controller, /@Get\("threads\/:id"\)/);
  assert.match(controller, /@Post\("threads\/:id\/comments"\)/);
  assert.match(controller, /@Post\("comments\/:id\/resolve"\)/);
  assert.match(controller, /@Controller\("community"\)/);
  assert.match(controller, /@Post\("reviews"\)/);
  assert.match(controller, /@Post\("comments"\)/);
  assert.match(controller, /@Post\("content\/:id\/approve"\)/);
  assert.match(controller, /@Post\("content\/:id\/reject"\)/);
  assert.match(controller, /@Post\("content\/:id\/flag"\)/);
  assert.match(controller, /@Controller\("public\/community"\)/);
  assert.match(controller, /@Get\("catalog-items\/:id\/reviews"\)/);
  assert.match(controller, /@Get\("catalog-items\/:id\/comments"\)/);
  assert.match(controller, /CurrentActor/);
});

test("public community read routes are public but mutation routes require authenticated context", () => {
  const controller = readSource("collaboration.controller.ts");
  const publicController = controller.slice(controller.indexOf("export class PublicCommunityController"));

  assert.match(requestContext, /method === "GET" && this\.isPublicCommunityRoute\(routePath\)/);
  assert.match(requestContext, /routePath\.startsWith\("\/public\/community\/catalog-items\/"\)/);
  assert.doesNotMatch(publicController, /CurrentActor/);
  assert.doesNotMatch(publicController, /AuthenticatedRequestContext/);
  assert.doesNotMatch(controller, /x-user-id|x-organization-id|x-user-roles/);
});

test("internal collaboration supports project document segment comments feedback notes mentions and threads", () => {
  const types = readSource("collaboration.types.ts");
  const service = readSource("collaboration.service.ts");

  for (const targetType of ["PROJECT", "DOCUMENT", "SEGMENT", "EDITORIAL_FEEDBACK", "REVIEWER_NOTE"]) {
    assert.match(types, new RegExp(`"${targetType}"`));
  }

  for (const field of [
    "projectId",
    "documentId",
    "segmentId",
    "mentionsPlaceholder",
    "PRIVATE_EDITORIAL",
    "REVIEWER_NOTE"
  ]) {
    assert.match(types, new RegExp(`${field}`));
    assert.match(service, new RegExp(`${field}`));
  }

  assert.match(service, /createThread/);
  assert.match(service, /addThreadComment/);
  assert.match(service, /resolveComment/);
});

test("public community reviews comments ratings and discussion threads start pending approval", () => {
  const types = readSource("collaboration.types.ts");
  const service = readSource("collaboration.service.ts");

  for (const field of ["CommunityReview", "CommunityComment", "rating", "threadTitle", "publicCatalogItemId"]) {
    assert.match(types, new RegExp(`${field}`));
  }

  assert.match(service, /createReview/);
  assert.match(service, /createCommunityComment/);
  assert.match(service, /moderationStatus: "PENDING_REVIEW"/);
  assert.match(service, /humanModerationRequired: true/);
});

test("moderation has flags status approval rejection and human final authority", () => {
  const types = readSource("collaboration.types.ts");
  const service = readSource("collaboration.service.ts");

  for (const status of ["PENDING_REVIEW", "APPROVED", "REJECTED", "FLAGGED"]) {
    assert.match(types, new RegExp(`"${status}"`));
  }

  assert.match(types, /CommunityFlag/);
  assert.match(types, /CommunityModerationEvent/);
  assert.match(service, /approveContent/);
  assert.match(service, /rejectContent/);
  assert.match(service, /flagContent/);
  assert.match(service, /this\.assertAuthorizedHuman\(actor\)/);
  assert.match(service, /humanFinalAuthority: true/);
  assert.match(service, /AI_MODERATION_SUGGESTED/);
  assert.doesNotMatch(service, /autoApprove|autoReject|autoRemove|realTime|websocket|sendEmail|smtp|slack|discord/i);
});

test("public endpoints only expose approved community content and never private editorial comments", () => {
  const repository = readSource("collaboration.repository.ts");
  const service = readSource("collaboration.service.ts");

  assert.match(repository, /listApprovedReviews/);
  assert.match(repository, /review\.moderationStatus === "APPROVED"/);
  assert.match(repository, /listApprovedComments/);
  assert.match(repository, /comment\.moderationStatus === "APPROVED"/);
  assert.doesNotMatch(repository, /listApprovedCollaboration|publicCollaboration/);
  assert.match(service, /privateEditorial/);
});

test("audit trail is preserved for collaboration community and moderation actions", () => {
  const repository = readSource("collaboration.repository.ts");
  const service = readSource("collaboration.service.ts");
  const types = readSource("collaboration.types.ts");

  assert.match(repository, /collaboration_audit_events/);
  assert.match(repository, /community_moderation_events/);
  assert.match(types, /CollaborationAuditEvent/);

  for (const action of [
    "COLLABORATION_THREAD_CREATED",
    "COLLABORATION_COMMENT_CREATED",
    "COLLABORATION_COMMENT_RESOLVED",
    "COMMUNITY_REVIEW_CREATED",
    "COMMUNITY_COMMENT_CREATED",
    "COMMUNITY_CONTENT_APPROVED",
    "COMMUNITY_CONTENT_REJECTED",
    "COMMUNITY_CONTENT_FLAGGED"
  ]) {
    assert.match(service, new RegExp(`${action}`));
  }
});

test("runtime persistence and backup include collaboration and community data", () => {
  for (const tableName of [
    "collaboration_threads",
    "collaboration_comments",
    "community_reviews",
    "community_comments",
    "community_flags",
    "community_moderation_events",
    "collaboration_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"threadId",\s*"collaboration_threads"/);
  assert.match(runtimeBackup, /"communityFlagId",\s*"community_flags"/);
  assert.match(backupRestoreTest, /collab-thread-a/);
  assert.match(backupRestoreTest, /community-review-a/);
});
