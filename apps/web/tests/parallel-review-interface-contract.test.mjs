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
    "buildReviewProposals"
  ]) {
    assert.match(client, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("review workspace renders default two-column parallel comparison", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");

  for (const marker of [
    "Parallel translation and review",
    "Default: two columns",
    "Column 1",
    "Source text",
    "Column 2",
    "Translated text",
    "Display mode",
    "Optional language or version",
    "Choose language or version independently",
    "parallel-review-grid-two",
    "Original text is immutable",
    "Sentence and paragraph alignment is preserved"
  ]) {
    assert.match(page, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("review workspace exposes optional three and four column modes without duplicating workflow", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");
  const styles = readSource("app/globals.css");

  assert.match(page, /Optional: three columns/);
  assert.match(page, /Optional: four columns/);
  assert.match(page, /Synchronized scrolling can be toggled/);
  assert.match(page, /Differences highlighted/);
  assert.match(page, /Columns can be resized or hidden/);
  assert.match(styles, /\.parallel-review-grid-two/);
  assert.doesNotMatch(page, /new ReviewWorkflow|createReviewWorkflow|autoApprove|autoPublish/);
});

test("proposal actions remain individual, non-imposed and auditable", () => {
  const page = readSource("components/pages/review-workspace-page.tsx");

  for (const marker of [
    "Proposed replacement variants",
    "Accept proposal",
    "Reject proposal",
    "Individual proposal actions",
    "Accept and reject decisions are audited",
    "current translation is preserved until accepted",
    "Translation remains unchanged until an authorized human accepts a proposal"
  ]) {
    assert.match(page, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
