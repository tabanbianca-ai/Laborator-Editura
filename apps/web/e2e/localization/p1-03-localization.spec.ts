import { expect, test } from "@playwright/test";

const locales = [
  "ro-RO",
  "en-US",
  "en-GB",
  "es-ES",
  "fr-FR",
  "pt-PT",
  "pt-BR",
  "it-IT",
  "de-DE"
] as const;

type Locale = (typeof locales)[number];

const expected: Record<Locale, { description: string; login: string; reset: string }> = {
  "ro-RO": {
    description: "Spațiu profesional de producție editorială",
    login: "Autentificare",
    reset: "Resetare parolă"
  },
  "en-US": {
    description: "Professional editorial production workspace",
    login: "Sign in",
    reset: "Reset password"
  },
  "en-GB": {
    description: "Professional editorial production workspace",
    login: "Sign in",
    reset: "Reset password"
  },
  "es-ES": {
    description: "Espacio profesional de producción editorial",
    login: "Iniciar sesión",
    reset: "Restablecer contraseña"
  },
  "fr-FR": {
    description: "Espace professionnel de production éditoriale",
    login: "Connexion",
    reset: "Réinitialiser le mot de passe"
  },
  "pt-PT": {
    description: "Espaço profissional de produção editorial",
    login: "Iniciar sessão",
    reset: "Redefinir palavra-passe"
  },
  "pt-BR": {
    description: "Espaço profissional de produção editorial",
    login: "Iniciar sessão",
    reset: "Redefinir palavra-passe"
  },
  "it-IT": {
    description: "Spazio professionale di produzione editoriale",
    login: "Accesso",
    reset: "Reimposta password"
  },
  "de-DE": {
    description: "Professioneller Arbeitsbereich für redaktionelle Produktion",
    login: "Anmeldung",
    reset: "Passwort zurücksetzen"
  }
};

for (const locale of locales) {
  test(`${locale} public authentication surfaces are localized without leakage`, async ({
    page
  }) => {
    await page.goto(`/login?locale=${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      expected[locale].description
    );
    await expect(
      page.getByRole("heading", { level: 2, name: expected[locale].login }).first()
    ).toBeVisible();
    await expect(page.locator("#platform-locale")).toHaveValue(locale);
    await expect(page.locator("body")).not.toContainText(
      /\b(?:auth|label|nav|error)\.[a-zA-Z.]+\b/
    );

    await page.goto("/reset-password");
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(
      page.getByRole("heading", { level: 2, name: expected[locale].reset }).first()
    ).toBeVisible();
    await expect(page.locator("#platform-locale")).toHaveValue(locale);
  });

  test(`${locale} is preserved when a protected route redirects to login`, async ({
    page
  }) => {
    await page.goto(`/dashboard?locale=${locale}`);
    await expect(page).toHaveURL(/\/login\?returnTo=/);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(
      page.getByRole("heading", { level: 2, name: expected[locale].login }).first()
    ).toBeVisible();
  });
}

test("language switcher changes locale and document metadata", async ({ page }) => {
  await page.goto("/login?locale=ro-RO");
  await page.locator("#platform-locale").selectOption("en-GB");
  await page.getByRole("button", { name: "Aplică limba" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");
  await expect(
    page.getByRole("heading", { level: 2, name: "Sign in" }).first()
  ).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    expected["en-GB"].description
  );
});

test("unsupported locale fails closed to the primary locale", async ({ page }) => {
  await page.goto("/login?locale=xx-XX");
  await expect(page).toHaveURL(/localeError=unsupported/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ro-RO");
  await expect(
    page.getByRole("heading", { level: 2, name: "Autentificare" }).first()
  ).toBeVisible();
});

test("authenticated localization crawl covers common navigation and forms", async ({
  baseURL,
  context,
  page
}) => {
  const sessionToken = process.env.P1_03_SESSION_TOKEN;
  const requireAuthentication = process.env.P1_03_REQUIRE_AUTH === "true";

  if (!sessionToken) {
    expect(
      requireAuthentication,
      "P1_03_SESSION_TOKEN is required for live authenticated evidence"
    ).toBe(false);
    test.skip(
      true,
      "No authenticated staging session token was supplied for the local crawl."
    );
  }

  const origin = new URL(baseURL ?? "http://127.0.0.1:3000");
  await context.addCookies([
    {
      name: "laborator_session_token",
      value: sessionToken!,
      domain: origin.hostname,
      path: "/",
      httpOnly: true,
      secure: origin.protocol === "https:"
    }
  ]);

  for (const locale of locales) {
    await page.goto(`/dashboard?locale=${locale}`);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("#platform-locale")).toHaveValue(locale);

    for (const path of ["/projects/new", "/pipeline", "/distribution"]) {
      await page.goto(path);
      await expect(page).not.toHaveURL(/\/login/);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("body")).not.toContainText(
        /\b(?:auth|label|nav|error)\.[a-zA-Z.]+\b/
      );
    }
  }
});
