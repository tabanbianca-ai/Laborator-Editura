#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const requiredEnvironment = [
  "SOURCE_COMMIT",
  "RELEASE_ARTIFACT_NAME",
  "RELEASE_ARTIFACT_PATH",
  "RELEASE_ARTIFACT_SHA256",
  "RELEASE_METADATA_PATH",
  "RELEASE_SBOM_PATH",
  "RUNTIME_IMAGE_BUNDLE_NAME",
  "RUNTIME_IMAGE_BUNDLE_PATH",
  "RUNTIME_METADATA_PATH",
  "PROVENANCE_PATH",
  "GITHUB_RUN_ID",
  "GITHUB_RUN_ATTEMPT",
  "GITHUB_WORKFLOW",
  "GITHUB_REPOSITORY",
  "GITHUB_SERVER_URL"
];

for (const name of requiredEnvironment) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const releaseMetadata = readJson(process.env.RELEASE_METADATA_PATH);
const runtimeMetadata = readJson(process.env.RUNTIME_METADATA_PATH);

assertFile(process.env.RELEASE_ARTIFACT_PATH);
assertFile(process.env.RELEASE_SBOM_PATH);
assertFile(process.env.RUNTIME_IMAGE_BUNDLE_PATH);

const actualArtifactSha256 = sha256File(process.env.RELEASE_ARTIFACT_PATH);
if (actualArtifactSha256 !== process.env.RELEASE_ARTIFACT_SHA256) {
  throw new Error("Release artifact SHA-256 does not match the approved workflow value");
}

if (releaseMetadata.source?.commit !== process.env.SOURCE_COMMIT) {
  throw new Error("Release metadata source commit does not match the checked-out commit");
}

if (runtimeMetadata.sourceCommit !== process.env.SOURCE_COMMIT) {
  throw new Error(
    "Runtime image metadata source commit does not match the checked-out commit"
  );
}

if (runtimeMetadata.artifactSha256 !== actualArtifactSha256) {
  throw new Error(
    "Runtime image metadata does not reference the verified release artifact"
  );
}

const provenance = {
  schemaVersion: "1.0",
  generatedAt: new Date().toISOString(),
  source: {
    repository: process.env.GITHUB_REPOSITORY,
    commit: process.env.SOURCE_COMMIT
  },
  githubActions: {
    workflow: process.env.GITHUB_WORKFLOW,
    runId: process.env.GITHUB_RUN_ID,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT,
    runUrl: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  },
  releaseArtifact: {
    actionsArtifactName: process.env.RELEASE_ARTIFACT_NAME,
    file: process.env.RELEASE_ARTIFACT_PATH,
    sha256: actualArtifactSha256,
    metadata: process.env.RELEASE_METADATA_PATH,
    sbom: process.env.RELEASE_SBOM_PATH,
    migrationVersion: releaseMetadata.database?.latestMigration
  },
  runtimeImages: {
    bundleArtifactName: process.env.RUNTIME_IMAGE_BUNDLE_NAME,
    bundleFile: process.env.RUNTIME_IMAGE_BUNDLE_PATH,
    bundleSha256: sha256File(process.env.RUNTIME_IMAGE_BUNDLE_PATH),
    metadata: process.env.RUNTIME_METADATA_PATH,
    apiImage: runtimeMetadata.apiImage,
    apiImageId: runtimeMetadata.apiImageId,
    webImage: runtimeMetadata.webImage,
    webImageId: runtimeMetadata.webImageId
  }
};

mkdirSync(dirname(process.env.PROVENANCE_PATH), { recursive: true });
writeFileSync(process.env.PROVENANCE_PATH, `${JSON.stringify(provenance, null, 2)}\n`);
console.log(
  JSON.stringify({ status: "ok", provenance: process.env.PROVENANCE_PATH }, null, 2)
);

function assertFile(path) {
  if (!existsSync(path)) {
    throw new Error(`Required provenance input does not exist: ${path}`);
  }
}

function readJson(path) {
  assertFile(path);
  return JSON.parse(readFileSync(path, "utf8"));
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}
