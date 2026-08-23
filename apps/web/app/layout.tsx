import type { Metadata } from "next";

import { AppShell } from "../components/layout/app-shell";
import { createUiTranslator } from "../lib/ui-i18n";
import { getRequestUiLocale } from "../lib/request-ui-locale";
import { getWorkspaceNavigation, getWorkspacePreferences } from "../lib/workspace-client";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const ui = createUiTranslator(await getRequestUiLocale());

  return {
    title: "Laboratorul Editurii",
    description: ui.t("metadata.description")
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navigationResult, preferencesResult] = await Promise.all([
    getWorkspaceNavigation(),
    getWorkspacePreferences()
  ]);
  const language = await getRequestUiLocale(
    preferencesResult.data?.platformLanguage ?? preferencesResult.data?.language
  );
  const theme = preferencesResult.data?.themeMetadata?.theme ?? "system";

  return (
    <html data-theme={theme} lang={language}>
      <body>
        <AppShell
          navigation={navigationResult.data ?? []}
          navigationError={navigationResult.error}
          platformLanguage={language}
          preferences={preferencesResult.data}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
