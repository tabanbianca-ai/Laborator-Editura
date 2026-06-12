import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const BACKUP_FORMAT = "laborator-runtime-database-backup";
export const SCHEMA_VERSION = "1.0";

export const TABLE_NAMES = [
  "organizations",
  "users",
  "user_roles",
  "auth_sessions",
  "projects",
  "documents",
  "document_segments",
  "segment_translations",
  "export_artifacts",
  "foundation_audit_events",
  "translation_memory_entries",
  "translation_memory_audit_events",
  "terminology_terms",
  "terminology_audit_events",
  "qa_reports",
  "qa_issues",
  "qa_audit_events",
  "semantic_fidelity_reports",
  "semantic_fidelity_issues",
  "semantic_fidelity_audit_events",
  "workflow_states",
  "workflow_transitions",
  "workflow_audit_events"
];

const TENANT_SCOPED_TABLES = new Set([
  "user_roles",
  "auth_sessions",
  "projects",
  "documents",
  "document_segments",
  "segment_translations",
  "export_artifacts",
  "foundation_audit_events",
  "translation_memory_entries",
  "translation_memory_audit_events",
  "terminology_terms",
  "terminology_audit_events",
  "qa_reports",
  "qa_issues",
  "qa_audit_events",
  "semantic_fidelity_reports",
  "semantic_fidelity_issues",
  "semantic_fidelity_audit_events",
  "workflow_states",
  "workflow_transitions",
  "workflow_audit_events"
]);

export function defaultRuntimeDbPath(cwd = process.cwd()) {
  return join(cwd, ".data", "laborator-runtime-db.json");
}

export function defaultBackupPath(cwd = process.cwd()) {
  return join(cwd, "backups", "runtime-db-backup.json");
}

export function backupRuntimeDatabase({ dbPath = defaultRuntimeDbPath(), outPath = defaultBackupPath() } = {}) {
  const snapshot = readRuntimeDatabase(dbPath);
  const backup = createBackup(snapshot);

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, stableStringify(backup), "utf8");

  return backup;
}

export function restoreRuntimeDatabase({ dbPath = defaultRuntimeDbPath(), backupPath = defaultBackupPath() } = {}) {
  const backup = JSON.parse(readFileSync(backupPath, "utf8"));
  const validation = validateBackup(backup);

  if (!validation.valid) {
    throw new Error(`Invalid runtime database backup: ${validation.issues.join("; ")}`);
  }

  const normalized = createBackup(backup.data);
  writeRuntimeDatabase(dbPath, normalized.data);

  return normalized;
}

export function readRuntimeDatabase(dbPath) {
  if (!existsSync(dbPath)) {
    return emptySnapshot();
  }

  const parsed = JSON.parse(readFileSync(dbPath, "utf8"));
  return normalizeSnapshot(parsed);
}

export function writeRuntimeDatabase(dbPath, snapshot) {
  mkdirSync(dirname(dbPath), { recursive: true });

  const tmpPath = join(dirname(dbPath), `${Date.now()}-${Math.random().toString(16).slice(2)}.tmp`);
  writeFileSync(tmpPath, stableStringify(normalizeSnapshot(snapshot)), "utf8");
  renameSync(tmpPath, dbPath);
}

export function createBackup(snapshot) {
  return {
    metadata: {
      format: BACKUP_FORMAT,
      schemaVersion: SCHEMA_VERSION,
      source: "runtime-database",
      tables: [...TABLE_NAMES]
    },
    data: normalizeSnapshot(snapshot)
  };
}

