import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "multimedia-creation");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
const runtimeDatabase = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "src", "runtime-database.ts"),
  "utf8"
);
const runtimeBackup = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "scripts", "runtime-backup-lib.mjs"),
  "utf8"
);

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("multimedia creation agent is registered with authenticated endpoints", () => {
  const controller = readSource("multimedia-creation.controller.ts");
  const moduleSource = readSource("multimedia-creation.module.ts");

  assert.match(appModule, /MultimediaCreationModule/);
  assert.match(moduleSource, /DatabaseMultimediaRepository/);
  assert.match(moduleSource, /MultimediaCreationService/);
  assert.match(controller, /@Controller\("multimedia"\)/);
  assert.match(controller, /@Post\("projects"\)/);
  assert.match(controller, /@Get\("projects\/:id"\)/);
  assert.match(controller, /@Post\("projects\/:id\/assets"\)/);
  assert.match(controller, /@Post\("projects\/:id\/approve"\)/);
  assert.match(controller, /@Post\("projects\/:id\/reject"\)/);
  assert.match(controller, /@Post\("projects\/:id\/exports"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id/);
  assert.doesNotMatch(controller, /x-organization-id/);
});

test("multimedia creation supports illustration projects", () => {
  const service = readSource("multimedia-creation.service.ts");
  const types = readSource("multimedia-creation.types.ts");

  for (const field of [
    "bookIllustrations",
    "childrenBookIllustrations",
    "editorialIllustrations",
    "covers",
    "translatedTextReplacement",
    "visualConsistencyTracking",
    "stylePresets"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`));
  }

  assert.match(types, /"ILLUSTRATION"/);
  assert.match(service, /buildIllustrationProfile/);
  assert.match(service, /editorial-consistent/);
});

test("multimedia creation supports audio projects", () => {
  const service = readSource("multimedia-creation.service.ts");
  const types = readSource("multimedia-creation.types.ts");

  for (const field of [
    "chapterNarration",
    "audiobookMetadata",
    "voiceProfileIds",
    "synchronizedTextAudio",
    "exportTargets"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`));
  }

  assert.match(types, /"AUDIO"/);
  assert.match(types, /"MP3"/);
  assert.match(types, /"WAV"/);
  assert.match(types, /"FLAC"/);
  assert.match(service, /buildAudioProfile/);
});

test("multimedia creation supports video projects", () => {
  const service = readSource("multimedia-creation.service.ts");
  const types = readSource("multimedia-creation.types.ts");

  for (const field of [
    "bookTrailers",
    "educationalVideos",
    "reelsShorts",
    "subtitleTrackIds",
    "narrationSynchronization",
    "linkedAssetIds"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
  }

  assert.match(types, /"VIDEO"/);
  assert.match(service, /buildVideoProfile/);
});

test("multimedia creation supports media assets with rights source references and version history", () => {
  const repository = readSource("multimedia-creation.repository.ts");
  const service = readSource("multimedia-creation.service.ts");
  const types = readSource("multimedia-creation.types.ts");

  for (const field of [
    "assetType",
    "sourceReferences",
    "rights",
    "versionHistory",
    "metadata"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`));
  }

  assert.match(types, /"IMAGE"/);
  assert.match(types, /"SUBTITLE"/);
  assert.match(repository, /multimedia_assets/);
  assert.match(service, /addAsset/);
  assert.match(service, /MEDIA_ASSET_CREATED/);
});

test("multimedia creation preserves human final authority and blocks AI auto approval", () => {
  const service = readSource("multimedia-creation.service.ts");
  const types = readSource("multimedia-creation.types.ts");

  assert.match(types, /humanApprovalRequired: true/);
  assert.match(types, /approvalStatus: MultimediaApprovalStatus/);
  assert.match(types, /providerIntegrationStatus: "PLACEHOLDER_ONLY"/);
  assert.match(service, /humanApprovalRequired: true/);
  assert.match(service, /approvalStatus: "PENDING_HUMAN_APPROVAL"/);
  assert.match(service, /providerIntegrationStatus: "PLACEHOLDER_ONLY"/);
  assert.match(service, /assertAuthorizedHuman/);
  assert.match(service, /Only authorized humans may approve media for publication/);
  assert.match(service, /finalAuthority: "AUTHORIZED_HUMAN"/);
});

test("multimedia creation audit trail is preserved for creation revision approval rejection and export", () => {
  const repository = readSource("multimedia-creation.repository.ts");
  const service = readSource("multimedia-creation.service.ts");
  const types = readSource("multimedia-creation.types.ts");

  assert.match(repository, /multimedia_projects/);
  assert.match(repository, /multimedia_audit_events/);
  assert.match(types, /MultimediaAuditTrailItem/);
  assert.match(types, /MEDIA_PROJECT_CREATED/);
  assert.match(types, /MEDIA_REVISION_CREATED/);
  assert.match(types, /MEDIA_APPROVED/);
  assert.match(types, /MEDIA_REJECTED/);
  assert.match(types, /MEDIA_EXPORT_RECORDED/);
  assert.match(service, /auditTrail/);
  assert.match(service, /repository\.appendAuditEvent/);
});

test("runtime persistence and backup include multimedia data", () => {
  for (const tableName of [
    "multimedia_projects",
    "multimedia_assets",
    "multimedia_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
  }

  assert.match(runtimeDatabase, /"multimediaProjectId", "multimedia_projects"/);
  assert.match(runtimeBackup, /"multimediaProjectId", "multimedia_projects"/);
});
