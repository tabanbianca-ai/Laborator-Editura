import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const batchDir = join(repositoryRoot, "docs", "implementation", "execution-batches", "batch-08");

const requiredDocuments = [
  "overview.md",
  "audio-production-model.md",
  "audio-profiles.md",
  "narrator-registry.md",
  "ssml-pipeline.md",
  "tts-providers.md",
  "audio-segmentation.md",
  "transcripts.md",
  "video-production-model.md",
  "video-timeline.md",
  "subtitles.md",
  "audio-description.md",
  "video-rendering.md",
  "children-profile.md",
  "illustration-pipeline.md",
  "character-registry.md",
  "localized-image-text.md",
  "read-aloud.md",
  "multimedia-accessibility.md",
  "multimedia-rights.md",
  "multimedia-package.md",
  "cost-tracking.md",
  "test-evidence.md",
  "changed-files.md",
  "migration-plan.md",
  "rollback-plan.md",
  "compliance-report.md",
  "next-batch-proposal.md"
];

const multimediaTables = [
  "audio_productions",
  "audio_profiles",
  "narrator_profiles",
  "ssml_documents",
  "pronunciation_entries",
  "audio_segments",
  "audio_assemblies",
  "audio_outputs",
  "audio_transcripts",
  "video_productions",
  "video_profiles",
  "video_scenes",
  "multimedia_subtitle_tracks",
  "audio_descriptions",
  "video_builds",
  "multimedia_manifests",
  "children_profiles",
  "children_age_classifications",
  "illustration_assets",
  "ai_illustration_generations",
  "visual_identity_profiles",
  "character_registry",
  "localized_text_layers",
  "localized_image_derivatives",
  "text_audio_sync_segments",
  "multimedia_accessibility_reports",
  "multimedia_rights_validations",
  "music_sound_assets",
  "multimedia_packages",
  "multimedia_build_jobs",
  "multimedia_cost_records",
  "multimedia_observability_metrics",
  "multimedia_production_audit_events",
  "legacy_multimedia_resources"
];

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

function readBatchDocument(fileName) {
  return readRepositoryFile("docs", "implementation", "execution-batches", "batch-08", fileName);
}

