import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const moduleRoot = join(
  repositoryRoot,
  "apps",
  "api",
  "src",
  "modules",
  "translation-memory"
);
const runtimeDatabasePath = join(
  repositoryRoot,
  "packages",
  "db",
  "src",
  "runtime-database.ts"
);

function loadTypescriptModule(filePath, mocks = {}) {
  const source = readFileSync(filePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      experimentalDecorators: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: filePath
  }).outputText;
  const module = { exports: {} };
  const localRequire = (specifier) => {
    if (Object.hasOwn(mocks, specifier)) {
      return mocks[specifier];
    }

    return require(specifier);
  };

  new Function("exports", "require", "module", "__filename", "__dirname", output)(
    module.exports,
    localRequire,
    module,
    filePath,
    dirname(filePath)
  );

  return module.exports;
}

const nest = require("@nestjs/common");
const runtimeDatabase = loadTypescriptModule(runtimeDatabasePath);
const utils = loadTypescriptModule(join(moduleRoot, "translation-memory.utils.ts"));
const repositoryModule = loadTypescriptModule(
  join(moduleRoot, "translation-memory.repository.ts"),
  {
    "@laborator/db": runtimeDatabase,
    "../runtime-database.provider": { RUNTIME_DATABASE: "RUNTIME_DATABASE" },
    "./translation-memory.utils": utils
  }
);
const serviceModule = loadTypescriptModule(
  join(moduleRoot, "translation-memory.service.ts"),
  {
    "./translation-memory.repository": repositoryModule,
    "./translation-memory.utils": utils
  }
);

const { FileBackedRuntimeDatabase } = runtimeDatabase;
const { InMemoryTranslationMemoryRepository } = repositoryModule;
const { TranslationMemoryService } = serviceModule;
const duplicateMessage = repositoryModule.TRANSLATION_MEMORY_DUPLICATE_MESSAGE;
const actor = { organizationId: "organization-a", userId: "user-a" };
const sameOrganizationActor = {
  organizationId: actor.organizationId,
  userId: "user-b"
};
const otherActor = { organizationId: "organization-b", userId: "user-b" };
const baseInput = {
  sourceLanguage: "ro",
  sourceText: "Viața continuă.",
  targetLanguage: "en",
  targetText: "Life continues.",
  domain: "spiritism",
  approvalStatus: "PENDING",
  origin: "HUMAN"
};

function createHarness(t) {
  const directory = mkdtempSync(join(tmpdir(), "laborator-tm-b2-"));
  const filePath = join(directory, "runtime-db.json");
  const database = new FileBackedRuntimeDatabase(filePath);
  database.insert("organizations", {
    id: actor.organizationId,
    name: "Translation Memory test organization"
  });
  const repository = new InMemoryTranslationMemoryRepository(database);
  const service = new TranslationMemoryService(repository);

  t.after(() => rmSync(directory, { force: true, recursive: true }));
  return { database, filePath, repository, service };
}

async function assertDuplicate(operation) {
  await assert.rejects(operation, (error) => {
    assert.ok(error instanceof nest.BadRequestException);
    assert.equal(error.message, duplicateMessage);
    return true;
  });
}

test("first creation succeeds and exact or conservatively normalized duplicates are rejected", async (t) => {
  const { repository, service } = createHarness(t);
  const first = await service.createEntry(actor, baseInput);
  assert.equal(first.sourceText, baseInput.sourceText);

  await assertDuplicate(() => service.createEntry(actor, baseInput));
  await assertDuplicate(() =>
    service.createEntry(actor, {
      ...baseInput,
      sourceText: "  Viața\t\tcontinuă.  ",
      targetText: " Life   continues. "
    })
  );
  await assertDuplicate(() =>
    service.createEntry(actor, {
      ...baseInput,
      sourceText: "Via\u0074\u0326a continua\u0306."
    })
  );
  await assertDuplicate(() =>
    service
      .createEntry(actor, {
        ...baseInput,
        sourceText: "Viața\r\ncontinuă.",
        targetText: "Life\r\ncontinues."
      })
      .then(() =>
        service.createEntry(actor, {
          ...baseInput,
          sourceText: "Viața\ncontinuă.",
          targetText: "Life\ncontinues."
        })
      )
  );

  assert.equal(
    repository.getAuditEvents().filter((event) => event.action === "CREATE").length,
    2
  );
});

test("linguistically meaningful differences and scope boundaries remain distinct", async (t) => {
  const { service } = createHarness(t);
  await service.createEntry(actor, baseInput);

  const allowed = [
    { sourceText: "viața continuă." },
    { sourceText: "Viata continuă." },
    { sourceText: "Viața continuă!" },
    { sourceText: "Viața\n\ncontinuă." },
    { sourceLanguage: "fr" },
    { targetLanguage: "de" },
    { domain: "philosophy" },
    { targetText: "Existence continues." }
  ];

  for (const difference of allowed) {
    await service.createEntry(actor, { ...baseInput, ...difference });
  }

  await service.createEntry(otherActor, baseInput);
});

