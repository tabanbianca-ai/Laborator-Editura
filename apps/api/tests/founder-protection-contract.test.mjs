import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "auth");

function readAuthSource(fileName) {
  return readFileSync(join(moduleDir, fileName), "utf8");
}

test("auth exposes founder protection recovery and ownership transfer endpoints", () => {
  const controller = readAuthSource("auth.controller.ts");

  assert.match(controller, /@Get\("founder-protection"\)/);
  assert.match(controller, /@Post\("founder-protection\/recover"\)/);
  assert.match(controller, /@Post\("founder-protection\/transfer"\)/);
  assert.match(controller, /@Post\("founder-protection\/transfer\/:transferId\/accept"\)/);
  assert.match(controller, /@Post\("founder-protection\/transfer\/:transferId\/cancel"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id|x-organization-id|x-user-roles/);
});

test("founder protection is created for the organization founder during organization creation", () => {
  const service = readAuthSource("auth.service.ts");
  const repository = readAuthSource("auth.repository.ts");

  assert.match(service, /organizationCreated\s*\?\s*await this\.repository\.createFounderProtection/);
  assert.match(service, /founderUserId: user\.id/);
  assert.match(service, /protectionStatus: "ACTIVE"/);
  assert.match(service, /recoveryEnabled: true/);
  assert.match(repository, /createFounderProtection\(protection: FounderProtection\)/);
});

test("founder recovery uses server-derived actor and restores privileged roles without client input", () => {
  const service = readAuthSource("auth.service.ts");
  const repository = readAuthSource("auth.repository.ts");

  assert.match(service, /FOUNDER_RECOVERY_ROLES: MvpRole\[] = \["ADMIN", "REVIEWER", "TRANSLATOR"\]/);
  assert.match(service, /recoverFounderProtection\(actor: AuthActor\)/);
  assert.match(service, /this\.assertCurrentFounder\(actor, protection\)/);
  assert.match(service, /assignRoles\(\s*actor\.organizationId,\s*actor\.userId,\s*FOUNDER_RECOVERY_ROLES/s);
  assert.match(service, /syncUserSessionRoles\(actor\.organizationId, actor\.userId, roles\)/);
  assert.match(repository, /syncUserSessionRoles\(organizationId: string, userId: string, roles: MvpRole\[\]\)/);
  assert.doesNotMatch(service, /input\.roles|x-user-id|x-organization-id|x-user-roles/);
});

test("founder ownership transfer requires current founder and target acceptance", () => {
  const service = readAuthSource("auth.service.ts");

  assert.match(service, /initiateFounderOwnershipTransfer/);
  assert.match(service, /this\.assertCurrentFounder\(actor, protection\)/);
  assert.match(service, /targetUserId === actor\.userId/);
  assert.match(service, /userBelongsToOrganization/);
  assert.match(service, /findPendingFounderOwnershipTransfer/);
  assert.match(service, /status: "PENDING"/);
  assert.match(service, /expiresAt: this\.createTransferExpiration\(now\)/);
  assert.match(service, /acceptFounderOwnershipTransfer/);
  assert.match(service, /this\.assertTransferNotExpired\(transfer\)/);
  assert.match(service, /transfer\.toFounderUserId !== actor\.userId/);
  assert.match(service, /acceptingUserBelongsToOrganization/);
  assert.match(service, /this\.assertTransferMatchesFounderState\(protection, transfer\)/);
  assert.match(service, /status: "ACCEPTED"/);
  assert.match(service, /founderUserId: actor\.userId/);
});

test("founder ownership transfer expires after thirty days and supports founder cancellation", () => {
  const service = readAuthSource("auth.service.ts");

  assert.match(service, /FOUNDER_TRANSFER_EXPIRATION_DAYS = 30/);
  assert.match(service, /FOUNDER_TRANSFER_EXPIRATION_MS/);
  assert.match(service, /createTransferExpiration\(createdAt: string\)/);
  assert.match(service, /isTransferExpired\(transfer: FounderOwnershipTransfer\)/);
  assert.match(service, /cancelFounderOwnershipTransfer/);
  assert.match(service, /only the founder who initiated the transfer may cancel it/);
  assert.match(service, /cancelPendingTransfer/);
  assert.match(service, /status: "CANCELLED"/);
  assert.match(service, /protectionStatus: "ACTIVE"/);
});

test("only one active founder ownership transfer is allowed per organization", () => {
  const service = readAuthSource("auth.service.ts");

  assert.match(service, /findPendingFounderOwnershipTransfer\(actor\.organizationId\)/);
  assert.match(service, /a founder ownership transfer is already pending/);
  assert.match(service, /if \(!this\.isTransferExpired\(pendingTransfer\)\)/);
  assert.match(service, /cancelPendingTransfer\(actor, protection, pendingTransfer, now\)/);
});

test("founder protection actions are audited in foundation audit events", () => {
  const service = readAuthSource("auth.service.ts");
  const repository = readAuthSource("auth.repository.ts");
  const types = readAuthSource("auth.types.ts");

  for (const entityType of [
    "FOUNDER_PROTECTION",
    "FOUNDER_RECOVERY",
    "FOUNDER_OWNERSHIP_TRANSFER"
  ]) {
    assert.match(types, new RegExp(`"${entityType}"`));
    assert.match(service, new RegExp(`"${entityType}"`));
    assert.match(repository, new RegExp(`event\\.entityType === "${entityType}"`));
  }
});
