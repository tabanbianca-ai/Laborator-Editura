import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const page = readFileSync(
  join(__dirname, "..", "components", "pages", "administration-page.tsx"),
  "utf8"
);

test("administration displays organization management and supported organization types", () => {
  assert.match(page, /Organization Management/);
  assert.match(page, /Organizație, echipe și Creatorul platformei/);

  for (const organizationType of [
    "Persoană fizică",
    "Editură",
    "Asociație / ONG",
    "Companie",
    "Instituție"
  ]) {
    assert.match(page, new RegExp(organizationType));
  }
});

test("administration displays default teams and team assignment scopes", () => {
  for (const teamName of [
    "Echipa Traducere",
    "Echipa Revizie",
    "Echipa Machetare",
    "Echipa Ilustrații",
    "Echipa Multimedia",
    "Echipa Publicare",
    "Echipa Marketing",
    "Echipa Publicitate"
  ]) {
    assert.match(page, new RegExp(teamName));
  }

  for (const scope of ["Proiecte", "Task-uri", "Documente", "Responsabilități workflow"]) {
    assert.match(page, new RegExp(scope));
  }
});

test("administration displays protected platform creator safeguards and audit actions", () => {
  assert.match(page, /Creatorul platformei/);
  assert.match(page, /Acces nelimitat, separat de Administrator/);
  assert.match(page, /Independent de abonament/);
  assert.match(page, /nu poate fi\s+atribuit utilizatorilor obișnuiți/i);

  for (const auditAction of [
    "ADMIN_ORGANIZATION_CREATED",
    "ADMIN_ORGANIZATION_MODIFIED",
    "ADMIN_TEAM_CREATED",
    "ADMIN_TEAM_MODIFIED",
    "ADMIN_MEMBER_ADDED",
    "ADMIN_MEMBER_REMOVED",
    "ADMIN_PLATFORM_CREATOR_ACCESS"
  ]) {
    assert.match(page, new RegExp(auditAction));
  }
});
