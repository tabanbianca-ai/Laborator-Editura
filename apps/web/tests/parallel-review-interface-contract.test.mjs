import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

test("review workspace client exposes parallel review and proposal models", () => {
  const client = readSource("lib/review-workspace-client.ts");

  for (const marker of [
    "ReviewProposal",
    "ParallelReviewInterfaceState",
    'defaultDisplayMode: "TWO_COLUMNS"',
    '"THREE_COLUMNS"',
    '"FOUR_COLUMNS"',
    "sentenceAndParagraphAlignment",
    "synchronizedScrollingCanBeToggled",
    "originalTextImmutable",
    "translationUnchangedUntilProposalAccepted",
    "acceptedRejectedProposalsAudited",
    "versionHistoryPreserved",
    "reviewProposals",
    "listEditorialRecommendations",
    "mapEditorialRecommendations"
  ]) {
    assert.match(client, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("review workspace renders default two-column parallel comparison", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");

  for (const marker of [
    'ui.t("parallelReview")',
    'ui.t("defaultTwoColumns")',
    'ui.t("columnOne")',
    'ui.t("sourceText")',
    'ui.t("columnTwo")',
    'ui.t("translatedText")',
    'ui.t("displayMode")',
    'ui.t("optionalLanguageVersion")',
    'ui.t("chooseLanguageVersion")',
    "parallel-review-grid-two",
    'ui.t("originalTextRule")',
    'parallel-review-grid-two'
  ]) {
    assert.match(page, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("review workspace exposes optional three and four column modes without duplicating workflow", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");
  const styles = readSource("app/globals.css");

  assert.match(page, /ui\.t\("optionalThreeColumns"\)/);
  assert.match(page, /ui\.t\("optionalFourColumns"\)/);
  assert.match(page, /ui\.t\("synchronizedScrolling"\)/);
  assert.match(page, /ui\.t\("differencesHighlighted"\)/);
  assert.match(page, /ui\.t\("columnsResizable"\)/);
  assert.match(styles, /\.parallel-review-grid-two/);
  assert.doesNotMatch(page, /new ReviewWorkflow|createReviewWorkflow|autoApprove|autoPublish/);
});

test("proposal actions remain individual, non-imposed and auditable", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");

  for (const marker of [
    'ui.t("proposedReplacementVariants")',
    'ui.t("acceptProposal")',
    'ui.t("rejectProposal")',
    'ui.t("individualProposalActions")',
    'ui.t("useDecisionsAudited")',
    'proposal.currentTranslation',
    'proposal.status === "PENDING"'
  ]) {
    assert.match(page, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
