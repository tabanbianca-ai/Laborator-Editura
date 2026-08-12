#!/usr/bin/env node
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const releaseCandidate = "1.0.0-rc.1";
const historicalBlocker01Commit = "c1b6958c0c8c92e3946addfcab48bc695962ca98";
const activeRc1Commit = "30b39ec0034f335bdbda210f09c8ad66a26a25a2";
const activeRc1ShortCommit = activeRc1Commit.slice(0, 7);
const activeRc1Sha256 = "9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e";
const forwardRehearsalCommit = "add6e73221d70fbc07d0f724a8322d5aa3b503d9";
const forwardRehearsalSha256 = "05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4";
const baselineApiImageId = "sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451";
const baselineWebImageId = "sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e";
const forwardApiImageId = "sha256:fb41892734fde36fe635add135eedafc24efefd93536a00c0ee20faad2cc0f7f";
const forwardWebImageId = "sha256:c5cbbfcdad5247eb3dd29576f5a350d96274b670a4fca62bead502c6ea70ba17";
const latestMigration = "0008_security_hardening_phase_1.sql";
const root = process.cwd();
const fullCommit = runGit(["rev-parse", "HEAD"]);
const artifactMetadataPath = findArtifactMetadata();
const artifactMetadata = JSON.parse(readFileSync(artifactMetadataPath, "utf8"));
const artifactPath = join(root, artifactMetadata.artifact.path);
const artifactBaseName = artifactMetadata.artifact.fileName.replace(/\.tar\.gz$/, "");
const checksumPath = `${artifactPath}.sha256`;
const sbomPath = join(root, "docs", "releases", "v1.0", "rc1-sbom.json");
const artifactDocPath = join(root, "docs", "releases", "v1.0", "rc1-artifact.md");
const provenancePath = join(root, "docs", "releases", "v1.0", "rc1-build-provenance.md");
const readinessPath = join(root, "docs", "releases", "v1.0", "rc1-readiness-report.md");
const defectRegisterPath = join(root, "docs", "releases", "v1.0", "rc1-defect-register.md");
const backupResultsPath = join(root, "docs", "releases", "v1.0", "rc1-backup-results.md");
const restoreResultsPath = join(root, "docs", "releases", "v1.0", "rc1-restore-results.md");
const rollbackBaselinePath = join(root, "docs", "releases", "v1.0", "rc1-rollback-baseline.md");
const rollbackRehearsalPath = join(root, "docs", "releases", "v1.0", "rc1-rollback-rehearsal.md");
const redeployValidationPath = join(root, "docs", "releases", "v1.0", "rc1-redeploy-validation.md");
const forwardCandidatePath = join(root, "docs", "releases", "v1.0", "rc1-forward-rehearsal-candidate.md");
const stagingDeploymentPath = join(root, "docs", "releases", "v1.0", "rc1-staging-deployment.md");
const stagingHealthPath = join(root, "docs", "releases", "v1.0", "rc1-staging-health.md");
const stagingSmokePath = join(root, "docs", "releases", "v1.0", "rc1-staging-smoke.md");
const monitoringPath = join(root, "docs", "releases", "v1.0", "rc1-monitoring-validation.md");
const pipelinePath = join(root, "docs", "releases", "v1.0", "rc1-pipeline-validation.md");
const finalReadinessPath = join(root, "docs", "releases", "v1.0", "rc1-final-readiness-gate.md");
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
  requireFile(readinessPath, "readiness report");
  requireFile(defectRegisterPath, "defect register");
  requireFile(backupResultsPath, "backup results");
  requireFile(restoreResultsPath, "restore results");
  requireFile(rollbackBaselinePath, "rollback baseline evidence");
  requireFile(rollbackRehearsalPath, "rollback rehearsal evidence");
  requireFile(redeployValidationPath, "redeploy validation evidence");
  requireFile(forwardCandidatePath, "forward rehearsal candidate evidence");
  requireFile(stagingDeploymentPath, "staging deployment evidence");
  requireFile(stagingHealthPath, "staging health evidence");
  requireFile(stagingSmokePath, "staging smoke evidence");
  requireFile(monitoringPath, "monitoring evidence");
  requireFile(pipelinePath, "pipeline validation evidence");
  requireFile(finalReadinessPath, "final readiness gate");

  if (issues.length === 0) {
    validateArtifactDigest();
    validateSbom();
    validateDocumentation();
    validateReleaseEvidence();
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
    artifactCertificationStatus: artifactCertificationStatus(),
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

  if (metadata.releaseCandidate !== releaseCandidate) {
    issues.push(`active artifact release candidate mismatch: ${metadata.releaseCandidate}`);
  }

  if (metadata.source?.commit !== activeRc1Commit) {
    issues.push(`active artifact source commit mismatch: ${metadata.source?.commit}`);
  }

  if (expectedDigest !== actualDigest) {
    issues.push(`artifact digest mismatch: metadata=${expectedDigest} actual=${actualDigest}`);
  }

  if (expectedDigest !== activeRc1Sha256) {
    issues.push("active artifact SHA-256 does not match approved RC1 digest");
  }

  if (!checksum.includes(actualDigest) || !checksum.includes(`${artifactBaseName}.tar.gz`)) {
    issues.push("artifact checksum file does not match artifact digest and filename");
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

  if (properties.get("laborator:artifact.path") !== metadata.artifact.path) {
    issues.push("SBOM artifact path does not match artifact metadata");
  }

  if (properties.get("laborator:artifact.sha256") !== metadata.artifact.sha256) {
    issues.push("SBOM artifact SHA-256 does not match artifact metadata");
  }

  if (properties.get("laborator:artifact.sourceCommit") !== metadata.source.commit) {
    issues.push("SBOM artifact source commit does not match artifact metadata");
  }

  const expectedArtifactStatus = artifactCertificationStatus();
  if (properties.get("laborator:artifact.certificationStatus") !== expectedArtifactStatus) {
    issues.push(`SBOM artifact certification status should be ${expectedArtifactStatus}`);
  }

  if (properties.get("laborator:sourceCommit") !== metadata.source.commit) {
    issues.push("SBOM source commit does not match artifact source commit");
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

function validateReleaseEvidence() {
  const readiness = readFileSync(readinessPath, "utf8");
  const defectRegister = readFileSync(defectRegisterPath, "utf8");
  const backupResults = readFileSync(backupResultsPath, "utf8");
  const restoreResults = readFileSync(restoreResultsPath, "utf8");
  const rollbackBaseline = readFileSync(rollbackBaselinePath, "utf8");
  const rollbackRehearsal = readFileSync(rollbackRehearsalPath, "utf8");
  const redeployValidation = readFileSync(redeployValidationPath, "utf8");
  const forwardCandidate = readFileSync(forwardCandidatePath, "utf8");
  const stagingDeployment = readFileSync(stagingDeploymentPath, "utf8");
  const stagingHealth = readFileSync(stagingHealthPath, "utf8");
  const stagingSmoke = readFileSync(stagingSmokePath, "utf8");
  const monitoring = readFileSync(monitoringPath, "utf8");
  const pipeline = readFileSync(pipelinePath, "utf8");
  const finalReadiness = readFileSync(finalReadinessPath, "utf8");

  requireTokens("readiness report", readiness, [
    "Status: RC1_CONDITIONAL_GO",
    "BLOCKER 05 STATUS: RESOLVED",
    "BLOCKER 06 STATUS: RESOLVED",
    "RC1 READINESS DECISION: CONDITIONAL_GO",
    activeRc1Commit,
    activeRc1Sha256,
    forwardRehearsalCommit,
    forwardRehearsalSha256,
    baselineApiImageId,
    baselineWebImageId,
    forwardApiImageId,
    forwardWebImageId,
    latestMigration
  ]);

  requireTokens("defect register", defectRegister, [
    "Status: OPEN_CRITICALS_NO_P0_BLOCKERS",
    "| RC1-P0-003 |",
    "| RC1-P0-004 |",
    "| RC1-P0-004 | P0 BLOCKER | Rollback | Confirmed resolved |",
    "0 open P0 blockers",
    activeRc1Commit,
    activeRc1Sha256,
    forwardRehearsalCommit,
    forwardRehearsalSha256,
    forwardApiImageId,
    forwardWebImageId
  ]);

  if (hasOpenP0(defectRegister)) {
    issues.push("defect register still has an OPEN P0 blocker");
  }

  requireTokens("backup results", backupResults, [
    "Status: VERIFIED",
    "/opt/laborator-backups/laborator-staging-20260811T101719Z.tar.gz",
    "STAGING_BACKUP = PASS",
    "BACKUP_CHECKSUM = PASS",
    "BACKUP_INTEGRITY = PASS"
  ]);

  requireTokens("restore results", restoreResults, [
    "Status: VERIFIED",
    "Isolated restore executed | PASS",
    "API healthy after restore | PASS",
    "Web healthy after restore | PASS"
  ]);

  requireTokens("rollback baseline", rollbackBaseline, [
    "Status: VERIFIED_BASELINE",
    activeRc1Commit,
    activeRc1Sha256,
    baselineApiImageId,
    baselineWebImageId,
    latestMigration
  ]);

  requireTokens("forward candidate", forwardCandidate, [
    "Status: VERIFIED_LIVE_REHEARSAL_COMPLETED",
    forwardRehearsalCommit,
    forwardRehearsalSha256,
    forwardApiImageId,
    forwardWebImageId,
    "30b39ec -> add6e73 -> 30b39ec -> add6e73",
    latestMigration
  ]);

  requireTokens("rollback rehearsal", rollbackRehearsal, [
    "Status: VERIFIED_LIVE",
    "ROLLBACK_EXECUTION | PASS",
    "ROLLBACK_HEALTH | PASS",
    "ROLLBACK_DATA_INTEGRITY | PASS",
    "DATA_LOSS | 0",
    activeRc1Commit,
    forwardRehearsalCommit,
    forwardApiImageId,
    forwardWebImageId
  ]);

  requireTokens("redeploy validation", redeployValidation, [
    "Status: VERIFIED_LIVE",
    "RC1_REDEPLOY | PASS",
    "RC1_ARTIFACT_DIGEST_MATCH | PASS",
    "POST_REDEPLOY_HEALTH | PASS",
    "POST_REDEPLOY_DATA_INTEGRITY | PASS",
    "STAGING_VALIDATION | PASS"
  ]);

  requireTokens("staging deployment", stagingDeployment, [
    "Status: VERIFIED_LIVE",
    "Digest match | PASS",
    "API image ID | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451`",
    "Web image ID | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e`"
  ]);

  requireTokens("staging health", stagingHealth, [
    "Status: VERIFIED_LIVE",
    "STAGING_CONTAINERS = HEALTHY",
    "WEB_HEALTH = PASS",
    "API_HEALTH = PASS",
    "RELEASE_IDENTITY_MATCH = PASS"
  ]);

  requireTokens("staging smoke", stagingSmoke, [
    "Status: VERIFIED_LIVE",
    "SMOKE_TESTS = PASS",
    "DATABASE_CONNECTIVITY = PASS",
    "projectIdentity"
  ]);

  requireTokens("monitoring validation", monitoring, [
    "Status: VERIFIED_LIVE",
    "MONITORING_VALIDATION = PASS",
    "RUNTIME_ERRORS_BLOCKING = 0"
  ]);

  requireTokens("pipeline validation", pipeline, [
    "Status: VERIFIED_LIVE",
    "STAGING_HEALTH_COMMAND = PASS",
    "STAGING_VALIDATE_COMMAND = PASS",
    "NO_SOURCE_REBUILD_OCCURRED = PASS"
  ]);

  requireTokens("final readiness gate", finalReadiness, [
    "BLOCKER 07 STATUS: RESOLVED",
    "RC1 READINESS DECISION: CONDITIONAL_GO",
    "Critical open defects: 5",
    "High open defects: 0"
  ]);
}

function requireFile(path, label) {
  if (!existsSync(path)) {
    issues.push(`missing ${label}: ${relativePath(path)}`);
  }
}

function findArtifactMetadata() {
  const releaseDir = join(root, "artifacts", "releases", "v1.0", "rc1");
  const activePath = join(releaseDir, `laborator-editura-${releaseCandidate}-${activeRc1ShortCommit}.artifact.json`);
  if (existsSync(activePath)) {
    return activePath;
  }

  const metadataFiles = readArtifactMetadataFiles(releaseDir);

  if (metadataFiles.length === 0) {
    throw new Error(`Artifact metadata not found in ${relativePath(releaseDir)}`);
  }

  return metadataFiles[0].path;
}

function readArtifactMetadataFiles(releaseDir) {
  return readdirSync(releaseDir)
    .filter((file) => file.startsWith(`laborator-editura-${releaseCandidate}-`) && file.endsWith(".artifact.json"))
    .map((file) => {
      const path = join(releaseDir, file);
      const metadata = JSON.parse(readFileSync(path, "utf8"));
      return {
        path,
        createdAt: metadata.artifact?.createdAt ?? "",
        releaseCandidate: metadata.releaseCandidate,
        sourceCommit: metadata.source?.commit
      };
    }).filter((metadata) => metadata.releaseCandidate === releaseCandidate && metadata.sourceCommit !== forwardRehearsalCommit)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function requireTokens(label, content, tokens) {
  for (const token of tokens) {
    if (!content.includes(token)) {
      issues.push(`${label} missing token: ${token}`);
    }
  }
}

function hasOpenP0(defectRegister) {
  return defectRegister
    .split("\n")
    .some((line) => line.startsWith("| RC1-P0-") && /\|\s*OPEN\s*\|$/.test(line));
}

function artifactCertificationStatus() {
  return artifactMetadata.source?.commit === historicalBlocker01Commit
    ? "historical-superseded"
    : "verified-current-rc1-artifact";
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
