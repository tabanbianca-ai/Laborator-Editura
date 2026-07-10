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

test("all 18 principal agents are governed with complete profile metadata", () => {
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

  for (const field of [
    "id:",
    "name:",
    "agentKind:",
    "mission:",
    "responsibilities:",
    "collaborationRules:",
    "limits:",
    "authority:",
    "enabled:",
    "version:",
    "updatedAt:"
  ]) {
    assert.match(types, new RegExp(field));
  }

  assert.match(types, /agentKind: "PRINCIPAL"/);
});

test("all 6 specialized subagents are governed with parent-agent relationships", () => {
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");

  for (const subagentName of [
    "Terminology & Lexicography Subagent",
    "Semantic Fidelity Subagent",
    "Editorial Decision Subagent",
    "Planning & Coordination Subagent",
    "Media Localization Subagent",
    "Platform Engineering Subagent"
  ]) {
    assert.match(types, new RegExp(`agentName: "${subagentName}"`));
  }

  for (const parentRelationship of [
    'parentAgentId: "translation-agent"',
    'parentAgentId: "review-agent"',
    'parentAgentId: "coordinator-agent"',
    'parentAgentIds: ["audio-agent", "video-agent"]',
    'parentAgentId: "evolution-agent"'
  ]) {
    assert.match(types, new RegExp(parentRelationship.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(types, /agentKind: "SUBAGENT"/);
});

test("agent authority and limits prevent workflow bypass, audit removal and cross-specialization execution", () => {
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");

  for (const rule of [
    "must not bypass workflow rules",
    "must not remove audit history",
    "must not modify rights or security outside authority",
    "must not perform responsibilities assigned to another specialized agent",
    "must not publish automatically without required validations",
    "humanFinalAuthorityOverrides: true",
    "mayPublishAutomatically: false",
    "mayApproveAutomatically: false",
    "mayGrantRights: false",
    "mayBypassWorkflow: false",
    "mayModifySecurity: false",
    "mayChangeGovernance: false"
  ]) {
    assert.match(types, new RegExp(rule.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Review Agent defines detailed review responsibilities and non-imposed proposal behavior", () => {
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");
  const reviewProfile = types.slice(types.indexOf('agentName: "Review Agent"'));

  for (const responsibility of [
    "detailed text review",
    "stylistic improvement",
    "stylistic register",
    "lexical register",
    "verbal tenses",
    "paragraph structure",
    "transitions between paragraphs",
    "orthography",
    "elementary grammatical errors",
    "punctuation",
    "grammatical agreement",
    "word order",
    "prepositions",
    "anacolutha",
    "pleonasms",
    "cacophonies",
    "plural forms",
    "unnecessary repetitions"
  ]) {
    assert.match(reviewProfile, new RegExp(responsibility));
  }

  for (const behavior of [
    "identifies each issue",
    "explains the issue",
    "proposes one or more replacement variants when available",
    "never imposes the proposed change",
    "preserves the current text until the proposal is accepted",
    "allows individual accept or reject actions",
    "does not alter the original meaning",
    "does not replace validated terminology without justification and traceability"
  ]) {
    assert.match(reviewProfile, new RegExp(behavior));
  }
});

test("review proposals and audit actions preserve accept reject history", () => {
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");

  for (const field of [
    "proposalId",
    "projectId",
    "documentId",
    "segmentId",
    "sourceText",
    "currentTranslation",
    "proposedText",
    "language",
    "issueType",
    "explanation",
    "confidence",
    "status",
    "createdByAgent",
    "reviewedBy",
    "createdAt",
    "resolvedAt"
  ]) {
    assert.match(types, new RegExp(field));
  }

  for (const status of ["PENDING", "ACCEPTED", "REJECTED"]) {
    assert.match(types, new RegExp(status));
  }

  for (const action of [
    "AGENT_INVOCATION",
    "SUBAGENT_INVOCATION",
    "REVIEW_PROPOSAL_GENERATED",
    "REVIEW_PROPOSAL_ACCEPTED",
    "REVIEW_PROPOSAL_REJECTED",
    "RESPONSIBILITY_TRANSFER",
    "QUALITY_STATUS_RECORDED",
    "FINAL_AGENT_DECISION",
    "HUMAN_OVERRIDE"
  ]) {
    assert.match(types, new RegExp(action));
  }
});

test("parallel review interface and Quality Agent readiness statuses are modeled", () => {
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");

  for (const marker of [
    "AI_PARALLEL_REVIEW_INTERFACE",
    'defaultDisplayMode: "TWO_COLUMNS"',
    '"THREE_COLUMNS"',
    '"FOUR_COLUMNS"',
    "sentenceAndParagraphAlignment: true",
    "synchronizedScrollingCanBeToggled: true",
    "originalTextImmutable: true",
    "translationUnchangedUntilProposalAccepted: true",
    "differencesHighlighted: true",
    "individualAcceptRejectActions: true",
    "acceptedRejectedProposalsAudited: true",
    "versionHistoryPreserved: true",
    "columnsResizableOrHideable: true",
    '"READY"',
    '"READY_WITH_WARNINGS"',
    '"BLOCKED"'
  ]) {
    assert.match(types, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
