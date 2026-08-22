import { cookies } from "next/headers";

import { resolveUiLocale, type UiLocale } from "./ui-i18n";

export const UI_LOCALE_COOKIE_NAME = "laborator_ui_locale";

export async function getUiLocaleCookie(): Promise<UiLocale | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(UI_LOCALE_COOKIE_NAME)?.value;

  return value ? resolveUiLocale(value) : null;
}

export async function getRequestUiLocale(fallback?: string | null): Promise<UiLocale> {
  return (await getUiLocaleCookie()) ?? resolveUiLocale(fallback);
}