test("Batch 08 required multimedia documentation deliverables exist", () => {
  for (const fileName of requiredDocuments) {
    const filePath = join(batchDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }
});

test("shared multimedia production contract models audio video children accessibility and package concepts", () => {
  const source = readRepositoryFile("packages", "shared", "src", "multimedia-production.ts");

  for (const symbol of [
    "MultimediaLineage",
    "AudioProduction",
    "AudioProfile",
    "NarratorProfile",
    "SsmlDocument",
    "PronunciationEntry",
    "TtsProviderContract",
    "AudioSegment",
    "AudioOutput",
    "Transcript",
    "VideoProduction",
    "VideoProfile",
    "VideoScene",
    "SubtitleTrack",
    "AudioDescription",
    "VideoBuild",
    "MultimediaManifest",
    "ChildrenProfile",
    "IllustrationAsset",
    "AiIllustrationGeneration",
    "VisualIdentityProfile",
    "CharacterRegistryEntry",
    "LocalizedTextLayer",
    "LocalizedImageDerivative",
    "TextAudioSyncSegment",
    "MultimediaAccessibilityReport",
    "MultimediaRightsValidation",
    "MusicSoundAsset",
    "MultimediaPackage",
    "MultimediaBuildJob",
    "MultimediaCostRecord",
    "MultimediaObservabilityMetric",
    "MultimediaAuditEvent",
    "LegacyMultimediaResource"
  ]) {
    assert.match(source, new RegExp(symbol), `${symbol} must be part of Batch 08`);
  }
});

test("multimedia safeguards block missing lineage consent rights accessibility and mutable approved outputs", () => {
  const source = readRepositoryFile("packages", "shared", "src", "multimedia-production.ts");

  for (const token of [
    "validateMultimediaLineage",
    "workId",
    "editionId",
    "masterDocumentVersionId",
    "publicationId",
    "sourceBlockIds",
    "rightsRecordIds",
    "CLONED_VOICE_CONSENT_REQUIRED",
    "voiceCloningAllowed !== true",
    "consentVerified !== true",
    "detectOutdatedAudioSegments",
    "canUseAudioOutputAsProductionMaster",
    "outputKind === \"AUDIO_MASTER\"",
    "PDF_EPUB_RIGHTS_NOT_MULTIMEDIA_RIGHTS",
    "VIDEO_CAPTIONS_REQUIRED",
    "AUDIO_TRANSCRIPT_REQUIRED",
    "AUDIO_DESCRIPTION_REQUIRED",
    "canApproveAiIllustration",
    "humanReview.status === \"APPROVED\"",
    "canModifyVideoBuild",
    "build.status !== \"APPROVED\"",
    "canApproveMultimediaPackage",
    "immutable === true"
  ]) {
    assert.match(source, new RegExp(token), `${token} must be represented`);
  }
});

test("runtime database and backup include Batch 08 multimedia tables", () => {
  const runtimeDatabase = readRepositoryFile("packages", "db", "src", "runtime-database.ts");
  const backupLibrary = readRepositoryFile("packages", "db", "scripts", "runtime-backup-lib.mjs");
  const inventory = readRepositoryFile(
    "docs",
    "implementation",
    "execution-batches",
    "batch-03",
    "data-store-inventory.md"
  );

  for (const tableName of multimediaTables) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`), `${tableName} must be a runtime table`);
    assert.match(backupLibrary, new RegExp(`"${tableName}"`), `${tableName} must be included in backup/restore`);
    assert.match(inventory, new RegExp(tableName), `${tableName} must be inventoried`);
  }

  for (const reference of [
    ["audio_productions", "publicationId", "publishing_publications"],
    ["audio_segments", "audioProductionId", "audio_productions"],
    ["video_productions", "videoProfileId", "video_profiles"],
    ["multimedia_subtitle_tracks", "videoProductionId", "video_productions"],
    ["audio_descriptions", "sceneId", "video_scenes"],
    ["illustration_assets", "rightsRecordId", "library_rights_records"],
    ["localized_image_derivatives", "localizedTextLayerId", "localized_text_layers"],
    ["text_audio_sync_segments", "audioSegmentId", "audio_segments"],
    ["multimedia_packages", "manifestId", "multimedia_manifests"]
  ]) {
    const referencePattern = new RegExp(reference.map((value) => `"${value}"`).join("[\\s\\S]*"));
    assert.match(runtimeDatabase, referencePattern, `${reference.join(" -> ")} must be tenant-validated`);
    assert.match(backupLibrary, referencePattern, `${reference.join(" -> ")} must be backup-validated`);
  }
});

test("Batch 08 reuses existing library publishing rights AI observability and multimedia surfaces", () => {
  const libraryTypes = readRepositoryFile("apps", "api", "src", "modules", "library", "library.types.ts");
  const publishingEngine = readRepositoryFile("packages", "shared", "src", "publishing-engine.ts");
  const rightsTypes = readRepositoryFile("apps", "api", "src", "modules", "rights-provenance", "rights-provenance.types.ts");
  const aiGovernanceTypes = readRepositoryFile("apps", "api", "src", "modules", "ai-governance", "ai-governance.types.ts");
  const observabilityTypes = readRepositoryFile("apps", "api", "src", "modules", "observability", "observability.types.ts");
  const multimediaCreationTypes = readRepositoryFile("apps", "api", "src", "modules", "multimedia-creation", "multimedia-creation.types.ts");
  const mediaLocalizationTypes = readRepositoryFile("apps", "api", "src", "modules", "media-localization", "media-localization.types.ts");

  assert.match(libraryTypes, /DigitalAssetRecord|LibraryPublicationRecord/);
  assert.match(publishingEngine, /PublicationPackage/);
  assert.match(rightsTypes, /PublishingAuthorization|ProvenanceRecord/);
  assert.match(aiGovernanceTypes, /AiUsageRecord|AiProviderStatus/);
  assert.match(observabilityTypes, /ObservabilityMetric|AgentExecution/);
  assert.match(multimediaCreationTypes, /MultimediaProject|MultimediaAsset/);
  assert.match(mediaLocalizationTypes, /MediaLocalizationProject|SubtitleLocalizationProfile/);
});

test("JSON Master exposes additive multimedia production extension points", () => {
  const types = readRepositoryFile("packages", "shared", "src", "json-master-format", "types.ts");
  const schema = readRepositoryFile("packages", "shared", "src", "json-master-format", "schema.ts");
  const validation = readRepositoryFile("packages", "shared", "src", "json-master-format", "validation.ts");

  for (const field of [
    "audioProductions",
    "audioProfiles",
    "narratorProfiles",
    "ssmlDocuments",
    "pronunciationEntries",
    "audioSegments",
    "audioOutputs",
    "transcripts",
    "videoProductions",
    "videoProfiles",
    "videoScenes",
    "multimediaSubtitleTracks",
    "audioDescriptions",
    "videoBuilds",
    "multimediaManifests",
    "childrenProfiles",
    "illustrationAssets",
    "aiIllustrationGenerations",
    "visualIdentityProfiles",
    "characterRegistry",
    "localizedTextLayers",
    "localizedImageDerivatives",
    "textAudioSyncSegments",
    "multimediaAccessibilityReports",
    "multimediaRightsValidations",
    "musicSoundAssets",
    "multimediaPackages",
    "multimediaBuildJobs",
    "multimediaCostRecords",
    "multimediaObservabilityMetrics",
    "multimediaAuditEvents",
    "legacyMultimediaResources"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`), `${field} must be typed`);
    assert.match(schema, new RegExp(`${field}:`), `${field} must be in schema`);
    assert.match(validation, new RegExp(`"${field}"`), `${field} must be validated`);
  }
});

test("Batch 08 reports preserve canonical source rights accessibility and legacy review rules", () => {
  const overview = readBatchDocument("overview.md");
  const narrator = readBatchDocument("narrator-registry.md");
  const rights = readBatchDocument("multimedia-rights.md");
  const accessibility = readBatchDocument("multimedia-accessibility.md");
  const packageDoc = readBatchDocument("multimedia-package.md");
  const migration = readBatchDocument("migration-plan.md");
  const compliance = readBatchDocument("compliance-report.md");

  assert.match(overview, /Approved Master Document -> Approved Edition -> Multimedia Production/);
  assert.match(overview, /do not create independent editorial copies/);
  assert.match(narrator, /Cloned voices require/);
  assert.match(rights, /PDF or EPUB rights do not automatically grant/);
  assert.match(accessibility, /audio requires transcript/);
  assert.match(accessibility, /video requires captions/);
  assert.match(packageDoc, /approved multimedia package is immutable/);
  assert.match(migration, /Unknown lineage, rights, consent, or accessibility status must be reviewed/);
  assert.match(compliance, /Cloned voice consent/);
});
