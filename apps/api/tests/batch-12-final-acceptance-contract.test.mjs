import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const releaseDir = join(repositoryRoot, "docs", "releases", "v1.0");

const requiredReleaseDocuments = [
  "pilot-plan.md",
  "uat-results.md",
  "pilot-defects.md",
  "regression-results.md",
  "final-security-gate.md",
  "final-accessibility-gate.md",
  "final-localization-gate.md",
  "final-rights-gate.md",
  "final-restore-evidence.md",
  "performance-comparison.md",
  "final-traceability-matrix.md",
  "sbom.md",
  "build-provenance.md",
  "known-issues.md",
  "release-notes.md",
  "certification-record.md",
  "production-checklist.md",
  "hypercare-plan.md",
  "v1.1-backlog.md"
];

function readReleaseDocument(fileName) {
  return readFileSync(join(releaseDir, fileName), "utf8");
}

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

test("v1.0 final acceptance deliverables exist", () => {
  for (const fileName of requiredReleaseDocuments) {
    const filePath = join(releaseDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }
});

test("final acceptance is blocked because RC1 approval precondition is unmet", () => {
  const batch11Report = readRepositoryFile(
    "docs",
    "implementation",
    "execution-batches",
    "batch-11",
    "rc1-readiness-report.md"
  );
  const pilotPlan = readReleaseDocument("pilot-plan.md");
  const certification = readReleaseDocument("certification-record.md");

  assert.match(batch11Report, /RC1 status: BLOCKED/);
  assert.match(pilotPlan, /BLOCKED_PENDING_RC1_APPROVAL/);
  assert.match(pilotPlan, /Batch 11 is `BLOCKED`/);
  assert.match(certification, /decision: NOT_CERTIFIED/);
  assert.match(certification, /Batch 11 did not produce `RC1_APPROVED`/);
  assert.doesNotMatch(certification, /^decision: CERTIFIED$/m);
});

test("pilot UAT and dataset scope are defined without claiming execution", () => {
  const pilotPlan = readReleaseDocument("pilot-plan.md");
  const uat = readReleaseDocument("uat-results.md");

  for (const datasetItem of [
    "editorial project",
    "manuscript",
    "translation",
    "proofreading",
    "book",
    "magazine",
    "image",
    "publication",
    "rights and provenance",
    "users with all approved roles"
  ]) {
    assert.match(pilotPlan, new RegExp(datasetItem));
  }

  for (const role of [
    "Administrator",
    "Editor",
    "Translator",
    "Proofreader",
    "Designer",
    "Audio Narrator",
    "Author",
    "Collaborator",
    "Reader",
    "Guest"
  ]) {
    assert.match(uat, new RegExp(`${role} \\| NOT_RUN`));
  }

  assert.match(uat, /Status: NOT_STARTED/);
});

test("pilot defects keep open P0 blockers visible", () => {
  const defects = readReleaseDocument("pilot-defects.md");
  const knownIssues = readReleaseDocument("known-issues.md");

  for (const blocker of ["DEF-V1-001", "DEF-V1-002", "DEF-V1-003", "DEF-V1-004"]) {
    assert.match(defects, new RegExp(blocker));
  }

  assert.match(defects, /P0 BLOCKER/);
  assert.match(defects, /OPEN P0 = 0/);
  assert.match(knownIssues, /BLOCKING_ISSUES_PRESENT/);
  assert.match(knownIssues, /Blocking known issues cannot ship in final v1\.0/);
});

test("final gates cover security accessibility localization rights restore performance and traceability", () => {
  assert.match(readReleaseDocument("final-security-gate.md"), /CRITICAL_SECURITY_FINDINGS = 0/);
  assert.match(readReleaseDocument("final-security-gate.md"), /BLOCKED_PENDING_FINAL_GATE/);
  assert.match(readReleaseDocument("final-accessibility-gate.md"), /No Blocking or Critical accessibility issues/);
  assert.match(readReleaseDocument("final-localization-gate.md"), /no mixed-language interface/);
  assert.match(readReleaseDocument("final-rights-gate.md"), /No publication with ambiguous legal status may be certified/);
  assert.match(readReleaseDocument("final-restore-evidence.md"), /Restore candidate backup -> Login -> Project -> Master -> Library -> Publication/);
  assert.match(readReleaseDocument("performance-comparison.md"), /RC1 baseline vs\. final candidate/);
  assert.match(readReleaseDocument("final-traceability-matrix.md"), /No mandatory requirement may remain `MISSING`/);
});

test("SBOM build provenance production checklist and hypercare remain blocked until final artifact exists", () => {
  assert.match(readReleaseDocument("sbom.md"), /Status: MISSING/);
  assert.match(readReleaseDocument("sbom.md"), /exact `1\.0\.0` artifact digest/);
  assert.match(readReleaseDocument("build-provenance.md"), /Status: MISSING/);
  assert.match(readReleaseDocument("build-provenance.md"), /No final `1\.0\.0` artifact has been produced/);
  assert.match(readReleaseDocument("production-checklist.md"), /Status: BLOCKED/);
  assert.match(readReleaseDocument("production-checklist.md"), /Do not deploy to production/);
  assert.match(readReleaseDocument("hypercare-plan.md"), /Status: NOT_ACTIVE/);
});

test("release notes and v1.1 backlog do not expand v1.0 scope", () => {
  const releaseNotes = readReleaseDocument("release-notes.md");
  const releaseBacklog = readReleaseDocument("v1.1-backlog.md");
  const canonicalBacklog = readRepositoryFile("docs", "roadmap", "v1.1-backlog.md");

  assert.match(releaseNotes, /DRAFT_NOT_RELEASED/);
  assert.match(releaseNotes, /RC1 is not approved/);
  assert.match(releaseBacklog, /New features remain outside v1\.0 final acceptance/);
  assert.match(canonicalBacklog, /must not be treated as RC1 commitments/);
});

