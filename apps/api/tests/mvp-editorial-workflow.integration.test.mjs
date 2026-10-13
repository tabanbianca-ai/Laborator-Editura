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
const modulesRoot = join(repositoryRoot, "apps", "api", "src", "modules");
const runtimeDatabasePath = join(repositoryRoot, "packages", "db", "src", "runtime-database.ts");
const docxFixture = Buffer.from(
  "UEsDBBQAAAAIAF2sS115bjPX6AAAAK0BAAATABwAW0NvbnRlbnRfVHlwZXNdLnhtbFVUCQAD4uTLauLky2p1eAsAAQT1AQAABBQAAAB9UMlOwzAQ/RVrrihx4IAQitMDyxE4lA8Y2ZPEqjd53NL+PU5bekCF48xb9frV3juxo8w2BgW3bQeCgo7GhknB5/q1eQDBBYNBFwMpOBDDaujXh0QsqjawgrmU9Cgl65k8chsThYqMMXss9cyTTKg3OJG867p7qWMoFEpTFg8Y+mcaceuKeNnX96lHJscgnk7EJUsBpuSsxlJxuQvmV0pzTmir8sjh2Sa+qQSQVxMW5O+As+69DpOtIfGBubyhryz5FbORJuqtr8r2f5srPeM4Wk0X/eKWctTEXBf3rr0gHm346S+Pcw/fUEsDBAoAAAAAAF2sS10AAAAAAAAAAAAAAAAGABwAX3JlbHMvVVQJAAPi5Mtq4uTLanV4CwABBPUBAAAEFAAAAFBLAwQUAAAACABdrEtdm/036q0AAAApAQAACwAcAF9yZWxzLy5yZWxzVVQJAAPi5Mtq4uTLanV4CwABBPUBAAAEFAAAAI3POw7CMAwG4KtE3mlaBoRQ0y4IqSsqB7ASN61oHkrCo7cnAwNFDIy2f3+W6/ZpZnanECdnBVRFCYysdGqyWsClP232wGJCq3B2lgQsFKFt6jPNmPJKHCcfWTZsFDCm5A+cRzmSwVg4TzZPBhcMplwGzT3KK2ri27Lc8fBpwNpknRIQOlUB6xdP/9huGCZJRydvhmz6ceIrkWUMmpKAhwuKq3e7yCzwpuarF5sXUEsDBAoAAAAAAF2sS10AAAAAAAAAAAAAAAAFABwAd29yZC9VVAkAA+Lky2ri5MtqdXgLAAEE9QEAAAQUAAAAUEsDBBQAAAAIAF2sS12/fCGJ+wAAAN0BAAARABwAd29yZC9kb2N1bWVudC54bWxVVAkAA+Lky2ri5MtqdXgLAAEE9QEAAAQUAAAAdZHLTsMwEEV/xfKeTsoCoShxFwjEgkUlygc4ztBY8kvjaUP+niSGIkTZeDTyPWf8aHYf3okzUrYxtHK7qaTAYGJvw7GVb4enm3spMuvQaxcDtnLCLHeqGes+mpPHwGIWhFyPrRyYUw2QzYBe501MGOa990he89zSEcZIfaJoMOfZ7x3cVtUdeG2DXJRd7KelpnXZ01peeXIoxvqsXSufUS8n20pQDVwy68LqYdDJMqFIhN4iLQlec1TSF3ehCtwV1VfH6mXhbTA2ocjJkuUTuqsq7txaCmh+21kdkDxeAeE7/Bd5zPNo/p+BMg0uszMa3lO5QXk9+PkZ9QlQSwMECgAAAAAAXaxLXQAAAAAAAAAAAAAAAAsAHAB3b3JkL19yZWxzL1VUCQAD4uTLauLky2p1eAsAAQT1AQAABBQAAABQSwECHgMUAAAACABdrEtdeW4z1+gAAACtAQAAEwAYAAAAAAABAAAApIEAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFVUBQAD4uTLanV4CwABBPUBAAAEFAAAAFBLAQIeAwoAAAAAAF2sS10AAAAAAAAAAAAAAAAGABgAAAAAAAAAEADtQTUBAABfcmVscy9VVAUAA+Lky2p1eAsAAQT1AQAABBQAAABQSwECHgMUAAAACABdrEtdm/036q0AAAApAQAACwAYAAAAAAABAAAApIF1AQAAX3JlbHMvLnJlbHNVVAUAA+Lky2p1eAsAAQT1AQAABBQAAABQSwECHgMKAAAAAABdrEtdAAAAAAAAAAAAAAAABQAYAAAAAAAAABAA7UFnAgAAd29yZC9VVAUAA+Lky2p1eAsAAQT1AQAABBQAAABQSwECHgMUAAAACABdrEtdv3whifsAAADdAQAAEQAYAAAAAAABAAAApIGmAgAAd29yZC9kb2N1bWVudC54bWxVVAUAA+Lky2p1eAsAAQT1AQAABBQAAABQSwECHgMKAAAAAABdrEtdAAAAAAAAAAAAAAAACwAYAAAAAAAAABAA7UHsAwAAd29yZC9fcmVscy9VVAUAA+Lky2p1eAsAAQT1AQAABBQAAABQSwUGAAAAAAYABgDpAQAAMQQAAAAA",
  "base64"
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
const providerMock = { RUNTIME_DATABASE: "RUNTIME_DATABASE" };
const shared = loadTypescriptModule(join(repositoryRoot, "packages", "shared", "src", "language-policy.ts"));

function loadRepository(moduleName, fileName, mocks = {}) {
  return loadTypescriptModule(join(modulesRoot, moduleName, fileName), {
    "@laborator/db": runtimeDatabase,
    "../runtime-database.provider": providerMock,
    ...mocks
  });
}

const documentsRepositoryModule = loadRepository("documents", "documents.repository.ts");
const segmentsRepositoryModule = loadRepository("segments", "segments.repository.ts");
const workflowRepositoryModule = loadRepository("workflow", "workflow.repository.ts");
const translationsRepositoryModule = loadRepository("translations", "translations.repository.ts");
const editorialTypesModule = loadTypescriptModule(
  join(modulesRoot, "editorial-decisions", "editorial-decisions.types.ts")
);
const editorialRepositoryModule = loadRepository(
  "editorial-decisions",
  "editorial-decisions.repository.ts",
  { "./editorial-decisions.types": editorialTypesModule }
);

const documentsServiceModule = loadTypescriptModule(join(modulesRoot, "documents", "documents.service.ts"), {
  "@laborator/shared": shared,
  "./documents.repository": documentsRepositoryModule
});
const segmentsServiceModule = loadTypescriptModule(join(modulesRoot, "segments", "segments.service.ts"), {
  "./segments.repository": segmentsRepositoryModule
});
const workflowServiceModule = loadTypescriptModule(join(modulesRoot, "workflow", "workflow.service.ts"), {
  "./workflow.repository": workflowRepositoryModule
});
const importServiceModule = loadTypescriptModule(join(modulesRoot, "segments", "document-import.service.ts"));
const translationsServiceModule = loadTypescriptModule(join(modulesRoot, "translations", "translations.service.ts"), {
  "@laborator/shared": shared,
  "./translations.repository": translationsRepositoryModule
});
const editorialServiceModule = loadTypescriptModule(
  join(modulesRoot, "editorial-decisions", "editorial-decisions.service.ts"),
  {
    "./editorial-decisions.repository": editorialRepositoryModule,
    "./editorial-decisions.types": editorialTypesModule
  }
);

const { FileBackedRuntimeDatabase } = runtimeDatabase;
const { DatabaseDocumentsRepository } = documentsRepositoryModule;
const { DatabaseSegmentsRepository } = segmentsRepositoryModule;
const { InMemoryWorkflowRepository } = workflowRepositoryModule;
const { DatabaseTranslationsRepository } = translationsRepositoryModule;
const { DatabaseEditorialDecisionRepository } = editorialRepositoryModule;
const { DocumentsService } = documentsServiceModule;
const { SegmentsService } = segmentsServiceModule;
const { WorkflowService } = workflowServiceModule;
const { DocumentImportService } = importServiceModule;
const { TranslationsService } = translationsServiceModule;
const { EditorialDecisionService } = editorialServiceModule;

test("DOCX import through human approval persists one canonical editorial workflow", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "laborator-mvp02-"));
  const databasePath = join(directory, "runtime-db.json");
  t.after(() => rmSync(directory, { force: true, recursive: true }));

  const database = new FileBackedRuntimeDatabase(databasePath);
  const actor = {
    organizationId: "organization-a",
    userId: "reviewer-a",
    roles: ["REVIEWER", "TRANSLATOR"],
    permissions: ["document:write", "translation:write", "review:approve"]
  };
  const project = {
    id: "project-a",
    organizationId: actor.organizationId,
    name: "French to Romanian edition",
    publicationType: "BOOK",
    editorialDomain: "SPIRITISM",
    editorialProcess: ["IMPORT", "TRANSLATION", "REVIEW", "EDITORIAL_VALIDATION", "FINAL_APPROVAL"],
    createdBy: actor.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  database.insert("projects", project);
  const projectsService = {
    async getProject(currentActor, projectId) {
      const found = database.findByIdForTenant("projects", projectId, currentActor.organizationId);
      if (!found) throw new Error("project not found");
      return found;
    },
    async assertProjectReadyForEditorialProcessing(currentActor, projectId) {
      return this.getProject(currentActor, projectId);
    }
  };
  const terminology = {
    async checkSegmentText() {
      return { valid: true, violations: [], dictionaryEvidence: [] };
    }
  };
  const qa = {
    async listIssues() { return []; },
    async runQaOnSegment() { return { id: "qa-a", issueCount: 0, score: 100 }; }
  };
  const semantic = {
    async listIssues() { return []; },
    async runCheckOnSegment() {
      return { id: "semantic-a", issueCount: 0, riskLevel: "LOW", score: 100 };
    }
  };
  const lexicographic = {
    async searchEntries() { return []; },
    async describeEntries() { return []; }
  };
  const translationMemory = {
    async buildProposals() { return []; },
    async createEntry() { return { id: "tm-a" }; },
    async searchMatches() { return []; }
  };

  const documentsRepository = new DatabaseDocumentsRepository(database);
  const documentsService = new DocumentsService(documentsRepository, projectsService);
  const workflowRepository = new InMemoryWorkflowRepository(database);
  const workflowService = new WorkflowService(
    workflowRepository,
    projectsService,
    documentsService,
    qa,
    semantic
  );
  const segmentsRepository = new DatabaseSegmentsRepository(database);
  const segmentsService = new SegmentsService(segmentsRepository, documentsService);
  const importService = new DocumentImportService(documentsService, segmentsService, workflowService);
  const translationsRepository = new DatabaseTranslationsRepository(database);
  const translationsService = new TranslationsService(
    translationsRepository,
    segmentsService,
    documentsService,
    lexicographic,
    translationMemory,
    terminology,
    qa,
    semantic,
    workflowService,
    { async generateProposal() { throw new Error("AI provider is not used by this workflow test."); } }
  );
  const editorialRepository = new DatabaseEditorialDecisionRepository(database);
  const editorialService = new EditorialDecisionService(
    editorialRepository,
    lexicographic,
    terminology,
    translationMemory,
    semantic,
    translationsService,
    workflowService
  );

  const file = {
    buffer: docxFixture,
    mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    originalname: "manuscript.docx",
    size: docxFixture.length
  };
  const imported = await importService.importDocx(actor, file, {
    projectId: project.id,
    originalLanguage: "fr",
    originalLocale: "fr-FR",
    targetLanguage: "ro",
    targetLocale: "ro-RO",
    originalAuthorName: "Original Author"
  });
  assert.equal(imported.duplicate, false);
  assert.ok(imported.segments.length >= 3);
  assert.equal(imported.document.metadata.originalSourcePreserved, true);
  assert.match(imported.document.metadata.canonicalHtml, /<strong>Le principe spirituel<\/strong>/);
  assert.ok(imported.document.metadata.canonicalBlocks.some((block) => block.type === "TABLE"));

  const retried = await importService.importDocx(actor, file, {
    projectId: project.id,
    originalLanguage: "fr",
    targetLanguage: "ro"
  });
  assert.equal(retried.duplicate, true);
  assert.equal(retried.document.id, imported.document.id);
  assert.equal(retried.segments.length, imported.segments.length);

  await assert.rejects(
    documentsService.getDocument(
      { organizationId: "organization-b", userId: "user-b" },
      imported.document.id
    ),
    /document not found/i
  );

  const segment = imported.segments.find((candidate) => candidate.sourceText.includes("principe")) ?? imported.segments[0];
  const firstTranslation = await translationsService.submitTranslation(actor, {
    segmentId: segment.id,
    targetText: "Principiul spiritual",
    translatorName: "Translator A"
  });
  assert.equal(firstTranslation.status, "VALIDATED");
  assert.equal(firstTranslation.metadata.translationVersion, 1);

  const revision = await translationsService.reviseSegmentSource(actor, segment.id, {
    sourceText: `${segment.sourceText} révisé`,
    reason: "Authorized source correction"
  });
  assert.equal(revision.outdatedTranslations, 1);
  assert.equal((await translationsRepository.listTranslationsBySegment(actor.organizationId, segment.id))[0].status, "OUTDATED");

  const secondTranslation = await translationsService.submitTranslation(actor, {
    segmentId: segment.id,
    targetText: "Principiul spiritual revizuit",
    translatorName: "Translator A"
  });
  assert.equal(secondTranslation.metadata.translationVersion, 2);
  assert.equal(secondTranslation.metadata.revisionOfTranslationId, firstTranslation.id);

  await workflowService.advanceWorkflow(actor, { documentId: imported.document.id, projectId: project.id });
  await workflowService.advanceWorkflow(actor, { documentId: imported.document.id, projectId: project.id });
  await workflowService.advanceWorkflow(actor, { documentId: imported.document.id, projectId: project.id });
  await assert.rejects(
    workflowService.approveDocument(actor, { documentId: imported.document.id, projectId: project.id }),
    /editorial correction review must be completed/i
  );

  const correction = await editorialService.createCorrection(actor, {
    documentId: imported.document.id,
    projectId: project.id,
    segmentId: segment.id,
    sourceLanguage: "fr",
    sourceText: revision.segment.sourceText,
    targetLanguage: "ro",
    targetText: secondTranslation.targetText,
    proposedText: "Principiul spiritual, revizuit editorial",
    translationId: secondTranslation.id,
    issueType: "PUNCTUATION",
    severity: "MEDIUM",
    explanation: "Add the editorial comma."
  });
  const accepted = await editorialService.acceptCorrection(actor, correction.id);
  assert.equal(accepted.approvalStatus, "APPROVED");

  const approved = await workflowService.approveDocument(actor, {
    documentId: imported.document.id,
    projectId: project.id
  });
  assert.equal(approved.status, "APPROVED");
  assert.equal((await documentsService.getDocument(actor, imported.document.id)).status, "APPROVED");
  assert.ok(workflowRepository.getTransitions().some((transition) => transition.action === "EDITORIAL_REVIEW_COMPLETED"));
  assert.ok(database.selectForTenant("editorial_decision_audit_events", actor.organizationId).length >= 2);
  assert.ok(
    database
      .selectForTenant("foundation_audit_events", actor.organizationId)
      .filter((event) => event.entityType === "SEGMENT_TRANSLATION").length >= 3
  );
});

test("workflow approval remains restricted to authorized humans", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "laborator-mvp02-authority-"));
  const database = new FileBackedRuntimeDatabase(join(directory, "runtime-db.json"));
  t.after(() => rmSync(directory, { force: true, recursive: true }));
  const repository = new InMemoryWorkflowRepository(database);
  const state = {
    id: "workflow-a",
    organizationId: "organization-a",
    projectId: "project-a",
    documentId: "document-a",
    scope: "DOCUMENT",
    status: "IN_REVIEW",
    createdBy: "human-a",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: { editorialReviewCompleted: true }
  };
  await repository.createState(state);
  const workflow = new WorkflowService(
    repository,
    { async assertProjectReadyForEditorialProcessing() {} },
    { async markDocumentStatus() {} },
    { async listIssues() { return []; } },
    { async listIssues() { return []; } }
  );
  await assert.rejects(
    workflow.approveDocument(
      { organizationId: state.organizationId, userId: "ai-agent", roles: ["AI_AGENT"] },
      { documentId: state.documentId, projectId: state.projectId }
    ),
    /authorized human/i
  );
});
