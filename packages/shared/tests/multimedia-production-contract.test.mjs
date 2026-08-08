import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");

function readSource(relativePath) {
  return readFileSync(join(packageRoot, "src", relativePath), "utf8");
}

test("multimedia production contract defines audio video children accessibility and rights models", () => {
  const source = readSource("multimedia-production.ts");

  for (const symbol of [
    "MultimediaLineage",
    "AudioProduction",
    "AudioProfile",
    "NarratorProfile",
    "SsmlDocument",
    "PronunciationEntry",
    "TtsProviderContract",
    "AudioSegment",
    "AudioAssembly",
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
    "MultimediaRightsValidation",
    "MusicSoundAsset",
    "MultimediaAccessibilityReport",
    "MultimediaPackage",
    "MultimediaBuildJob",
    "MultimediaCostRecord",
    "MultimediaObservabilityMetric",
    "MultimediaAuditEvent",
    "LegacyMultimediaResource"
  ]) {
    assert.match(source, new RegExp(symbol), `${symbol} must be defined`);
  }
});

test("multimedia lineage and cloned voice consent are blocking gates", async () => {
  const module = await import("../dist/multimedia-production.js");

  assert.equal(
    module.validateMultimediaLineage({
      workId: "work-1",
      editionId: "edition-1",
      masterDocumentVersionId: "master-v1",
      publicationId: "publication-1",
      sourceBlockIds: ["block-1"],
      generatorOrCreator: "audio-agent",
      profileVersion: "audio-profile-v1",
      rightsRecordIds: ["rights-1"]
    }).valid,
    true
  );

  const invalidLineage = module.validateMultimediaLineage({
    workId: "work-1",
    editionId: "edition-1",
    publicationId: "publication-1",
    sourceBlockIds: [],
    generatorOrCreator: "audio-agent",
    profileVersion: "audio-profile-v1",
    rightsRecordIds: []
  });

  assert.equal(invalidLineage.valid, false);
  assert.equal(invalidLineage.status, "BLOCKED");

  assert.equal(
    module.canUseNarratorProfile({
      narratorType: "CLONED_VOICE",
      status: "ACTIVE",
      voiceCloningAllowed: true,
      consentVerified: false
    }),
    false
  );

  assert.equal(
    module.canUseNarratorProfile({
      narratorType: "CLONED_VOICE",
      status: "ACTIVE",
      voiceCloningAllowed: true,
      consentVerified: true
    }),
    true
  );
});

test("audio segments detect outdated source changes and distribution output cannot become master", async () => {
  const module = await import("../dist/multimedia-production.js");
  const currentHashes = {
    "block-1": "hash-a",
    "block-2": "hash-b2"
  };

  assert.deepEqual(
    module.detectOutdatedAudioSegments(
      [
        {
          id: "segment-1",
          sourceBlockIds: ["block-1"],
          textHash: module.createSourceBlockTextHash(currentHashes, ["block-1"])
        },
        {
          id: "segment-2",
          sourceBlockIds: ["block-2"],
          textHash: "block-2:old-hash"
        }
      ],
      currentHashes
    ),
    ["segment-2"]
  );

  assert.equal(
    module.canUseAudioOutputAsProductionMaster({
      outputKind: "DISTRIBUTION_MP3",
      derivedDistributionOutput: true
    }),
    false
  );
  assert.equal(
    module.canUseAudioOutputAsProductionMaster({
      outputKind: "AUDIO_MASTER",
      derivedDistributionOutput: false
    }),
    true
  );
});

test("subtitle and multimedia accessibility gates block missing required accessible assets", async () => {
  const module = await import("../dist/multimedia-production.js");

  const subtitleResult = module.validateSubtitleTrack({
    language: "en",
    segments: [
      { id: "caption-1", startTime: 2, endTime: 1, text: "Invalid" },
      { id: "caption-2", startTime: 0, endTime: 1, text: "Valid caption" }
    ]
  });

  assert.equal(subtitleResult.valid, false);
  assert.match(subtitleResult.issues.map((issue) => issue.code).join(","), /INVALID_SUBTITLE_TIMING/);

  assert.equal(
    module.evaluateMultimediaAccessibilityGate({
      assetKind: "AUDIO",
      transcriptAvailable: false,
      keyboardAccessible: true,
      screenReaderCompatible: true
    }).valid,
    false
  );

  assert.equal(
    module.evaluateMultimediaAccessibilityGate({
      assetKind: "VIDEO",
      captionsAvailable: true,
      visualInformationCritical: true,
      audioDescriptionAvailable: false,
      keyboardAccessible: true,
      screenReaderCompatible: true
    }).valid,
    false
  );
});

test("rights AI illustration approval immutable package and legacy classification are governed", async () => {
  const module = await import("../dist/multimedia-production.js");

  assert.equal(
    module.evaluateMultimediaRights({
      requiredRights: ["AUDIO"],
      grantedRights: [],
      pdfOrEpubRightsOnly: true
    }).valid,
    false
  );

  assert.equal(
    module.canApproveAiIllustration({
      rightsStatus: "PASS",
      humanReview: { required: true, status: "PENDING" }
    }),
    false
  );
  assert.equal(
    module.canApproveAiIllustration({
      rightsStatus: "PASS",
      humanReview: { required: true, status: "APPROVED" }
    }),
    true
  );

  assert.equal(module.canModifyVideoBuild({ immutable: true, status: "APPROVED" }), false);

  assert.equal(
    module.classifyLegacyMultimediaResource({
      sourceVersionKnown: false,
      rightsKnown: true,
      accessibilityKnown: true
    }),
    "SOURCE_VERSION_UNKNOWN"
  );

  assert.equal(
    module.canApproveMultimediaPackage(
      {
        status: "APPROVED",
        immutable: true,
        checksums: ["sha256:abc"]
      },
      { valid: true, status: "PASS", issues: [] },
      { valid: true, status: "PASS", issues: [] },
      { valid: true, status: "PASS", issues: [] }
    ),
    true
  );
});

test("JSON Master and package exports expose multimedia production extensions", () => {
  const types = readSource("json-master-format/types.ts");
  const schema = readSource("json-master-format/schema.ts");
  const validation = readSource("json-master-format/validation.ts");
  const index = readSource("index.ts");
  const packageJson = readFileSync(join(packageRoot, "package.json"), "utf8");
  const rewrite = readFileSync(join(packageRoot, "scripts", "ensure-esm-file-exports.mjs"), "utf8");

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

  assert.match(index, /export \* from "\.\/multimedia-production"/);
  assert.match(packageJson, /"\.\/multimedia-production"/);
  assert.match(rewrite, /multimedia-production\.js/);
});
