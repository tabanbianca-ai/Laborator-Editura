#!/usr/bin/env node
import { defaultBackupPath, defaultRuntimeDbPath, restoreRuntimeDatabase } from "./runtime-backup-lib.mjs";

const args = parseArgs(process.argv.slice(2));

try {
  const dbPath = args.db ?? defaultRuntimeDbPath();
  const backupPath = args.in ?? defaultBackupPath();
  const backup = restoreRuntimeDatabase({ dbPath, backupPath });

  console.log(JSON.stringify({
    status: "ok",
    action: "restore",
    dbPath,
    backupPath,
    schemaVersion: backup.metadata.schemaVersion,
    tables: backup.metadata.tables.length
  }));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--db") {
      parsed.db = argv[index + 1];
      index += 1;
    } else if (arg === "--in") {
      parsed.in = argv[index + 1];
      index += 1;
    }
  }

  return parsed;
}
