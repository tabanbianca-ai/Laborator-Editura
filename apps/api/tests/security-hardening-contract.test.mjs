import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");
const modulesDir = join(apiRoot, "src", "modules");

function readModule(path) {
  return readFileSync(join(modulesDir, path), "utf8");
}

test("security headers middleware configures standard HTTP hardening headers", () => {
  const source = readModule("security/security-headers.middleware.ts");
  const appModule = readModule("app.module.ts");

  for (const header of [
    "Content-Security-Policy",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy"
  ]) {
    assert.match(source, new RegExp(header));
  }

  assert.match(appModule, /SecurityHeadersMiddleware/);
  assert.match(appModule, /SecurityHeadersMiddleware, RateLimitMiddleware, RequestContextMiddleware/);
});

test("rate limiting covers auth and sensitive API endpoints with safe errors", () => {
  const source = readModule("security/rate-limit.middleware.ts");

  assert.match(source, /RATE_LIMIT_POLICIES/);
  assert.match(source, /auth: \{/);
  assert.match(source, /sensitive: \{/);
  assert.match(source, /routePath\.startsWith\("\/auth"\)/);
  assert.match(source, /routePath\.startsWith\("\/export"\)/);
  assert.match(source, /routePath\.startsWith\("\/workflow"\)/);
  assert.match(source, /TooManyRequestsException\(SAFE_RATE_LIMIT_MESSAGE\)/);
  assert.match(source, /Too many requests\. Try again later\./);
});

test("environment validation requires strong staging and production secrets without logging values", () => {
  const source = readModule("security/environment-security.ts");
  const main = readFileSync(join(apiRoot, "src", "main.ts"), "utf8");

  assert.match(source, /PROTECTED_ENVIRONMENTS = new Set\(\["staging", "production"\]\)/);
  assert.match(source, /LABORATOR_SESSION_SECRET/);
  assert.match(source, /LABORATOR_AUTH_LOGIN_SECRET/);
  assert.match(source, /isWeakSecret/);
  assert.match(source, /weak or uses a default\/demo value/);
  assert.doesNotMatch(source, /console\.log|console\.error/);
  assert.match(main, /validateSecurityEnvironment\(\)/);
});

test("auth login records failed attempts and temporary account lockout", () => {
  const service = readModule("auth/auth.service.ts");
  const repository = readModule("auth/auth.repository.ts");
  const types = readModule("auth/auth.types.ts");

  assert.match(service, /MAX_FAILED_LOGIN_ATTEMPTS = 5/);
  assert.match(service, /ACCOUNT_LOCKOUT_MS = 15 \* 60 \* 1000/);
  assert.match(service, /assertAccountNotLocked\(email\)/);
  assert.match(service, /recordFailedLogin\(email, "Invalid login credentials\."\)/);
  assert.match(service, /UnauthorizedException\("Invalid login credentials\."\)/);
  assert.match(service, /ACCOUNT_LOCKED/);
  assert.match(service, /LOGIN_LOCKED/);
  assert.match(repository, /findLoginAttemptByEmail/);
  assert.match(repository, /upsertLoginAttempt/);
  assert.match(repository, /appendSecurityEvent/);
  assert.match(types, /AuthLoginAttempt/);
  assert.match(types, /AuthSecurityEvent/);
});

test("sessions include absolute expiration and idle timeout validation", () => {
  const service = readModule("auth/auth.service.ts");
  const repository = readModule("auth/auth.repository.ts");
  const types = readModule("auth/auth.types.ts");

  assert.match(service, /SESSION_TTL_MS = 8 \* 60 \* 60 \* 1000/);
  assert.match(service, /SESSION_IDLE_TIMEOUT_MS = 30 \* 60 \* 1000/);
  assert.match(service, /expiresAt: this\.createSessionExpiration\(now\)/);
  assert.match(service, /lastSeenAt: now/);
  assert.match(service, /isSessionExpired\(session\)/);
  assert.match(service, /isSessionIdleTimedOut\(session\)/);
  assert.match(service, /SESSION_EXPIRED/);
  assert.match(service, /SESSION_IDLE_TIMEOUT/);
  assert.match(repository, /updateSession\(session: AuthSession\)/);
  assert.match(types, /expiresAt\?: string/);
  assert.match(types, /lastSeenAt\?: string/);
});

test("staging security scripts pass login secret from environment without printing it", () => {
  const bootstrap = readFileSync(
    join(apiRoot, "..", "..", "deploy", "staging", "scripts", "bootstrap-admin-reviewer.mjs"),
    "utf8"
  );
  const smoke = readFileSync(
    join(apiRoot, "..", "..", "deploy", "staging", "scripts", "staging-smoke-test.mjs"),
    "utf8"
  );

  assert.match(bootstrap, /LABORATOR_AUTH_LOGIN_SECRET/);
  assert.match(smoke, /LABORATOR_AUTH_LOGIN_SECRET/);
  for (const line of bootstrap.split(/\r?\n/u).filter((candidate) => candidate.includes("console.log"))) {
    assert.doesNotMatch(line, /LABORATOR_AUTH_LOGIN_SECRET/);
  }
  for (const line of smoke.split(/\r?\n/u).filter((candidate) => candidate.includes("console.log"))) {
    assert.doesNotMatch(line, /LABORATOR_AUTH_LOGIN_SECRET/);
  }
});

test("staging deployment documentation includes server hardening checklist", () => {
  const deploymentChecklist = readFileSync(
    join(apiRoot, "..", "..", "docs", "DEPLOYMENT_CHECKLIST.md"),
    "utf8"
  );
  const stagingPreparation = readFileSync(
    join(apiRoot, "..", "..", "docs", "STAGING_DEPLOYMENT_PREPARATION.md"),
    "utf8"
  );
  const stagingReadme = readFileSync(
    join(apiRoot, "..", "..", "deploy", "staging", "README.md"),
    "utf8"
  );
  const combined = `${deploymentChecklist}\n${stagingPreparation}\n${stagingReadme}`;

  for (const requiredText of [
    "22",
    "80",
    "443",
    "SSH keys",
    "Root password login",
    "HTTPS/SSL",
    "encrypted at rest",
    "security events",
    "daily"
  ]) {
    assert.match(combined, new RegExp(requiredText, "i"));
  }
});