test("context and provenance differences do not create a new identity", async (t) => {
  const { service } = createHarness(t);
  await service.createEntry(actor, {
    ...baseInput,
    context: "document-a:segment-a",
    projectId: "project-a",
    documentId: "document-a",
    sourceSegmentId: "segment-a"
  });

  await assertDuplicate(() =>
    service.createEntry(actor, {
      ...baseInput,
      context: "document-b:segment-b",
      projectId: "project-b",
      documentId: "document-b",
      sourceSegmentId: "segment-b"
    })
  );
});

test("origin and creation actor differences do not create a new identity", async (t) => {
  const { repository, service } = createHarness(t);
  await service.createEntry(actor, baseInput);

  await assertDuplicate(() =>
    service.createEntry(actor, {
      ...baseInput,
      origin: "IMPORT"
    })
  );
  await assertDuplicate(() => service.createEntry(sameOrganizationActor, baseInput));
  await assertDuplicate(() =>
    service.createEntry(sameOrganizationActor, {
      ...baseInput,
      origin: "IMPORT"
    })
  );

  assert.equal(
    repository.getAuditEvents().filter((event) => event.action === "CREATE").length,
    1
  );
});

test("identity-changing updates reject duplicates while other and self updates remain valid", async (t) => {
  const { repository, service } = createHarness(t);
  const first = await service.createEntry(actor, baseInput);
  const second = await service.createEntry(actor, {
    ...baseInput,
    targetText: "The soul continues."
  });

  await assertDuplicate(() =>
    service.updateEntry(actor, second.id, {
      targetText: first.targetText
    })
  );

  const confidenceUpdate = await service.updateEntry(actor, first.id, {
    confidenceScore: 0.9
  });
  assert.equal(confidenceUpdate.confidenceScore, 0.9);
  const selfUpdate = await service.updateEntry(actor, first.id, {
    targetText: first.targetText
  });
  assert.equal(selfUpdate.id, first.id);
  assert.equal(
    repository.getAuditEvents().filter((event) => event.action === "UPDATE").length,
    2
  );
});

test("approval rechecks grandfathered duplicates before persistence or audit", async (t) => {
  const { database, repository, service } = createHarness(t);
  const now = new Date().toISOString();
  const historical = (id) => ({
    ...baseInput,
    id,
    organizationId: actor.organizationId,
    confidenceScore: 1,
    createdBy: actor.userId,
    createdAt: now,
    updatedAt: now
  });

  database.insert("translation_memory_entries", historical("historical-a"));
  database.insert("translation_memory_entries", historical("historical-b"));

  await assertDuplicate(() => service.approveEntry(actor, "historical-b"));
  assert.equal(
    repository.getAuditEvents().filter((event) => event.action === "APPROVE").length,
    0
  );
  assert.equal(
    (await repository.findEntryById("historical-b", actor.organizationId)).approvalStatus,
    "PENDING"
  );
});

test("same-process concurrent creation persists at most one new identity", async (t) => {
  const { repository, service } = createHarness(t);
  const results = await Promise.allSettled([
    service.createEntry(actor, baseInput),
    service.createEntry(actor, baseInput)
  ]);

  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  assert.equal(results.filter((result) => result.status === "rejected").length, 1);
  assert.equal(
    (
      await repository.listEntries({
        organizationId: actor.organizationId,
        sourceLanguage: "ro",
        targetLanguage: "en",
        includePending: true
      })
    ).length,
    1
  );
});

test("reload preserves enforcement and historical duplicates remain readable and restorable", async (t) => {
  const { filePath, service } = createHarness(t);
  await service.createEntry(actor, baseInput);

  const reloadedDatabase = new FileBackedRuntimeDatabase(filePath);
  const reloadedRepository = new InMemoryTranslationMemoryRepository(reloadedDatabase);
  const reloadedService = new TranslationMemoryService(reloadedRepository);
  await assertDuplicate(() => reloadedService.createEntry(actor, baseInput));

  const backup = reloadedDatabase.createBackup();
  const now = new Date().toISOString();
  backup.data.translation_memory_entries.push({
    ...backup.data.translation_memory_entries[0],
    id: "grandfathered-duplicate",
    createdAt: now,
    updatedAt: now
  });

  const restoredPath = join(dirname(filePath), "restored-runtime-db.json");
  const restoredDatabase = new FileBackedRuntimeDatabase(restoredPath);
  restoredDatabase.restoreBackup(backup);
  const restoredRepository = new InMemoryTranslationMemoryRepository(restoredDatabase);
  const restored = await restoredRepository.listEntries({
    organizationId: actor.organizationId,
    sourceLanguage: "ro",
    targetLanguage: "en",
    includePending: true
  });

  assert.equal(restored.length, 2);
  assert.equal(
    restored.some((entry) => entry.id === "grandfathered-duplicate"),
    true
  );
});
