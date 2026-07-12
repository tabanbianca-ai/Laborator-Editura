import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");

function readApi(path) {
  return readFileSync(join(apiRoot, path), "utf8");
}

test("roles permissions and subscription entitlements reuse Workspace without a new module", () => {
  const appModule = readApi("src/modules/app.module.ts");
  const controller = readApi("src/modules/workspace/workspace.controller.ts");

  assert.doesNotMatch(appModule, /SubscriptionModule|EntitlementsModule|BillingModule/);
  assert.match(appModule, /WorkspaceModule/);
  assert.match(controller, /@Get\("subscription"\)/);
  assert.match(controller, /@Post\("access\/resolve"\)/);
  assert.doesNotMatch(controller, /x-user-id|x-organization-id|x-user-roles/);
});

test("official editorial roles are separated from subscription plans", () => {
  const types = readApi("src/modules/workspace/workspace.types.ts");
  const service = readApi("src/modules/workspace/workspace.service.ts");

  for (const role of [
    "ADMINISTRATOR",
    "PROJECT_MANAGER",
    "EDITOR",
    "TRANSLATOR",
    "REVIEWER",
    "DESIGNER",
    "AUDIO_NARRATOR",
    "AUTHOR",
    "COLLABORATOR",
    "READER",
    "GUEST"
  ]) {
    assert.match(types + service, new RegExp(role));
  }

  for (const plan of ["FREE", "PREMIUM", "BUSINESS", "ENTERPRISE_RESERVED"]) {
    assert.match(types + service, new RegExp(plan));
  }

  assert.match(types + service, /roleNamesAreNotPlanNames: true/);
  assert.match(service, /ENTERPRISE_RESERVED:[\s\S]*enabled: false/);
});

test("effective access combines role plan and need-to-know scope server-side", () => {
  const types = readApi("src/modules/workspace/workspace.types.ts");
  const service = readApi("src/modules/workspace/workspace.service.ts");

  for (const marker of [
    "WorkspaceEffectiveAccessInput",
    "WorkspaceEffectiveAccessResult",
    "resolveEffectiveAccess",
    "roleAllowed",
    "subscriptionAllowed",
    "needToKnowAllowed",
    "roleAllowed && subscriptionAllowed && needToKnowAllowed",
    "mostRestrictiveRuleApplied: true",
    "requiredFeature",
    "quotaKey",
    "requestedAmount",
    "requiredPlan",
    "explicitDenialApplied"
  ]) {
    assert.match(types + service, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(service, /this\.evaluateNeedToKnowAccess\(actor, input\)/);
  assert.match(service, /Role permissions, subscription entitlements, and Need-to-Know scope allow this action/);
  assert.match(service, /Role permissions do not allow this action/);
  assert.match(service, /Subscription plan does not include/);
  assert.match(service, /Need-to-Know scope does not allow this resource/);
});

test("subscription plans control features limits quotas and exports without data loss", () => {
  const types = readApi("src/modules/workspace/workspace.types.ts");
  const service = readApi("src/modules/workspace/workspace.service.ts");

  for (const capability of [
    "activeProjects",
    "storageMb",
    "collaborators",
    "AI_AGENT",
    "aiUsage",
    "translationSegments",
    "EXPORT_JSON_MASTER",
    "EXPORT_PDF",
    "EXPORT_EPUB",
    "EXPORT_MOBI",
    "EXPORT_DOCX",
    "EXPORT_PRINT",
    "ADVANCED_EDITORIAL_TOOLS",
    "COLLABORATION",
    "TEAM_ADMINISTRATION",
    "AUDIT_RETENTION",
    "BACKUP_RETENTION",
    "PUBLISHING_CHANNELS",
    "DISTRIBUTION_CHANNELS",
    "API_ACCESS",
    "PRIORITY_PROCESSING"
  ]) {
    assert.match(types + service, new RegExp(capability));
  }

  for (const downgradeRule of [
    "preserveExistingContent: true",
    "preserveAuditAndVersions: true",
    "disableUnavailableFutureActionsOnly: true",
    "markOverLimitResourcesReadOnly: true",
    "automaticDeletion: false",
    "remediationSummaryRequired: true",
    "dataDestroyed: false",
    "existingWorkRemoved: false",
    "restrictedNewActionOnly: true",
    "readOnlyOverLimit"
  ]) {
    assert.match(types + service, new RegExp(downgradeRule));
  }
});

test("quota feature role and temporary access restrictions are audited", () => {
  const types = readApi("src/modules/workspace/workspace.types.ts");
  const service = readApi("src/modules/workspace/workspace.service.ts");

  for (const action of [
    "ROLE_ASSIGNED",
    "ROLE_CHANGED",
    "ROLE_REVOKED",
    "SUBSCRIPTION_ACTIVATED",
    "SUBSCRIPTION_CHANGED",
    "SUBSCRIPTION_UPGRADE",
    "SUBSCRIPTION_DOWNGRADE",
    "QUOTA_EXCEEDED",
    "FEATURE_BLOCKED",
    "TEMPORARY_ACCESS_EXPIRED",
    "WORKSPACE_HUMAN_OVERRIDE"
  ]) {
    assert.match(types + service, new RegExp(action));
  }

  assert.match(service, /this\.audit\(\s*"FEATURE_BLOCKED"/);
  assert.match(service, /this\.audit\(\s*"QUOTA_EXCEEDED"/);
});
