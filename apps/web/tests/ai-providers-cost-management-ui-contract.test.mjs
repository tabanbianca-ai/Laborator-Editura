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

test("Administration displays AI providers fallback status costs and audit signals", () => {
  const page = readSource("components/pages/administration-page.tsx");

  for (const marker of [
    "AI Providers & Cost Management",
    "OpenAI",
    "Anthropic",
    "Primary",
    "Fallback",
    "Active provider",
    "Fallback status",
    "Anthropic fallback ready",
    "Automatic by default",
    "Role and subscription gated",
    "Monthly budget",
    "Remaining budget",
    "Consumption",
    "AI usage history",
    "Platform Creator has unlimited AI access"
  ]) {
    assert.match(page, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const threshold of ["80%", "90%", "100%"]) {
    assert.match(page, new RegExp(threshold));
  }

  for (const auditAction of [
    "AI_PROVIDER_CHANGED",
    "AI_FALLBACK_ACTIVATED",
    "AI_FALLBACK_RECOVERED",
    "AI_BUDGET_WARNING",
    "AI_BUDGET_EXCEEDED",
    "AI_ACTION_BLOCKED",
    "AI_SUBSCRIPTION_UPGRADED",
    "AI_SUBSCRIPTION_DOWNGRADED"
  ]) {
    assert.match(page, new RegExp(auditAction));
  }

  assert.match(page, /Subscription limits never delete data/);
  assert.match(page, /block only the\s+restricted AI action/s);
});
