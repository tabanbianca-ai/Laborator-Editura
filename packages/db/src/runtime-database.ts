import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export const RUNTIME_DATABASE_BACKUP_FORMAT = "laborator-runtime-database-backup";
export const RUNTIME_DATABASE_SCHEMA_VERSION = "1.0";

export type RuntimeDatabaseTableName =
  | "organizations"
  | "users"
  | "user_roles"
  | "auth_sessions"
  | "projects"
  | "documents"
  | "document_segments"
  | "segment_translations"
  | "export_artifacts"
  | "foundation_audit_events"
  | "translation_memory_entries"
  | "translation_memory_audit_events"
  | "terminology_terms"
  | "terminology_audit_events"
  | "qa_reports"
  | "qa_issues"
  | "qa_audit_events"
  | "semantic_fidelity_reports"
  | "semantic_fidelity_issues"
  | "semantic_fidelity_audit_events"
  | "workflow_states"
  | "workflow_transitions"
  | "workflow_audit_events";

export interface RuntimeDatabaseRow {
  id: string;
}

export interface TenantRuntimeDatabaseRow extends RuntimeDatabaseRow {
  organizationId: string;
}

export type RuntimeDatabaseSnapshot = Record<RuntimeDatabaseTableName, RuntimeDatabaseRow[]>;

export interface RuntimeDatabaseBackup {
  metadata: {
    format: typeof RUNTIME_DATABASE_BACKUP_FORMAT;
    schemaVersion: typeof RUNTIME_DATABASE_SCHEMA_VERSION;
    source: "runtime-database";
    tables: RuntimeDatabaseTableName[];
  };
  data: RuntimeDatabaseSnapshot;
}

export interface RuntimeDatabaseBackupValidationResult {
  valid: boolean;
  issues: string[];
}

