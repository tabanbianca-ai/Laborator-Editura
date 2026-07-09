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

test("project creation captures Editorial Domain and optional Editorial Classification", () => {
  const form = readSource("components/projects/project-identity-form.tsx");
  const i18n = readSource("lib/ui-i18n.ts");

  assert.match(form, /editorialDomainValues/);
  assert.match(form, /name="editorialDomain"/);
  assert.match(form, /<details className="content-panel">/);
  assert.match(form, /name="editorialSeries"/);
  assert.match(form, /name="editorialCollection"/);
  assert.match(form, /name="editorialVolume"/);

  for (const key of [
    "project.editorialDomain",
    "project.editorialDomainHelp",
    "project.editorialClassification",
    "project.editorialClassificationHelp",
    "project.editorialSeries",
    "project.editorialCollection",
    "project.editorialVolume",
    "project.domainSpiritism",
    "project.domainChildrenEducational"
  ]) {
    assert.match(i18n, new RegExp(key.replace(".", "\\.")));
    assert.match(form, new RegExp(key.replace(".", "\\.")));
  }
});

test("Editorial Taxonomy posts through the existing project server action and API client", () => {
  const actions = readSource("lib/projects-actions.ts");
  const api = readSource("lib/projects-documents-api.ts");

  assert.match(api, /ProjectEditorialDomain/);
  assert.match(api, /ProjectEditorialClassificationRecord/);
  assert.match(api, /editorialDomain: ProjectEditorialDomain/);
  assert.match(api, /editorialClassification\?: ProjectEditorialClassificationRecord/);
  assert.match(actions, /readRequiredString\(formData, "editorialDomain"\) as ProjectEditorialDomain/);
  assert.match(actions, /editorialCollection/);
  assert.match(actions, /editorialSeries/);
  assert.match(actions, /editorialVolume/);
});

test("Editorial Taxonomy is visible in project surfaces and gates the pipeline", () => {
  const projectsPage = readSource("components/pages/projects-page.tsx");
  const projectDetail = readSource("components/pages/project-detail-page.tsx");
  const pipelineClient = readSource("lib/editorial-pipeline-client.ts");

  assert.match(projectsPage, /formatEditorialDomain/);
  assert.match(projectsPage, /project\.editorialDomain/);
  assert.match(projectDetail, /formatEditorialDomain/);
  assert.match(projectDetail, /formatEditorialClassification/);
  assert.match(projectDetail, /project\.editorialClassification/);
  assert.match(pipelineClient, /getProjectEditorialDomain/);
  assert.match(pipelineClient, /Editorial taxonomy is required before entering the editorial process/);
  assert.match(pipelineClient, /Publication Type, Editorial Domain, and Project Capabilities/);
});
