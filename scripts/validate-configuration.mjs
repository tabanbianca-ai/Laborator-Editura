import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

const requiredFiles = [
  ".env.example",
  "deploy/staging/.env.staging.example",
  "infrastructure/backup/laborator-backup.env.example"
];

const requiredExampleKeys = new Map([
  [
    ".env.example",
    [
      "NODE_ENV",
      "APP_ENV",
      "LABORATOR_SESSION_SECRET",
      "LABORATOR_AUTH_LOGIN_SECRET",
      "API_BASE_URL",
      "NEXT_PUBLIC_API_BASE_URL"
    ]
  ],
  [
    "deploy/staging/.env.staging.example",
    [
      "NODE_ENV",
      "APP_ENV",
      "STAGING_API_PORT",
      "STAGING_WEB_PORT",
      "LABORATOR_SESSION_SECRET",
      "LABORATOR_AUTH_LOGIN_SECRET"
    ]
  ],
  [
    "infrastructure/backup/laborator-backup.env.example",
    ["CONFIG_DIR", "PROJECT_ROOT", "DOCKER_COMPOSE_PATH", "BACKUP_DIR", "LOG_DIR"]
  ]
]);

const forbiddenExampleValues = [
  "LABORATOR_SESSION_SECRET=secret",
  "LABORATOR_AUTH_LOGIN_SECRET=secret",
  "LABORATOR_SESSION_SECRET=default",
  "LABORATOR_AUTH_LOGIN_SECRET=default",
  "LABORATOR_SESSION_SECRET=password",
  "LABORATOR_AUTH_LOGIN_SECRET=password"
];

const issues = [];

for (const file of requiredFiles) {
  const absolutePath = join(repoRoot, file);
  let content = "";

  try {
    content = readFileSync(absolutePath, "utf8");
  } catch {
    issues.push(`${file}: missing required configuration example`);
    continue;
  }

  const requiredKeys = requiredExampleKeys.get(file) ?? [];
  for (const key of requiredKeys) {
    const keyPattern = new RegExp(`^${key}=`, "mu");
    if (!keyPattern.test(content)) {
      issues.push(`${file}: missing ${key}`);
    }
  }

  for (const forbiddenValue of forbiddenExampleValues) {
    if (content.includes(forbiddenValue)) {
      issues.push(
        `${file}: contains weak example value for ${forbiddenValue.split("=")[0]}`
      );
    }
  }
}

const stagingEnv = readFileSync(
  join(repoRoot, "deploy/staging/.env.staging.example"),
  "utf8"
);
if (!/^NODE_ENV=production$/mu.test(stagingEnv)) {
  issues.push(
    "deploy/staging/.env.staging.example: NODE_ENV must remain production for Next.js"
  );
}

if (!/^APP_ENV=staging$/mu.test(stagingEnv)) {
  issues.push(
    "deploy/staging/.env.staging.example: APP_ENV must preserve staging semantics"
  );
}

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`[configuration] ERROR: ${issue}`);
  }
  process.exit(1);
}

console.log("[configuration] SUCCESS: configuration examples validated");
