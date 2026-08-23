import { defineConfig, devices } from "@playwright/test";

const externalBaseUrl = process.env.P1_03_BASE_URL;

export default defineConfig({
  testDir: "./e2e/localization",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/p1-03-localization-results.json" }]
  ],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: externalBaseUrl ?? "http://127.0.0.1:3000",
    trace: "retain-on-failure"
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: "pnpm dev",
        reuseExistingServer: true,
        timeout: 120_000,
        url: "http://127.0.0.1:3000/login"
      }
});
