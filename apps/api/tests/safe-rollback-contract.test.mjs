import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const rollbackScript = join(
  repositoryRoot,
  "infrastructure",
  "deploy",
  "rollback-staging-artifact.sh"
);
const artifactPath = join(
  repositoryRoot,
  "artifacts",
  "releases",
  "v1.0",
  "rc1",
  "laborator-editura-1.0.0-rc.1-30b39ec.tar.gz"
);
const composePath = join(
  repositoryRoot,
  "deploy",
  "staging",
  "docker-compose.artifact.yml"
);
const envPath = join(repositoryRoot, "deploy", "staging", ".env.staging.example");
const configPath = join(
  repositoryRoot,
  "infrastructure",
  "backup",
  "laborator-backup.env.example"
);

const artifactSha256 = "9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e";
const sourceCommit = "30b39ec0034f335bdbda210f09c8ad66a26a25a2";
const currentSourceCommit = "add6e73221d70fbc07d0f724a8322d5aa3b503d9";
const migrationVersion = "0008_security_hardening_phase_1.sql";
const apiImage = "laborator-api:30b39ec0-1";
const webImage = "laborator-web:30b39ec0-1";
const apiImageId = `sha256:${"a".repeat(64)}`;
const webImageId = `sha256:${"b".repeat(64)}`;

test("safe rollback validates immutable evidence and preserves isolated data", () => {
  const fixture = createFixture();

  try {
    const before = readFileSync(fixture.runtimeDbPath);
    const result = runRollback(fixture);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /Rollback runtime bundle SHA-256 verified/);
    assert.match(result.stdout, /Rollback preflight passed/);
    assert.deepEqual(readFileSync(fixture.runtimeDbPath), before);
  } finally {
    fixture.cleanup();
  }
});

test("safe rollback requires explicit human authorization", () => {
  const fixture = createFixture();

  try {
    const result = runRollback(fixture, { confirm: false });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Confirmation required: pass --confirm ROLLBACK/);
  } finally {
    fixture.cleanup();
  }
});

test("safe rollback rejects a missing runtime image bundle", () => {
  const fixture = createFixture();

  try {
    rmSync(fixture.bundlePath);
    const result = runRollback(fixture);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Runtime image bundle not found/);
  } finally {
    fixture.cleanup();
  }
});

test("safe rollback rejects a runtime image bundle digest mismatch", () => {
  const fixture = createFixture();

  try {
    writeDockerBundle(fixture.bundlePath, { extraFile: "tampered" });
    const result = runRollback(fixture);

    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /Build provenance mismatch for runtimeImages\.bundleSha256/
    );
  } finally {
    fixture.cleanup();
  }
});

test("safe rollback rejects incompatible database migration state", () => {
  const fixture = createFixture();

  try {
    writeJson(fixture.currentIdentityPath, {
      deploymentStatus: "deployed",
      sourceCommit: currentSourceCommit,
      migrationVersion: "0009_future_incompatible.sql"
    });
    const result = runRollback(fixture);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Rollback migration is incompatible/);
  } finally {
    fixture.cleanup();
  }
});

test("safe rollback rejects image substitution in runtime metadata", () => {
  const fixture = createFixture();

  try {
    const runtimeMetadata = JSON.parse(readFileSync(fixture.runtimeMetadataPath, "utf8"));
    runtimeMetadata.apiImage = "laborator-api:newer-substitute";
    writeJson(fixture.runtimeMetadataPath, runtimeMetadata);
    const result = runRollback(fixture);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Runtime image metadata mismatch for apiImage/);
  } finally {
    fixture.cleanup();
  }
});

test("live rollback path fails closed without a verified canonical backup", () => {
  const fixture = createFixture();

  try {
    const result = runRollback(fixture, { dryRun: false });

    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /verified canonical backup is required before live rollback/
    );
  } finally {
    fixture.cleanup();
  }
});

