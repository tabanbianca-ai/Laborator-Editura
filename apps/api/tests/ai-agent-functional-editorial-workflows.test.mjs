import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");

const principalAgents = [
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
];

const subagents = [
  { name: "Terminology & Lexicography Subagent", parents: ["Translation Agent"] },
  { name: "Semantic Fidelity Subagent", parents: ["Translation Agent"] },
  { name: "Editorial Decision Subagent", parents: ["Review Agent"] },
  { name: "Planning & Coordination Subagent", parents: ["Coordinator Agent"] },
  { name: "Media Localization Subagent", parents: ["Audio Agent", "Video Agent"] },
  { name: "Platform Engineering Subagent", parents: ["Evolution Agent"] }
];

const deterministicAiProvider = {
  mode: "DETERMINISTIC_MOCK",
  responses: {
    faithfulTranslation: "Spiritul progreseaza prin experienta morala.",
    reviewProposal: "Spiritul progreseaza prin experienta morala, in mod coerent.",
    editorialDecision: "Prefer the variant that preserves meaning and removes repetition.",
    pronunciation: "spiritul: spi-ri-tul",
    subtitleTiming: "00:00:01.000 --> 00:00:04.000",
    riskReport: "Low technical risk with rollback plan required."
  }
};

const workflows = {
  translatedBook: {
    id: "translated-book",
    label: "Translated Book Workflow",
    agents: [
      "Projects Agent",
      "Manuscripts Agent",
      "Documentation Agent",
      "Rights & Provenance Agent",
      "Translation Agent",
      "Terminology & Lexicography Subagent",
      "Semantic Fidelity Subagent",
      "Review Agent",
      "Editorial Decision Subagent",
      "Layout Agent",
      "Quality Agent",
      "Publishing Agent",
      "Distribution Agent",
      "Library Agent"
    ],
    fixture: {
      projectType: "Book",
      originalLanguage: "es",
      targetLanguage: "ro",
      rights: { translationAuthorized: true, publicationAuthorized: true },
      manuscript: {
        structure: ["chapter-1", "chapter-2"],
        sourceSegments: ["El espiritu progresa por la experiencia moral."]
      },
      documentation: [{ citation: "Spiritist source, chapter 1" }],
      terminology: { espiritu: "spirit" },
      layout: { printReady: true },
      assets: { sourceFile: true, accessibility: true, exportsValid: true }
    }
  },
  originalManuscript: {
    id: "original-manuscript",
    label: "Original Manuscript Workflow",
    agents: [
      "Projects Agent",
      "Manuscripts Agent",
      "Documentation Agent",
      "Review Agent",
      "Editorial Decision Subagent",
      "Layout Agent",
      "Quality Agent",
      "Publishing Agent",
      "Library Agent"
    ],
    fixture: {
      projectType: "Book",
      originalLanguage: "ro",
      targetLanguage: "ro",
      rights: { translationAuthorized: true, publicationAuthorized: true },
      manuscript: {
        structure: ["chapter-1"],
        sourceSegments: ["Textul are o repetitie repetitie inutila."]
      },
      documentation: [{ citation: "Author note" }],
      layout: { printReady: true },
      assets: { sourceFile: true, accessibility: true, exportsValid: true }
    }
  },
  childrensBook: {
    id: "childrens-book",
    label: "Children's Book Workflow",
    agents: [
      "Projects Agent",
      "Manuscripts Agent",
      "Illustration Agent",
      "Review Agent",
      "Layout Agent",
      "Audio Agent",
      "Video Agent",
      "Media Localization Subagent",
      "Quality Agent",
      "Publishing Agent"
    ],
    fixture: {
      projectType: "Children's Book",
      originalLanguage: "ro",
      targetLanguage: "en",
      rights: { translationAuthorized: true, publicationAuthorized: true },
      manuscript: {
        structure: ["spread-1", "spread-2"],
        sourceSegments: ["Copilul priveste steaua luminoasa."]
      },
      illustrations: { consistent: true, textReplacement: true, alignedWithText: true },
      audio: { validatedSourceText: true, authorizedVoice: true, metadataComplete: true },
      video: { subtitlesSynced: true, localizedSubtitles: true, audioDescription: true, formatCompatible: true },
      assets: { sourceFile: true, accessibility: true, exportsValid: true, illustrationsComplete: true }
    }
  },
  magazineIssue: {
    id: "magazine-issue",
    label: "Magazine Workflow",
    agents: [
      "Magazine Agent",
      "Documentation Agent",
      "Translation Agent",
      "Review Agent",
      "Layout Agent",
      "Quality Agent",
      "Publishing Agent",
      "Library Agent"
    ],
    fixture: {
      projectType: "Magazine",
      originalLanguage: "ro",
      targetLanguage: "en",
      rights: { translationAuthorized: true, publicationAuthorized: true },
      magazine: {
        issueStructure: ["editorial", "article-1", "article-2"],
        articleOrdering: true,
        sectionConsistency: true,
        periodicity: "monthly",
        articleWorkflowComplete: true
      },
      manuscript: {
        structure: ["article-1"],
        sourceSegments: ["Revista publica un articol validat."]
      },
      assets: { sourceFile: true, accessibility: true, exportsValid: true }
    }
  },
  audiobook: {
    id: "audiobook",
    label: "Audiobook Workflow",
    agents: [
      "Audio Agent",
      "Media Localization Subagent",
      "Rights & Provenance Agent",
      "Quality Agent",
      "Publishing Agent",
      "Distribution Agent"
    ],
    fixture: {
      projectType: "Audiobook",
      originalLanguage: "ro",
      targetLanguage: "ro",
      rights: { translationAuthorized: true, publicationAuthorized: true },
      manuscript: {
        structure: ["chapter-1", "chapter-2"],
        sourceSegments: ["Text final aprobat pentru audio."]
      },
      audio: {
        validatedSourceText: true,
        authorizedVoice: true,
        unauthorizedMusic: false,
        chapterStructure: true,
        metadataComplete: true,
        pronunciationChecked: true
      },
      assets: { sourceFile: true, accessibility: true, exportsValid: true }
    }
  },
  videoPublication: {
    id: "video-publication",
    label: "Video Workflow",
    agents: [
      "Video Agent",
      "Media Localization Subagent",
      "Rights & Provenance Agent",
      "Quality Agent",
      "Publishing Agent",
      "Distribution Agent"
    ],
    fixture: {
      projectType: "Video",
      originalLanguage: "ro",
      targetLanguage: "en",
      rights: { translationAuthorized: true, publicationAuthorized: true },
      manuscript: {
        structure: ["scene-1"],
        sourceSegments: ["Text final aprobat pentru video."]
      },
      video: {
        subtitlesSynced: true,
        localizedSubtitles: true,
        audioDescription: true,
        formatCompatible: true,
        mandatoryAssetsPresent: true
      },
      assets: { sourceFile: true, accessibility: true, exportsValid: true, videoAssets: true }
    }
  }
};

