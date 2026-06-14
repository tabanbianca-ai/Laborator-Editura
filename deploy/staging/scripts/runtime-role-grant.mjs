#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const [dbPath, organizationId, userId, requestedRole] = process.argv.slice(2);
const allowedRoles = new Set(["ADMIN", "REVIEWER"]);

if (!dbPath || !organizationId || !userId || !requestedRole) {
  console.error("Usage: runtime-role-grant.mjs <dbPath> <organizationId> <userId> <ADMIN|REVIEWER>");
  process.exit(1);
}

if (!allowedRoles.has(requestedRole)) {
  console.error("Role must be ADMIN or REVIEWER.");
  process.exit(1);
}

const db = JSON.parse(readFileSync(dbPath, "utf8"));
db.user_roles = Array.isArray(db.user_roles) ? db.user_roles : [];

const now = new Date().toISOString();
const roles = ["TRANSLATOR", requestedRole];

for (const role of roles) {
  const exists = db.user_roles.some((row) =>
    row.organizationId === organizationId &&
    row.userId === userId &&
    row.role === role
  );

  if (!exists) {
    db.user_roles.push({
      id: randomUUID(),
      organizationId,
      userId,
      role,
      createdAt: now
    });
  }
}

writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`);

console.log(JSON.stringify({
  status: "ok",
  action: "grant-runtime-role",
  organizationId,
  userId,
  roles
}, null, 2));
