import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

test("Project Dossiers UI exists inside project detail, not as a global file manager", () => {
  const route = readSource("app/projects/[projectId]/page.tsx");
  const page = readSource("components/pages/project-detail-page.tsx");
  const projectsPage = readSource("components/pages/projects-page.tsx");

  assert.match(route, /getProjectDossiers/);
  assert.match(route, /listDocuments\(projectId\)/);
  assert.match(page, /label\.projectDossiers/);
  assert.match(page, /dossier\.groupedItems/);
  assert.match(page, /CreateDossierCard/);
  assert.match(page, /CreateSubDossierCard/);
  assert.match(page, /AssignDocumentCard/);
  assert.match(projectsPage, /\/projects\/\$\{encodeURIComponent\(project\.id\)\}/);
});

test("Project Dossiers frontend supports custom dossiers sub-dossiers and document assignment", () => {
  const client = readSource("lib/projects-documents-api.ts");
  const actions = readSource("lib/projects-actions.ts");
  const page = readSource("components/pages/project-detail-page.tsx");

  assert.match(client, /ProjectDossierRecord/);
  assert.match(client, /ProjectDossierItemRecord/);
  assert.match(client, /getProjectDossiers/);
  assert.match(client, /createProjectDossier/);
  assert.match(client, /assignProjectDossierItem/);
  assert.match(actions, /createProjectDossierAction/);
  assert.match(actions, /assignProjectDossierItemAction/);
  assert.match(page, /parentDossierId/);
  assert.match(page, /itemType" type="hidden" value="DOCUMENT"/);
});

test("Project Dossiers labels follow Platform Language and pipeline uses dossiers for import", () => {
  const i18n = readSource("lib/ui-i18n.ts");
  const pipelineClient = readSource("lib/editorial-pipeline-client.ts");

  assert.match(i18n, /"label\.projectDossiers": "Project Dossiers"/);
  assert.match(i18n, /"label\.projectDossiers": "Dosare proiect"/);
  assert.match(i18n, /"dossier\.createSubDossier"/);
  assert.match(pipelineClient, /"Project Dossiers"/);
  assert.match(pipelineClient, /\/projects\/\$\{encodeURIComponent\(project\.id\)\}/);
});
