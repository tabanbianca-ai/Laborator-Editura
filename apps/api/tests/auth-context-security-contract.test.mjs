import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const moduleDir = join(process.cwd(), "apps", "api", "src", "modules");

function readSource(path) {
  return readFileSync(join(moduleDir, path), "utf8");
}

function controllerSources() {
  const sources = [];

  for (const moduleName of readdirSync(moduleDir)) {
    const modulePath = join(moduleDir, moduleName);

    if (!statSync(modulePath).isDirectory()) {
      continue;
    }

    for (const fileName of readdirSync(modulePath)) {
      if (fileName.endsWith(".controller.ts")) {
        sources.push({
          fileName: `${moduleName}/${fileName}`,
          source: readFileSync(join(modulePath, fileName), "utf8")
        });
      }
    }
  }

  return sources;
}

test("request context middleware derives identity from validated session or bearer token", () => {
  const source = readSource("auth/request-context.middleware.ts");

  assert.match(source, /authService\.getCurrentActor\(token\)/);
  assert.match(source, /request\.authContext = \{/);
  assert.match(source, /permissions: permissionsForRoles\(actor\.roles\)/);
  assert.match(source, /authorization/);
  assert.match(source, /"x-session-token"/);
  assert.match(source, /UnauthorizedException/);
  assert.match(source, /resolveActor\(token\)/);
  assert.match(source, /catch\s*\{/);
});

test("spoofed user organization and role headers are not trusted by controllers", () => {
  for (const { fileName, source } of controllerSources()) {
    assert.doesNotMatch(source, /x-user-id/, `${fileName} must not read x-user-id`);
    assert.doesNotMatch(source, /x-organization-id/, `${fileName} must not read x-organization-id`);
    assert.doesNotMatch(source, /x-user-roles/, `${fileName} must not read x-user-roles`);
  }
});

test("controllers use only centralized server-derived request context", () => {
  for (const { fileName, source } of controllerSources()) {
    if (fileName === "health.controller.ts" || fileName === "auth/auth.controller.ts") {
      continue;
    }

    assert.match(source, /CurrentActor/, `${fileName} must use CurrentActor`);
    assert.match(source, /AuthenticatedRequestContext/, `${fileName} must use authenticated context type`);
  }
});

test("spoofed role input cannot grant admin or reviewer access", () => {
  const authService = readSource("auth/auth.service.ts");
  const workflowController = readSource("workflow/workflow.controller.ts");
  const exportController = readSource("export/export.controller.ts");

  assert.doesNotMatch(authService, /input\.roles && input\.roles\.length/);
  assert.match(authService, /const DEFAULT_ROLES: MvpRole\[] = \["TRANSLATOR"\]/);
  assert.doesNotMatch(workflowController, /x-user-roles/);
  assert.doesNotMatch(exportController, /x-user-roles/);
});

test("valid authenticated context keeps RBAC and permissions available", () => {
  const requestContext = readSource("auth/request-context.types.ts");
  const workflowService = readSource("workflow/workflow.service.ts");

  assert.match(requestContext, /permissionsForRoles/);
  assert.match(requestContext, /"review:approve"/);
  assert.match(requestContext, /"export:write"/);
  assert.match(workflowService, /HUMAN_APPROVAL_ROLES/);
  assert.match(workflowService, /actor\.roles/);
});

test("tenant isolation remains driven by authenticated organizationId", () => {
  const projectRepository = readSource("projects/projects.repository.ts");
  const documentRepository = readSource("documents/documents.repository.ts");
  const segmentRepository = readSource("segments/segments.repository.ts");
  const exportRepository = readSource("export/export.repository.ts");

  for (const source of [projectRepository, documentRepository, segmentRepository, exportRepository]) {
    assert.match(source, /organizationId/);
  }
});
