import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const batchDir = join(
  repositoryRoot,
  "docs",
  "implementation",
  "execution-batches",
  "batch-11"
);

const requiredDocuments = [
  "overview.md",
  "final-implementation-inventory.md",
  "consolidation-report.md",
  "contract-convergence.md",
  "e2e-editorial.md",
  "e2e-publishing.md",
  "e2e-distribution.md",
  "e2e-multimedia.md",
  "e2e-ai.md",
  "cross-org-security.md",
  "privilege-escalation-tests.md",
  "localization-validation.md",
  "accessibility-validation.md",
  "performance-baseline.md",
  "data-integrity.md",
  "migration-validation.md",
  "restore-validation.md",
  "deployment-rehearsal.md",
  "defect-register.md",
  "risk-burndown.md",
  "final-traceability-matrix.md",
  "final-security-gate.md",
  "rc1-sbom.md",
  "rc1-build-provenance.md",
  "known-issues.md",
  "rc1-release-notes.md",
  "rc1-checklist.md",
  "rc1-readiness-report.md",
  "roadmap-v1.1.md"
];

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

function readBatchDocument(fileName) {
  return readRepositoryFile("docs", "implementation", "execution-batches", "batch-11", fileName);
}

test("Batch 11 required RC1 stabilization deliverables exist", () => {
  for (const fileName of requiredDocuments) {
    const filePath = join(batchDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }

  assert.equal(existsSync(join(repositoryRoot, "docs", "roadmap", "v1.1-backlog.md")), true);
});

test("Batch 11 enters release stabilization mode and keeps RC1 blocked without live evidence", () => {
  const overview = readBatchDocument("overview.md");
  const rc1Report = readBatchDocument("rc1-readiness-report.md");
  const checklist = readBatchDocument("rc1-checklist.md");

  assert.match(overview, /RELEASE_STABILIZATION_MODE/);
  assert.match(overview, /New functional modules are frozen/);
  assert.match(overview, /Status: BLOCKED/);
  assert.match(rc1Report, /RC1 status: BLOCKED/);
  assert.match(rc1Report, /Do not mark Codex v1\.0\.0-rc\.1 as approved yet/);
  assert.doesNotMatch(rc1Report, /RC1_APPROVED/);
  assert.match(checklist, /Status: BLOCKED/);
  assert.match(checklist, /\[ \] Restore PASS from real staging backup/);
  assert.match(checklist, /\[ \] SBOM generated for exact artifact/);
  assert.match(checklist, /\[ \] RC1 artifact immutable/);
});

test("final inventory distinguishes implemented tested documented and RC1-ready status", () => {
  const inventory = readBatchDocument("final-implementation-inventory.md");

  for (const moduleName of [
    "Identity/Auth/RBAC",
    "Projects and Project Identity",
    "Author Studio",
    "Translation",
    "Publishing and Export",
    "Distribution and Public Portal",
    "Library and Reader",
    "Rights and Provenance",
    "AI Orchestrator and Governance",
    "Observability",
    "Backup and Recovery",
    "DevSecOps and CI"
  ]) {
    assert.match(inventory, new RegExp(moduleName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const column of [
    "Implemented",
    "Tested",
    "Documented",
    "Security",
    "Accessibility",
    "Localization",
    "Operations",
    "RC1"
  ]) {
    assert.match(inventory, new RegExp(column));
  }

  assert.match(inventory, /No module is marked `RC1_APPROVED`/);
});

test("consolidation and contract convergence avoid destructive duplicate cleanup during RC stabilization", () => {
  const consolidation = readBatchDocument("consolidation-report.md");
  const convergence = readBatchDocument("contract-convergence.md");

  assert.match(consolidation, /No implementation is deleted or merged only because it appears duplicated/);
  assert.match(consolidation, /No destructive consolidation was performed/);
  assert.match(convergence, /Deprecated or compatibility contracts must remain tested/);
  assert.match(convergence, /Build artifact model \| MIGRATION_REQUIRED/);
  assert.match(convergence, /Dependency lock model \| HUMAN_DECISION_REQUIRED/);
});

test("Batch 11 covers required E2E editorial publishing distribution multimedia and AI journeys", () => {
  assert.match(
    readBatchDocument("e2e-editorial.md"),
    /Create Project -> Import Manuscript -> Canonical Master -> Version -> Translation/
  );
  assert.match(
    readBatchDocument("e2e-publishing.md"),
    /Approved Edition -> Publication Readiness -> Build -> PDF -> EPUB/
  );
  assert.match(
    readBatchDocument("e2e-distribution.md"),
    /Approved Publication -> Public Visibility -> Public Catalog/
  );
  assert.match(readBatchDocument("e2e-distribution.md"), /Published.*Withdrawal Request/s);
  assert.match(readBatchDocument("e2e-multimedia.md"), /Master -> Audio -> Transcript/);
  assert.match(readBatchDocument("e2e-multimedia.md"), /Children's Edition -> Illustration/);
  assert.match(readBatchDocument("e2e-ai.md"), /AI cannot bypass authorization, rights checks/);
});

test("security localization accessibility performance migration restore and deployment gates remain explicit", () => {
  assert.match(readBatchDocument("cross-org-security.md"), /Any confirmed unauthorized cross-organization access is an RC1 blocker/);
  assert.match(readBatchDocument("privilege-escalation-tests.md"), /Default: DENY/);
  assert.match(readBatchDocument("localization-validation.md"), /Romanian \(`ro-RO`\)/);
  assert.match(readBatchDocument("accessibility-validation.md"), /keyboard/);
  assert.match(readBatchDocument("performance-baseline.md"), /No invented thresholds are allowed/);
  assert.match(readBatchDocument("data-integrity.md"), /Normal user journeys must not create orphaned resources/);
  assert.match(readBatchDocument("migration-validation.md"), /Clean database/);
  assert.match(readBatchDocument("restore-validation.md"), /RC1_BLOCKED/);
  assert.match(readBatchDocument("deployment-rehearsal.md"), /Rollback -> Redeploy/);
  assert.match(readBatchDocument("final-security-gate.md"), /Any Critical vulnerability/);
});

test("defects risks SBOM provenance known issues and release notes are honest about blockers", () => {
  assert.match(readBatchDocument("defect-register.md"), /DEF-RC1-001/);
  assert.match(readBatchDocument("defect-register.md"), /P0 BLOCKER/);
  assert.match(readBatchDocument("risk-burndown.md"), /Critical open risks block RC1/);
  assert.match(readBatchDocument("rc1-sbom.md"), /BLOCKED until generated/);
  assert.match(readBatchDocument("rc1-build-provenance.md"), /No immutable RC1 artifact has been produced/);
  assert.match(readBatchDocument("known-issues.md"), /The current P0 known issues block approval/);
  assert.match(readBatchDocument("rc1-release-notes.md"), /Draft, not approved/);
});

test("traceability and v1.1 backlog preserve scope without claiming missing RC1 evidence", () => {
  const traceability = readBatchDocument("final-traceability-matrix.md");
  const batchBacklog = readBatchDocument("roadmap-v1.1.md");
  const roadmapBacklog = readRepositoryFile("docs", "roadmap", "v1.1-backlog.md");

  assert.match(traceability, /Requirement -> Standard -> Module -> Implementation -> Test -> Evidence/);
  assert.match(traceability, /Mandatory `MISSING` rows block RC1/);
  assert.match(batchBacklog, /Features that are desirable but nonessential for v1\.0/);
  assert.match(roadmapBacklog, /must not be treated as RC1 commitments/);
});

