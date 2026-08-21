import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const workflow = readFileSync(
  join(repositoryRoot, ".github", "workflows", "staging-network-diagnostic.yml"),
  "utf8"
);

test("staging network diagnostic is manual, isolated, and non-mutating", () => {
  assert.match(workflow, /^on:\n {2}workflow_dispatch:\s*$/m);
  assert.match(workflow, /^ {4}runs-on: ubuntu-latest$/m);
  assert.match(workflow, /^ {4}environment: staging$/m);
  assert.match(workflow, /VPS_HOST: \$\{\{ secrets\.VPS_HOST \}\}/);
  assert.match(workflow, /VPS_PORT: \$\{\{ secrets\.VPS_PORT \}\}/);
  assert.match(workflow, /\[\[ ! "\$VPS_PORT" =~ \^\[0-9\]\+\$ \]\]/);
  assert.match(workflow, /^ {12}nc -vz -w 10 "\$VPS_HOST" "\$VPS_PORT"$/m);
  assert.match(workflow, /^ {10}\} >\/dev\/null 2>&1; then$/m);

  assert.doesNotMatch(workflow, /secrets\.(?!VPS_HOST|VPS_PORT)/);
  assert.doesNotMatch(workflow, /\b(?:ssh|scp|sftp|docker)\b/i);
  assert.doesNotMatch(workflow, /(?:download|upload)-artifact/i);
  assert.doesNotMatch(workflow, /\bdeploy\b/i);
  assert.doesNotMatch(workflow, /echo[^\n]*\$VPS_HOST/);
});
