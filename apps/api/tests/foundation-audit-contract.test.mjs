import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules");

function readModule(moduleName, fileName) {
  return readFileSync(join(moduleDir, moduleName, fileName), "utf8");
}

test("auth foundation mutations write audit events without client identity", () => {
  const service = readModule("auth", "auth.service.ts");
  const repository = readModule("auth", "auth.repository.ts");

  assert.match(repository, /appendAuditEvent\(event: AuthAuditEvent\)/);
  assert.match(repository, /getAuditEvents\(organizationId: string\)/);
  assert.match(service, /this\.audit\("CREATE", actor, "AUTH_ORGANIZATION"/);
  assert.match(service, /this\.audit\("CREATE", actor, "AUTH_USER"/);
  assert.match(service, /this\.audit\("UPDATE", actor, "USER_ROLE"/);
  assert.match(service, /this\.audit\("CREATE", actor, "AUTH_SESSION"/);
  assert.doesNotMatch(service, /x-user-id|x-organization-id|x-user-roles/);
});

test("project document segment and translation mutations write audit events", () => {
  const projects = readModule("projects", "projects.service.ts");
  const documents = readModule("documents", "documents.service.ts");
  const segments = readModule("segments", "segments.service.ts");
  const translations = readModule("translations", "translations.service.ts");

  assert.match(projects, /this\.audit\("CREATE", actor, project\.id/);
  assert.match(projects, /appendAuditEvent/);
  assert.match(documents, /this\.audit\("CREATE", actor, document\.id/);
  assert.match(documents, /actionForStatus\(status\)/);
  assert.match(documents, /return "APPROVE"/);
  assert.match(documents, /return "EXPORT"/);
  assert.match(segments, /this\.audit\("CREATE", actor, segment\.id/);
  assert.match(segments, /this\.audit\("UPDATE", actor, saved\.id/);
  assert.match(translations, /this\.audit\("CREATE", actor, translation\.id/);
});

test("export mutation writes audit event and embeds foundation audit in JSON Master", () => {
  const service = readModule("export", "export.service.ts");
  const repository = readModule("export", "export.repository.ts");

  assert.match(repository, /appendAuditEvent\(event: ExportAuditEvent\)/);
  assert.match(service, /const exportAuditEvent: ExportAuditEvent = \{/);
  assert.match(service, /action: "EXPORT"/);
  assert.match(service, /this\.repository\.appendAuditEvent\(exportAuditEvent\)/);
  assert.match(service, /collectFoundationAuditEvents/);
  assert.match(service, /authService\.getAuditEvents/);
  assert.match(service, /projectsService\.getAuditEvents/);
  assert.match(service, /documentsService\.getAuditEvents/);
  assert.match(service, /segmentsService\.getAuditEvents/);
  assert.match(service, /translationsService\.getAuditEvents/);
  assert.match(service, /audit: \{\s*events: auditEvents\s*\}/);
});

test("foundation audit uses server-derived actor fields only", () => {
  for (const moduleName of ["projects", "documents", "segments", "translations", "export"]) {
    const service = readModule(moduleName, `${moduleName}.service.ts`);

    assert.match(service, /actor\.userId/);
    assert.match(service, /actor\.organizationId/);
    assert.doesNotMatch(service, /x-user-id|x-organization-id|x-user-roles/);
  }
});
