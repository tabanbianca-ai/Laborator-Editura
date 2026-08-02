import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..", "..");

function readRepo(path) {
  return readFileSync(join(repoRoot, path), "utf8");
}

test("CI includes Batch 01 minimum validation gates", () => {
  const ci = readRepo(".github/workflows/ci.yml");

  for (const command of [
    "pnpm install",
    "node scripts/validate-configuration.mjs",
    "pnpm format:check",
    "pnpm typecheck",
    "pnpm lint",
    "pnpm test",
    "pnpm build",
    "bash infrastructure/validation/scan-secrets.sh"
  ]) {
    assert.match(ci, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("secret scanner reports suspected files without printing matched secret values", () => {
  const scanner = readRepo("infrastructure/validation/scan-secrets.sh");

  assert.match(scanner, /git grep -l -I -E/);
  assert.match(scanner, /Matched values are intentionally not printed/);
  assert.match(scanner, /Rotate any real exposed credentials before release/);
  assert.doesNotMatch(scanner, /git grep -n -I -E/);
});

test("generated package and platform caches are ignored for future commits", () => {
  const gitignore = readRepo(".gitignore");
  const prettierignore = readRepo(".prettierignore");

  for (const pattern of [".pnpm-store", ".swift-module-cache"]) {
    assert.match(gitignore, new RegExp(pattern.replace(".", "\\.")));
    assert.match(prettierignore, new RegExp(pattern.replace(".", "\\.")));
  }
});
