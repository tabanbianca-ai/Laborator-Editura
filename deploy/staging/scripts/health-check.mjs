#!/usr/bin/env node
import { loadStagingEnv, stripTrailingSlash } from "./staging-env.mjs";

loadStagingEnv();

const apiBase = stripTrailingSlash(
  process.env.API_BASE ?? process.env.API_BASE_URL ?? "http://localhost:3001"
);
const webOrigin = stripTrailingSlash(
  process.env.STAGING_WEB_ORIGIN ?? process.env.WEB_ORIGIN ?? "http://localhost:3000"
);

const checks = [
  {
    name: "api",
    url: `${apiBase}/health`
  },
  {
    name: "web",
    url: webOrigin
  }
];

const results = [];

for (const check of checks) {
  results.push(await probe(check.name, check.url));
}

const ok = results.every((result) => result.ok);

console.log(JSON.stringify({
  checkedAt: new Date().toISOString(),
  status: ok ? "ok" : "failed",
  checks: results
}, null, 2));

if (!ok) {
  process.exitCode = 1;
}

async function probe(name, url) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal
    });

    return {
      name,
      url,
      ok: response.ok,
      statusCode: response.status,
      latencyMs: Date.now() - startedAt
    };
  } catch (error) {
    return {
      name,
      url,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      latencyMs: Date.now() - startedAt
    };
  } finally {
    clearTimeout(timeout);
  }
}