const TABLE_NAMES: RuntimeDatabaseTableName[] = [
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

const TENANT_SCOPED_TABLES = new Set<RuntimeDatabaseTableName>([
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

export class FileBackedRuntimeDatabase {
  constructor(
    private readonly filePath = process.env.LABORATOR_RUNTIME_DB_PATH ??
      join(process.cwd(), ".data", "laborator-runtime-db.json")
  ) {}

  insert<T extends RuntimeDatabaseRow>(tableName: RuntimeDatabaseTableName, row: T): T {
    const snapshot = this.loadSnapshot();
    const table = this.table(snapshot, tableName);

    if (table.some((existing) => existing.id === row.id)) {
      throw new Error(`duplicate id ${row.id} in ${tableName}`);
    }

    table.push(this.clone(row));
    this.persistSnapshot(snapshot);
    return this.clone(row);
  }

  upsert<T extends RuntimeDatabaseRow>(tableName: RuntimeDatabaseTableName, row: T): T {
    const snapshot = this.loadSnapshot();
    const table = this.table(snapshot, tableName);
    const index = table.findIndex((existing) => existing.id === row.id);

    if (index === -1) {
      table.push(this.clone(row));
    } else {
      table[index] = this.clone(row);
    }

    this.persistSnapshot(snapshot);
    return this.clone(row);
  }

  select<T extends RuntimeDatabaseRow>(
    tableName: RuntimeDatabaseTableName,
    predicate?: (row: T) => boolean
  ): T[] {
    const rows = this.table(this.loadSnapshot(), tableName) as T[];
    const selected = predicate ? rows.filter(predicate) : rows;

    return selected.map((row) => this.clone(row));
  }

  selectForTenant<T extends TenantRuntimeDatabaseRow>(
    tableName: RuntimeDatabaseTableName,
    organizationId: string,
    predicate?: (row: T) => boolean
  ): T[] {
    return this.select<T>(
      tableName,
      (row) => row.organizationId === organizationId && (predicate === undefined || predicate(row))
    );
  }

  findById<T extends RuntimeDatabaseRow>(tableName: RuntimeDatabaseTableName, id: string): T | null {
    return this.select<T>(tableName, (row) => row.id === id)[0] ?? null;
  }

  findByIdForTenant<T extends TenantRuntimeDatabaseRow>(
    tableName: RuntimeDatabaseTableName,
    id: string,
    organizationId: string
  ): T | null {
    return this.selectForTenant<T>(tableName, organizationId, (row) => row.id === id)[0] ?? null;
  }

  clear(): void {
    this.persistSnapshot(this.emptySnapshot());
  }

  createBackup(): RuntimeDatabaseBackup {
    return createRuntimeDatabaseBackup(this.loadSnapshot());
  }

  writeBackup(filePath: string): RuntimeDatabaseBackup {
    const backup = this.createBackup();
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, stableStringify(backup), "utf8");
    return backup;
  }

  restoreBackup(backup: unknown): RuntimeDatabaseBackup {
    const validation = validateRuntimeDatabaseBackup(backup);

    if (!validation.valid) {
      throw new Error(`Invalid runtime database backup: ${validation.issues.join("; ")}`);
    }

    const normalized = normalizeBackup(backup as RuntimeDatabaseBackup);
    this.persistSnapshot(normalized.data);
    return normalized;
  }

  restoreBackupFromFile(filePath: string): RuntimeDatabaseBackup {
    return this.restoreBackup(JSON.parse(readFileSync(filePath, "utf8")) as unknown);
  }

  getPath(): string {
    return this.filePath;
  }

  private loadSnapshot(): RuntimeDatabaseSnapshot {
    if (!existsSync(this.filePath)) {
      return this.emptySnapshot();
    }

    const parsed = JSON.parse(readFileSync(this.filePath, "utf8")) as Partial<RuntimeDatabaseSnapshot>;
    const snapshot = this.emptySnapshot();

    for (const tableName of TABLE_NAMES) {
      const rows = parsed[tableName];
      snapshot[tableName] = Array.isArray(rows) ? rows : [];
    }

    return snapshot;
  }

  private persistSnapshot(snapshot: RuntimeDatabaseSnapshot): void {
    mkdirSync(dirname(this.filePath), { recursive: true });

    const temporaryPath = join(
      dirname(this.filePath),
      `${Date.now()}-${Math.random().toString(16).slice(2)}.tmp`
    );

    writeFileSync(temporaryPath, stableStringify(snapshot), "utf8");
    renameSync(temporaryPath, this.filePath);
  }

  private table(
    snapshot: RuntimeDatabaseSnapshot,
    tableName: RuntimeDatabaseTableName
  ): RuntimeDatabaseRow[] {
    return snapshot[tableName];
  }

  private emptySnapshot(): RuntimeDatabaseSnapshot {
    return TABLE_NAMES.reduce((snapshot, tableName) => {
      snapshot[tableName] = [];
      return snapshot;
    }, {} as RuntimeDatabaseSnapshot);
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}

export function createRuntimeDatabaseBackup(snapshot: Partial<RuntimeDatabaseSnapshot>): RuntimeDatabaseBackup {
  return {
    metadata: {
      format: RUNTIME_DATABASE_BACKUP_FORMAT,
      schemaVersion: RUNTIME_DATABASE_SCHEMA_VERSION,
      source: "runtime-database",
      tables: [...TABLE_NAMES]
    },
    data: normalizeSnapshot(snapshot)
  };
}

export function validateRuntimeDatabaseBackup(value: unknown): RuntimeDatabaseBackupValidationResult {
  const issues: string[] = [];

  if (!isRecord(value)) {
    return { valid: false, issues: ["backup must be an object"] };
  }

  if (!isRecord(value.metadata)) {
    issues.push("metadata must be an object");
  } else {
    if (value.metadata.format !== RUNTIME_DATABASE_BACKUP_FORMAT) {
      issues.push("metadata.format is not supported");
    }

    if (value.metadata.schemaVersion !== RUNTIME_DATABASE_SCHEMA_VERSION) {
      issues.push("metadata.schemaVersion is not supported");
    }

    if (!Array.isArray(value.metadata.tables)) {
      issues.push("metadata.tables must be an array");
    }
  }

  if (!isRecord(value.data)) {
    issues.push("data must be an object");
  } else {
    validateBackupTables(value.data, issues);
    validateTenantBoundaries(value.data, issues);
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

function validateBackupTables(data: Record<string, unknown>, issues: string[]): void {
  const allowedTables = new Set(TABLE_NAMES);

  for (const tableName of Object.keys(data)) {
    if (!allowedTables.has(tableName as RuntimeDatabaseTableName)) {
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

function validateTenantBoundaries(data: Record<string, unknown>, issues: string[]): void {
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

function validateReferenceTenant(
  data: Record<string, unknown>,
  issues: string[],
  tableName: RuntimeDatabaseTableName,
  referenceKey: string,
  referenceTableName: RuntimeDatabaseTableName
): void {
  const referenceRows = new Map(rowsFor(data, referenceTableName).map((row) => [row.id, row]));

  for (const row of rowsFor(data, tableName)) {
    const referenceId = row[referenceKey];

    if (typeof referenceId !== "string") {
      continue;
    }

    const referenced = referenceRows.get(referenceId);

    if (!referenced) {
      issues.push(`data.${tableName} row ${row.id} references missing ${referenceTableName} ${referenceId}`);
      continue;
    }

    if (row.organizationId !== referenced.organizationId) {
      issues.push(`data.${tableName} row ${row.id} crosses tenant boundary via ${referenceKey}`);
    }
  }
}

function normalizeBackup(backup: RuntimeDatabaseBackup): RuntimeDatabaseBackup {
  return createRuntimeDatabaseBackup(backup.data);
}

function normalizeSnapshot(snapshot: Partial<RuntimeDatabaseSnapshot>): RuntimeDatabaseSnapshot {
  return TABLE_NAMES.reduce((normalized, tableName) => {
    const rows = snapshot[tableName];
    normalized[tableName] = Array.isArray(rows) ? sortRows(rows.map((row) => sortValue(row) as RuntimeDatabaseRow)) : [];
    return normalized;
  }, {} as RuntimeDatabaseSnapshot);
}

function sortRows(rows: RuntimeDatabaseRow[]): RuntimeDatabaseRow[] {
  return rows.sort((left, right) => rowSortKey(left).localeCompare(rowSortKey(right)));
}

function rowSortKey(row: RuntimeDatabaseRow): string {
  const tenant = isRecord(row) && typeof row.organizationId === "string" ? row.organizationId : "";
  const createdAt = isRecord(row) && typeof row.createdAt === "string" ? row.createdAt : "";
  return `${tenant}:${createdAt}:${row.id}`;
}

function rowsFor(data: Record<string, unknown>, tableName: RuntimeDatabaseTableName): Record<string, unknown>[] {
  const rows = data[tableName];
  return Array.isArray(rows) ? rows.filter(isRecord) : [];
}

function stableStringify(value: unknown): string {
  return `${JSON.stringify(sortValue(value), null, 2)}\n`;
}

function sortValue(value: unknown): unknown {
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
    }, {} as Record<string, unknown>);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

let defaultRuntimeDatabase: FileBackedRuntimeDatabase | undefined;

export function getDefaultRuntimeDatabase(): FileBackedRuntimeDatabase {
  defaultRuntimeDatabase ??= new FileBackedRuntimeDatabase();
  return defaultRuntimeDatabase;
}

export function resetRuntimeDatabaseForTests(filePath = join(tmpdir(), "laborator-runtime-db-test.json")): FileBackedRuntimeDatabase {
  defaultRuntimeDatabase = new FileBackedRuntimeDatabase(filePath);
  defaultRuntimeDatabase.clear();
  return defaultRuntimeDatabase;
}
