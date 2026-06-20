import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "media-localization");
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

test("media localization studio is registered with authenticated endpoints", () => {
  const controller = readSource("media-localization.controller.ts");
  const moduleSource = readSource("media-localization.module.ts");

  assert.match(appModule, /MediaLocalizationModule/);
  assert.match(moduleSource, /TranslationsModule/);
  assert.match(moduleSource, /LexicographicModule/);
  assert.match(moduleSource, /TerminologyModule/);
  assert.match(moduleSource, /SemanticFidelityModule/);
  assert.match(moduleSource, /MultimediaCreationModule/);
  assert.match(moduleSource, /LayoutPublishingModule/);
  assert.match(moduleSource, /DatabaseMediaLocalizationRepository/);
  assert.match(moduleSource, /MediaLocalizationService/);
  assert.match(controller, /@Controller\("media-localization"\)/);
  assert.match(controller, /@Post\("projects"\)/);
  assert.match(controller, /@Get\("projects\/:id"\)/);
  assert.match(controller, /@Post\("projects\/:id\/assets"\)/);
  assert.match(controller, /@Post\("projects\/:id\/approve"\)/);
  assert.match(controller, /@Post\("projects\/:id\/reject"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id/);
  assert.doesNotMatch(controller, /x-organization-id/);
});

test("image localization preserves text regions layout typography and localized versions", () => {
  const service = readSource("media-localization.service.ts");
  const types = readSource("media-localization.types.ts");

  for (const field of [
    "translatableTextRegions",
    "translatedTextReplacement",
    "preserveIllustrationLayout",
    "preserveTypographyStyle",
    "localizedImageVersions"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(types, /"IMAGE"/);
  assert.match(types, /"LOCALIZED_IMAGE"/);
});

test("subtitle localization supports multilingual subtitle tracks timing and caption styles", () => {
  const service = readSource("media-localization.service.ts");
  const types = readSource("media-localization.types.ts");

  for (const field of [
    "subtitleTracks",
    "multilingualSubtitles",
    "timingMetadata",
    "captionStyles"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(types, /"SUBTITLE"/);
  assert.match(types, /"SUBTITLE_TRACK"/);
});

test("voice-over and dubbing metadata includes tracks narrator profiles and synchronization", () => {
  const service = readSource("media-localization.service.ts");
  const types = readSource("media-localization.types.ts");

  for (const field of [
    "voiceTracks",
    "dubbingProjects",
    "narratorProfiles",
    "synchronizationMetadata"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(types, /"VOICE_OVER"/);
  assert.match(types, /"DUBBING"/);
  assert.match(types, /"VOICE_TRACK"/);
  assert.match(types, /"DUBBING_TRACK"/);
});

test("video localization supports localized videos captions and multilingual audio tracks", () => {
  const service = readSource("media-localization.service.ts");
  const types = readSource("media-localization.types.ts");

  for (const field of [
    "localizedVideos",
    "localizedCaptions",
    "multilingualAudioTracks"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(types, /"VIDEO"/);
  assert.match(types, /"LOCALIZED_VIDEO"/);
  assert.match(types, /"LOCALIZED_AUDIO"/);
});

test("localization QA includes terminology lexicographic semantic and editorial support", () => {
  const service = readSource("media-localization.service.ts");
  const types = readSource("media-localization.types.ts");

  for (const field of [
    "terminologyValidation",
    "lexicographicSupport",
    "semanticFidelity",
    "editorialDecisionSupport",
    "terminologyRefs",
    "lexicographicRefs",
    "semanticReportRefs",
    "editorialDecisionRefs"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(types, /glossaryPrecedence: "VALIDATED_GLOSSARY_OVER_MEDIA_AI"/);
  assert.match(service, /glossaryPrecedence: "VALIDATED_GLOSSARY_OVER_MEDIA_AI"/);
});

test("media localization preserves human final authority and blocks AI auto approval", () => {
  const service = readSource("media-localization.service.ts");
  const types = readSource("media-localization.types.ts");

  assert.match(types, /humanApprovalRequired: true/);
  assert.match(types, /approvalStatus: MediaLocalizationApprovalStatus/);
  assert.match(types, /providerIntegrationStatus: "PLACEHOLDER_ONLY"/);
  assert.match(service, /humanApprovalRequired: true/);
  assert.match(service, /approvalStatus: "PENDING_HUMAN_APPROVAL"/);
  assert.match(service, /providerIntegrationStatus: "PLACEHOLDER_ONLY"/);
  assert.match(service, /assertAuthorizedHuman/);
  assert.match(service, /Only authorized humans may approve media localization for publication/);
  assert.match(service, /finalAuthority: "AUTHORIZED_HUMAN"/);
});

test("media localization audit trail is preserved for project asset revision approval and rejection", () => {
  const repository = readSource("media-localization.repository.ts");
  const service = readSource("media-localization.service.ts");
  const types = readSource("media-localization.types.ts");

  assert.match(repository, /media_localization_projects/);
  assert.match(repository, /media_localization_assets/);
  assert.match(repository, /media_localization_audit_events/);
  assert.match(types, /MediaLocalizationAuditTrailItem/);
  assert.match(types, /MEDIA_LOCALIZATION_PROJECT_CREATED/);
  assert.match(types, /MEDIA_LOCALIZATION_ASSET_CREATED/);
  assert.match(types, /MEDIA_LOCALIZATION_REVISION_CREATED/);
  assert.match(types, /MEDIA_LOCALIZATION_APPROVED/);
  assert.match(types, /MEDIA_LOCALIZATION_REJECTED/);
  assert.match(service, /auditTrail/);
  assert.match(service, /repository\.appendAuditEvent/);
});

test("media localization remains provider-free backend scaffolding", () => {
  const service = readSource("media-localization.service.ts");

  assert.match(service, /PLACEHOLDER_ONLY/);
  assert.match(service, /aiMayLocalize: true/);
  assert.match(service, /aiMaySynchronize: true/);
  assert.match(service, /aiMaySuggestAdaptations: true/);
  assert.doesNotMatch(service, /openai/i);
  assert.doesNotMatch(service, /googleapis/);
  assert.doesNotMatch(service, /ffmpeg/);
  assert.doesNotMatch(service, /child_process/);
});

test("runtime persistence and backup include media localization data", () => {
  for (const tableName of [
    "media_localization_projects",
    "media_localization_assets",
    "media_localization_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
  }

  assert.match(runtimeDatabase, /"mediaLocalizationProjectId"/);
  assert.match(runtimeBackup, /"mediaLocalizationAssetId"/);
});
