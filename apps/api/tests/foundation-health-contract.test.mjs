import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");

function readApiSource(path) {
  return readFileSync(join(apiRoot, "src", path), "utf8");
}

test("health controller exposes safe public liveness readiness and startup checks", () => {
  const controller = readApiSource("modules/health.controller.ts");

  for (const route of ['@Get("liveness")', '@Get("readiness")', '@Get("startup")']) {
    assert.match(controller, new RegExp(route.replace(/[()]/gu, "\\$&")));
  }

  assert.match(controller, /check: "liveness"/);
  assert.match(controller, /check: "readiness"/);
  assert.match(controller, /check: "startup"/);
  assert.doesNotMatch(controller, /process\.env|secret|password|token/iu);
});

test("request context middleware keeps all health checks public and strips query/trailing slash", () => {
  const middleware = readApiSource("modules/auth/request-context.middleware.ts");

  assert.match(middleware, /request\.originalUrl \?\? request\.path \?\? request\.url/);
  assert.match(middleware, /split\("\?"\)/);
  assert.match(middleware, /replace\(\/\\\/\+\$\/u, ""\)/);
  assert.match(
    middleware,
    /routePath === "\/health" \|\| routePath\.startsWith\("\/health\/"\)/
  );
  assert.match(middleware, /routePath === "\/auth\/login"/);
});
