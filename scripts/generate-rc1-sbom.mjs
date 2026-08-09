#!/usr/bin/env node
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const releaseCandidate = "1.0.0-rc.1";
const releaseDir = join(process.cwd(), "artifacts", "releases", "v1.0", "rc1");
const docsDir = join(process.cwd(), "docs", "releases", "v1.0");
const artifactMetadataPath = findArtifactMetadata();
const artifactMetadata = JSON.parse(readFileSync(artifactMetadataPath, "utf8"));
const sbomPath = join(docsDir, "rc1-sbom.json");

const workspacePackagePaths = [
  "package.json",
  "apps/api/package.json",
  "apps/web/package.json",
  "apps/ai/package.json",
  "packages/db/package.json",
  "packages/shared/package.json"
];

const workspacePackages = workspacePackagePaths.map(readPackage);
const workspaceByName = new Map(workspacePackages.map((pkg) => [pkg.packageJson.name, pkg]));
const components = new Map();
const dependencies = [];

main();

function main() {
  for (const workspacePackage of workspacePackages) {
    const pkg = workspacePackage.packageJson;
    const component = componentFromPackage(pkg, workspacePackage.path === "package.json" ? "application" : "library", workspacePackage.path);
    components.set(component["bom-ref"], component);
  }

  for (const workspacePackage of workspacePackages) {
    const pkg = workspacePackage.packageJson;
    const directDependencyRefs = [];
    const dependencySets = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {})
    };

    for (const [name, requestedVersion] of Object.entries(dependencySets).sort(([left], [right]) => left.localeCompare(right))) {
      const dependencyComponent = resolveDependencyComponent(name, requestedVersion, workspacePackage.path);
      components.set(dependencyComponent["bom-ref"], dependencyComponent);
      directDependencyRefs.push(dependencyComponent["bom-ref"]);
    }

    dependencies.push({
      ref: bomRef(pkg.name, pkg.version),
      dependsOn: [...new Set(directDependencyRefs)].sort()
    });
  }

  const sbom = {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    serialNumber: deterministicSerialNumber(),
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      tools: {
        components: [
          {
            type: "application",
            name: "laborator-rc1-sbom-generator",
            version: "1.0.0"
          }
        ]
      },
      component: {
        type: "application",
        name: "laboratorul-editurii",
        version: releaseCandidate,
        "bom-ref": bomRef("laboratorul-editurii", releaseCandidate)
      },
      properties: [
        property("laborator:releaseCandidate", releaseCandidate),
        property("laborator:sourceCommit", artifactMetadata.source.commit),
        property("laborator:sourceBranch", artifactMetadata.source.branch),
        property("laborator:artifact.path", artifactMetadata.artifact.path),
        property("laborator:artifact.sha256", artifactMetadata.artifact.sha256),
        property("laborator:artifact.sizeBytes", String(artifactMetadata.artifact.sizeBytes)),
        property("laborator:database.latestMigration", artifactMetadata.database.latestMigration),
        property("laborator:lockfile.status", existsSync(join(process.cwd(), "pnpm-lock.yaml")) ? "present" : "missing")
      ]
    },
    components: [...components.values()].sort((left, right) => left["bom-ref"].localeCompare(right["bom-ref"])),
    dependencies: dependencies.sort((left, right) => left.ref.localeCompare(right.ref))
  };

  writeFileSync(sbomPath, `${JSON.stringify(sbom, null, 2)}\n`);
  console.log(JSON.stringify({
    status: "ok",
    sbom: relativePath(sbomPath),
    components: sbom.components.length,
    dependencies: sbom.dependencies.length
  }, null, 2));
}

function findArtifactMetadata() {
  const shortCommit = artifactShortCommit();
  const path = join(releaseDir, `laborator-editura-${releaseCandidate}-${shortCommit}.artifact.json`);
  if (!existsSync(path)) {
    throw new Error(`Artifact metadata not found: ${relativePath(path)}`);
  }
  return path;
}

function artifactShortCommit() {
  return runGit(["rev-parse", "--short", "HEAD"]);
}

function readPackage(path) {
  return {
    path,
    packageJson: JSON.parse(readFileSync(join(process.cwd(), path), "utf8"))
  };
}

function resolveDependencyComponent(name, requestedVersion, packagePath) {
  const workspacePackage = workspaceByName.get(name);
  if (workspacePackage && requestedVersion.startsWith("workspace:")) {
    return componentFromPackage(workspacePackage.packageJson, "library", workspacePackage.path, requestedVersion);
  }

  const fromDir = dirname(join(process.cwd(), packagePath));
  const requireFromPackage = createRequire(join(fromDir, "package.json"));

  try {
    const dependencyPackagePath = requireFromPackage.resolve(`${name}/package.json`);
    const dependencyPackageJson = JSON.parse(readFileSync(dependencyPackagePath, "utf8"));
    return componentFromPackage(dependencyPackageJson, "library", dependencyPackagePath, requestedVersion);
  } catch {
    return {
      type: "library",
      name,
      version: requestedVersion,
      scope: "required",
      "bom-ref": bomRef(name, requestedVersion),
      properties: [
        property("laborator:requestedVersion", requestedVersion),
        property("laborator:resolution", "unresolved-from-installed-node-modules")
      ]
    };
  }
}

function componentFromPackage(pkg, type, sourcePath, requestedVersion) {
  const component = {
    type,
    name: pkg.name,
    version: pkg.version,
    scope: "required",
    "bom-ref": bomRef(pkg.name, pkg.version),
    purl: packageUrl(pkg.name, pkg.version),
    properties: [
      property("laborator:sourcePath", normalizeSourcePath(sourcePath))
    ]
  };

  if (requestedVersion) {
    component.properties.push(property("laborator:requestedVersion", requestedVersion));
  }

  if (typeof pkg.license === "string" && pkg.license.trim().length > 0) {
    component.licenses = [{ license: { id: pkg.license } }];
  }

  return component;
}

function packageUrl(name, version) {
  const encodedName = name.startsWith("@")
    ? `@${name.slice(1).split("/").map(encodeURIComponent).join("/")}`
    : encodeURIComponent(name);
  return `pkg:npm/${encodedName}@${encodeURIComponent(version)}`;
}

function bomRef(name, version) {
  return `pkg:npm/${name}@${version}`;
}

function property(name, value) {
  return { name, value: value ?? "" };
}

function deterministicSerialNumber() {
  const input = `${releaseCandidate}:${artifactMetadata.source.commit}:${artifactMetadata.artifact.sha256}`;
  const digest = createHash("sha256").update(input).digest("hex");
  return `urn:uuid:${digest.slice(0, 8)}-${digest.slice(8, 12)}-${digest.slice(12, 16)}-${digest.slice(16, 20)}-${digest.slice(20, 32)}`;
}

function normalizeSourcePath(path) {
  return path.startsWith(process.cwd()) ? relativePath(path) : path;
}

function relativePath(path) {
  return path.replace(`${process.cwd()}/`, "");
}

function runGit(args) {
  const result = spawnSync("git", args, { cwd: process.cwd(), encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  }
  return result.stdout.trim();
}
