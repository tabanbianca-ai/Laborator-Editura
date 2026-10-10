import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(testDirectory, "..", "..", "..");
const workflowRoot = join(repositoryRoot, "apps", "api", "src", "modules", "workflow");
const runtimeDatabasePath = join(
  repositoryRoot,
  "packages",
  "db",
  "src",
  "runtime-database.ts"
);

function loadTypescriptModule(filePath, mocks = {}) {
  const output = ts.transpileModule(readFileSync(filePath, "utf8"), {
    compilerOptions: {
      esModuleInterop: true,
      experimentalDecorators: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: filePath
  }).outputText;
  const module = { exports: {} };
  const localRequire = (specifier) =>
    Object.hasOwn(mocks, specifier) ? mocks[specifier] : require(specifier);

  new Function("exports", "require", "module", "__filename", "__dirname", output)(
    module.exports,
    localRequire,
    module,
    filePath,
    dirname(filePath)
  );

  return module.exports;
}

const runtimeDatabase = loadTypescriptModule(runtimeDatabasePath);
const repositoryModule = loadTypescriptModule(
  join(workflowRoot, "workflow.repository.ts"),
  {
    "@laborator/db": runtimeDatabase,
    "../runtime-database.provider": { RUNTIME_DATABASE: "RUNTIME_DATABASE" }
  }
);
const { FileBackedRuntimeDatabase } = runtimeDatabase;
const { InMemoryWorkflowRepository } = repositoryModule;

test("workflow state transitions and audit events persist across database reloads", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "laborator-workflow-persistence-"));
  const databasePath = join(directory, "runtime-db.json");
  t.after(() => rmSync(directory, { force: true, recursive: true }));

  const organizationId = "organization-workflow-a";
  const createdAt = "2026-10-10T00:00:00.000Z";
  const state = {
    id: "workflow-state-a",
    organizationId,
    projectId: "project-a",
    documentId: "document-a",
    scope: "DOCUMENT",
    status: "DRAFT",
    createdBy: "author-a",
    updatedBy: "author-a",
    createdAt,
    updatedAt: createdAt
  };

  const initialDatabase = new FileBackedRuntimeDatabase(databasePath);
  const initialRepository = new InMemoryWorkflowRepository(initialDatabase);
  await initialRepository.createState(state);

  assert.deepEqual(
    await initialRepository.findStateByTarget({
      organizationId,
      projectId: "project-a",
      documentId: "document-a"
    }),
    state
  );
  assert.equal(
    await initialRepository.findStateByTarget({
      organizationId: "organization-workflow-b",
      projectId: "project-a",
      documentId: "document-a"
    }),
    null
  );

  const reloadedRepository = new InMemoryWorkflowRepository(
    new FileBackedRuntimeDatabase(databasePath)
  );
  assert.equal(
    (
      await reloadedRepository.findStateByTarget({
        organizationId,
        projectId: "project-a",
        documentId: "document-a"
      })
    )?.status,
    "DRAFT"
  );

  const updatedAt = "2026-10-10T00:01:00.000Z";
  await reloadedRepository.updateState({
    ...state,
    status: "IN_TRANSLATION",
    previousStatus: "DRAFT",
    updatedBy: "translator-a",
    updatedAt
  });
  await reloadedRepository.appendTransition({
    id: "workflow-transition-a",
    organizationId,
    workflowStateId: state.id,
    projectId: state.projectId,
    documentId: state.documentId,
    scope: state.scope,
    fromStatus: "DRAFT",
    toStatus: "IN_TRANSLATION",
    action: "WORKFLOW_ADVANCED",
    actorId: "translator-a",
    createdAt: updatedAt
  });
  await reloadedRepository.appendAuditEvent({
    id: "workflow-audit-a",
    organizationId,
    workflowStateId: state.id,
    workflowTransitionId: "workflow-transition-a",
    action: "WORKFLOW_ADVANCED",
    actorId: "translator-a",
    beforeState: state,
    afterState: { ...state, status: "IN_TRANSLATION", updatedAt },
    createdAt: updatedAt
  });

  const finalRepository = new InMemoryWorkflowRepository(
    new FileBackedRuntimeDatabase(databasePath)
  );
  assert.equal(
    (
      await finalRepository.findStateByTarget({
        organizationId,
        projectId: "project-a",
        documentId: "document-a"
      })
    )?.status,
    "IN_TRANSLATION"
  );
  assert.equal(finalRepository.getTransitions().length, 1);
  assert.equal(finalRepository.getTransitions()[0].id, "workflow-transition-a");
  assert.equal(finalRepository.getAuditEvents().length, 1);
  assert.equal(finalRepository.getAuditEvents()[0].id, "workflow-audit-a");
});