export function validateBackup(value) {
  const issues = [];

  if (!isRecord(value)) {
    return { valid: false, issues: ["backup must be an object"] };
  }

  if (!isRecord(value.metadata)) {
    issues.push("metadata must be an object");
  } else {
    if (value.metadata.format !== BACKUP_FORMAT) {
      issues.push("metadata.format is not supported");
    }

    if (value.metadata.schemaVersion !== SCHEMA_VERSION) {
      issues.push("metadata.schemaVersion is not supported");
    }

    if (!Array.isArray(value.metadata.tables)) {
      issues.push("metadata.tables must be an array");
    }
  }

  if (!isRecord(value.data)) {
    issues.push("data must be an object");
  } else {
    validateTables(value.data, issues);
    validateTenantBoundaries(value.data, issues);
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export function normalizeSnapshot(snapshot) {
  const source = isRecord(snapshot) ? snapshot : {};

  return TABLE_NAMES.reduce((normalized, tableName) => {
    const rows = source[tableName];
    normalized[tableName] = Array.isArray(rows) ? sortRows(rows.filter(isRecord).map(sortValue)) : [];
    return normalized;
  }, {});
}

function validateTables(data, issues) {
  const allowedTables = new Set(TABLE_NAMES);

  for (const tableName of Object.keys(data)) {
    if (!allowedTables.has(tableName)) {
      issues.push(`unknown table ${tableName}`);
    }
  }

  for (const tableName of TABLE_NAMES) {
    const rows = data[tableName];

    if (!Array.isArray(rows)) {
      issues.push(`data.${tableName} must be an array`);
      continue;
    }

    for (const row of rows) {
      if (!isRecord(row)) {
        issues.push(`data.${tableName} rows must be objects`);
        continue;
      }

      if (typeof row.id !== "string" || row.id.length === 0) {
        issues.push(`data.${tableName} row id must be a non-empty string`);
      }

      if (
        TENANT_SCOPED_TABLES.has(tableName) &&
        (typeof row.organizationId !== "string" || row.organizationId.length === 0)
      ) {
        issues.push(`data.${tableName} row organizationId must be a non-empty string`);
      }
    }
  }
}

function validateTenantBoundaries(data, issues) {
  const organizationIds = new Set(rowsFor(data, "organizations").map((row) => row.id));

  for (const tableName of TENANT_SCOPED_TABLES) {
    for (const row of rowsFor(data, tableName)) {
      if (typeof row.organizationId === "string" && !organizationIds.has(row.organizationId)) {
        issues.push(`data.${tableName} row ${row.id} references missing organization ${row.organizationId}`);
      }
    }
  }

  validateReferenceTenant(data, issues, "documents", "projectId", "projects");
  validateReferenceTenant(data, issues, "document_segments", "projectId", "projects");
  validateReferenceTenant(data, issues, "document_segments", "documentId", "documents");
  validateReferenceTenant(data, issues, "segment_translations", "projectId", "projects");
  validateReferenceTenant(data, issues, "segment_translations", "documentId", "documents");
  validateReferenceTenant(data, issues, "segment_translations", "segmentId", "document_segments");
  validateReferenceTenant(data, issues, "export_artifacts", "projectId", "projects");
  validateReferenceTenant(data, issues, "export_artifacts", "documentId", "documents");
}

function validateReferenceTenant(data, issues, tableName, referenceKey, referenceTableName) {
  const references = new Map(rowsFor(data, referenceTableName).map((row) => [row.id, row]));

  for (const row of rowsFor(data, tableName)) {
    const referenceId = row[referenceKey];

    if (typeof referenceId !== "string") {
      continue;
    }

    const referenced = references.get(referenceId);

    if (!referenced) {
      issues.push(`data.${tableName} row ${row.id} references missing ${referenceTableName} ${referenceId}`);
      continue;
    }

    if (row.organizationId !== referenced.organizationId) {
      issues.push(`data.${tableName} row ${row.id} crosses tenant boundary via ${referenceKey}`);
    }
  }
}

function rowsFor(data, tableName) {
  const rows = data[tableName];
  return Array.isArray(rows) ? rows.filter(isRecord) : [];
}

function sortRows(rows) {
  return rows.sort((left, right) => rowSortKey(left).localeCompare(rowSortKey(right)));
}

function rowSortKey(row) {
  const tenant = typeof row.organizationId === "string" ? row.organizationId : "";
  const createdAt = typeof row.createdAt === "string" ? row.createdAt : "";
  return `${tenant}:${createdAt}:${row.id}`;
}

function stableStringify(value) {
  return `${JSON.stringify(sortValue(value), null, 2)}\n`;
}

function sortValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.keys(value)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = sortValue(value[key]);
      return sorted;
    }, {});
}

function emptySnapshot() {
  return TABLE_NAMES.reduce((snapshot, tableName) => {
    snapshot[tableName] = [];
    return snapshot;
  }, {});
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
