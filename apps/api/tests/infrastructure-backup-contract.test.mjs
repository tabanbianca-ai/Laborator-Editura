import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  chmodSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const backupScript = join(repositoryRoot, "infrastructure", "backup", "backup-laborator.sh");
const verifyScript = join(repositoryRoot, "infrastructure", "backup", "verify-backup.sh");
const dryRunScript = join(repositoryRoot, "infrastructure", "backup", "restore-dry-run.sh");

function run(command, args, options = {}) {
  const { env, ...rest } = options;
  return spawnSync(command, args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    ...rest,
    env: {
      ...process.env,
      COPYFILE_DISABLE: "1",
      ...env
    }
  });
}

function requireSuccess(result, label) {
  assert.equal(
    result.status,
    0,
    `${label} failed\nstdout:\n${result.stdout ?? ""}\nstderr:\n${result.stderr ?? ""}`
  );
}

function writeArchiveChecksum(archivePath) {
  const digest = createHash("sha256").update(readFileSync(archivePath)).digest("hex");
  writeFileSync(`${archivePath}.sha256`, `${digest}  ${basename(archivePath)}\n`);
}

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), "laborator-backup-contract-"));
  const backupRoot = join(root, "backups");
  const binDir = join(root, "bin");
  const nginxDir = join(root, "nginx");
  const systemdDir = join(root, "systemd");
  const releaseDir = join(root, "releases", "current");
  const composePath = join(root, "docker-compose.staging.yml");
  const configPath = join(root, "infrastructure.env");
  const dockerLog = join(root, "docker.log");

  for (const directory of [backupRoot, binDir, nginxDir, systemdDir, releaseDir]) {
    mkdirSync(directory, { recursive: true });
  }

  writeFileSync(composePath, "services:\n  api:\n    image: test-api\n");
  writeFileSync(join(nginxDir, "nginx.conf"), "events {}\nhttp {}\n");
  writeFileSync(
    join(releaseDir, "release-identity.json"),
    JSON.stringify(
      {
        deploymentId: "contract-test-deployment",
        releaseVersion: "1.0.0-test",
        sourceCommit: "0123456789abcdef0123456789abcdef01234567",
        artifactSha256: "a".repeat(64),
        migrationVersion: "0008_security_hardening_phase_1.sql"
      },
      null,
      2
    )
  );

  writeFileSync(
    configPath,
    [
      `PROJECT_ROOT=${repositoryRoot}`,
      `APP_ROOT=${repositoryRoot}`,
      `DOCKER_COMPOSE_PATH=${composePath}`,
      `COMPOSE_FILE=${composePath}`,
      `BACKUP_DIR=${backupRoot}`,
      `BACKUP_ROOT=${backupRoot}`,
      "BACKUP_RETENTION_DAYS=30",
      "BACKUP_MIN_FREE_MB=0",
      `BACKUP_LOCK_DIR=${join(root, "backup.lock")}`,
      "BACKUP_ENVIRONMENT=contract-test",
      "RUNTIME_DB_VOLUME=contract-test-runtime-db",
      "RUNTIME_BACKUPS_VOLUME=contract-test-runtime-backups",
      `STAGING_RELEASES_DIR=${join(root, "releases")}`,
      `STAGING_RELEASE_IDENTITY_FILE=${join(releaseDir, "release-identity.json")}`,
      `NGINX_DIR=${nginxDir}`,
      `NGINX_CONFIG_DIR=${nginxDir}`,
      `SYSTEMD_DIR=${systemdDir}`,
      `SYSTEMD_CONFIG_DIR=${systemdDir}`,
      "BACKUP_INCLUDE_ENV=false",
      "BACKUP_ENCRYPTION=none"
    ].join("\n") + "\n"
  );

  const fakeDocker = join(binDir, "docker");
  writeFileSync(
    fakeDocker,
    `#!/usr/bin/env bash
set -Eeuo pipefail
printf '%s\\n' "$*" >> "$FAKE_DOCKER_LOG"
if [[ "\${1:-}" == "volume" ]]; then
  exit 0
fi
if [[ "\${1:-}" == "run" ]]; then
  backup_host=""
  output_name=""
  previous=""
  for argument in "$@"; do
    if [[ "$previous" == "-v" && "$argument" == *":/backup"* ]]; then
      backup_host="\${argument%%:/backup*}"
    fi
    if [[ "$argument" == /backup/*.tar.gz ]]; then
      output_name="\${argument#/backup/}"
    fi
    previous="$argument"
  done
  if [[ -n "$backup_host" && -n "$output_name" ]]; then
    payload_dir="$(mktemp -d)"
    printf '{"fixture":true}\\n' > "$payload_dir/data.json"
    tar -C "$payload_dir" -czf "$backup_host/$output_name" .
    rm -rf "$payload_dir"
  fi
  exit 0
fi
exit 1
`
  );
  chmodSync(fakeDocker, 0o755);
  writeFileSync(dockerLog, "");

  const env = {
    ...process.env,
    PATH: `${binDir}:${process.env.PATH}`,
    FAKE_DOCKER_LOG: dockerLog
  };

  const result = run("bash", [backupScript, "--config", configPath], { env });
  requireSuccess(result, "canonical backup producer");
  const archiveName = readdirSync(backupRoot).find(
    (name) => name.endsWith(".tar.gz") && !name.endsWith(".sha256")
  );
  assert.ok(archiveName, "producer must create a backup archive");

  return {
    root,
    backupRoot,
    archivePath: join(backupRoot, archiveName),
    dockerLog,
    env,
    cleanup() {
      rmSync(root, { recursive: true, force: true });
    }
  };
}

