# Backup Encryption and Immutability Standard

## Purpose

Encryption and immutability protect backup data from unauthorized access,
tampering, ransomware, accidental deletion, and single-actor destruction.

## Encryption Requirements

All backups must use:

- Encryption in transit.
- Encryption at rest.
- Integrity checks.
- Checksums.
- Access control.
- Access logging.
- Separation of keys and data.
- Key rotation.

Integrity verification must run:

- After creation.
- After replication.
- Before restore.
- Periodically according to policy.

## Secrets and Cryptographic Keys

Secrets must not be included uncontrolled in general-purpose backups.

Secrets and keys require:

- Specialized storage.
- Encryption.
- Separate access.
- Rotation.
- Documented recovery.
- Separation of duties.
- Consolidated audit.
- Compromise procedure.

Loss of an encryption key must not make backups impossible to restore. Key
recovery must be documented and tested without exposing raw secret values.

## Immutability Requirements

Critical resources should use:

- Append-only storage.
- Modification lock.
- Immutable retention windows.
- Separate administrative accounts.
- Multifactor authentication.
- Logical or physical isolation.
- Ransomware protection.

An application administrator must not be able to delete all backups alone.

## Audit Rules

Audit must record:

- Encryption policy changes.
- Key reference changes.
- Backup access.
- Integrity verification.
- Immutability policy changes.
- Deletion attempts.
- Privileged access.
- Approved exceptions.

