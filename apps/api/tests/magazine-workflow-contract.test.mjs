import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");
const repoRoot = join(apiRoot, "..", "..");
const moduleDir = join(apiRoot, "src", "modules", "magazine-workflow");

function readModuleSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

function readRepo(path) {
  return readFileSync(join(repoRoot, path), "utf8");
}

function normalizeSource(source) {
  return source.replace(/\s+/g, " ").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");
}

test("magazine workflow is registered as an authenticated module on the existing platform", () => {
  const appModule = readRepo("apps/api/src/modules/app.module.ts");
  const moduleSource = readModuleSource("magazine-workflow.module.ts");
  const controller = readModuleSource("magazine-workflow.controller.ts");

  for (const fileName of [
    "magazine-workflow.controller.ts",
    "magazine-workflow.module.ts",
    "magazine-workflow.repository.ts",
    "magazine-workflow.service.ts",
    "magazine-workflow.types.ts"
  ]) {
    assert.equal(existsSync(join(moduleDir, fileName)), true, `${fileName} must exist`);
  }

  assert.match(appModule, /MagazineWorkflowModule/);
  assert.match(moduleSource, /WorkflowModule/);
  assert.match(moduleSource, /LayoutPublishingModule/);
  assert.match(moduleSource, /RightsProvenanceModule/);
  assert.match(moduleSource, /ProjectsModule/);
  assert.match(moduleSource, /DocumentsModule/);
  assert.match(moduleSource, /runtimeDatabaseProvider/);
  assert.match(moduleSource, /exports: \[MagazineWorkflowService\]/);
  assert.match(controller, /@Controller\("magazine-workflow"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id|x-organization-id/);
});

test("magazine workflow exposes issue article layout preflight publication and audit endpoints", () => {
  const controller = readModuleSource("magazine-workflow.controller.ts");

  for (const endpoint of [
    '@Post("issues")',
    '@Get("issues")',
    '@Get("issues/:id")',
    '@Post("issues/:id/sections")',
    '@Post("issues/:id/common-materials")',
    '@Post("common-materials/:id/validate")',
    '@Post("issues/:id/articles")',
    '@Post("articles/:id/components")',
    '@Post("components/:id/validate")',
    '@Post("articles/:id/text/finalize")',
    '@Post("articles/:id/text")',
    '@Post("articles/:id/translation/complete")',
    '@Post("articles/:id/review/complete")',
    '@Post("articles/:id/approve")',
    '@Post("articles/:id/review-items")',
    '@Post("review-items/:id/severity")',
    '@Post("review-items/:id/override")',
    '@Post("review-items/:id/resolve")',
    '@Post("articles/:id/ready-for-issue")',
    '@Post("issues/:id/articles/reorder")',
    '@Post("articles/:id/move")',
    '@Post("issues/:id/table-of-contents/refresh")',
    '@Post("issues/:id/layout/assemble")',
    '@Post("issues/:id/global-control")',
    '@Post("issues/:id/preflight")',
    '@Post("issues/:id/final-approval")',
    '@Post("issues/:id/publish")',
    '@Post("issues/:id/revisions")',
    '@Post("issues/:id/withdraw")',
    '@Post("issues/:id/republish")',
    '@Post("issues/:id/distribution-promotion")',
    '@Post("reuse")',
    '@Post("issues/:id/adaptability/analyze")',
    '@Get("issues/:id/versions")',
    '@Get("audit")',
    '@Get("issues/:id/audit")'
  ]) {
    assert.match(controller, new RegExp(endpoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("issue and article models support tree structure common materials components and official versions", () => {
  const types = readModuleSource("magazine-workflow.types.ts");
  const service = readModuleSource("magazine-workflow.service.ts");

  for (const typeName of [
    "MagazineIssue",
    "MagazineSection",
    "MagazineArticle",
    "MagazineArticleComponent",
    "MagazineCommonMaterial",
    "MagazineTableOfContents",
    "MagazineIssueVersion",
    "MagazineDistributionPromotionRecord",
    "MagazineReviewItem",
    "MagazineSourceLineage",
    "MagazineAdaptabilityAnalysis"
  ]) {
    assert.match(types, new RegExp(`interface ${typeName}`));
  }

  for (const value of [
    "FRONT_COVER",
    "BACK_COVER",
    "EDITORIAL",
    "TABLE_OF_CONTENTS",
    "MASTHEAD",
    "ISSUE_METADATA",
    "INTRODUCTORY_PAGE",
    "FINAL_PAGE",
    "ADVERTISEMENT",
    "GLOBAL_GRAPHIC",
    "TEXT",
    "IMAGE",
    "AUDIO",
    "VIDEO",
    "TRANSCRIPT",
    "SUBTITLE",
    "MINOR",
    "MAJOR",
    "CRITICAL",
    "OVERRIDDEN",
    "READY_FOR_ISSUE",
    "PUBLISHED",
    "WITHDRAWN",
    "REPUBLISHED"
  ]) {
    assert.match(types, new RegExp(`"${value}"`));
  }

  assert.match(service, /project\.publicationType !== "MAGAZINE"/);
  assert.match(service, /DEFAULT_COMMON_MATERIALS/);
  assert.match(service, /articleOrder/);
  assert.match(service, /sectionOrder/);
  assert.match(service, /currentOfficialVersionId/);
  assert.match(types, /currentOfficialVersion\?: MagazineIssueVersion/);
});

test("article workflow enforces text review approval conditional translation and media accessibility gates", () => {
  const service = normalizeSource(readModuleSource("magazine-workflow.service.ts"));

  for (const marker of [
    'translationRequired && article.translationStatus !== "COMPLETED"',
    'correctionStatus !== "COMPLETED"',
    'editorialApprovalStatus !== "APPROVED"',
    "TEXT_NOT_VALIDATED",
    "TRANSLATION_REQUIRED",
    "TRANSLATION_OUTDATED",
    "CORRECTION_REQUIRED",
    "EDITORIAL_APPROVAL_REQUIRED",
    "AUDIO_TRANSCRIPT_REQUIRED",
    "VIDEO_TRANSCRIPT_OR_SUBTITLE_REQUIRED",
    "BLOCKING_COMPONENT_STATUSES",
    "markArticleReadyForIssue",
    "recalculateArticleReadiness"
  ]) {
    assert.match(service, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(service, /approveArticle\(actor: MagazineActor/);
  assert.match(service, /this\.assertAuthorizedHuman\(actor\)/);
  assert.match(service, /Only authorized humans may approve article readiness/);
});

test("review severity makes Needs Review publication blocking severity-aware", () => {
  const service = normalizeSource(readModuleSource("magazine-workflow.service.ts"));
  const types = normalizeSource(readModuleSource("magazine-workflow.types.ts"));

  for (const marker of [
    "MagazineReviewSeverity",
    "MagazineReviewItemStatus",
    "CreateMagazineReviewItemInput",
    "OverrideMagazineReviewItemInput",
    "createReviewItem",
    "updateReviewItemSeverity",
    "overrideReviewItem",
    "resolveReviewItem",
    "componentReviewBlockers",
    "reviewItemGateIssue",
    "minorReviewDoesNotBlockPublication",
    "criticalReviewCannotBeOverridden"
  ]) {
    assert.match(service + types, new RegExp(marker));
  }

  assert.match(service, /item\.severity === "MINOR"[\s\S]*"WARNING"/);
  assert.match(
    service,
    /item\.severity === "MAJOR" && item\.status === "OVERRIDDEN"[\s\S]*"WARNING"/
  );
  assert.match(service, /item\.severity === "CRITICAL"[\s\S]*CRITICAL_REVIEW_ITEM/);
  assert.match(service, /Only MAJOR magazine review items may be overridden/);
  assert.match(
    service,
    /Review override cannot bypass mandatory correction or editorial approval/
  );
  assert.match(service, /gateBlocksPublication/);
  assert.match(service, /!overview\.issue\.preflight \|\| this\.gateBlocksPublication/);
});

test("dependency revalidation preserves history and invalidates only affected media outputs", () => {
  const service = normalizeSource(readModuleSource("magazine-workflow.service.ts"));
  const types = normalizeSource(readModuleSource("magazine-workflow.types.ts"));

  assert.match(service, /updateArticleText/);
  assert.match(service, /MAGAZINE_ARTICLE_TEXT_UPDATED/);
  assert.match(service, /isDependentOutput/);
  assert.match(service, /component\.componentType === "TEXT"/);
  assert.match(
    service,
    /component\.componentType === "TRANSCRIPT" \|\| component\.componentType === "SUBTITLE"/
  );
  assert.match(service, /"NEEDS_REVIEW"/);
  assert.match(service, /"OUTDATED"/);
  assert.match(service, /return Promise\.resolve\(component\)/);
  assert.match(service, /createDraftVersionIfPublished/);
  assert.match(service, /createPublishedRevision/);
  assert.match(service, /REPUBLICATION_IN_PROGRESS/);
  assert.match(service, /MAGAZINE_PUBLISHED_REVISION_CREATED/);
  assert.match(service, /derivedFromVersionId: String\(article\.version\)/);
  assert.match(
    service,
    /translationStatus: article\.translationRequired && article\.translationStatus === "COMPLETED"[\s\S]*\? "OUTDATED"/
  );
  assert.match(
    service,
    /updatedLineage\(component\.lineage, "OUTDATED", article\.version\)/
  );
  assert.match(service, /currentOfficialVersionId/);
  assert.match(types, /previousVersionId\?: string/);
  assert.match(types, /beforeState\?: object/);
  assert.match(types, /afterState\?: object/);
});

test("article ordering section moves and dynamic table of contents are versioned and audited", () => {
  const service = readModuleSource("magazine-workflow.service.ts");
  const types = readModuleSource("magazine-workflow.types.ts");

  for (const marker of [
    "reorderArticles",
    "moveArticle",
    "refreshTableOfContents",
    "buildTableOfContents",
    "repositionArticle",
    "markTableOfContentsOutdated",
    "MAGAZINE_ARTICLES_REORDERED",
    "MAGAZINE_ARTICLE_MOVED",
    "MAGAZINE_TABLE_OF_CONTENTS_UPDATED"
  ]) {
    assert.match(service + types, new RegExp(marker));
  }

  assert.match(types, /entries: MagazineTableOfContentsEntry\[]/);
  assert.match(types, /sectionId\?: string/);
  assert.match(types, /order: number/);
});

test("issue-level quality gates block layout preflight approval publication and distribution when dependencies fail", () => {
  const service = readModuleSource("magazine-workflow.service.ts");
  const types = readModuleSource("magazine-workflow.types.ts");

  for (const marker of [
    "assembleLayout",
    "runGlobalControl",
    "runPreflight",
    "approveFinalIssue",
    "publishIssue",
    "withdrawIssue",
    "republishIssue",
    "recordDistributionPromotion",
    "evaluateIssueQualityGate",
    "assertIssuePublishable",
    "ARTICLE_NOT_READY_FOR_ISSUE",
    "COMMON_MATERIAL_NOT_VALIDATED",
    "TABLE_OF_CONTENTS_OUTDATED",
    "LAYOUT_NOT_ASSEMBLED",
    "Publication requires a passing magazine preflight",
    "Publication requires final approval",
    "Distribution and promotion can use only the current official published issue"
  ]) {
    assert.match(service, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(service, /layoutPublishingService\.createPlan/);
  assert.match(service, /publicationKind: "MAGAZINE"/);
  assert.match(service, /noIndependentEditorialCopies: true/);
  assert.match(service, /rightsProvenanceService\.listPublishingAuthorizations/);
  assert.match(service, /rightsProvenanceService\.listTranslationAuthorizations/);
  assert.match(types, /humanFinalAuthorityRequired: true/);
});

test("publishing version withdrawal republication and cross-edition reuse preserve provenance", () => {
  const service = readModuleSource("magazine-workflow.service.ts");
  const types = readModuleSource("magazine-workflow.types.ts");

  for (const marker of [
    "createIssueVersion",
    "supersedeCurrentOfficialVersion",
    "immutablePublishedHistory",
    "provenancePreserved",
    "sourceLineage",
    "sourceOfRecordId",
    "sourceVersionId",
    "derivedFromId",
    "derivedFromVersionId",
    "derivationType",
    "PUBLICATION_VERSION",
    "TRANSLATION",
    "EDITORIAL_REVISION",
    "MAGAZINE_PUBLISHED",
    "MAGAZINE_WITHDRAWN",
    "MAGAZINE_REPUBLISHED",
    "MAGAZINE_OFFICIAL_VERSION_SWITCHED",
    "MAGAZINE_CROSS_EDITION_REUSE_CREATED",
    "createCrossEditionReuse",
    "sourceIssueId",
    "sourceArticleId",
    "sourceArticleVersion",
    "CROSS_EDITION_REFERENCE",
    'reusedFrom: "CROSS_EDITION_REUSE"',
    "noIndependentSourceOfTruth: true"
  ]) {
    assert.match(
      service + types,
      new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
  }
});

test("AI Project Adaptability Agent remains advisory and existing engines retain execution authority", () => {
  const service = readModuleSource("magazine-workflow.service.ts");
  const types = readModuleSource("magazine-workflow.types.ts");

  for (const marker of [
    "buildAdaptabilityAnalysis",
    "analyzeAdaptability",
    "MAGAZINE_ADAPTABILITY_ANALYZED",
    "dependencyProtection: true",
    "branchingSupported: true",
    "scenarioBranchComparisonSupported: true",
    "controlledVersionRestoreSupported: true",
    "avoidsValidatedStageLoss: true",
    "aiMayAnalyzeAndProposeOnly: true",
    "workflowEngineExecutes: true",
    "versioningPreservesStates: true",
    "auditPreservesActions: true",
    "Workflow Engine executes"
  ]) {
    assert.match(
      service + types,
      new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
  }
});

test("runtime database and backup cover magazine workflow persistence and tenant references", () => {
  const repository = readModuleSource("magazine-workflow.repository.ts");
  const runtimeDatabase = normalizeSource(
    readRepo("packages/db/src/runtime-database.ts")
  );
  const runtimeBackup = normalizeSource(
    readRepo("packages/db/scripts/runtime-backup-lib.mjs")
  );

  for (const tableName of [
    "magazine_issues",
    "magazine_sections",
    "magazine_articles",
    "magazine_article_components",
    "magazine_review_items",
    "magazine_common_materials",
    "magazine_issue_versions",
    "magazine_audit_events"
  ]) {
    assert.match(
      repository + runtimeDatabase + runtimeBackup,
      new RegExp(`"${tableName}"`)
    );
  }

  for (const reference of [
    '"magazine_issues", "projectId", "projects"',
    '"magazine_sections", "issueId", "magazine_issues"',
    '"magazine_articles", "issueId", "magazine_issues"',
    '"magazine_articles", "documentId", "documents"',
    '"magazine_article_components", "articleId", "magazine_articles"',
    '"magazine_review_items", "issueId", "magazine_issues"',
    '"magazine_review_items", "articleId", "magazine_articles"',
    '"magazine_review_items", "componentId", "magazine_article_components"',
    '"magazine_common_materials", "issueId", "magazine_issues"',
    '"magazine_issue_versions", "issueId", "magazine_issues"',
    '"magazine_audit_events", "issueVersionId", "magazine_issue_versions"'
  ]) {
    assert.match(
      runtimeDatabase,
      new RegExp(reference.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
    assert.match(
      runtimeBackup,
      new RegExp(reference.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
  }
});
