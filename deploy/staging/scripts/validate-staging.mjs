#!/usr/bin/env node
import { spawnSync } from "node:child_process";

import { loadStagingEnv } from "./staging-env.mjs";

loadStagingEnv();

const steps = [
  ["environment", ["deploy/staging/scripts/validate-env.mjs"]],
  ["health", ["deploy/staging/scripts/health-check.mjs"]],
  ["bootstrap-admin-reviewer", ["deploy/staging/scripts/bootstrap-admin-reviewer.mjs"]],
  ["smoke-test", ["deploy/staging/scripts/staging-smoke-test.mjs"]],
  ["monitoring-hook", ["deploy/staging/scripts/monitoring-hook.mjs"]]
];

const results = [];

for (const [name, args] of steps) {
  const startedAt = Date.now();
  const result = spawnSync(process.execPath, args, {
    env: process.env,
    stdio: "inherit"
  });

  results.push({
    durationMs: Date.now() - startedAt,
    name,
    status: result.status === 0 ? "ok" : "failed"
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    console.error(JSON.stringify({
      checkedAt: new Date().toISOString(),
      status: "failed",
      failedStep: name,
      results
    }, null, 2));
    process.exit(result.status ?? 1);
  }
}

console.log(JSON.stringify({
  checkedAt: new Date().toISOString(),
  status: "ok",
  action: "validate-staging",
  results
}, null, 2));
