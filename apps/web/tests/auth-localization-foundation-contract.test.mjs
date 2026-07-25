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

test("auth frontend routes and pages exist", () => {
  for (const route of [
    "app/login/page.tsx",
    "app/reset-password/page.tsx",
    "app/change-password/page.tsx",
    "app/profile/page.tsx",
    "app/sessions/page.tsx"
  ]) {
    assert.match(readSource(route), /Auth|Profile|Session/);
  }

  assert.match(readSource("components/pages/auth-login-page.tsx"), /loginAction/);
  assert.match(readSource("components/pages/auth-reset-password-page.tsx"), /requestPasswordResetAction/);
  assert.match(readSource("components/pages/auth-change-password-page.tsx"), /changePasswordAction/);
  assert.match(readSource("components/pages/user-profile-page.tsx"), /updateProfileAction/);
  assert.match(readSource("components/pages/session-management-page.tsx"), /revokeSessionAction/);
});

test("auth client uses public auth endpoints only for login reset and email verification", () => {
  const client = readSource("lib/auth-client.ts");
  const actions = readSource("lib/auth-actions.ts");

  assert.match(client, /apiPostPublic<LoginResult/);
  assert.match(client, /"\/auth\/login"/);
  assert.match(client, /"\/auth\/password\/reset"/);
  assert.match(client, /"\/auth\/email\/verify"/);
  assert.match(client, /apiPost<AuthMutationResult/);
  assert.match(actions, /SESSION_COOKIE_NAME/);
  assert.match(actions, /httpOnly: true/);
  assert.match(actions, /sameSite: "lax"/);
  assert.doesNotMatch(client + actions, /x-user-id|x-organization-id|x-user-roles/);
});

test("middleware protects authenticated application routes", () => {
  const middleware = readSource("middleware.ts");

  assert.match(middleware, /SESSION_COOKIE_NAME/);
  assert.match(middleware, /PUBLIC_PATHS/);
  assert.match(middleware, /"\/login"/);
  assert.match(middleware, /"\/reset-password"/);
  assert.match(middleware, /NextResponse\.redirect\(loginUrl\)/);
  assert.match(middleware, /pathname = "\/dashboard"/);
});

test("UI localization supports seven platform languages for auth and navigation labels", () => {
  const i18n = readSource("lib/ui-i18n.ts");

  assert.match(i18n, /export type UiLocale = "en" \| "ro" \| "es" \| "fr" \| "pt" \| "it" \| "de"/);

  for (const locale of ["ro", "es", "fr", "pt", "it", "de"]) {
    assert.match(i18n, new RegExp(`return "${locale}"`));
  }

  for (const key of [
    "auth.loginTitle",
    "auth.resetPasswordTitle",
    "auth.changePasswordTitle",
    "auth.profileTitle",
    "auth.sessionsTitle",
    "role.translator",
    "role.proofreader",
    "role.narrator"
  ]) {
    assert.match(i18n, new RegExp(`"${key}"`));
  }
});

test("auth pages use i18n instead of hardcoded visible labels", () => {
  for (const component of [
    "components/pages/auth-login-page.tsx",
    "components/pages/auth-reset-password-page.tsx",
    "components/pages/auth-change-password-page.tsx",
    "components/pages/user-profile-page.tsx",
    "components/pages/session-management-page.tsx"
  ]) {
    const source = readSource(component);
    assert.match(source, /createUiTranslator/);
    assert.match(source, /ui\.t\(/);
  }
});
