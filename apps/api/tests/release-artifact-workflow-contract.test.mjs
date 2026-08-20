import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const workflow = readFileSync(
  join(repositoryRoot, ".github", "workflows", "release-artifact-build.yml"),
  "utf8"
);
const provenanceScript = readFileSync(
  join(repositoryRoot, "scripts", "create-release-provenance.mjs"),
  "utf8"
);

test("release artifact workflow is manual and validates the requested main commit", () => {
  assert.match(workflow, /name: Release Artifact Build/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /source_commit:/);
  assert.match(workflow, /required: true/);
  assert.match(workflow, /ref: \$\{\{ inputs\.source_commit \}\}/);
  assert.match(workflow, /fetch-depth: 1/);
  assert.match(workflow, /\^\[0-9a-fA-F\]\{40\}\$/);
  assert.match(workflow, /Removed surrounding whitespace from the workflow input/);
  assert.match(workflow, /git rev-parse --is-shallow-repository/);
  assert.match(workflow, /git fetch --no-tags --prune --unshallow origin/);
  assert.match(workflow, /\+refs\/heads\/main:refs\/remotes\/origin\/main/);
  assert.match(
    workflow,
    /if ! git merge-base --is-ancestor "\$resolved_source_commit" origin\/main/
  );
  assert.match(workflow, /::error title=Source commit validation::/);
  for (const diagnostic of [
    "source_commit must be exactly one full 40-character hexadecimal Git commit SHA",
    "does not resolve to a commit after checkout",
    "Checkout mismatch",
    "Unable to expand the shallow checkout",
    "Unable to refresh origin/main",
    "origin/main is unavailable after fetch",
    "is not reachable from origin/main"
  ]) {
    assert.match(workflow, new RegExp(diagnostic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(workflow, /git rev-parse --short "\$resolved_source_commit"/);
  assert.doesNotMatch(workflow, /git rev-parse --short=7/);
  assert.doesNotMatch(workflow, /test "\$\(git rev-parse HEAD\)"/);
  assert.doesNotMatch(workflow, /^\s+push:/m);
  assert.doesNotMatch(workflow, /^\s+pull_request:/m);
});

test("release artifact workflow runs every required validation and build gate", () => {
  for (const requiredCommand of [
    "corepack prepare pnpm@10.12.1 --activate",
    "pnpm install --frozen-lockfile",
    "pnpm infra:scan-secrets",
    "pnpm validate:config",
    "bash -n",
    "docker compose",
    "pnpm typecheck",
    "pnpm format:check",
    "pnpm lint",
    "pnpm test",
    "pnpm build"
  ]) {
    assert.match(
      workflow,
      new RegExp(requiredCommand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
  }
});

test("release workflow builds verified release and runtime artifacts without bypasses", () => {
  assert.match(workflow, /node scripts\/create-rc1-artifact\.mjs/);
  assert.match(workflow, /node scripts\/generate-rc1-sbom\.mjs/);
  assert.match(workflow, /build-runtime-images-from-artifact\.sh/);
  assert.match(workflow, /--output-image-bundle/);
  assert.match(workflow, /node scripts\/create-release-provenance\.mjs/);
  assert.match(
    workflow,
    /actions\/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a/
  );
  assert.match(workflow, /if-no-files-found: error/g);
  assert.match(workflow, /compression-level: 0/);
  assert.doesNotMatch(workflow, /continue-on-error/);
  assert.doesNotMatch(workflow, /\|\| true/);
  assert.doesNotMatch(workflow, /@(latest|master)\b/);
});

test("release metadata resolution reports actionable integrity failures", () => {
  for (const diagnostic of [
    "Missing ${description}",
    "artifact.sha256 as a lowercase 64-character SHA-256",
    "does not contain database.latestMigration",
    "Checksum file does not start with a lowercase 64-character SHA-256",
    "SHA-256 mismatch between metadata",
    "and checksum file",
    "and release archive"
  ]) {
    assert.match(workflow, new RegExp(diagnostic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(workflow, /::error title=Release artifact metadata resolution::/);
  assert.doesNotMatch(workflow, /test -f "\$release_(artifact|metadata|checksum)_path"/);
});

test("release workflow reports every staging deploy input in its summary", () => {
  for (const field of [
    "source_commit",
    "artifact_run_id",
    "release_artifact_name",
    "release_artifact_sha256",
    "migration_version",
    "api_image",
    "web_image",
    "api_image_id",
    "web_image_id",
    "runtime_image_bundle_name"
  ]) {
    assert.match(workflow, new RegExp(`- ${field}:`));
  }
});

test("run-specific provenance binds source, release artifact, runtime bundle, and image IDs", () => {
  for (const requiredToken of [
    "GITHUB_RUN_ID",
    "GITHUB_RUN_ATTEMPT",
    "SOURCE_COMMIT",
    "RELEASE_ARTIFACT_SHA256",
    "RUNTIME_IMAGE_BUNDLE_NAME",
    "apiImageId",
    "webImageId",
    "bundleSha256"
  ]) {
    assert.match(provenanceScript, new RegExp(requiredToken));
  }
});
