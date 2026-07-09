import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");

function readSource(path) {
  return readFileSync(join(webRoot, path), "utf8");
}

test("UI internationalization follows platformLanguage and keeps editorial languages separate", () => {
  const i18n = readSource("lib/ui-i18n.ts");
  const rootLayout = readSource("app/layout.tsx");
  const appShell = readSource("components/layout/app-shell.tsx");
  const topNav = readSource("components/layout/top-nav.tsx");
  const navigation = readSource("components/layout/navigation.ts");

  assert.match(i18n, /resolveUiLocale/);
  assert.match(i18n, /normalized === "ro" \|\| normalized\.startsWith\("ro-"\)/);
  assert.match(i18n, /return "en"/);
  assert.match(i18n, /"label\.dashboard": "Dashboard"/);
  assert.match(i18n, /"label\.dashboard": "Panou de control"/);
  assert.match(i18n, /"label\.productionPipeline": "Editorial Production Pipeline"/);
  assert.match(i18n, /"label\.productionPipeline": "Linie de producție editorială"/);
  assert.match(i18n, /"label\.translation": "Traducere"/);
  assert.match(i18n, /"label\.rights": "Drepturi"/);
  assert.match(i18n, /"label\.marketplace": "Piață agenți"/);

  assert.match(rootLayout, /preferencesResult\.data\?\.platformLanguage/);
  assert.match(appShell, /preferences\?\.platformLanguage/);
  assert.match(topNav, /preferences\?\.platformLanguage/);
  assert.match(navigation, /platformLanguage/);

  assert.doesNotMatch(i18n, /setOriginalLanguage|setAuthoringLanguage|setTargetLanguage/);
});

test("main workspace surfaces use translated UI labels instead of changing content language", () => {
  const dashboard = readSource("components/pages/dashboard-page.tsx");
  const pipeline = readSource("components/pages/editorial-pipeline-page.tsx");
  const distribution = readSource("components/pages/distribution-center-page.tsx");

  assert.match(dashboard, /createUiTranslator\(dashboard\?\.preferences\.platformLanguage/);
  assert.match(dashboard, /translateRouteLabel\(route\.href/);
  assert.match(pipeline, /translatePipelineStepTitle/);
  assert.match(pipeline, /ui\.t\("action\.continue"\)/);
  assert.match(pipeline, /ui\.t\("action\.openWorkspace"\)/);
  assert.match(distribution, /ui\.t\("distribution\.title"\)/);
  assert.match(distribution, /ui\.t\("action\.publish"\)/);
});
