import { expect, request as playwrightRequest, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const apiBaseUrl = "http://127.0.0.1:3201";

function docxFixture(): Buffer {
  const source = readFileSync(
    join(process.cwd(), "..", "api", "tests", "mvp-editorial-workflow.integration.test.mjs"),
    "utf8"
  );
  const match = source.match(/const docxFixture = Buffer\.from\(\s*"([A-Za-z0-9+/=]+)",\s*"base64"\s*\)/u);
  if (!match) {
    throw new Error("Canonical DOCX test fixture was not found.");
  }
  return Buffer.from(match[1]!, "base64");
}

test("actual browser completes the isolated FR to RO editorial workflow", async ({ context, page }) => {
  const projectName = `MVP-02D ${Date.now()}`;

  await page.goto("/login?locale=en-US");
  await page.getByLabel("Email").fill("mvp02d-editor@example.test");
  await page.getByLabel("Access code").fill("mvp02d-local-access-2026");
  await page.getByLabel("Display name").fill("MVP 02D Editor");
  await page.getByLabel("Organization name").fill("MVP 02D Isolated Organization");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/dashboard/u);

  await page.goto("/projects/new");
  await page.locator('input[name="name"]').fill(projectName);
  await page.locator('input[name="sourceLanguage"]').fill("fr");
  await page.locator('input[name="targetLanguage"]').fill("ro");
  await page.locator('input[name="targetLocale"]').fill("ro-RO");
  await page.locator('input[name="originalLanguage"]').fill("fr");
  await page.locator('input[name="originalLocale"]').fill("fr-FR");
  await page.locator('input[name="capabilities"][value="TRANSLATION"]').check();
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page).toHaveURL(/\/pipeline\/[^/?]+/u);
  const projectId = new URL(page.url()).pathname.split("/").at(-1);
  expect(projectId).toBeTruthy();

  await page.goto("/documents");
  await page.locator('input[name="file"]').setInputFiles({
    buffer: docxFixture(),
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "mvp-02d-manuscript.docx"
  });
  await page.locator('select[name="projectId"]').selectOption({ label: projectName });
  await page.locator('input[name="originalLanguage"]').fill("fr");
  await page.locator('input[name="originalLocale"]').fill("fr-FR");
  await page.locator('input[name="targetLanguage"]').fill("ro");
  await page.locator('input[name="targetLocale"]').fill("ro-RO");
  await page.locator('input[name="title"]').fill("Manuscris editorial MVP-02D");
  await page.getByRole("button", { name: "Import and segment" }).click();
  await expect(page).toHaveURL(/\/documents\/[^/?]+/u);
  const documentId = new URL(page.url()).pathname.split("/").at(-1);
  expect(documentId).toBeTruthy();
  await expect(page.getByText("Le principe spirituel", { exact: false }).first()).toBeVisible();

  const translateLink = page.getByRole("link", { name: "Translate" }).first();
  await translateLink.click();
  await expect(page).toHaveURL(/\/translation\?documentId=/u);
  const segmentId = new URL(page.url()).searchParams.get("segmentId");
  expect(segmentId).toBeTruthy();
  await page.locator('textarea[name="targetText"]').fill("Principiul spiritual");
  await page.locator('input[name="translatorName"]').fill("Traducător MVP-02D");
  await page.getByRole("button", { name: "Save translation" }).click();
  await expect(page.getByText("Principiul spiritual", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.locator('textarea[name="targetText"]')).toHaveValue("Principiul spiritual");

  for (let step = 0; step < 3; step += 1) {
    await page.getByRole("button", { name: "Advance workflow" }).click();
    await page.waitForLoadState("networkidle");
  }
  await expect(page.getByText("IN REVIEW", { exact: true })).toBeVisible();

  await page.goto(`/review?documentId=${encodeURIComponent(documentId!)}&segmentId=${encodeURIComponent(segmentId!)}`);
  await page.locator('textarea[name="proposedText"]').fill("Principiul spiritual revizuit");
  await page.locator('textarea[name="explanation"]').fill("Corecție editorială umană verificată.");
  await page.getByRole("button", { name: "Propose correction" }).click();
  await expect(page.getByText("Principiul spiritual revizuit", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Accept proposal" }).click();
  await expect(page.getByText("Principiul spiritual revizuit", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Approve corrected translation" }).click();
  await expect(
    page.getByLabel("Parallel translation and review").getByText("APPROVED", { exact: true })
  ).toBeVisible();

  const sessionCookie = (await context.cookies()).find((cookie) => cookie.name === "laborator_session_token");
  expect(sessionCookie?.value).toBeTruthy();
  const readyResponse = await page.request.post(`${apiBaseUrl}/workflow/ready-for-export`, {
    data: { documentId, projectId },
    headers: { Authorization: `Bearer ${sessionCookie!.value}` }
  });
  expect(readyResponse.ok()).toBe(true);
  await page.reload();
  await expect(
    page
      .getByLabel("Parallel translation and review")
      .getByText("READY FOR EXPORT", { exact: true })
  ).toBeVisible();

  const forgedTenantResponse = await page.request.get(`${apiBaseUrl}/documents`, {
    headers: {
      Authorization: `Bearer ${sessionCookie!.value}`,
      "x-organization-id": "forged-other-tenant"
    }
  });
  expect(forgedTenantResponse.ok()).toBe(true);
  const tenantDocuments = await forgedTenantResponse.json();
  const scopedDocuments = tenantDocuments as Array<{ id: string; organizationId: string }>;
  expect(scopedDocuments.some((document) => document.id === documentId)).toBe(true);
  expect(scopedDocuments.every((document) => document.organizationId !== "forged-other-tenant")).toBe(true);

  const anonymous = await playwrightRequest.newContext();
  try {
    const anonymousResponse = await anonymous.get(`${apiBaseUrl}/documents`);
    expect(anonymousResponse.status()).toBe(401);
  } finally {
    await anonymous.dispose();
  }

  await page.setViewportSize({ height: 844, width: 390 });
  await page.reload();
  await expect(page.locator("main")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
