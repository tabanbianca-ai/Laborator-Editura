import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const servicePath = join(
  testDirectory,
  "..",
  "src",
  "modules",
  "ai-governance",
  "ai-translation-provider.service.ts"
);

function loadService() {
  const output = ts.transpileModule(readFileSync(servicePath, "utf8"), {
    compilerOptions: {
      esModuleInterop: true,
      experimentalDecorators: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: servicePath
  }).outputText;
  const module = { exports: {} };
  const localRequire = (specifier) =>
    specifier === "./ai-governance.service" ? {} : require(specifier);
  new Function("exports", "require", "module", "__filename", "__dirname", output)(
    module.exports,
    localRequire,
    module,
    servicePath,
    dirname(servicePath)
  );
  return module.exports.AiTranslationProviderService;
}

const AiTranslationProviderService = loadService();
const actor = {
  organizationId: "organization-a",
  permissions: ["translation:write"],
  roles: ["TRANSLATOR"],
  userId: "translator-a"
};
const input = {
  documentId: "document-a",
  explicitExternalProcessingAuthorization: true,
  glossaryEntries: [{ approvedTranslation: "principiu", sourceTerm: "principe" }],
  projectId: "project-a",
  segmentId: "segment-a",
  sourceLanguage: "fr",
  sourceLocale: "fr-FR",
  sourceText: "Le principe spirituel.",
  targetLanguage: "ro",
  targetLocale: "ro-RO",
  translationMemoryProposals: []
};

function withEnvironment(values, callback) {
  const previous = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });
  return Promise.resolve(callback()).finally(() => {
    Object.entries(previous).forEach(([key, value]) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  });
}

function governanceRecorder() {
  const records = [];
  return {
    records,
    service: {
      async authorizeAgentExecution(_actor, execution) {
        records.push({ kind: "authorization", execution });
      },
      async recordAgentExecution(_actor, execution) {
        records.push({ kind: "usage", execution });
        return execution;
      }
    }
  };
}

test("AI translation requires platform and per-request external-processing authorization", async () => {
  const governance = governanceRecorder();
  const service = new AiTranslationProviderService(governance.service);
  await withEnvironment({ AI_EXTERNAL_PROCESSING_ENABLED: undefined, OPENAI_API_KEY: "test-key" }, async () => {
    await assert.rejects(() => service.generateProposal(actor, input), /disabled by platform configuration/i);
  });
  await withEnvironment({ AI_EXTERNAL_PROCESSING_ENABLED: "true", OPENAI_API_KEY: "test-key" }, async () => {
    await assert.rejects(
      () => service.generateProposal(actor, { ...input, explicitExternalProcessingAuthorization: false }),
      /explicit authorization is required/i
    );
  });
  assert.equal(governance.records.length, 0);
});

test("OpenAI-backed FR to RO generation returns a pending human proposal and auditable metadata", async () => {
  const governance = governanceRecorder();
  const service = new AiTranslationProviderService(governance.service);
  // Transport contract only. Production dispatch remains unconditionally blocked.
  service.requireFinancialDispatch = () => {};
  const previousFetch = globalThis.fetch;
  let requestBody;
  globalThis.fetch = async (_url, init) => {
    requestBody = JSON.parse(init.body);
    return new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        confidence: 0.94,
        explanation: "Terminology and meaning are preserved.",
        translation: "Principiul spiritual."
      }) } }],
      usage: { completion_tokens: 7, prompt_tokens: 20 }
    }), { headers: { "Content-Type": "application/json" }, status: 200 });
  };

  try {
    await withEnvironment({ AI_EXTERNAL_PROCESSING_ENABLED: "true", ANTHROPIC_API_KEY: undefined, OPENAI_API_KEY: "test-key" }, async () => {
      const proposal = await service.generateProposal(actor, input);
      assert.equal(proposal.proposedText, "Principiul spiritual.");
      assert.equal(proposal.provider, "OPENAI");
      assert.equal(proposal.status, "PENDING_HUMAN_REVIEW");
      assert.equal(proposal.automaticApproval, false);
      assert.equal(proposal.automaticPublication, false);
    });
  } finally {
    globalThis.fetch = previousFetch;
  }

  assert.match(requestBody.messages[0].content, /untrusted editorial content/i);
  assert.equal(governance.records[0].kind, "authorization");
  assert.equal(governance.records.at(-1).execution.status, "SUCCEEDED");
  assert.equal(governance.records.at(-1).execution.metadata.sourceTextStored, false);
  assert.doesNotMatch(JSON.stringify(governance.records), /Le principe spirituel/);
});