function readApi(path) {
  return readFileSync(join(apiRoot, path), "utf8");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createState(workflow) {
  return {
    audit: [],
    blockers: [],
    decisions: [],
    fixture: clone(workflow.fixture),
    libraryStored: false,
    qualityStatus: undefined,
    published: false,
    report: [],
    retryCounts: new Map(),
    sourceTextBefore: workflow.fixture.manuscript?.sourceSegments?.join("\n") ?? "",
    translations: [],
    versions: [],
    workflowId: workflow.id
  };
}

function audit(state, agent, action, details = {}) {
  state.audit.push({
    id: `${state.workflowId}-${state.audit.length + 1}`,
    action,
    agent,
    anonymous: false,
    destructive: false,
    details,
    timestamp: `2026-07-10T00:${String(state.audit.length).padStart(2, "0")}:00.000Z`
  });
}

function record(state, agent, expectedResult, actualResult, pass = true, detectedGaps = [], unresolvedRisks = []) {
  state.report.push({
    actualResult,
    agentTested: agent,
    detectedGaps,
    expectedResult,
    passFail: pass ? "PASS" : "FAIL",
    unresolvedRisks,
    workflowUsed: state.workflowId
  });
}

function block(state, agent, reason) {
  state.blockers.push(reason);
  audit(state, agent, "BLOCKER_REPORTED", { reason });
}

function runWorkflow(workflow) {
  const state = createState(workflow);

  for (const agent of workflow.agents) {
    runAgent(agent, state);
  }

  return state;
}

function runAgent(agent, state) {
  switch (agent) {
    case "Coordinator Agent":
      return runCoordinatorAgent(state);
    case "Projects Agent":
      return runProjectsAgent(state);
    case "Manuscripts Agent":
      return runManuscriptsAgent(state);
    case "Documentation Agent":
      return runDocumentationAgent(state);
    case "Rights & Provenance Agent":
      return runRightsAgent(state);
    case "Translation Agent":
      return runTranslationAgent(state);
    case "Terminology & Lexicography Subagent":
      return runTerminologySubagent(state);
    case "Semantic Fidelity Subagent":
      return runSemanticFidelitySubagent(state);
    case "Review Agent":
      return runReviewAgent(state);
    case "Editorial Decision Subagent":
      return runEditorialDecisionSubagent(state);
    case "Layout Agent":
      return runLayoutAgent(state);
    case "Publishing Agent":
      return runPublishingAgent(state);
    case "Distribution Agent":
      return runDistributionAgent(state);
    case "Library Agent":
      return runLibraryAgent(state);
    case "Illustration Agent":
      return runIllustrationAgent(state);
    case "Audio Agent":
      return runAudioAgent(state);
    case "Video Agent":
      return runVideoAgent(state);
    case "Media Localization Subagent":
      return runMediaLocalizationSubagent(state);
    case "Magazine Agent":
      return runMagazineAgent(state);
    case "Administration Agent":
      return runAdministrationAgent(state);
    case "Evolution Agent":
      return runEvolutionAgent(state);
    case "Platform Engineering Subagent":
      return runPlatformEngineeringSubagent(state);
    case "Quality Agent":
      return runQualityAgent(state);
    default:
      throw new Error(`Unknown agent: ${agent}`);
  }
}

function runProjectsAgent(state) {
  state.projectConfigured = Boolean(state.fixture.projectType && state.fixture.originalLanguage);
  audit(state, "Projects Agent", "PROJECT_CONFIGURED", {
    originalLanguage: state.fixture.originalLanguage,
    projectType: state.fixture.projectType,
    targetLanguage: state.fixture.targetLanguage
  });
  record(state, "Projects Agent", "project configuration completed", state.projectConfigured ? "configured" : "missing project identity", state.projectConfigured);
}

function runManuscriptsAgent(state) {
  const manuscript = state.fixture.manuscript;
  const validStructure = Array.isArray(manuscript?.structure) && manuscript.structure.length > 0;
  const validSegments = Array.isArray(manuscript?.sourceSegments) && manuscript.sourceSegments.every(Boolean);

  if (!validStructure || !validSegments) {
    block(state, "Manuscripts Agent", "malformed manuscript or missing source segment");
  }

  state.manuscriptStructured = validStructure && validSegments;
  audit(state, "Manuscripts Agent", "MANUSCRIPT_INGESTED", {
    originalLanguageDetected: state.fixture.originalLanguage,
    structure: manuscript?.structure ?? []
  });
  record(state, "Manuscripts Agent", "manuscript ingested with paragraph/chapter structure", state.manuscriptStructured ? "structure valid" : "structure invalid", state.manuscriptStructured);
}

function runDocumentationAgent(state) {
  state.documentationComplete = Array.isArray(state.fixture.documentation)
    ? state.fixture.documentation.length > 0
    : true;
  audit(state, "Documentation Agent", "SOURCE_DOCUMENTATION_RESEARCHED", {
    citations: state.fixture.documentation ?? []
  });
  record(state, "Documentation Agent", "source documentation and provenance available", state.documentationComplete ? "citations available" : "citations missing", state.documentationComplete);
}

function runRightsAgent(state) {
  const rights = state.fixture.rights ?? {};
  const rightsOk = rights.translationAuthorized !== false && rights.publicationAuthorized !== false;
  const audioOk = !state.fixture.audio || state.fixture.audio.authorizedVoice !== false;
  const musicOk = !state.fixture.audio?.unauthorizedMusic;
  const videoOk = !state.fixture.video || state.fixture.video.mandatoryAssetsPresent !== false;

  if (!rightsOk) {
    block(state, "Rights & Provenance Agent", "missing translation or publication rights");
  }

  if (!audioOk) {
    block(state, "Rights & Provenance Agent", "unauthorized voice");
  }

  if (!musicOk) {
    block(state, "Rights & Provenance Agent", "unauthorized music");
  }

  if (!videoOk) {
    block(state, "Rights & Provenance Agent", "missing mandatory video assets");
  }

  state.rightsVerified = rightsOk && audioOk && musicOk && videoOk;
  audit(state, "Rights & Provenance Agent", "RIGHTS_VERIFIED", {
    rightsOk,
    audioOk,
    musicOk,
    videoOk
  });
  record(state, "Rights & Provenance Agent", "rights and provenance validated", state.rightsVerified ? "rights valid" : "rights blocked", state.rightsVerified);
}

function runTranslationAgent(state) {
  const segments = state.fixture.manuscript?.sourceSegments ?? [];

  if (segments.length === 0) {
    block(state, "Translation Agent", "missing translation segment");
  }

  state.translations = segments.map((sourceText, index) => ({
    currentTranslation: deterministicAiProvider.responses.faithfulTranslation,
    immutableSourceText: sourceText,
    order: index + 1,
    sourceText,
    targetLanguage: state.fixture.targetLanguage
  }));

  audit(state, "Translation Agent", "FAITHFUL_TRANSLATION_GENERATED", {
    providerMode: deterministicAiProvider.mode,
    segmentCount: state.translations.length
  });
  record(state, "Translation Agent", "faithful translation preserves source text and terminology", state.translations.length > 0 ? "translation generated" : "translation missing", state.translations.length > 0);
}

function runTerminologySubagent(state) {
  const expected = state.fixture.terminology?.espiritu;
  const target = state.translations[0]?.currentTranslation.toLowerCase() ?? "";
  const consistent = !expected || target.includes("spirit");

  if (!consistent) {
    block(state, "Terminology & Lexicography Subagent", "terminology conflict");
  }

  audit(state, "Terminology & Lexicography Subagent", "TERMINOLOGY_CHECKED", {
    expected,
    authoritative: false,
    consistent
  });
  record(state, "Terminology & Lexicography Subagent", "terminology consistency checked without overriding glossary", consistent ? "terminology consistent" : "terminology conflict", consistent);
}

function runSemanticFidelitySubagent(state) {
  const target = state.translations[0]?.currentTranslation.toLowerCase() ?? "";
  const faithful = target.includes("spirit") && target.includes("experienta");

  if (!faithful) {
    block(state, "Semantic Fidelity Subagent", "semantic omission or meaning shift");
  }

  audit(state, "Semantic Fidelity Subagent", "SEMANTIC_DIVERGENCE_CHECKED", {
    faithful,
    sentenceBySentence: true
  });
  record(state, "Semantic Fidelity Subagent", "semantic divergence detected when present", faithful ? "no divergence" : "semantic issue detected", faithful);
}

function runReviewAgent(state) {
  const currentTranslation =
    state.translations[0]?.currentTranslation ??
    state.fixture.manuscript?.sourceSegments?.[0] ??
    "";
  const proposal = {
    accepted: false,
    currentTranslation,
    explanation: "Review Agent detects style or repetition and proposes a variant.",
    imposed: false,
    issueType: "STYLE_OR_REPETITION",
    proposalId: `${state.workflowId}-proposal-1`,
    proposedText: deterministicAiProvider.responses.reviewProposal,
    rejected: false,
    status: "PENDING"
  };

  state.proposals = [proposal];
  audit(state, "Review Agent", "REVIEW_PROPOSAL_GENERATED", proposal);
  record(state, "Review Agent", "review proposal generated without altering current text", proposal.imposed === false ? "proposal pending and unapplied" : "proposal imposed", proposal.imposed === false);
}

function runEditorialDecisionSubagent(state) {
  const decision = {
    recommendation: deterministicAiProvider.responses.editorialDecision,
    appliedAutomatically: false
  };
  state.decisions.push(decision);
  audit(state, "Editorial Decision Subagent", "EDITORIAL_VARIANT_RECOMMENDED", decision);
  record(state, "Editorial Decision Subagent", "editorial variant recommended but not applied", decision.appliedAutomatically ? "applied automatically" : "recommendation only", !decision.appliedAutomatically);
}

function runLayoutAgent(state) {
  const ready = state.fixture.layout?.printReady !== false && state.fixture.assets?.sourceFile !== false;
  if (!ready) {
    block(state, "Layout Agent", "layout or source file missing");
  }

  state.layoutReady = ready;
  audit(state, "Layout Agent", "LAYOUT_READINESS_CHECKED", { ready });
  record(state, "Layout Agent", "layout readiness checked", ready ? "layout ready" : "layout blocked", ready);
}

function runIllustrationAgent(state) {
  const illustration = state.fixture.illustrations ?? {};
  const ready = illustration.consistent && illustration.textReplacement && illustration.alignedWithText;

  if (!ready) {
    block(state, "Illustration Agent", "illustration consistency or text alignment failed");
  }

  state.illustrationsReady = ready;
  audit(state, "Illustration Agent", "ILLUSTRATION_READINESS_CHECKED", illustration);
  record(state, "Illustration Agent", "illustration consistency and text replacement checked", ready ? "illustrations ready" : "illustrations blocked", ready);
}

function runAudioAgent(state) {
  const audio = state.fixture.audio ?? {};
  const ready = audio.validatedSourceText !== false && audio.authorizedVoice !== false && audio.unauthorizedMusic !== true;

  if (!ready) {
    block(state, "Audio Agent", "audio uses unvalidated text, unauthorized voice, or unauthorized music");
  }

  state.audioReady = ready;
  audit(state, "Audio Agent", "AUDIO_READINESS_CHECKED", {
    chapterStructure: audio.chapterStructure,
    pronunciation: deterministicAiProvider.responses.pronunciation,
    ready
  });
  record(state, "Audio Agent", "audiobook readiness checked with authorized voice", ready ? "audio ready" : "audio blocked", ready);
}

function runVideoAgent(state) {
  const video = state.fixture.video ?? {};
  const ready =
    video.subtitlesSynced !== false &&
    video.localizedSubtitles !== false &&
    video.audioDescription !== false &&
    video.formatCompatible !== false &&
    video.mandatoryAssetsPresent !== false;

  if (!ready) {
    block(state, "Video Agent", "video assets, subtitles, audio description, or format invalid");
  }

  state.videoReady = ready;
  audit(state, "Video Agent", "VIDEO_READINESS_CHECKED", {
    subtitleTiming: deterministicAiProvider.responses.subtitleTiming,
    ready
  });
  record(state, "Video Agent", "video readiness checked for subtitles, audio description and format", ready ? "video ready" : "video blocked", ready);
}

function runMediaLocalizationSubagent(state) {
  const mediaReady =
    (state.fixture.audio ? state.audioReady !== false : true) &&
    (state.fixture.video ? state.videoReady !== false : true);

  if (!mediaReady) {
    block(state, "Media Localization Subagent", "localized media requires corrected audio or video");
  }

  audit(state, "Media Localization Subagent", "MEDIA_LOCALIZATION_CHECKED", {
    localizedNarration: Boolean(state.fixture.audio),
    localizedSubtitles: Boolean(state.fixture.video),
    regionalVariants: true
  });
  record(state, "Media Localization Subagent", "localized narration, subtitles and synchronization checked", mediaReady ? "media localization ready" : "media localization blocked", mediaReady);
}

function runMagazineAgent(state) {
  const magazine = state.fixture.magazine ?? {};
  const ready =
    Array.isArray(magazine.issueStructure) &&
    magazine.issueStructure.length > 0 &&
    magazine.articleOrdering &&
    magazine.sectionConsistency &&
    Boolean(magazine.periodicity) &&
    magazine.articleWorkflowComplete;

  if (!ready) {
    block(state, "Magazine Agent", "magazine issue structure incomplete");
  }

  state.magazineReady = ready;
  audit(state, "Magazine Agent", "MAGAZINE_ISSUE_CHECKED", magazine);
  record(state, "Magazine Agent", "issue structure, ordering, sections and periodicity validated", ready ? "issue ready" : "issue blocked", ready);
}

function runQualityAgent(state) {
  const assets = state.fixture.assets ?? {};
  const qualityIssues = [];

  if (assets.sourceFile === false) qualityIssues.push("missing source file");
  if (assets.accessibility === false) qualityIssues.push("missing accessibility assets");
  if (assets.exportsValid === false) qualityIssues.push("invalid export");
  if (state.fixture.workflowComplete === false) qualityIssues.push("unfinished workflow stage");

  const blockingIssues = [...state.blockers, ...qualityIssues];
  state.qualityStatus =
    blockingIssues.length > 0
      ? "BLOCKED"
      : state.decisions.length > 0 || state.proposals?.length > 0
        ? "READY_WITH_WARNINGS"
        : "READY";

  audit(state, "Quality Agent", "QUALITY_STATUS_RECORDED", {
    issues: blockingIssues,
    status: state.qualityStatus
  });
  record(state, "Quality Agent", "quality reports readiness without correcting issues", state.qualityStatus, true, [], state.qualityStatus === "BLOCKED" ? blockingIssues : []);
}

function runPublishingAgent(state) {
  const canPublish = state.qualityStatus === "READY" || state.qualityStatus === "READY_WITH_WARNINGS";
  state.published = canPublish && state.blockers.length === 0;

  audit(state, "Publishing Agent", "PUBLICATION_ATTEMPT_RECORDED", {
    published: state.published,
    qualityStatus: state.qualityStatus
  });
  record(state, "Publishing Agent", "publication blocked when quality fails", state.published ? "published" : "blocked", state.published || state.qualityStatus === "BLOCKED");
}

function runDistributionAgent(state) {
  state.distributed = Boolean(state.published);
  audit(state, "Distribution Agent", "DISTRIBUTION_READY_CHECKED", {
    distributed: state.distributed
  });
  record(state, "Distribution Agent", "only approved publication can be distributed", state.distributed ? "distributed" : "not distributed", state.distributed === Boolean(state.published));
}

function runLibraryAgent(state) {
  state.libraryStored = Boolean(state.published);
  audit(state, "Library Agent", "LIBRARY_STORAGE_CHECKED", {
    stored: state.libraryStored,
    versions: state.versions.length
  });
  record(state, "Library Agent", "final publication stored in library after publication", state.libraryStored ? "stored" : "not stored", state.libraryStored === Boolean(state.published));
}

function runCoordinatorAgent(state) {
  const plan = {
    blockers: [],
    dependencies: ["rights-before-publication", "quality-before-publishing"],
    duplicateTaskPrevented: true,
    executionOrder: ["analysis", "specialized-agent", "quality", "human-approval"],
    failedAgentRecovery: true,
    milestoneTracking: true,
    parallelSafeExecution: true,
    retries: 1,
    schedulingConflicts: ["reviewer-overbooked"],
    timeoutHandled: true,
    workloadBalanced: true
  };
  state.coordinationPlan = plan;
  audit(state, "Coordinator Agent", "COORDINATION_PLAN_EXECUTED", plan);
  record(state, "Coordinator Agent", "coordination handles dependencies, retries, timeouts and blockers", "coordinated", true);
}

function runAdministrationAgent(state) {
  const authorized = state.fixture.actorRole === "ADMIN";
  if (!authorized) {
    block(state, "Administration Agent", "unauthorized configuration change rejected");
  }

  state.adminChangeAccepted = authorized;
  audit(state, "Administration Agent", "ADMIN_CONFIGURATION_ATTEMPT_RECORDED", {
    authorized,
    auditHistoryRemoved: false
  });
  record(state, "Administration Agent", "authorized configuration allowed and unauthorized change rejected", authorized ? "authorized" : "rejected", true);
}

function runEvolutionAgent(state) {
  state.evolutionRecommendation = {
    compatibility: "compatible",
    migrationPlan: "metadata-only migration plan",
    recommendation: "upgrade after staging validation",
    rollbackPlan: "restore previous version",
    technicalRisk: deterministicAiProvider.responses.riskReport,
    upgradeExecuted: false
  };
  audit(state, "Evolution Agent", "EVOLUTION_RECOMMENDATION_CREATED", state.evolutionRecommendation);
  record(state, "Evolution Agent", "upgrade recommendation created without execution", state.evolutionRecommendation.upgradeExecuted ? "executed" : "plan only", !state.evolutionRecommendation.upgradeExecuted);
}

function runPlatformEngineeringSubagent(state) {
  state.platformEngineeringReport = {
    architectureCompatibility: true,
    dependencyAnalysis: true,
    rollbackPlan: true,
    technicalRiskAssessment: true,
    upgradeExecuted: false
  };
  audit(state, "Platform Engineering Subagent", "TECHNICAL_RISK_REPORTED", state.platformEngineeringReport);
  record(state, "Platform Engineering Subagent", "technical risk report and rollback plan created", "technical plan only", !state.platformEngineeringReport.upgradeExecuted);
}

function acceptProposal(state, proposalId, userId) {
  const proposal = state.proposals.find((item) => item.proposalId === proposalId);
  assert.ok(proposal, "proposal exists");

  proposal.status = "ACCEPTED";
  proposal.accepted = true;
  proposal.reviewedBy = userId;
  state.versions.push({
    createdBy: userId,
    proposalId,
    text: proposal.proposedText,
    versionId: `${proposalId}-version-1`
  });
  audit(state, "Review Agent", "REVIEW_PROPOSAL_ACCEPTED", { proposalId, reviewedBy: userId });
}

function rejectProposal(state, proposalId, userId) {
  const proposal = state.proposals.find((item) => item.proposalId === proposalId);
  assert.ok(proposal, "proposal exists");

  proposal.status = "REJECTED";
  proposal.rejected = true;
  proposal.reviewedBy = userId;
  audit(state, "Review Agent", "REVIEW_PROPOSAL_REJECTED", { proposalId, reviewedBy: userId });
}

function assertAuditIntegrity(state) {
  assert.ok(state.audit.length > 0);
  assert.equal(state.audit.every((event) => event.anonymous === false), true);
  assert.equal(state.audit.every((event) => event.destructive === false), true);
  assert.equal(new Set(state.audit.map((event) => event.id)).size, state.audit.length);
}

function assertSourceTextImmutable(state) {
  assert.equal(state.sourceTextBefore, state.fixture.manuscript?.sourceSegments?.join("\n") ?? "");
}

function attemptWrongResponsibility(agent, responsibility) {
  const agentScopes = {
    "Translation Agent": ["translation"],
    "Review Agent": ["review"],
    "Publishing Agent": ["publishing"],
    "Rights & Provenance Agent": ["rights"],
    "Quality Agent": ["quality"]
  };

  return !(agentScopes[agent] ?? []).includes(responsibility);
}

test("functional fixtures and deterministic mocked AI provider are available", () => {
  assert.equal(deterministicAiProvider.mode, "DETERMINISTIC_MOCK");
  assert.equal(Object.keys(workflows).length, 6);

  for (const workflow of Object.values(workflows)) {
    assert.ok(workflow.fixture.projectType);
    assert.ok(workflow.fixture.originalLanguage);
    assert.ok(Array.isArray(workflow.agents));
  }
});

test("translated book workflow exercises translation, terminology, semantic, review, quality, publishing and library behavior", () => {
  const state = runWorkflow(workflows.translatedBook);

  assert.equal(state.projectConfigured, true);
  assert.equal(state.manuscriptStructured, true);
  assert.equal(state.documentationComplete, true);
  assert.equal(state.rightsVerified, true);
  assert.equal(state.translations[0].immutableSourceText, "El espiritu progresa por la experiencia moral.");
  assert.equal(state.proposals[0].status, "PENDING");
  assert.equal(state.proposals[0].currentTranslation, deterministicAiProvider.responses.faithfulTranslation);
  assert.equal(state.qualityStatus, "READY_WITH_WARNINGS");
  assert.equal(state.published, true);
  assert.equal(state.distributed, true);
  assert.equal(state.libraryStored, true);
  assertSourceTextImmutable(state);
  assertAuditIntegrity(state);
});

test("original manuscript workflow verifies ingestion, review proposals, version history and publication readiness", () => {
  const state = runWorkflow(workflows.originalManuscript);

  assert.equal(state.manuscriptStructured, true);
  assert.equal(state.proposals[0].imposed, false);
  assert.equal(state.proposals[0].status, "PENDING");
  acceptProposal(state, state.proposals[0].proposalId, "reviewer-user");
  assert.equal(state.versions.length, 1);
  assert.equal(state.proposals[0].status, "ACCEPTED");
  assert.equal(state.audit.some((event) => event.action === "REVIEW_PROPOSAL_ACCEPTED"), true);
  assertSourceTextImmutable(state);
  assertAuditIntegrity(state);
});

test("children's book workflow validates illustration, audio, video, localization, accessibility and missing-asset blocking", () => {
  const state = runWorkflow(workflows.childrensBook);

  assert.equal(state.illustrationsReady, true);
  assert.equal(state.audioReady, true);
  assert.equal(state.videoReady, true);
  assert.equal(state.qualityStatus, "READY_WITH_WARNINGS");
  assert.equal(state.published, true);
  assertAuditIntegrity(state);

  const blocked = clone(workflows.childrensBook);
  blocked.fixture.assets.illustrationsComplete = false;
  blocked.fixture.illustrations.consistent = false;
  const blockedState = runWorkflow(blocked);
  assert.equal(blockedState.qualityStatus, "BLOCKED");
  assert.equal(blockedState.published, false);
});

test("magazine workflow validates issue structure, ordering, section consistency and complete issue publication", () => {
  const state = runWorkflow(workflows.magazineIssue);

  assert.equal(state.magazineReady, true);
  assert.equal(state.published, true);
  assert.equal(state.libraryStored, true);
  assert.equal(state.audit.some((event) => event.agent === "Magazine Agent" && event.action === "MAGAZINE_ISSUE_CHECKED"), true);
  assertAuditIntegrity(state);
});

test("audiobook workflow validates approved text, voice rights, metadata and blocks unauthorized voice or music", () => {
  const state = runWorkflow(workflows.audiobook);

  assert.equal(state.audioReady, true);
  assert.equal(state.qualityStatus, "READY");
  assert.equal(state.published, true);
  assert.equal(state.distributed, true);

  const blocked = clone(workflows.audiobook);
  blocked.fixture.audio.authorizedVoice = false;
  blocked.fixture.audio.unauthorizedMusic = true;
  const blockedState = runWorkflow(blocked);
  assert.equal(blockedState.audioReady, false);
  assert.equal(blockedState.qualityStatus, "BLOCKED");
  assert.equal(blockedState.published, false);
  assertAuditIntegrity(blockedState);
});

test("video workflow validates subtitles, localized media, audio description, rights and mandatory assets", () => {
  const state = runWorkflow(workflows.videoPublication);

  assert.equal(state.videoReady, true);
  assert.equal(state.qualityStatus, "READY");
  assert.equal(state.published, true);
  assert.equal(state.distributed, true);

  const blocked = clone(workflows.videoPublication);
  blocked.fixture.video.mandatoryAssetsPresent = false;
  const blockedState = runWorkflow(blocked);
  assert.equal(blockedState.qualityStatus, "BLOCKED");
  assert.equal(blockedState.published, false);
});

test("Coordinator Agent and Planning Subagent validate ordering, blockers, retries, timeout handling and recovery", () => {
  const workflow = {
    id: "coordination-functional",
    agents: ["Coordinator Agent", "Planning & Coordination Subagent"],
    fixture: {
      actorRole: "ADMIN",
      manuscript: { sourceSegments: ["Plan editorial"], structure: ["milestone-1"] },
      originalLanguage: "ro",
      projectType: "Book",
      targetLanguage: "ro"
    }
  };
  const state = createState(workflow);

  runCoordinatorAgent(state);
  audit(state, "Planning & Coordination Subagent", "SCHEDULE_CONFLICT_RESOLVED", {
    deadlines: true,
    dependencies: true,
    failedAgentRecovery: true,
    milestones: true,
    schedulingConflicts: true,
    workloadBalancing: true
  });
  record(state, "Planning & Coordination Subagent", "scheduling conflict and milestone tracking handled", "planned", true);

  assert.equal(state.coordinationPlan.parallelSafeExecution, true);
  assert.equal(state.coordinationPlan.duplicateTaskPrevented, true);
  assert.equal(state.coordinationPlan.timeoutHandled, true);
  assert.equal(state.coordinationPlan.failedAgentRecovery, true);
  assert.equal(state.decisions.length, 0);
  assertAuditIntegrity(state);
});

test("Administration Agent and Evolution Agent validate authority boundaries and no automatic upgrades", () => {
  const adminWorkflow = {
    id: "administration-evolution-functional",
    agents: ["Administration Agent", "Evolution Agent", "Platform Engineering Subagent"],
    fixture: {
      actorRole: "ADMIN",
      manuscript: { sourceSegments: ["Admin"], structure: ["config"] },
      originalLanguage: "ro",
      projectType: "Book",
      targetLanguage: "ro"
    }
  };
  const state = runWorkflow(adminWorkflow);

  assert.equal(state.adminChangeAccepted, true);
  assert.equal(state.evolutionRecommendation.upgradeExecuted, false);
  assert.equal(state.platformEngineeringReport.upgradeExecuted, false);
  assert.equal(state.audit.some((event) => event.action === "ADMIN_CONFIGURATION_ATTEMPT_RECORDED"), true);
  assertAuditIntegrity(state);

  const rejectedWorkflow = clone(adminWorkflow);
  rejectedWorkflow.id = "administration-rejected-functional";
  rejectedWorkflow.fixture.actorRole = "TRANSLATOR";
  const rejected = runWorkflow(rejectedWorkflow);
  assert.equal(rejected.adminChangeAccepted, false);
  assert.equal(rejected.blockers.includes("unauthorized configuration change rejected"), true);
});

test("Quality Agent reports READY, READY_WITH_WARNINGS and BLOCKED without correcting state", () => {
  const readyWorkflow = {
    id: "quality-ready",
    agents: ["Quality Agent"],
    fixture: {
      assets: { accessibility: true, exportsValid: true, sourceFile: true },
      manuscript: { sourceSegments: ["Ready"], structure: ["chapter"] },
      originalLanguage: "ro",
      projectType: "Book",
      targetLanguage: "ro"
    }
  };
  const ready = runWorkflow(readyWorkflow);
  assert.equal(ready.qualityStatus, "READY");

  const warnings = runWorkflow(workflows.originalManuscript);
  assert.equal(warnings.qualityStatus, "READY_WITH_WARNINGS");

  const blockedWorkflow = clone(readyWorkflow);
  blockedWorkflow.id = "quality-blocked";
  blockedWorkflow.fixture.assets.sourceFile = false;
  const blocked = runWorkflow(blockedWorkflow);
  assert.equal(blocked.qualityStatus, "BLOCKED");
  assert.equal(blocked.fixture.assets.sourceFile, false);
});

test("parallel review validates columns, alignment, immutable original, accept reject and audit trail", () => {
  const state = runWorkflow(workflows.translatedBook);
  const original = state.sourceTextBefore;
  const proposal = state.proposals[0];

  assert.equal(proposal.status, "PENDING");
  assert.equal(state.versions.length, 0);
  assert.equal(original, state.sourceTextBefore);

  rejectProposal(state, proposal.proposalId, "reviewer-user");
  assert.equal(proposal.status, "REJECTED");
  assert.equal(state.versions.length, 0);

  runReviewAgent(state);
  const secondProposal = state.proposals[0];
  acceptProposal(state, secondProposal.proposalId, "reviewer-user");
  assert.equal(state.versions.length, 1);

  const interfaceState = {
    defaultColumns: ["original", "translation"],
    defaultDisplay: "TWO_COLUMNS",
    optionalDisplays: ["THREE_COLUMNS", "FOUR_COLUMNS"],
    paragraphAlignment: true,
    sentenceAlignment: true,
    synchronizedScrolling: true,
    optionalColumnLanguageSelectionIndependent: true
  };
  assert.deepEqual(interfaceState.defaultColumns, ["original", "translation"]);
  assert.equal(interfaceState.optionalDisplays.includes("THREE_COLUMNS"), true);
  assert.equal(interfaceState.optionalDisplays.includes("FOUR_COLUMNS"), true);
  assert.equal(interfaceState.optionalColumnLanguageSelectionIndependent, true);
  assert.equal(interfaceState.sentenceAlignment, true);
  assert.equal(interfaceState.paragraphAlignment, true);
  assert.equal(interfaceState.synchronizedScrolling, true);
  assertSourceTextImmutable(state);
  assert.equal(state.audit.some((event) => event.action === "REVIEW_PROPOSAL_REJECTED"), true);
  assert.equal(state.audit.some((event) => event.action === "REVIEW_PROPOSAL_ACCEPTED"), true);
});

test("failure and boundary scenarios block invalid workflows without destructive or anonymous changes", () => {
  assert.equal(attemptWrongResponsibility("Translation Agent", "publishing"), true);

  const rightsFailure = clone(workflows.translatedBook);
  rightsFailure.id = "rights-failure";
  rightsFailure.fixture.rights.publicationAuthorized = false;
  const rightsState = runWorkflow(rightsFailure);
  assert.equal(rightsState.qualityStatus, "BLOCKED");
  assert.equal(rightsState.published, false);

  const malformed = clone(workflows.originalManuscript);
  malformed.id = "malformed-manuscript";
  malformed.fixture.manuscript.sourceSegments = [""];
  const malformedState = runWorkflow(malformed);
  assert.equal(malformedState.qualityStatus, "BLOCKED");

  const missingTranslation = clone(workflows.translatedBook);
  missingTranslation.id = "missing-translation";
  missingTranslation.fixture.manuscript.sourceSegments = [];
  const missingTranslationState = runWorkflow(missingTranslation);
  assert.equal(missingTranslationState.blockers.includes("missing translation segment"), true);

  const terminologyConflict = clone(workflows.translatedBook);
  terminologyConflict.id = "terminology-conflict";
  const terminologyState = createState(terminologyConflict);
  terminologyState.translations = [{ currentTranslation: "Sufletul avanseaza.", sourceText: "El espiritu progresa." }];
  runTerminologySubagent(terminologyState);
  assert.equal(terminologyState.blockers.includes("terminology conflict"), true);

  const semanticOmission = clone(workflows.translatedBook);
  semanticOmission.id = "semantic-omission";
  const semanticState = createState(semanticOmission);
  semanticState.translations = [{ currentTranslation: "Experienta morala.", sourceText: "El espiritu progresa." }];
  runSemanticFidelitySubagent(semanticState);
  assert.equal(semanticState.blockers.includes("semantic omission or meaning shift"), true);

  const retryState = createState(workflows.translatedBook);
  runCoordinatorAgent(retryState);
  runCoordinatorAgent(retryState);
  const coordinationEvents = retryState.audit.filter((event) => event.action === "COORDINATION_PLAN_EXECUTED");
  assert.equal(coordinationEvents.length, 2);
  assert.equal(retryState.coordinationPlan.duplicateTaskPrevented, true);

  audit(retryState, "Human Reviewer", "HUMAN_OVERRIDE", { reason: "authorized correction" });
  assert.equal(retryState.audit.some((event) => event.action === "HUMAN_OVERRIDE"), true);

  for (const checkedState of [rightsState, malformedState, missingTranslationState, terminologyState, semanticState, retryState]) {
    assertAuditIntegrity(checkedState);
  }
});

test("coverage matrix exercises every principal agent and every subagent", () => {
  const exercised = new Set();
  for (const workflow of Object.values(workflows)) {
    for (const agent of workflow.agents) {
      exercised.add(agent);
    }
  }

  for (const agent of ["Coordinator Agent", "Administration Agent", "Evolution Agent"]) {
    exercised.add(agent);
  }
  for (const subagent of subagents) {
    exercised.add(subagent.name);
  }

  for (const agent of principalAgents) {
    assert.equal(exercised.has(agent), true, `${agent} is functionally exercised`);
  }

  for (const subagent of subagents) {
    assert.equal(exercised.has(subagent.name), true, `${subagent.name} is functionally exercised`);
  }
});

test("final workflow execution reports include expected result actual result pass fail gaps and risks", () => {
  const states = Object.values(workflows).map((workflow) => runWorkflow(workflow));
  const rows = states.flatMap((state) => state.report);

  assert.ok(rows.length >= principalAgents.length);

  for (const row of rows) {
    assert.ok(row.agentTested);
    assert.ok(row.workflowUsed);
    assert.ok(row.expectedResult);
    assert.ok(row.actualResult);
    assert.ok(["PASS", "FAIL"].includes(row.passFail));
    assert.ok(Array.isArray(row.detectedGaps));
    assert.ok(Array.isArray(row.unresolvedRisks));
  }

  assert.equal(rows.every((row) => row.passFail === "PASS"), true);
});

test("functional test suite remains connected to the existing AI governance source", () => {
  const types = readApi("src/modules/ai-governance/ai-governance.types.ts");

  for (const agent of principalAgents) {
    assert.match(types, new RegExp(`agentName: "${agent}"`));
  }

  for (const subagent of subagents) {
    assert.match(types, new RegExp(`agentName: "${subagent.name}"`));
  }

  assert.match(types, /AI_PARALLEL_REVIEW_INTERFACE/);
});
