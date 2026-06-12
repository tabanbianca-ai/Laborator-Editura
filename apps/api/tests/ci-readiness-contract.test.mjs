import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const workflow = readFileSync(join(root, ".github", "workflows", "ci.yml"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");

test("GitHub Actions CI runs required MVP validation checks", () => {
  assert.match(workflow, /name: CI/);
  assert.match(workflow, /actions\/checkout@v4/);
  assert.match(workflow, /actions\/setup-node@v4/);
  assert.match(workflow, /node --test apps\/api\/tests\/\*\.test\.mjs/);
  assert.match(workflow, /node --test packages\/db\/tests\/\*\.test\.mjs/);
  assert.match(workflow, /node --test packages\/shared\/tests\/\*\.test\.mjs/);
  assert.match(workflow, /Fixture JSON validation/);
  assert.match(workflow, /mvp-e2e-validation\.json/);
  assert.match(workflow, /mvp-operational-workflow\.json/);
});

test("GitHub Actions CI includes conditional typecheck when dependencies are available", () => {
  assert.match(workflow, /corepack prepare pnpm@10\.12\.1 --activate/);
  assert.match(workflow, /pnpm install --no-frozen-lockfile/);
  assert.match(workflow, /if: steps\.dependencies\.outputs\.available == 'true'/);
  assert.match(workflow, /pnpm typecheck/);
  assert.match(workflow, /Typecheck skipped/);
});

test("README documents local CI verification commands and typecheck condition", () => {
  assert.match(readme, /## Local Verification/);
  assert.match(readme, /node --test apps\/api\/tests\/\*\.test\.mjs/);
  assert.match(readme, /node --test packages\/db\/tests\/\*\.test\.mjs/);
  assert.match(readme, /node --test packages\/shared\/tests\/\*\.test\.mjs/);
  assert.match(readme, /mvp-e2e-validation\.json/);
  assert.match(readme, /pnpm typecheck/);
  assert.match(readme, /only when dependencies are\s+available/);
});
