import { defineConfig, devices } from "@playwright/test";
import { join } from "node:path";
import { tmpdir } from "node:os";

const runtimeDirectory = join(tmpdir(), "laborator-mvp02d-e2e");
const runtimeDatabasePath = join(runtimeDirectory, "runtime-db.json");

export default defineConfig({
  testDir: "./e2e/editorial",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  globalSetup: "./e2e/editorial/global-setup.ts",
  globalTeardown: "./e2e/editorial/global-teardown.ts",
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/mvp-02d-editorial-e2e.json" }]
  ],
  retries: process.env.CI ? 1 : 0,
  timeout: 120_000,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:3200",
    trace: "retain-on-failure"
  },
  webServer: [
    {
      command: "pnpm --filter @laborator/api start:e2e",
      cwd: "../..",
      env: {
        ...process.env,
        AI_EXTERNAL_PROCESSING_ENABLED: "false",
        LABORATOR_AUTH_LOGIN_SECRET: "mvp02d-local-access-2026",
        LABORATOR_PLATFORM_CREATOR_EMAILS: "mvp02d-editor@example.test",
        LABORATOR_RUNTIME_DB_PATH: runtimeDatabasePath,
        NODE_ENV: "development",
        PORT: "3201"
      },
      reuseExistingServer: false,
      timeout: 120_000,
      url: "http://127.0.0.1:3201/health"
    },
    {
      command: "pnpm exec next dev --port 3200",
      cwd: ".",
      env: {
        ...process.env,
        API_BASE_URL: "http://127.0.0.1:3201",
        NODE_ENV: "development"
      },
      reuseExistingServer: false,
      timeout: 120_000,
      url: "http://127.0.0.1:3200/login"
    }
  ]
});

export { runtimeDirectory };
