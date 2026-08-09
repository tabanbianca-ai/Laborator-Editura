import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const releaseDir = join(repositoryRoot, "docs", "releases", "v1.1");

const requiredDocuments = [
  "v1.0-certified-baseline.md",
  "backlog-inventory.md",
  "backlog-consolidation.md",
  "user-feedback-register.md",
  "technical-debt-register.md",
  "performance-opportunities.md",
  "cost-optimization.md",
  "public-website-integration.md",
  "compatibility-baseline.md",
  "prioritized-roadmap.md",
  "execution-waves.md",
  "v1.1-readiness.md"
];

function readReleaseDocument(fileName) {
  return readFileSync(join(releaseDir, fileName), "utf8");
}

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

test("v1.1 planning baseline deliverables exist", () => {
  for (const fileName of requiredDocuments) {
    const filePath = join(releaseDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }
});

test("v1.1 planning preserves the actual v1.0 certification state", () => {
  const v10Certification = readRepositoryFile("docs", "releases", "v1.0", "certification-record.md");
  const baseline = readReleaseDocument("v1.0-certified-baseline.md");
  const readiness = readReleaseDocument("v1.1-readiness.md");

  assert.match(v10Certification, /decision: NOT_CERTIFIED/);
  assert.match(baseline, /Status: PENDING_CERTIFIED_BASELINE/);
  assert.match(baseline, /decision: NOT_CERTIFIED/);
  assert.match(readiness, /Status: BLOCKED_PENDING_V1_0_CERTIFICATION/);
  assert.doesNotMatch(baseline, /IMMUTABLE CERTIFIED BASELINE\n\nCodex v1\.0 is certified/);
});

test("v1.1 backlog inventory consolidates deferred candidate domains", () => {
  const inventory = readReleaseDocument("backlog-inventory.md");

  for (const candidate of [
    "Public website integration",
    "Advanced commerce",
    "Additional distribution connectors",
    "Advanced real-time collaboration",
    "Advanced magazine production",
    "Advanced AI editorial agent automation",
    "Semantic editorial search",
    "Advanced analytics",
    "Marketing automation",
    "Social media publishing",
    "Advanced audiobook production",
    "Advanced children interactive books",
    "Additional platform and translation languages",
    "Extended accessibility",
    "Mobile applications"
  ]) {
    assert.match(inventory, new RegExp(candidate));
  }

  assert.match(inventory, /V11-BL-001/);
  assert.match(inventory, /REQUIRED_BEFORE_IMPLEMENTATION/);
});

test("duplicate backlog themes are consolidated into canonical entries", () => {
  const consolidation = readReleaseDocument("backlog-consolidation.md");

  assert.match(consolidation, /One Wave 2 architecture and integration stream/);
  assert.match(consolidation, /One commerce extension stream/);
  assert.match(consolidation, /One governed AI automation stream/);
  assert.match(consolidation, /Already Satisfied Foundations/);
  assert.match(consolidation, /Future work must extend these foundations instead of creating duplicate modules/);
});

test("public website integration keeps the public site independent from the internal platform", () => {
  const website = readReleaseDocument("public-website-integration.md");

  assert.match(website, /independent public-facing application/);
  assert.match(website, /canonical editorial source of truth/);
  assert.match(website, /Do not merge the public website into the internal editorial app/);
  assert.match(website, /Do not duplicate the editorial source of truth/);
});

test("v1.1 compatibility baseline protects v1.0 identities data and audit", () => {
  const compatibility = readReleaseDocument("compatibility-baseline.md");

  for (const protectedArea of [
    "Database identifiers",
    "Public APIs",
    "Event contracts",
    "Publication lineage",
    "Master Documents",
    "Library records",
    "Rights and provenance records",
    "User identities",
    "Audit history"
  ]) {
    assert.match(compatibility, new RegExp(protectedArea));
  }

  assert.match(compatibility, /Audit history rewrite \| No \| Not allowed/);
});

test("v1.1 roadmap and waves require Definition of Ready before implementation", () => {
  const roadmap = readReleaseDocument("prioritized-roadmap.md");
  const waves = readReleaseDocument("execution-waves.md");
  const readiness = readReleaseDocument("v1.1-readiness.md");

  assert.match(roadmap, /Incremental improvements are preferred over destabilizing changes/);
  assert.match(waves, /All waves are gated by the certified v1\.0 baseline/);
  assert.match(readiness, /No v1\.1 feature may enter implementation until it has/);
  assert.match(readiness, /security impact/);
  assert.match(readiness, /rollback strategy/);
});