function extractArchive(fixture) {
  const extractionDir = join(fixture.root, `extract-${Date.now()}-${Math.random()}`);
  mkdirSync(extractionDir, { recursive: true });
  const result = run("tar", ["-C", extractionDir, "-xzf", fixture.archivePath]);
  requireSuccess(result, "archive extraction");
  return extractionDir;
}

function repackArchive(fixture, extractionDir) {
  rmSync(fixture.archivePath, { force: true });
  rmSync(`${fixture.archivePath}.sha256`, { force: true });
  const result = run("tar", ["-C", extractionDir, "-czf", fixture.archivePath, "."]);
  requireSuccess(result, "archive repack");
  writeArchiveChecksum(fixture.archivePath);
}

test("canonical backup producer emits a verified v2 manifest and portable checksum", () => {
  const fixture = createFixture();
  try {
    const verify = run("bash", [verifyScript, fixture.archivePath]);
    requireSuccess(verify, "canonical backup verification");

    const extractionDir = extractArchive(fixture);
    const manifest = JSON.parse(readFileSync(join(extractionDir, "manifest.json"), "utf8"));
    assert.equal(manifest.schemaVersion, "laborator.infrastructure.backup.v2");
    assert.equal(manifest.environment, "contract-test");
    assert.equal(manifest.integrity.algorithm, "SHA-256");
    assert.equal(manifest.integrity.payloadChecksumsEmbedded, true);
    assert.equal(
      manifest.integrity.archiveChecksumSidecar,
      `${basename(fixture.archivePath)}.sha256`
    );
    assert.ok(
      manifest.includedArtifacts.some(
        (artifact) => artifact.path === "docker-volumes/runtime-db.tar.gz"
      )
    );
  } finally {
    fixture.cleanup();
  }
});

test("backup verification fails closed on archive checksum mismatch", () => {
  const fixture = createFixture();
  try {
    writeFileSync(`${fixture.archivePath}.sha256`, `${"0".repeat(64)}  ${basename(fixture.archivePath)}\n`);
    const verify = run("bash", [verifyScript, fixture.archivePath]);
    assert.notEqual(verify.status, 0);
  } finally {
    fixture.cleanup();
  }
});

test("legacy backup without manifest is explicitly rejected", () => {
  const fixture = createFixture();
  try {
    const extractionDir = extractArchive(fixture);
    rmSync(join(extractionDir, "manifest.json"));
    repackArchive(fixture, extractionDir);
    const verify = run("bash", [verifyScript, fixture.archivePath]);
    assert.notEqual(verify.status, 0);
    assert.match(verify.stderr, /legacy\/unversioned backups are not restore-eligible/);
  } finally {
    fixture.cleanup();
  }
});

test("backup verification rejects malformed manifest JSON", () => {
  const fixture = createFixture();
  try {
    const extractionDir = extractArchive(fixture);
    writeFileSync(join(extractionDir, "manifest.json"), "{not-json\n");
    repackArchive(fixture, extractionDir);
    const verify = run("bash", [verifyScript, fixture.archivePath]);
    assert.notEqual(verify.status, 0);
    assert.match(verify.stderr, /manifest\.json is malformed/);
  } finally {
    fixture.cleanup();
  }
});

test("backup verification rejects a missing required archive artifact", () => {
  const fixture = createFixture();
  try {
    const extractionDir = extractArchive(fixture);
    rmSync(join(extractionDir, "docker-volumes", "runtime-db.tar.gz"));
    repackArchive(fixture, extractionDir);
    const verify = run("bash", [verifyScript, fixture.archivePath]);
    assert.notEqual(verify.status, 0);
    assert.match(verify.stderr, /archive is missing declared artifact.*runtime-db\.tar\.gz/);
  } finally {
    fixture.cleanup();
  }
});

test("restore dry-run accepts canonical backup and never references live volumes", () => {
  const fixture = createFixture();
  try {
    writeFileSync(fixture.dockerLog, "");
    const restore = run(
      "bash",
      [dryRunScript, "--backup", fixture.archivePath],
      { env: fixture.env }
    );
    requireSuccess(restore, "isolated restore dry-run");
    assert.match(restore.stdout, /Live volumes were not touched/);

    const dockerCalls = readFileSync(fixture.dockerLog, "utf8");
    assert.match(dockerCalls, /volume create laborator-restore-test-db-/);
    assert.match(dockerCalls, /volume create laborator-restore-test-backups-/);
    assert.doesNotMatch(dockerCalls, /laborator-staging_runtime-db/);
    assert.doesNotMatch(dockerCalls, /laborator-staging_runtime-backups/);
  } finally {
    fixture.cleanup();
  }
});
