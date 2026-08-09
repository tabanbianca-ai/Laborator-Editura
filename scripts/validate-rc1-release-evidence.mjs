#!/usr/bin/env node
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const releaseCandidate = "1.0.0-rc.1";
const root = process.cwd();
const shortCommit = runGit(["rev-parse", "--short", "HEAD"]);
const fullCommit = runGit(["rev-parse", "HEAD"]);
const artifactMetadataPath = findArtifactMetadata();
const artifactMetadata = JSON.parse(readFileSync(artifactMetadataPath, "utf8"));
const artifactPath = join(root, artifactMetadata.artifact.path);
const artifactBaseName = artifactMetadata.artifact.fileName.replace(/\.tar\.gz$/, "");
const checksumPath = `${artifactPath}.sha256`;
const sbomPath = join(root, "docs", "releases", "v1.0", "rc1-sbom.json");
const artifactDocPath = join(root, "docs", "releases", "v1.0", "rc1-artifact.md");
const provenancePath = join(root, "docs", "releases", "v1.0", "rc1-build-provenance.md");
const lockfilePath = join(root, "pnpm-lock.yaml");
const issues = [];

main();

function main() {
  requireFile(artifactPath, "artifact");
  requireFile(checksumPath, "artifact checksum");
  requireFile(artifactMetadataPath, "artifact metadata");
  requireFile(sbomPath, "SBOM");
  requireFile(artifactDocPath, "artifact documentation");
  requireFile(provenancePath, "build provenance");

  if (issues.length === 0) {
    validateArtifactDigest();
    validateSbom();
    validateDocumentation();
  }

  if (issues.length > 0) {
    console.error(JSON.stringify({
      status: "failed",
      releaseCandidate,
      issues
    }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({
    status: "ok",
    releaseCandidate,
    artifact: relativePath(artifactPath),
    sha256: sha256File(artifactPath),
    artifactCertificationStatus: artifactMetadata.source?.commit === fullCommit ? "verified-current-source" : "superseded-for-certification",
    sbom: relativePath(sbomPath),
    provenance: relativePath(provenancePath),
    sourceCommit: fullCommit
  }, null, 2));
}

function validateArtifactDigest() {
  const metadata = artifactMetadata;
  const expectedDigest = metadata.artifact?.sha256;
  const actualDigest = sha256File(artifactPath);
  const checksum = readFileSync(checksumPath, "utf8");

  if (expectedDigest !== actualDigest) {
    issues.push(`artifact digest mismatch: metadata=${expectedDigest} actual=${actualDigest}`);
  }

  if (!checksum.includes(actualDigest) || !checksum.includes(`${artifactBaseName}.tar.gz`)) {
    issues.push("artifact checksum file does not match artifact digest and filename");
  }

  if (metadata.source?.commit !== fullCommit && !isPreviousArtifactMarkedSuperseded()) {
    issues.push("artifact metadata belongs to a previous source commit and the SBOM does not mark it superseded for certification");
  }

  if (metadata.artifact?.path !== relativePath(artifactPath)) {
    issues.push("artifact metadata path does not match expected artifact path");
  }
}

function validateSbom() {
  const metadata = artifactMetadata;
  const sbom = JSON.parse(readFileSync(sbomPath, "utf8"));
  const properties = new Map((sbom.metadata?.properties ?? []).map((property) => [property.name, property.value]));

  if (sbom.bomFormat !== "CycloneDX") {
    issues.push("SBOM is not CycloneDX");
  }

  if (!Array.isArray(sbom.components) || sbom.components.length === 0) {
    issues.push("SBOM has no components");
  }

  if (properties.get("laborator:sourceCommit") !== fullCommit) {
    issues.push("SBOM source commit does not match current commit");
  }

  if (properties.get("laborator:artifact.path") !== metadata.artifact.path) {
    issues.push("SBOM artifact path does not match artifact metadata");
  }

  if (properties.get("laborator:artifact.sha256") !== metadata.artifact.sha256) {
    issues.push("SBOM artifact SHA-256 does not match artifact metadata");
  }

  if (properties.get("laborator:artifact.sourceCommit") !== metadata.source.commit) {
    issues.push("SBOM artifact source commit does not match artifact metadata");
  }

  const expectedArtifactStatus = metadata.source.commit === fullCommit
    ? "verified-current-source"
    : "superseded-for-certification";
  if (properties.get("laborator:artifact.certificationStatus") !== expectedArtifactStatus) {
    issues.push(`SBOM artifact certification status should be ${expectedArtifactStatus}`);
  }

  if (!existsSync(lockfilePath)) {
    issues.push("pnpm-lock.yaml is missing");
    return;
  }

  if (properties.get("laborator:lockfile.status") !== "present") {
    issues.push("SBOM does not record lockfile presence");
  }

  if (properties.get("laborator:lockfile.path") !== "pnpm-lock.yaml") {
    issues.push("SBOM does not record the canonical lockfile path");
  }

  const lockfileDigest = sha256File(lockfilePath);
  if (properties.get("laborator:lockfile.sha256") !== lockfileDigest) {
    issues.push("SBOM lockfile SHA-256 does not match pnpm-lock.yaml");
  }
}

function validateDocumentation() {
  const metadata = JSON.parse(readFileSync(artifactMetadataPath, "utf8"));
  const artifactDoc = readFileSync(artifactDocPath, "utf8");
  const provenance = readFileSync(provenancePath, "utf8");

  const requiredArtifactDocTokens = [
    "RC1_ARTIFACT = VERIFIED",
    "ARTIFACT_IMMUTABILITY = VERIFIED",
    "SHA256_DIGEST = VERIFIED",
    "SBOM = GENERATED_AND_LINKED",
    "BUILD_PROVENANCE = VERIFIED",
    "SOURCE_COMMIT = VERIFIED",
    "RELEASE_VALIDATION = PASS",
    metadata.artifact.path,
    metadata.artifact.sha256,
    metadata.source.commit
  ];

  for (const token of requiredArtifactDocTokens) {
    if (!artifactDoc.includes(token)) {
      issues.push(`artifact documentation missing token: ${token}`);
    }
  }

  const requiredProvenanceTokens = [
    "BUILD_PROVENANCE = VERIFIED",
    metadata.artifact.path,
    metadata.artifact.sha256,
    "docs/releases/v1.0/rc1-sbom.json",
    metadata.source.commit
  ];

  for (const token of requiredProvenanceTokens) {
    if (!provenance.includes(token)) {
      issues.push(`build provenance missing token: ${token}`);
    }
  }
}

function requireFile(path, label) {
  if (!existsSync(path)) {
    issues.push(`missing ${label}: ${relativePath(path)}`);
  }
}

function findArtifactMetadata() {
  const releaseDir = join(root, "artifacts", "releases", "v1.0", "rc1");
  const currentPath = join(releaseDir, `laborator-editura-${releaseCandidate}-${shortCommit}.artifact.json`);
  if (existsSync(currentPath)) {
    return currentPath;
  }

  const metadataFiles = readdirSync(releaseDir)
    .filter((file) => file.startsWith(`laborator-editura-${releaseCandidate}-`) && file.endsWith(".artifact.json"))
    .sort();

  if (metadataFiles.length !== 1) {
    throw new Error(`Artifact metadata not found for current commit and no unique historical artifact metadata is available in ${relativePath(releaseDir)}`);
  }

  return join(releaseDir, metadataFiles[0]);
}

function isPreviousArtifactMarkedSuperseded() {
  if (!existsSync(sbomPath)) {
    return false;
  }

  const sbom = JSON.parse(readFileSync(sbomPath, "utf8"));
  const properties = new Map((sbom.metadata?.properties ?? []).map((property) => [property.name, property.value]));
  return properties.get("laborator:artifact.certificationStatus") === "superseded-for-certification";
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function runGit(args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  }
  return result.stdout.trim();
}

function relativePath(path) {
  return path.replace(`${root}/`, "");
}
