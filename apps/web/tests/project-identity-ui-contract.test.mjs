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

test("Project Identity route and form replace generic project creation", () => {
  const route = readSource("app/projects/new/page.tsx");
  const page = readSource("components/pages/project-identity-new-page.tsx");
  const form = readSource("components/projects/project-identity-form.tsx");
  const projectsPage = readSource("components/pages/projects-page.tsx");

  assert.match(route, /getWorkspacePreferences/);
  assert.match(page, /ProjectIdentityForm/);
  assert.match(page, /createProjectAction/);
  assert.match(form, /projectOriginValues/);
  assert.match(form, /rightsStatusValues/);
  assert.match(form, /requiresOriginalAuthor/);
  assert.match(form, /projectOrigin !== "ORIGINAL_CREATION"/);
  assert.match(form, /publicDomainSelected/);
  assert.match(form, /project\.publicDomainNotice/);
  assert.match(projectsPage, /href="\/projects\/new"/);
});

test("Project Identity frontend uses Platform Language and keeps editorial language fields separate", () => {
  const i18n = readSource("lib/ui-i18n.ts");
  const form = readSource("components/projects/project-identity-form.tsx");

  for (const key of [
    "label.projectIdentity",
    "project.origin",
    "project.rightsStatus",
    "project.originalAuthor",
    "project.publicDomainNotice",
    "action.createProject"
  ]) {
    assert.match(i18n, new RegExp(key.replace(".", "\\.")));
    assert.match(form, new RegExp(key.replace(".", "\\.")));
  }

  assert.match(form, /sourceLanguage/);
  assert.match(form, /targetLanguage/);
  assert.match(form, /originalAuthorLanguage/);
  assert.doesNotMatch(form, /setTargetLanguage|setSourceLanguage|setOriginalLanguage/);
});

test("Project Identity posts through server action and is visible in project publishing surfaces", () => {
  const actions = readSource("lib/projects-actions.ts");
  const api = readSource("lib/projects-documents-api.ts");
  const distribution = readSource("components/pages/distribution-center-page.tsx");
  const publishing = readSource("components/pages/publishing-workspace-page.tsx");
  const pipelineClient = readSource("lib/editorial-pipeline-client.ts");

  assert.match(api, /projectIdentity: \{/);
  assert.match(api, /ProjectOrigin/);
  assert.match(actions, /createProject\(\{/);
  assert.match(actions, /projectIdentity: \{/);
  assert.match(actions, /redirect\(`\/pipeline\/\$\{result\.data\.id\}`\)/);
  assert.match(distribution, /selectedProject\?\.projectIdentity/);
  assert.match(publishing, /selectedProject\?\.projectIdentity/);
  assert.match(pipelineClient, /Project Identity is required before entering the editorial process/);
});