test("provider errors are audited and fall back to Anthropic without weakening proposal controls", async () => {
  const governance = governanceRecorder();
  const service = new AiTranslationProviderService(governance.service);
  // Exercise deterministic fake transport, never a live financial authorization.
  service.requireFinancialDispatch = () => {};
  const previousFetch = globalThis.fetch;
  const urls = [];
  globalThis.fetch = async (url) => {
    urls.push(String(url));
    if (String(url).includes("openai")) {
      return new Response(JSON.stringify({ error: { message: "unavailable" } }), {
        headers: { "Content-Type": "application/json" },
        status: 503
      });
    }
    return new Response(JSON.stringify({
      content: [{ text: JSON.stringify({
        confidence: 0.91,
        explanation: "Fallback proposal.",
        translation: "Principiul spiritual."
      }) }],
      usage: { input_tokens: 18, output_tokens: 6 }
    }), { headers: { "Content-Type": "application/json" }, status: 200 });
  };

  try {
    await withEnvironment({
      AI_EXTERNAL_PROCESSING_ENABLED: "true",
      ANTHROPIC_API_KEY: "anthropic-test-key",
      OPENAI_API_KEY: "openai-test-key"
    }, async () => {
      const proposal = await service.generateProposal(actor, input);
      assert.equal(proposal.provider, "ANTHROPIC");
      assert.equal(proposal.automaticApproval, false);
    });
  } finally {
    globalThis.fetch = previousFetch;
  }

  assert.equal(urls.filter((url) => url.includes("openai")).length, 2);
  assert.equal(urls.filter((url) => url.includes("anthropic")).length, 1);
  assert.equal(governance.records.filter((record) => record.execution.status === "FAILED").length, 1);
  assert.equal(governance.records.at(-1).execution.status, "SUCCEEDED");
});

test("P0-B blocks provider I/O even with credentials, consent and successful governance", async () => {
  const governance = governanceRecorder();
  const service = new AiTranslationProviderService(governance.service);
  const previousFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error("External I/O forbidden"); };
  try {
    await withEnvironment({ AI_EXTERNAL_PROCESSING_ENABLED: "true", OPENAI_API_KEY: "fixture", ANTHROPIC_API_KEY: "fixture" }, async () => {
      await assert.rejects(() => service.generateProposal(actor, input), /provider rejected/u);
      await assert.rejects(() => service.executeOpenAi({}, input, new AbortController().signal), /P0-C/u);
      await assert.rejects(() => service.executeAnthropic({}, input, new AbortController().signal), /P0-C/u);
    });
    assert.equal(calls, 0);
    assert.equal(governance.records.filter((record) => record.execution.status === "SUCCEEDED").length, 0);
  } finally { globalThis.fetch = previousFetch; }
});

test("governance denial fails closed before manuscript content reaches a provider", async () => {
  let providerCalled = false;
  const service = new AiTranslationProviderService({
    async authorizeAgentExecution() {
      throw new Error("AI execution is blocked by the active cost policy.");
    },
    async recordAgentExecution() {
      throw new Error("unexpected usage record");
    }
  });
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    providerCalled = true;
    throw new Error("unexpected provider call");
  };
  try {
    await withEnvironment({ AI_EXTERNAL_PROCESSING_ENABLED: "true", OPENAI_API_KEY: "test-key" }, async () => {
      await assert.rejects(() => service.generateProposal(actor, input), /blocked by the active cost policy/i);
    });
  } finally {
    globalThis.fetch = previousFetch;
  }
  assert.equal(providerCalled, false);
});
