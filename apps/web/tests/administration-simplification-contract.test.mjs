import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

test("Administration routes use the simplified configuration center", () => {
  const adminRoute = readSource("app/admin/page.tsx");
  const administrationRoute = readSource("app/administration/page.tsx");

  assert.match(adminRoute, /AdministrationPage/);
  assert.match(administrationRoute, /AdministrationPage/);
  assert.doesNotMatch(adminRoute, /CoreModuleScreen|getCoreModuleShell/);
  assert.equal(existsSync(join(webRoot, "app/admin/settings/page.tsx")), false);
});

test("Administration has exactly the approved two-level configuration sections", () => {
  const page = readSource("components/pages/administration-page.tsx");

  assert.match(page, /ADMIN_NAVIGATION_LEVELS = 2/);

  for (const section of [
    "Organizație",
    "Utilizatori",
    "Roluri și permisiuni",
    "Agenți AI",
    "Resurse lingvistice",
    "Șabloane editoriale",
    "Publicare și distribuție",
    "Securitate",
    "Audit și backup",
    "Integrări",
    "Sistem"
  ]) {
    assert.match(page, new RegExp(section));
  }

  for (const setting of [
    "date organizație",
    "logo",
    "branding",
    "fus orar",
    "monedă",
    "invitații",
    "echipe",
    "grupuri",
    "politici Need-to-Know",
    "acces temporar",
    "modele AI",
    "costuri",
    "limbi",
    "dicționare",
    "glosare",
    "surse aprobate",
    "formate carte",
    "formate revistă",
    "stiluri",
    "ISBN",
    "marketplace",
    "chei API",
    "restaurare",
    "retenție",
    "Email",
    "Cloud",
    "diagnostic",
    "sănătatea platformei"
  ]) {
    assert.match(page, new RegExp(setting, "i"));
  }
});

test("Administration preserves role access auditability reversibility and confirmation rules", () => {
  const page = readSource("components/pages/administration-page.tsx");
  const css = readSource("app/globals.css");

  assert.match(page, /Administrator/);
  assert.match(page, /Vede toate secțiunile/);
  assert.match(page, /Editor/);
  assert.match(page, /Nu intră în Administrare/);
  assert.match(page, /Toate modificările sunt auditate/);
  assert.match(page, /Reversibilitate/);
  assert.match(page, /Nicio modificare critică fără confirmare/);
  assert.match(page, /Confirm critical change/);
  assert.match(page, /Button disabled/);
  assert.match(page, /Need-to-Know/);
  assert.match(css, /\.admin-section-grid/);
  assert.match(css, /\.admin-config-card-critical/);
});
