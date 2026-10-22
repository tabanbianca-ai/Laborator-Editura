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

const runtimeDatabase = loadTypescriptModule(
  join(repositoryRoot, "packages", "db", "src", "runtime-database.ts")
);
const repositoryModule = loadTypescriptModule(join(workflowRoot, "workflow.repository.ts"), {
  "@laborator/db": runtimeDatabase,
  "../runtime-database.provider": { RUNTIME_DATABASE: "RUNTIME_DATABASE" }
});
const evaluatorModule = loadTypescriptModule(join(workflowRoot, "workflow-rule-evaluator.ts"), {
  "./workflow.types": {}
});
const serviceModule = loadTypescriptModule(join(workflowRoot, "workflow-definition.service.ts"), {
  "../documents/documents.service": { DocumentsService: class DocumentsService {} },
  "../projects/projects.service": { ProjectsService: class ProjectsService {} },
  "./workflow-rule-evaluator": evaluatorModule,
  "./workflow.repository": repositoryModule,
  "./workflow.types": {}
});

const { FileBackedRuntimeDatabase } = runtimeDatabase;
const { InMemoryWorkflowRepository } = repositoryModule;
const { WorkflowRuleEvaluator } = evaluatorModule;
const { WorkflowDefinitionService } = serviceModule;

function createHarness(t) {
  const directory = mkdtempSync(join(tmpdir(), "laborator-configurable-workflow-"));
  const databasePath = join(directory, "runtime-db.json");
  t.after(() => rmSync(directory, { force: true, recursive: true }));
  const database = new FileBackedRuntimeDatabase(databasePath);
  const repository = new InMemoryWorkflowRepository(database);
  const projectsService = {
    async getProject(actor, projectId) {
      if (actor.organizationId !== "organization-a" || projectId !== "project-a") {
        throw new Error("project not found");
      }
      return { id: projectId, organizationId: actor.organizationId };
    }
  };
  const documentsService = {
    async getDocument(actor, documentId) {
      if (actor.organizationId !== "organization-a" || documentId !== "document-a") {
        throw new Error("document not found");
      }
      return { id: documentId, organizationId: actor.organizationId, projectId: "project-a" };
    }
  };
  return {
    database,
    databasePath,
    repository,
    service: new WorkflowDefinitionService(
      repository,
      new WorkflowRuleEvaluator(),
      projectsService,
      documentsService
    )
  };
}

const admin = {
  userId: "admin-a",
  organizationId: "organization-a",
  roles: ["ADMIN"]
};
const editor = {
  userId: "editor-a",
  organizationId: "organization-a",
  roles: ["EDITOR"]
};
const reviewer = {
  userId: "reviewer-a",
  organizationId: "organization-a",
  roles: ["REVIEWER"]
};

function createVersionInput() {
  return {
    stages: [
      {
        id: "editing",
        name: "Editing",
        order: 1,
        initial: true,
        responsibleRoles: ["EDITOR"]
      },
      {
        id: "review",
        name: "Review",
        order: 2,
        responsibleRoles: ["REVIEWER"],
        approval: { minimumApprovals: 1, required: true, roles: ["REVIEWER"] }
      },
      {
        id: "complete",
        name: "Complete",
        order: 3,
        final: true,
        responsibleRoles: ["EDITOR", "REVIEWER"]
      }
    ],
    transitions: [
      {
        id: "submit-review",
        action: "SUBMIT_REVIEW",
        fromStageId: "editing",
        toStageId: "review",
        allowedRoles: ["EDITOR"],
        rules: [
          {
            id: "metadata-ready",
            name: "Metadata is complete",
            if: { condition: { fact: "context.metadataComplete", operator: "EQUALS", value: true } },
            then: { outcome: "ALLOW" },
            else: { outcome: "BLOCK", reason: "Metadata is incomplete." }
          }
        ]
      },
      {
        id: "complete-review",
        action: "COMPLETE_REVIEW",
        fromStageId: "review",
        toStageId: "complete",
        allowedRoles: ["REVIEWER"],
        rules: []
      }
    ]
  };
}

async function activateDefinition(service) {
  const definition = service.createDefinition(admin, {
    key: "editorial.book",
    name: "Editorial book workflow",
    category: "EDITORIAL"
  });
  const versionInput = createVersionInput();
  const version = service.createVersion(admin, definition.id, versionInput);
  versionInput.stages[0].name = "Mutated outside service";
  assert.equal(service.listVersions(admin, definition.id)[0].stages[0].name, "Editing");
  return { definition, version: service.activateVersion(admin, definition.id, version.id) };
}