function runRollback(fixture, { confirm = true, dryRun = true } = {}) {
  const args = [];

  if (confirm) {
    args.push("--confirm", "ROLLBACK");
  }

  args.push(
    "--artifact",
    artifactPath,
    "--sha256",
    artifactSha256,
    "--source-commit",
    sourceCommit,
    "--migration-version",
    migrationVersion,
    "--api-image",
    apiImage,
    "--web-image",
    webImage,
    "--api-image-id",
    apiImageId,
    "--web-image-id",
    webImageId,
    "--runtime-metadata",
    fixture.runtimeMetadataPath,
    "--runtime-image-bundle",
    fixture.bundlePath,
    "--provenance",
    fixture.provenancePath,
    "--current-release-identity",
    fixture.currentIdentityPath,
    "--config",
    configPath,
    "--release-dir",
    fixture.releaseDir,
    "--compose-file",
    composePath,
    "--env-file",
    envPath,
    "--deployment-id",
    "isolated-rollback-test",
    "--skip-compose"
  );

  if (dryRun) {
    args.push("--dry-run");
  }

  return spawnSync("bash", [rollbackScript, ...args], {
    cwd: repositoryRoot,
    encoding: "utf8"
  });
}

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), "laborator-safe-rollback-"));
  const bundlePath = join(root, "runtime-images.tar");
  const runtimeMetadataPath = join(root, "runtime-images.json");
  const provenancePath = join(root, "build-provenance.json");
  const currentIdentityPath = join(root, "current-release-identity.json");
  const runtimeDbPath = join(root, "persistent-data", "runtime-db.json");
  const releaseDir = join(root, "releases");

  mkdirSync(dirname(runtimeDbPath), { recursive: true });
  writeDockerBundle(bundlePath);
  writeFileSync(runtimeDbPath, '{"workflow_states":[{"id":"preserved"}]}\n');

  const bundleSha256 = sha256(bundlePath);
  writeJson(runtimeMetadataPath, {
    releaseVersion: "1.0.0-rc.1",
    sourceCommit,
    artifactReference: artifactPath,
    artifactSha256,
    apiImage,
    apiImageId,
    webImage,
    webImageId,
    migrationVersion,
    createdAt: "2026-10-10T00:00:00Z"
  });
  writeJson(provenancePath, {
    schemaVersion: "1.0",
    source: { commit: sourceCommit },
    releaseArtifact: {
      sha256: artifactSha256,
      migrationVersion
    },
    runtimeImages: {
      bundleSha256,
      apiImage,
      apiImageId,
      webImage,
      webImageId
    }
  });
  writeJson(currentIdentityPath, {
    deploymentStatus: "deployed",
    sourceCommit: currentSourceCommit,
    migrationVersion
  });

  return {
    root,
    bundlePath,
    runtimeMetadataPath,
    provenancePath,
    currentIdentityPath,
    runtimeDbPath,
    releaseDir,
    cleanup() {
      rmSync(root, { recursive: true, force: true });
    }
  };
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeDockerBundle(path, { extraFile } = {}) {
  const bundleRoot = mkdtempSync(join(tmpdir(), "laborator-docker-bundle-"));

  try {
    const apiConfig = `${apiImageId.slice("sha256:".length)}.json`;
    const webConfig = `${webImageId.slice("sha256:".length)}.json`;
    writeJson(join(bundleRoot, apiConfig), { architecture: "amd64" });
    writeJson(join(bundleRoot, webConfig), { architecture: "amd64" });
    writeJson(join(bundleRoot, "manifest.json"), [
      { Config: apiConfig, RepoTags: [apiImage], Layers: [] },
      { Config: webConfig, RepoTags: [webImage], Layers: [] }
    ]);
    if (extraFile) {
      writeFileSync(join(bundleRoot, "extra.txt"), `${extraFile}\n`);
    }

    const tar = spawnSync("tar", ["-C", bundleRoot, "-cf", path, "."], {
      encoding: "utf8"
    });
    assert.equal(tar.status, 0, tar.stderr || tar.stdout);
  } finally {
    rmSync(bundleRoot, { recursive: true, force: true });
  }
}
