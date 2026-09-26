#!/usr/bin/env python3
"""Create and validate the canonical Laborator infrastructure backup manifest."""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import sys
import tarfile
from datetime import datetime
from pathlib import Path, PurePosixPath
from typing import Any


SCHEMA_VERSION = "laborator.infrastructure.backup.v2"
REQUIRED_ARTIFACTS = {
    "config/docker/docker-compose.staging.yml",
    "docker-volumes/runtime-backups.tar.gz",
    "docker-volumes/runtime-db.tar.gz",
    "metadata/git-commit.txt",
}
RUNTIME_ARCHIVES = {
    "docker-volumes/runtime-backups.tar.gz",
    "docker-volumes/runtime-db.tar.gz",
}
RELEASE_IDENTITY_FIELDS = (
    "deploymentId",
    "releaseVersion",
    "sourceCommit",
    "artifactSha256",
    "migrationVersion",
)
SHA256_PATTERN = re.compile(r"^[0-9a-f]{64}$")


class ContractError(ValueError):
    """Raised when an archive violates the canonical backup contract."""


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def artifact_category(relative_path: str) -> str:
    if relative_path.startswith("docker-volumes/"):
        return "RUNTIME_DATA"
    if relative_path.startswith("config/"):
        return "CONFIGURATION"
    return "RECOVERY_METADATA"


def load_release_identity(path: Path | None) -> dict[str, str] | None:
    if path is None or not path.is_file():
        return None

    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ContractError(f"release identity is not valid JSON: {error}") from error

    if not isinstance(value, dict):
        raise ContractError("release identity must be a JSON object")

    required_fields = ("deploymentId", "sourceCommit", "artifactSha256", "migrationVersion")
    missing = [field for field in required_fields if not isinstance(value.get(field), str) or not value[field]]
    if missing:
        raise ContractError(
            f"release identity missing required field(s): {', '.join(missing)}"
        )

    identity = {
        field: value[field]
        for field in RELEASE_IDENTITY_FIELDS
        if isinstance(value.get(field), str) and value[field]
    }
    return identity or None


def validate_nested_tar_bytes(path: str, payload: bytes) -> None:
    try:
        with tarfile.open(fileobj=io.BytesIO(payload), mode="r:gz") as nested:
            for member in nested.getmembers():
                safe_member_name(member)
    except (tarfile.TarError, OSError) as error:
        raise ContractError(f"{path} is not a valid gzip tar archive: {error}") from error


def create_manifest(args: argparse.Namespace) -> None:
    root = Path(args.root).resolve()
    output = Path(args.output).resolve()
    if not root.is_dir():
        raise ContractError(f"backup staging directory not found: {root}")
    if output.parent != root:
        raise ContractError("manifest output must be inside the backup staging directory")

    artifact_paths = sorted(
        path for path in root.rglob("*") if path.is_file() and path.resolve() != output
    )
    relative_paths = {path.relative_to(root).as_posix() for path in artifact_paths}
    missing = sorted(REQUIRED_ARTIFACTS - relative_paths)
    if missing:
        raise ContractError(f"required backup artifact(s) missing: {', '.join(missing)}")

    artifacts = []
    for path in artifact_paths:
        relative_path = path.relative_to(root).as_posix()
        if relative_path in RUNTIME_ARCHIVES:
            validate_nested_tar_bytes(relative_path, path.read_bytes())
        artifacts.append(
            {
                "path": relative_path,
                "category": artifact_category(relative_path),
                "requiredForRestore": relative_path in REQUIRED_ARTIFACTS,
                "sizeBytes": path.stat().st_size,
                "sha256": sha256_file(path),
            }
        )

    release_identity_path = root / "metadata" / "release-identity.json"
    release_identity = load_release_identity(
        release_identity_path if release_identity_path.is_file() else None
    )
    git_dirty_count: int | None
    try:
        git_dirty_count = int(args.git_dirty_file_count)
    except (TypeError, ValueError):
        git_dirty_count = None

    manifest = {
        "schemaVersion": SCHEMA_VERSION,
        "backupId": args.backup_id,
        "createdAt": args.created_at,
        "environment": args.environment,
        "source": {
            "gitCommit": args.git_commit,
            "gitDirtyFileCount": git_dirty_count,
            "releaseIdentity": release_identity,
        },
        "producer": {
            "name": "infrastructure/backup/backup-laborator.sh",
            "contract": SCHEMA_VERSION,
        },
        "configuration": {
            "composeArtifact": "config/docker/docker-compose.staging.yml",
            "environmentIncluded": args.environment_included,
            "encryption": args.encryption,
        },
        "restore": {
            "volumes": [
                {
                    "logicalName": "runtime-db",
                    "sourceVolume": args.runtime_db_volume,
                    "archivePath": "docker-volumes/runtime-db.tar.gz",
                },
                {
                    "logicalName": "runtime-backups",
                    "sourceVolume": args.runtime_backups_volume,
                    "archivePath": "docker-volumes/runtime-backups.tar.gz",
                },
            ]
        },
        "includedArtifacts": artifacts,
        "integrity": {
            "algorithm": "SHA-256",
            "archiveChecksumSidecar": args.archive_name + ".sha256",
            "payloadChecksumsEmbedded": True,
        },
    }
    output.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def safe_member_name(member: tarfile.TarInfo) -> str:
    normalized = member.name.removeprefix("./")
    path = PurePosixPath(normalized)
    if not normalized or path.is_absolute() or ".." in path.parts:
        raise ContractError(f"unsafe archive member path: {member.name}")
    if member.issym() or member.islnk() or member.isdev():
        raise ContractError(f"unsupported archive member type: {member.name}")
    return normalized


