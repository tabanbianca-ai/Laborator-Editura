#!/usr/bin/env node
import { backupRuntimeDatabase, defaultBackupPath, defaultRuntimeDbPath } from "./runtime-backup-lib.mjs";

const args = parseArgs(process.argv.slice(2));

try {
  const dbPath = args.db ?? defaultRuntimeDbPath();
  const outPath = args.out ?? defaultBackupPath();
  const backup = backupRuntimeDatabase({ dbPath, outPath });

  console.log(JSON.stringify({
    status: "ok",
    action: "backup",
    dbPath,
    outPath,
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
    } else if (arg === "--out") {
      parsed.out = argv[index + 1];
      index += 1;
    }
  }

  return parsed;
}