test("configuration is admin-only, tenant-scoped and rejects machine approval roles", (t) => {
  const { service } = createHarness(t);
  assert.throws(
    () => service.createDefinition(editor, { key: "editorial.book", name: "Book", category: "EDITORIAL" }),
    /administrative authority/u
  );
  assert.throws(
    () => service.createDefinition(
      { ...admin, roles: ["ADMIN", "AI_AGENT"] },
      { key: "editorial.ai", name: "AI workflow", category: "EDITORIAL" }
    ),
    /cannot configure workflows/u
  );
  const definition = service.createDefinition(admin, {
    key: "editorial.book",
    name: "Book",
    category: "EDITORIAL"
  });
  const machineVersion = createVersionInput();
  machineVersion.stages[1].approval.roles = ["AI_AGENT"];
  assert.throws(() => service.createVersion(admin, definition.id, machineVersion), /only human roles/u);
  assert.deepEqual(
    service.listDefinitions({ userId: "admin-b", organizationId: "organization-b", roles: ["ADMIN"] }),
    []
  );
});

test("version-bound workflow evaluates rules and requires human role approval", async (t) => {
  const { service } = createHarness(t);
  const { definition, version } = await activateDefinition(service);
  assert.throws(() => service.activateVersion(admin, definition.id, version.id), /Only draft/u);

  const instance = await service.startInstance(editor, {
    workflowDefinitionId: definition.id,
    projectId: "project-a",
    documentId: "document-a",
    scopeType: "DOCUMENT",
    scopeId: "document-a"
  });
  assert.equal(instance.workflowVersionId, version.id);
  assert.throws(
    () => service.transitionInstance(editor, instance.id, { transitionId: "submit-review", context: {} }),
    /Metadata is incomplete/u
  );
  const inReview = service.transitionInstance(editor, instance.id, {
    transitionId: "submit-review",
    context: { metadataComplete: true }
  });
  assert.equal(inReview.currentStageId, "review");
  assert.throws(
    () => service.transitionInstance(reviewer, instance.id, { transitionId: "complete-review" }),
    /human workflow approvals/u
  );
  assert.throws(
    () => service.recordApproval(
      { ...reviewer, roles: ["REVIEWER", "AI_AGENT"] },
      instance.id,
      { decision: "GRANTED" }
    ),
    /cannot record workflow approvals/u
  );
  service.recordApproval(reviewer, instance.id, { decision: "GRANTED", reason: "Editorial review complete." });
  const completed = service.transitionInstance(reviewer, instance.id, {
    transitionId: "complete-review"
  });
  assert.equal(completed.status, "COMPLETED");
  assert.equal(completed.currentStageId, "complete");
});

test("workflow configuration, decisions and audit survive runtime database reload", async (t) => {
  const { database, databasePath, service } = createHarness(t);
  const { definition } = await activateDefinition(service);
  const instance = await service.startInstance(editor, {
    workflowDefinitionId: definition.id,
    projectId: "project-a",
    documentId: "document-a",
    scopeType: "DOCUMENT",
    scopeId: "document-a"
  });
  service.transitionInstance(editor, instance.id, {
    transitionId: "submit-review",
    context: { metadataComplete: true }
  });
  service.recordApproval(reviewer, instance.id, { decision: "GRANTED" });

  const reloadedDatabase = new FileBackedRuntimeDatabase(databasePath);
  const reloadedRepository = new InMemoryWorkflowRepository(reloadedDatabase);
  assert.equal(reloadedRepository.findInstanceById("organization-a", instance.id)?.currentStageId, "review");
  assert.equal(reloadedRepository.listApprovals("organization-a", instance.id, "review").length, 1);
  assert.equal(reloadedRepository.findInstanceById("organization-b", instance.id), null);
  assert.ok(database.select("workflow_configuration_audit_events").length >= 5);
  assert.equal(database.select("workflow_instance_transitions").length, 1);
});

test("workflow scope references are validated before an instance is created", async (t) => {
  const { service } = createHarness(t);
  const { definition } = await activateDefinition(service);
  await assert.rejects(
    service.startInstance(editor, {
      workflowDefinitionId: definition.id,
      projectId: "project-a",
      documentId: "document-a",
      scopeType: "DOCUMENT",
      scopeId: "different-document"
    }),
    /matching document scope/u
  );
  await assert.rejects(
    service.startInstance(
      { ...editor, organizationId: "organization-b" },
      {
        workflowDefinitionId: definition.id,
        projectId: "project-a",
        documentId: "document-a",
        scopeType: "DOCUMENT",
        scopeId: "document-a"
      }
    ),
    /document not found/u
  );
});
