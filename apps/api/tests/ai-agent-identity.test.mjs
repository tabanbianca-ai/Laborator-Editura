import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "../src/modules/ai-governance");
function load(name, dependencies = {}) {
  const output = ts.transpileModule(readFileSync(join(root, name), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const module = { exports: {} };
  new Function("exports", "require", "module", output)(module.exports, (id) => {
    assert.ok(Object.hasOwn(dependencies, id), `Unexpected dependency ${id}`);
    return dependencies[id];
  }, module);
  return module.exports;
}
const governance = load("ai-governance.types.ts");
const { listCanonicalAiAgentIdentities, resolveAiAgentIdentity } = load("ai-agent-identity.ts", {
  "./ai-governance.types": governance
});

test("canonical identity projection preserves exactly 18 principal and six specialized profiles", () => {
  const identities = listCanonicalAiAgentIdentities();
  assert.equal(identities.filter((item) => item.kind === "PRINCIPAL").length, 18);
  assert.equal(identities.filter((item) => item.kind === "SUBAGENT").length, 6);
  assert.equal(new Set(identities.map((item) => item.agentId)).size, 24);
  assert.equal(new Set(identities.map((item) => item.canonicalName)).size, 24);
  for (const profile of governance.AI_AGENT_GOVERNANCE_PROFILES) {
    const result = resolveAiAgentIdentity(profile.id);
    assert.equal(result.status, "RESOLVED");
    assert.equal(result.identity.governanceVersion, profile.version);
    assert.deepEqual(resolveAiAgentIdentity(profile.agentName), result);
  }
});

test("parent relationships retain shared media ownership and reference principal agents only", () => {
  const identities = listCanonicalAiAgentIdentities();
  for (const identity of identities) {
    assert.equal(identity.parentAgentIds.length > 0, identity.kind === "SUBAGENT");
    for (const parentId of identity.parentAgentIds) {
      assert.equal(resolveAiAgentIdentity(parentId).identity.kind, "PRINCIPAL");
    }
  }
  assert.deepEqual(resolveAiAgentIdentity("media-localization-subagent").identity.parentAgentIds,
    ["audio-agent", "video-agent"]);
});

test("legacy aliases resolve without silently choosing a specialization for combined services", () => {
  const aliases = {
    "Translation AI": "translation-agent",
    "Lexicographic AI": "terminology-lexicography-subagent",
    "Semantic Fidelity": "semantic-fidelity-subagent",
    "Editorial Decision Agent": "editorial-decision-subagent",
    "Media Localization Agent": "media-localization-subagent",
    "Platform Engineering Agent": "platform-engineering-subagent",
    "Scheduling Agent": "planning-coordination-subagent",
    "Author Studio AI": "manuscripts-agent",
    "Research AI": "documentation-agent"
  };
  for (const [alias, id] of Object.entries(aliases)) {
    assert.equal(resolveAiAgentIdentity(alias).identity.agentId, id);
  }
  assert.deepEqual(resolveAiAgentIdentity("Layout Publishing Agent"), {
    status: "AMBIGUOUS", candidateAgentIds: ["layout-agent", "publishing-agent"]
  });
  assert.deepEqual(resolveAiAgentIdentity("Multimedia Creation Agent"), {
    status: "AMBIGUOUS", candidateAgentIds: ["illustration-agent", "audio-agent", "video-agent"]
  });
  assert.deepEqual(resolveAiAgentIdentity("unknown-agent"), { status: "UNKNOWN" });
});

test("all existing shared classifications remain resolvable without mutating governance", () => {
  const before = JSON.stringify(governance.AI_AGENT_GOVERNANCE_PROFILES);
  for (const type of ["AUDIO_AGENT", "CORRECTION_AGENT", "DOCUMENTATION_AGENT",
    "EDITORIAL_REVIEW_AGENT", "ILLUSTRATION_AGENT", "METADATA_AGENT", "MONITORING_AGENT",
    "PUBLICATION_AGENT", "SCHEDULING_AGENT", "TERMINOLOGY_AGENT", "TRANSLATION_AGENT", "VIDEO_AGENT"]) {
    assert.equal(resolveAiAgentIdentity(type).status, "RESOLVED");
  }
  const projection = listCanonicalAiAgentIdentities();
  projection[0].parentAgentIds.push("invalid");
  projection[0].legacyTypes.push("AUDIO_AGENT");
  assert.equal(JSON.stringify(governance.AI_AGENT_GOVERNANCE_PROFILES), before);
  assert.deepEqual(listCanonicalAiAgentIdentities()[0].parentAgentIds, []);
});
