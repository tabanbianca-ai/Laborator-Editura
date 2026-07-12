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

test("Administration clearly separates users roles from subscription usage", () => {
  const page = readSource("components/pages/administration-page.tsx");

  assert.match(page, /Users and Roles/);
  assert.match(page, /Subscription and Usage/);
  assert.match(page, /Roluri operaționale, separate de abonament/);
  assert.match(page, /Planuri comerciale, cote și limitări/);
  assert.match(page, /Not roles/);
  assert.match(page, /Effective access/);
  assert.match(page, /Role permissions/);
  assert.match(page, /Subscription entitlements/);
  assert.match(page, /Need-to-Know scope/);
});

test("Administration surfaces plans usage quotas and downgrade-safe actions without mixing role names", () => {
  const page = readSource("components/pages/administration-page.tsx");
  const css = readSource("app/globals.css");

  for (const plan of ["FREE", "PREMIUM", "BUSINESS", "ENTERPRISE_RESERVED"]) {
    assert.match(page, new RegExp(plan));
  }

  for (const usage of [
    "Active projects",
    "Collaborators",
    "Storage",
    "AI usage",
    "Export entitlements",
    "Project limit reached",
    "Collaborator quota guarded",
    "Storage quota tracked",
    "AI quota tracked",
    "Premium required for EPUB/MOBI/DOCX"
  ]) {
    assert.match(page, new RegExp(usage));
  }

  assert.match(page, /Upgrade plan/);
  assert.match(page, /Downgrade plan/);
  assert.match(page, /Button disabled/);
  assert.match(css, /\.admin-plan-list/);
  assert.match(css, /\.admin-access-formula/);
  assert.match(css, /\.admin-subscription-actions/);
});
