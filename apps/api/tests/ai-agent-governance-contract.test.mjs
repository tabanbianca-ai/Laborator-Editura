import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");

function readApi(path) {
  return readFileSync(join(apiRoot, path), "utf8");
}

test("AI governance exposes governed agent profiles through the existing AI governance module", () => {
  const controller = readApi("src/modules/ai-governance/ai-governance.controller.ts");
  const service = readApi("src/modules/ai-governance/ai-governance.service.ts");
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");

  assert.match(controller, /@Get\("agents"\)/);
  assert.match(controller, /listAgentGovernanceProfiles/);
  assert.match(service, /listAgentGovernanceProfiles/);
  assert.match(service, /AI_AGENT_GOVERNANCE_PROFILES/);
  assert.match(types, /AiAgentGovernanceProfile/);

  for (const field of ["mission", "responsibilities", "collaboration", "limits", "authority"]) {
    assert.match(types, new RegExp(`${field}:`));
  }
});

test("all current AI agents have governance profiles", () => {
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");

  for (const agentName of [
    "Coordinator Agent",
    "Projects Agent",
    "Manuscripts Agent",
    "Documentation Agent",
    "Translation Agent",
    "Review Agent",
    "Layout Agent",
    "Publishing Agent",
    "Distribution Agent",
    "Library Agent",
    "Rights & Provenance Agent",
    "Illustration Agent",
    "Audio Agent",
    "Video Agent",
    "Magazine Agent",
    "Administration Agent",
    "Evolution Agent",
    "Quality Agent"
  ]) {
    assert.match(types, new RegExp(`agentName: "${agentName}"`));
  }
});

test("agent collaboration is unrestricted but coordinated through the Coordinator Agent", () => {
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");

  for (const field of [
    "mayExchangeInformation: true",
    "mayRequestAssistance: true",
    "mayReuseResults: true",
    "mayNotifyOtherAgents: true",
    'coordinatorAgent: "Coordinator Agent"',
    'communicationRestrictions: "NONE"'
  ]) {
    assert.match(types, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("human final authority overrides every AI agent decision", () => {
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");

  for (const restriction of [
    "humanFinalAuthorityOverrides: true",
    "mayPublishAutomatically: false",
    "mayApproveAutomatically: false",
    "mayGrantRights: false",
    "mayBypassWorkflow: false",
    "mayModifySecurity: false",
    "mayChangeGovernance: false"
  ]) {
    assert.match(types, new RegExp(restriction));
  }
});

test("Quality Agent validates readiness and reports issues without correcting or approving", () => {
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");
  const qualityProfile = types.slice(types.indexOf('agentName: "Quality Agent"'));

  for (const responsibility of [
    "editorial consistency",
    "metadata validation",
    "missing assets",
    "export validation",
    "accessibility verification",
    "links verification",
    "publication readiness",
    "distribution readiness"
  ]) {
    assert.match(qualityProfile, new RegExp(responsibility));
  }

  for (const limit of [
    "must not translate",
    "must not review",
    "must not edit",
    "must not illustrate",
    "must not publish",
    "must not approve",
    "reports issues only and does not correct the project"
  ]) {
    assert.match(qualityProfile, new RegExp(limit));
  }

  assert.match(qualityProfile, /final AI responsibility for quality verification/);
});

test("existing orchestration and marketplace registry recognize the Quality Agent without new modules", () => {
  const appModule = readApi("src/modules/app.module.ts");
  const platformService = readApi("src/modules/platform-engineering/platform-engineering.service.ts");
  const marketplaceTypes = readApi("src/modules/marketplace/marketplace.types.ts");

  assert.doesNotMatch(appModule, /QualityAgentModule/);
  assert.match(platformService, /quality: "READY"/);
  assert.match(marketplaceTypes, /"QUALITY"/);
});
