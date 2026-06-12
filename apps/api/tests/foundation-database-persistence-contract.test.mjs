import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..", "..");
const moduleDir = join(__dirname, "..", "src", "modules");

function readModule(moduleName, fileName) {
  return readFileSync(join(moduleDir, moduleName, fileName), "utf8");
}

function readRoot(path) {
  return readFileSync(join(repoRoot, path), "utf8");
}

const foundationRepositories = [
  ["auth", "DatabaseAuthRepository"],
  ["projects", "DatabaseProjectsRepository"],
  ["documents", "DatabaseDocumentsRepository"],
  ["segments", "DatabaseSegmentsRepository"],
  ["translations", "DatabaseTranslationsRepository"],
  ["export", "DatabaseExportRepository"]
];

test("foundation repositories use database-backed persistence instead of process memory", () => {
  for (const [moduleName, className] of foundationRepositories) {
    const source = readModule(moduleName, `${moduleName}.repository.ts`);

    assert.match(source, new RegExp(`export class ${className}`));
    assert.match(source, /getDefaultRuntimeDatabase/);
    assert.match(source, /FileBackedRuntimeDatabase/);
    assert.doesNotMatch(source, /new Map|private readonly .* = new Map|private readonly .*\\[\\] = \\[\\]/);
  }
});

test("foundation modules inject database repositories into API execution", () => {
  for (const [moduleName, className] of foundationRepositories) {
    const moduleSource = readModule(moduleName, `${moduleName}.module.ts`);
    const serviceSource = readModule(moduleName, `${moduleName}.service.ts`);

    assert.match(moduleSource, new RegExp(className));
    assert.match(moduleSource, new RegExp(`providers: \\[${className}`));
    assert.match(serviceSource, new RegExp(`private readonly repository: ${className}`));
  }
});

test("runtime database persists state across repository instances through a file-backed snapshot", () => {
  const databaseSource = readRoot("packages/db/src/runtime-database.ts");

  assert.match(databaseSource, /class FileBackedRuntimeDatabase/);
  assert.match(databaseSource, /readFileSync/);
  assert.match(databaseSource, /writeFileSync/);
  assert.match(databaseSource, /renameSync/);
  assert.match(databaseSource, /loadSnapshot/);
  assert.match(databaseSource, /persistSnapshot/);
  assert.match(databaseSource, /getDefaultRuntimeDatabase/);

  for (const [moduleName] of foundationRepositories) {
    const repositorySource = readModule(moduleName, `${moduleName}.repository.ts`);

    assert.match(repositorySource, /constructor\(private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase\(\)\)/);
  }
});

test("foundation repositories exercise tenant-scoped database access", () => {
  const expectations = [
    ["projects", /findByIdForTenant<Project>\("projects"/, /selectForTenant<Project>\("projects"/],
    ["documents", /findByIdForTenant<Document>\("documents"/, /selectForTenant<Document>\(\s*"documents"/],
    ["segments", /findByIdForTenant<Segment>\("document_segments"/, /selectForTenant<Segment>\(\s*"document_segments"/],
    ["translations", /selectForTenant<SegmentTranslation>\(\s*"segment_translations"/, /organizationId/],
    ["export", /findByIdForTenant<ExportArtifact>\("export_artifacts"/, /selectForTenant<ExportAuditEvent>/]
  ];

  for (const [moduleName, lookupPattern, listPattern] of expectations) {
    const source = readModule(moduleName, `${moduleName}.repository.ts`);

    assert.match(source, lookupPattern);
    assert.match(source, listPattern);
  }

  const authSource = readModule("auth", "auth.repository.ts");
  assert.match(authSource, /selectForTenant<UserRoleRow>/);
  assert.match(authSource, /selectForTenant<AuthAuditEvent>/);
});

test("database package is wired into the API without trusting client identity headers", () => {
  const packageJson = readRoot("apps/api/package.json");
  const tsconfig = readRoot("apps/api/tsconfig.json");

  assert.match(packageJson, /"@laborator\/db": "workspace:\*"/);
  assert.match(tsconfig, /"@laborator\/db": \["\.\.\/\.\.\/packages\/db\/src"\]/);

  for (const [moduleName] of foundationRepositories) {
    const source = readModule(moduleName, `${moduleName}.repository.ts`);

    assert.doesNotMatch(source, /x-user-id|x-organization-id|x-user-roles|@Headers\(/);
  }
});