def require_string(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ContractError(f"manifest field {field} must be a non-empty string")
    return value


def validate_timestamp(value: Any) -> None:
    timestamp = require_string(value, "createdAt")
    try:
        datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    except ValueError as error:
        raise ContractError("manifest field createdAt must be an ISO-8601 timestamp") from error


def validate_manifest(
    archive_path: Path,
    expected: dict[str, str | None],
) -> dict[str, Any]:
    sidecar_path = Path(str(archive_path) + ".sha256")
    if not sidecar_path.is_file():
        raise ContractError(f"checksum sidecar is missing: {sidecar_path}")
    sidecar_lines = [
        line.strip()
        for line in sidecar_path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    if len(sidecar_lines) != 1:
        raise ContractError("checksum sidecar must contain exactly one SHA-256 record")
    sidecar_match = re.fullmatch(r"([0-9A-Fa-f]{64})\s+[*]?(.+)", sidecar_lines[0])
    if sidecar_match is None:
        raise ContractError("checksum sidecar is malformed")
    if sidecar_match.group(2) != archive_path.name:
        raise ContractError("checksum sidecar must reference the backup archive basename")
    if sidecar_match.group(1).lower() != sha256_file(archive_path):
        raise ContractError("backup archive SHA-256 does not match its checksum sidecar")

    try:
        archive = tarfile.open(archive_path, mode="r:gz")
    except (tarfile.TarError, OSError) as error:
        raise ContractError(f"backup is not a valid gzip tar archive: {error}") from error

    with archive:
        members: dict[str, tarfile.TarInfo] = {}
        for member in archive.getmembers():
            name = safe_member_name(member)
            if member.isfile():
                if name in members:
                    raise ContractError(f"duplicate archive member: {name}")
                members[name] = member

        if "manifest.json" not in members:
            raise ContractError(
                "manifest.json missing; legacy/unversioned backups are not restore-eligible"
            )

        manifest_handle = archive.extractfile(members["manifest.json"])
        if manifest_handle is None:
            raise ContractError("manifest.json cannot be read")
        try:
            manifest = json.loads(manifest_handle.read().decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as error:
            raise ContractError(f"manifest.json is malformed: {error}") from error

        if not isinstance(manifest, dict):
            raise ContractError("manifest.json must contain a JSON object")
        if manifest.get("schemaVersion") != SCHEMA_VERSION:
            raise ContractError(
                f"unsupported backup schemaVersion: {manifest.get('schemaVersion')!r}; "
                f"expected {SCHEMA_VERSION}"
            )

        require_string(manifest.get("backupId"), "backupId")
        validate_timestamp(manifest.get("createdAt"))
        require_string(manifest.get("environment"), "environment")

        source = manifest.get("source")
        if not isinstance(source, dict):
            raise ContractError("manifest field source must be an object")
        git_commit = require_string(source.get("gitCommit"), "source.gitCommit")

        producer = manifest.get("producer")
        if not isinstance(producer, dict) or producer.get("contract") != SCHEMA_VERSION:
            raise ContractError("manifest producer contract does not match schemaVersion")

        configuration = manifest.get("configuration")
        if not isinstance(configuration, dict):
            raise ContractError("manifest field configuration must be an object")
        if configuration.get("composeArtifact") != "config/docker/docker-compose.staging.yml":
            raise ContractError("manifest composeArtifact is not canonical")
        if not isinstance(configuration.get("environmentIncluded"), bool):
            raise ContractError("manifest environmentIncluded must be boolean")
        require_string(configuration.get("encryption"), "configuration.encryption")

        restore = manifest.get("restore")
        if not isinstance(restore, dict) or not isinstance(restore.get("volumes"), list):
            raise ContractError("manifest restore.volumes must be an array")
        restore_volumes = {}
        for volume in restore["volumes"]:
            if not isinstance(volume, dict):
                raise ContractError("manifest restore volume entries must be objects")
            logical_name = require_string(volume.get("logicalName"), "restore.volumes.logicalName")
            restore_volumes[logical_name] = volume
        expected_restore_paths = {
            "runtime-db": "docker-volumes/runtime-db.tar.gz",
            "runtime-backups": "docker-volumes/runtime-backups.tar.gz",
        }
        if set(restore_volumes) != set(expected_restore_paths):
            raise ContractError("manifest restore.volumes does not define the canonical volume set")
        for logical_name, archive_entry in expected_restore_paths.items():
            volume = restore_volumes[logical_name]
            if volume.get("archivePath") != archive_entry:
                raise ContractError(f"restore archivePath mismatch for {logical_name}")
            require_string(volume.get("sourceVolume"), f"restore.volumes.{logical_name}.sourceVolume")

        integrity = manifest.get("integrity")
        if not isinstance(integrity, dict):
            raise ContractError("manifest field integrity must be an object")
        if integrity.get("algorithm") != "SHA-256":
            raise ContractError("manifest integrity algorithm must be SHA-256")
        if integrity.get("payloadChecksumsEmbedded") is not True:
            raise ContractError("manifest must declare embedded payload checksums")
        expected_sidecar = archive_path.name + ".sha256"
        if integrity.get("archiveChecksumSidecar") != expected_sidecar:
            raise ContractError(
                "manifest archiveChecksumSidecar does not match the backup archive name"
            )

        artifact_entries = manifest.get("includedArtifacts")
        if not isinstance(artifact_entries, list) or not artifact_entries:
            raise ContractError("manifest includedArtifacts must be a non-empty array")

        declared: dict[str, dict[str, Any]] = {}
        for index, entry in enumerate(artifact_entries):
            if not isinstance(entry, dict):
                raise ContractError(f"includedArtifacts[{index}] must be an object")
            path = require_string(entry.get("path"), f"includedArtifacts[{index}].path")
            if path in declared:
                raise ContractError(f"duplicate manifest artifact: {path}")
            if path == "manifest.json" or PurePosixPath(path).is_absolute() or ".." in PurePosixPath(path).parts:
                raise ContractError(f"invalid manifest artifact path: {path}")
            digest = entry.get("sha256")
            if not isinstance(digest, str) or not SHA256_PATTERN.fullmatch(digest):
                raise ContractError(f"invalid SHA-256 for manifest artifact: {path}")
            size = entry.get("sizeBytes")
            if not isinstance(size, int) or size < 0:
                raise ContractError(f"invalid sizeBytes for manifest artifact: {path}")
            if not isinstance(entry.get("requiredForRestore"), bool):
                raise ContractError(f"requiredForRestore must be boolean for: {path}")
            declared[path] = entry

        missing_declarations = sorted(REQUIRED_ARTIFACTS - declared.keys())
        if missing_declarations:
            raise ContractError(
                f"manifest omits required artifact(s): {', '.join(missing_declarations)}"
            )
        for required_path in REQUIRED_ARTIFACTS:
            if declared[required_path].get("requiredForRestore") is not True:
                raise ContractError(f"required artifact is not marked requiredForRestore: {required_path}")

        env_artifact = "config/docker/.env.staging"
        if configuration["environmentIncluded"] != (env_artifact in declared):
            raise ContractError("environmentIncluded does not match .env.staging archive presence")

        archive_payloads = set(members) - {"manifest.json"}
        undeclared = sorted(archive_payloads - declared.keys())
        missing_payloads = sorted(declared.keys() - archive_payloads)
        if undeclared:
            raise ContractError(f"archive contains undeclared artifact(s): {', '.join(undeclared)}")
        if missing_payloads:
            raise ContractError(f"archive is missing declared artifact(s): {', '.join(missing_payloads)}")

        artifact_bytes: dict[str, bytes] = {}
        for path, entry in declared.items():
            handle = archive.extractfile(members[path])
            if handle is None:
                raise ContractError(f"archive artifact cannot be read: {path}")
            payload = handle.read()
            artifact_bytes[path] = payload
            if len(payload) != entry["sizeBytes"]:
                raise ContractError(f"artifact size mismatch: {path}")
            if sha256_bytes(payload) != entry["sha256"]:
                raise ContractError(f"artifact SHA-256 mismatch: {path}")

        for runtime_archive in RUNTIME_ARCHIVES:
            validate_nested_tar_bytes(runtime_archive, artifact_bytes[runtime_archive])

        git_metadata = artifact_bytes["metadata/git-commit.txt"].decode("utf-8").strip()
        if git_metadata != git_commit:
            raise ContractError("metadata/git-commit.txt does not match source.gitCommit")

        release_identity = source.get("releaseIdentity")
        release_path = "metadata/release-identity.json"
        if release_identity is not None:
            if not isinstance(release_identity, dict):
                raise ContractError("source.releaseIdentity must be an object or null")
            if release_path not in artifact_bytes:
                raise ContractError("release identity is declared but its artifact is missing")
            try:
                identity_artifact = json.loads(artifact_bytes[release_path].decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError) as error:
                raise ContractError(f"release identity artifact is malformed: {error}") from error
            for field, value in release_identity.items():
                if identity_artifact.get(field) != value:
                    raise ContractError(f"release identity mismatch for {field}")

        for field, value in expected.items():
            if not value:
                continue
            if not isinstance(release_identity, dict):
                raise ContractError(f"expected {field} but release identity metadata is missing")
            if release_identity.get(field) != value:
                raise ContractError(
                    f"release identity mismatch for {field}: expected {value}, "
                    f"received {release_identity.get(field)}"
                )

        return manifest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    create = subparsers.add_parser("create-manifest")
    create.add_argument("--root", required=True)
    create.add_argument("--output", required=True)
    create.add_argument("--backup-id", required=True)
    create.add_argument("--archive-name", required=True)
    create.add_argument("--created-at", required=True)
    create.add_argument("--environment", required=True)
    create.add_argument("--git-commit", required=True)
    create.add_argument("--git-dirty-file-count", required=True)
    create.add_argument("--runtime-db-volume", required=True)
    create.add_argument("--runtime-backups-volume", required=True)
    create.add_argument("--environment-included", action="store_true")
    create.add_argument("--encryption", required=True)

    verify = subparsers.add_parser("verify")
    verify.add_argument("--archive", required=True)
    verify.add_argument("--expected-deployment-id")
    verify.add_argument("--expected-source-commit")
    verify.add_argument("--expected-artifact-sha256")
    verify.add_argument("--expected-migration-version")

    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        if args.command == "create-manifest":
            create_manifest(args)
        else:
            validate_manifest(
                Path(args.archive),
                {
                    "deploymentId": args.expected_deployment_id,
                    "sourceCommit": args.expected_source_commit,
                    "artifactSha256": args.expected_artifact_sha256,
                    "migrationVersion": args.expected_migration_version,
                },
            )
    except ContractError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
