import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "editorial-decisions");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("editorial decision agent is registered with authenticated endpoints", () => {
  const controller = readSource("editorial-decisions.controller.ts");
  const moduleSource = readSource("editorial-decisions.module.ts");

  assert.match(appModule, /EditorialDecisionModule/);
  assert.match(moduleSource, /LexicographicModule/);
  assert.match(moduleSource, /TerminologyModule/);
  assert.match(moduleSource, /TranslationMemoryModule/);
  assert.match(moduleSource, /SemanticFidelityModule/);
  assert.match(controller, /@Controller\("editorial-decisions"\)/);
  assert.match(controller, /@Post\("recommendations"\)/);
  assert.match(controller, /@Get\("recommendations\/:id"\)/);
  assert.match(controller, /@Post\("recommendations\/:id\/approve"\)/);
  assert.match(controller, /@Post\("recommendations\/:id\/reject"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id/);
  assert.doesNotMatch(controller, /x-organization-id/);
});

test("editorial decision agent analyzes approved evidence sources", () => {
  const service = readSource("editorial-decisions.service.ts");

  assert.match(service, /LexicographicService/);
  assert.match(service, /TerminologyService/);
  assert.match(service, /TranslationMemoryService/);
  assert.match(service, /SemanticFidelityService/);
  assert.match(service, /terminologyService\.checkSegmentText/);
  assert.match(service, /lexicographicService\.searchEntries/);
  assert.match(service, /lexicographicService\.describeEntries/);
  assert.match(service, /translationMemoryService\.searchMatches/);
  assert.match(service, /semanticFidelityService\.runCheckOnSegment/);
  assert.match(service, /repository\.listApprovedDecisions/);
});

test("glossary overrides AI in editorial priority order", () => {
  const service = readSource("editorial-decisions.service.ts");
  const types = readSource("editorial-decisions.types.ts");

  assert.match(types, /"VALIDATED_GLOSSARY",\n {2}"DOCUMENTED_EDITORIAL_DECISION"/);
  assert.match(types, /"TRANSLATION_MEMORY",\n {2}"AI_SUGGESTION"/);
  assert.match(service, /VALIDATED_GLOSSARY: 1/);
  assert.match(service, /AI_REASONING: 6/);
  assert.match(service, /Revise according to validated glossary/);
});

test("editorial decisions override dictionary evidence", () => {
  const service = readSource("editorial-decisions.service.ts");

  assert.match(service, /listApprovedDecisions/);
  assert.match(service, /sourceType: "EDITORIAL_DECISION"/);
  assert.match(service, /EDITORIAL_DECISION: 2/);
  assert.match(service, /SPECIALIZED_DICTIONARY: 3/);
  assert.match(service, /ACADEMIC_DICTIONARY: 4/);
  assert.match(service, /Follow the documented editorial decision/);
});

test("AI recommendations cannot auto approve editorial decisions", () => {
  const service = readSource("editorial-decisions.service.ts");
  const types = readSource("editorial-decisions.types.ts");

  assert.match(types, /humanApprovalRequired: true/);
  assert.match(types, /approvalStatus: EditorialDecisionApprovalStatus/);
  assert.match(service, /humanApprovalRequired: true/);
  assert.match(service, /approvalStatus: "PENDING_HUMAN_APPROVAL"/);
  assert.match(service, /assertAuthorizedHuman/);
  assert.match(service, /Only authorized humans may approve editorial decisions/);
});

test("editorial decision audit trail is preserved and versioned", () => {
  const repository = readSource("editorial-decisions.repository.ts");
  const service = readSource("editorial-decisions.service.ts");
  const types = readSource("editorial-decisions.types.ts");

  assert.match(repository, /editorial_decisions/);
  assert.match(repository, /editorial_decision_audit_events/);
  assert.match(service, /auditTrail/);
  assert.match(service, /RECOMMENDATION_CREATED/);
  assert.match(service, /version: 1/);
  assert.match(service, /version: existing\.version \+ 1/);
  assert.match(service, /repository\.appendAuditEvent/);
  assert.match(types, /EditorialDecisionAuditTrailItem/);
});

test("editorial decision alternatives and confidence score are generated", () => {
  const service = readSource("editorial-decisions.service.ts");
  const types = readSource("editorial-decisions.types.ts");

  assert.match(types, /alternatives: string\[]/);
  assert.match(types, /confidenceScore: number/);
  assert.match(service, /buildAlternatives/);
  assert.match(service, /lexicographicEvidence\.flatMap/);
  assert.match(service, /tmMatches\.map/);
  assert.match(service, /calculateConfidenceScore/);
  assert.match(service, /confidenceScore: this\.calculateConfidenceScore/);
});
