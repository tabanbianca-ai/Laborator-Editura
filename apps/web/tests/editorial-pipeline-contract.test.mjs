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

test("pipeline routes exist for project list and project production workflow", () => {
  const indexRoute = readSource("app/pipeline/page.tsx");
  const projectRoute = readSource("app/pipeline/[projectId]/page.tsx");

  assert.match(indexRoute, /getEditorialPipelineIndexData/);
  assert.match(projectRoute, /getEditorialPipelineData/);
  assert.match(projectRoute, /projectId/);
  assert.match(projectRoute, /documentId/);
});

test("pipeline client orchestrates existing modules without creating a new backend module", () => {
  const client = readSource("lib/editorial-pipeline-client.ts");

  for (const step of [
    "Import Manuscript",
    "Automatic Analysis",
    "Editing",
    "Translation",
    "Editorial Review",
    "Editorial Validation",
    "Layout",
    "Export",
    "Technical Validation",
    "Final Approval",
    "Publication",
    "Audiobook (optional)",
    "Video (optional)"
  ]) {
    assert.match(client, new RegExp(step.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const route of [
    "/author-studio",
    "/translation",
    "/review",
    "/workflow-center",
    "/publishing",
    "/distribution",
    "/rights"
  ]) {
    assert.match(client, new RegExp(route));
  }

  assert.match(client, /getRightsWarningsForDocument/);
  assert.match(client, /Language mismatch/);
  assert.match(client, /Export missing/);
  assert.match(client, /Preview Audio/);
  assert.match(client, /MP3/);
  assert.match(client, /M4B/);
  assert.match(client, /MP4/);
  assert.match(client, /READY_FOR_GENERATION/);
  assert.match(client, /Video Production/);
  assert.match(client, /Official video requires final approved text and publishing rights/);
  assert.match(client, /Distribution Center/);
  assert.match(client, /Preflight validates ISBN, metadata, rights\/provenance, cover, fonts, image resolution, table of contents, hyperlinks, PDF print, EPUB, MOBI, JSON Master, audiobook, video, and magazine flipbook readiness/);
  assert.match(client, /Resolve preflight blockers before publication/);
  assert.doesNotMatch(client, /apiPost/);
});

test("pipeline UI renders vertical steps media controls with locked actions and human authority guidance", () => {
  const page = readSource("components/pages/editorial-pipeline-page.tsx");
  const css = readSource("app/globals.css");
  const navigation = readSource("components/layout/navigation.ts");

  assert.match(page, /pipeline-vertical/);
  assert.match(page, /PipelineStepCard/);
  assert.match(page, /Open workspace/);
  assert.match(page, /Preview Audio/);
  assert.match(page, /Voice selection/);
  assert.match(page, /Locale \/ accent selection/);
  assert.match(page, /Playback speed/);
  assert.match(page, /Regenerate Preview/);
  assert.match(page, /never published/);
  assert.match(page, /Generate Audiobook/);
  assert.match(page, /Audiobook Status/);
  assert.match(page, /Narrator/);
  assert.match(page, /Voice/);
  assert.match(page, /Language/);
  assert.match(page, /Export/);
  assert.match(page, /Video Preview/);
  assert.match(page, /Generate Preview Video/);
  assert.match(page, /Generate Official Video/);
  assert.match(page, /Technical Validation/);
  assert.match(page, /Video status/);
  assert.match(page, /Format/);
  assert.match(page, /data\.video\.exportFormat/);
  assert.match(page, /Thumbnail\/cover metadata/);
  assert.match(page, /Voice-over source/);
  assert.match(page, /Subtitle language\/locale/);
  assert.match(page, /Export status/);
  assert.match(page, /never public/);
  assert.match(page, /disabled type="button"/);
  assert.match(page, /AI may summarize progress/);
  assert.match(page, /suggest video visuals, subtitles, and timing/);
  assert.match(page, /cannot approve workflow, publish, approve audiobook or video, or grant rights/);
  assert.match(css, /\.pipeline-layout/);
  assert.match(css, /\.pipeline-step/);
  assert.match(css, /\.audiobook-status-grid/);
  assert.match(css, /\.audiobook-preview-controls/);
  assert.match(css, /\.video-status-grid/);
  assert.match(navigation, /Production Pipeline/);
});
