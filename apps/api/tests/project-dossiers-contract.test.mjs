import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");
const repoRoot = join(apiRoot, "..", "..");

function readApi(path) {
  return readFileSync(join(apiRoot, path), "utf8");
}

function readRepo(path) {
  return readFileSync(join(repoRoot, path), "utf8");
}

test("Project Dossiers are project-scoped within the existing Projects module", () => {
  const types = readApi("src/modules/projects/projects.types.ts");
  const controller = readApi("src/modules/projects/projects.controller.ts");
  const service = readApi("src/modules/projects/projects.service.ts");

  assert.match(types, /ProjectDossier/);
  assert.match(types, /ProjectDossierItem/);
  assert.match(controller, /@Get\(":id\/dossiers"\)/);
  assert.match(controller, /@Post\(":id\/dossiers"\)/);
  assert.match(controller, /@Post\(":id\/dossier-items"\)/);
  assert.match(service, /assertDossierBelongsToProject/);
  assert.match(service, /projectId/);
});

test("default dossiers are created for every project", () => {
  const service = readApi("src/modules/projects/projects.service.ts");

  for (const dossierName of [
    "Original",
    "Manuscript",
    "Documentation",
    "Translations",
    "Review",
    "Contracts",
    "Images",
    "Audio",
    "Video",
    "Exports",
    "Publishing"
  ]) {
    assert.match(service, new RegExp(`"${dossierName}"`));
  }

  assert.match(service, /ensureDefaultDossiers\(actor, project\.id\)/);
  assert.match(service, /dossierType: "DEFAULT"/);
});

test("custom dossiers sub-dossiers item assignment and audit are supported", () => {
  const types = readApi("src/modules/projects/projects.types.ts");
  const service = readApi("src/modules/projects/projects.service.ts");
  const repository = readApi("src/modules/projects/projects.repository.ts");

  assert.match(types, /parentDossierId\?: string/);
  assert.match(types, /itemType: ProjectDossierItemType/);
  assert.match(types, /"MANUSCRIPT"/);
  assert.match(types, /"RESEARCH_FILE"/);
  assert.match(types, /"PUBLISHING_FILE"/);
  assert.match(repository, /project_dossiers/);
  assert.match(repository, /project_dossier_items/);
  assert.match(repository, /PROJECT_DOSSIER/);
  assert.match(repository, /PROJECT_DOSSIER_ITEM/);
  assert.match(service, /DOSSIER_CREATED/);
  assert.match(service, /DOSSIER_ITEM_ASSIGNED/);
  assert.match(service, /PROJECT_DOSSIER_ITEM/);
});

test("runtime database and backup include project dossier tables", () => {
  const runtimeDatabase = readRepo("packages/db/src/runtime-database.ts");
  const runtimeBackup = readRepo("packages/db/scripts/runtime-backup-lib.mjs");

  for (const tableName of ["project_dossiers", "project_dossier_items"]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
  }
});
