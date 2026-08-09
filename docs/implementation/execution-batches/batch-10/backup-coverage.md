# Backup Coverage

Status: Canonical coverage model established  
Owner: Platform Operations

## Resource Classes

- BACKUP_REQUIRED: must be backed up and restored.
- ARCHIVE_REQUIRED: must be preserved long term.
- REGENERABLE: can be rebuilt from source or deterministic output.
- TEMPORARY: no preservation requirement.

## Current Coverage

| Resource | Classification | Current Mechanism | RC1 Requirement |
| --- | --- | --- | --- |
| runtime database volume | BACKUP_REQUIRED | `infrastructure/backup/backup-laborator.sh` | isolated restore evidence |
| runtime backups volume | BACKUP_REQUIRED | Docker volume archive | isolated restore evidence |
| staging compose config | BACKUP_REQUIRED | included in infrastructure backup | restore evidence |
| staging env file | BACKUP_REQUIRED when encrypted | excluded by default unless enabled | encrypted/restricted storage |
| nginx config | BACKUP_REQUIRED | optional config archive | restore evidence |
| systemd units | BACKUP_REQUIRED | optional config archive | restore evidence |
| source repository | ARCHIVE_REQUIRED | Git remote | commit/tag retention |
| build artifacts | REGENERABLE until immutable release | CI/build output | digest/provenance evidence |

## Rule

A backup is not valid for RC1 until restore is verified in an isolated environment and corrupted backups are rejected.

