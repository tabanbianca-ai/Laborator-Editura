#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { tmpdir } from "node:os";

const releaseCandidate = "1.0.0-rc.1";
const releaseDir = join(process.cwd(), "artifacts", "releases", "v1.0", "rc1");
const artifactName = `laborator-editura-${releaseCandidate}-${git("rev-parse", "--short", "HEAD")}.tar.gz`;
const artifactPath = join(releaseDir, artifactName);
const artifactMetadataPath = join(releaseDir, artifactName.replace(/\.tar\.gz$/, ".artifact.json"));
const checksumPath = `${artifactPath}.sha256`;
const stagingDir = join(tmpdir(), `laborator-rc1-artifact-${Date.now()}`);
const commitTimestamp = new Date(git("show", "-s", "--format=%cI", "HEAD"));

const entries = [
  ["package.json", "package.json"],
  ["pnpm-workspace.yaml", "pnpm-workspace.yaml"],
  ["turbo.json", "turbo.json"],
  ["tsconfig.base.json", "tsconfig.base.json"],
  ["README.md", "README.md"],
  ["apps/api/package.json", "apps/api/package.json"],
  ["apps/api/dist", "apps/api/dist"],
  ["apps/web/package.json", "apps/web/package.json"],
  ["apps/web/next.config.mjs", "apps/web/next.config.mjs"],
  ["apps/web/.next", "apps/web/.next"],
  ["apps/ai/package.json", "apps/ai/package.json"],
  ["apps/ai/app", "apps/ai/app"],
  ["packages/shared/package.json", "packages/shared/package.json"],
  ["packages/shared/dist", "packages/shared/dist"],
  ["packages/db/package.json", "packages/db/package.json"],
  ["packages/db/dist", "packages/db/dist"],
  ["packages/db/migrations", "packages/db/migrations"],
  ["packages/db/scripts", "packages/db/scripts"],
  ["deploy/staging", "deploy/staging"],
  [".github/workflows", ".github/workflows"]
];

main();

function main() {
  assertBuildOutputs();

  mkdirSync(releaseDir, { recursive: true });
  rmSync(stagingDir, { recursive: true, force: true });
  mkdirSync(stagingDir, { recursive: true });

  for (const [from, to] of entries) {
    const source = join(process.cwd(), from);
    if (!existsSync(source)) {
      continue;
    }

    cpSync(source, join(stagingDir, to), {
      recursive: true,
      filter: (sourcePath) => !shouldExclude(sourcePath)
    });
  }

  const manifest = createManifest();
  writeFileSync(join(stagingDir, "RELEASE_ARTIFACT_MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  normalizeTimes(stagingDir, commitTimestamp);
  createArchive(stagingDir, artifactPath);

  const digest = sha256File(artifactPath);
  const sizeBytes = statSync(artifactPath).size;
  const createdAt = new Date().toISOString();
  const metadata = {
    releaseCandidate,
    artifact: {
      fileName: artifactName,
      path: relative(process.cwd(), artifactPath),
      sizeBytes,
      sha256: digest,
      createdAt
    },
    source: {
      commit: git("rev-parse", "HEAD"),
      branch: git("branch", "--show-current"),
      repositoryState: gitStatus()
    },
    build: manifest.build,
    database: manifest.database
  };

  writeFileSync(checksumPath, `${digest}  ${artifactName}\n`);
  writeFileSync(artifactMetadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  rmSync(stagingDir, { recursive: true, force: true });

  console.log(JSON.stringify(metadata, null, 2));
}

function assertBuildOutputs() {
  const required = [
    "apps/api/dist/apps/api/src/main.js",
    "apps/web/.next/BUILD_ID",
    "packages/shared/dist/index.js",
    "packages/db/dist/index.js"
  ];

  const missing = required.filter((path) => !existsSync(join(process.cwd(), path)));
  if (missing.length > 0) {
    throw new Error(`Run the canonical build before packaging RC1. Missing: ${missing.join(", ")}`);
  }
}

function createManifest() {
  return {
    releaseCandidate,
    generatedAt: new Date().toISOString(),
    source: {
      commit: git("rev-parse", "HEAD"),
      commitTimestamp: git("show", "-s", "--format=%cI", "HEAD"),
      branch: git("branch", "--show-current"),
      repositoryState: gitStatus()
    },
    build: {
      command: "pnpm build",
      nodeVersion: process.version,
      pnpmVersion: commandVersion("pnpm", "--version"),
      platform: `${process.platform} ${process.arch}`,
      packageManager: JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")).packageManager
    },
    packages: readPackageVersions(),
    database: {
      runtimeSchemaVersion: "1.0",
      latestMigration: latestMigration(),
      migrations: readdirSync(join(process.cwd(), "packages", "db", "migrations"))
        .filter((file) => file.endsWith(".sql"))
        .sort()
    },
    contents: entries.map(([, target]) => target)
  };
}

function readPackageVersions() {
  return [
    "package.json",
    "apps/api/package.json",
    "apps/web/package.json",
    "apps/ai/package.json",
    "packages/db/package.json",
    "packages/shared/package.json"
  ].map((path) => {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), path), "utf8"));
    return {
      path,
      name: pkg.name,
      version: pkg.version
    };
  });
}

function latestMigration() {
  return readdirSync(join(process.cwd(), "packages", "db", "migrations"))
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .at(-1);
}

function shouldExclude(sourcePath) {
  const normalized = sourcePath.split("\\").join("/");
  return normalized.includes("/.next/cache/") ||
    normalized.endsWith("/.next/cache") ||
    normalized.includes("/node_modules/") ||
    normalized.includes("/.turbo/");
}

function createArchive(sourceDir, destination) {
  const listPath = join(sourceDir, ".artifact-files");
  const files = listFiles(sourceDir)
    .map((file) => relative(sourceDir, file))
    .filter((file) => file !== ".artifact-files")
    .sort();

  writeFileSync(listPath, `${files.join("\n")}\n`);

  const result = spawnSync("tar", ["-czf", destination, "-C", sourceDir, "-T", listPath], {
    env: {
      ...process.env,
      COPYFILE_DISABLE: "1"
    },
    stdio: "inherit"
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`tar failed with status ${result.status}`);
  }
}

function listFiles(root) {
  const output = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      output.push(...listFiles(path));
    } else if (stats.isFile()) {
      output.push(path);
    }
  }
  return output;
}

function normalizeTimes(path, timestamp) {
  const stats = statSync(path);
  if (stats.isDirectory()) {
    for (const entry of readdirSync(path)) {
      normalizeTimes(join(path, entry), timestamp);
    }
  }
  utimesSync(path, timestamp, timestamp);
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function git(...args) {
  return run("git", args);
}

function commandVersion(command, ...args) {
  try {
    return run(command, args);
  } catch {
    return "unavailable";
  }
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr}`);
  }

  return result.stdout.trim();
}

function gitStatus() {
  const status = git("status", "--short");
  return status.length === 0 ? "clean" : status;
}

